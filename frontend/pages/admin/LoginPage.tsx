import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const LoginPage: React.FC = () => {
    const [step, setStep] = useState<'login' | 'forgot' | 'reset'>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('brokerless-token', data.token);
            navigate('/admin/dashboard');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to request OTP');
            }

            setSuccessMessage(data.message || 'OTP sent successfully!');
            setStep('reset');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (newPassword !== confirmNewPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Password reset failed');
            }

            setSuccessMessage('Password reset successful. Please login with your new password.');
            setStep('login');
            setUsername('admin'); // Set username to admin for convenience
            setPassword('');
            setOtp('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const switchStep = (targetStep: 'login' | 'forgot' | 'reset') => {
        setStep(targetStep);
        setError('');
        setSuccessMessage('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                {step === 'login' && (
                    <>
                        <h1 className="text-3xl font-bold text-center text-[var(--color-dark)]">Admin Login</h1>
                        {successMessage && <p className="text-sm text-green-600 text-center font-medium bg-green-50 p-2.5 rounded">{successMessage}</p>}
                        <form onSubmit={handleLoginSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                />
                            </div>
                            <div>
                                <label htmlFor="password-input" className="text-sm font-medium text-gray-700">Password</label>
                                <input
                                    id="password-input"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                />
                            </div>
                            
                            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                            
                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white disabled:opacity-50"
                                    style={{ background: 'var(--gradient-primary)' }}
                                >
                                    {isLoading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </div>
                        </form>
                        <div className="text-center mt-4">
                            <button
                                onClick={() => switchStep('forgot')}
                                className="text-sm text-[var(--color-primary)] hover:underline focus:outline-none"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </>
                )}

                {step === 'forgot' && (
                    <>
                        <h1 className="text-3xl font-bold text-center text-[var(--color-dark)]">Forgot Password</h1>
                        <p className="text-sm text-gray-600 text-center">
                            Enter the admin email address (configured receiver email) to receive a password reset OTP.
                        </p>
                        <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">Admin Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="e.g. admin@brokerless.com"
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                />
                            </div>

                            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white disabled:opacity-50"
                                    style={{ background: 'var(--gradient-primary)' }}
                                >
                                    {isLoading ? 'Generating OTP...' : 'Send OTP'}
                                </button>
                            </div>
                        </form>
                        <div className="text-center mt-4">
                            <button
                                onClick={() => switchStep('login')}
                                className="text-sm text-gray-600 hover:underline focus:outline-none"
                            >
                                Back to Login
                            </button>
                        </div>
                    </>
                )}

                {step === 'reset' && (
                    <>
                        <h1 className="text-3xl font-bold text-center text-[var(--color-dark)]">Reset Password</h1>
                        {successMessage && (
                            <p className="text-sm text-blue-600 text-center font-medium bg-blue-50 p-2.5 rounded">
                                {successMessage}
                            </p>
                        )}
                        <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="otp" className="text-sm font-medium text-gray-700">Enter 6-Digit OTP</label>
                                <input
                                    id="otp"
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    required
                                    placeholder="123456"
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] tracking-widest text-center text-lg font-bold"
                                />
                            </div>

                            <div>
                                <label htmlFor="new-password" className="text-sm font-medium text-gray-700">New Password</label>
                                <input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                />
                            </div>

                            <div>
                                <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">Confirm New Password</label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                />
                            </div>

                            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white disabled:opacity-50"
                                    style={{ background: 'var(--gradient-primary)' }}
                                >
                                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
                                </button>
                            </div>
                        </form>
                        <div className="text-center mt-4">
                            <button
                                onClick={() => switchStep('login')}
                                className="text-sm text-gray-600 hover:underline focus:outline-none"
                            >
                                Cancel & Back to Login
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LoginPage;