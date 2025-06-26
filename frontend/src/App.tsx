import { useState } from 'react'

function App() {
  const [inviteLink, setInviteLink] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Invite link submitted:', inviteLink)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-800 flex items-center justify-center gap-3">
            🍽️ Food Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            Join your friends for collaborative cooking adventures
          </p>
        </div>

        {/* Main invite section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">Join a Food Journey</h2>
            <p className="text-gray-600">
              Enter your invite link to join a dinner party, road trip, or cooking collaboration!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={inviteLink}
                onChange={(e) => setInviteLink(e.target.value)}
                placeholder="Paste your invite link here..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-gray-700 placeholder-gray-400"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Join Journey
              </button>
            </div>
          </form>

          {/* Features grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
            <div className="text-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl">🎉</div>
              <div className="text-sm font-medium text-gray-700">Dinner Parties</div>
            </div>
            <div className="text-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl">🚗</div>
              <div className="text-sm font-medium text-gray-700">Road Trips</div>
            </div>
            <div className="text-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl">🤝</div>
              <div className="text-sm font-medium text-gray-700">Group Recipes</div>
            </div>
            <div className="text-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl">📸</div>
              <div className="text-sm font-medium text-gray-700">Fridge Sharing</div>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="text-center text-gray-500 text-sm space-y-2">
          <p>✨ Discover new recipes together • 🏆 Earn PC Optimum points • 🛒 Smart No Name suggestions</p>
        </div>
      </div>
    </div>
  )
}

export default App
