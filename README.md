
Yesterday 9:17 AM

Level-1-Express-TypeScript-Prisma-main.zip
Zip Archive
Akkana ki ki kora hoyca amaka bujea dau to

 dako to ki error

ঠিক আছে 👍 এবার আমরা Prisma Schema Check করব।

তুমি তোমার:

prisma/schema.prisma
ফাইলটা পুরোটা এখানে paste করো।

আমি check করে বলব:

✅ 2+ Enums আছে কিনা

✅ 4+ Models/Services আছে কিনা

✅ Proper relations আছে কিনা

✅ isDeleted Soft Delete আছে কিনা

✅ createdAt / updatedAt আছে কিনা

✅ @@map() আছে কিনা

✅ Indexes আছে কিনা

✅ Primary keys ঠিক আছে কিনা

✅ Assignment requirement অনুযায়ী আর কী বাকি

তারপর প্রয়োজন হলে schema-তে যেটুকু missing আছে সেটুকু ঠিক করে দেব।


generator client {
  provider = "prisma-client-js"
}


datasource db {
  provider = "postgresql"
}


// =========================
// ENUMS
// =========================


enum UserRole {
  ADMIN
  CUSTOMER
}


enum ProductStatus {
  ACTIVE
  INACTIVE
  OUT_OF_STOCK
}


enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}


// =========================
// USER
// =========================


model User {
  id       String   @id @default(uuid())
  name     String
  email    String   @unique
  password String
  role     UserRole @default(CUSTOMER)


  isDeleted Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt


  cartItems CartItem[]
  orders    Order[]
  reviews   Review[]


  @@index([email])
  @@index([role])
  @@map("users")
}


// =========================
// CATEGORY
// =========================


model Category {
  id          String  @id @default(uuid())
  name        String  @unique
  description String?
  isDeleted   Boolean @default(false)


  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt


  products Product[]


  @@index([name])
  @@map("categories")
}


// =========================
// PRODUCT
// =========================


model Product {
  id          String        @id @default(uuid())
  title       String
  description String?
  price       Decimal       @db.Decimal(10, 2)
  stock       Int           @default(0)
  image       String?
  status      ProductStatus @default(ACTIVE)


  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])


  isDeleted Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt


  cartItems  CartItem[]
  orderItems OrderItem[]
  reviews    Review[]


  @@index([categoryId])
  @@index([status])
  @@index([price])
  @@map("products")
}


// =========================
// REVIEW
// =========================


model Review {
  id      String  @id @default(uuid())
  rating  Int
  comment String?


  userId    String
  productId String


  user    User    @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id])


  isDeleted Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt


  @@unique([userId, productId])
  @@index([userId])
  @@index([productId])
  @@index([rating])
  @@map("reviews")
}


// =========================
// CART ITEM
// =========================


model CartItem {
  id       String @id @default(uuid())
  quantity Int    @default(1)


  userId    String
  productId String


  user    User    @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id])


  isDeleted Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt


  @@unique([userId, productId])
  @@index([userId])
  @@index([productId])
  @@map("cart_items")
}


// =========================
// ORDER
// =========================


model Order {
  id          String      @id @default(uuid())
  totalAmount Decimal     @db.Decimal(10, 2)
  status      OrderStatus @default(PENDING)


  userId String
  user   User   @relation(fields: [userId], references: [id])


  isDeleted Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt


  items OrderItem[]


  @@index([userId])
  @@index([status])
  @@index([createdAt])
  @@map("orders")
}


// =========================
// ORDER ITEM
// =========================


model OrderItem {
  id       String  @id @default(uuid())
  quantity Int
  price    Decimal @db.Decimal(10, 2)


  orderId   String
  productId String


  order   Order   @relation(fields: [orderId], references: [id])
  product Product @relation(fields: [productId], references: [id])


  isDeleted Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt


  @@index([orderId])
  @@index([productId])
  @@map("order_items")
}

cheak koro

হ্যাঁ, তোমার schema.prisma আমি check করলাম। Assignment-এর database requirement-এর দিক থেকে schema অনেক ভালোভাবে করা আছে। ✅

