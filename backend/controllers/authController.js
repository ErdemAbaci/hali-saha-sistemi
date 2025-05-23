const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    // Gerekli alanları kontrol et
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' });
    }

    // Şifre ve onay şifre eşleşiyor mu?
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Şifreler eşleşmiyor.' });
    }

    // Email zaten kayıtlı mı?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu email zaten kayıtlı.' });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const newUser = new User({
      name,
      email,
      phone,           // phone alanını da kaydediyoruz
      password: hashedPassword,
      role: 'customer',
    });

    await newUser.save();

    // JWT token oluştur
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Kayıt sırasında hata oluştu' });
  }
};

    
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Alanları kontrol et
    if (!email || !password) {
      return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' });
    }

    // Kullanıcı var mı kontrol et
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Geçersiz email veya şifre.' });
    }

    // Şifre doğru mu kontrol et
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Geçersiz email veya şifre.' });
    }

    // Token oluştur
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Giriş sırasında hata oluştu' });
  }
};