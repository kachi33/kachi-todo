# Kachi Todo

A modern, full-featured Todo List application built with **Next.js 16**, **TypeScript**, **PostgreSQL**, and **Prisma**. Features include todo lists, task management, filtering, dark mode, offline support, and productivity tracking.

## Table of Contents
- [Live Demo](#live-demo)
- [Screenshots](#screenshots)
- [Features](#features)
  - [Core Features](#core-features)
  - [UI/UX Features](#uiux-features)
  - [Productivity Features](#productivity-features)
  - [Technical Features](#technical-features)
- [Tech Stack](#tech-stack)
  - [Frontend](#frontend)
  - [Backend & Database](#backend--database)
  - [State Management & Data Fetching](#state-management--data-fetching)
  - [Additional Libraries](#additional-libraries)
- [Installation & Setup](#installation--setup)
- [Build & Deploy](#build--deploy)
- [Key Features Explained](#key-features-explained)
- [Project Architecture](#project-architecture)
- [Contributing](#contributing)
- [Known Issues](#known-issues)
- [Future Improvements](#future-improvements)
- [License](#license)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Live Demo

[Kachi-todo-app](https://kachi-todo.pipeops.net//)

## Screenshots

### Task Creation & Editing
![Task Creation](./docs/screenshots/task-creation.png)
*Create and edit tasks with due dates, priorities, and custom lists*

<!-- Placeholder: Add screenshot of task creation/editing modal -->

### Dark Mode
![Dark Mode](./docs/screenshots/dark-mode.png)
*Seamless dark mode support across the entire application*

<!-- Placeholder: Add screenshot showing dark mode -->

## Features

### Core Features
- **Task Management** - Create, edit, delete, and organize tasks
- **Custom Lists and Priority Levels** - Organize todos into custom lists while Set task priorities
- **Advanced Filtering and Pagination.**
- **Offline Support** - PWA with offline capabilities

### UI/UX Features
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Optimized for all screen sizes
- **Fast & Smooth** - Built with Next.js for optimal performance
- **Modern UI** - Beautiful interface using Tailwind CSS and ShadCN UI
- **Optimistic Updates** - Instant UI feedback using TanStack Query
- **Interactive Welcome Modal** - Onboarding experience for new users
- **Real-time Sync Indicators** - Visual feedback for data synchronization
- **Empty State Handling** - Helpful messages and prompts when no data exists
- **Loading Skeletons** - Smooth loading states for better UX

### Productivity Features
- **Productivity Stats** - Track completed vs pending tasks
- **Streak Tracking** - Calendar visualization of your task completion streak
- **Today's Activity** - Monitor tasks created and completed today
- **Weekly Overview** - Visual progress tracking
- **Upcoming Tasks** - Dashboard view of tasks due soon
- **Overdue Tracking** - Identify overdue tasks
- **Motivational Quotes** - Inspiring quotes on the dashboard
- **Keyboard Shortcuts** - Power user features for quick navigation
- **Sync Notifications** - Stay informed about background sync status

### Technical Features
- **Session Management** - Session-based task isolation
- **PostgreSQL Database** - Reliable data persistence with Prisma ORM
- **Server-Side Rendering** - Fast initial page loads with Next.js
- **Accessible** - WCAG compliant components
- **Error Boundaries** - Graceful error handling with retry capabilities
- **Background Sync** - Service worker for offline-first architecture
- **Optimistic UI Updates** - Instant feedback with automatic rollback on errors

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with modern features
- **TypeScript 5.9** - Full type safety
- **Tailwind CSS 4** - Utility-first styling
- **ShadCN UI** - Accessible component library built on Radix UI
- **Lucide React** - Beautiful icon library
- **Swiper** - Touch slider for carousels and statistics

### Backend & Database
- **PostgreSQL** - Production-ready relational database
- **Prisma 6.18** - Type-safe ORM for database access
- **Next.js API Routes** - Serverless API endpoints

### State Management & Data Fetching
- **TanStack Query v5** - Server state management with caching
- **React Context** - Client-side state (theme, sidebar)
- **Optimistic Updates** - Instant UI feedback

### Additional Libraries
- **next-pwa** - Progressive Web App support with offline capabilities
- **next-themes** - Theme management with system preference detection
- **date-fns** - Date manipulation and formatting
- **axios** - HTTP client for API requests
- **sonner** - Toast notifications
- **react-day-picker** - Date picker component
- **embla-carousel-react** - Carousel component for smooth scrolling
- **class-variance-authority** - Component variant styling
- **clsx** - Conditional className utility
- **tailwind-merge** - Tailwind class merging utility

## Installation & Setup

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

## Build & Deploy

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


## Key Features Explained

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

## Project Architecture

For detailed information about the project structure, component organization, and data flow, see [ARCHITECTURE.md](./ARCHITECTURE.md).

**Quick Overview:**
- **Frontend**: Next.js 16 with App Router, React Server Components
- **State Management**: TanStack Query for server state, React Context for UI state
- **Database**: PostgreSQL with Prisma ORM
- **Offline Support**: Service Worker with IndexedDB fallback
- **Styling**: Tailwind CSS 4 with ShadCN UI components

## Known Issues

- Session-based authentication only (no user accounts yet)
- No task sharing or collaboration features
- No task categories or tags beyond lists
- No recurring tasks support
- HMR/Turbopack cache issues during development (clear .next folder if needed)
- Weekly productivity tracking requires timestamp feature implementation

## Future Improvements

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

## Contributing

We welcome contributions! Whether it's bug fixes, new features, or documentation improvements, your help is appreciated.

**Quick Start:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

**For detailed contribution guidelines, development setup, and code standards, see [CONTRIBUTING.md](./CONTRIBUTING.md).**

### Development Guidelines
- Maintain full TypeScript compatibility
- Follow existing code patterns
- Ensure components are accessible (WCAG compliant)
- Test on multiple screen sizes
- Add proper type definitions

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Kachi**
- GitHub: [@kachi33](https://github.com/kachi33)

## Acknowledgments

- [ShadCN UI](https://ui.shadcn.com/) - For the beautiful component library
- [TanStack Query](https://tanstack.com/query) - For amazing data fetching
- [Lucide Icons](https://lucide.dev/) - For the icon set
- [Tailwind CSS](https://tailwindcss.com/) - For the styling framework
- [Prisma](https://www.prisma.io/) - For the excellent ORM

---

Built by Kachi 
