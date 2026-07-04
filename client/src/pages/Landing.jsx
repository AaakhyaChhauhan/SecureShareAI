import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, ScanLine, Brain, Link2, Lock, BarChart3, 
  ArrowRight, Sparkles, CheckCircle2, Zap, Server, 
  Users, Star, Cloud, FileText
} from 'lucide-react';
import Footer from '../components/layout/Footer';

const features = [
  {
    icon: ScanLine,
    title: 'Virus Scanning',
    description: 'Every file is scanned against 68+ antivirus engines via VirusTotal for comprehensive threat detection.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Brain,
    title: 'AI Security Summary',
    description: 'OpenAI-powered analysis generates risk assessments and actionable recommendations for every file.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Link2,
    title: 'Secure Share Links',
    description: 'Generate expiring, password-protected share links. Control exactly who accesses your files.',
    gradient: 'from-emerald-500 to-cyan-500',
  },
  {
    icon: Lock,
    title: 'Password Protection',
    description: 'Add an extra layer of security with optional password protection on shared files.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: BarChart3,
    title: 'Download Analytics',
    description: 'Track who downloads your files with detailed analytics including download count and timestamps.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'JWT authentication, bcrypt encryption, Helmet protection, and CORS configuration built-in.',
    gradient: 'from-blue-500 to-indigo-500',
  },
];

const steps = [
  { step: '01', title: 'Upload', description: 'Drag & drop your files — PDFs, DOCX, ZIPs, or images.' },
  { step: '02', title: 'Scan', description: 'Automatic virus scan against 68+ antivirus engines.' },
  { step: '03', title: 'Analyze', description: 'AI generates a security summary with risk assessment.' },
  { step: '04', title: 'Share', description: 'Create secure, expiring links with optional passwords.' },
];

