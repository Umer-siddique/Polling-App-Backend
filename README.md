# Polling-App Backend

This is the backend API for the Polling App, developed with **Express** and **MongoDB**. The backend handles user authentication and authorization, as well as APIs for managing polls and voting. This API is secured with middleware to prevent common security threats and follows best practices for a scalable application.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Register and login endpoints secured with JWT-based authentication.
- **Polls Management**: CRUD operations for creating, reading, updating, and deleting polls.
- **Voting**: Allows users to vote on polls with real-time updates via WebSockets.
- **Security**: Protects the API using Helmet, CORS, rate limiting, and more.
- **Data Validation**: Validates and sanitizes data using middleware.
- **Swagger Documentation**: Comprehensive API documentation with Swagger UI.

## Tech Stack

- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT for secure access
- **Documentation**: [Swagger](https://swagger.io/)

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or above)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/polling-app-backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd polling-app-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables by creating a `.env` file in the root directory. See [Environment Variables](#environment-variables) for required variables.

### Running the Application

- **Development Mode**: Start the app in development mode with nodemon for live reloading:

  ```bash
  npm run dev
  ```

- **Production Mode**: To start in production mode, run:

  ```bash
  npm run start
  ```

## API Documentation

The API is documented using **Swagger** and can be accessed at `/api-docs` once the server is running.

### Main Endpoints

- **Auth**:

  - `POST /api/v1/users/register`: Register a new user.
  - `POST /api/v1/users/login`: Login an existing user to receive a JWT token.

- **Polls**:

  - `GET /api/v1/polls`: Get all polls.
  - `POST /api/v1/polls`: Create a new poll (authorization required).
  - `GET /api/v1/polls/:id`: Get a single poll by ID.
  - `PATCH /api/v1/polls/:id`: Update a poll by ID (authorization required).
  - `DELETE /api/polls/:id`: Delete a poll by ID (authorization required).

- **Voting**:
  - `PATCH /api/polls/:id/vote`: Vote on a poll (authorization required).

For detailed documentation of each endpoint, visit `/api-docs` for interactive Swagger documentation.

## Available Scripts

- `dev`: Starts the server in development mode with `nodemon`.
- `start`: Starts the server in production mode.
- `test`: Runs any specified tests (currently unimplemented).

## Project Structure

```
polling-app-backend/
├── controllers/          # Functions that handle request logic
├── middleware/           # Authentication and security middleware
├── models/               # Mongoose models for MongoDB collections
├── routes/               # API routes for various features
├── config/               # Configuration files
├── server.js             # Main entry point for the server
└── swagger.json          # Swagger configuration
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

- `PORT`: The port the server will run on.
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for signing JWT tokens.
- `NODE_ENV`: Set to `development` or `production`.

Example:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/polling-app
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Contributing

Contributions are welcome! If you have any ideas or suggestions, please open an issue or submit a pull request.

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature-name'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the ISC License.
