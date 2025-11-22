import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { authAPI, setToken } from '../lib/api';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        department: formData.department || 'General'
      });

      if (response.success && response.data) {
        const data = response.data as any;
        setToken(data.token);
        navigate('/dashboard');
      } else {
        setError(response.error?.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-6 py-12 relative overflow-hidden">
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
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400">Start managing your inventory today</p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="username"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-[#1F1F1F] border-2 border-gray-800 rounded-xl focus:border-[#FF8C00] focus:outline-none transition-colors text-white placeholder-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  placeholder="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 bg-[#1F1F1F] border-2 border-gray-800 rounded-xl focus:border-[#FF8C00] focus:outline-none transition-colors text-white placeholder-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="password"
                  placeholder="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 bg-[#1F1F1F] border-2 border-gray-800 rounded-xl focus:border-[#FF8C00] focus:outline-none transition-colors text-white placeholder-gray-500"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 mt-1 text-[#FF8C00] rounded focus:ring-[#FF8C00] focus:ring-offset-gray-800 bg-[#1F1F1F] border-gray-800" />
              <span className="text-sm text-gray-400">
                I agree to the{' '}
                <a href="#" className="text-[#FF8C00] hover:text-[#FF9500] transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#FF8C00] hover:text-[#FF9500] transition-colors">
                  Privacy Policy
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FF8C00] text-white rounded-xl hover:bg-[#FF9500] hover:shadow-xl hover:shadow-[#FF8C00]/30 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-[#FF8C00] hover:text-[#FF9500] font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
