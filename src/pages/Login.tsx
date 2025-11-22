import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { authAPI, setToken } from '../lib/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success && response.data) {
        const data = response.data as any;
        if (data.token) {
          setToken(data.token);
          navigate('/dashboard');
        }
      } else {
        setError(response.error?.message || 'Login failed');
      }
    } catch (err: any) {
      setError('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Orange gradient glow from bottom center */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-t from-[#FF8C00]/30 via-[#FF8C00]/15 to-transparent rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-300 hover:text-[#FF8C00] mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <div className="bg-[#252525] border border-gray-800 rounded-3xl shadow-2xl p-8 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="bg-blue-900/30 border border-blue-800 text-blue-400 px-4 py-3 rounded-xl text-sm">
            <strong>Demo Credentials:</strong><br />
            Email: demo@stockmaster.com<br />
            Password: demo123
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#1F1F1F] border-2 border-gray-800 rounded-xl focus:border-[#FF8C00] focus:outline-none transition-colors text-white placeholder-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#1F1F1F] border-2 border-gray-800 rounded-xl focus:border-[#FF8C00] focus:outline-none transition-colors text-white placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-[#FF8C00] rounded focus:ring-[#FF8C00] focus:ring-offset-gray-800 bg-[#1F1F1F] border-gray-800" />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#FF8C00] hover:text-[#FF9500] transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FF8C00] text-white rounded-xl hover:bg-[#FF9500] hover:shadow-xl hover:shadow-[#FF8C00]/30 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#FF8C00] hover:text-[#FF9500] font-semibold transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
