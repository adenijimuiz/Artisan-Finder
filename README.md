# Artisan2

Artisan2 is a full-stack web application that connects clients with skilled artisans for various services. The platform allows users to register as clients or artisans, search for services, book appointments, communicate via real-time messaging, leave reviews, and handle payments securely.

## Features

- **User Authentication**: Secure login and registration for clients and artisans
- **Service Booking**: Easy booking system with availability management
- **Real-time Messaging**: Instant communication between clients and artisans using Socket.io
- **Review System**: Rate and review completed services
- **Admin Dashboard**: Administrative controls for managing users and bookings
- **Payment Integration**: Secure payments via Stripe
- **Image Upload**: Cloudinary integration for profile and service images
- **Email Notifications**: Automated email notifications for bookings and updates
- **Responsive Design**: Mobile-friendly interface built with React and Tailwind CSS

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Socket.io** for real-time messaging
- **JWT** for authentication
- **Stripe** for payment processing
- **Cloudinary** for image management
- **Nodemailer** for email services

### Frontend
- **React** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **Axios** for API calls
- **Recharts** for data visualization

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or cloud service like MongoDB Atlas)
- **Git**

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Artisan2
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following environment variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

   **Note**: Replace the placeholder values with your actual credentials:
   - Get MongoDB URI from MongoDB Atlas or your local MongoDB instance
   - Create a Cloudinary account and get your API credentials
   - Generate a secure JWT secret
   - Set up Gmail SMTP or another email service
   - Get Stripe API keys from your Stripe dashboard

4. Start the backend server:
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:5000`

### 3. Frontend Setup

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## Usage

1. Open your browser and go to `http://localhost:5173`
2. Register as a client or artisan
3. Explore available services or create your artisan profile
4. Book services and communicate with artisans
5. Leave reviews after completed services

### Admin Access

- Admin email: `admin@example.com` (as set in .env)
- Admin password: `admin123` (as set in .env)
- Access admin dashboard at `/admin/login`

## API Documentation

The backend provides RESTful APIs for:
- Authentication (`/api/auth`)
- User management (`/api/users`)
- Bookings (`/api/bookings`)
- Reviews (`/api/reviews`)
- Messages (`/api/messages`)
- Admin operations (`/api/admin`)

## Development

### Running Tests

```bash
# Backend tests
cd backend
npm test
```

### Building for Production

```bash
# Frontend build
cd client
npm run build

# Backend is ready for production with npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure everything works
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please contact the development team.