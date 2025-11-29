import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Get or create founder profile
  let founder = await prisma.founder.findUnique({
    where: { clerkId: userId },
  })

  if (!founder) {
    // Redirect to onboarding if no profile exists
    redirect('/onboarding')
  }

  // Get today's note if it exists
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayNote = await prisma.dailyNote.findFirst({
    where: {
      founderId: founder.id,
      date: today,
    },
  })

  // Get recent insights
  const insights = await prisma.insight.findMany({
    where: {
      founderId: founder.id,
      dismissedAt: null,
    },
    orderBy: { generatedAt: 'desc' },
    take: 5,
  })

  // Get upcoming tasks
  const tasks = await prisma.task.findMany({
    where: {
      founderId: founder.id,
      status: { in: ['TODO', 'IN_PROGRESS'] },
    },
    orderBy: [{ priority: 'asc' }, { dueDate: 'asc' }],
    take: 10,
  })

  // Get today's calendar events
  const endOfDay = new Date(today)
  endOfDay.setHours(23, 59, 59, 999)

  const todayEvents = await prisma.calendarEvent.findMany({
    where: {
      founderId: founder.id,
      startTime: {
        gte: today,
        lte: endOfDay,
      },
    },
    orderBy: { startTime: 'asc' },
  })

  return (
    <DashboardClient
      founder={founder}
      dailyNote={todayNote}
      insights={insights}
      tasks={tasks}
      todayEvents={todayEvents}
    />
  )
}
