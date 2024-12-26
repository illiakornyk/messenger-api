# Messenger App

## Introduction

This project is a simple messenger application, similar to Telegram, that allows users to communicate with each other via text messages. Users can find each other using unique nicknames. The application will be developed using a microservice architecture, with a backend written in Node.js, and a frontend built with React.js. Data will be stored in the cloud using PostgreSQL.

## Author

This project was developed by Illia Kornyk, a student of group IM-24 at NTUU KPI.

## Report for laboratory tasks

[Звіт до лабораторних робіт](https://docs.google.com/document/d/1arizDLe53Vias724hYhUuZtRrXoWFCQkYFieQLy5dEs/edit?usp=sharing)

## Features

- User registration and authentication
- Find and connect with users by nickname
- Send and receive text messages
- Real-time messaging
- Cloud data storage for user information and messages

## Technology Stack

- **Frontend:** React.js
- **Backend:** Node.js
- **Databases:**
  - PostgreSQL
- **Cloud Solutions:** [Heroku/AWS/GCP/DigitalOcean/etc.] (to be determined)
- **Containerization:** Docker

## Setup Instructions

### Prerequisites

- **Node.js** installed on your machine
- **PostgreSQL** (can be set up locally or run using Docker)
- **Docker** and **Docker Compose** installed (if using Docker, local installations are not required)

### Environment Variables

The following environment variables are required to configure the application:

| Name                              | Required | Default Value | Description                                                                                                             |
| --------------------------------- | -------- | ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `POSTGRES_USER`                   | Yes      | None          | The username for authenticating with the PostgreSQL database.                                                           |
| `POSTGRES_PASSWORD`               | Yes      | None          | The password for authenticating with the PostgreSQL database.                                                           |
| `POSTGRES_DB`                     | Yes      | None          | The name of the PostgreSQL database to connect to.                                                                      |
| `POSTGRES_PORT`                   | Yes      | 5432          | The port number on which the PostgreSQL database is running.                                                            |
| `POSTGRES_HOST`                   | Yes      | 'localhost'   | The hostname or IP address of the PostgreSQL database server.                                                           |
| `IS_PRODUCTION`                   | Yes      | `false`       | Indicates whether the app is running in a production environment. Use `true` for production.                            |
| `JWT_ACCESS_TOKEN_SECRET`         | Yes      | None          | The secret key used for signing JWT access tokens.                                                                      |
| `JWT_ACCESS_TOKEN_EXPIRATION_MS`  | Yes      | None          | The expiration time for JWT access tokens in milliseconds.                                                              |
| `JWT_REFRESH_TOKEN_SECRET`        | Yes      | None          | The secret key used for signing JWT refresh tokens.                                                                     |
| `JWT_REFRESH_TOKEN_EXPIRATION_MS` | Yes      | None          | The expiration time for JWT refresh tokens in milliseconds.                                                             |
| `DB_ENABLE_SSL`                   | Yes      | `false`       | Indicates whether SSL is enabled for the database connection. Required for external deployed databases.                 |
| `DB_SSL_REJECT_UNAUTHORIZED`      | Yes      | `false`       | Determines whether the SSL certificate should be verified. Typically used with external databases where SSL is enabled. |

### Getting Started

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory:**

   ```bash
   cd messenger-app
   ```

3. **Create a `.env` file in the root of the project:**

   - Add the required environment variables as described in the **Environment Variables** section above.
   - Example `.env`:

     ```env
     POSTGRES_USER=your_username
     POSTGRES_PASSWORD=your_password
     POSTGRES_DB=your_database
     POSTGRES_PORT=5432
     POSTGRES_HOST=localhost
     IS_PRODUCTION=false
     JWT_ACCESS_TOKEN_SECRET=access_token_secret
     JWT_ACCESS_TOKEN_EXPIRATION_MS=3600000
     JWT_REFRESH_TOKEN_SECRET=refresh_token_secret
     JWT_REFRESH_TOKEN_EXPIRATION_MS=604800000
     DB_ENABLE_SSL=false
     DB_SSL_REJECT_UNAUTHORIZED=false
     ```

4. **Configure the database:**

   - Make sure your PostgreSQL database is running and accessible with the credentials provided in the `.env` file.

5. **Install dependencies:**

   ```bash
   npm install
   ```

6. **Run database migrations:**

   - Apply migrations to set up the database schema:

     ```bash
     npm run migration:run
     ```

   - Ensure that the migrations complete successfully.

7. **Build the project:**

   ```bash
   npm run build
   ```

8. **Start the project:**

   ```bash
   npm run start:dev
   ```

---

### Running the Application with Docker

The project can also be set up and run using Docker:

1. **Ensure `.env` file is created:**

   - The `.env` file must exist in the project root with the required environment variables set.

2. **Build and start the services:**

   ```bash
   docker-compose up --build
   ```

3. **Stop the services:**

   ```bash
   docker-compose down
   ```

4. **Access the Application:**

   - The backend services will be accessible at their respective ports as defined in the `docker-compose.yml` file.
   - By default, the main service will be available at `http://localhost:3000`.

### Deployed Version

The deployed version of this application can be found [here](https://messenger-api-2930.onrender.com/).

### API Documentation

#### Swagger

For testing and API documentation, Swagger is used. You can find the documentation at the endpoint `/docs`.

- [Swagger](https://messenger-api-2930.onrender.com/docs)

#### Postman

- [Postman flow](https://web.postman.co/workspace/e7b4d90b-5e29-44c8-8228-fb7b46bbfea0/flow/672a73b035ab526e247c29e4)
- [Postman authentication flow](https://web.postman.co/workspace/My-Workspace~e7b4d90b-5e29-44c8-8228-fb7b46bbfea0/flow/676942cbeaf5ba74950e3efe)

- [Postman collection](./assets/Messenger%20App.postman_collection.json)

## Usage

- Register: Users can create an account using their nickname.
- Find Users: Search for users by their nickname.
- Messaging: Send and receive messages in real time.

## Components diagram

![ Components diagram](./assets/component_diagram.svg)

- Auth: Manages JWT-based authentication, checks user credentials (via User), and stores tokens in Database. Uses Common for shared utilities.
- User: Handles user data (name, email, etc.), persisting to Database.
- Chat: Creates and manages chat entities, requires user references (via User) and saves everything in Database. Also uses Common for utilities.
- Messages: Manages message creation and retrieval, referencing both User (as sender) and Chat (to which the message belongs). Data is stored in Database. May use Common for utility functions.
- Database: Configures the database connection (PostgreSQL or similar) using TypeORM, responsible for entity and repository setup.
- TypeORM: Specifically manages migrations and low-level database operations.
- Common: A place for shared utilities or helpers that can be used by any module (e.g., logging, error handling).
- Healthcheck: Offers a simple route or service to check if the application and database are running properly.

### **Database Migrations**

This project uses **TypeORM** for managing database migrations. Below are the migration-related scripts defined in `package.json`:

| Script                       | Description                                                                |
| ---------------------------- | -------------------------------------------------------------------------- |
| `npm run migration:generate` | Generates a new migration file based on changes in the entity definitions. |
| `npm run migration:run`      | Applies all pending migrations to the database.                            |
| `npm run migration:revert`   | Reverts the most recently applied migration.                               |

These scripts ensure that your database schema stays consistent with the application's entity definitions. Run these commands as needed during development or deployment.

## Database Structure

![Database diagram](./assets/database_diagram.png)

### Tables

1. **`user_accounts`:**

   - Represents the users in the system.
   - **Columns:**
     - `id`: Unique identifier for each user.
     - `name`: User's name.
     - `username`: Unique nickname for the user.
     - `email`: User's email address.
     - `password`: Hashed password for authentication.
     - `createdAt` and `updatedAt`: Timestamps for tracking user creation and updates.

2. **`chats`:**

   - Represents individual chats or group conversations.
   - **Columns:**
     - `id`: Unique identifier for each chat.
     - `createdAt` and `updatedAt`: Timestamps for chat creation and updates.

3. **`chat_users`:**

   - Represents the many-to-many relationship between users and chats.
   - **Columns:**
     - `chat_id`: Foreign key referencing `chats.id`.
     - `user_id`: Foreign key referencing `user_accounts.id`.
     - **Primary Key:** Composite key consisting of `chat_id` and `user_id`.

4. **`messages`:**

   - Represents the messages exchanged within chats.
   - **Columns:**
     - `id`: Unique identifier for each message.
     - `content`: Text content of the message.
     - `sender_id`: Foreign key referencing `user_accounts.id`, indicating the sender of the message.
     - `chat_id`: Foreign key referencing `chats.id`, indicating the chat the message belongs to.
     - `createdAt` and `updatedAt`: Timestamps for tracking when the message was sent and updated.

5. **`refresh_tokens`:**

   - Represents the refresh tokens for users to maintain session authentication.
   - **Columns:**
     - `id`: Unique identifier for the refresh token.
     - `token`: Encrypted token for refreshing authentication.
     - `userId`: Foreign key referencing `user_accounts.id`.
     - `createdAt` and `updatedAt`: Timestamps for tracking token creation and updates.
     - `expiresAt`: Expiration date for the refresh token.

6. **`migrations`:**
   - Tracks database schema changes.
   - **Columns:**
     - `id`: Unique identifier for each migration.
     - `timestamp`: Time when the migration was applied.
     - `name`: Description of the migration.

---

### Relationships

1. **Users and Chats (`user_accounts` ↔ `chats`):**

   - **Type:** Many-to-Many (via `chat_users`).
   - **Explanation:** A user can participate in multiple chats, and each chat can include multiple users.

2. **Chats and Messages (`chats` ↔ `messages`):**

   - **Type:** One-to-Many.
   - **Explanation:** Each chat can contain multiple messages, but each message belongs to only one chat.

3. **Users and Messages (`user_accounts` ↔ `messages`):**

   - **Type:** One-to-Many.
   - **Explanation:** A user can send multiple messages, but each message has a single sender.

4. **Users and Refresh Tokens (`user_accounts` ↔ `refresh_tokens`):**

   - **Type:** One-to-One.
   - **Explanation:** Each user has a single refresh token that can be used to maintain session authentication.

## Future Improvements

- Implement message notifications
- Add support for multimedia messages (images, videos)
- Enhance user interface and user experience