Requirement অনুযায়ী check
Requirement	তোমার Schema	Status
PostgreSQL	provider = "postgresql"	✅
Prisma ORM	Prisma Client	✅
Minimum 4 services	User, Category, Product, Review + Cart/Order	✅
Minimum 2 Enums	UserRole, ProductStatus, OrderStatus	✅
Proper relations	User ↔ Review, Product ↔ Category ইত্যাদি	✅
Soft Delete	isDeleted	✅
Created timestamp	createdAt	✅
Updated timestamp	updatedAt	✅
Primary Key	সব model-এ id @id	✅
@@map()	সব model-এ আছে	✅
Indexes	একাধিক @@index()	✅
Validation-ready fields	যথেষ্ট আছে	✅
Order/Booking	Order + OrderItem	✅
Review	আছে	✅
Cart	আছে	✅
বিশেষভাবে ভালো হয়েছে
তোমার 7টা model আছে:

User
Category
Product
Review
CartItem
Order
OrderItem
এটা assignment-এর minimum 4 service-এর চেয়েও বেশি। 👍

তোমার 3টা Enum আছে:

UserRole
ProductStatus
OrderStatus
তাই 2 Enums requirement-ও comfortably পূরণ হয়েছে। ✅

Relations-ও ঠিক আছে
যেমন:

Category
   ↓
Products
User
 ├── Reviews
 ├── Orders
 └── CartItems
Product
 ├── Reviews
 ├── CartItems
 └── OrderItems
এগুলো Prisma-এর relational database requirement-এর জন্য ভালো।

⚠️ তবে ২টা জিনিস খেয়াল করো
1. DATABASE_URL কোথায়?
তোমার এখানে:

datasource db {
  provider = "postgresql"
}
url নেই।

তোমার Prisma version/config setup যেহেতু নতুন style ব্যবহার করছে, এটা ইচ্ছাকৃতভাবেই prisma.config.ts-এ থাকতে পারে। তোমার migration এবং database ইতিমধ্যে কাজ করেছে, তাই এখন এটাকে পরিবর্তন করার দরকার নেই।

2. Order এবং Cart-এর API এখনো বানানো হয়নি
Schema-তে:

CartItem
Order
OrderItem
আছে, কিন্তু আমরা এখনো এগুলোর service/routes তৈরি করিনি।

Assignment-এর minimum 4 service আমরা ইতিমধ্যে পূরণ করেছি:

User       ✅
Category   ✅
Product    ✅
Review     ✅
তাই Order/Cart এখন বাধ্যতামূলক নয়, যদি assignment-এর বাকি অংশে এগুলো specifically চাওয়া না থাকে।

⭐ আমার Verdict
তোমার বর্তমান schema.prisma:

Database requirement: প্রায় সম্পূর্ণ ✅

এখন নতুন করে schema পরিবর্তন করার দরকার নেই।

এখন আমাদের পরের কাজ হবে:
Schema Check          ✅
Migration             ✅
Authentication        ✅
JWT                   ✅
Category CRUD         ✅
Product CRUD          ✅
Review CRUD           ✅
User CRUD             ✅
API Documentation     ✅
                         ↓
              Error Handling Check
                         ↓
              README.md তৈরি
                         ↓
              GitHub Push
                         ↓
              Deployment
সবচেয়ে ভালো হবে এখন README.md তৈরি করা, কারণ assignment-এর documentation requirement already পূরণ করেছি—এখন সেটা repository-তে সুন্দরভাবে রাখতে হবে।


README.md  dau tahola

হ্যাঁ 👍 তোমার জন্য পুরো README.md তৈরি করে দিলাম।

📄 Download README.md

এটা তোমার project-এর root folder-এ রাখবে:

Prisma_Postgresql_Backend-Project/
├── src/
├── prisma/
├── package.json
├── tsconfig.json
├── prisma.config.ts
└── README.md  ← এখানে
একটা বিষয়: README-তে Frontend Integration, Live Backend URL, GitHub Repository এখনো ⏳ রাখা আছে—কারণ এগুলো আমরা এখনো করিনি।

পরের কাজ হবে GitHub repository-তে project push করা, তারপর deployment করে Live Backend URL বের করা। 


README.md
Document


Library
/
README.md


SCIC/EJP-13 Backend Project
A production-ready REST API built with Express.js, TypeScript, Prisma ORM, and PostgreSQL.

Features
User registration and login

bcrypt password hashing

JWT authentication

ADMIN / CUSTOMER role authorization

User CRUD with soft delete

Category CRUD with soft delete

Product CRUD with soft delete

Review CRUD with soft delete

Prisma relations, migrations, enums, and indexes

PostgreSQL database

Consistent API response structure

CORS and environment variable support

Technology Stack
Node.js

Express.js

TypeScript

PostgreSQL

Prisma ORM

JWT

bcrypt

dotenv

CORS

Project Structure
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
Installation
npm install
Create .env:

DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/Prisma-postgresql-backend-project?schema=public"
JWT_SECRET="your_jwt_secret"
PORT=5000
Never commit real credentials to GitHub.

Prisma Setup
npx prisma generate
npx prisma migrate dev --name init
npx prisma studio
Run
npm run dev
Local server:

http://localhost:5000
Health check:

GET /
Response:

{
  "success": true,
  "message": "SCIC EJP-13 Backend is running"
}
Authentication API
Register
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "12345678"
}
Login
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "12345678"
}
Use the returned token for protected APIs:

Authorization: Bearer YOUR_JWT_TOKEN
User API
Method	Endpoint	Description	Auth
GET	/api/users	Get all users	ADMIN
GET	/api/users/:id	Get user by ID	ADMIN
PUT	/api/users/:id	Update user	ADMIN
DELETE	/api/users/:id	Soft delete user	ADMIN
Category API
Method	Endpoint	Description	Auth
POST	/api/categories	Create category	ADMIN
GET	/api/categories	Get all categories	Public
GET	/api/categories/:id	Get category by ID	Public
PUT	/api/categories/:id	Update category	ADMIN
DELETE	/api/categories/:id	Soft delete category	ADMIN
Example:

{
  "name": "Smartphones",
  "description": "Smartphone and mobile products"
}
Product API
Method	Endpoint	Description	Auth
POST	/api/products	Create product	ADMIN
GET	/api/products	Get all products	Public
GET	/api/products/:id	Get product by ID	Public
PUT	/api/products/:id	Update product	ADMIN
DELETE	/api/products/:id	Soft delete product	ADMIN
Example:

{
  "title": "iPhone 16",
  "description": "Apple iPhone 16",
  "price": 90000,
  "stock": 10,
  "image": "https://example.com/iphone16.jpg",
  "categoryId": "CATEGORY_ID"
}
Review API
Method	Endpoint	Description	Auth
POST	/api/reviews	Create review	Authenticated
GET	/api/reviews	Get all reviews	Public
GET	/api/reviews/:id	Get review by ID	Public
PUT	/api/reviews/:id	Update own review	Authenticated
DELETE	/api/reviews/:id	Delete own review / admin	Authenticated
Example:

{
  "productId": "PRODUCT_ID",
  "rating": 5,
  "comment": "Excellent product."
}
Rating must be between 1 and 5.

Database Models
User

Category

Product

Review

CartItem

Order

OrderItem

Enums
UserRole

ProductStatus

OrderStatus

Relationships
User → Reviews

User → Orders

User → CartItems

Category → Products

Product → Reviews

Product → CartItems

Product → OrderItems

Order → OrderItems

Soft Delete
Major models use:

isDeleted
Records are not permanently removed:

isDeleted: false
        ↓
isDeleted: true
Timestamps
Models use:

createdAt
updatedAt
API Response Format
Success:

{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {}
}
Error:

{
  "success": false,
  "message": "Product not found"
}
HTTP Status Codes
Status	Meaning
200	Successful request
201	Resource created
400	Bad request
401	Unauthorized
403	Forbidden
404	Resource not found
500	Internal server error
API Testing
Tested with Postman:

Registration

Login

JWT protected route

Admin authorization

Category CRUD

Product CRUD

Review CRUD

User CRUD

Soft delete

Security
Passwords are hashed with bcrypt.

JWT protects authenticated routes.

Role-based authorization protects admin endpoints.

Secrets are stored in .env.

Recommended .gitignore:

node_modules/
.env
dist/
Assignment Requirements
Requirement	Status
Express.js	✅
TypeScript	✅
PostgreSQL	✅
Prisma ORM	✅
JWT Authentication	✅
bcrypt	✅
dotenv	✅
CORS	✅
Modular Architecture	✅
4+ Services	✅
2+ Enums	✅
Relations	✅
Soft Delete	✅
Created/Updated timestamps	✅
@@map()	✅
Indexes	✅
CRUD APIs	✅
API Documentation	✅
Frontend Integration	⏳
Live Backend URL	⏳
GitHub Repository	⏳
Author
Khaled

SCIC/EJP-13 Backend Project

Library
/
README.md


SCIC/EJP-13 Backend Project
A production-ready REST API built with Express.js, TypeScript, Prisma ORM, and PostgreSQL.

Features
User registration and login

bcrypt password hashing

JWT authentication

ADMIN / CUSTOMER role authorization

User CRUD with soft delete

Category CRUD with soft delete

Product CRUD with soft delete

