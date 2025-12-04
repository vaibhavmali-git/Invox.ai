# InvoAIce

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1+-blue.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.19+-brightgreen.svg)](https://www.mongodb.com/)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)](https://github.com)

**Intelligent Invoice Management Powered by AI**

InvoAIce is a modern invoicing platform designed to simplify client billing, automate repetitive workflows, and provide meaningful insights into financial activity. The application includes AI-powered text-to-invoice generation using Google Gemini, a clean dashboard for tracking performance, and a straightforward interface for managing invoices and client information.

---

## Screenshots

### Dashboard & AI Features
| AI Insights Dashboard | AI Text-to-Invoice |
| :---: | :---: |
| ![Dashboard](./docs/dashboard.png) | ![AI Modal](./docs/ai-create-modal.png) |
| *Visualizes your business financial health with AI-powered insights* | *Convert natural language to structured invoice data instantly* |

### Complete User Journey
**Landing Page**
![Landing Page](./docs/landing-page.png)

**All Invoices**
![All Invoices](./docs/all-invoices.png)

**Print & PDF Preview**
![Print/PDF](./docs/print-pdf-preview.png)

---

## Features

- **AI-Powered Invoice Creation** - Convert plain text descriptions into fully-structured invoices using Google Gemini AI
- **Dashboard** - Dashboard with revenue, outstanding payments, and AI summary insights  
- **Secure Authentication** - JWT-based user authentication with bcryptjs password hashing
- **Invoice Management** - Create, edit, view, and delete invoices with a clean, intuitive interface
- **PDF & Print Export** - Generate professional PDF documents or print-ready invoices
- **Payment Reminders** - Set and manage automatic payment reminders for clients
- **Business Profiles** - Customize your business profile with company details
- **Modern UI** - Built with Tailwind CSS for a clean, professional appearance

---

## Tech Stack

### Frontend
- **React 19.1** - Modern UI framework with hooks and functional components
- **Vite** - Build tool and development server
- **React Router v7** - Client-side routing and navigation
- **Tailwind CSS 4.1** - Utility-first CSS framework for styling
- **Lucide React** - Beautiful, consistent icon library
- **Axios** - HTTP client for API communication
- **React Hot Toast** - Toast notifications for user feedback
- **Moment.js** - Date formatting and manipulation

### Backend
- **Node.js & Express 5.1** - High-performance server and REST API framework
- **MongoDB 8.19** - NoSQL database for data persistence
- **Mongoose** - Object modeling for MongoDB
- **Google Generative AI** - Gemini API for AI-powered features
- **JWT** - Secure token-based authentication
- **Bcryptjs** - Password hashing and encryption
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development server auto-restart

---

## Folder Structure

```
InvoAIce/
├── backend/                    # Express.js REST API server
│   ├── src/
│   │   ├── server.js          # Server entry point
│   │   ├── config/
│   │   │   └── db.js          # MongoDB connection
│   │   ├── controllers/       # Business logic
│   │   │   ├── ai.controller.js
│   │   │   ├── auth.controller.js
│   │   │   └── invoice.controller.js
│   │   ├── models/            # Mongoose schemas
│   │   │   ├── user.model.js
│   │   │   └── invoice.model.js
│   │   ├── routes/            # API endpoints
│   │   │   ├── ai.route.js
│   │   │   ├── auth.route.js
│   │   │   └── invoice.route.js
│   │   └── middlewares/       # Custom middleware
│   │       ├── auth.middleware.js
│   │       └── upload.middleware.js
│   └── package.json
│
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── main.jsx           # React entry point
│   │   ├── App.jsx            # Root component
│   │   ├── index.css          # Global styles
│   │   ├── components/        # Reusable components
│   │   │   ├── AIInsightsCard.jsx
│   │   │   ├── Auth/
│   │   │   ├── Invoices/
│   │   │   ├── Landing/
│   │   │   ├── Layout/
│   │   │   └── Ui/
│   │   ├── pages/             # Page components
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Invoices/
│   │   │   ├── LandingPage/
│   │   │   └── ProfilePage/
│   │   ├── context/           # React context (Auth)
│   │   ├── utils/             # Utility functions
│   │   │   ├── apiPath.js
│   │   │   ├── axiosInstance.js
│   │   │   ├── helper.js
│   │   │   └── pdf.js
│   │   └── assets/            # Images, icons, etc.
│   └── package.json
│
├── docs/                       # Screenshots and documentation
├── README.md                   # This file
└── .gitignore
```

---

## Environment Variables

### Frontend (`/frontend/.env.example`)
```env
VITE_BACKEND_URL=http://localhost:8000
```

### Backend (`/backend/.env.example`)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/invox
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

> **⚠️ Important**: Never commit actual `.env` files to version control. Always use `.env.example` as a template and keep sensitive credentials secure.

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn package manager
- MongoDB account (local or cloud)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vaibhavmali-git/InvoAIce.git
   cd InvoAIce
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` folder
   - Add your MongoDB URI, JWT secret, and Gemini API key

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   - Create a `.env` file in the `frontend` folder
   - Set your backend URL

4. **Run the Application**

   **Development Mode (Terminal 1 - Backend)**
   ```bash
   cd backend
   npm run dev
   ```
   The backend server will start on `http://localhost:8000`

   **Development Mode (Terminal 2 - Frontend)**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend application will start on `http://localhost:5173`

5. **Build for Production (Frontend)**
   ```bash
   cd frontend
   npm run build
   ```
   The production-ready files will be generated in the `dist` folder.

---

## API Documentation

The backend provides a comprehensive REST API for all invoicing operations:

- **Authentication** - User registration, login, and token management (`/api/auth`)
- **Invoice Management** - CRUD operations for invoices (`/api/invoices`)
- **AI Features** - AI-powered invoice generation and processing (`/api/ai`)

---

## 📦 Dependencies

### Backend
- Express.js - Web framework
- MongoDB + Mongoose - Database
- Google Generative AI - AI capabilities
- JWT - Authentication
- Bcryptjs - Password security
- Multer - File handling
- CORS - Cross-origin support

### Frontend
- React - UI library
- Vite - Build tool
- React Router - Navigation
- Tailwind CSS - Styling
- Axios - HTTP requests
- Lucide React - Icons

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute to InvoAIce, please feel free to submit a pull request or open an issue for discussion.

---
