<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-54-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
</p>

<h1 align="center">
  🌿 Mansik
</h1>

<p align="center">
  <strong>Your AI-Powered Mental Wellness Companion</strong>
</p>

<p align="center">
  An empathetic, privacy-first mobile app that combines conversational AI, mood tracking,<br/>
  guided journaling, and behavioral pattern recognition to support your mental well-being.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.5.0-36e236?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/license-ISC-blue?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/encryption-AES--256--CBC-critical?style=flat-square" alt="AES-256" />
  <img src="https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey?style=flat-square" alt="Platform" />
</p>

---

## ✨ Highlights

| | Feature | Description |
|---|---|---|
| 🤖 | **AI Conversations** | Empathetic chat powered by Google Gemini with CBT-style reflection |
| 🛡️ | **Crisis Detection** | Zero-latency rule-based detection with instant safety resources |
| 📓 | **Smart Journaling** | AI-analyzed entries with emotion inference, tags, and key themes |
| 📊 | **Pattern Insights** | Statistical behavioral analysis over mood trends and emotional patterns |
| 🔐 | **Privacy-First** | AES-256-CBC encryption at rest for all user content |
| 🫁 | **Breathing Exercises** | Guided sessions with Lottie animations and haptic feedback |
| 📰 | **Curated Articles** | Mood-aware RSS recommendations from trusted mental health sources |
| 🎨 | **Glassmorphic UI** | Hand-crafted frosted-glass design with spring animations |

---

## 🏗️ Architecture

```
+----------------------------------------------------------------------+
|                       Mansik MOBILE APP                            |
|                React Native (Expo) + Zustand                         |
|                                                                      |
|  +----------+  +----------+  +----------+  +----------+              |
|  |   Home   |  | Journal  |  | Insights |  | Profile  |              |
|  +----+-----+  +----+-----+  +----+-----+  +----+-----+              |
|       |              |              |              |                 |
|  +----+-----+  +----+-----+  +----+-----+  +----+-----+              |
|  |   Chat   |  |   Mood   |  | Breathing|  | Settings |              |
|  |  Screen  |  |   Flow   |  | Exercise |  | Security |              |
|  +----------+  +----------+  +----------+  +----------+              |
+-----------------------------------+----------------------------------+
                                    |
                          REST API (Axios + JWT)
                                    |
+-----------------------------------+----------------------------------+
|                      EXPRESS.JS BACKEND                              |
|            Helmet  *  CORS  *  Rate Limiting  *  Morgan              |
|                                                                      |
|  +-------------------- Message Pipeline --------------------+        |
|  |                                                          |        |
|  |  User Message                                            |        |
|  |       |                                                  |        |
|  |       v                                                  |        |
|  |  +----------+    YES    +---------------------+          |        |
|  |  |  Crisis  |---------->| Safety Response +   |          |        |
|  |  |  Detect  |           | Helpline Resources  |          |        |
|  |  +----+-----+           +---------------------+          |        |
|  |       | NO                                               |        |
|  |       v                                                  |        |
|  |  +----------+    +----------+    +----------+            |        |
|  |  | Emotion  |--->| Context  |--->|  Gemini  |            |        |
|  |  |  Infer   |    | Retrieve |    | AI Chat  |            |        |
|  |  +----------+    +----------+    +----+-----+            |        |
|  |                                       |                  |        |
|  |                                       v                  |        |
|  |                                 +-----------+            |        |
|  |                                 | Encrypt & |            |        |
|  |                                 |  Persist  |            |        |
|  |                                 +-----------+            |        |
|  +----------------------------------------------------------+        |
|                                                                      |
|  +------------ Three-Tier Memory Architecture --------------+        |
|  |                                                          |        |
|  |  Short-Term    Last 10 messages (sliding window)         |        |
|  |  Medium-Term   Daily Memory (AI daily summaries)         |        |
|  |  Long-Term     Pattern Memory (statistical trends)       |        |
|  |                                                          |        |
|  +----------------------------------------------------------+        |
+-----------------------------------+----------------------------------+
                                    |
                                    v
+----------------------------------------------------------------------+
|                            MONGODB                                   |
|                                                                      |
|  Users * ChatSessions * ChatMessages (encrypted)                     |
|  MoodEntries * DailyMemories (encrypted) * UserPatternMemory         |
+----------------------------------------------------------------------+
```

---

## 🧠 Three-Tier Memory System

One of Mansik's most distinctive features is its **layered memory architecture** that mimics how humans process emotional experiences:

### ⚡ Short-Term Memory
> Last **10 chat messages** serve as a sliding-window context for the AI, enabling natural multi-turn conversations without losing recent context.

### 📅 Medium-Term Memory (Daily Summaries)
> At the end of each day, an **AI-generated summary** captures the dominant emotion, average mood, key stressors, and thematic tags — creating a structured emotional narrative of the day. Summaries are encrypted at rest.

