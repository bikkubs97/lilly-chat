# Lilly — AI Mental Health Companion

A full-stack web application providing empathetic AI chat support, private journaling, and mood tracking for emotional wellness.

![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-13AA52?logo=mongodb)

**Live Demo**: [https://www.lillychat.live/](https://www.lillychat.live/)

## 🌸 Features

- **Warm Chat Support**: AI-powered conversations designed to feel like talking to a caring friend
- **Private Journaling**: Capture thoughts, track personal growth, and reflect safely
- **Mood Tracking**: Log your emotional state after each chat and visualize patterns with an interactive calendar
- **User Authentication**: Secure JWT-based login and signup with nickname personalization
- **Privacy-First**: All conversations and journal entries are stored privately per user

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Components**: React with shadcn/ui components
- **Markdown**: react-markdown for rich text rendering

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **AI**: OpenAI API integration

### DevTools
- **Linting**: ESLint
- **Package Manager**: npm
- **Build Tool**: Turbopack

## 📋 Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- OpenAI API key
- npm or yarn

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/bikkubs97/lilly-chat.git
cd lilly-chat
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/lilly-chat

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# AI
OPENAI_API_KEY=sk-your-openai-api-key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with SEO metadata
│   ├── page.tsx                # Homepage
│   ├── not-found.tsx           # 404 page
│   ├── globals.css             # Global styles
│   ├── chat/                   # Chat page
│   ├── journal/                # Journal page
│   ├── moodboard/              # Moodboard calendar page
│   ├── login/                  # Login page
│   ├── signup/                 # Signup page
│   ├── api/                    # API routes
│   │   ├── chat/               # Chat API endpoint
│   │   ├── journal/            # Journal CRUD endpoint
│   │   ├── moodboard/          # Moodboard API endpoint
│   │   ├── login/              # Login endpoint
│   │   └── signup/             # Signup endpoint
│   └── _partials/              # Shared components
│       ├── header.tsx          # Navigation bar
│       └── footer.tsx          # Footer with links
├── components/ui/              # shadcn/ui components
├── lib/
│   ├── mongodb.ts              # MongoDB connection
│   ├── auth.ts                 # JWT authentication helpers
│   └── utils.ts                # Utility functions
└── models/
    ├── user.ts                 # User Mongoose schema
    ├── journal.ts              # Journal entry schema
    └── mood.ts                 # Mood log schema
```

## 🔑 Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/signup` | Create a new user account |
| POST | `/api/login` | Authenticate and receive JWT |
| POST | `/api/chat` | Send message to AI (requires auth) |
| GET | `/api/journal` | Fetch user's journal entries |
| POST | `/api/journal` | Create new journal entry |
| GET | `/api/moodboard` | Fetch user's mood entries |
| POST | `/api/moodboard` | Create mood entry with AI analysis |

## 🎨 Design Highlights

- **Dark Theme**: Slate-950 and violet-950 gradient with purple/fuchsia accents
- **Glassmorphism**: Translucent panels with backdrop blur for depth
- **Smooth Animations**: Rounded corners, hover scales, and typing animations
- **Responsive**: Mobile-first design with seamless tablet/desktop experience
- **Accessibility**: ARIA labels, semantic HTML, focus states

## 🔐 Security

- Passwords hashed with bcrypt
- JWT tokens for stateless authentication
- HTTPS-ready deployment
- MongoDB connection pooling
- Environment variables for secrets

## 📊 Mood Tracking Algorithm

The moodboard analyzes chat messages using OpenAI's API to detect emotional tone and categorize into:

- 🔴 Crisis/Extreme (Red)
- 🔵 Depressed (Blue)
- ⚪ Neutral/Calm (Gray)
- 🟢 Happy/Content (Emerald)

Moods are visualized on an interactive calendar with color-coded badges.

## ⚖️ Disclaimer

**Lilly is not a substitute for professional mental health care.** If you are experiencing a crisis or have suicidal thoughts, please contact:

- **National Suicide Prevention Lifeline**: 1-800-273-8255
- **Crisis Text Line**: Text HOME to 741741
- **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/

## 📝 License

This project is licensed under the MIT License — see the LICENSE file for details.

## 👤 Author

**Bikku BS**

- GitHub: [@bikkubs97](https://github.com/bikkubs97)
- Email: bikku4444@gmail.com

---

Built with ❤️ for emotional wellness.