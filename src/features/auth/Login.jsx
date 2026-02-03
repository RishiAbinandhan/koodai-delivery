import React from 'react';

export default function Login() {
    return (
        <div className="p-4 flex items-center justify-center min-h-[50vh]">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h2 className="text-xl font-bold mb-4">Partner Login</h2>
                <input
                    type="tel"
                    placeholder="Mobile Number"
                    className="w-full p-2 border rounded mb-4"
                />
                <button className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition-colors">
                    Get OTP
                </button>
            </div>
        </div>
    );
}
