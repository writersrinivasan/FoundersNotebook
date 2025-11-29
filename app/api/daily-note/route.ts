import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { generateDailyNote } from '@/lib/ai'
import { getStartOfDay } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get founder profile
    const founder = await prisma.founder.findUnique({
      where: { clerkId: userId },
    })

    if (!founder) {
      return NextResponse.json(
        { error: 'Founder profile not found' },
        { status: 404 }
      )
    }

    const { date } = await request.json()
    const targetDate = date ? new Date(date) : new Date()
    const startOfDay = getStartOfDay(targetDate)

    // Check if note already exists
    const existingNote = await prisma.dailyNote.findFirst({
      where: {
        founderId: founder.id,
        date: startOfDay,
      },
    })

    if (existingNote) {
      return NextResponse.json({
        message: 'Daily note already exists',
        note: existingNote,
      })
    }

    // Gather context for AI
    const [calendarEvents, tasks, latestMetrics, recentDecisions, recentWins] =
      await Promise.all([
        // Calendar events for the day
        prisma.calendarEvent.findMany({
          where: {
            founderId: founder.id,
            startTime: {
              gte: startOfDay,
              lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { startTime: 'asc' },
        }),

        // Active tasks
        prisma.task.findMany({
          where: {
            founderId: founder.id,
            status: { in: ['TODO', 'IN_PROGRESS'] },
          },
          orderBy: { priority: 'asc' },
          take: 20,
        }),

        // Latest metrics
        prisma.companyMetrics.findFirst({
          where: { founderId: founder.id },
          orderBy: { date: 'desc' },
        }),

        // Recent decisions (last 7 days)
        prisma.decision.findMany({
          where: {
            founderId: founder.id,
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),

        // Recent wins (last 7 days)
        prisma.journalEntry.findMany({
          where: {
            founderId: founder.id,
            type: 'WIN',
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { date: 'desc' },
          take: 5,
        }),
      ])

    // Prepare AI input
    const aiInput = {
      founderName: founder.name,
      company: founder.company || 'your company',
      date: targetDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      calendarEvents: calendarEvents.map((event) => ({
        title: event.title,
        startTime: event.startTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        endTime: event.endTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        type: event.eventType,
        attendees:
          event.attendees && Array.isArray(event.attendees)
            ? (event.attendees as any[]).length
            : undefined,
      })),
      tasks: tasks.map((task) => ({
        title: task.title,
        priority: task.priority,
        dueDate: task.dueDate?.toLocaleDateString(),
        status: task.status,
        context: task.context,
      })),
      metrics: latestMetrics
        ? {
            runwayMonths: latestMetrics.runwayMonths || undefined,
            mrr: latestMetrics.mrr || undefined,
            users: latestMetrics.users || undefined,
            burnRate: latestMetrics.burnRate || undefined,
            teamSize: latestMetrics.teamSize || undefined,
          }
        : undefined,
      recentDecisions: recentDecisions.map((d) => ({
        title: d.title,
        status: d.madeAt ? 'decided' : 'pending',
      })),
      recentWins: recentWins.map((w) => w.content),
    }

    // Generate daily note with AI
    console.log('Generating daily note with AI...')
    const generatedNote = await generateDailyNote(aiInput)

    // Save to database
    const dailyNote = await prisma.dailyNote.create({
      data: {
        founderId: founder.id,
        date: startOfDay,
        dayType: determineDayType(calendarEvents),
        executiveSummary: generatedNote.executiveSummary,
        schedule: generatedNote.schedule,
        decisions: generatedNote.decisions,
        strategicGuidance: generatedNote.strategicGuidance,
        problems: generatedNote.problems,
        wins: generatedNote.wins,
      },
    })

    return NextResponse.json({
      message: 'Daily note generated successfully',
      note: dailyNote,
    })
  } catch (error) {
    console.error('Error generating daily note:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate daily note',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const founder = await prisma.founder.findUnique({
      where: { clerkId: userId },
    })

    if (!founder) {
      return NextResponse.json(
        { error: 'Founder profile not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    const targetDate = dateParam ? new Date(dateParam) : new Date()
    const startOfDay = getStartOfDay(targetDate)

    const dailyNote = await prisma.dailyNote.findFirst({
      where: {
        founderId: founder.id,
        date: startOfDay,
      },
    })

    if (!dailyNote) {
      return NextResponse.json(
        { error: 'Daily note not found for this date' },
        { status: 404 }
      )
    }

    // Mark as viewed
    if (!dailyNote.viewedAt) {
      await prisma.dailyNote.update({
        where: { id: dailyNote.id },
        data: { viewedAt: new Date() },
      })
    }

    return NextResponse.json({ note: dailyNote })
  } catch (error) {
    console.error('Error fetching daily note:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily note' },
      { status: 500 }
    )
  }
}

function determineDayType(
  events: Array<{ eventType: string }>
): 'BUILD' | 'SELL' | 'THINK' | 'REST' {
  const eventTypes = events.map((e) => e.eventType)

  // Count meeting types
  const externalMeetings = eventTypes.filter((t) =>
    ['EXTERNAL', 'MEETING'].includes(t)
  ).length
  const deepWorkBlocks = eventTypes.filter((t) => t === 'DEEP_WORK').length

  if (events.length === 0 || deepWorkBlocks >= 2) return 'BUILD'
  if (externalMeetings >= 3) return 'SELL'
  if (events.length <= 2) return 'THINK'
  return 'BUILD'
}
