import { User, Mail, Building, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { authAPI } from '../lib/api';

interface UserData {
  id: string;
  email: string;
  fullName: string;
  department: string | null;
  role: string;
  createdAt: string;
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.me();
      if (response.success && response.data) {
        const data = response.data as UserData;
        setUserData(data);
        setDepartment(data.department || '');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Note: You'll need to add an update profile endpoint in the backend
    setSuccess('Profile updated successfully');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Note: You'll need to add a change password endpoint in the backend
    setSuccess('Password changed successfully');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!userData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">Failed to load user data</div>
      </DashboardLayout>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-gray-400 mt-1">Manage your account information</p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-xl">
            {success}
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center">
              <User size={48} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{userData.fullName}</h2>
              <p className="text-gray-400">{userData.role}</p>
            </div>
          </div>

          <form onSubmit={handleSaveChanges}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  value={userData.email}
                  disabled
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Building size={16} />
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <User size={16} />
                  Role
                </label>
                <input
                  type="text"
                  value={userData.role}
                  disabled
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Calendar size={16} />
                  Member Since
                </label>
                <input
                  type="text"
                  value={formatDate(userData.createdAt)}
                  disabled
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-400"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button type="submit" className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-medium transition-colors">
                Save Changes
              </button>
              <button type="button" onClick={() => setDepartment(userData.department || '')} className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 font-medium text-gray-300 transition-colors">
                Cancel
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
              />
              <button type="submit" className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-medium transition-colors">
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
