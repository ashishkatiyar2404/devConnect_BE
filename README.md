# DevConnect Backend API 🚀

DevConnect is a matchmaking and networking platform engineered specifically for software developers. It enables developers to discover peers, send signals ("interested" or "ignored"), accept or reject connection requests, and engage in instant real-time messaging once connected.

This repository houses the **RESTful Backend API** and **Socket.IO Real-time Engine** powering DevConnect.

---

## 🌟 Key Features

- **Robust Authentication & Session Management**:
  - Secure credential hashing using `bcrypt` (10 salt rounds).
  - Stateless JSON Web Token (`JWT`) authentication transmitted over secure, `httpOnly` cookies.
  - Strict input validation via `validator` (strong passwords, RFC-compliant email formatting).

- **Profile Management**:
  - Profile inspection, updating safe user fields (`about`, `gender`, `age`, `photoUrl`, `skills`, `firstName`, `lastName`).
  - Secure password changes with old-password verification and hashing.

- **Connection Request Lifecycle**:
  - Send connection signals (`interested` or `ignored`).
  - Atomic review state transitions (`accepted` or `rejected`) preventing race conditions.
  - Comprehensive safety guards: blocks self-connections and duplicate requests.

- **Smart Developer Feed Engine**:
  - Intelligent recommendation feed that dynamically excludes existing connections, pending requests, and the authenticated user.
  - High-performance query pagination support (`page` and `limit`).

- **Real-Time Messaging (WebSockets)**:
  - Bi-directional instant chat powered by `Socket.IO`.
  - Deterministic SHA-256 room generation between participant pairs.
  - Persistent message history stored in MongoDB.

- **Automated Cloud Notifications & Schedulers**:
  - Transactional email notifications via **AWS Simple Email Service (SES)** on new connection signals.
  - Daily automated background cron jobs (`node-cron`) to remind developers of pending connection requests.

- **Standardized API Contract**:
  - Predictable `{ success, message, data }` JSON response envelope across all endpoints.
  - Proper RESTful HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`).
  - Centralized 404 route handling and global error middleware.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Runtime Environment** | Node.js |
| **Web Framework** | Express.js (v5) |
| **Database & ODM** | MongoDB, Mongoose |
| **Real-Time Communication** | Socket.IO |
| **Authentication & Crypto** | JSON Web Tokens (`jsonwebtoken`), `bcrypt`, `crypto` |
| **Cloud Services** | AWS SES (`@aws-sdk/client-ses`) |
| **Job Scheduling** | `node-cron`, `date-fns` |
| **Validation & Middleware** | `validator`, `cookie-parser`, `cors`, `dotenv` |

---

## 📁 Project Architecture

```plaintext
devTinder_BE/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection handler
│   │   └── sesClient.js         # AWS SES client configuration
│   ├── jobs/
│   │   └── cronjob.js           # Daily automated notification cron job
│   ├── middleware/
│   │   └── auth.js              # UserAuth JWT cookie validation middleware
│   ├── models/
│   │   ├── Chat.js              # Chat and message subdocument schemas
│   │   ├── connectionRequest.js # Request schema with compound indexes
│   │   └── user.js              # User document schema, validators, and methods
│   ├── routes/
│   │   ├── auth.js              # /signup, /login, /logout
│   │   ├── chat.js              # /chat/:targetUserId message history
│   │   ├── profile.js           # /profile/view, /profile/edit, /profile/password
│   │   ├── request.js           # /request/send and /request/review
│   │   └── user.js              # /user/feed, /user/connections, /user/request/received
│   ├── services/
│   │   ├── sendEmail.js         # SES email dispatch service
│   │   └── socket.js            # Socket.IO connection and event handler
│   ├── utils/
│   │   └── validation.js        # Input sanitization and validation helpers
│   └── index.js                 # HTTP server bootstrap, socket init, and 404/error middleware
├── .env                         # Environment variables (secret)
├── package.json                 # Project dependencies and scripts
└── README.md                    # Project documentation
```

---

## 🔌 API Reference

All successful responses follow the unified envelope:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

All errors follow:
```json
{
  "success": false,
  "message": "Error description"
}
```

### 1. Authentication (`/`)
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user | `201 Created` |
| `POST` | `/login` | Authenticate user & issue JWT cookie | `200 OK` |
| `POST` | `/logout` | Invalidate session cookie | `200 OK` |

### 2. Profile Management (`/`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/profile/view` | Fetch current logged-in user details | Yes |
| `PATCH` | `/profile/edit` | Update profile information | Yes |
| `PATCH` | `/profile/password` | Change user password | Yes |

### 3. Connection Requests (`/`)
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/request/send/:status/:toUserId` | Send signal (`interested` or `ignored`) | `201 Created` |
| `POST` | `/request/review/:status/:requestId`| Review incoming request (`accepted` or `rejected`)| `200 OK` |

### 4. User Network & Feed (`/`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/user/request/received` | List incoming connection requests | Yes |
| `GET` | `/user/connections` | List accepted connections | Yes |
| `GET` | `/user/feed?page=1&limit=10`| Fetch personalized developer feed | Yes |

### 5. Chat & WebSocket Events
- **REST**:
  - `GET /chat/:targetUserId` — Fetch full chat history between two users.
- **Socket.IO Events**:
  - `joinChat` (`{ firstName, userId, targetUserId }`): Joins deterministic room.
  - `sendMessage` (`{ firstName, lastName, userId, targetUserId, text }`): Persists message and emits `messageReceived`.
  - `messageReceived`: Broadcasts message to room members.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8000

# Authentication
JWT_TOKEN_SECRET_KEY=your_super_secret_jwt_key

# Database
DB_SECRECT_KEY=mongodb+srv://<username>:<password>@cluster.mongodb.net/devConnectBE

# AWS Simple Email Service (SES)
AWS_SES_ACCESS_KEY=your_aws_access_key
AWS_SES_SECRET_KEY=your_aws_secret_key
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas Cluster)
- An active AWS account with SES access (optional, for email notifications)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ashishkatiyar2404/devTinder_BE.git
   cd devTinder_BE
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file based on the template above.

4. **Run the server**:
   - **Development Mode** (with Nodemon):
     ```bash
     npm run dev
     ```
   - **Production Mode**:
     ```bash
     npm start
     ```

The server will start listening at `http://localhost:8000`.

---

## 👨‍💻 Author

**Ashish Katiyar**  
- GitHub: [@ashishkatiyar2404](https://github.com/ashishkatiyar2404)

---

## 📄 License

This project is licensed under the **ISC License**.
