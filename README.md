````markdown
# Invoice App - Frontend

This is the frontend for the Invoice App, built with Next.js, TypeScript, and Tailwind CSS. It provides a user interface to manage customers and invoices by interacting with a corresponding backend API.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
* [Node.js](https://nodejs.org/) (version 18.x or later)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## How to Run Locally

Follow these steps to get the frontend application running on your local machine.

### 1. Clone the Repository

First, clone the repository to your local machine (if you haven't already).

```bash
git clone <your-repository-url>
cd <your-project-directory>
````

### 2\. Install Dependencies

Install all the necessary project dependencies using npm (or yarn).

```bash
npm install
```

### 3\. Configure Environment Variables

The application needs to know the URL of your backend API.

  * Create a new file named `.env.local` in the root of the project directory.

  * Add the following line to the file, replacing the URL with the actual address of your running backend server:

    ```env
    NEXT_PUBLIC_API_URL=[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)
    ```

### 4\. Run the Development Server

Start the Next.js development server. Make sure your backend application is already running before you start the frontend.

```bash
npm run dev
```

### 5\. Open the Application

Once the server is running, you will see a message in your terminal, typically:

```
✓ Ready on http://localhost:3000
```

Open your web browser and navigate to **[http://localhost:3000/login](https://www.google.com/search?q=http://localhost:3000/login)** to use the application.

-----

## Project Structure Overview

  * **/app**: Contains all the pages and routes for the application.
  * **/components**: Reusable UI components (Buttons, Cards, Inputs, etc.).
  * **/contexts**: React Context providers, such as for authentication (`AuthContext`).
  * **/lib**: Utility functions, including the main API client (`api.ts`).
  * **/services**: Functions that communicate with specific backend API endpoints.
  * **/types**: Shared TypeScript type definitions and interfaces.

