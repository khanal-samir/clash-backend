# Clash Backend Server

A robust backend server built with Node.js, Express, and TypeScript for the Clash application. This server provides a complete API for managing user authentication, clash creation, and real-time interactions.

## 🚀 Features

### Authentication & User Management

- User registration and login with JWT authentication
- Email verification system
- Password reset functionality
- Secure password hashing using bcrypt

### Clash Management

- Create and manage clashes with images
- Add multiple items to a clash
- Comment system for clashes
- Image upload and management
- Expiration system for clashes

### Real-time Features

- WebSocket integration using Socket.IO
- Real-time updates for clash interactions
- Live comment system

### Security

- Rate limiting to prevent abuse
- CORS protection
- Input validation using Zod
- Secure file upload handling

## 🛠️ Tech Stack

### Core Technologies

- Node.js
- Express.js
- TypeScript
- PostgreSQL (Database)
- Prisma (ORM)

### Key Dependencies

- `@prisma/client`: Database ORM
- `bcrypt`: Password hashing
- `bullmq`: Job queue management
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management
- `ejs`: Template engine
- `express-fileupload`: File upload handling
- `express-rate-limit`: Rate limiting
- `jsonwebtoken`: JWT authentication
- `nodemailer`: Email functionality
- `socket.io`: Real-time communication
- `zod`: Schema validation

## 📁 Project Structure

```
src/
├── configs/         # Configuration files
├── controllers/     # Route controllers
├── jobs/           # Background jobs
├── middlewares/    # Custom middlewares
├── routes/         # API routes
├── utils/          # Utility functions
├── validations/    # Request validations
├── views/          # EJS templates
├── custom-types.d.ts
├── helper.ts
├── index.ts
└── socket.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd server
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/clash"
JWT_SECRET="your-jwt-secret"
SMTP_HOST="your-smtp-host"
SMTP_PORT="your-smtp-port"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"
```

4. Set up the database

```bash
npx prisma migrate dev
```

5. Start the development server

```bash
npm run dev
```

### Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with hot reload
- `npm run build`: Build the TypeScript code
- `npm run watch`: Watch for TypeScript changes
- `npm run server`: Start the server with nodemon

## 📝 API Documentation

The API documentation is available in the Postman collection file: `Clash.postman_collection.json`

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation using Zod
- Secure file upload handling
- CORS protection

## 📧 Email System

The application includes a comprehensive email system for:

- User verification
- Password reset
- Notifications

## 🔄 Background Jobs

The server uses BullMQ for handling background jobs:

- Email sending
- Scheduled tasks
- Queue management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
