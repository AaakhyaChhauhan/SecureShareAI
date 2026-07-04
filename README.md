<p align="center">
  <img src="client/public/logo.png" alt="CloakBox Logo" width="200" />
</p>

# 🛡️CloakBox

### AI-Powered Secure File Sharing Platform with Malware Detection, Intelligent Security Insights, and Privacy-First Architecture

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg)
![Express](https://img.shields.io/badge/Express.js-Backend-black.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green.svg)
![OpenAI](https://img.shields.io/badge/OpenAI-AI-orange.svg)

---

#  Overview

CloakBox is a modern full-stack cybersecurity platform that combines secure file management with AI-powered threat intelligence.

Instead of simply uploading files, CloakBox allows users to securely organize, manage, and share documents while leveraging AI-powered security analysis, malware detection, intelligent file organization, and download tracking—all from one unified dashboard.

Built for developers, cybersecurity professionals, researchers, students, and organizations that require secure document management.

> **Privacy-First • AI-Driven • Secure Sharing • Modern Dashboard**

---

#  What's New

##  Folder Management

Organize uploaded files using dedicated folders.

- Create folders
- Organize uploaded files
- Improved workspace management

---

##  Smart Tagging

Categorize files using custom tags.

- Add multiple tags
- Filter files
- Better organization

---

##  Download Email Notifications

Receive email notifications whenever someone downloads your shared files.

Features include:

- Download alerts
- Notification preferences
- Nodemailer integration

---

##  Theme Toggle

Switch between

- Light Mode
- Dark Mode

User preferences are automatically remembered.

---

## 🗂 Grid & List View

View uploaded files in

- Grid Layout
- List Layout

Choose whichever layout best fits your workflow.

---

#  Core Features

##  Authentication

- JWT Authentication
- Secure Password Hashing (bcrypt)
- Protected API Routes
- Session Management
- User Profile Settings

---

##  Secure File Upload

Upload and securely manage

- PDF
- DOCX
- Images
- ZIP Files

with backend validation.

---

##  Malware Detection

Uploaded files can be scanned using the VirusTotal API.

Features

- Malware Detection
- Threat Classification
- Risk Levels
- Scan Reports

Risk Indicators

🟢 Safe

🟡 Suspicious

🔴 Malicious

---

##  AI Security Summary

OpenAI automatically generates easy-to-understand security summaries.

Example

> This document appears safe to distribute. No known malware signatures were detected.

or

> Potential malicious content detected. Review the scan results before sharing.

---

## 🔗 Secure Sharing

Generate secure sharing links with

- Password Protection
- Expiration Dates
- Private Links
- Download Tracking

---

##  Dashboard

Monitor

- Uploaded Files
- Shared Files
- Downloads
- Security Reports
- Storage Usage
- Recent Activity

---

##  Folder Workspace

Organize documents using

- Folders
- Categories
- Smart Tags

---

# 🏗 System Architecture

```
React Frontend
       │
       ▼
Express REST API
       │
       ▼
MongoDB Database
       │
       ├───────────────┐
       ▼               ▼
VirusTotal API     OpenAI API
       │               │
       └──────┬────────┘
              ▼
      CloakBox Dashboard
```

---

# Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Framer Motion

---

## Backend

- Node.js
- Express.js
- JWT
- Multer
- Nodemailer

---

## Database

- MongoDB
- Mongoose

---

## AI & APIs

- OpenAI API
- VirusTotal API

---

## Security

- JWT Authentication
- bcrypt
- Helmet
- CORS
- Environment Variables

---

# 📁 Project Structure

```
CloakBox/

│

├── client/

│ ├── public/

│ ├── src/

│ ├── components/

│ ├── pages/

│ ├── services/

│ └── package.json

│

├── server/

│ ├── config/

│ ├── controllers/

│ ├── middleware/

│ ├── models/

│ ├── routes/

│ ├── services/

│ ├── uploads/

│ ├── utils/

│ ├── package.json

│ └── server.js

│

├── README.md

└── .gitignore
```

---

# 📦 Feature Modules

| Module | Description |
|---------|-------------|
| Authentication | JWT Login & Registration |
| Dashboard | User Analytics |
| File Upload | Secure Document Upload |
| Malware Scanner | VirusTotal Integration |
| AI Summary | OpenAI Security Analysis |
| Folder Management | Organize Files |
| Smart Tags | File Categorization |
| Email Notifications | Download Alerts |
| Secure Sharing | Password Protected Links |
| Analytics | Download Tracking |
| Theme Toggle | Dark / Light Mode |
| Grid/List View | Multiple File Layouts |

---

#  Security Features

- JWT Authentication
- Password Hashing
- Protected API Routes
- Secure File Validation
- Password Protected Sharing
- Helmet Security Headers
- Environment Variable Protection
- CORS Configuration

---

#  Dashboard Features

The dashboard provides

- File Statistics
- Download Analytics
- Shared Files Overview
- Storage Usage
- Folder Overview
- Recent Activity

---

#  AI Capabilities

CloakBox uses OpenAI to

- Explain malware scan reports
- Generate security summaries
- Provide risk recommendations
- Simplify technical findings

---

#  Email Notifications

CloakBox currently supports

- Email alerts when a shared file is downloaded
- Notification preferences
- Secure email delivery using Nodemailer

---

#  Installation

## Clone Repository

```bash
git clone https://github.com/AaakhyaChhauhan/CloakBox.git
```

```bash
cd CloakBoxAI
```

---

## Install Frontend

```bash
cd client
npm install
```

---

## Install Backend

```bash
cd ../server
npm install
```

---

## Configure Environment Variables

Create

```
server/.env
```

Example

```
MONGO_URI=

JWT_SECRET=

OPENAI_API_KEY=

VIRUSTOTAL_API_KEY=

EMAIL_USER=

EMAIL_PASS=
```

---

## Run Backend

```bash
npm run dev
```

---

## Run Frontend

```bash
cd client
npm run dev
```

---

# 📸 Screenshots

Include screenshots of

- Landing Page
- Dashboard
- Upload Interface
- AI Security Summary
- Folder Management
- File Details
- Theme Toggle
- Grid/List View

---

# 🛣 Roadmap

Planned Features

- Google OAuth Authentication
- Two-Factor Authentication (2FA)
- Email notifications for shared links
- Link expiration reminders
- Security alert notifications
- QR Code Sharing
- Cloud Storage Integration (AWS S3)
- Team Collaboration
- Admin Dashboard
- Audit Logs
- Real-Time Notifications
- File Versioning
- Activity Timeline

---

#  Why CloakBox ?

Unlike traditional cloud storage platforms, CloakBox combines secure file sharing with cybersecurity intelligence by offering:

- AI-powered security summaries
- Malware detection
- Secure file sharing
- Password-protected links
- Download analytics
- Smart organization with folders and tags
- Email notifications
- Modern responsive dashboard

---

#  Author

## Aakhya Chhauhan

**B.Tech Computer Science (Cyber Security)**

GitHub: https://github.com/AaakhyaChhauhan

---

#  Contributing

Contributions, feature suggestions, and bug reports are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

# 📄 License

Distributed under the MIT License.

See the LICENSE file for more information.
