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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '',
    name: '',
    category: '',
    unit: '',
    reorderLevel: '',
    description: ''
  });
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

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

  const handleEditProduct = (product: Product) => {
    setEditFormData({
      id: product.id,
      name: product.name,
      category: product.category,
      unit: product.unit,
      reorderLevel: product.reorderLevel.toString(),
      description: ''
    });
    setShowEditModal(true);
    setSelectedProduct(product); // Keep product data for stock display
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');
    setEditLoading(true);

    try {
      const response = await productsAPI.update(editFormData.id, {
        name: editFormData.name,
        category: editFormData.category,
        unit: editFormData.unit,
        reorderLevel: parseInt(editFormData.reorderLevel),
        description: editFormData.description || undefined
      });

      if (response.success) {
        setShowEditModal(false);
        fetchProducts();
      } else {
        setEditError(response.error?.message || 'Failed to update product');
      }
    } catch (error: any) {
      setEditError(error.message || 'An error occurred');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await productsAPI.delete(productId);
      if (response.success) {
        setSelectedProduct(null);
        fetchProducts();
      } else {
        alert(response.error?.message || 'Failed to delete product');
      }
    } catch (error: any) {
      alert(error.message || 'An error occurred');
    }
  };



  const getStatusColor = (status: string) => {
    const colors = {
      'In Stock': 'bg-green-900/50 text-green-300 border-green-700',
      'Low Stock': 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
      'Out of Stock': 'bg-red-900/50 text-red-300 border-red-700',
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
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all"
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
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Products</p>
                <p className="text-3xl font-bold text-white mt-1">{products.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Package className="text-orange-500" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Low Stock Items</p>
                <p className="text-3xl font-bold text-red-500 mt-1">{lowStockCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Categories</p>
                <p className="text-3xl font-bold text-white mt-1">{categories.length - 1}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Grid className="text-purple-500" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Stock Value</p>
                <p className="text-3xl font-bold text-green-500 mt-1">
                  {products.reduce((sum, p) => sum + p.totalStock, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-green-500" size={24} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by product name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 flex items-center gap-2 text-gray-300"
              >
                <Filter size={20} />
                Filters
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 rounded-xl ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300'}`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 rounded-xl ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300'}`}
              >
                <Grid size={20} />
              </button>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 pt-4 border-t border-gray-700"
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
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
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
                      sortBy === 'name' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    A → Z
                  </button>
                  <button
                    onClick={() => setSortBy('stock')}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      sortBy === 'stock' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    Highest Stock
                  </button>
                  <button
                    onClick={() => setSortBy('lowStock')}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      sortBy === 'lowStock' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-300'
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
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <div className="text-lg text-gray-300">Loading products...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
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
                      <tr key={product.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleRowExpansion(product.id)}
                              className="text-gray-400 hover:text-gray-300"
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
                              className="text-orange-500 hover:text-orange-400 text-sm font-medium"
                            >
                              View
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditProduct(product);
                              }}
                              className="text-gray-400 hover:text-gray-300"
                            >
                              <Edit size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRows.has(product.id) && (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 bg-gray-800">
                            <div className="space-y-3">
                              <h4 className="font-semibold text-white">Stock by Location</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {product.locations.map((loc, idx) => (
                                  <div key={idx} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
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
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-orange-500/50 transition-all cursor-pointer"
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
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProduct(product);
                    }}
                    className="text-gray-400 hover:text-gray-300"
                  >
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
                <div className="mt-4 pt-4 border-t border-gray-700">
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
                className="bg-gray-900 border-l border-gray-800 h-full w-full md:w-[600px] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Product Details</h2>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="p-2 hover:bg-gray-800 rounded-lg"
                    >
                      <X size={24} className="text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
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

                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
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

                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                      <h3 className="font-semibold text-white mb-4">Stock by Warehouse</h3>
                      <div className="space-y-3">
                        {selectedProduct.locations.map((loc, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                            <span className="text-gray-300">{loc.warehouse}</span>
                            <span className="font-bold text-white">
                              {loc.quantity} {selectedProduct.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>



                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleEditProduct(selectedProduct)}
                        className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-medium transition-colors"
                      >
                        Edit Product
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(selectedProduct.id)}
                        className="px-4 py-3 border border-red-700 text-red-400 rounded-xl hover:bg-red-900/50 font-medium transition-colors"
                      >
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
                className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Create New Product</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg"
                  >
                    <X size={24} className="text-gray-400" />
                  </button>
                </div>

                {createError && (
                  <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-xl">
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
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
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
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
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
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 text-white"
                      >
                        <option value="">Select category</option>
                        {categories.filter(c => c !== 'All').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="Electronics">Electronics</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Office Supplies">Office Supplies</option>
                        <option value="Raw Materials">Raw Materials</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Unit of Measure</label>
                      <select 
                        value={createFormData.unit}
                        onChange={(e) => setCreateFormData({ ...createFormData, unit: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 text-white"
                      >
                        <option value="">Select unit</option>
                        <option value="units">units</option>
                        <option value="kg">kg</option>
                        <option value="liters">liters</option>
                        <option value="boxes">boxes</option>
                        <option value="meters">meters</option>
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
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
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
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 text-white placeholder-gray-400 resize-none"
                    ></textarea>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      disabled={createLoading}
                      className="flex-1 px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 font-medium disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createLoading}
                      className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {createLoading ? 'Creating...' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Product Modal */}
        <AnimatePresence>
          {showEditModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
              onClick={() => setShowEditModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Edit Product</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg"
                  >
                    <X size={24} className="text-gray-400" />
                  </button>
                </div>

                {editError && (
                  <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-4">
                    {editError}
                  </div>
                )}

                {/* Stock Information */}
                {selectedProduct && selectedProduct.locations && selectedProduct.locations.length > 0 && (
                  <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-4 mb-6">
                    <h3 className="font-semibold text-white mb-3">Current Stock by Location</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedProduct.locations.map((loc: any, idx: number) => (
                        <div key={idx} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                          <p className="text-sm text-gray-400">{loc.warehouse}</p>
                          <p className="text-lg font-bold text-white">
                            {loc.quantity} {selectedProduct.unit}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      💡 To adjust stock quantities, use the <strong>Stock Adjustments</strong> page
                    </p>
                  </div>
                )}

                <form onSubmit={handleUpdateProduct} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Product Name</label>
                    <input
                      type="text"
                      placeholder="Enter product name"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Category</label>
                      <select 
                        value={editFormData.category}
                        onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 text-white"
                      >
                        <option value="">Select category</option>
                        {categories.filter(c => c !== 'All').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="Electronics">Electronics</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Office Supplies">Office Supplies</option>
                        <option value="Raw Materials">Raw Materials</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Unit of Measure</label>
                      <select 
                        value={editFormData.unit}
                        onChange={(e) => setEditFormData({ ...editFormData, unit: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 text-white"
                      >
                        <option value="">Select unit</option>
                        <option value="units">units</option>
                        <option value="kg">kg</option>
                        <option value="liters">liters</option>
                        <option value="boxes">boxes</option>
                        <option value="meters">meters</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Reorder Level</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={editFormData.reorderLevel}
                      onChange={(e) => setEditFormData({ ...editFormData, reorderLevel: e.target.value })}
                      required
                      min="0"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Description (Optional)</label>
                    <textarea
                      rows={4}
                      placeholder="Enter product description"
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 text-white placeholder-gray-400 resize-none"
                    ></textarea>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      disabled={editLoading}
                      className="flex-1 px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 font-medium disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {editLoading ? 'Updating...' : 'Update Product'}
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
