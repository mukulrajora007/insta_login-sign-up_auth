const jwt = require('jsonwebtoken');
const { supabase, isConfigured } = require('../config/supabase');

// Fallback in-memory cache for dev mode
const devUsersStore = require('../controllers/authController').devUsersStore;

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secret_instagram_jwt_key_2026_change_in_production'
    );

    if (isConfigured && supabase) {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, full_name, username, avatar_url, bio, website, created_at')
        .eq('id', decoded.id)
        .single();

      if (error || !user) {
        return res.status(401).json({
          success: false,
          message: 'User associated with this session no longer exists.',
        });
      }

      req.user = user;
    } else {
      // Dev mode fallback
      const user = devUsersStore ? devUsersStore.find(u => u.id === decoded.id) : null;
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Session invalid or user not found.',
        });
      }
      const { password_hash, ...safeUser } = user;
      req.user = safeUser;
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.',
      });
    }
    return res.status(403).json({
      success: false,
      message: 'Invalid or malformed authentication token.',
    });
  }
};

module.exports = authenticateToken;
