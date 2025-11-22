import { User, Mail, Building, Calendar } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

export default function Profile() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-1">Manage your account information</p>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
              <User size={48} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Demo User</h2>
              <p className="text-slate-600">Inventory Manager</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                value="demo@stockmaster.com"
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Building size={16} />
                Department
              </label>
              <input
                type="text"
                value="Warehouse Operations"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <User size={16} />
                Role
              </label>
              <input
                type="text"
                value="Inventory Manager"
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Calendar size={16} />
                Member Since
              </label>
              <input
                type="text"
                value="November 2024"
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50"
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Change Password</h3>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium">
              Save Changes
            </button>
            <button className="px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 font-medium">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
