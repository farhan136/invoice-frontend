# Invoice App – Frontend

This is the frontend for the **Invoice App**, built with **Next.js**, **TypeScript**, and **Tailwind CSS**. It provides a user interface to manage customers and invoices by communicating with a backend API.

## 📋 Prerequisites

Make sure the following are installed on your system:

- [Node.js](https://nodejs.org/) (version 18.x or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

## 🚀 Getting Started Locally

Follow these steps to run the application on your local machine:

### 1. Clone the Repository

Clone the repository and navigate into the project directory:

```bash
git clone <your-repository-url>
cd <your-project-directory>
````

### 2. Install Dependencies

Install all required dependencies:

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

The app needs the backend API URL to function.

1. Create a `.env.local` file in the root directory.
2. Add the following line to the file (replace the URL with your backend server address):

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

### 4. Start the Development Server

Make sure your backend is already running, then start the frontend development server:

```bash
npm run dev
# or
yarn dev
```

### 5. Open the Application

Once the server is running, you should see:

```
✓ Ready on http://localhost:3000
```

Open your browser and go to:

```
http://localhost:3000/login
```

to use the app.

## 🗂️ Project Structure

Overview of the main project directories:

```
/app        → Application pages and routes (Next.js routing)
/components → Reusable UI components (Buttons, Cards, Inputs, etc.)
/contexts   → React Context providers (e.g., AuthContext)
/lib        → Utility functions, including the main API client (api.ts)
/services   → Functions for communicating with specific backend API endpoints
/types      → Shared TypeScript type definitions and interfaces
```
