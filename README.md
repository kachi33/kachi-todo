# Kachi's Todo app
A modern, responsive Todo List application built with React 19, React Router v7, TanStack Query, and styled using Tailwind CSS. The app integrates with the JSONPlaceholder API and includes features such as pagination, modals for creating, editing, and deleting todos, and optimistic UI updates using local state.

## 🚀 Live Demo

[Kachi-todo-app](https://kachi-todo.netlify.app/)


## 📦 Features

- View paginated list of todos
- Create new todos using a modal
- Edit existing todos with pre-filled modals
- Delete todos with confirmation dialogs
- Client-side pagination (10 todos per page)
- Responsive and accessible UI using Tailwind CSS and ShadCN components
- Uses TanStack Query for efficient data fetching and caching

## ⚙️ Installation & Setup

1. **Clone the repository:**
    
    ```bash
    git clone https://github.com/kachi33/kachi-todo.git
   cd kachi-todo
    ```

-Install dependencies:
```bash
npm install
```

- Start the development server:
```bash
npm run dev
```
- Open your browser and go to [http://localhost:5173](http://localhost:5173/)

## 🧱 Tech Stack & Architecture
### 🛠️ Tech Stack
React 19

React Router v7

TanStack Query (v5)

Tailwind CSS

ShadCN UI

Axios

JSONPlaceholder API

### 💡 Architecture Decisions
Local State for New Todos: Since JSONPlaceholder is read-only, new todos are kept in local state.

Modular Components: Create, Edit, and Delete modals are separate components to keep logic clean and reusable.

TanStack Query: Manages fetching, caching, and loading/error states without writing boilerplate.

### 🔌 API Reference
The app uses the JSONPlaceholder API:

Base URL: [https://jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com/)

### Endpoints:
GET /todos – Fetch all todos

PUT /todos/{id} – Update a todo (mock only)

DELETE /todos/{id} – Delete a todo (mock only)

⚠️ Note: JSONPlaceholder is a mock API. POST/PUT/DELETE requests won't persist, so local state is used for updates and deletions.

## 📸 Screenshots

📋 Todo List View

✏️ Edit Modal

🗑️ Delete Modal

➕ Create Modal

## 🐞 Known Issues
JSONPlaceholder is a mock API — changes are not persistent

Newly created todos are stored only in local state

No filtering or sorting features yet

No user login or authentication

Some features (e.g., completion toggle) are not editable in the UI

## 🚀 Future Improvements

🌐 Replace JSONPlaceholder with a real backend 

🔍 Add search, sort, and filtering

✅ Allow toggle of completed status in UI

📱 Improve mobile layout and responsiveness

🔒 Add authentication (Auth0, Clerk, Firebase)

📴 Enable offline mode with service workers

📊 Add analytics for completed/incomplete todos

## 🤝 Contributing
Contributions are welcome! To get started:

Fork this repository

Create a new branch (git checkout -b feature/your-feature)

Commit your changes (git commit -am 'Add new feature')

Push to the branch (git push origin feature/your-feature)

Create a new Pull Request
