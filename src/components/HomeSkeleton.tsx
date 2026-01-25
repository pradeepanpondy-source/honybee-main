import React from 'react';

const HomeSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse bg-honeybee-background min-h-screen pt-14 md:pt-16">
            {/* Hero Skeleton */}
            <div className="relative min-h-[80vh] flex flex-col justify-center items-center px-4">
                <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-6 w-full max-w-xl">
                        <div className="h-16 md:h-24 bg-gray-200 rounded-3xl w-3/4" />
                        <div className="h-4 bg-gray-100 rounded-full w-full" />
                        <div className="h-4 bg-gray-100 rounded-full w-5/6" />
                        <div className="flex gap-4 pt-6">
                            <div className="h-14 bg-gray-200 rounded-2xl w-40" />
                            <div className="h-14 bg-gray-100 rounded-2xl w-40" />
                        </div>
                    </div>
                    <div className="w-full max-w-md aspect-square bg-gray-200 rounded-[3rem]" />
                </div>
            </div>

            {/* Stats Skeleton */}
            <div className="py-12 md:py-24 bg-honeybee-light/30">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-white rounded-3xl border border-honeybee-primary/5" />
                    ))}
                </div>
            </div>

            {/* Products Skeleton */}
            <div className="py-24 max-w-7xl mx-auto px-4">
                <div className="h-12 bg-gray-200 rounded-2xl w-1/4 mb-12" />
                <div className="grid md:grid-cols-3 gap-10">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <div className="aspect-square bg-gray-200 rounded-[3rem]" />
                            <div className="h-6 bg-gray-100 rounded-full w-full" />
                            <div className="h-4 bg-gray-50 rounded-full w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeSkeleton;
