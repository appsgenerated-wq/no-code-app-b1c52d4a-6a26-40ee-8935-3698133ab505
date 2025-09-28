# PotatoPedia - A Manifest-Powered React App

This is a full-stack application built to catalog potato varieties. The entire backend is powered by Manifest, and the frontend is a modern React application using Vite and Tailwind CSS.

## Features

- **Manifest Backend**: Zero backend code. The entire API, database, and authentication system is defined in `manifest.yml`.
- **User Authentication**: Users can sign up and log in. Authenticated users can contribute new potato varieties.
- **CRUD Operations**: Full Create, Read, Update, and Delete functionality for potato varieties, handled by the Manifest SDK.
- **File Uploads**: Each potato variety can have an image, leveraging Manifest's built-in file storage.
- **Role-Based Access Control**: Policies in `manifest.yml` define what users can do. Public users can view varieties, authenticated users can create them, and only the original contributor can update or delete their own entries.
- **Admin Panel**: A complete, auto-generated admin interface is available at `/admin` for managing users and all data.

## Getting Started

### Prerequisites

- Node.js (v18+)
- A Manifest account and a deployed backend for this application.

### Frontend Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Configure Environment**: 
    The application connects to the Manifest backend using environment variables. These are provided in `src/constants.js`. The build platform will automatically inject the correct `APP_ID` and `BACKEND_URL` during deployment.

3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

### Backend Setup

The backend is fully defined by the `manifest.yml` file. When this project is deployed on a Manifest-compatible platform, the platform will read this file and provision all the necessary backend infrastructure:

- A SQLite or PostgreSQL database with tables for `User` and `PotatoVariety`.
- A full REST API with endpoints for authentication and CRUD operations.
- A secure admin panel for data management.

### Default Credentials

- **Admin User**: `admin@manifest.build` / `password`
- **Contributor (Demo) User**: `contributor@manifest.build` / `password`

You can log into the main application with the contributor credentials or access the full admin panel with the admin credentials.
