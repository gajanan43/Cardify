import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            setError('');
            await login(data);
            reset();
            navigate("/cards");
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
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
                        <p className="text-gray-500">Welcome back</p>
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
                                placeholder="Enter your username"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                {...register("username", { required: "Username is required" })}
                                disabled={isSubmitting}
                            />
                            {errors.username && (
                                <span className="text-red-600 text-sm mt-1 block">
                                    {errors.username.message}
                                </span>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                {...register("password", { required: "Password is required" })}
                                disabled={isSubmitting}
                            />
                            {errors.password && (
                                <span className="text-red-600 text-sm mt-1 block">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">New here?</span>
                        </div>
                    </div>

                    {/* Signup Link */}
                    <p className="text-center">
                        <span
                            onClick={() => navigate('/signup')}
                            className="text-blue-600 font-medium cursor-pointer hover:underline"
                        >
                            Create an account
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login;