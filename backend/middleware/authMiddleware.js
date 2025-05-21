const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Yetkisiz: Token yok' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // token içindeki user id, role vs burada
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Yetkisiz: Token geçersiz' });
    }
  };
  
  module.exports = authMiddleware;