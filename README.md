# 🩺 Sa7ti — AI-Powered Mobile Health App

**Sa7ti** is a full-stack AI-powered mobile healthcare application built with React Native (Expo), offering real-time health tracking, disease prediction, smart assistant features, and personalized wellness planning. It integrates a modern mobile user experience with robust backend services and AI-driven insights.

![10](https://github.com/user-attachments/assets/7dfe85d8-fccb-44f7-8cb8-a20a8d09f0b1)
![9](https://github.com/user-attachments/assets/563be971-7df9-446e-9ea1-e40eee85babe)
![8](https://github.com/user-attachments/assets/deb20713-586f-49b4-a163-28c9125cee6b)
![7](https://github.com/user-attachments/assets/a669d245-2379-41c2-ae78-bf737dc425f7)
![6](https://github.com/user-attachments/assets/79392383-8f5f-4510-b715-cd0f543dde18)
![5](https://github.com/user-attachments/assets/c30b7303-2a54-4238-a272-5d5ad11dcf7a)
![4](https://github.com/user-attachments/assets/73d98045-a9ef-46a9-adb1-2813f9c3cb68)
![3](https://github.com/user-attachments/assets/2dd9c65a-3ce2-46bd-be4b-bcc31532c41b)
![2008c5e3-3f77-4168-aeb6-98500af4dbc7](https://github.com/user-attachments/assets/d0f5b6dd-a30f-4b55-b35c-ac46bdd9adec)
![f8d2085f-696d-4b2e-b9fb-25808aefd773](https://github.com/user-attachments/assets/d989d4f1-7220-4cf5-a802-cd2ba3c73faf)
![12](https://github.com/user-attachments/assets/3e992be3-4f6f-44cc-b5ba-66a11076449c)
![11](https://github.com/user-attachments/assets/82af97b9-71c7-479c-85aa-4920768cec73)




---

## 📚 Table of Contents

- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Environment Variables](#-environment-variables)
- [Demo Screens](#-demo-screens)
- [Coming Soon](#-coming-soon)
- [Author](#-author)


---

## 📁 Project Structure

```
📦 Sa7ti/
├── frontend/           # React Native Expo app
├── backend/            # Node.js + Express backend with MongoDB
├── backend-ai/         # FastAPI AI service (health predictions, plans)
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sa7ti-app.git
cd sa7ti-app
```

### 2. Backend (Node.js + MongoDB)

```bash
cd backend
npm install
npm start
```

> ⚠️ Add your `.env` file for MongoDB URI, JWT secret, and email credentials.

### 3. Backend AI (Python + FastAPI)

```bash
cd backend-ai
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

> ⚠️ Add your `.env` file for model paths or settings if needed.

### 4. Frontend (React Native Expo)

```bash
cd frontend
npm install
npx expo start
```

---

## 🧠 Features

### 🏃 Activity Tracking
- Step counter using phone sensors  
- Calories burned estimation  
- Weekly activity chart  

### 🧬 AI-Powered Predictions
- Diabetes and blood pressure prediction  
- Smart assistant for exploring diseases, symptoms, and food calories  

### 🧘 Personalized Health Plans
- Auto-generated fitness & nutrition plans  
- Tailored by age, weight, height, BMI, gender, and goals  

### 📡 Real-Time Vitals
- Real-time health metrics from connected sensors (e.g., MQTT)

### 👤 Profile Management
- Edit profile image and information  
- Persisted data synced with backend  

---

## 💡 Technologies Used

| Layer     | Tech Stack                            |
|-----------|----------------------------------------|
| Frontend  | Expo (React Native), Zustand           |
| Backend   | Node.js, Express, MongoDB              |
| AI Engine | FastAPI, Scikit-learn, YOLOv8          |
| Auth      | JWT, AsyncStorage, Nodemailer          |

---

## 📌 Environment Variables

### `.env` in `backend/`

```
MONGO_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### `.env` in `backend-ai/`

```
MODEL_PATH=./models/diabetes_model.pkl
```

---

## 📲 Demo Screens

Add screenshots of:
- Step Dashboard  
- Prediction Screen  
- Chat AI Assistant  
- Profile Screen  
- Weekly Plan  

---

## 🧪 Coming Soon

- Fall Detection with YOLOv8 (camera stream)  
- Push Notifications  
- Smart Reminders  

---

## 🧑‍💻 Author

Developed with ❤️ by **Mouhamed Khemiri**  
[LinkedIn](https://www.linkedin.com/in/your-link) • [GitHub](https://github.com/your-username)
