# GreenHaven UI 🎨

The frontend application for GreenHaven, built with React, Vite, and Tailwind CSS.

## Features

- **Modern UI**: A clean, responsive design using Tailwind CSS and custom components.
- **State Management**: Utilizes Zustand for global state (cart, auth, UI) and React Query for server state.
- **Routing**: React Router for seamless navigation.
- **Animations**: Framer Motion for smooth transitions and interactive elements.
- **Icons**: Lucide React for a consistent icon set.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1.  Navigate to the UI directory:

    ```bash
    cd GreenHaven.UI
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Development Server

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To build the application for production:

```bash
npm run build
```

## Project Structure

- `src/components`: Reusable UI components.
- `src/pages`: Page components corresponding to routes.
- `src/store`: Zustand stores for state management.
- `src/api`: Axios configuration and API calls.
- `src/hooks`: Custom React hooks.

## Configuration

The application connects to the backend API. Ensure the API URL is correctly configured in `src/api/axios.js` or via environment variables.
