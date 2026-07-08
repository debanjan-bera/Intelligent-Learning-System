# AI Generated Adaptive Quiz Learning Platform - Backend Documentation

This document explains the backend from a frontend developer perspective.

## 1. Project Overview

This backend is an Express + TypeScript + MongoDB API for:

- User authentication
- Course and topic management
- AI-generated quiz attempts
- Quiz submission and scoring
- Quiz history retrieval
- Progress tracking (course-wise and overall)

Tech stack:

- Node.js
- Express 5
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- Gemini API for quiz generation

## 2. Local Setup

### 2.1 Install and run

- Install dependencies: npm install
- Run development server: npm run dev
- Build: npm run build
- Start production build: npm run start

### 2.2 Required environment variables

From code usage, these variables are expected:

- MONGO_URI
- JWT_SECRET
- ACCESS_TOKEN_AGE (example: 1d)
- GEMINI_API_KEY
- PORT (optional, app currently uses hardcoded 5000 in src/index.ts)

## 3. API Base URL

Server mounts all routes under:

- /api/auth
- /api/courses
- /api/topics
- /api/quiz
- /api/quiz-history
- /api/progress

Example local base URL:

- http://localhost:5000

## 4. Authentication Model

### 4.1 Token format

Use Bearer token in Authorization header:

Authorization: Bearer <access_token>

### 4.2 How auth works in this codebase

- auth middleware tries to decode token and attach req.user.
- If token is missing or invalid, middleware does not block request automatically.
- Protected controllers explicitly check req.user?.userId and return 401.

Frontend impact:

- For protected routes, always send token.
- If token is absent/invalid, expect 401 from controller.

### 4.3 JWT payload used in backend

Access token includes:

- userId
- email
- role
- name

## 5. High Level Data Models

### 5.1 User

- _id
- email
- password (hashed)
- name
- role (student or admin)
- createdAt, updatedAt

### 5.2 Course

- _id
- title
- description
- difficulty (easy | medium | hard)

### 5.3 Topic

- _id
- title
- description
- courseId

### 5.4 QuizAttempt

- _id
- userId
- courseId
- topicId
- date
- questions[]
  - question
  - options[]
  - correctAnswer
  - explanation
- answers[]
  - questionIndex
  - selectedAnswer
  - isCorrect
- timeTaken
- score

### 5.5 Progress

One document per user + course combination:

- userId
- courseId
- accuracy
- weakTopics[]
- strongTopics[]
- totalQuizzes
- averageScore

## 6. Endpoint Reference

## 6.1 Auth

### POST /api/auth/register

Purpose: Register a new student user.

Request body:

- email (required, valid email)
- password (required)
- name (required)

Response 201:

- success
- message
- user: id, name, email
- auth: access_token

Errors:

- 400 if missing fields or invalid email
- 500 on server/service failure

### POST /api/auth/login

Purpose: Login existing user.

Request body:

- email
- password

Response 200:

- success
- message
- user: id, name, email
- auth: access_token

Errors:

- 400 validation failure
- 500 server/service failure

### GET /api/auth/me

Purpose: Return current decoded user from token.

Auth: required

Response 200:

- success
- message
- user

## 6.2 Courses

### GET /api/courses

Purpose: List all courses.

Auth: no

Response 200:

- success
- message
- data: Course[]

### GET /api/courses/:courseId

Purpose: Get single course by id.

Auth: no

Response 200:

- success
- message
- data: Course

### POST /api/courses

Purpose: Create course.

Auth: yes (admin middleware in route)

Request body:

- title
- description
- difficulty

Response 201:

- success
- message

### PUT /api/courses/:courseId

Purpose: Update course.

Auth: yes (admin middleware in route)

Request body:

- title
- description
- difficulty

Response 200:

- success
- message
- data: updated Course

### DELETE /api/courses/:courseId

Purpose: Delete course.

Auth: yes (admin middleware in route)

Response 200:

- success
- message
- data: deleted Course

## 6.3 Topics

### POST /api/topics

Purpose: Create topic.

Auth: currently no middleware on route.

Request body:

- title
- description
- courseId

Response 201:

- success
- message
- data: Topic

### GET /api/topics/course/:courseId

Purpose: List topics by course.

Response 200:

- success
- message
- data: Topic[]

### GET /api/topics/:topicId

Purpose: Get topic by id.

Response 200:

- success
- message
- data: Topic

### PUT /api/topics/:topicId

Purpose: Update topic.

Request body:

- title
- description

Response 200:

- success
- message
- data: updated Topic

### DELETE /api/topics/:topicId

Purpose: Delete topic.

Response 200:

- success
- message

## 6.4 Quiz

### POST /api/quiz/generate

Purpose: Generate questions from AI only (no attempt record).

Auth: no

Request body:

- topic (required)
- difficulty (required)
- numberOfQuestions (optional, default 5)

Response 200:

- success
- questions

Errors:

- 400 validation
- 502 AI generation failure

### POST /api/quiz/start

Purpose: Create a quiz attempt and return safe questions (without correct answers).

Auth: required

Request body:

- courseId (required)
- topicId (required)
- topic (required, text used for AI prompt)
- difficulty (required)
- numberOfQuestions (optional)

Response 201:

- success
- attemptId
- questions: [{ question, options }]

### POST /api/quiz/:attemptId/submit

Purpose: Submit answers and score attempt, then update progress.

Auth: required

Request body:

- answers: [{ questionIndex, selectedAnswer }]

