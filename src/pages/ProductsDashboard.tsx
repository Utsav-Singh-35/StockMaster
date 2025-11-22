import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, Grid, List, Package, AlertTriangle, TrendingUp, X, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { productsAPI } from '../lib/api';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  totalStock: number;
  reorderLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  locations: { warehouse: string; quantity: number }[];
  lastUpdated: string;
}



export default function ProductsDashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [createFormData, setCreateFormData] = useState({
    sku: '',
    name: '',
    category: '',
    unit: '',
    reorderLevel: '',
    description: ''
  });
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getAll({
        search: searchQuery || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined
      });

      if (response.success && response.data) {
        setProducts(response.data as Product[]);
        
        // Extract unique categories
        const productData = response.data as Product[];
        const uniqueCategories = ['All', ...new Set(productData.map(p => p.category))];
        setCategories(uniqueCategories as string[]);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateLoading(true);

    try {
      const response = await productsAPI.create({
        sku: createFormData.sku,
        name: createFormData.name,
        category: createFormData.category,
        unit: createFormData.unit,
        reorderLevel: parseInt(createFormData.reorderLevel),
        description: createFormData.description || undefined
      });

      if (response.success) {
        setShowCreateModal(false);
        setCreateFormData({
          sku: '',
          name: '',
          category: '',
          unit: '',
          reorderLevel: '',
          description: ''
        });
        fetchProducts(); // Refresh the product list
      } else {
        setCreateError(response.error?.message || 'Failed to create product');
      }
    } catch (error: any) {
      setCreateError(error.message || 'An error occurred');
    } finally {
      setCreateLoading(false);
    }
  };



  const getStatusColor = (status: string) => {
    const colors = {
      'In Stock': 'bg-green-900/30 text-green-400 border-green-800',
      'Low Stock': 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
      'Out of Stock': 'bg-red-900/30 text-red-400 border-red-800',
    };
    return colors[status as keyof typeof colors];
  };

  const getStockIndicator = (product: Product) => {
    if (product.totalStock === 0) return 'bg-red-500';
    if (product.totalStock < product.reorderLevel) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'stock') return b.totalStock - a.totalStock;
      if (sortBy === 'lowStock') return a.totalStock - b.totalStock;
      return 0;
    });

  const toggleRowExpansion = (productId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedRows(newExpanded);
  };

  const lowStockCount = products.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Products</h1>
            <p className="text-gray-400 mt-1">Manage your inventory catalog</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#FF8C00] text-white rounded-xl hover:bg-[#FF9500] shadow-lg hover:shadow-xl transition-all"
          >
            <Plus size={20} />
            Create Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#252525] border border-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Products</p>
                <p className="text-3xl font-bold text-white mt-1">{products.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Package className="text-blue-400" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#252525] border border-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Low Stock Items</p>
                <p className="text-3xl font-bold text-red-400 mt-1">{lowStockCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-900/30 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-red-400" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#252525] border border-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Categories</p>
                <p className="text-3xl font-bold text-white mt-1">{categories.length - 1}</p>
              </div>
              <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Grid className="text-purple-400" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#252525] border border-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Stock Value</p>
                <p className="text-3xl font-bold text-green-400 mt-1">
                  {products.reduce((sum, p) => sum + p.totalStock, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-green-400" size={24} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="bg-[#252525] border border-gray-800 rounded-xl p-6 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search by product name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00] text-white placeholder-gray-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl hover:bg-[#2A2A2A] flex items-center gap-2 text-gray-300"
              >
                <Filter size={20} />
                Filters
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 rounded-xl ${viewMode === 'list' ? 'bg-[#FF8C00] text-white' : 'bg-[#1F1F1F] border border-gray-800 hover:bg-[#2A2A2A] text-gray-300'}`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 rounded-xl ${viewMode === 'grid' ? 'bg-[#FF8C00] text-white' : 'bg-[#1F1F1F] border border-gray-800 hover:bg-[#2A2A2A] text-gray-300'}`}
              >
                <Grid size={20} />
              </button>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 pt-4 border-t border-gray-800"
            >
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === cat
                          ? 'bg-[#FF8C00] text-white'
                          : 'bg-[#1F1F1F] text-gray-300 hover:bg-[#2A2A2A] border border-gray-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Sort By</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSortBy('name')}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      sortBy === 'name' ? 'bg-[#FF8C00] text-white' : 'bg-[#1F1F1F] text-gray-300 border border-gray-800'
                    }`}
                  >
                    A → Z
                  </button>
                  <button
                    onClick={() => setSortBy('stock')}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      sortBy === 'stock' ? 'bg-[#FF8C00] text-white' : 'bg-[#1F1F1F] text-gray-300 border border-gray-800'
                    }`}
                  >
                    Highest Stock
                  </button>
                  <button
                    onClick={() => setSortBy('lowStock')}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      sortBy === 'lowStock' ? 'bg-[#FF8C00] text-white' : 'bg-[#1F1F1F] text-gray-300 border border-gray-800'
                    }`}
                  >
                    Low Stock First
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Products Display */}
        {loading ? (
          <div className="bg-[#252525] border border-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="text-lg text-gray-400">Loading products...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-[#252525] border border-gray-800 rounded-xl shadow-lg p-12 text-center">
            <Package className="mx-auto text-gray-500 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="bg-[#252525] border border-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1F1F1F]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">SKU</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Total Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Reorder Level</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredProducts.map((product) => (
                    <>
                      <tr key={product.id} className="hover:bg-[#2A2A2A] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleRowExpansion(product.id)}
                              className="text-gray-500 hover:text-gray-300"
                            >
                              {expandedRows.has(product.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            </button>
                            <div className={`w-3 h-3 rounded-full ${getStockIndicator(product)}`}></div>
                            <span className="font-medium text-white">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">{product.sku}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{product.category}</td>
                        <td className="px-6 py-4 text-sm font-medium text-white">
                          {product.totalStock} {product.unit}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {product.reorderLevel} {product.unit}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedProduct(product)}
                              className="text-[#FF8C00] hover:text-[#FF9500] text-sm font-medium"
                            >
                              View
                            </button>
                            <button className="text-gray-400 hover:text-gray-300">
                              <Edit size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRows.has(product.id) && (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 bg-[#1F1F1F]">
                            <div className="space-y-3">
                              <h4 className="font-semibold text-white">Stock by Location</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {product.locations.map((loc, idx) => (
                                  <div key={idx} className="bg-[#252525] rounded-lg p-4 border border-gray-800">
                                    <p className="text-sm text-gray-400">{loc.warehouse}</p>
                                    <p className="text-xl font-bold text-white mt-1">
                                      {loc.quantity} {product.unit}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#252525] border border-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getStockIndicator(product)}`}></div>
                    <div>
                      <h3 className="font-semibold text-white">{product.name}</h3>
                      <p className="text-sm text-gray-400">{product.sku}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-300">
                    <Edit size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Category:</span>
                    <span className="font-medium text-white">{product.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Stock:</span>
                    <span className="font-bold text-white">{product.totalStock} {product.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Reorder Level:</span>
                    <span className="text-gray-300">{product.reorderLevel} {product.unit}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Product Detail Sidepanel */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end"
              onClick={() => setSelectedProduct(null)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="bg-[#252525] border border-gray-800 h-full w-full md:w-[600px] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Product Details</h2>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="p-2 hover:bg-[#2A2A2A] rounded-lg text-gray-300"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-[#1F1F1F] border border-gray-800 rounded-xl p-6">
                      <h3 className="font-semibold text-white mb-4">Product Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-gray-400">Product Name</label>
                          <p className="font-medium text-white">{selectedProduct.name}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">SKU / Code</label>
                          <p className="font-medium text-white">{selectedProduct.sku}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Category</label>
                          <p className="font-medium text-white">{selectedProduct.category}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Unit of Measure</label>
                          <p className="font-medium text-white">{selectedProduct.unit}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Last Updated</label>
                          <p className="font-medium text-white">{selectedProduct.lastUpdated}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#1F1F1F] border border-gray-800 rounded-xl p-6">
                      <h3 className="font-semibold text-white mb-4">Stock Data</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Total Stock</span>
                          <span className="text-2xl font-bold text-white">
                            {selectedProduct.totalStock} {selectedProduct.unit}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Reorder Point</span>
                          <span className="font-medium text-white">
                            {selectedProduct.reorderLevel} {selectedProduct.unit}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Status</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedProduct.status)}`}>
                            {selectedProduct.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#1F1F1F] border border-gray-800 rounded-xl p-6">
                      <h3 className="font-semibold text-white mb-4">Stock by Warehouse</h3>
                      <div className="space-y-3">
                        {selectedProduct.locations.map((loc, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-[#252525] border border-gray-800 rounded-lg">
                            <span className="text-gray-300">{loc.warehouse}</span>
                            <span className="font-bold text-white">
                              {loc.quantity} {selectedProduct.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>



                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-3 bg-[#FF8C00] text-white rounded-xl hover:bg-[#FF9500] font-medium">
                        Edit Product
                      </button>
                      <button className="px-4 py-3 border border-red-800 text-red-400 rounded-xl hover:bg-red-900/20 font-medium">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Product Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#252525] border border-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Create New Product</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-[#2A2A2A] rounded-lg text-gray-300"
                  >
                    <X size={24} />
                  </button>
                </div>

                {createError && (
                  <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-xl">
                    {createError}
                  </div>
                )}

                <form onSubmit={handleCreateProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Product Name</label>
                      <input
                        type="text"
                        placeholder="Enter product name"
                        value={createFormData.name}
                        onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00] text-white placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">SKU / Product Code</label>
                      <input
                        type="text"
                        placeholder="e.g., SR-2024-001"
                        value={createFormData.sku}
                        onChange={(e) => setCreateFormData({ ...createFormData, sku: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00] text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Category</label>
                      <select 
                        value={createFormData.category}
                        onChange={(e) => setCreateFormData({ ...createFormData, category: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00] text-white"
                      >
                        <option value="">Select category</option>
                        {categories.filter(c => c !== 'All').map(cat => (
                          <option key={cat} value={cat} className="bg-[#252525]">{cat}</option>
                        ))}
                        <option value="Electronics" className="bg-[#252525]">Electronics</option>
                        <option value="Furniture" className="bg-[#252525]">Furniture</option>
                        <option value="Office Supplies" className="bg-[#252525]">Office Supplies</option>
                        <option value="Raw Materials" className="bg-[#252525]">Raw Materials</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Unit of Measure</label>
                      <select 
                        value={createFormData.unit}
                        onChange={(e) => setCreateFormData({ ...createFormData, unit: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00] text-white"
                      >
                        <option value="">Select unit</option>
                        <option value="units" className="bg-[#252525]">units</option>
                        <option value="kg" className="bg-[#252525]">kg</option>
                        <option value="liters" className="bg-[#252525]">liters</option>
                        <option value="boxes" className="bg-[#252525]">boxes</option>
                        <option value="meters" className="bg-[#252525]">meters</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Reorder Level</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={createFormData.reorderLevel}
                        onChange={(e) => setCreateFormData({ ...createFormData, reorderLevel: e.target.value })}
                        required
                        min="0"
                        className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00] text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Description (Optional)</label>
                    <textarea
                      rows={4}
                      placeholder="Enter product description"
                      value={createFormData.description}
                      onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-800 rounded-xl focus:outline-none focus:border-[#FF8C00] text-white placeholder-gray-500"
                    ></textarea>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      disabled={createLoading}
                      className="flex-1 px-6 py-3 border border-gray-800 text-gray-300 rounded-xl hover:bg-[#2A2A2A] font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createLoading}
                      className="flex-1 px-6 py-3 bg-[#FF8C00] text-white rounded-xl hover:bg-[#FF9500] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createLoading ? 'Creating...' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
