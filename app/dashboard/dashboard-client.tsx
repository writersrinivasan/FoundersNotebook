'use client'

import { useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import { formatDate, formatTime } from '@/lib/utils'

interface DashboardClientProps {
  founder: any
  dailyNote: any
  insights: any[]
  tasks: any[]
  todayEvents: any[]
}

export default function DashboardClient({
  founder,
  dailyNote,
  insights,
  tasks,
  todayEvents,
}: DashboardClientProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateNote = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/daily-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: new Date().toISOString() }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate daily note')
      }

      // Reload the page to show the new note
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Founder's Note
              </h1>
              <p className="text-sm text-gray-500">
                {formatDate(new Date())} • {founder.company || 'Your Company'}
              </p>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Daily Note Section */}
        {!dailyNote ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Daily Note Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Generate your daily note to get started with today's structured
              plan, insights, and strategic guidance.
            </p>
            <button
              onClick={handleGenerateNote}
              disabled={isGenerating}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Generate Today\'s Note'}
            </button>
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>
        ) : (
          <div className="space-y-6 mb-8">
            {/* Executive Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                📋 Executive Summary
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Today's Theme
                  </p>
                  <p className="text-lg text-gray-900">
                    {(dailyNote.executiveSummary as any)?.theme ||
                      'No theme set'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Critical Path
                  </p>
                  <p className="text-gray-900">
                    {(dailyNote.executiveSummary as any)?.criticalPath ||
                      'No critical path defined'}
                  </p>
                </div>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                ⏰ Today's Schedule
              </h2>
              {todayEvents.length > 0 ? (
                <div className="space-y-3">
                  {todayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="text-sm font-medium text-gray-500 min-w-[80px]">
                        {formatTime(event.startTime)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {event.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {event.eventType}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          event.priority === 'P0'
                            ? 'bg-red-100 text-red-700'
                            : event.priority === 'P1'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {event.priority}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No events scheduled for today</p>
              )}
            </div>

            {/* Strategic Guidance */}
            {(dailyNote.strategicGuidance as any)?.coachingPrompt && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6 border border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  💡 Coaching Prompt
                </h2>
                <p className="text-gray-900 italic">
                  "{(dailyNote.strategicGuidance as any).coachingPrompt}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              ✅ Active Tasks
            </h2>
            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {task.context}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            task.priority === 'P0'
                              ? 'bg-red-100 text-red-700'
                              : task.priority === 'P1'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        task.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No active tasks</p>
            )}
          </div>

          {/* Insights */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🔍 Insights
            </h2>
            {insights.length > 0 ? (
              <div className="space-y-3">
                {insights.map((insight) => (
                  <div
                    key={insight.id}
                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          insight.type === 'WARNING'
                            ? 'bg-red-100 text-red-700'
                            : insight.type === 'OPPORTUNITY'
                              ? 'bg-green-100 text-green-700'
                              : insight.type === 'RECOMMENDATION'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {insight.type}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900 mb-1">
                      {insight.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {insight.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No insights yet</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
