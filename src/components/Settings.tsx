// Seller Store Settings
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSeller } from '../hooks/useSeller';
import SellerLayout from './SellerLayout';

const Settings = () => {
    const { seller: sellerProfile, loading: sellerLoading, refreshSeller } = useSeller();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: ''
    });

    useEffect(() => {
        if (!sellerLoading && sellerProfile) {
            setFormData({
                name: sellerProfile.name || '',
                phone: sellerProfile.phone || '',
                address: sellerProfile.address || '',
                city: sellerProfile.city || '',
                state: sellerProfile.state || '',
                zip: sellerProfile.zip || ''
            });
            setLoading(false);
        } else if (!sellerLoading && !sellerProfile) {
            setLoading(false);
        }
    }, [sellerProfile, sellerLoading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sellerProfile) return;
        setUpdating(true);
        try {
            const { error } = await supabase
                .from('sellers')
                .update({
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip
                })
                .eq('id', sellerProfile.id);

            if (error) throw error;
            alert('Settings updated successfully!');
            await refreshSeller();
        } catch (error) {
            console.error('Error updating settings:', error);
            alert('Failed to update settings.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <SellerLayout title="Settings">
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin"></div>
                </div>
            </SellerLayout>
        );
    }

    return (
        <SellerLayout title="Settings">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Store Profile</h3>
                            <p className="text-sm text-gray-500 font-medium">Update your public store information</p>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-2xl flex items-center justify-center text-xl">
                            ⚙️
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Store Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border-gray-100 bg-gray-50/50 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 font-medium transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border-gray-100 bg-gray-50/50 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 font-medium transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Full Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                rows={3}
                                className="w-full rounded-xl border-gray-100 bg-gray-50/50 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 font-medium transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border-gray-100 bg-gray-50/50 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 font-medium transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border-gray-100 bg-gray-50/50 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 font-medium transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Zip Code</label>
                                <input
                                    type="text"
                                    name="zip"
                                    value={formData.zip}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border-gray-100 bg-gray-50/50 shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3 font-medium transition-all"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={updating}
                                className="w-full bg-purple-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 disabled:opacity-50"
                            >
                                {updating ? 'Updating Store...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 bg-red-50 rounded-2xl border border-red-100 p-8">
                    <h3 className="text-lg font-black text-red-900 tracking-tight uppercase mb-2">Danger Zone</h3>
                    <p className="text-sm text-red-600 font-medium mb-6">Irreversible actions for your seller account</p>
                    <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-lg shadow-red-100">
                        Deactivate Seller Account
                    </button>
                </div>
            </div>
        </SellerLayout>
    );
};

export default Settings;
