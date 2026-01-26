# t&t-async-race

A single-page application (SPA) for managing a garage of cars, operating their engines, and viewing race statistics. Built with TypeScript, vanilla DOM manipulation, and a custom state management system.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [API Integration](#api-integration)
- [Project Architecture](#project-architecture)

---

## ✨ Features

### Garage Management
- 🚗 **Create Cars**: Add new cars with custom name and color
- 🎨 **Color Selection**: RGB color picker for car customization
- ✏️ **Update Cars**: Edit existing car properties
- 🗑️ **Delete Cars**: Remove cars from the garage
- 🎲 **Auto-Generate**: Create 100 random cars with one click

### Car Racing
- 🏁 **Start Engine**: Animate individual car movement
- ⏹️ **Stop Engine**: Return cars to starting position
- 🏆 **Race All**: Start all cars on current page simultaneously
- 🔄 **Reset Race**: Return all cars to starting positions

### Statistics & Winners
- 📊 **Winners Table**: View race statistics
- 📈 **Sorting**: Sort winners by wins or best time (ASC/DESC)
- 📖 **Pagination**: Navigate through cars and winners

### Persistent State
- 💾 **Form State Preservation**: Input values survive page navigation
- 📄 **Page Numbers**: Current page number preserved when switching views

---

## 🛠️ Tech Stack

- **Language**: TypeScript 5.9+
- **Runtime**: Node.js 14+
- **Build Tool**: Vite 7+
- **Styling**: CSS3 with CSS Modules
- **Code Quality**: 
  - ESLint + TypeScript ESLint
  - Prettier
  - Unicorn Plugin
- **API Client**: Fetch API


---

## 🚀 Frontend Setup

### Prerequisites

- **Node.js**: v14 or higher
- **npm**: v6 or higher
- **Git**: For version control

### Installation

1. **Clone the repository** (or navigate to project directory):
```bash
cd team_frontend/t-t-async-race
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run the application**:
```bash
npm run dev
```
The application will be available at http://localhost:5173 (Vite default)

## 🚀 Server setup

Clone the repository from the [link](https://github.com/mikhama/async-race-api)

The application requires to start both frontend and backend server at the same time
**command for starting frontend: npm run dev**
**command for starting backend: npm start**

## API Endpoints Used
### Garage (Cars)

```GET /garage?_page={page}&_limit={limit}``` - Get cars with pagination
```GET /garage/{id}``` - Get specific car
```POST /garage``` - Create new car
```PUT /garage/{id}``` - Update car
```DELETE /garage/{id}``` - Delete car

### Engine

```PATCH /engine?id={id}&status=started|stopped``` - Start/stop engine
```PATCH /engine?id={id}&status=drive``` - Drive car (may fail randomly)

### Winners

```GET /winners?_page={page}&_limit={limit}&_sort={field}&_order={order}``` - Get winners
```GET /winners/{id}``` - Get winner by ID
```POST /winners``` - Create winner record
```PUT /winners/{id}``` - Update winner
```DELETE /winners/{id}``` - Delete winner