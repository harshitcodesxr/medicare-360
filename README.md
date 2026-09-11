# MEDICARE 360

## AI-Assisted Smart Patient Flow & Hospital Management System

**Tagline**: "From patient arrival to treatment, intelligently."

MEDICARE 360 is a comprehensive full-stack hospital management system that intelligently manages patient journeys through AI-assisted triage, dynamic queue management, real-time bed allocation, and multi-role dashboards.

---

## 🌟 Features

### Core Features
- **AI-Assisted Triage**: Intelligent symptom evaluation with priority scoring (Critical/Medium/Normal)
- **Dynamic Queue Management**: Smart queue prioritization based on urgency + waiting time + fairness
- **Real-Time Updates**: Live queue, notifications, and bed status using Socket.IO
- **Role-Based Access Control**: 5 distinct user roles with specialized dashboards
- **Complete Patient Journey**: Registration → Triage → Queue → Consultation → Diagnostics → Treatment → Admission → Discharge
- **Bed Management**: Real-time ICU and General Ward capacity tracking
- **Lab Management**: Test requests, sample collection, report generation
- **Pharmacy Management**: Prescription tracking and medicine dispensing
- **Admin Dashboard**: Hospital analytics and resource monitoring

### User Roles
1. **Patient**: Self-service portal for registration, symptom submission, queue tracking, and medical records
2. **Doctor**: Smart queue management, patient consultation, test ordering, and admission
3. **Lab Technician**: Test request handling, sample management, and report generation
4. **Pharmacist**: Prescription management and medicine dispensing
5. **Admin**: Hospital oversight, analytics, user management, and resource allocation

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Responsive design with modern aesthetics
- **Vanilla JavaScript** - No framework dependencies
- **Fetch API** - Backend communication
- **Socket.IO Client** - Real-time updates

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - REST API framework
- **Socket.IO** - WebSocket real-time communication
- **JWT** - Authentication and authorization
- **Bcryptjs** - Password hashing

### Database
- **MongoDB** - NoSQL database
- **Mongoose** - ODM (Object Document Mapper)

### AI/ML
- **Local Triage Engine** - Deterministic symptom analysis (no external API dependency)

---

## 📋 Project Structure

```
medicare-360/
├── client/
│   ├── index.html
│   ├── login.html
│   ├── patient-registration.html
│   ├── patient/
│   ├── doctor/
│   ├── lab/
│   ├── pharmacy/
│   ├── admin/
│   ├── css/
│   └── js/
├── server/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   └── server.js
├── seed/
│   └── seedData.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v14+ and npm
- MongoDB v4.4+ (local or Atlas)
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/harshitcodesxr/medicare-360.git
cd medicare-360
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your MongoDB connection string.

### Step 4: Start MongoDB
```bash
mongod
```

### Step 5: Seed Demo Data
```bash
npm run seed
```

### Step 6: Start the Server
```bash
npm start
```

Server runs at: `http://localhost:5000`

### Step 7: Open Frontend
```bash
python -m http.server 3000 --directory client
```

Access at: `http://localhost:3000`

---

## 📱 Demo Login Credentials

- **Admin**: admin@medicare360.com / Admin@123
- **Doctor**: dr.sharma@medicare360.com / Doctor@123
- **Lab Tech**: lab.tech@medicare360.com / Lab@123
- **Pharmacist**: pharmacist@medicare360.com / Pharma@123
- **Patient**: patient@medicare360.com / Patient@123

---

## 🏥 Key Features Explained

### AI Triage Algorithm
Deterministic local engine that analyzes symptoms and vital signs to assign priority (Critical/Medium/Normal).

### Dynamic Queue
Smart queue prioritization using: `urgency (60%) + waiting time (25%) + fairness (15%)`

### Bed Management
Real-time ICU/Ward allocation with automatic availability checking.

### Socket.IO Real-Time
Live updates for queue changes, notifications, and bed status.

---

## ⚠️ Disclaimer

**This is an educational prototype.** AI provides decision support only. Healthcare professionals make final decisions. All data is synthetic.

---

## 📄 License

MIT License
