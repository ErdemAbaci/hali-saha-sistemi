import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SubscriptionPage = () => {
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/subscriptions/packages');
            setPackages(response.data);
        } catch (error) {
            console.error('Paketler yüklenirken hata oluştu:', error);
        }
    };

    const handlePackageSelect = (pkg) => {
        setSelectedPackage(pkg);
    };

    const handleSubscribe = () => {
        if (selectedPackage) {
            navigate('/abonelik-odeme', { 
                state: { 
                    ...selectedPackage,
                    amount: selectedPackage.price
                }
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Halı Saha Abonelik Paketleri
                    </h2>
                    <p className="mt-4 text-xl text-gray-600">
                        Size en uygun paketi seçin, daha fazla maç yapın!
                    </p>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-3">
                    {packages.map((pkg) => (
                        <div
                            key={pkg._id}
                            className={`relative rounded-lg border ${
                                selectedPackage?._id === pkg._id
                                    ? 'border-blue-500 ring-2 ring-blue-500'
                                    : 'border-gray-700'
                            } bg-blue-900 p-8 shadow-lg hover:border-blue-500 transition-all duration-200 cursor-pointer`}
                            onClick={() => handlePackageSelect(pkg)}
                        >
                            <div className="text-left mb-4">
                                <span className="text-2xl font-bold text-white">
                                    {pkg.name}
                                </span>
                            </div>

                            <div className="mt-6">
                                <div className="text-left">
                                    <p className="text-4xl font-extrabold text-white">
                                        {pkg.price.toLocaleString('tr-TR')} ₺
                                    </p>
                                    <p className="mt-2 text-sm text-gray-300">
                                        {pkg.duration} {pkg.duration === 1 ? 'Ay' : 'Ay'}
                                    </p>
                                </div>

                                <ul className="mt-6 space-y-4 text-gray-200">
                                    <li className="flex items-center">
                                        <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="ml-3">{pkg.matchCount} Maç Hakkı</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="ml-3">7/24 Rezervasyon</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="ml-3">Öncelikli Rezervasyon</span>
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="ml-3">İndirimli Fiyatlar</span>
                                    </li>
                                </ul>

                                <button
                                    onClick={() => handlePackageSelect(pkg)}
                                    className={`mt-8 w-full rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                        ${selectedPackage?._id === pkg._id
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                >
                                    {selectedPackage?._id === pkg._id ? 'Seçildi' : 'Abone Ol'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedPackage && (
                    <div className="mt-12 text-center">
                        <button
                            onClick={handleSubscribe}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Abonelik Satın Al
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionPage; 