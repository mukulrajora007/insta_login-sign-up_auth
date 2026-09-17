import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Check, X, AlertCircle, Loader2 } from 'lucide-react';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // 'checking' | 'available' | 'taken' | null
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  // Debounced username availability checker
  useEffect(() => {
    const cleanUsername = formData.username.trim();
    if (cleanUsername.length < 3) {
      setUsernameStatus(null);
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const res = await authService.checkUsername(cleanUsername);
        setUsernameStatus(res.available ? 'available' : 'taken');
      } catch {
        setUsernameStatus(null);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'username') {
      value = value.replace(/\s+/g, '_').toLowerCase();
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const isFormValid =
    formData.email.trim().length > 3 &&
    formData.fullName.trim().length >= 2 &&
    formData.username.trim().length >= 3 &&
    formData.password.length >= 6 &&
    usernameStatus !== 'taken';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || submitting) return;

    setError('');
    setSubmitting(true);

    try {
      await signup(formData);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please check your information.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[350px] flex flex-col items-center">
      {/* Main Signup Card */}
      <div className="w-full bg-white border border-ig-border py-8 px-8 sm:px-10 rounded-[1px] flex flex-col items-center">
        {/* Instagram Script Brand Logo */}
        <div className="mb-3 mt-1">
          <h1 className="font-instagram text-4xl sm:text-5xl text-zinc-900 tracking-normal select-none">
            Instagram
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-center text-sm font-semibold text-ig-secondary-text mb-4 leading-snug">
          Sign up to see photos and videos from your friends.
        </p>

        {/* Log in with Facebook button */}
        <button
          type="button"
          onClick={() => alert('Facebook Login can be linked with Supabase Auth.')}
          className="w-full py-1.5 px-4 rounded bg-ig-blue hover:bg-ig-blue-hover text-white text-sm font-semibold flex items-center justify-center space-x-2 transition"
        >
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Log in with Facebook</span>
        </button>

        {/* OR Divider */}
        <div className="w-full flex items-center my-4">
          <div className="flex-1 h-[1px] bg-ig-border"></div>
          <span className="px-4 text-xs font-semibold text-ig-secondary-text">OR</span>
          <div className="flex-1 h-[1px] bg-ig-border"></div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="w-full mb-4 p-3 bg-rose-50 border border-rose-200 text-ig-red text-xs rounded text-center leading-relaxed flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-ig-red" />
            <span>{error}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-2">
          {/* Email / Mobile */}
          <div className="ig-input-group">
            <input
              id="email"
              type="text"
              name="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`ig-input ${formData.email ? 'has-value' : ''}`}
            />
            <label htmlFor="email" className="ig-floating-label">
              Mobile Number or Email
            </label>
          </div>

          {/* Full Name */}
          <div className="ig-input-group">
            <input
              id="fullName"
              type="text"
              name="fullName"
              autoComplete="name"
              required
              value={formData.fullName}
              onChange={handleChange}
              className={`ig-input ${formData.fullName ? 'has-value' : ''}`}
            />
            <label htmlFor="fullName" className="ig-floating-label">
              Full Name
            </label>
          </div>

          {/* Username */}
          <div className="ig-input-group relative">
            <input
              id="username"
              type="text"
              name="username"
              autoComplete="username"
              required
              value={formData.username}
              onChange={handleChange}
              className={`ig-input ${formData.username ? 'has-value' : ''} pr-8`}
            />
            <label htmlFor="username" className="ig-floating-label">
              Username
            </label>

            {/* Availability Indicator */}
            {usernameStatus && (
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                {usernameStatus === 'checking' && (
                  <Loader2 className="w-3.5 h-3.5 text-zinc-400 animate-spin" />
                )}
                {usernameStatus === 'available' && (
                  <div className="w-4 h-4 rounded-full border border-emerald-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                  </div>
                )}
                {usernameStatus === 'taken' && (
                  <div className="w-4 h-4 rounded-full border border-rose-500 flex items-center justify-center">
                    <X className="w-3 h-3 text-rose-500 stroke-[3]" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="ig-input-group relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`ig-input ${formData.password ? 'has-value' : ''} pr-12`}
            />
            <label htmlFor="signup-password" className="ig-floating-label">
              Password
            </label>

            {formData.password.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-ig-primary-text hover:text-ig-secondary-text select-none py-1 px-1.5 focus:outline-none"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            )}
          </div>

          {/* Legal / Policy terms disclaimer */}
          <p className="text-[11px] text-ig-secondary-text text-center pt-2 leading-tight">
            People who use our service may have uploaded your contact information to Instagram.{' '}
            <a href="#learn-more" onClick={(e) => e.preventDefault()} className="text-ig-link font-semibold">
              Learn More
            </a>
          </p>

          <p className="text-[11px] text-ig-secondary-text text-center py-1 leading-tight">
            By signing up, you agree to our{' '}
            <a href="#terms" onClick={(e) => e.preventDefault()} className="text-ig-link font-semibold">
              Terms
            </a>
            ,{' '}
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-ig-link font-semibold">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="#cookies" onClick={(e) => e.preventDefault()} className="text-ig-link font-semibold">
              Cookies Policy
            </a>
            .
          </p>

          {/* Sign up Submit button */}
          <button
            type="submit"
            disabled={!isFormValid || submitting}
            className={`w-full py-1.5 px-4 rounded text-sm font-semibold text-white transition duration-150 flex items-center justify-center ${
              isFormValid && !submitting
                ? 'bg-ig-blue hover:bg-ig-blue-hover cursor-pointer'
                : 'bg-ig-blue-disabled cursor-default opacity-70'
            }`}
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin my-0.5" />
            ) : (
              'Sign up'
            )}
          </button>
        </form>
      </div>

      {/* Switch to Login Card */}
      <div className="w-full bg-white border border-ig-border py-5 px-6 rounded-[1px] mt-2.5 text-center">
        <p className="text-sm text-ig-primary-text">
          Have an account?{' '}
          <Link to="/login" className="text-ig-blue font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>

      {/* Get the app section */}
      <div className="w-full mt-4 flex flex-col items-center">
        <span className="text-sm text-ig-primary-text my-2.5">Get the app.</span>
        <div className="flex items-center space-x-2">
          {/* Google Play badge */}
          <a
            href="https://play.google.com/store/apps/details?id=com.instagram.android"
            target="_blank"
            rel="noreferrer"
            className="inline-block transform hover:scale-105 transition"
          >
            <img
              src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png"
              alt="Get it on Google Play"
              className="h-10 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </a>
          {/* Microsoft Store badge */}
          <a
            href="https://apps.microsoft.com/detail/9nblggh5l9xt"
            target="_blank"
            rel="noreferrer"
            className="inline-block transform hover:scale-105 transition"
          >
            <img
              src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png"
              alt="Get it from Microsoft"
              className="h-10 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
