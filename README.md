# Messenger App

## Introduction

This project is a simple messenger application, similar to Telegram, that allows users to communicate with each other via text messages. Users can find each other using unique nicknames. The application will be developed using a microservice architecture, with a backend written in Node.js and Java Spring, and a frontend built with React.js. Data will be stored in the cloud using PostgreSQL for user authentication and login data, and MongoDB for streaming user data, such as messages.

## Features

- User registration and authentication
- Find and connect with users by nickname
- Send and receive text messages
- Real-time messaging
- Cloud data storage for user information and messages

## Technology Stack

- **Frontend:** React.js
- **Backend:** Node.js and Java Spring (Microservices)
- **Databases:**
  - PostgreSQL (for user authentication)
  - MongoDB (for messages and streaming data)
- **Cloud Solutions:** [Heroku/AWS/GCP/DigitalOcean/etc.] (to be determined)
- **Containerization:** Docker

## Setup Instructions

### Prerequisites

- **Node.js** installed on your machine (this repository contains only the Node.js service)
- **MongoDB** (can be set up locally or run using Docker)
- **Docker** and **Docker Compose** installed (if using Docker, local installations are not required)

### Getting Started

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory:**

   ```bash
   cd messenger-app
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Build the project**

   ```bash
   npm run build
   ```

5. **Start the project**

   ```bash
   npm run start:prod
   ```

#### Running the Application with Docker

The project can be set up and run using Docker

- Build and start the services:

  ```bash
  docker-compose up --build
  ```

- Stop the services:

  ```bash
  docker-compose down
  ```

- Access the Application:

  The backend services will be accessible at their respective ports as defined in the `docker-compose.yml` file.

  By default, the main service will be available at `http://localhost:3000`

### Deployed Version

The deployed version of this application can be found [here](https://messenger-api-2930.onrender.com/).

## Usage

- Register: Users can create an account using their nickname.
- Find Users: Search for users by their nickname.
- Messaging: Send and receive messages in real time.

### Future Improvements

- Implement message notifications
- Add support for multimedia messages (images, videos)
- Enhance user interface and user experience