Review CRUD with soft delete

Prisma relations, migrations, enums, and indexes

PostgreSQL database

Consistent API response structure

CORS and environment variable support

Technology Stack
Node.js

Express.js

TypeScript

PostgreSQL

Prisma ORM

JWT

bcrypt

dotenv

CORS

Project Structure
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
Installation
npm install
Create .env:

DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/Prisma-postgresql-backend-project?schema=public"
JWT_SECRET="your_jwt_secret"
PORT=5000
Never commit real credentials to GitHub.

Prisma Setup
npx prisma generate
npx prisma migrate dev --name init
npx prisma studio
Run
npm run dev
Local server:

http://localhost:5000
Health check:

GET /
Response:

{
  "success": true,
  "message": "SCIC EJP-13 Backend is running"
}
Authentication API
Register
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "12345678"
}
Login
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "12345678"
}
Use the returned token for protected APIs:

Authorization: Bearer YOUR_JWT_TOKEN
User API
Method	Endpoint	Description	Auth
GET	/api/users	Get all users	ADMIN
GET	/api/users/:id	Get user by ID	ADMIN
PUT	/api/users/:id	Update user	ADMIN
DELETE	/api/users/:id	Soft delete user	ADMIN
Category API
Method	Endpoint	Description	Auth
POST	/api/categories	Create category	ADMIN
GET	/api/categories	Get all categories	Public
GET	/api/categories/:id	Get category by ID	Public
PUT	/api/categories/:id	Update category	ADMIN
DELETE	/api/categories/:id	Soft delete category	ADMIN
Example:

{
  "name": "Smartphones",
  "description": "Smartphone and mobile products"
}
Product API
Method	Endpoint	Description	Auth
POST	/api/products	Create product	ADMIN
GET	/api/products	Get all products	Public
GET	/api/products/:id	Get product by ID	Public
PUT	/api/products/:id	Update product	ADMIN
DELETE	/api/products/:id	Soft delete product	ADMIN
Example:

{
  "title": "iPhone 16",
  "description": "Apple iPhone 16",
  "price": 90000,
  "stock": 10,
  "image": "https://example.com/iphone16.jpg",
  "categoryId": "CATEGORY_ID"
}
Review API
Method	Endpoint	Description	Auth
POST	/api/reviews	Create review	Authenticated
GET	/api/reviews	Get all reviews	Public
GET	/api/reviews/:id	Get review by ID	Public
PUT	/api/reviews/:id	Update own review	Authenticated
DELETE	/api/reviews/:id	Delete own review / admin	Authenticated
Example:

{
  "productId": "PRODUCT_ID",
  "rating": 5,
  "comment": "Excellent product."
}
Rating must be between 1 and 5.

Database Models
User

Category

Product

Review

CartItem

Order

OrderItem

Enums
UserRole

ProductStatus

OrderStatus

Relationships
User → Reviews

User → Orders

User → CartItems

Category → Products

Product → Reviews

Product → CartItems

Product → OrderItems

Order → OrderItems

Soft Delete
Major models use:

isDeleted
Records are not permanently removed:

isDeleted: false
        ↓
isDeleted: true
Timestamps
Models use:

createdAt
updatedAt
API Response Format
Success:

{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {}
}
Error:

{
  "success": false,
  "message": "Product not found"
}
HTTP Status Codes
Status	Meaning
200	Successful request
201	Resource created
400	Bad request
401	Unauthorized
403	Forbidden
404	Resource not found
500	Internal server error
API Testing
Tested with Postman:

Registration

Login

JWT protected route

Admin authorization

Category CRUD

Product CRUD

Review CRUD

User CRUD

Soft delete

Security
Passwords are hashed with bcrypt.

JWT protects authenticated routes.

Role-based authorization protects admin endpoints.

Secrets are stored in .env.

Recommended .gitignore:

node_modules/
.env
dist/
Assignment Requirements
Requirement	Status
Express.js	✅
TypeScript	✅
PostgreSQL	✅
Prisma ORM	✅
JWT Authentication	✅
bcrypt	✅
dotenv	✅
CORS	✅
Modular Architecture	✅
4+ Services	✅
2+ Enums	✅
Relations	✅
Soft Delete	✅
Created/Updated timestamps	✅
@@map()	✅
Indexes	✅
CRUD APIs	✅
API Documentation	✅
Frontend Integration	⏳
Live Backend URL	⏳
GitHub Repository	⏳
Author
Khaled

SCIC/EJP-13 Backend Project

