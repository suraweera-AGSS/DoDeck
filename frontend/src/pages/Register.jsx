import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, isAuthenticated } from '../services/auth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from '../components/Button';

export default function Register() {
    const [formData, setFormData] = useState({
        loginId: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const { loginId, password, confirmPassword } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error when user types
        setSuccess(''); // Clear success when user types
    };

    const validateForm = () => {
        if (!loginId.trim() || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return false;
        }

        if (loginId.trim().length < 3) {
            setError('Login ID must be at least 3 characters long');
            return false;
        }

        if (loginId.trim().length > 20) {
            setError('Login ID must be less than 20 characters');
            return false;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(loginId.trim())) {
            setError('Login ID can only contain letters, numbers, and underscores');
            return false;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const response = await register({
                loginId: loginId.trim(),
                password
            });

            if (response.success) {
                setSuccess('Registration successful! Redirecting to login...');
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            console.error('Registration error:', error);
            
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.response?.status === 400) {
                setError('Registration failed. Please check your input.');
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" style={{backgroundColor: '#F5F5F5'}}>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-black">Create Account</h2>
                    <p className="text-gray-600 mt-2">Join DoDeck today</p>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="loginId">
                            Login ID
                        </label>
                        <input
                            type="text"
                            id="loginId"
                            name="loginId"
                            placeholder="Choose a unique Login ID"
                            value={loginId}
                            onChange={onChange}
                            className="w-full p-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            required
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            3-20 characters, letters, numbers, and underscores only
                        </p>
                    </div>

                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={onChange}
                            className="w-full p-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent pr-12"
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            disabled={loading}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="mb-6 relative">
                        <label className="block text-sm font-medium mb-2 text-gray-700" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={onChange}
                            className="w-full p-3 bg-gray-100 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent pr-12"
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                            disabled={loading}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                            {success}
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        variant="accent" 
                        className="w-full" 
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-black font-medium hover:underline">
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
