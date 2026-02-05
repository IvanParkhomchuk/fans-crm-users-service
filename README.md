# Fans CRM Users Service

A backend project for user management built with NestJS, MongoDB, and Docker. Provides user authentication, registration, and management functionality with JWT-based security.

## Tech Stack

- **Framework:** NestJS v11
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with Passport.js
- **Password Hashing:** bcryptjs
- **Validation:** class-validator & class-transformer
- **Containerization:** Docker & Docker Compose

## Project Structure

```
src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module
├── seeder.ts                  # Database seeding script
├── auth/                      # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── guards/                # JWT & Local auth guards
│   ├── strategies/            # Passport strategies
│   ├── decorators/            # Custom decorators (@CurrentUser)
│   └── dto/
└── users/                     # Users module
    ├── users.controller.ts
    ├── users.service.ts
    ├── users.repository.ts
    ├── users.seeder.ts
    ├── models/                # Mongoose schemas
    ├── dto/
    ├── constants/
    └── helpers/
```

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js v22+ (for local development without Docker)

### Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB
MONGODB_URI=mongodb://mongo:27017/fans-crm
MONGODB_LOCAL_URI=mongodb://localhost:27017/fans-crm

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=15m
```

### Running with Docker

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd fans-crm-users-service
   ```

2. Create the `.env` file with the variables above

3. Start the services:
   ```bash
   docker-compose up
   ```

   This will:
   - Start a MongoDB instance on port 27017
   - Build and start the NestJS application on port 3000
   - Automatically seed the database if it's empty

4. The API will be available at `http://localhost:3000/api/v1`

### Running Locally (without Docker)

1. Ensure MongoDB is running locally on port 27017

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run start:dev
   ```

## API Endpoints

All endpoints are prefixed with `/api/v1`

### Authentication

#### Login

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | Authenticate and get JWT token | None |

**Request Body:**
```json
{
  "email": "admin@admin",
  "password": "Admin123!"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Users

All user endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <access_token>
```

#### Create User

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/add-user` | Create a new user | JWT |

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phoneNumber": "+1234567890"
}
```

**Validation Rules:**
- `name`: Required, string
- `email`: Required, valid email format, must be unique
- `password`: Required, minimum 8 characters, must contain uppercase, lowercase, number, and special character
- `phoneNumber`: Required, valid phone number format

**Response:** Returns the created user object (without password)

---

#### Get Users (Paginated)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/get-users` | Get paginated list of users with filtering | JWT |

#### Query Parameters

- **`page`** *(number, optional)*  
  Page number. Minimum value: `1`.  
  **Default:** `1`

- **`perPage`** *(number, optional)*  
  Number of items per page. Allowed range: `1–100`.  
  **Default:** `10`

- **`name`** *(string, optional)*  
  Filter users by name using fuzzy search.

- **`email`** *(string, optional)*  
  Filter users by email using fuzzy search.

- **`phone`** *(string, optional)*  
  Filter users by phone using fuzzy search.



**Example Request:**
```
GET /api/v1/get-users?page=1&perPage=20&name=john
```

**Response:**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890"
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "perPage": 20
  }
}
```

---

#### Get User by ID

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/get-user/:id` | Get a single user by ID | JWT |

**Path Parameters:**
- `id`: MongoDB ObjectId

**Example Request:**
```
GET /api/v1/get-user/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+1234567890"
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

## Database Seeding

The application automatically seeds the database on startup if it's empty. This creates:
- A default admin user
- Test users for development

### Default Admin Credentials

```
Email: admin@admin
Password: Admin123!
```

### Manual Seeding Commands

```bash
# Refresh (drop + seed)
npm run seed:refresh
```

## Development Commands

```bash
# Install dependencies
npm install

# Development mode (with hot reload)
npm run start:dev

# Production build
npm run build
```

## Docker Commands

```bash
# Start services
docker-compose up

# Start in detached mode
docker-compose up -d

# Rebuild and start
docker-compose up --build

# Stop services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

## User Schema

```typescript
{
  _id: ObjectId,        // Auto-generated MongoDB ID
  name: string,         // User's full name
  email: string,        // Unique email address
  password: string,     // Bcrypt hashed password (not returned in responses)
  phoneNumber: string   // Phone number
}
```

## Authentication Flow

1. Client sends credentials to `POST /api/v1/auth/login`
2. Server validates credentials against the database
3. On success, server returns a JWT access token
4. Client includes token in subsequent requests via `Authorization: Bearer <token>` header
5. Protected endpoints validate the token and extract user information

## Error Responses

The API returns standard HTTP status codes:

| Status | Description |
|--------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation errors) |
| 401 | Unauthorized (invalid/missing token) |
| 404 | Not Found |
| 409 | Conflict (e.g., duplicate email) |
| 500 | Internal Server Error |

**Validation Error Example:**
```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password is not strong enough"],
  "error": "Bad Request"
}
```
