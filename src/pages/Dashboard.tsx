import { motion } from 'framer-motion';
import { Package, AlertTriangle, TruckIcon, Send, ArrowLeftRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { dashboardAPI } from '../lib/api';

interface Operation {
  id: string;
  type: 'Receipt' | 'Delivery' | 'Transfer' | 'Adjustment';
  products: string;
  source: string;
  destination: string;
  status: 'Draft' | 'Waiting' | 'Ready' | 'Done' | 'Canceled';
  date: string;
}

export default function Dashboard() {
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [kpis, setKpis] = useState<any>(null);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [kpisRes, opsRes] = await Promise.all([
        dashboardAPI.getKPIs(),
        dashboardAPI.getOperations(20)
      ]);

      if (kpisRes.success && kpisRes.data) {
        setKpis(kpisRes.data);
      }

      if (opsRes.success && opsRes.data) {
        setOperations(opsRes.data as Operation[]);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const kpiData = kpis ? [
    { title: 'Total Products', value: kpis.totalProducts.toString(), icon: Package, color: 'from-blue-500 to-blue-600' },
    { title: 'Low Stock Items', value: kpis.lowStockItems.toString(), subValue: `${kpis.outOfStockItems} Out of Stock`, icon: AlertTriangle, color: 'from-red-500 to-red-600' },
    { title: 'Pending Receipts', value: kpis.pendingReceipts.toString(), icon: TruckIcon, color: 'from-green-500 to-green-600' },
    { title: 'Pending Deliveries', value: kpis.pendingDeliveries.toString(), icon: Send, color: 'from-purple-500 to-purple-600' },
    { title: 'Internal Transfers', value: kpis.internalTransfers.toString(), icon: ArrowLeftRight, color: 'from-orange-500 to-orange-600' },
  ] : [];

  const getStatusColor = (status: string) => {
    const colors = {
      Draft: 'bg-gray-100 text-gray-700',
      Waiting: 'bg-yellow-100 text-yellow-700',
      Ready: 'bg-blue-100 text-blue-700',
      Done: 'bg-green-100 text-green-700',
      Canceled: 'bg-red-100 text-red-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      Receipt: 'bg-green-50 text-green-700 border-green-200',
      Delivery: 'bg-purple-50 text-purple-700 border-purple-200',
      Transfer: 'bg-orange-50 text-orange-700 border-orange-200',
      Adjustment: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const filteredOperations = operations.filter(op => {
    const typeMatch = filterType === 'All' || op.type === filterType;
    const statusMatch = filterStatus === 'All' || op.status === filterStatus;
    return typeMatch && statusMatch;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-slate-600">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                  <kpi.icon className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-sm text-slate-600 mb-1">{kpi.title}</h3>
              <p className="text-3xl font-bold text-slate-900">{kpi.value}</p>
              {kpi.subValue && (
                <p className="text-xs text-red-600 mt-1">{kpi.subValue}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Filters</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-600 mb-2 block">Document Type</label>
              <div className="flex flex-wrap gap-2">
                {['All', 'Receipt', 'Delivery', 'Transfer', 'Adjustment'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filterType === type
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-600 mb-2 block">Status</label>
              <div className="flex flex-wrap gap-2">
                {['All', 'Draft', 'Waiting', 'Ready', 'Done', 'Canceled'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filterStatus === status
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Operations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Recent Operations</h3>
            <p className="text-sm text-slate-600 mt-1">
              Showing {filteredOperations.length} of {operations.length} operations
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Document ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Products</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Source</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Destination</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredOperations.map((op, index) => (
                  <motion.tr
                    key={op.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{op.id}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(op.type)}`}>
                        {op.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{op.products}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{op.source}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{op.destination}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(op.status)}`}>
                        {op.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{op.date}</td>
                    <td className="px-6 py-4">
                      <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
