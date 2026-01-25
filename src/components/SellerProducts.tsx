// Seller Products Management
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useSeller } from '../hooks/useSeller';
import { Product } from '../types/product';
import SellerLayout from './SellerLayout';
import { productSchema } from '../utils/validation';

const SellerProducts = () => {
    const { seller: sellerProfile, loading: sellerLoading } = useSeller();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Product Form State
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image_url: '',
    });
    const [productSubmitting, setProductSubmitting] = useState(false);

    const fetchProducts = useCallback(async () => {
        if (!sellerProfile) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('seller_id', sellerProfile.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [sellerProfile]);

    useEffect(() => {
        if (!sellerLoading && sellerProfile) {
            fetchProducts();
        } else if (!sellerLoading && !sellerProfile) {
            setLoading(false);
        }
    }, [fetchProducts, sellerLoading, sellerProfile]);

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setProductData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            category: product.category,
            stock: product.stock.toString(),
            image_url: product.image_url,
        });
        setShowProductForm(true);
    };

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sellerProfile) return;
        setProductSubmitting(true);
        // 1. Validation & Sanitization
        const validation = productSchema.safeParse({
            name: productData.name,
            description: productData.description,
            price: parseFloat(productData.price),
            category: productData.category,
            stock: parseInt(productData.stock, 10),
            image_url: productData.image_url,
        });

        if (!validation.success) {
            alert(validation.error.issues[0].message);
            setProductSubmitting(false);
            return;
        }

        try {
            const payload = {
                seller_id: sellerProfile.id,
                ...validation.data,
                is_active: true,
            };

            if (editingProduct) {
                const { error } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', editingProduct.id);
                if (error) throw error;
                alert('Product updated successfully!');
            } else {
                const { error } = await supabase.from('products').insert(payload);
                if (error) throw error;
                alert('Product added successfully!');
            }

            setShowProductForm(false);
            setEditingProduct(null);
            setProductData({ name: '', description: '', price: '', category: '', stock: '', image_url: '' });
            fetchProducts();
        } catch (error: unknown) {
            console.error('Product submission error:', error);
            alert(`Product submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setProductSubmitting(false);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const { error } = await supabase.from('products').delete().eq('id', productId);
            if (error) throw error;
            alert('Product deleted successfully!');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product.');
        }
    };

    if (loading) {
        return (
            <SellerLayout title="My Products">
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin"></div>
                </div>
            </SellerLayout>
        );
    }

    return (
        <SellerLayout title="My Products">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">Product Management</h2>
                        <p className="text-sm text-gray-500 font-medium">Manage your inventory and listing details</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            setProductData({ name: '', description: '', price: '', category: '', stock: '', image_url: '' });
                            setShowProductForm(true);
                        }}
                        className="bg-purple-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-purple-700 transition shadow-lg shadow-purple-100 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Product
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                                                        {product.image_url ? (
                                                            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-gray-400">📦</div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900">{product.name}</div>
                                                        <div className="text-xs text-gray-400 font-medium truncate max-w-[200px]">{product.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium uppercase text-[10px] tracking-widest">{product.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-gray-900">₹{product.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-sm font-bold ${product.stock < 10 ? 'text-red-500' : 'text-gray-900'}`}>{product.stock}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                                                <div className="flex gap-3">
                                                    <button onClick={() => handleEditProduct(product)} className="text-purple-600 hover:text-purple-900">Edit</button>
                                                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium italic">
                                            No products found. Add your first product to get started!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={() => setShowProductForm(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-6">
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h2>

                        <form onSubmit={handleProductSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        value={productData.name}
                                        onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                                        required
                                        placeholder="e.g. Pure Wild Forest Honey"
                                        className="w-full rounded-xl border-gray-100 bg-gray-50/50 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 font-medium transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                    <select
                                        value={productData.category}
                                        onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                                        required
                                        className="w-full rounded-xl border-gray-100 bg-gray-50/50 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 font-medium transition-all"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="honey">Honey</option>
                                        <option value="beehive">Beehive</option>
                                        <option value="accessories">Accessories</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                                <textarea
                                    value={productData.description}
                                    onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                                    required
                                    placeholder="Describe your product's unique features..."
                                    className="w-full rounded-xl border-gray-100 bg-gray-50/50 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 font-medium transition-all"
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={productData.price}
                                        onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                                        required
                                        placeholder="0.00"
                                        className="w-full rounded-xl border-gray-100 bg-gray-50/50 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 font-medium transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Stock Inventory</label>
                                    <input
                                        type="number"
                                        value={productData.stock}
                                        onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                                        required
                                        placeholder="0"
                                        className="w-full rounded-xl border-gray-100 bg-gray-50/50 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 font-medium transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Image URL</label>
                                <input
                                    type="url"
                                    value={productData.image_url}
                                    onChange={(e) => setProductData({ ...productData, image_url: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full rounded-xl border-gray-100 bg-gray-50/50 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 font-medium transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={productSubmitting}
                                className="w-full bg-purple-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 disabled:opacity-50"
                            >
                                {productSubmitting ? 'Processing...' : editingProduct ? 'Update Listing' : 'Confirm Listing'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </SellerLayout>
    );
};

export default SellerProducts;
