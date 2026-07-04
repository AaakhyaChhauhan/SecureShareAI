# SecureShare AI

**The modern, AI-powered secure file sharing and threat analysis workspace.**

SecureShare AI is a self-hosted, full-stack web application designed to bundle secure file sharing, automated malware scanning, and AI-driven security analysis into one cohesive platform. Upload files with confidence, organize them effectively, and share them securely—all while getting instant security verdicts.

**AI-Driven • Privacy-First • Auto-Scanning • Local Storage • Password Protected**

---

## 🆕 What's New in v1.2

### 🎨 Client UI Enhancements
A beautiful, modern glassmorphism interface that adapts to your workflow.
- **Dark / Light Mode**: A persistent theme toggle right in the navigation bar.
- **Grid / List Views**: Switch instantly between a dense data table and a visual card grid on your dashboard.

### 📁 Advanced File Organization
Move beyond a flat list of files with robust organization tools.
- **Folders**: Create custom directories and easily move your uploaded files into them for logical grouping.
- **Tags**: Attach custom text tags to files. Tags appear as visual badges to help you sort and identify files at a glance.

### ✉️ Download Notifications
Never wonder if someone received your file.
- **Email Alerts**: Enable notifications on a per-file basis to get an email immediately when someone accesses your shared file via its public link.

---

## 🛠️ The Feature Set

SecureShare AI features a highly specialized toolkit focused on file security and secure distribution. 

### 🛡️ Threat Intelligence
- **VirusTotal Integration** — Every file uploaded is automatically hashed and scanned against 68+ industry-standard antivirus engines.
- **OpenAI Security Summary** — Raw scan data is sent to OpenAI to generate plain-english risk assessments, summaries, and actionable recommendations.

### 🔐 Secure File Sharing
- **Password Protection** — Lock your share links with a cryptographic password.
- **Expiring Links** — Set share links to automatically self-destruct after 1 hour, 1 day, or 7 days.
- **Analytics Tracking** — Monitor total downloads, unique user access, and last download timestamps for every file.

---

## ⚙️ Prerequisites & Quickstart

### Prerequisites
- **Node.js** v18.0.0 or higher
- **MongoDB** (Local instance or MongoDB Atlas)
- **VirusTotal API Key** (Free tier is supported)
- **OpenAI API Key**

### 💻 Manual CLI Startup (Any OS)

**1. Clone the repository**
```bash
git clone https://github.com/AaakhyaChhauhan/SecureShareAI.git
cd SecureShareAI
```

**2. Setup the Backend Server**
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/secureshare
JWT_SECRET=your_super_secret_jwt_key
VIRUSTOTAL_API_KEY=your_virustotal_api_key
OPENAI_API_KEY=your_openai_api_key
CLIENT_URL=http://localhost:5173

# Optional: For Download Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="SecureShare AI" <noreply@secureshare.ai>
```
Start the backend API:
```bash
npm run dev
```

**3. Setup the Frontend Client**
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📖 Developer Documentation

If you want to modify, customize, or contribute to SecureShare AI:
- **Frontend Stack**: React 19, Vite, Tailwind CSS v4, Framer Motion, and Lucide Icons.
- **Backend Stack**: Node.js, Express, Mongoose (MongoDB), Multer, and Nodemailer.
- **Security Notice**: For the current MVP, files are stored locally in the `server/uploads` directory. For a production deployment, we highly recommend extending the Multer storage engine to integrate a cloud provider like AWS S3 or Cloudinary.

---

## 💬 Community & Support
- **GitHub Discussions**: Use the repository discussions for Q&A, feature requests, or sharing custom deployment setups.
- **Report a Bug**: Open an issue on GitHub if you encounter problems or unexpected behavior.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