Response 200:

- success
- score
- totalQuestions
- accuracy

## 6.5 Quiz History

### GET /api/quiz-history

Purpose: Get all quiz attempts of current user sorted by latest first.

Auth: required

Response 200:

- success
- message
- data:
  - totalAttempts
  - attempts[]:
    - attemptId
    - courseId
    - topicId
    - date
    - score
    - totalQuestions
    - accuracy
    - timeTaken

### GET /api/quiz-history/:attemptId

Purpose: Get one attempt summary for current user.

Auth: required

Response 200:

- success
- message
- data: same shape as history item

Errors:

- 404 if not found or not owned by user

## 6.6 Progress

### GET /api/progress/courses

Purpose: Get all progress documents for current user (course-wise progress list).

Auth: required

Response 200:

- success
- message
- data: Progress[]

### GET /api/progress/course/:courseId

Purpose: Get progress for one specific course.

Auth: required

Response 200:

- success
- message
- data: Progress

Errors:

- 404 if no progress exists for that course

### GET /api/progress/overall

Purpose: Get aggregated user progress across all courses.

Auth: required

Response 200:

- success
- message
- data:
  - totalCourses
  - totalQuizzes
  - overallAccuracy
  - overallAverageScore
  - strongTopics[]
  - weakTopics[]

## 7. Frontend Integration Flows

### 7.1 Auth flow

1. Call register or login.
2. Store auth.access_token in secure client storage.
3. Attach token to Authorization header for protected APIs.
4. Optionally call /api/auth/me on app load to hydrate user state.

### 7.2 Learning flow

1. Fetch courses.
2. Fetch topics for selected course.
3. Start quiz with courseId + topicId + topic name + difficulty.
4. Render returned questions and collect answers.
5. Submit answers to quiz submit endpoint.
6. Read score/accuracy and refresh quiz history and progress widgets.

### 7.3 Dashboard flow

Use these endpoints together:

- /api/quiz-history for recent attempts
- /api/progress/courses for per-course cards
- /api/progress/overall for top summary metrics

## 8. Recommended Frontend Type Contracts

These interfaces match current API responses and help avoid runtime mistakes.

type AuthSuccess = {
  success: boolean;
  message: string;
  user: { id: string; name: string; email: string };
  auth: { access_token: string };
};

type QuizStartResponse = {
  success: boolean;
  attemptId: string;
  questions: Array<{ question: string; options: string[] }>;
};

type QuizSubmitResponse = {
  success: boolean;
  score: number;
  totalQuestions: number;
  accuracy: number;
};

type QuizHistoryItem = {
  attemptId: string;
  courseId: string;
  topicId: string;
  date: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeTaken: number;
};

type CourseProgress = {
  userId: string;
  courseId: string;
  accuracy: number;
  weakTopics: string[];
  strongTopics: string[];
  totalQuizzes: number;
  averageScore: number;
};

type OverallProgress = {
  totalCourses: number;
  totalQuizzes: number;
  overallAccuracy: number;
  overallAverageScore: number;
  strongTopics: string[];
  weakTopics: string[];
};

## 9. Error Handling Patterns for UI

Current API returns are not fully uniform. Frontend should support these fields:

- success (present in many responses)
- message (present in many responses)
- error (present in some failures)
- error as simple object key in auth validation cases

Recommended fallback order when displaying error:

1. response.data.message
2. response.data.error
3. Generic fallback text

## 10. Important Current Behavior Notes

1. Role value mismatch risk:
   - User model role enum uses student/admin.
   - admin middleware checks for Admin with uppercase A.
   - This can block admin routes even for admin users unless token role matches Admin exactly.

2. Topic route protection:
   - Topic create/update/delete currently has no auth middleware.

3. Progress topic labeling:
   - Progress update currently stores the value returned as topic from submit flow.
   - In current submit service, this value is topicId string, so strongTopics/weakTopics may contain topic IDs, not topic titles.

4. Port source:
   - src/index.ts uses fixed port 5000 instead of config.PORT.

These are backend implementation details. Frontend can still integrate normally, but these points are useful for debugging behavior.

## 11. Suggested Frontend Module Structure

A clean structure for client integration:

- api/authApi.ts
- api/courseApi.ts
- api/topicApi.ts
- api/quizApi.ts
- api/quizHistoryApi.ts
- api/progressApi.ts
- types/api.ts
- hooks/useAuth.ts
- hooks/useQuizFlow.ts
- hooks/useProgressDashboard.ts

## 12. Quick Endpoint Checklist

Public:

- POST /api/auth/register
- POST /api/auth/login
- GET /api/courses
- GET /api/courses/:courseId
- GET /api/topics/course/:courseId
- GET /api/topics/:topicId
- POST /api/topics (currently public)
- PUT /api/topics/:topicId (currently public)
- DELETE /api/topics/:topicId (currently public)
- POST /api/quiz/generate

Protected (Bearer token):

- GET /api/auth/me
- POST /api/quiz/start
- POST /api/quiz/:attemptId/submit
- GET /api/quiz-history
- GET /api/quiz-history/:attemptId
- GET /api/progress/courses
- GET /api/progress/course/:courseId
- GET /api/progress/overall
- POST /api/courses (admin middleware)
- PUT /api/courses/:courseId (admin middleware)
- DELETE /api/courses/:courseId (admin middleware)

---

If you want, I can also generate a frontend-ready API collection format next (Postman collection JSON or a typed Axios client module) based on this exact backend behavior.
