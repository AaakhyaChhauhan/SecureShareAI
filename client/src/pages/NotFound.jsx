import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Home, FileQuestion } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="mesh-gradient" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-2xl glass mx-auto mb-6 flex items-center justify-center">
          <FileQuestion size={36} className="text-slate-400" />
        </div>
        <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
        <p className="text-xl text-white mb-2">Page Not Found</p>
        <p className="text-slate-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">
          <Home size={18} />
          Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
