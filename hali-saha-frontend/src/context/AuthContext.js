import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('userToken'));
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('userToken');

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('userToken');
        setUser(null);
        setToken(null);
      }
    } else {
      // Ensure state is cleared if items are missing from localStorage
      setUser(null);
      setToken(null);
    }
  }, []);

  const login = (userData, userToken) => {
    console.log('[AuthContext] Login - userData:', userData);
    console.log('[AuthContext] Login - user.role:', userData?.role);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userToken', userToken);
    setUser(userData);
    setToken(userToken);
    // Kullanıcının rolüne göre yönlendirme yapılabilir veya genel bir sayfaya yönlendirilebilir
    // Örnek: navigate(userData.role === 'admin' ? '/admin' : '/');
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    setUser(null);
    setToken(null);
    navigate('/giris'); // veya navigate('/');
    // Notify other parts of the app about logout, e.g., Navbar
    window.dispatchEvent(new Event('authChange')); 
  };

  // Kullanıcının rolünü döndüren bir yardımcı fonksiyon
  const getUserRole = () => {
    return user ? user.role : null;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, getUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
