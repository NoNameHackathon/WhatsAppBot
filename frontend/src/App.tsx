import { useState } from 'react'
import FloatingIcon from './FloatingIcon'
import {
  ShoppingCart,
  Apple,
  Coffee,
  Croissant,
  Fish,
  Milk,
  Pizza,
  Sandwich,
  ShoppingBag,
  Utensils,
  Wheat,
  Beef
} from 'lucide-react'

function App() {
  const [inviteLink, setInviteLink] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Invite link submitted:', inviteLink)
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-yellow-300 to-green-400 relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(to bottom right, #fde047, #4ade80)',
        minHeight: '100vh'
      }}
    >
      {/* Floating Icons - Grocery Themed */}
      <FloatingIcon
        icon={<ShoppingCart />}
        position={{ top: '15%', left: '10%' }}
        size="md"
      />
      <FloatingIcon
        icon={<Apple />}
        position={{ top: '8%', right: '15%' }}
        size="lg"
      />
      <FloatingIcon
        icon={<Coffee />}
        position={{ top: '45%', left: '5%' }}
        size="md"
      />
      <FloatingIcon
        icon={<Utensils />}
        position={{ bottom: '25%', left: '8%' }}
        size="lg"
      />
      <FloatingIcon
        icon={<Croissant />}
        position={{ bottom: '35%', left: '20%' }}
        size="sm"
      />
      <FloatingIcon
        icon={<ShoppingBag />}
        position={{ top: '35%', right: '8%' }}
        size="md"
      />
      <FloatingIcon
        icon={<Fish />}
        position={{ bottom: '45%', right: '15%' }}
        size="md"
      />
      <FloatingIcon
        icon={<Pizza />}
        position={{ bottom: '15%', right: '25%' }}
        size="lg"
      />
      <FloatingIcon
        icon={<Milk />}
        position={{ bottom: '30%', right: '5%' }}
        size="sm"
      />
      <FloatingIcon
        icon={<Sandwich />}
        position={{ top: '60%', right: '12%' }}
        size="md"
      />
      <FloatingIcon
        icon={<Wheat />}
        position={{ top: '25%', left: '25%' }}
        size="sm"
      />
      <FloatingIcon
        icon={<Beef />}
        position={{ bottom: '8%', left: '35%' }}
        size="sm"
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* WhatsApp Logo Area - Replace with input */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            {/* WhatsApp Phone Icon */}
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-green-500">
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.690"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-light text-white">Food Journey</h1>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-full p-2 shadow-lg">
              <input
                type="text"
                value={inviteLink}
                onChange={(e) => setInviteLink(e.target.value)}
                placeholder="Enter your invite link..."
                className="flex-1 px-4 py-3 rounded-full border-0 focus:outline-none text-gray-700 placeholder-gray-400"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-full transition-colors whitespace-nowrap"
              >
                Join Journey
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
