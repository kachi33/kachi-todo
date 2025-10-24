# Kachi Todo

A modern, full-featured Todo List application built with **Next.js 16**, **TypeScript**, **PostgreSQL**, and **Prisma**. Features include todo lists, task management, filtering, dark mode, offline support, and productivity tracking.

## 🚀 Live Demo

[Kachi-todo-app](https://kachi-todo.netlify.app/)

## ✨ Features

### Core Features
- **📝 Task Management** - Create, edit, delete, and organize todos
- **📋 Custom Lists** - Organize todos into custom lists with color coding
- **🎯 Priority Levels** - Set task priorities (urgent, high, medium, low)
- **📅 Due Dates & Times** - Schedule tasks with specific dates and times
- **✅ Task Completion** - Mark tasks as complete/incomplete
- **🔍 Advanced Filtering** - Filter by priority, status, and list
- **📊 Pagination** - Clean pagination for large task lists

### UI/UX Features
- **🌓 Dark Mode** - Toggle between light and dark themes
- **📱 Responsive Design** - Optimized for all screen sizes
- **💨 Fast & Smooth** - Built with Next.js for optimal performance
- **🎨 Modern UI** - Beautiful interface using Tailwind CSS and ShadCN UI
- **📴 Offline Support** - PWA with offline capabilities
- **⚡ Optimistic Updates** - Instant UI feedback using TanStack Query

### Productivity Features
- **📈 Productivity Stats** - Track completed vs pending tasks
- **📊 Weekly Overview** - Visual progress tracking
- **⏰ Upcoming Tasks** - Dashboard view of tasks due soon
- **🎯 Overdue Tracking** - Identify overdue tasks
- **💬 Motivational Quotes** - Inspiring quotes on the dashboard

### Technical Features
- **🔐 Session Management** - Session-based task isolation
- **🗄️ PostgreSQL Database** - Reliable data persistence with Prisma ORM
- **🚀 Server-Side Rendering** - Fast initial page loads with Next.js
- **♿ Accessible** - WCAG compliant components
- **🎭 Error Boundaries** - Graceful error handling with retry capabilities

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with modern features
- **TypeScript** - Full type safety
- **Tailwind CSS 4** - Utility-first styling
- **ShadCN UI** - Accessible component library
- **Lucide React** - Beautiful icon library
- **Swiper** - Touch slider for carousels

### Backend & Database
- **PostgreSQL** - Production-ready relational database
- **Prisma** - Type-safe ORM for database access
- **Next.js API Routes** - Serverless API endpoints

### State Management & Data Fetching
- **TanStack Query v5** - Server state management
- **React Context** - Client-side state (theme, sidebar)
- **Optimistic Updates** - Instant UI feedback

### Additional Libraries
- **next-pwa** - Progressive Web App support
- **next-themes** - Theme management
- **date-fns** - Date manipulation
- **axios** - HTTP client
- **sonner** - Toast notifications
- **react-day-picker** - Date picker component

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud like Render)
- npm or yarn package manager

### 1. Clone the Repository

```bash
git clone https://github.com/kachi33/kachi-todo.git
cd kachi-todo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Example for local PostgreSQL:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/kachi_todo?schema=public"

# Example for Render PostgreSQL:
# DATABASE_URL="postgresql://user:password@dpg-xxx.oregon-postgres.render.com/database_name"
```

### 4. Database Setup

Run Prisma migrations to create the database tables:

