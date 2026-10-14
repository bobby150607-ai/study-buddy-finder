# Study Buddy Finder System 🎓

A modern, full-stack academic web platform designed to help university students discover and connect with compatible study partners based on enrolled coursework, research interests, study styles, and schedule availability.

Built with a **React.js** frontend, a **Spring Boot** RESTful backend, and **MySQL 8.0** database persistence.

---

## 🌟 Key Features

1. **Intelligent Buddy Matching Engine**:
   - Calculates a 4-dimensional compatibility score (0–100%) in real time:
     - **Common Subjects (50%)**: Direct overlap in registered course modules.
     - **Shared Interests (20%)**: Extracurricular, hackathons, and research topics.
     - **Study Preferences (15%)**: Alignment in study method (e.g., Hybrid, In-Person Library, Pomodoro, Problem Solving).
     - **Schedule Availability (15%)**: Shared study windows (e.g., Weekday Evenings, Weekend Mornings).
   - Generates human-readable breakdown explanations justifying why each prospective buddy is recommended.

2. **Connection Management**:
   - Send, cancel, accept, or decline study buddy invitations.
   - Guardrails against duplicate requests and self-connections.
   - Dedicated connection hub for active buddies and pending requests.

3. **Study Groups & Real-Time Discussions**:
   - Create or join subject-specific study groups with capacity limits.
   - Real-time discussion rooms for collaborative question-answering and exam prep.
   - Member roster with student courses and roles (Admin/Member).

4. **Secure Direct Messaging (1-to-1)**:
   - Private conversation between connected study buddies with message history, timestamps, and read indicators.
   - Access control prevents unauthorized eavesdropping.

5. **Profile & Subject Selection**:
   - Comprehensive student profile management (bio, avatar, degree, graduation year, study style, availability tags).
   - Multi-subject enrollment catalog with instant compatibility recalculation.

6. **Enterprise-Grade Security**:
   - Passwords securely hashed with BCrypt.
   - Stateless JWT authentication via Spring Security 6 filter chain.
   - CORS protection and input validation constraints on all endpoints.

---

## 🏗️ System Architecture

```
[ React.js SPA (Vite / Axios) ]
           │
           │  REST APIs (JSON) + JWT Bearer
           ▼
[ Spring Boot Application (Port 8080) ]
   ├── Controller Layer   (REST endpoints & input validation)
   ├── Security Layer     (JWT authentication filter & BCrypt)
   ├── Service Layer      (Matching algorithm & business workflows)
   ├── Repository Layer   (Spring Data JPA)
   └── Entity Layer       (Hibernate entities & relationships)
           │
           ▼
[ MySQL 8.0 Database (study_buddy_db) ]
   ├── users
   ├── profiles
   ├── subjects
   ├── user_subjects
   ├── connections
   ├── study_groups
   ├── group_members
   ├── messages
   └── group_messages
```

---

## 🚀 Getting Started & Setup Guide

### Prerequisites
- **Java**: OpenJDK 17 or 21 (`java -version`)
- **Maven**: 3.8+ or bundled Maven (`mvn -v`)
- **Node.js**: 18+ and npm (`node -v`, `npm -v`)
- **MySQL**: 8.0+ server running on `localhost:3306`

---

### Step 1: Database Setup (MySQL)

1. Start your local MySQL server (default port `3306`).
2. Log into MySQL and create the database, or run the provided schema script:
```sql
CREATE DATABASE IF NOT EXISTS study_buddy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
3. *(Optional)* If you wish to manually seed initial subjects and test students, execute `backend/src/main/resources/schema.sql` and `backend/src/main/resources/data.sql`.
*(Note: Spring Boot will also automatically initialize tables and seed data upon startup!)*

---

### Step 2: Configure Backend Credentials

In `backend/src/main/resources/application.properties`, customize your MySQL database user and password if different from `root` / `root`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/study_buddy_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

Alternatively, supply them via environment variables when running:
```bash
set DB_USERNAME=root
set DB_PASSWORD=your_mysql_password
```

*(Tip: To test without MySQL running, you can activate the built-in in-memory H2 profile with `-Dspring.profiles.active=h2`!)*

---

### Step 3: Run the Spring Boot Backend

From the project root:
```bash
cd backend
mvn spring-boot:run
```
Or run the packaged JAR:
```bash
java -jar target/study-buddy-finder-backend-1.0.0.jar
```
The backend server will start on `http://localhost:8080`.

---

### Step 4: Run the React Frontend

In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend development server will launch at `http://localhost:3000`.

---

## 👥 Demo Test Accounts

The system comes pre-seeded with realistic student accounts from Computer Science, Data Science, and Engineering:

