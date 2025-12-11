import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types/product';
import { supabase } from '../lib/supabase';

interface SellerProfile {
    id: string;
    user_id: string;
    is_approved: boolean;
}

const SellerProducts = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image_url: '',
    });
    const [productSubmitting, setProductSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data: sellerData, error: sellerError } = await supabase
                .from('sellers')
                .select('id, user_id, is_approved')
                .eq('user_id', user.id)
                .single();

            if (sellerError && sellerError.code !== 'PGRST116') {
                console.error('Seller fetch error:', sellerError);
            }

            if (sellerData) {
                setSellerProfile(sellerData);
                const { data: productsData } = await supabase
                    .from('products')
                    .select('*')
                    .eq('seller_id', sellerData.id);
                setProducts(productsData || []);
            } else {
                setSellerProfile(null);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sellerProfile) {
            showMessage('error', 'You must register as a seller first. Go to the Seller page.');
            return;
        }
        setProductSubmitting(true);
        setMessage(null);
        try {
            if (editingProduct) {
                const { error } = await supabase.from('products').update({
                    name: productData.name,
                    description: productData.description,
                    price: parseFloat(productData.price),
                    category: productData.category,
                    stock: parseInt(productData.stock, 10),
                    image_url: productData.image_url,
                }).eq('id', editingProduct.id);
                if (error) throw error;
                showMessage('success', 'Product updated successfully!');
            } else {
                const { error } = await supabase.from('products').insert({
                    seller_id: sellerProfile.id,
                    name: productData.name,
                    description: productData.description,
                    price: parseFloat(productData.price),
                    category: productData.category,
                    stock: parseInt(productData.stock, 10),
                    image_url: productData.image_url,
                    is_active: true,
                });
                if (error) throw error;
                showMessage('success', 'Product added successfully!');
            }
            setShowProductForm(false);
            setEditingProduct(null);
            setProductData({ name: '', description: '', price: '', category: '', stock: '', image_url: '' });
            fetchData();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message :
                (typeof error === 'object' && error !== null && 'message' in error)
                    ? String((error as { message: unknown }).message)
                    : 'Failed to save product. Please try again.';
            showMessage('error', errorMessage);
        } finally {
            setProductSubmitting(false);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setProductData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            category: product.category || '',
            stock: product.stock.toString(),
            image_url: product.image_url || '',
        });
        setShowProductForm(true);
    };

    const handleDelete = async (productId: string) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            const { error } = await supabase.from('products').delete().eq('id', productId);
            if (error) throw error;
            showMessage('success', 'Product deleted!');
            fetchData();
        } catch (error) {
            console.error('Delete error:', error);
            showMessage('error', 'Failed to delete product.');
        }
    };

    const navItems = [
        { path: '/applications', icon: '📊', label: 'Dashboard' },
        { path: '/earnings', icon: '💰', label: 'Earnings' },
        { path: '/orders', icon: '🛒', label: 'Orders' },
        { path: '/analytics', icon: '📈', label: 'Analytics' },
        { path: '/products', icon: '📦', label: 'Products', active: true },
        { path: '/settings', icon: '⚙️', label: 'Settings' },
    ];

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-40">
                <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h1 className="font-semibold">My Products</h1>
                <div className="w-10"></div>
            </div>

            <div className="flex">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={() => setSidebarOpen(false)}>
                        <div className="w-64 bg-white h-full shadow-lg" onClick={e => e.stopPropagation()}>
                            <div className="p-4 border-b flex justify-between items-center">
                                <span className="font-semibold">Menu</span>
                                <button onClick={() => setSidebarOpen(false)} className="p-1">✕</button>
                            </div>
                            <nav className="p-2">
                                {navItems.map(item => (
                                    <button key={item.path} onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                                        className={`flex items-center w-full px-4 py-3 rounded-lg mb-1 ${item.active ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                                        <span className="mr-3">{item.icon}</span> {item.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                )}

                {/* Desktop Sidebar */}
                <div className="hidden lg:block w-64 bg-white shadow-lg min-h-screen">
                    <nav className="p-4">
                        {navItems.map(item => (
                            <button key={item.path} onClick={() => navigate(item.path)}
                                className={`flex items-center w-full px-4 py-2 rounded-lg mb-1 ${item.active ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <span className="mr-3">{item.icon}</span> {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4 lg:p-6">
                    {message && (
                        <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message.text}
                        </div>
                    )}

                    {!sellerProfile && (
                        <div className="mb-4 p-3 rounded-lg bg-yellow-100 text-yellow-800 text-sm">
                            You are not registered as a seller. <button onClick={() => navigate('/seller')} className="underline font-semibold">Register here</button>
                        </div>
                    )}

                    <div className="hidden lg:flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">My Products</h1>
                        <button
                            onClick={() => {
                                if (!sellerProfile) { showMessage('error', 'Please register as a seller first.'); return; }
                                setEditingProduct(null);
                                setProductData({ name: '', description: '', price: '', category: '', stock: '', image_url: '' });
                                setShowProductForm(true);
                            }}
                            className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800"
                        >
                            Add Product
                        </button>
                    </div>

                    {/* Mobile Add Button - Fixed */}
                    <button
                        onClick={() => {
                            if (!sellerProfile) { showMessage('error', 'Please register as a seller first.'); return; }
                            setEditingProduct(null);
                            setProductData({ name: '', description: '', price: '', category: '', stock: '', image_url: '' });
                            setShowProductForm(true);
                        }}
                        className="lg:hidden fixed bottom-4 right-4 bg-purple-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl z-30"
                    >
                        +
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow p-4">
                                {product.image_url && <img src={product.image_url} alt={product.name} className="w-full h-32 sm:h-40 object-cover rounded mb-3" />}
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                                <p className="font-bold mt-2">₹{product.price}</p>
                                <p className="text-xs text-gray-500">Stock: {product.stock} | {product.category}</p>
                                <div className="mt-3 flex gap-2">
                                    <button onClick={() => handleEdit(product)} className="flex-1 bg-blue-500 text-white py-2 rounded text-sm">Edit</button>
                                    <button onClick={() => handleDelete(product.id)} className="flex-1 bg-red-500 text-white py-2 rounded text-sm">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {products.length === 0 && sellerProfile && (
                        <div className="text-center text-gray-500 mt-8">No products yet. Tap + to add your first product!</div>
                    )}
                </div>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50">
                    <div className="bg-white w-full sm:rounded-lg sm:max-w-md sm:mx-4 max-h-[90vh] overflow-y-auto rounded-t-2xl">
                        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                            <h2 className="text-lg font-bold">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => setShowProductForm(false)} className="text-gray-500 text-2xl">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <input type="text" value={productData.name} onChange={(e) => setProductData({ ...productData, name: e.target.value })} placeholder="Product Name" required className="w-full p-3 border rounded-lg" />
                            <textarea value={productData.description} onChange={(e) => setProductData({ ...productData, description: e.target.value })} placeholder="Description" rows={3} className="w-full p-3 border rounded-lg" />
                            <div className="grid grid-cols-2 gap-3">
                                <input type="number" step="0.01" value={productData.price} onChange={(e) => setProductData({ ...productData, price: e.target.value })} placeholder="Price" required className="p-3 border rounded-lg" />
                                <input type="number" value={productData.stock} onChange={(e) => setProductData({ ...productData, stock: e.target.value })} placeholder="Stock" required className="p-3 border rounded-lg" />
                            </div>
                            <select value={productData.category} onChange={(e) => setProductData({ ...productData, category: e.target.value })} required className="w-full p-3 border rounded-lg">
                                <option value="">Select Category</option>
                                <option value="honey">Honey</option>
                                <option value="beehive">Beehive</option>
                                <option value="accessories">Accessories</option>
                                <option value="other">Other</option>
                            </select>
                            <input type="url" value={productData.image_url} onChange={(e) => setProductData({ ...productData, image_url: e.target.value })} placeholder="Image URL" className="w-full p-3 border rounded-lg" />
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={productSubmitting} className="flex-1 bg-purple-700 text-white py-3 rounded-lg disabled:opacity-50">
                                    {productSubmitting ? 'Saving...' : 'Save'}
                                </button>
                                <button type="button" onClick={() => setShowProductForm(false)} className="flex-1 bg-gray-200 py-3 rounded-lg">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerProducts;
