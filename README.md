# Quiz Management & Online Assessment Platform

Full-stack internship project — Spring Boot backend + React frontend.

## Live Links
- **Frontend (live app):** https://quiz-management-platform-navy.vercel.app
- **Backend (API):** https://quiz-platform-backend-6tpu.onrender.com

## Demo Credentials
- **Admin:** admin@quizplatform.com / Admin@1234
- **Student:** Register a new account, or use any previously registered test account.

## Tech Stack
**Frontend:** React, Tailwind CSS, React Router, Axios, Recharts
**Backend:** Java, Spring Boot, Spring Security (JWT), Spring Data JPA, Hibernate
**Database:** PostgreSQL

## Project Structure
- `backend/` — Java Spring Boot REST API
- `frontend/` — React client

## few Screenshots
- 
## Features
- JWT-based authentication with role-based access control (Admin / Student)
- Admin: manage categories, quizzes, questions, students; view analytics dashboard with charts
- Student: browse/search/filter quizzes, take timed quizzes with question and option randomization, view results, review answers, track attempt history and performance
- Backend-enforced scoring — correct answers and scores are never exposed to or trusted from the frontend
- Leaderboard ranking students by average score

## Note on deployment (free tier)
Both services run on free tiers (Render + Vercel). The backend may take 30-60 seconds to respond on the first request after a period of inactivity, as Render's free tier spins down idle services.
