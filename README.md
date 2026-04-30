# ⚡ Ethara.AI - Team Task Manager

![Live Status](https://img.shields.io/badge/Status-Live-success)
![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Tailwind-blue)
![Backend](https://img.shields.io/badge/Backend-Python%20%7C%20FastAPI-green)

Ethara.AI is an enterprise-grade, full-stack team task management application. It provides a clean, highly responsive dashboard for creating projects, assigning tasks, and tracking team progress in real-time.

**[View the Live Application Here](https://ethara-task-manager.netlify.app)**

---

## 🚀 Features

* **Interactive Dashboard:** Premium, glass-morphism UI with real-time state management.
* **Project Organization:** Group tasks by specific campaigns or project IDs.
* **Status Tracking:** Instantly visualize pending, active, and completed tasks.
* **Responsive Design:** Fully mobile-optimized layout using Tailwind CSS.
* **Secure API:** Custom Python backend serving RESTful endpoints.

---

## 🛠️ Tech Stack

**Frontend (Deployed on Netlify):**
* React.js (Vite)
* Tailwind CSS
* Axios (API Communication)

**Backend (Deployed on Render):**
* Python 3
* FastAPI
* Uvicorn (ASGI Server)
* SQLAlchemy / SQLite

---

## 💻 Local Setup & Installation

If you want to run this project on your local machine, follow these steps:

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/im-shobhit/Ethara-Task-Manager.git
cd Ethara-Task-Manager
\`\`\`

### 2. Start the Backend Server
\`\`\`bash
cd backend
python -m venv venv
source venv/Scripts/activate  # On Windows
pip install -r requirements.txt
uvicorn main:app --reload
\`\`\`
*The API will run on http://localhost:8000*

### 3. Start the Frontend Development Server
Open a new terminal window:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
*The UI will run on http://localhost:5173*

---

## 👨‍💻 Author

Built by **Shobhit Rawat**
* [GitHub Profile](https://github.com/im-shobhit)