### 📈 Long-Term Memory (Pattern Engine)
> A **statistical pattern engine** runs pure algorithms (no AI calls) over accumulated daily memories to detect:
>
> | Pattern | What It Detects |
> |---------|----------------|
> | **Baseline Mood** | Average emotional state across all data points |
> | **Mood Trend** | Upward, downward, or stable — comparing last 7 vs. previous 7 days |
> | **Dominant Emotion** | Most frequent emotion over the last 14 days |
> | **Recurring Tags** | Themes that appear repeatedly (work, stress, relationships, etc.) |
> | **Mood Variance** | Emotional volatility via standard deviation |

---

## 🛡️ Crisis Detection

Mansik takes user safety seriously with a **zero-latency, rule-based crisis detection system** that runs **before** any AI processing:

- 🔍 &nbsp;**50+ phrase patterns** covering suicidal ideation, self-harm, hopelessness, and farewell signals
- ⚡ &nbsp;**Instant response** — no network call to external AI; regex-based O(1) matching
- 🆘 &nbsp;**Helpline resources** — iCall, Vandrevala Foundation, Crisis Text Line, findahelpline.com
- 🚫 &nbsp;**AI bypass** — when crisis is detected, the LLM is never invoked; the safety response is returned immediately
- 🏷️ &nbsp;**Audit trail** — messages are still persisted with an `isCrisis: true` flag

---

## 🎨 Design Philosophy

Mansik's UI is **entirely hand-crafted** — no external component libraries.

| Principle | Implementation |
|-----------|---------------|
| **Glassmorphism** | Frosted-glass cards with `expo-blur` BlurView and semi-transparent white backgrounds |
| **Ambient Backgrounds** | Custom `GlowOrb` components — concentric circles with layered opacity create a soft, ethereal atmosphere |
| **Haptic Feedback** | Expo Haptics on breathing phase transitions and UI interactions |
| **Spring Animations** | Custom floating tab bar with animated bubble that rises and springs into position |
| **Mood-Adaptive UI** | Quick actions, preset labels, and intervention cards dynamically change based on mood score |
| **Color Palette** | Calming nature-inspired greens (`#36e236` primary, `#f6faf6` bg) with slate text tones |

---

## 📱 Screens & Features

<table>
<tr>
<td width="50%">

### 🏠 Home
- Personalized greeting with time-of-day awareness
- **SVG Mood Ring** — circular progress visualization
- Inspirational daily quote
- Context-sensitive AI quick actions
- Breathing suggestion card (shown when mood < 4)
- Recent journal previews + curated articles
- Pull-to-refresh

</td>
<td width="50%">

### 💬 AI Chat
- Multi-turn conversations with Google Gemini
- Ambient glow orb background with blur effects
- Pulsing AI avatar with breathing animation
- **Smart suggestion chips** — context-aware based on keywords in AI responses
- Real-time typing indicator
- Crisis-aware with special styled crisis bubbles
- Session management (clear / new chat)

</td>
</tr>
<tr>
<td width="50%">

### 📓 Journal
- **3-step mood flow:** Slider → Emotion Preset → Freeform Writing
- AI-powered analysis on save (emotion, tags, key themes)
- Searchable paginated journal list
- Mood-colored cards with emotion emoji badges
- Read-only viewer with AI summary, tags, and stressors
- Encrypted-at-rest indicators

</td>
<td width="50%">

### 📊 Insights Dashboard
- **Daily Summaries** — navigate between days with AI-generated emotional narratives
- **Baseline Mood** — overall average with progress bar
- **Mood Trend** — directional indicators (↑ ↓ →)
- **Dominant Emotion** — with emoji visualization
- **Recurring Tags** — frequency-ranked tag pills
- Milestone badges (1, 3, 7, 14, 30 days)

</td>
</tr>
<tr>
<td width="50%">

### 🫁 Breathing Exercises
- **Data-driven exercise registry** (4-4-4, 4-7-8 — easily extensible)
- Lottie animation synced to breathing cycle
- Haptic feedback on phase transitions
- Millisecond-precision timer
- Screen keep-awake during sessions
- Phase label fade animations

</td>
<td width="50%">

### 👤 Profile
- Account settings & security info
- Privacy details surfacing AES-256 encryption
- Notification preferences
- Help & support section
- Sub-screen navigation via local state

</td>
</tr>
</table>

---

## 🔐 Security & Privacy

