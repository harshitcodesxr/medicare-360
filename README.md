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
│   ├── index.html              # Landing page
│   ├── login.html              # Authentication
│   ├── patient-registration.html
│   ├── patient/
│   │   ├── dashboard.html
│   │   ├── triage.html
│   │   ├── queue.html
│   │   ├── appointments.html
│   │   ├── records.html
│   │   └── prescriptions.html
│   ├── doctor/
│   │   ├── dashboard.html
│   │   ├── queue.html
│   │   ├── patient-detail.html
│   │   ├── consultation.html
│   │   └── admissions.html
│   ├── lab/
│   │   ├── dashboard.html
│   │   ├── tests.html
│   │   └── reports.html
│   ├── pharmacy/
│   │   ├── dashboard.html
│   │   ├── prescriptions.html
│   │   └── inventory.html
│   ├── admin/
│   │   ├── dashboard.html
│   │   ├── beds.html
│   │   ├── patients.html
│   │   └── analytics.html
│   ├── css/
│   │   ├── style.css           # Global styles
│   │   └── responsive.css
│   └── js/
│       ├── app.js              # Main app logic
│       ├── auth.js             # Authentication
│       ├── socket.js           # Socket.IO client
│       ├── api.js              # API client
│       └── utils.js            # Utilities
│
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Patient.js
│   │   ├── Triage.js
│   │   ├── Queue.js
│   │   ├── Consultation.js
│   │   ├── LabTest.js
│   │   ├── LabReport.js
│   │   ├── Prescription.js
│   │   ├── Medicine.js
│   │   ├── Bed.js
│   │   ├── Admission.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── patients.js
│   │   ├── triage.js
│   │   ├── queue.js
│   │   ├── consultations.js
│   │   ├── lab.js
│   │   ├── pharmacy.js
│   │   ├── beds.js
│   │   ├── admissions.js
│   │   └── dashboard.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── patientController.js
│   │   ├── triageController.js
│   │   ├── queueController.js
│   │   ├── consultationController.js
│   │   ├── labController.js
│   │   ├── pharmacyController.js
│   │   ├── bedController.js
│   │   ├── admissionController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT verification
│   │   ├── roles.js            # Role-based access
│   │   └── errorHandler.js
│   ├── services/
│   │   ├── triageService.js    # AI triage logic
│   │   ├── queueService.js     # Queue algorithm
│   │   ├── bedService.js       # Bed allocation
│   │   └── notificationService.js
│   ├── utils/
│   │   ├── validators.js
│   │   ├── constants.js
│   │   └── helpers.js
│   └── server.js               # Express app & Socket.IO
│
├── seed/
│   └── seedData.js             # Sample data initialization
│
├── .env.example                # Environment variables template
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

Edit `.env` with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/medicare-360
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
```

### Step 4: Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (update MONGODB_URI in .env)
```

### Step 5: Seed Demo Data
```bash
npm run seed
```

### Step 6: Start the Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Server runs at: `http://localhost:5000`

### Step 7: Open Frontend
Open `client/index.html` in your browser or use a local server:
```bash
# Using Python 3
python -m http.server 3000 --directory client

# Or using Node.js
npx serve client -l 3000
```

Access at: `http://localhost:3000`

---

## 📱 Demo Login Credentials

### Admin
- **Email**: admin@medicare360.com
- **Password**: Admin@123

### Doctor
- **Email**: dr.sharma@medicare360.com
- **Password**: Doctor@123

### Lab Technician
- **Email**: lab.tech@medicare360.com
- **Password**: Lab@123

### Pharmacist
- **Email**: pharmacist@medicare360.com
- **Password**: Pharma@123

### Patient
- **Email**: patient@medicare360.com
- **Password**: Patient@123

---

## 🎯 Demo Workflow (2-3 minutes)

1. **Register Patient**: Complete patient registration form
2. **Submit Symptoms**: Enter symptoms for AI triage evaluation
3. **View AI Priority**: See Critical/Medium/Normal priority with risk score
4. **Queue Positioning**: Watch real-time queue update
5. **Doctor Console**: Doctor views smart queue with critical patients first
6. **Consultation**: Doctor opens patient profile and consultation interface
7. **Lab Test**: Doctor orders CBC test
8. **Lab Processing**: Lab technician receives test and updates status
9. **Lab Report**: Lab technician uploads test results
10. **Doctor Review**: Doctor receives notification and reviews report
11. **ICU Admission**: Doctor clicks "Admit to ICU"
12. **Auto-Allocation**: System assigns available ICU bed automatically
13. **Real-Time Update**: Admin dashboard updates bed status in real-time
14. **Notifications**: All users receive relevant notifications via Socket.IO

---

## 🧠 AI Triage Algorithm

The system uses a **deterministic local triage engine** with no external API dependency.

### Priority Calculation

```javascript
// Risk Score (0-100)
riskScore = symptomSeverity * 0.4 + 
            vitalsSeverity * 0.4 + 
            emergencyKeywords * 0.2

// Priority Assignment
if (riskScore >= 75) → CRITICAL
if (riskScore >= 50) → MEDIUM
else → NORMAL
```

### Critical Indicators
- Severe breathing difficulty
- Chest pain
- Loss of consciousness
- Very low oxygen saturation (<90%)
- Severe bleeding
- Stroke-like symptoms
- Heart rate >140 or <40
- Systolic BP >180 or <80
- Temperature >104°F or <95°F

