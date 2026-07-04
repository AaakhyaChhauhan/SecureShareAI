import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, LogOut, Upload, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass sticky top-0 z-50" style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-3 group">
            <img 
              src="/logo.png" 
              alt="SecureShare AI Logo" 
              className="w-9 h-9 rounded-xl transition-transform group-hover:scale-105 shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
            />
            <span className="text-lg font-bold gradient-text">SecureShare AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`btn btn-ghost text-sm ${location.pathname === '/dashboard' ? 'text-cyan-400' : ''}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className="btn btn-primary text-sm"
                >
                  <Upload size={16} />
                  Upload
                </Link>
                <div className="w-px h-8 bg-white/10 mx-2" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm text-slate-300">{user?.name}</span>
                  <button onClick={handleLogout} className="btn btn-ghost text-sm text-slate-400 hover:text-red-400 p-2">
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden btn btn-ghost p-2"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="block py-2 px-3 rounded-lg hover:bg-white/5 text-slate-300" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <Link to="/upload" className="block py-2 px-3 rounded-lg hover:bg-white/5 text-cyan-400" onClick={() => setMobileOpen(false)}>Upload File</Link>
                  <hr className="border-white/10 my-2" />
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left py-2 px-3 rounded-lg hover:bg-white/5 text-red-400">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block py-2 px-3 rounded-lg hover:bg-white/5 text-slate-300" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/register" className="block py-2 px-3 rounded-lg gradient-primary text-white text-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