const stats = [
  { value: '2.5M+', label: 'Files Scanned', icon: ScanLine },
  { value: '99.9%', label: 'Threat Detection', icon: Shield },
  { value: '500k+', label: 'Active Users', icon: Users },
  { value: '< 2s', label: 'Avg. Scan Time', icon: Zap },
];

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Cybersecurity Analyst',
    content: 'SecureShare AI has completely transformed how our team handles external document sharing. The AI insights catch things we might have missed.',
    avatar: 'S'
  },
  {
    name: 'David Chen',
    role: 'Freelance Designer',
    content: 'I send large design files to clients daily. Knowing they are automatically scanned and password-protected gives me complete peace of mind.',
    avatar: 'D'
  },
  {
    name: 'Elena Rodriguez',
    role: 'IT Director',
    content: 'The combination of VirusTotal engines and OpenAI summaries is genius. It is like having a dedicated security analyst for every single file.',
    avatar: 'E'
  }
];

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="mesh-gradient" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4 overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/8 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[140px]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Decorative Floating Card 1 (Left) */}
          <motion.div
            initial={{ opacity: 0, x: -40, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:flex absolute top-32 -left-16 glass rounded-2xl p-4 items-center gap-4 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] animate-float"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-emerald-400" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-white">Verified Safe</div>
              <div className="text-xs text-slate-400">0/68 Threats Detected</div>
            </div>
          </motion.div>

          {/* Decorative Floating Card 2 (Right) */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="hidden lg:flex absolute top-48 -right-12 glass rounded-2xl p-4 items-center gap-4 border border-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.1)] animate-float"
            style={{ animationDelay: '1.5s' }}
          >
            <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
              <Brain size={20} className="text-violet-400" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-white">AI Analysis</div>
              <div className="text-xs text-slate-400">Risk Level: Low</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8">
              <Sparkles size={14} className="text-cyan-400" />
              <span className="text-sm text-slate-300">Next-Gen File Security Platform</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Share Files with
            <br />
            <span className="gradient-text">AI-Powered Security</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 text-balance"
          >
            Upload, scan for malware, get AI security insights, and share files
            through encrypted, expiring links. All in one platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            <Link to="/register" className="btn btn-primary text-base px-8 py-3.5 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              Get Started Free
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary text-base px-8 py-3.5 rounded-xl">
              Sign In
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex items-center justify-center gap-4 text-sm text-slate-500 mb-4"
          >
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-cyan-400"/> No credit card required</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="flex items-center gap-1.5"><Shield size={14} className="text-cyan-400"/> Enterprise encryption</span>
          </motion.div>

          {/* Shield visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16 relative flex items-center justify-center w-full max-w-4xl mx-auto"
          >
            {/* Left floating file */}
            <div className="hidden md:flex absolute left-4 lg:left-12 flex-col items-center gap-2 animate-float" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                  <FileText size={28} className="text-cyan-400" />
                </div>
                {/* Upload indicator */}
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 border-2 border-slate-900 animate-pulse" />
              </div>
              <div className="text-xs text-slate-400 font-medium">report.pdf</div>
              {/* Connecting line */}
              <div className="absolute top-1/2 left-full w-12 lg:w-24 h-[2px] border-t-2 border-dashed border-cyan-500/30 -z-10" />
            </div>

            <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-pulse-glow" />
              <div className="absolute inset-4 rounded-full border border-blue-500/15" />
              <div className="absolute inset-8 rounded-full border border-violet-500/10" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 gradient-primary rounded-2xl blur-xl opacity-40" />
                  <div className="relative glass-strong p-6 rounded-2xl">
                    <Shield size={48} className="text-cyan-400" />
                  </div>
                </div>
              </div>

              <div
                className="absolute left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"
                style={{ animation: 'scanLine 3s ease-in-out infinite' }}
              />

              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-cyan-400/60"
                  style={{
                    top: `${50 + 45 * Math.sin((angle * Math.PI) / 180)}%`,
                    left: `${50 + 45 * Math.cos((angle * Math.PI) / 180)}%`,
                    animation: `pulse 2s ease-in-out ${i * 0.3}s infinite`,
                  }}
                />
              ))}
            </div>

            {/* Right floating link */}
            <div className="hidden md:flex absolute right-4 lg:right-12 flex-col items-center gap-2 animate-float" style={{ animationDelay: '0.8s' }}>
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <Link2 size={28} className="text-emerald-400" />
                </div>
                {/* Lock indicator */}
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900 flex items-center justify-center">
                  <Lock size={8} className="text-slate-900" />
                </div>
              </div>
              <div className="text-xs text-slate-400 font-medium">secure_link</div>
              {/* Connecting line */}
              <div className="absolute top-1/2 right-full w-12 lg:w-24 h-[2px] border-t-2 border-dashed border-emerald-500/30 -z-10" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-cyan-500/10 flex items-center justify-center mb-3">
                  <stat.icon size={24} className="text-cyan-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need for
              <span className="gradient-text"> Secure Sharing</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A comprehensive security platform that protects your files from upload to download.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card group cursor-default relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-2.5 mb-4 transition-transform group-hover:scale-110 shadow-lg`}>
                  <feature.icon size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed relative z-10">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure Visualization */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-violet-500/10" />
            
            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Enterprise-Grade Infrastructure</h2>
                <ul className="space-y-4">
                  {[
                    'End-to-end data encryption in transit',
                    'Direct integration with VirusTotal API',
                    'OpenAI semantic analysis engine',
                    'Distributed cloud architecture'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative h-64 bg-black/20 rounded-2xl border border-white/10 flex items-center justify-center p-8">
                 {/* Visual representation of cloud infra */}
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                 <div className="relative z-10 flex items-center justify-center gap-6 w-full">
                    <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                      <Cloud className="text-cyan-400" size={32} />
                    </div>
                    <div className="h-1 flex-1 bg-gradient-to-r from-cyan-500 to-violet-500 relative">
                      <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping" />
                    </div>
                    <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                      <Server className="text-violet-400" size={32} />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-slate-400">Four simple steps to secure file sharing</p>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/30 via-blue-500/20 to-transparent" />

            <div className="space-y-12">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="card inline-block">
                      <span className="text-xs font-bold text-cyan-400 tracking-widest">{step.step}</span>
                      <h3 className="text-xl font-bold text-white mt-1 mb-2">{step.title}</h3>
                      <p className="text-sm text-slate-400">{step.description}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full gradient-primary glow-primary relative z-10" />
                  </div>

                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 border-t border-white/5 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Loved by <span className="gradient-text">Professionals</span></h2>
            <p className="text-slate-400">See what our users have to say about SecureShare AI.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card flex flex-col"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
                </div>
                <p className="text-slate-300 italic mb-6 flex-1">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center font-bold text-white shadow-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-10 md:p-16 text-center relative overflow-hidden border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4 text-white">
                Start Securing Your Files <span className="gradient-text">Today</span>
              </h2>
              <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
                Join thousands of professionals who trust SecureShare AI to protect their data, scan for malware, and share files safely.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="btn btn-primary text-lg px-10 py-4 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-105 transition-transform">
                  Create Free Account
                  <ArrowRight size={20} />
                </Link>
                <span className="text-sm text-slate-500">No credit card required.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
