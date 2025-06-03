const jwt = require("jsonwebtoken");
const User = require('../models/user');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Yetkilendirme başarısız: Token bulunamadı' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Geçersiz token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token süresi dolmuş' });
    }
    res.status(401).json({ message: 'Yetkilendirme başarısız' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Yetkilendirme gerekli' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Bu işlem için yetkiniz bulunmamaktadır',
        requiredRole: roles,
        currentRole: req.user.role
      });
    }
    next();
  };
};

module.exports = { protect, authorize };