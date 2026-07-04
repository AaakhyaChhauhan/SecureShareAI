# SecureShare AI 🛡️

A next-generation, secure file-sharing platform that automatically scans uploaded files for malware and generates an AI-based security summary using OpenAI. Users can share files securely through password-protected, expiring links.

## 🚀 Features

- **End-to-End File Sharing**: Upload and securely store PDFs, DOCX, ZIPs, and images.
- **VirusTotal Integration**: Automatic malware scanning against 68+ antivirus engines.
- **AI Security Summary**: OpenAI analyzes the scan results to provide plain-english risk assessments and recommendations.
- **Secure Share Links**: Generate unique share links with optional password protection.
- **Analytics**: Track download counts and file access history.
- **Premium UI**: Modern, glassmorphism design with responsive elements and beautiful animations.
- **Enterprise Security**: Built with JWT authentication, Bcrypt password hashing, Helmet for HTTP headers, and standard CORS protection.

## 🛠️ Tech Stack

**Frontend:**
- React 19 + Vite
- Tailwind CSS v4
- Framer Motion (Animations)
- React Router DOM
- Lucide React (Icons)

**Backend:**
- Node.js & Express
- MongoDB (Mongoose)
- JWT (JSON Web Tokens)
- Multer (File handling)
- VirusTotal API
- OpenAI API

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- VirusTotal API Key
- OpenAI API Key

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/secureshare-ai.git
cd "secureshare-ai"
```

### 2. Setup Backend Server
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
```

Start the server:
```bash
npm run dev
```

### 3. Setup Frontend Client
Open a new terminal window:
```bash
cd client
npm install
```

Start the React app:
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

## 🔒 Security Notice
For the MVP, files are stored locally in the `server/uploads` directory. For a production deployment, it is highly recommended to integrate a cloud storage provider like AWS S3 or Cloudinary.

## 📄 License
MIT License