| Full Name | University | Email | Password | Academic Focus |
|---|---|---|---|---|
| **Alex Rivera** | Stanford University | `alex@university.edu` | `password123` | CS, Algorithms, Machine Learning |
| **Emma Watson** | Stanford University | `emma@university.edu` | `password123` | AI, Computer Vision, LeetCode |
| **Liam Chen** | Stanford University | `liam@university.edu` | `password123` | Data Science, Linear Algebra |
| **Sophia Martinez**| UC Berkeley | `sophia@university.edu` | `password123` | Cognitive Science, Pomodoro Study |
| **Noah Taylor** | MIT | `noah@university.edu` | `password123` | Management & Quantitative Analytics |
| **Maya Patel** | Stanford University | `maya@university.edu` | `password123` | Applied Physics, Differential Equations |

*Quick Demo Tip*: On the Sign In page, use the **1-Click Demo Account Buttons** to instantly log in as any test user without typing!

---

## 📊 Matching Algorithm Logic

The compatibility score between student $A$ and student $B$ is computed as:

$$\text{Score} = \text{SubjectScore} (50\%) + \text{InterestScore} (20\%) + \text{PreferenceScore} (15\%) + \text{AvailabilityScore} (15\%)$$

1. **Subject Overlap (up to 50 pts)**:
   $$\text{Overlap Ratio} = \frac{|S_A \cap S_B|}{\min(|S_A|, |S_B|)}$$
   $$\text{SubjectScore} = \text{Overlap Ratio} \times 50$$
2. **Shared Academic Interests (up to 20 pts)**:
   Matching tokens extracted from comma-delimited interest tags:
   $$\text{InterestScore} = \min\left(1.0, \frac{|I_A \cap I_B|}{\min(|I_A|, |I_B|)}\right) \times 20$$
3. **Study Method Compatibility (up to 15 pts)**:
   - Identical study style (e.g., both prefer "Hybrid" or "In-Person Library") = 15 pts
   - Compatible overlap (e.g., one prefers "Hybrid" or matching keywords) = 10 pts
   - Baseline compatibility = 4 pts
4. **Availability Slots (up to 15 pts)**:
   - 2 or more overlapping weekly time slots = 15 pts
   - 1 overlapping time slot = 10 pts
   - Both have active schedules = 3 pts

Total score is clamped between 0% and 100% and accompanied by an informative summary breakdown.

---

## 📡 REST API Documentation

### Authentication
- `POST /api/auth/register` - Create new student account & profile
- `POST /api/auth/login` - Authenticate with email/password and obtain JWT token
- `GET /api/auth/me` - Retrieve authenticated user information

### Student Profiles
- `GET /api/profiles/me` - Retrieve current student profile
- `PUT /api/profiles/me` - Update profile bio, avatar, university, study preferences
- `GET /api/profiles/{userId}` - View public profile of a classmate
- `PUT /api/profiles/me/subjects` - Update enrolled course subjects

### Subject Catalog
- `GET /api/subjects` - List all university subjects & categories
- `POST /api/subjects` - Add new subject to course directory

### Buddy Matching
- `GET /api/buddies/recommendations` - Get top recommended study buddies ranked by compatibility
- `GET /api/buddies/search?q=&subject=&university=&course=&year=` - Filtered search
- `GET /api/buddies/{id}/compatibility` - Detailed 4-part compatibility breakdown

### Connections
- `POST /api/connections/{targetUserId}` - Send study buddy connection request
- `GET /api/connections` - List accepted study buddies
- `GET /api/connections/requests` - List incoming and outgoing pending requests
- `PUT /api/connections/{id}/accept` - Accept incoming connection request
- `PUT /api/connections/{id}/reject` - Decline incoming connection request
- `DELETE /api/connections/{id}` - Cancel pending request or remove buddy

### Study Groups
- `POST /api/groups` - Create a study group
- `GET /api/groups?q=` - Search/list all study groups
- `GET /api/groups/{id}` - Get group details
- `POST /api/groups/{id}/join` - Join group
- `POST /api/groups/{id}/leave` - Leave group
- `GET /api/groups/{id}/members` - Get group members

### Chat & Messaging
- `GET /api/messages/{targetUserId}` - Fetch 1-to-1 conversation messages
- `POST /api/messages/{targetUserId}` - Send 1-to-1 direct message
- `GET /api/groups/{groupId}/messages` - Fetch study group discussions
- `POST /api/groups/{groupId}/messages` - Post message to study group

---

## 🧪 Automated Testing

Run the automated test suite covering the matching algorithm, connection validations, and services:
```bash
cd backend
mvn test
```
All unit tests execute without external database dependencies using Mockito.
