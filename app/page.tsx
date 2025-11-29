import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">
              Founder&apos;s Note
            </span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your AI-Powered
            <br />
            <span className="text-blue-600">Executive Brief</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Transform daily chaos into structured clarity. Get personalized
            strategic insights, organized schedules, and AI coaching tailored
            for startup founders.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
            >
              Start Free Trial
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-white text-gray-700 text-lg font-medium rounded-lg hover:bg-gray-50 border border-gray-300 shadow-md hover:shadow-lg transition-all"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Daily Executive Brief
            </h3>
            <p className="text-gray-600">
              Wake up to a personalized note organizing your day with clarity,
              priorities, and strategic insights.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              AI Coaching
            </h3>
            <p className="text-gray-600">
              Get thought-provoking questions and strategic recommendations
              based on your patterns.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Pattern Detection
            </h3>
            <p className="text-gray-600">
              Surface hidden patterns in your time, energy, and decisions to
              work smarter.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Smart Scheduling
            </h3>
            <p className="text-gray-600">
              Organize your day into maker and manager blocks based on your
              energy patterns.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Decision Support
            </h3>
            <p className="text-gray-600">
              Apply proven frameworks to high-stakes decisions. Track outcomes
              and learn.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Integrations
            </h3>
            <p className="text-gray-600">
              Connect Google Calendar, Notion, Linear, and more to centralize
              your context.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Founder Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join founders who have gained clarity and strategic advantage.
          </p>
          <Link
            href="/sign-up"
            className="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-medium rounded-lg hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all"
          >
            Start Your Free Trial
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>© 2025 Founder&apos;s Note. Built for startup founders.</p>
        </div>
      </footer>
    </div>
  );
}
