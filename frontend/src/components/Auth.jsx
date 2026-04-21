import { useState } from 'react'
import axios from 'axios'

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = isLogin
        ? 'http://localhost:3000/api/auth/login'
        : 'http://localhost:3000/api/auth/register'

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData

      const res = await axios.post(url, payload)
      localStorage.setItem('token', res.data.token)
      onLogin(res.data.username)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='h-screen w-full bg-gray-950 flex items-center justify-center'>
      <div className='bg-gray-800 p-8 rounded-xl w-96'>
        <h1 className='text-2xl font-bold text-white mb-6 text-center'>
          {isLogin ? 'Login 🔑' : 'Register ✍️'}
        </h1>

        {error && (
          <p className='text-red-400 text-sm mb-4 text-center'>{error}</p>
        )}

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {!isLogin && (
            <input
              type='text'
              placeholder='Username'
              className='p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400'
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          )}
          <input
            type='email'
            placeholder='Email'
            className='p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400'
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type='password'
            placeholder='Password'
            className='p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-400'
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button
            type='submit'
            disabled={loading}
            className='p-3 bg-amber-400 rounded-lg text-gray-950 font-bold hover:bg-amber-300 transition'
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className='text-gray-400 text-sm text-center mt-4'>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className='text-amber-400 ml-1 hover:underline'
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </main>
  )
}

export default Auth