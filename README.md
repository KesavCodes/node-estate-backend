# Real Estate Web Application

A comprehensive full-stack real estate web application built using React.js for the frontend, Node.js for the backend and MongoDB for the database.

## Table of Contents

- Installation
- Usage
- Features

## Installation

To install and set up the project, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/KesavCodes/node-estate-backend.git
    cd node-estate-backend
    npm install
    ```

2. **Install frontend dependencies**:
    ```bash
    git clone https://github.com/KesavCodes/react-estate-ui-frontend.git
    cd react-estate-ui-frontend
    npm install
    ```

3. **Install socket dependencies**:
    ```bash
    git clone https://github.com/KesavCodes/socket-estate.git
    cd socket-estate
    npm install
    ```

4. **Set up environment variables**:
    - Create a `.env` file in the `node-estate-backend` directory and add the DATABASEURL and JWT_SECRET_KEY.

## Usage

To start the project, follow these steps:

1. **Start the backend server**:
    ```bash
    cd node-estate-backend
    npx prisma db push
    npm start
    ```
2. **Start the frontend server**:
    ```bash
    cd react-estate-ui-frontend
    npm run dev
    ```
## Features

- **Home Page**: 
  - Search bar to input location and price range.
  - Fetches data from the database based on search queries.
  
- **Listng Page**: 
  - Filter options to refine search results.
  - Create, update, delete posts (login required).
  - Map component displaying item locations with zoom and navigation features.
    - Clickable items showing short information and detailed view options.

- **Single Page**:
  - Detailed information about the selected place, including location, features, and description.
  - Save place and send messages to the owner (login required).

- **User Authentication**:
  - Login and registration pages.
  - Error handling for incorrect credentials.
  - JWT-based authentication for secure login.

- **User Profile**:
  - Update user information.
  - Upload widget for adding images.
  - View and manage posts and saved posts.
  - Real-time messaging with notifications using Socket.io.

- **Backend**:
  - Custom API built from scratch.
  - Prisma for database operations (supports multiple database providers).
  - Using MongoDB for this application.
  - JWT for user authentication and authorization.
