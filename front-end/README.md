# Flipped - Front-End

## Project Structure

```
front-end/
├── public/                 # Static resources directory
│   ├── home.svg           # Home icon
│   ├── statistics.svg     # Statistics icon
│   ├── calendar.svg       # Calendar icon
│   └── profile.svg        # Profile icon
│
├── src/                   # Source code directory
│   ├── components/        # Components directory
│   │   ├── BottomNav/    # Bottom navigation component
│   │   │   ├── BottomNav.js
│   │   │   └── BottomNav.css
│   │   │
│   │   ├── header/       # Header component
│   │   │   ├── Header.js
│   │   │   └── Header.css
│   │   │
│   │   └── TaskList/     # Task list component
│   │       ├── TaskList.js
│   │       └── TaskList.css
│   │
│   ├── pages/            # Pages directory
│   │   └── mainpage/     # Main page
│   │       ├── MainPage.js
│   │       └── MainPage.css
│   │
│   ├── App.js            # Application entry component
│   ├── App.css           # Application global styles
│   ├── index.js          # Application entry file
│   └── index.css         # Global styles file
│
└── package.json          # Project configuration file
```

## Component Overview

### Page Components
- **MainPage**: The main page of the application that integrates all major components
  - Contains Header, TaskList, and BottomNav components
  - Handles overall layout and component coordination

### Feature Components
- **Header**: Top navigation bar
  - Displays the app title "Flipped"
  - Includes an add task button
  - Features frosted glass effect and gradient design

- **TaskList**: Task list component
  - Displays all task items
  - Each task item includes task text and flip button
  - Supports hover effects on task items

- **BottomNav**: Bottom navigation bar
  - Contains four main navigation items: Home, Statistics, Calendar, Profile
  - Uses SVG icons
  - Features icon hover animations




# Getting Started with  React App


## Available Scripts

In the project directory, you can run:

### `npm install`

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.





