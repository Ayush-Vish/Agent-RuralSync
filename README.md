# 👷 RuralSync - Agent App

> Mobile-friendly web application for field agents to manage and complete service bookings.

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg)](https://tailwindcss.com/)

🔗 **Live Demo:** [https://agent-rural-sync.vercel.app/](https://agent-rural-sync.vercel.app/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Related Projects](#related-projects)

---

## 🎯 Overview

RuralSync Agent App is designed for field workers who fulfill service bookings. Agents can view their assigned jobs, update booking statuses, add extra tasks, and process payments - all from a mobile-friendly interface.

---

## ✨ Features

### 📊 Dashboard
- **Today's Overview** - Quick view of assigned bookings
- **Status Summary** - Pending, In Progress, Completed counts
- **Earnings Tracker** - Track completed job earnings
- **Quick Actions** - Fast access to common tasks

### 📅 Booking Management
- **Assigned Bookings** - View all assigned jobs
- **Booking Details** - Complete customer and service information
- **Status Updates** - Update booking progress:
  - `ASSIGNED` → `IN_PROGRESS` → `COMPLETED`
- **Customer Info** - View customer contact details
- **Service Details** - Service type, location, scheduled time

### 💼 Extra Tasks
- **Add Tasks** - Add additional work items during service
- **Task Pricing** - Set price for extra work
- **Edit Tasks** - Modify task details
- **Remove Tasks** - Delete unnecessary tasks
- **Auto-Calculate** - Automatic total price calculation

### 💳 Payment Processing
- **Mark as Paid** - Record payment completion
- **Payment Methods** - Cash, Online, or None
- **Payment Status** - Track paid/unpaid bookings

### 👤 Profile
- **Profile View** - View agent profile information
- **Organization Info** - See assigned organization
- **Service Areas** - View assigned service areas
- **Performance Stats** - Completed bookings count

### 🎨 User Experience
- **Mobile-First Design** - Optimized for mobile devices
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Layout** - Works on all screen sizes
- **Touch-Friendly** - Easy to use on touchscreens

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI component library |
| **Zustand** | State management |
| **React Router** | Client-side routing |
| **React Hot Toast** | Notifications |
| **Axios** | HTTP client |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RS-Monolith/agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:5175](http://localhost:5175)

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
agent/
├── src/
│   ├── components/           # Reusable components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── booking/         # Booking components
│   │   ├── dashboard/       # Dashboard widgets
│   │   └── layout/          # Layout components
│   ├── pages/               # Page components
│   │   ├── dashboard/       # Main dashboard
│   │   ├── bookings/        # Booking management
│   │   └── login.tsx        # Authentication
│   ├── stores/              # Zustand state stores
│   │   ├── auth.store.ts    # Auth state
│   │   ├── booking.store.ts # Booking state
│   │   └── org.store.ts     # Organization state
│   ├── lib/                 # Utilities
│   │   ├── axios.ts         # Axios instance
│   │   └── utils.ts         # Helper functions
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript types
│   └── assets/              # Static assets
├── public/                  # Public assets
└── index.html              # Entry HTML
```

---

## 📱 Mobile-First Design

The Agent App is designed with a mobile-first approach:

- **Touch-friendly buttons** - Large tap targets
- **Swipe gestures** - Natural mobile interactions
- **Compact layouts** - Efficient use of screen space
- **Bottom navigation** - Easy thumb access
- **Pull-to-refresh** - Standard mobile pattern

---

## 🔄 Booking Workflow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   PENDING   │ -> │  ASSIGNED   │ -> │ IN_PROGRESS │ -> │  COMPLETED  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                  │                  │                  │
       │                  │                  │                  │
  Provider           Agent views       Agent starts       Agent marks
  assigns           booking &          working on         job complete
  agent             travels            the service        & processes
                                                          payment
```

---

## 🔗 Related Projects

| Project | Description | Link |
|---------|-------------|------|
| **RuralSync API** | Backend API server | [https://ruralsyncapi.vercel.app/](https://ruralsyncapi.vercel.app/) |
| **Client Portal** | Customer-facing app | [https://ruralsync.vercel.app/](https://ruralsync.vercel.app/) |
| **Provider Portal** | Service provider dashboard | [https://ruralsync-service-provider.vercel.app/](https://ruralsync-service-provider.vercel.app/) |

---

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

---

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components including:

- Button, Card, Badge
- Dialog, Sheet
- Form, Input, Select
- Skeleton (loading states)
- Toast notifications

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is part of the RuralSync platform.

---

<p align="center">
  Made with ❤️ for Rural Communities
</p>
