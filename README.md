# 🥦 AI-Powered Fruit & Vegetable Analysis App 🍎

An AI-driven application that analyzes images of fruits and vegetables to provide insights such as:

✅ Moisture Content 💧  
✅ Quality Score ⭐  
✅ Current Market Price (Scraped from BigBasket) 💰  

---

## 🚀 Features
- AI-based image analysis 📸
- Real-time price fetching from BigBasket 🛒
- LLM Integration 🚀
- Next.js frontend ⚛️
- FastAPI backend ⚡

---

## 📂 Clone the Repository
```sh
git clone https://github.com/beinghadibadami/shakbhaji.git
cd shakbhaji
```

---

## 🏗️ Setup Instructions

### 🔹 Frontend (Next.js)
1️⃣ Install [Node.js](https://nodejs.org/) (if not installed) 🛠️
2️⃣ Navigate to the frontend folder 📂
```sh
cd frontend
```
3️⃣ Install dependencies 📦
```sh
npm install
```
4️⃣ Run the development server 🚀
```sh
npm run dev
```
Frontend will be live at: `http://localhost:3000`

---

### 🔹 Backend (FastAPI)
1️⃣ Install Python (if not installed) 🐍
2️⃣ Create and activate a virtual environment 🏗️
```sh
python -m venv venv  # Create virtual environment
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate  # On Windows
```
3️⃣ Navigate to the backend folder 📂
```sh
cd backend
```
4️⃣ Install dependencies 📦
```sh
pip install -r requirements.txt
```
5️⃣ Get a free API key from [Groq Cloud](https://groq.com/) and add it to your environment variables 🔑
```sh
export GROQ_API_KEY='your_api_key_here'  # On macOS/Linux
set GROQ_API_KEY='your_api_key_here'  # On Windows
```
6️⃣ Run the FastAPI server 🚀
```sh
uvicorn main:app --reload
```
Backend will be live at: `http://127.0.0.1:8000`

---

🔹 Database Setup (MongoDB)

1️⃣ Install [MongoDB](https://www.mongodb.com/try/download/community) if not installed 🗄️ 

2️⃣ Start the MongoDB server 📡 
```sh 
mongod --dbpath <your-db-path> 
``` 
3️⃣ Ensure MongoDB is running before starting the backend ✅

---
## 📌 Contributing
Feel free to fork the repo, raise issues, or submit pull requests! 🤝

---

### 🌟 Star the repo if you like it! ⭐

