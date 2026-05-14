# Jarvis AI Chatbot

A modern full-stack AI chatbot application built with React, Node.js, Express, MongoDB, and Groq API. Jarvis allows users to chat with an AI assistant, manage conversations, use voice features, and enjoy a clean responsive interface.

## Live Demo

https://jarvis-ai-chatbot-delta.vercel.app/

## Features

- AI-powered chatbot responses
- User authentication
- Conversation history
- Delete saved conversations
- Voice input support
- Text-to-speech AI response
- Responsive and clean user interface
- MongoDB database integration
- REST API backend
- Frontend deployed on Vercel
- Backend deployment support with Render

## Tech Stack

### Frontend

- React.js
- Vite
- CSS
- Lucide React
- Web Speech API

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- dotenv
- JWT Authentication

### AI Integration

- Groq API

### Deployment

- Vercel
- Render
- MongoDB Atlas

## Project Structure

```bash
Jarvis-AI-Chatbot/
│
├── client/
│   ├── src/
│   │   ├── component/
│   │   │   ├── Auth.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── InputBar.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── utils/
│   │   │   └── speak.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   └── conversationController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Conversation.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   └── conversationRoutes.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

## Getting Started

Follow these steps to run the project locally.

## Clone the Repository

```bash
git clone https://github.com/Puskar10/jarvis-ai-chatbot.git
```

```bash
cd jarvis-ai-chatbot
```

## Frontend Setup

Go to the client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `client` folder and add:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on:

```bash
http://localhost:5173
```

## Backend Setup

Go to the server folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` folder and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm run dev
```

Or run:

```bash
node server.js
```

The backend will run on:

```bash
http://localhost:5000
```

## Environment Variables

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

### Backend

| Variable | Description |
|---|---|
| `PORT` | Server port |
| `MONGO_URI` | MongoDB connection string |
| `GROQ_API_KEY` | Groq API key |
| `JWT_SECRET` | Secret key for JWT authentication |

## API Endpoints

### Authentication

```http
POST /auth/register
```

Register a new user.

```http
POST /auth/login
```

Login an existing user.

### Chat

```http
POST /chat
```

Send a message to the AI chatbot.

### Conversations

```http
GET /conversations/:userId
```

Get all conversations for a user.

```http
GET /conversations/:conversationId/messages
```

Get messages from a specific conversation.

```http
DELETE /conversations/:conversationId
```

Delete a conversation.

## Deployment

## Frontend Deployment

The frontend is deployed on Vercel.

Production URL:

```bash
https://jarvis-ai-chatbot-delta.vercel.app/
```

For deployment, add this environment variable in Vercel:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

## Backend Deployment

The backend can be deployed on Render.

Render settings:

```bash
Build Command: npm install
Start Command: node server.js
```

Add these environment variables in Render:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_jwt_secret_key
```

## Common Issues

### CORS Error

Make sure your deployed frontend URL is added in the backend CORS configuration.

Correct:

```js
"https://jarvis-ai-chatbot-delta.vercel.app"
```

Wrong:

```js
"https://jarvis-ai-chatbot-delta.vercel.app/"
```

### Express Wildcard Route Error

If you get this error:

```bash
PathError [TypeError]: Missing parameter name at index 1: *
```

Replace this:

```js
app.all("*", handler);
```

With this:

```js
app.all("/{*splat}", handler);
```

### Groq Model Error

If a model is deprecated, replace it with a currently supported Groq model.

Example:

```js
model: "llama-3.1-8b-instant"
```

## Future Improvements

- File upload support
- Image upload support
- Chat with documents
- Streaming AI responses
- Dark and light theme
- User profile page
- Google authentication
- GitHub authentication
- Chat export feature

## Author

**Puskar Shaw**

- GitHub: https://github.com/Puskar10
- Live Demo: https://jarvis-ai-chatbot-delta.vercel.app/

## Support

If you like this project, consider giving it a star on GitHub.

## License

This project is open-source and available under the MIT License.
