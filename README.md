# Kachi's Todo app
A modern, responsive Todo List application built with **TypeScript**, React 19, React Router v7, TanStack Query, and styled using Tailwind CSS. The app integrates with the JSONPlaceholder API and includes features such as pagination, modals for creating, editing, and deleting todos, and optimistic UI updates using local state.

## 🚀 Live Demo

[Kachi-todo-app](https://kachi-todo.netlify.app/)


## 📦 Features

- **TypeScript** - Full type safety and enhanced developer experience
- View paginated list of todos
- Create new todos using a modal
- Edit existing todos with pre-filled modals
- Delete todos with confirmation dialogs
- Client-side pagination (10 todos per page)
- Responsive and accessible UI using Tailwind CSS and ShadCN components
- Uses TanStack Query for efficient data fetching and caching
- Comprehensive error handling with Error Boundaries

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

- **Build for production:**
```bash
npm run build
```

- **Type checking:**
```bash
npm run type-check
```

- **Linting:**
```bash
npm run lint
```

- Open your browser and go to [http://localhost:5173](http://localhost:5173/)

## 🧱 Tech Stack & Architecture
### 🛠️ Tech Stack
- **TypeScript** - Type safety and enhanced development experience
- **React 19** - Latest React with modern features
- **React Router v7** - Client-side routing
- **TanStack Query (v5)** - Data fetching and caching
- **Tailwind CSS** - Utility-first styling
- **ShadCN UI** - Pre-built accessible components
- **Vite** - Fast development build tool
- **JSONPlaceholder API** - Mock REST API

### 💡 Architecture Decisions
- **TypeScript Integration**: Full type safety across components, API calls, and state management
- **Type Definitions**: Centralized interfaces in `src/types/index.ts` for consistent typing
- **Local State for New Todos**: Since JSONPlaceholder is read-only, new todos are kept in local state
- **Modular Components**: Create, Edit, and Delete modals are separate components to keep logic clean and reusable
- **TanStack Query**: Manages fetching, caching, and loading/error states without writing boilerplate
- **Error Boundaries**: Comprehensive error handling with TypeScript-typed error components

### 🔌 API Reference
The app uses the JSONPlaceholder API:

Base URL: [https://jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com/)

### Endpoints:
- `GET /todos` – Fetch all todos
- `GET /todos/{id}` – Fetch specific todo
- `POST /todos` – Create a todo (mock only)
- `PUT /todos/{id}` – Update a todo (mock only)
- `DELETE /todos/{id}` – Delete a todo (mock only)

⚠️ **Note**: JSONPlaceholder is a mock API. POST/PUT/DELETE requests won't persist, so local state is used for updates and deletions.

### 📁 Project Structure
```
src/
├── components/
│   ├── ui/           # ShadCN UI components
│   ├── CreateTodo.tsx
│   ├── TodoListItems.tsx
│   ├── PaginationControl.tsx
│   └── ErrorBoundary.tsx
├── pages/
│   ├── TodoList.tsx
│   ├── TodoDetail.tsx
│   └── NotFound.tsx
├── lib/
│   ├── api.ts        # API functions with TypeScript
│   └── utils.ts      # Utility functions
├── types/
│   └── index.ts      # TypeScript type definitions
├── App.tsx
└── main.tsx
```

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

- 🌐 Replace JSONPlaceholder with a real backend
- 🔍 Add search, sort, and filtering
- ✅ Allow toggle of completed status in UI
- 📱 Improve mobile layout and responsiveness
- 📴 Enable offline mode with service workers
- 🧪 Add comprehensive testing with Jest/Vitest and React Testing Library
- 🔒 Implement user authentication and authorization
- 📊 Add analytics and performance monitoring

## 🤝 Contributing
Contributions are welcome! To get started:

1. Fork this repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes with proper TypeScript typing
4. Run type checking (`npm run type-check`)
5. Run linting (`npm run lint`)
6. Test your changes (`npm run dev`)
7. Commit your changes (`git commit -am 'Add new feature'`)
8. Push to the branch (`git push origin feature/your-feature`)
9. Create a new Pull Request

### Development Guidelines
- Maintain TypeScript compatibility
- Follow existing code patterns and naming conventions
- Add proper type definitions for new features
- Ensure components are properly typed with interfaces
