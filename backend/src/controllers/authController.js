const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { supabase, isConfigured } = require('../config/supabase');

// Fallback in-memory store for development when Supabase credentials are not yet configured
const devUsersStore = [
  {
    id: 'demo-user-1234-uuid',
    email: 'demo@instagram.com',
    full_name: 'Demo Instagrammer',
    username: 'demo_user',
    password_hash: bcrypt.hashSync('Password123', 10),
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: '📸 Photography, tech & travel enthusiast | Welcome to my profile!',
    website: 'https://instagram.com',
    created_at: new Date().toISOString(),
  }
];

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET || 'super_secret_instagram_jwt_key_2026_change_in_production',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { email, fullName, username, password } = req.body;

    // Validation
    if (!email || !fullName || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields (email, full name, username, password) are required.',
      });
    }

    // Enforce 100-character max limit across all fields
    if (email.length > 100 || fullName.length > 100 || username.length > 100 || password.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Input fields cannot exceed 100 characters.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();
    const cleanFullName = fullName.trim();

    // Validate email format (allow phone or standard email)
    const isEmail = validator.isEmail(cleanEmail);
    const isPhone = validator.isMobilePhone(cleanEmail.replace(/[\s-+()]/g, ''));
    if (!isEmail && !isPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address or phone number.',
      });
    }

    // Username format validation (alphanumeric, underscores, periods; 4-100 chars)
    const usernameRegex = /^[a-zA-Z0-9._]{4,100}$/;
    if (!usernameRegex.test(cleanUsername)) {
      return res.status(400).json({
        success: false,
        message: 'Username must be 4-100 characters and can only contain letters, numbers, periods, and underscores.',
      });
    }

    // Password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(cleanUsername)}`;

    // Database interaction
    if (isConfigured && supabase) {
      // Check if email or username already taken
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('id, email, username')
        .or(`email.eq.${cleanEmail},username.eq.${cleanUsername}`);

      if (checkError) {
        console.error('Supabase query error:', checkError);
        return res.status(500).json({
          success: false,
          message: 'Database check failed: ' + checkError.message,
        });
      }

      if (existingUsers && existingUsers.length > 0) {
        const emailTaken = existingUsers.some((u) => u.email.toLowerCase() === cleanEmail);
        const usernameTaken = existingUsers.some((u) => u.username.toLowerCase() === cleanUsername);

        if (usernameTaken) {
          return res.status(400).json({
            success: false,
            message: 'This username isn’t available. Please try another.',
          });
        }
        if (emailTaken) {
          return res.status(400).json({
            success: false,
            message: 'Another account is using this email or mobile number.',
          });
        }
      }

      // Insert new user into Supabase
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            email: cleanEmail,
            full_name: cleanFullName,
            username: cleanUsername,
            password_hash: passwordHash,
            avatar_url: avatarUrl,
            bio: 'Welcome to my Instagram!',
            website: '',
          },
        ])
        .select('id, email, full_name, username, avatar_url, bio, website, created_at')
        .single();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        return res.status(500).json({
          success: false,
          message: 'Failed to create user: ' + insertError.message,
        });
      }

      const token = generateToken(newUser);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        token,
        user: newUser,
        source: 'supabase',
      });
    } else {
      // Dev mode fallback
      const emailTaken = devUsersStore.some((u) => u.email === cleanEmail);
      const usernameTaken = devUsersStore.some((u) => u.username === cleanUsername);

      if (usernameTaken) {
        return res.status(400).json({
          success: false,
          message: 'This username isn’t available. Please try another.',
        });
      }
      if (emailTaken) {
        return res.status(400).json({
          success: false,
          message: 'Another account is using this email or mobile number.',
        });
      }

      const devUser = {
        id: `user-${Date.now()}`,
        email: cleanEmail,
        full_name: cleanFullName,
        username: cleanUsername,
        password_hash: passwordHash,
        avatar_url: avatarUrl,
        bio: 'Welcome to my Instagram!',
        website: '',
        created_at: new Date().toISOString(),
      };

      devUsersStore.push(devUser);

      const { password_hash, ...safeUser } = devUser;
      const token = generateToken(safeUser);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully (Dev Mode)!',
        token,
        user: safeUser,
        source: 'dev-fallback',
        warning: 'Supabase credentials not configured yet. Registered in temporary dev memory.',
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration.',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both your username/email and password.',
      });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    let user = null;

    if (isConfigured && supabase) {
      // Find user by either email or username in Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${cleanIdentifier},username.eq.${cleanIdentifier}`)
        .limit(1);

      if (error) {
        console.error('Supabase query error during login:', error);
        return res.status(500).json({
          success: false,
          message: 'Authentication service error: ' + error.message,
        });
      }

      if (data && data.length > 0) {
        user = data[0];
      }
    } else {
      // Dev mode fallback
      user = devUsersStore.find(
        (u) => u.email === cleanIdentifier || u.username === cleanIdentifier
      );
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Sorry, your username or password was incorrect. Please double-check your credentials.',
      });
    }

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Sorry, your password was incorrect. Please double-check your password.',
      });
    }

    const token = generateToken(user);
    const { password_hash, ...safeUser } = user;

    return res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: safeUser,
      source: isConfigured ? 'supabase' : 'dev-fallback',
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login.',
    });
  }
};

// @desc    Get current user profile from token
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware
    return res.json({
      success: true,
      user: req.user,
      supabaseConnected: isConfigured,
    });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile.',
    });
  }
};

// @desc    Check if username is available in real-time
// @route   GET /api/auth/check-username?username=xyz
const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username || username.trim().length < 4) {
      return res.json({ available: false, message: 'Username must be at least 4 characters' });
    }
    if (username.length > 100) {
      return res.json({ available: false, message: 'Username cannot exceed 100 characters' });
    }

    const cleanUsername = username.trim().toLowerCase();

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('username', cleanUsername)
        .limit(1);

      if (error) {
        return res.status(500).json({ available: false, error: error.message });
      }

      return res.json({ available: !data || data.length === 0 });
    } else {
      const exists = devUsersStore.some((u) => u.username === cleanUsername);
      return res.json({ available: !exists });
    }
  } catch (error) {
    return res.status(500).json({ available: false, error: error.message });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  checkUsername,
  devUsersStore,
};
