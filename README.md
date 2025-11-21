
# 🛒 Full Stack E-commerce Web App – React + Node.js + MongoDB

A fully functional **E-commerce platform** built using **React**, **Node.js**, **Express**, and **MongoDB**, now enhanced with an **AI-powered chatbot** to assist users with product recommendations, order queries, and support. This application supports user authentication, product listings, cart management, order tracking, and an admin dashboard – all within a responsive, mobile-friendly UI.

---

## 🔥 Key Features

✅ Modern UI with React and responsive design  
✅ Product catalog with filtering and category views  
✅ JWT-based user authentication and authorization  
✅ Shopping cart with quantity management  
✅ AI Chatbot powered by Ollama (local LLM)
✅ Secure checkout and order tracking  
✅ Admin dashboard for managing products and orders  
✅ RESTful API built with Express.js  
✅ Persistent storage with MongoDB (Atlas/local)

---

## 🛠 Tech Stack

| Layer         | Technology Used             |
|---------------|------------------------------|
| **Frontend**  | React, React Router, Axios    |
| **Backend**   | Node.js, Express.js           |
| **Database**  | MongoDB, Mongoose             |
| **Authentication** | JWT, bcrypt             |
| **AI Model** | Ollama (local LLM)             |
| **Other**     | dotenv, concurrently          |

---

## 🚀 Getting Started

### ✅ Prerequisites

* Node.js and npm installed  
* MongoDB (local or Atlas)  
* Git CLI (optional but recommended)

---

### 🧰 Installation Steps

```bash
# Clone the repository
git clone https://github.com/Samdisha-Walia/E-commerce-App.git
cd E-commerce-App
````

---

### 🔙 Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Then run:

```bash
npm run dev
```

---

### 🖥️ Set Up the Frontend

```bash
cd vite-frontend
npm install
npm start
```

Visit `http://localhost:3000` in your browser to explore the frontend.

---
### 🤖 Start the AI Model (Chatbot)
Run the selected Ollama model in a separate terminal:

```bash
ollama run llama3

```


---

## 🔐 Environment Variables

| Variable     | Description                            |
| ------------ | -------------------------------------- |
| `PORT`       | Port for Express server (default 5000) |
| `MONGO_URI`  | MongoDB connection string              |
| `JWT_SECRET` | Secret key for JWT token signing       |

---

## 🌱 Future Enhancements

* 🛒 Razorpay/Stripe payment gateway integration
* 🗂️ Product reviews and ratings
* ✉️ Email confirmation & notifications
* 🌍 Deployment on Render + Vercel/Netlify
* 📊 Sales analytics dashboard for admin
* 🔐 Role-based permissions for staff/admin

---

## 👤 Author

**Samdisha Walia**
[GitHub](https://github.com/Samdisha-Walia) • [LinkedIn](https://linkedin.com/in/samdisha-walia)

---

## ⭐️ Support This Project

If you liked this project, consider giving it a ⭐️ on GitHub to show your support.

> 📝 *Built for learning, portfolio, and showcasing full-stack MERN development skills.*

```
