# MCP Server (NestJS)

A robust, scalable, and extensible server-side application built with [NestJS](https://nestjs.com/). This project provides a Model Context Protocol (MCP) server implementation, file management, authentication, and modular REST APIs for posts and users.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **MCP Server**: Implements Model Context Protocol for file operations and more.
- **File Management**: Upload, download, list, and delete files via REST endpoints.
- **Authentication**: JWT-based authentication with local strategy.
- **User & Post Modules**: Modular structure for users and posts with DTOs and entities.
- **Swagger Integration**: API documentation out-of-the-box.
- **Extensible**: Easily add new modules and features.

---

## Architecture

- **NestJS**: Progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **MCP Integration**: Uses a custom FileBrowserMCP for file operations.
- **Modular Design**: Each feature is encapsulated in its own module.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)

### Installation

```bash
# Clone the repository
$ git clone https://github.com/Cstannahill/mcp-server-nestjs.git
$ cd nestjs-mcp-server

# Install dependencies
$ npm install
```

### Environment Variables

Create a `.env` file in the root directory for any secrets or configuration overrides (optional).

---

## Development

### Running the Server

```bash
# Start in development mode (with hot reload)
$ npm run start:dev

# Start in production mode
$ npm run start:prod
```

### Useful Commands

```bash
# Compile TypeScript
$ npm run build

# Lint code
$ npm run lint
```

---

## Testing

### Run Unit Tests

```bash
$ npm run test
```

### Run End-to-End (e2e) Tests

```bash
$ npm run test:e2e
```

### Test Coverage

```bash
$ npm run test:cov
```

---

## Deployment

1. Build the project:
   ```bash
   $ npm run build
   ```
2. Start the server:
   ```bash
   $ npm run start:prod
   ```
3. For advanced deployment (Docker, cloud, etc.), see [NestJS Deployment Docs](https://docs.nestjs.com/deployment).

---

## API Reference

- Swagger UI is available (if enabled) at `/api` when the server is running.
- Main endpoints:
  - `POST /auth/login` — Authenticate and receive JWT
  - `POST /files/upload` — Upload a file
  - `GET /files/:id` — Download a file
  - `DELETE /files/:id` — Delete a file
  - `GET /files` — List files
  - `POST /users` — Create a user
  - `POST /posts` — Create a post

See controller files in `src/` for more details.

---

## Project Structure

```
src/
  app.module.ts         # Root module
  main.ts               # Entry point
  auth/                 # Authentication (JWT, guards, strategies)
  file/                 # File management (upload, download, delete)
  mcps/                 # Model Context Protocol integration
  posts/                # Posts module
  users/                # Users module
  database/             # Database connection (if used)
uploads/                 # Uploaded files (local dev)
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

### Coding Standards

- Follow the existing code style (see ESLint config)
- Write unit and e2e tests for new features
- Document your code and update the README as needed

---

## Git Setup

This project uses Git for version control. The remote origin is set to:

```
https://github.com/Cstannahill/mcp-server-nestjs.git
```

---

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

---

## Resources & Support

- [NestJS Documentation](https://docs.nestjs.com)
- [Discord Community](https://discord.gg/G7Qnnhy)
- [Courses](https://courses.nestjs.com/)
- [NestJS Devtools](https://devtools.nestjs.com)
- [Enterprise Support](https://enterprise.nestjs.com)
- [Jobs Board](https://jobs.nestjs.com)
- [Author](https://twitter.com/kammysliwiec)

---

For any questions, issues, or feature requests, please open an issue or contact the maintainer.