| Layer | Measure |
|-------|---------|
| **Data at Rest** | AES-256-CBC encryption with random IVs for all chat messages, AI responses, journal entries, and daily summaries |
| **Authentication** | Stateless JWT with secure token storage (`expo-secure-store`) and automatic refresh |
| **Password Safety** | bcrypt hashing, `select: false` on passwordHash field, `toJSON()` stripping — defense in depth |
| **API Security** | Helmet headers, CORS, rate limiting (150 req/15min in production) |
| **Token Refresh** | Queued concurrent request replay on 401 with race-condition prevention |
| **Production Enforcement** | Critical env vars (`JWT_SECRET`, `ENCRYPTION_SECRET`, `GEMINI_API_KEY`) enforced at startup |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local or Atlas)
- **Expo CLI** — `npm install -g expo-cli`
- **Google Gemini API Key** — [Get one here](https://aistudio.google.com/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Mansik.git
cd Mansik
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mental_wellness
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_SECRET=your_encryption_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

Start the backend:

```bash
npm run dev          # Development (with nodemon)
# or
npm start            # Production
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Update the API base URL in `src/config.js` to point to your backend:

```javascript
export const API_BASE_URL = 'http://<YOUR_LOCAL_IP>:5000/api';
```

> **Tip:** Run `npm run dev` which automatically detects your IP via the `update_ip.js` script.

Start the Expo development server:

```bash
npm run dev          # Auto-detects IP + starts Expo
# or
npx expo start       # Manual start
```

Scan the QR code with **Expo Go** (Android) or the Camera app (iOS).

---

## 📁 Project Structure

```
Mansik/
├── backend/
│   ├── server.js                 # Entry point
│   ├── src/
│   │   ├── app.js                # Express app setup
│   │   ├── config/               # DB connection & env config
│   │   ├── controllers/          # Route handlers
│   │   ├── middleware/            # Auth & error handling
│   │   ├── models/               # Mongoose schemas
│   │   │   ├── ChatMessage.js    #   Encrypted messages
│   │   │   ├── ChatSession.js    #   Session management
│   │   │   ├── DailyMemory.js    #   AI daily summaries
│   │   │   ├── MoodEntry.js      #   Dual mood scoring
│   │   │   ├── User.js           #   Auth model
│   │   │   └── UserPatternMemory.js  # Behavioral patterns
│   │   ├── routes/               # API route definitions
│   │   ├── services/             # Business logic
│   │   │   ├── aiService.js      #   Gemini integration
│   │   │   ├── chatService.js    #   Message pipeline
│   │   │   ├── crisisService.js  #   Crisis detection
│   │   │   ├── emotionService.js #   Emotion inference
│   │   │   ├── dailyMemoryService.js   # Daily summaries
│   │   │   ├── patternMemoryService.js # Pattern analysis
│   │   │   ├── journalTaggingService.js # AI journal tags
│   │   │   └── articleService.js #   RSS recommendations
│   │   └── utils/                # Encryption, JWT, validators
│   └── scripts/                  # Seed & verification scripts
│
├── frontend/
│   ├── App.js                    # Root component
│   ├── src/
│   │   ├── api/                  # Axios client + interceptors
│   │   ├── components/           # Reusable UI components
│   │   ├── navigation/           # Stack + Tab navigators
│   │   ├── screens/              # All app screens
│   │   ├── services/             # API service modules
│   │   └── stores/               # Zustand state stores
│   └── assets/                   # Lottie animations, articles
│
└── README.md
```

---

## 🛠️ Tech Stack

<table>
<tr>
<td width="50%">

### Frontend
| Technology | Purpose |
|------------|---------|
| React Native 0.81 | Cross-platform mobile framework |
| Expo 54 | Development & build tooling |
| React Navigation 7 | Stack + bottom tab navigation |
| Zustand 5 | Lightweight state management |
| Axios | HTTP client with interceptors |
| Expo SecureStore | Encrypted token storage |
| Lottie | Breathing exercise animations |
| Expo Haptics | Tactile feedback |
| Expo Blur | Glassmorphic blur effects |
| React Native SVG | Mood ring visualization |

</td>
<td width="50%">

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose 9 | Document database & ODM |
| Google Gemini 2.5 Flash | Conversational AI & analysis |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| crypto (AES-256-CBC) | Content encryption at rest |
| Helmet | HTTP security headers |
| express-rate-limit | API rate limiting |
| Winston | Structured logging |
| rss-parser | Article feed aggregation |

</td>
</tr>
</table>

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/refresh` | Refresh JWT token |
| `POST` | `/api/chat/new-session` | Start a new chat session |
| `POST` | `/api/chat/message` | Send message & receive AI response |
| `GET`  | `/api/chat/history/:sessionId` | Retrieve decrypted chat history |
| `POST` | `/api/mood/journal` | Submit mood entry + journal |
| `GET`  | `/api/memory` | Get paginated daily memories |
| `GET`  | `/api/memory/pattern` | Get user pattern analysis |
| `GET`  | `/api/dashboard` | Dashboard data (quote, mood, journals, articles) |
| `GET`  | `/api/articles` | Mood-aware article recommendations |
| `GET`  | `/api/health` | Server health check |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## ⚠️ Disclaimer

Mansik is a **wellness companion tool** designed to support emotional well-being. It is **not** a substitute for professional mental health care. If you or someone you know is in crisis, please contact:

- **iCall** — 9152987821
- **Vandrevala Foundation** — 1860-2662-345
- **Crisis Text Line** — Text HOME to 741741
- **Find a Helpline** — [findahelpline.com](https://findahelpline.com)

---

## 📄 License

This project is licensed under the **ISC License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <br/>
  <strong>Built with 💚 for mental wellness</strong>
  <br/><br/>
  <img src="https://img.shields.io/badge/🌿_Mansik-Find_Your_Inner_Peace-36e236?style=for-the-badge" alt="Mansik" />
</p>
