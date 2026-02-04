# nodejs-todo-app

Node.js(Express) + MongoDB(Mongoose) 기반의 Todo REST API 과제 프로젝트입니다.

> 본 프로젝트는 **코딩알려주는누나 Node.js 강의 과제 제출용**으로 제작되었습니다.

---

## 📁 Project Structure

```
nodejs-todo-app
├── todo-be   # Backend (Node.js + Express + MongoDB)
└── todo-fe   # Frontend (추후 제공 예정)
```

---

## 🚀 Getting Started (Backend)

### 1. Install dependencies

```
cd todo-be
npm install
```

### 2. Run server

```
node app.js
```

### 3. Server Info

- Base URL: `http://localhost:5050`
- MongoDB: `mongodb://127.0.0.1:27017/todo-demo`

---

## 📡 API Endpoints

| Method | URL              | Description   |
| ------ | ---------------- | ------------- |
| POST   | `/api/tasks`     | Create a task |
| GET    | `/api/tasks`     | Get task list |
| PUT    | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

---

## 📄 Example Request Body

### Create / Update Task

```
{
  "task": "study nodejs",
  "isComplete": false
}
```

---

## 🛠 Tech Stack

### Backend

- Node.js
- Express
- MongoDB
- Mongoose

### Tools

- Postman (API testing)
- Git / GitHub

---

## 📌 Notes

- ***

## 👩‍💻 Author

- hey-anna
