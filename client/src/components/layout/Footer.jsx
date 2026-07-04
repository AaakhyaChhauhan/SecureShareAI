import { motion } from 'framer-motion';
import { Shield, Globe, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="CloakBox Logo" 
              className="w-6 h-6 rounded-md opacity-80 hover:opacity-100 transition-opacity" 
            />
            <span className="text-sm font-semibold gradient-text">CloakBox</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} CloakBox. Secure file sharing powered by AI.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
              <Globe size={18} />
            </a>
            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
