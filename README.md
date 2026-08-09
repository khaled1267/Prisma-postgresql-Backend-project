# prisma postgresql Backend Project

A production-ready REST API built with Express.js, TypeScript, Prisma ORM, and PostgreSQL.

## Features
- User registration and login
- bcrypt password hashing
- JWT authentication
- ADMIN / CUSTOMER role authorization
- User CRUD with soft delete
- Category CRUD with soft delete
- Product CRUD with soft delete
- Review CRUD with soft delete
- Prisma relations, migrations, enums, and indexes
- PostgreSQL database
- Consistent API response structure
- CORS and environment variable support

## Technology Stack
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt
- dotenv
- CORS

## Project Structure
```text
server/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── catagory.routes.ts
│   │   ├── product.routes.ts
│   │   └── review.routes.ts
│   ├── services/
│   │   ├── user/
│   │   ├── category/
│   │   ├── product/
│   │   └── review/
│   └── lib/
│       └── prisma.ts
├── .env
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

## Installation

```bash
npm install
```

Create `.env`:
```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/Prisma-postgresql-backend-project?schema=public"
JWT_SECRET="your_jwt_secret"
PORT=5000
```
> **Note:** Never commit real credentials to GitHub.

## Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma studio
```

## Run

```bash
npm run dev
```

- **Local server:** `http://localhost:5000`
- **Health check:** `GET /`

**Response:**
```json
{
  "success": true,
  "message": "SCIC EJP-13 Backend is running"
}
```

---

## Authentication API

### Register
`POST /api/auth/register`
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "12345678"
}
```

### Login
`POST /api/auth/login`
```json
{
  "email": "test@example.com",
  "password": "12345678"
}
```

Use the returned token for protected APIs:
```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## User API

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Get all users | ADMIN |
| `GET` | `/api/users/:id` | Get user by ID | ADMIN |
| `PUT` | `/api/users/:id` | Update user | ADMIN |
| `DELETE` | `/api/users/:id` | Soft delete user | ADMIN |

---

## Category API

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/categories` | Create category | ADMIN |
| `GET` | `/api/categories` | Get all categories | Public |
| `GET` | `/api/categories/:id` | Get category by ID | Public |
| `PUT` | `/api/categories/:id` | Update category | ADMIN |
| `DELETE` | `/api/categories/:id` | Soft delete category | ADMIN |

**Example Body:**
```json
{
  "name": "Smartphones",
  "description": "Smartphone and mobile products"
}
```

---

## Product API

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/products` | Create product | ADMIN |
| `GET` | `/api/products` | Get all products | Public |
| `GET` | `/api/products/:id` | Get product by ID | Public |
| `PUT` | `/api/products/:id` | Update product | ADMIN |
| `DELETE` | `/api/products/:id` | Soft delete product | ADMIN |

**Example Body:**
```json
{
  "title": "iPhone 16",
  "description": "Apple iPhone 16",
  "price": 90000,
  "stock": 10,
  "image": "https://example.com/iphone16.jpg",
  "categoryId": "CATEGORY_ID"
}
```

---

## Review API

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reviews` | Create review | Authenticated |
| `GET` | `/api/reviews` | Get all reviews | Public |
| `GET` | `/api/reviews/:id` | Get review by ID | Public |
| `PUT` | `/api/reviews/:id` | Update own review | Authenticated |
| `DELETE` | `/api/reviews/:id` | Delete own review / admin | Authenticated |

**Example Body:**
```json
{
  "productId": "PRODUCT_ID",
  "rating": 5,
  "comment": "Excellent product."
}
```
*Rating must be between 1 and 5.*

---

## Database Models & Schema Details

### Database Models
- `User`
- `Category`
- `Product`
- `Review`
- `CartItem`
- `Order`
- `OrderItem`

### Enums
- `UserRole`
- `ProductStatus`
- `OrderStatus`

### Relationships
- User → Reviews
- User → Orders
- User → CartItems
- Category → Products
- Product → Reviews
- Product → CartItems
- Product → OrderItems
- Order → OrderItems

### Soft Delete
Major models use `isDeleted` flag. Records are not permanently removed:
`isDeleted: false` ➔ `isDeleted: true`

### Timestamps
Models include:
- `createdAt`
- `updatedAt`

---

## API Response Structure

### Success Format:
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {}
}
```

### Error Format:
```json
{
  "success": false,
  "message": "Product not found"
}
```

### HTTP Status Codes
| Status | Meaning |
| :--- | :--- |
| **200** | Successful request |
| **201** | Resource created |
| **400** | Bad request |
| **401** | Unauthorized |
| **403** | Forbidden |
| **404** | Resource not found |
| **500** | Internal server error |

---

## API Testing & Security

### Tested with Postman:
- Registration & Login
- JWT protected routes & Admin authorization
- Category, Product, Review, and User CRUD operations
- Soft delete functionality

### Security Standards:
- Passwords hashed with `bcrypt`.
- JWT protects authenticated routes.
- Role-based authorization protects admin endpoints.
- Secrets stored in `.env`.

**Recommended `.gitignore`:**
```text
node_modules/
.env
dist/
```

---

## Assignment Requirements Checklist

| Requirement | Status |
| :--- | :---: |
| Express.js | ✅ |
| TypeScript | ✅ |
| PostgreSQL | ✅ |
| Prisma ORM | ✅ |
| JWT Authentication | ✅ |
| bcrypt | ✅ |
| dotenv | ✅ |
| CORS | ✅ |
| Modular Architecture | ✅ |
| 4+ Services | ✅ |
| 2+ Enums | ✅ |
| Relations | ✅ |
| Soft Delete | ✅ |
| Created/Updated timestamps | ✅ |
| @@map() | ✅ |
| Indexes | ✅ |
| CRUD APIs | ✅ |
| API Documentation | ✅ |
| Frontend Integration | ⏳ |
| Live Backend URL | ⏳ |
| GitHub Repository | ⏳ |

---

## Author
**Khaled**  
*prisma postgresql Backend Project*
