# Notes App – Production Style (Docker + Nginx + MySQL)

A production-style **Notes Management Application** built using **Express.js, MySQL, Docker, Docker Compose, and Nginx**.

The application supports **CRUD operations**, category-based note organization, and a containerized architecture using Docker.

---

## Features

- Create Notes
- View Notes
- Update Notes
- Delete Notes
- Category-based Notes
- Search Notes
- Sort Notes
- Responsive UI
- MySQL Database Integration
- Dockerized Backend & Database
- Nginx Reverse Proxy
- Persistent MySQL Volume
- Custom Docker Network
- Automated Database Initialization using `init.sql`

---

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MySQL

### DevOps / Deployment
- Docker
- Docker Compose
- Nginx

---

## Project Architecture

```text
User
 ↓
Nginx Reverse Proxy
 ↓
Express.js Backend API
 ↓
MySQL Database
 ↓
Docker Volume (Persistent Storage)
```

---

## Folder Structure

```text
note-app/
│── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── public/
│   ├── app.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env
│
│── mysql/
│   └── init.sql
│
│── nginx/
│   └── default.conf
│
│── docker-compose.yml
│── README.md
```

---

## Database Schema

```sql
CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### Get All Notes

```http
GET /api/notes
```

### Create Note

```http
POST /api/notes
```

### Update Note

```http
PUT /api/notes/:id
```

### Delete Note

```http
DELETE /api/notes/:id
```

---

## Docker Setup

### Clone Repository

```bash
git clone <your-repository-url>
cd note-app
```

---

### Run Application

```bash
docker compose up -d --build
```

---

### Stop Containers

```bash
docker compose down
```

---

### Remove Containers + Volume

```bash
docker compose down -v
```

---

## Environment Variables

Create `.env` file inside `backend/`

```env
PORT=5000

DB_HOST=mysql-db
DB_USER=root
DB_PASSWORD=root
DB_NAME=notes_db
DB_PORT=3306
```

---

## Ports Used

| Service | Port |
|----------|------|
| Nginx | 8080 |
| Backend API | 5000 |
| MySQL | 3307 |

---

## Challenges Faced & Solutions

### 1. MySQL Container Connection Issue

**Problem:** Backend container was unable to connect to MySQL.

**Solution:** Used Docker networking and service name (`mysql-db`) instead of `localhost`.

---

### 2. Reverse Proxy API Issue

**Problem:** Frontend API calls stopped working after adding Nginx.

**Solution:** Replaced hardcoded API URL:

```js
http://localhost:5000/api/notes
```

with:

```js
/api/notes
```

---

### 3. Database Initialization

**Problem:** Manual table creation was required.

**Solution:** Added `init.sql` for automatic table creation.

---

## Future Improvements

- User Authentication (JWT)
- Rich Text Notes
- File/Image Upload
- Cloud Deployment (AWS / Render)
- Kubernetes Deployment
- CI/CD Pipeline

---

## Author

**Varad Jadhav**

LinkedIn:  
http://linkedin.com/in/varad-jadhav-ba1355255