import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { Star, Truck, ShieldCheck, RefreshCw, Share2, Heart, ChevronRight } from 'lucide-react';
import beehiveImage from '../assets/beehive_new.png';

const ProductDetails: React.FC = () => {
    const { addToCart } = useCart();
    // const { user } = useAuth(); // Might use later for wishlist
    const [selectedSize, setSelectedSize] = useState('2-layer 10 frame hive');
    const [pincode, setPincode] = useState('');
    const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    const product = {
        id: 'beehive-starter-kit',
        name: 'Beehive Wooden Box With Frames',
        brand: 'Bee Bridge',
        rating: 4.6,
        reviews: 5,
        price: 5000,
        // proPrice: 31617, // Pro price removed
        condition: 'New',
        productId: '332024303',
        description: [
            "Premium Beehive Materials: The exterior of the beehive is made of cedar wood with top-quality pine beehive frames with food-grade plastic foundation soaked in beeswax",
            "Complete Beehive Kit: Our beehive kit includes a top cover, inner cover, bottom board, queen excluder, and entrance reducer for a complete bee hive starter kit",
            "Metal Top Cover: Retractable galvanized metal top cover protects your 10 frame beehive and colonies from the effects of the outdoors",
            "Standard Beehive Box Size: Deep Brood Boxes",
            "Easy to Assemble: Pre-cut dovetails and pre-drilled holes for easy assembly, dovetail design makes the connection between the two boards stronger"
        ],
        specs: {
            Brand: 'Bee Bridge',
            Material: 'Wood',
            Color: 'Natural',
            Style: 'Rustic',
            AssemblyRequired: 'Yes'
        },
        images: [
            beehiveImage,
            beehiveImage, // Duplicated for gallery demo
            beehiveImage,
            beehiveImage,
            beehiveImage,
            beehiveImage
        ]
    };

    const handlePincodeCheck = () => {
        if (!pincode) return;
        setPincodeStatus('checking');
        setTimeout(() => {
            // Mock check
            if (pincode.length === 6) setPincodeStatus('available');
            else setPincodeStatus('unavailable');
        }, 1000);
    };

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            description: product.description[0],
            price: product.price,
            category: 'beehive',
            image_url: product.images[0],
            seller_id: 'pollibee-official',
            stock: 5, // Per requirement
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
        alert('Added to cart!');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-6 flex items-center gap-1">
                    <span>Shop</span> <ChevronRight size={14} /> <span>Beekeeping</span> <ChevronRight size={14} /> <span className="text-gray-900 font-medium">Beehives</span>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                        {/* COLUMN 1: IMAGES (4 cols) */}
                        <div className="lg:col-span-4 flex flex-col gap-4">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group">
                                <img
                                    src={product.images[activeImage]}
                                    alt="Product Main"
                                    className="w-full h-full object-contain mix-blend-multiply p-4 transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 bg-white rounded-full shadow-md hover:text-red-500 transition-colors"><Heart size={20} /></button>
                                    <button className="p-2 bg-white rounded-full shadow-md hover:text-blue-500 transition-colors"><Share2 size={20} /></button>
                                </div>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`w-16 h-16 flex-shrink-0 border-2 rounded-md overflow-hidden ${activeImage === idx ? 'border-blue-600' : 'border-gray-200 hover:border-gray-400'}`}
                                    >
                                        <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* COLUMN 2: INFO (4 cols) */}
                        <div className="lg:col-span-5 flex flex-col gap-6 border-r border-gray-100 pr-0 lg:pr-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                    <div className="flex items-center text-yellow-400">
                                        <Star fill="currentColor" size={16} />
                                        <span className="font-bold text-gray-900 ml-1">{product.rating}</span>
                                        <span className="text-gray-500 font-normal ml-1">/ 5</span>
                                    </div>
                                    <span>Condition: <span className="font-medium text-gray-900">{product.condition}</span></span>
                                    <span>Product ID: {product.productId}</span>
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Size</h3>
                                <div className="flex flex-wrap gap-3">
                                    {['2-layer 10 frame hive'].map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 text-sm border rounded-lg transition-all ${selectedSize === size
                                                ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-600'
                                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Specs Table */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Details</h3>
                                <div className="space-y-3 text-sm">
                                    {Object.entries(product.specs).map(([key, value]) => (
                                        <div key={key} className="flex border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                            <span className="w-1/3 text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <span className="w-2/3 text-gray-900 font-medium text-right">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-1">About this item</h4>
                                <ul className="list-disc pl-5 text-sm text-blue-800 space-y-1">
                                    {(product.description as unknown as string[]).map((point, index) => (
                                        <li key={index}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* COLUMN 3: BUY BOX (4 cols) */}
                        <div className="lg:col-span-3">
                            <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white sticky top-24">
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                                    </div>

                                    {/* Seller Details */}
                                    <div className="mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <h4 className="font-semibold text-gray-900 text-sm mb-2">Sold By</h4>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold border border-yellow-200">
                                                BB
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Bee Bridge Official</p>
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <Star size={12} className="text-yellow-400 fill-current mr-1" />
                                                    4.8 (120 ratings)
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-sm text-green-600 mb-1 flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        In Stock
                                    </div>
                                    <div className="text-xs text-gray-500">Duties & taxes incl.</div>
                                </div>

                                {/* Pincode Checker */}
                                <div className="mb-6">
                                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Delivery Availability</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter Pincode"
                                            maxLength={6}
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={handlePincodeCheck}
                                            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                                        >
                                            Check
                                        </button>
                                    </div>
                                    {pincodeStatus === 'checking' && <p className="text-xs text-gray-500 mt-2">Checking...</p>}
                                    {pincodeStatus === 'available' && <p className="text-xs text-green-600 mt-2 flex items-center gap-1">✓ Delivery available to {pincode}</p>}
                                    {pincodeStatus === 'unavailable' && <p className="text-xs text-red-500 mt-2">✕ Delivery not available to {pincode}</p>}
                                </div>

                                {/* Actions */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 mb-4">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-50">-</button>
                                        <span className="font-medium">{quantity}</span>
                                        <button onClick={() => setQuantity(Math.min(5, quantity + 1))} className="w-8 h-8 rounded border flex items-center justify-center hover:bg-gray-50">+</button>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Add to Cart | ₹{product.price.toLocaleString()}
                                    </button>
                                    <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                                        Get Seller Contact
                                    </button>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Truck size={18} />
                                        <span>Free Shipping</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <ShieldCheck size={18} />
                                        <span>Secure Transaction</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <RefreshCw size={18} />
                                        <span>30 Days Return Policy</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
