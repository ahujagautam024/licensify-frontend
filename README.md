Licensify - Centralized Software License Management

Licensify is a full-stack application designed to streamline the management of software licenses within organizations. It supports both end users and admins for license requests, approvals, and tracking.

---

🚀 Features

- Firebase Authentication with Role-based Routing (User/Admin)
- Centralized license vault with request workflows
- Admin review, approval, and comment system
- Dashboard with real-time stats and request history
- Responsive UI built using React, TailwindCSS, and ShadCN

---

🛠️ Tech Stack

Frontend:
- React + Vite
- Tailwind CSS + ShadCN UI
- Axios for API calls
- Firebase Auth

Backend:
- Node.js with Express
- MongoDB with native driver
- dotenv for environment variables

---

🔐 Environment Setup

Create a `.env` file at the root of your frontend and backend projects.

**Frontend (.env):**
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
VITE_BACKEND_BASE_URL=http://localhost:3000
```

**Backend (.env):**
```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>
PORT=3000
```

---

📦 Install & Run

**Frontend:**
```
cd client
npm install
npm run dev
```

**Backend:** https://github.com/ahujagautam024/licensify-server
```
cd server
npm install
npm run start
```

---

🧪 Firebase Setup

Ensure your Firebase project has Email/Password sign-in enabled under Authentication.

---

📁 Folder Structure

- `/client` - Frontend React app
- `/server` - Backend Node.js API


---

📷 Logo

The logo file `logo.png` is available under `/public` and used in the login and landing page.

---

🎨 Credits

Developed using modern UI libraries, utility-first CSS, and RESTful API principles. Special thanks to ShadCN and Lucide for icons and components.
