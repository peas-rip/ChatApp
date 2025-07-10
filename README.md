# 💬 Real-Time Chat Application

A full-stack real-time chat application built using **Django Channels**, **WebSockets**, **Redis**, and a **React (Vite)** frontend. This project enables seamless, scalable, bi-directional communication using ASGI and WebSocket protocols.

---

## 🚀 Features

- 🔗 Real-time messaging using WebSockets
- 🧠 Django Channels + Redis for message routing
- 👥 Dynamic room-based chat using unique room codes
- 🌐 Frontend built with React (Vite) for fast performance
- 🛡️ CORS-enabled backend for smooth frontend-backend communication
- ⚙️ ASGI-powered backend with Daphne for WebSocket support

---

## 🛠️ Tech Stack

### Backend
- **Django 5.2**
- **Django Channels**
- **Redis** (via `channels_redis`)
- **Daphne** (ASGI server)
- **django-cors-headers**

### Frontend
- **React** (with Vite)
- **JavaScript (ES6+)**
- **WebSocket API**

---

## 📁 Project Structure

📁 Project Structure

.
├── Chat_backend/               # Django backend
│   ├── chat/                   # Django app (WebSocket logic)
│   ├── Chat_backend/           # Django project config
│   ├── db.sqlite3              # Local DB (development)
│   └── manage.py               # Django entry point
├── quickroom-react-chat/       # React + Vite frontend
│   ├── src/                    # React source files
│   ├── public/                 # Static files
│   ├── tailwind.config.ts      # Tailwind config
│   └── vite.config.ts          # Vite config

yaml
Copy
Edit

---

## ⚙️ Setup Instructions

### Prerequisites

- Python 3.11+
- Redis installed locally or via Docker
- Node.js + npm (for frontend)
- Daphne installed (via requirements.txt)

---

### 🔧 Backend (Django + Channels + Redis)

```bash
git clone https://github.com/yourusername/realtime-chat-app.git
cd Chat_backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
Start Redis server:

bash
Copy
Edit
redis-server
Or via Docker:

bash
Copy
Edit
docker run -p 6379:6379 redis
Run Django using Daphne:

bash
Copy
Edit
daphne chatproject.asgi:application
💻 Frontend (React + Vite)
bash
Copy
Edit
cd frontend
npm install
npm run dev
Access the frontend at: http://localhost:8080

🔌 WebSocket Usage
Open your browser or tool like wscat, then connect to:

bash
Copy
Edit
ws://localhost:8000/ws/chat/<room_code>/
Replace <room_code> with a valid room ID (e.g., ABC123).

📤 To send a message:

json
Copy
Edit
{
  "message": "Hello world!"
}
📥 Server will echo back the message to all users in that room.

🧪 Testing Tools
Browser Dev Console

WebSocketKing

wscat (CLI): npm install -g wscat

📦 requirements.txt
ini
Copy
Edit
Django==5.2.4
channels==4.0.0
channels-redis==4.2.0
daphne==4.1.0
djangorestframework==3.15.1
django-cors-headers==4.3.1
python-dotenv==1.0.1
✨ Future Enhancements
✅ User authentication with JWT or session

✅ Chat history storage in DB

✅ Room expiration/cleanup logic

✅ Online user presence tracking

✅ UI enhancements with Tailwind CSS

📄 License
This project is licensed under the MIT License. Feel free to fork, modify, and use it in your own apps.

👤 Author
Darshan K
Full-stack Developer | Python & JavaScript Enthusiast
📧 darshanhardy123@gmail.com
🌐 linkedin.com/in/darshan-k-18b605339

If you find this project helpful, give it a ⭐ on GitHub!
