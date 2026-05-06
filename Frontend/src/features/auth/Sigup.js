import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Signup() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        watch,
    } = useForm();

    const password = watch('password');

    const onSubmit = async (data) => {
        try {
            setError('');
            if (data.password !== data.confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            await signup(data);
            reset();
            navigate("/login");
        } catch (err) {
            setError(err.message || 'Signup failed. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">CardHub</h1>
                        <p className="text-gray-500">Create your account</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                placeholder="Choose a username"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                {...register("username", {
                                    required: "Username is required",
                                    minLength: { value: 6, message: "Username must be at least 6 characters" }
                                })}
                                disabled={isSubmitting}
                            />
                            {errors.username && (
                                <span className="text-red-600 text-sm mt-1 block">
                                    {errors.username.message}
                                </span>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" }
                                })}
                                disabled={isSubmitting}
                            />
                            {errors.email && (
                                <span className="text-red-600 text-sm mt-1 block">
                                    {errors.email.message}
                                </span>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="Create a strong password"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 8, message: "Password must be at least 8 characters" }
                                })}
                                disabled={isSubmitting}
                            />
                            {errors.password && (
                                <span className="text-red-600 text-sm mt-1 block">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm your password"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) => value === password || "Passwords must match"
                                })}
                                disabled={isSubmitting}
                            />
                            {errors.confirmPassword && (
                                <span className="text-red-600 text-sm mt-1 block">
                                    {errors.confirmPassword.message}
                                </span>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating account...' : 'Sign up'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <p className="text-center">
                        <span
                            onClick={() => navigate('/login')}
                            className="text-blue-600 font-medium cursor-pointer hover:underline"
                        >
                            Login here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup
