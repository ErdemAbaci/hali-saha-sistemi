const checkRole = (roles) => {
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

module.exports = checkRole; 