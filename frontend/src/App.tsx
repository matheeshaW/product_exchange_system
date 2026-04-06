import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Swapify</h1>
        <p className="text-gray-600 mb-6">Welcome to the Swapify product swapping platform.</p>
        <div className="space-y-3">
          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
            Login
          </button>
          <button className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition">
            Register
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-6 text-center">Tailwind CSS is working! ✓</p>
      </div>
    </div>
  )
}

export default App
