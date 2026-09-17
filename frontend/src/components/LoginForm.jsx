import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const identifierRef = useRef(null);
  const passwordRef = useRef(null);

  const { login, demoAccount, supabaseConnected } = useAuth();
  const navigate = useNavigate();

  const isFormFilled = identifier.trim().length >= 4 && password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormFilled || submitting) return;

    setError('');
    setSubmitting(true);

    try {
      await login(identifier, password);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Sorry, your password was incorrect. Please double-check your password.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUseDemo = () => {
    if (demoAccount) {
      setIdentifier(demoAccount.username);
      setPassword(demoAccount.password);
    } else {
      setIdentifier('demo_user');
      setPassword('Password123');
    }
  };

  return (
    <div className="w-full max-w-[350px] flex flex-col items-center">
      {/* Main Login Card */}
      <div className="w-full bg-white border border-ig-border py-10 px-8 sm:px-10 rounded-[1px] flex flex-col items-center">
        {/* Instagram Script Brand Logo */}
        <div className="mb-8 mt-2">
          <h1 className="font-instagram text-4xl sm:text-5xl text-zinc-900 tracking-normal select-none">
            Instagram
          </h1>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="w-full mb-4 p-3 bg-rose-50 border border-rose-200 text-ig-red text-xs rounded text-center leading-relaxed flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-ig-red" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-2">
          {/* Identifier Input */}
          <div className="ig-input-group">
            <input
              ref={identifierRef}
              id="identifier"
              type="text"
              name="identifier"
              autoComplete="username"
              required
              maxLength={100}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value.slice(0, 100))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  passwordRef.current?.focus();
                }
              }}
              className={`ig-input ${identifier ? 'has-value' : ''}`}
            />
            <label htmlFor="identifier" className="ig-floating-label">
              Phone number, username, or email
            </label>
          </div>

          {/* Password Input with Show/Hide button */}
          <div className="ig-input-group relative">
            <input
              ref={passwordRef}
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              required
              maxLength={100}
              value={password}
              onChange={(e) => setPassword(e.target.value.slice(0, 100))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.shiftKey) {
                  e.preventDefault();
                  identifierRef.current?.focus();
                }
              }}
              className={`ig-input ${password ? 'has-value' : ''} pr-12`}
            />
            <label htmlFor="password" className="ig-floating-label">
              Password
            </label>

            {password.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-ig-primary-text hover:text-ig-secondary-text select-none py-1 px-1.5 focus:outline-none"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            )}
          </div>

          {/* Log In Button */}
          <button
            type="submit"
            disabled={!isFormFilled || submitting}
            className={`w-full mt-3 py-1.5 px-4 rounded text-sm font-semibold text-white transition duration-150 flex items-center justify-center ${
              isFormFilled && !submitting
                ? 'bg-ig-blue hover:bg-ig-blue-hover cursor-pointer'
                : 'bg-ig-blue-disabled cursor-default opacity-70'
            }`}
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin my-0.5" />
            ) : (
              'Log in'
            )}
          </button>
        </form>

        {/* OR Divider */}
        <div className="w-full flex items-center my-5">
          <div className="flex-1 h-[1px] bg-ig-border"></div>
          <span className="px-4 text-xs font-semibold text-ig-secondary-text">OR</span>
          <div className="flex-1 h-[1px] bg-ig-border"></div>
        </div>

        {/* Log in with Facebook */}
        <button
          type="button"
          onClick={() => alert('Facebook OAuth can be configured in Supabase Auth Providers.')}
          className="flex items-center justify-center space-x-2 text-sm font-semibold text-ig-facebook hover:opacity-90 transition mt-1"
        >
          <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Log in with Facebook</span>
        </button>

        {/* Quick Demo Fill Shortcut if in dev mode */}
        {!supabaseConnected && (
          <button
            type="button"
            onClick={handleUseDemo}
            className="mt-4 text-[11px] text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1 rounded transition"
          >
            ⚡ Autofill Test Account (demo_user)
          </button>
        )}

        {/* Forgot Password */}
        <div className="mt-5 text-center">
          <a
            href="#forgot"
            onClick={(e) => {
              e.preventDefault();
              alert('Password reset link would be sent to your registered email via Supabase Auth.');
            }}
            className="text-xs text-ig-link hover:underline"
          >
            Forgot password?
          </a>
        </div>
      </div>

      {/* Switch to Signup Card */}
      <div className="w-full bg-white border border-ig-border py-5 px-6 rounded-[1px] mt-2.5 text-center">
        <p className="text-sm text-ig-primary-text">
          Don't have an account?{' '}
          <Link to="/signup" className="text-ig-blue font-semibold hover:underline">
            Sign up
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
