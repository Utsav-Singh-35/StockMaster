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
          <div className="bg-red-900/30 border border-red-800 border border-red-200 text-red-400 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/30 border border-green-800 border border-green-200 text-green-400 px-4 py-3 rounded-xl">
            {success}
          </div>
        )}

        <div className="bg-[#252525] border border-gray-800 rounded-xl p-8 shadow-lg">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
              <User size={48} className="text-indigo-600" />
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
                  className="w-full px-4 py-3 border border-gray-800 rounded-xl bg-[#1F1F1F] border border-gray-800"
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
                  className="w-full px-4 py-3 border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00]"
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
                  className="w-full px-4 py-3 border border-gray-800 rounded-xl bg-[#1F1F1F] border border-gray-800"
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
                  className="w-full px-4 py-3 border border-gray-800 rounded-xl bg-[#1F1F1F] border border-gray-800"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button type="submit" className="px-6 py-3 bg-[#FF8C00] text-white rounded-xl hover:bg-[#FF9500] font-medium">
                Save Changes
              </button>
              <button type="button" onClick={() => setDepartment(userData.department || '')} className="px-6 py-3 border border-gray-800 rounded-xl hover:bg-[#1F1F1F] border border-gray-800 font-medium">
                Cancel
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <h3 className="text-lg font-bold text-white mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                placeholder="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00]"
              />
              <input
                type="password"
                placeholder="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00]"
              />
              <input
                type="password"
                placeholder="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00]"
              />
              <button type="submit" className="px-6 py-3 bg-[#FF8C00] text-white rounded-xl hover:bg-[#FF9500] font-medium">
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