```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations to your database
npx prisma migrate deploy

# Or push schema directly (development)
npx prisma db push
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build & Deploy

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
kachi-todo/
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── tasks/
│   │   │   └── page.tsx       # Tasks page
│   │   └── not-found.tsx      # 404 page
│   ├── components/
│   │   ├── ui/                # ShadCN UI components
│   │   ├── CreateTodo.tsx     # Todo creation modal
│   │   ├── EditTodo.tsx       # Todo edit modal
│   │   ├── DeleteTodo.tsx     # Todo delete confirmation
│   │   ├── CreateList.tsx     # List creation/edit modal
│   │   ├── DeleteList.tsx     # List delete confirmation
│   │   ├── ListCard.tsx       # List display card
│   │   ├── TodoListItems.tsx  # Individual todo item
│   │   ├── HomeTodoList.tsx   # Dashboard todo list
│   │   ├── FilterModal.tsx    # Filter options modal
│   │   ├── PaginationControl.tsx
│   │   ├── ProductivityStats.tsx
│   │   ├── ProgressChart.tsx
│   │   ├── WeeklyProductivityCard.tsx
│   │   ├── QuotesCard.tsx
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   ├── ThemeToggle.tsx    # Dark mode toggle
│   │   ├── OfflineStatus.tsx  # Network status indicator
│   │   └── ErrorBoundary.tsx  # Error handling
│   ├── contexts/
│   │   ├── SidebarContext.tsx # Sidebar state management
│   │   └── ThemeContext.tsx   # Theme state management
│   ├── lib/
│   │   ├── api.ts             # API functions
│   │   ├── offlineApi.ts      # Offline fallback API
│   │   ├── dateUtils.ts       # Date utilities
│   │   └── utils.ts           # General utilities
│   ├── providers/
│   │   └── QueryProvider.tsx  # TanStack Query provider
│   └── types/
│       └── index.ts           # TypeScript type definitions
├── .env                        # Environment variables
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## 🗄️ Database Schema

### TodoList Table
```prisma
model TodoList {
  id         Int      @id @default(autoincrement())
  sessionId  String   @map("session_id")
  name       String
  color      String   @default("blue")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  todos      Todo[]
}
```

### Todo Table
```prisma
model Todo {
  id         Int       @id @default(autoincrement())
  sessionId  String    @map("session_id")
  listId     Int?      @map("list_id")
  title      String
  detail     String?
  priority   String    @default("medium")
  dueDate    String?   @map("due_date")
  dueTime    String?   @map("due_time")
  completed  Boolean   @default(false)
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  todoList   TodoList? @relation(fields: [listId])
}
```

## 🎨 Key Features Explained

### Session-Based Isolation
Each user gets a unique session ID stored in localStorage, ensuring their todos remain private without requiring authentication.

### Offline Support
The app includes a service worker and offline API fallback to ensure functionality even without an internet connection.

### Optimistic Updates
Using TanStack Query's optimistic update pattern, UI changes appear instantly before server confirmation, with automatic rollback on errors.

### Smart Filtering
Filter todos by:
- **Priority**: urgent, high, medium, low
- **Status**: all, completed, pending
- **List**: filter by specific todo list

### Dark Mode
Seamless dark mode toggle using next-themes with system preference detection and persistent user preference.

## 🔌 API Endpoints

### Todos
- `GET /api/todos` - Fetch all todos for session
- `GET /api/todos?listId={id}` - Fetch todos for specific list
- `POST /api/todos` - Create new todo
- `PUT /api/todos/{id}` - Update todo
- `DELETE /api/todos/{id}` - Delete todo

### Lists
- `GET /api/lists` - Fetch all lists for session
- `POST /api/lists` - Create new list
- `PUT /api/lists/{id}` - Update list
- `DELETE /api/lists/{id}` - Delete list (cascades to todos)

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build
```

## 🐞 Known Issues

- Session-based authentication only (no user accounts yet)
- No task sharing or collaboration features
- Limited productivity analytics
- No task categories or tags beyond lists
- No recurring tasks support

## 🚀 Future Improvements

### Authentication & Users
- [ ] User registration and login
- [ ] OAuth integration (Google, GitHub)
- [ ] Multi-device sync
- [ ] User profiles

### Features
- [ ] Task categories and tags
- [ ] Recurring tasks
- [ ] Task dependencies
- [ ] Subtasks/checklists
- [ ] File attachments
- [ ] Task comments
- [ ] Task sharing and collaboration
- [ ] Calendar view
- [ ] Kanban board view

### Analytics & Productivity
- [ ] Advanced analytics dashboard
- [ ] Productivity trends and insights
- [ ] Time tracking
- [ ] Task duration estimates
- [ ] Focus mode with Pomodoro timer

### Technical
- [ ] Comprehensive testing suite (Jest/Vitest)
- [ ] E2E testing (Playwright/Cypress)
- [ ] Performance monitoring
- [ ] Accessibility audit
- [ ] Internationalization (i18n)
- [ ] Email notifications
- [ ] Push notifications

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** with proper TypeScript typing
4. **Run checks**
   ```bash
   npm run type-check
   npm run lint
   npm run build
   ```
5. **Commit your changes**
   ```bash
   git commit -am 'Add new feature: description'
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Development Guidelines
- Maintain full TypeScript compatibility
- Follow existing code patterns and conventions
- Add proper type definitions for all new features
- Ensure components are accessible (WCAG compliant)
- Test on multiple screen sizes
- Include clear comments for complex logic
- Update documentation for new features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Kachi**
- GitHub: [@kachi33](https://github.com/kachi33)

## 🙏 Acknowledgments

- [ShadCN UI](https://ui.shadcn.com/) - For the beautiful component library
- [TanStack Query](https://tanstack.com/query) - For amazing data fetching
- [Lucide Icons](https://lucide.dev/) - For the icon set
- [Tailwind CSS](https://tailwindcss.com/) - For the styling framework
- [Prisma](https://www.prisma.io/) - For the excellent ORM

---

Built with ❤️ using Next.js and TypeScript