### Symptoms Analyzed
- Main symptoms (open text)
- Duration
- Pain level (1-10)
- Temperature
- Heart rate
- Blood pressure
- Oxygen saturation
- Breathing difficulty
- Existing medical conditions

---

## 📊 Dynamic Queue Algorithm

The system uses **transparent scoring** that balances urgency, fairness, and workload:

```javascript
priorityScore = 
  urgencyScore * 0.6 +        // Medical priority
  waitingTimeScore * 0.25 +   // Fairness boost
  workloadAdjustment * 0.15   // Doctor availability

// Queue is sorted by priorityScore DESC
// Critical patients generally move to top
// But normal patients waiting 60+ min get fairness boost
```

---

## 🛏️ Bed Management

### Automated ICU Allocation
1. Doctor clicks "Admit to ICU"
2. System queries available ICU beds
3. Reserves first available bed
4. Updates bed status to OCCUPIED
5. Creates admission record
6. Notifies all connected users via Socket.IO
7. Admin dashboard updates in real-time

### Bed States
- **Available**: Ready for assignment
- **Reserved**: Allocated but patient not yet admitted
- **Occupied**: Patient currently in bed
- **Cleaning**: Maintenance/cleaning in progress

### Capacity Management
- **ICU**: 20 beds total
- **General Ward**: 50 beds total
- **Emergency**: 5 beds
- Real-time occupancy tracking

---

## 🔐 Security Features

- **Password Hashing**: Bcryptjs with salt rounds
- **JWT Authentication**: Stateless session management
- **Role-Based Access Control**: Middleware enforces permissions
- **Input Validation**: Express-validator on all routes
- **Protected API Routes**: Authentication required
- **Environment Variables**: Secrets not hardcoded
- **Synthetic Data Only**: No real patient information
- **CORS Configuration**: Configured for frontend origin

---

## 📡 Real-Time Communication (Socket.IO)

### Events
- `queue:updated` - Queue position changed
- `queue:critical-patient` - Critical patient added
- `lab:test-completed` - Lab report ready
- `prescription:new` - New prescription received
- `bed:allocated` - ICU bed assigned
- `notification:new` - System notification
- `dashboard:stats-update` - Admin stats refreshed

---

## 📊 API Endpoints Overview

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Patients
- `GET /api/patients` - List patients
- `POST /api/patients` - Create patient
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient

### Triage
- `POST /api/triage` - Submit symptoms for AI evaluation
- `GET /api/triage/:patientId` - Get triage result

### Queue
- `GET /api/queue` - Get current queue
- `POST /api/queue` - Add patient to queue
- `PUT /api/queue/:id` - Update queue item

### Consultations
- `POST /api/consultations` - Start consultation
- `GET /api/consultations/:patientId` - Get patient consultations
- `PUT /api/consultations/:id` - Update consultation

### Lab
- `POST /api/lab/tests` - Order lab test
- `GET /api/lab/tests` - Get test requests
- `PUT /api/lab/tests/:id` - Update test status
- `POST /api/lab/reports` - Submit lab report

### Pharmacy
- `GET /api/prescriptions` - Get prescriptions
- `POST /api/prescriptions` - Create prescription
- `PUT /api/prescriptions/:id` - Update prescription status

### Beds
- `GET /api/beds` - Get bed status
- `PUT /api/beds/:id` - Update bed
- `GET /api/beds/available` - Get available beds

### Admissions
- `POST /api/admissions` - Admit patient
- `GET /api/admissions/:patientId` - Get admission records
- `PUT /api/admissions/:id` - Update admission

### Dashboard
- `GET /api/dashboard/stats` - Hospital statistics
- `GET /api/dashboard/charts` - Analytics data

---

## 🎨 UI/UX Design

### Design Principles
- **Clean Medical Aesthetic**: Professional healthcare theme
- **Minimal but Rich**: Information-dense without clutter
- **Responsive**: Desktop-first with mobile compatibility
- **Status Colors**:
  - 🔴 Red = Critical priority/urgent
  - 🟡 Yellow = Medium priority
  - 🟢 Green = Normal priority/completed
  - ⚫ Gray = Pending/neutral

### Key Screens
1. **Landing Page**: Hero section with demo access
2. **Login Portal**: Role-based redirect after authentication
3. **Patient Dashboard**: Personal health summary and appointments
4. **Doctor Console**: Smart queue and consultation workspace
5. **Lab Dashboard**: Test management interface
6. **Pharmacy Dashboard**: Prescription dispensing
7. **Admin Command Center**: Hospital-wide analytics and KPIs

---

## ⚠️ Prototype Limitations & Disclaimers

- **Not a Medical Device**: This is an educational/hackathon prototype
- **AI is Decision Support**: AI analysis provides recommendations only
- **Always Consult Professionals**: Healthcare professionals make final decisions
- **Synthetic Data Only**: All patient information is fictional and for demo purposes
- **No Real Patient Privacy**: HIPAA compliance not implemented for prototype
- **Educational Use**: Designed for learning and demonstration

---

## 📈 Performance Considerations

- Optimized MongoDB queries with indexes
- Real-time Socket.IO events for live updates
- Lazy loading for dashboard charts
- Responsive pagination for large lists
- Client-side caching for frequently accessed data

---

## 🤝 Contributing

This is a hackathon project. For improvements:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push and create a Pull Request

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Team

Built for healthcare innovation hackathon.

**MEDICARE 360**: "From patient arrival to treatment, intelligently."
