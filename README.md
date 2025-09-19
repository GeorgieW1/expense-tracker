GeoLedger 💰

GeoLedger is a modern Expense Tracker Dashboard built with Next.js, TailwindCSS, and Firebase.
It helps you manage your finances by tracking income, expenses, and savings in real time.

Users can:

Create an account with Firebase authentication

Log in securely

Add, view, and delete transactions

See a dashboard with spending charts, savings rate, and monthly overview

Track expenses in Nigerian Naira (₦)

🚀 Features

🔐 Authentication – Signup, login, logout using Firebase

📊 Real-time Dashboard – Balance, income, expenses, and spending breakdown

💰 Transaction Management – Add, view, and delete transactions

🥧 Charts & Analytics – Expense categories, savings rate, and monthly overview

📱 Responsive Design – Works across all devices

⚡ Real-time Updates – Transactions update instantly using Firebase Firestore

🛡️ Secure Data – Each user only accesses their own data

🖥️ Tech Stack

Next.js
 – React Framework

Tailwind CSS
 – Styling

Firebase Authentication
 – Login/Signup

Firebase Firestore
 – Database

Recharts
 – Charts

⚙️ Installation

Clone the repo

git clone https://github.com/GeorgieW1/expense-tracker.git
cd GeoLedger


Install dependencies

npm install


Add environment variables
Create a .env.local file in the root folder and add your Firebase config:

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id


Run the project

npm run dev

🔑 Firebase Setup Guide
Step 1: Create Firebase Project

Go to Firebase Console

Click Add Project → Follow the setup

Step 2: Enable Authentication

Go to Authentication → Sign-in method

Enable Email/Password

Step 3: Create Firestore Database

Go to Firestore Database → Create database

Start in test mode (switch to secure rules later)

Step 4: Get Firebase Config

Go to Project Settings → General → Your apps

Register a Web app and copy the config

Step 5: Add Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}

📷 Screenshots
Dashboard

<img width="1905" height="974" alt="Screenshot 2025-09-19 124047" src="https://github.com/user-attachments/assets/e9d854df-fda8-4a28-ab10-4de9c5f1bbc9" />

Transactions
<img width="1906" height="960" alt="Screenshot 2025-09-19 124109" src="https://github.com/user-attachments/assets/2c4d766f-66e4-4298-8694-a96e38852c9a" />

<img width="1902" height="927" alt="Screenshot 2025-09-19 124125" src="https://github.com/user-attachments/assets/8227bffa-5a20-461b-89bb-fcef43bc345b" />


Analytics
<img width="1899" height="972" alt="Screenshot 2025-09-19 124147" src="https://github.com/user-attachments/assets/b8fe7cd8-3fde-4e9a-952e-a7830707962b" />


📜 License

This project is licensed under the MIT License.
You’re free to use, modify, and distribute it.

✨ With GeoLedger, you can finally take control of your finances and track your spending with ease!
