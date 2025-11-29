import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface DailyNoteInput {
  founderName: string
  company: string
  date: string
  calendarEvents: Array<{
    title: string
    startTime: string
    endTime: string
    type: string
    attendees?: number
  }>
  tasks: Array<{
    title: string
    priority: string
    dueDate?: string
    status: string
    context: string
  }>
  metrics?: {
    runwayMonths?: number
    mrr?: number
    users?: number
    burnRate?: number
    teamSize?: number
  }
  recentDecisions?: Array<{
    title: string
    status: string
  }>
  recentWins?: string[]
  recentProblems?: string[]
}

export interface DailyNoteOutput {
  executiveSummary: {
    theme: string
    criticalPath: string
    keyMetrics: any
  }
  schedule: Array<{
    time: string
    activity: string
    type: string
    priority: string
    energyLevel: string
  }>
  decisions: {
    highStakes: Array<any>
    lowStakes: Array<any>
  }
  strategicGuidance: {
    coachingPrompt: string
    recommendations: Array<any>
    recommendedResources: Array<any>
  }
  problems: Array<any>
  wins: string[]
}

export async function generateDailyNote(
  input: DailyNoteInput
): Promise<DailyNoteOutput> {
  const prompt = buildDailyNotePrompt(input)

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are an expert executive coach and AI assistant for startup founders. Your role is to:
1. Organize their day with clarity and structure
2. Surface strategic insights from their data
3. Ask thought-provoking coaching questions
4. Help prioritize decisions
5. Detect patterns in their behavior

Generate a comprehensive daily founder's note that is:
- Actionable and specific (no generic advice)
- Strategic (connects daily actions to long-term goals)
- Insightful (surfaces patterns and opportunities)
- Concise (respects the founder's time)
- Supportive (acts as a mentor, not just a tool)

Return your response as valid JSON matching the DailyNoteOutput schema.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 3000,
  })

  const content = response.choices[0].message.content
  if (!content) {
    throw new Error('No response from OpenAI')
  }

  return JSON.parse(content) as DailyNoteOutput
}

function buildDailyNotePrompt(input: DailyNoteInput): string {
  return `Generate a daily founder's note for ${input.founderName} at ${input.company}.

**Date**: ${input.date}

**Today's Calendar** (${input.calendarEvents.length} events):
${input.calendarEvents
  .map(
    (event) =>
      `- ${event.startTime} - ${event.endTime}: ${event.title} [${event.type}]${
        event.attendees ? ` (${event.attendees} attendees)` : ''
      }`
  )
  .join('\n')}

**Active Tasks** (${input.tasks.length} tasks):
${input.tasks
  .map(
    (task) =>
      `- [${task.status}] ${task.title} - Priority: ${task.priority}, Context: ${task.context}${
        task.dueDate ? `, Due: ${task.dueDate}` : ''
      }`
  )
  .join('\n')}

${
  input.metrics
    ? `**Company Metrics**:
- Runway: ${input.metrics.runwayMonths} months
- MRR: $${input.metrics.mrr?.toLocaleString() || 'N/A'}
- Users: ${input.metrics.users?.toLocaleString() || 'N/A'}
- Burn Rate: $${input.metrics.burnRate?.toLocaleString() || 'N/A'}/month
- Team Size: ${input.metrics.teamSize || 'N/A'}
`
    : ''
}

${
  input.recentWins && input.recentWins.length > 0
    ? `**Recent Wins**:
${input.recentWins.map((win) => `- ${win}`).join('\n')}
`
    : ''
}

${
  input.recentProblems && input.recentProblems.length > 0
    ? `**Recent Problems**:
${input.recentProblems.map((problem) => `- ${problem}`).join('\n')}
`
    : ''
}

${
  input.recentDecisions && input.recentDecisions.length > 0
    ? `**Recent Decisions**:
${input.recentDecisions.map((decision) => `- ${decision.title} [${decision.status}]`).join('\n')}
`
    : ''
}

Generate a complete daily note with:
1. **Executive Summary**: Today's theme, critical path, and key metrics snapshot
2. **Schedule**: Organized time blocks with maker/manager categorization
3. **Decisions**: Surface any decisions that need to be made today
4. **Strategic Guidance**: Coaching prompt and recommendations based on patterns
5. **Problems**: Any issues to address (from recent problems or calendar analysis)
6. **Wins**: Celebrate recent wins and add any anticipated wins for today

Return as JSON with the following structure:
{
  "executiveSummary": {
    "theme": "string",
    "criticalPath": "string",
    "keyMetrics": {}
  },
  "schedule": [],
  "decisions": {
    "highStakes": [],
    "lowStakes": []
  },
  "strategicGuidance": {
    "coachingPrompt": "string",
    "recommendations": [],
    "recommendedResources": []
  },
  "problems": [],
  "wins": []
}`
}

export async function generateStrategicInsight(
  context: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are a strategic advisor for startup founders. Generate insightful, thought-provoking coaching questions or recommendations based on their situation.',
      },
      {
        role: 'user',
        content: `Based on this context: ${context}\n\nGenerate one strategic insight or coaching question that helps the founder think more deeply about their business.`,
      },
    ],
    temperature: 0.8,
    max_tokens: 200,
  })

  return response.choices[0].message.content || 'No insight generated.'
}

export async function detectPatterns(
  data: {
    calendarEvents: Array<{ type: string; duration: number }>
    tasks: Array<{ status: string; context: string }>
    decisions: Array<{ stakes: string; madeAt?: Date }>
  },
  timeframe: string
): Promise<
  Array<{
    type: string
    description: string
    recommendation: string
  }>
> {
  const prompt = `Analyze this founder's data from ${timeframe}:

Calendar Events:
${data.calendarEvents.map((e) => `- ${e.type}: ${e.duration} minutes`).join('\n')}

Tasks:
${data.tasks.map((t) => `- [${t.status}] ${t.context}`).join('\n')}

Decisions:
${data.decisions.map((d) => `- ${d.stakes} stakes${d.madeAt ? `, made ${d.madeAt}` : ' (pending)'}`).join('\n')}

Detect patterns in:
1. Time allocation (maker vs manager time)
2. Energy management (when are they most productive?)
3. Decision patterns (what are they avoiding?)
4. Focus patterns (context switching frequency)

Return as JSON array with format:
[
  {
    "type": "energy" | "meeting" | "decision" | "focus",
    "description": "what you observed",
    "recommendation": "actionable suggestion"
  }
]`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are an AI that detects behavioral patterns in founder data. Be specific and actionable.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.5,
    max_tokens: 800,
  })

  const content = response.choices[0].message.content
  if (!content) return []

  const result = JSON.parse(content)
  return result.patterns || []
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })

  return response.data[0].embedding
}
