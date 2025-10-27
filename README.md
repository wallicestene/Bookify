# Bookify - Modern MERN Stack Booking Platform

**Bookify** is a full-featured, modern booking platform where users can browse and book properties. The application features advanced filtering, secure authentication, real-time availability checking, and a comprehensive host dashboard for property management.

## ✨ Features

### User Features
- **Browse Properties**: Explore properties with a responsive, modern interface
- **Advanced Search & Filters**: Find properties by location, price range, amenities, tags, guests, bedrooms, and beds
- **Property Details**: View comprehensive property information with image galleries
- **Booking System**: Book properties with real-time availability checking
- **Booking History**: View and manage your bookings
- **User Authentication**: Secure JWT-based authentication with session management

### Host Features
- **Property Listing**: Create and manage property listings with multiple images
- **Dashboard**: Track your listings, bookings, and analytics
- **Image Upload**: Upload images via file upload or by URL with S3 storage
- **Property Management**: Update or delete listings
- **Analytics**: View performance metrics and booking statistics

### Modern Features
- **Error Boundaries**: Graceful error handling throughout the app
- **Loading States**: Skeleton loaders and spinners for better UX
- **Code Splitting**: Lazy-loaded routes for optimal performance
- **Security**: Rate limiting, helmet protection, NoSQL injection prevention
- **Validation**: Comprehensive input validation on both client and server
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **React 18** with Hooks and Context API
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Radix UI** for accessible components
- **Axios** for API requests with interceptors
- **React Router v6** for navigation
- **React Loading Skeleton** for loading states
- **Sonner** for toast notifications
- **Lucide React** for modern icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Joi** for validation
- **Helmet** for security headers
- **Express Rate Limit** for API protection
- **Morgan** for logging
- **Multer** for file uploads
- **AWS S3** for image storage
- **Bcrypt** for password hashing

## 📁 Project Structure

```
Bookify/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   ├── lib/           # Utilities and axios config
│   │   └── utils/         # Helper functions
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/       # Request handlers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utilities and helpers
│   └── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v16.x or higher
- **MongoDB** (local or MongoDB Atlas)
- **AWS Account** (for S3 image storage) - optional

### Steps to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/wallicestene/Bookify.git
   cd Bookify
   ```

2. **Set up the Server**
   ```bash
   cd server
   npm install
   
   # Copy environment variables template
   cp .env.example .env
   
   # Edit .env with your configuration
   # Required: MONGO_URI, JWT_SECRET, PORT
   # Optional: AWS S3 credentials
   ```

3. **Set up the Client**
   ```bash
   cd ../client
   npm install
   
   # Copy environment variables template
   cp .env.example .env
   
   # Edit .env with your API URL (default: http://localhost:4000)
   ```

4. **Start the Development Servers**

   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd client
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000
   - Health Check: http://localhost:4000/health

## 🔐 Environment Variables

### Server (.env)
```env
MONGO_URI=mongodb://localhost:27017/bookify
JWT_SECRET=your-super-secret-jwt-key
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# AWS S3 (Optional)
BUCKET_NAME=your-bucket-name
BUCKET_REGION=us-east-1
ACCESS_KEY=your-aws-access-key
SECRET_KEY=your-aws-secret-key
```

### Client (.env)
```env
VITE_API_URL=http://localhost:4000
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /user/signup` - Create new user account
- `POST /user/login` - Authenticate user

### Property Endpoints
- `GET /property` - Get all properties
- `GET /property/:id` - Get property by ID
- `GET /properties/:ownerId` - Get properties by owner
- `GET /property/search` - Search properties with filters
- `POST /property` - Create new property (auth required)
- `PUT /property/:id` - Update property (auth required)
- `DELETE /property/:id` - Delete property (auth required)
- `POST /upload` - Upload images (auth required)
- `POST /upload-by-link` - Upload image from URL (auth required)

### Booking Endpoints
- `GET /bookings` - Get all bookings (auth required)
- `GET /booking/:id` - Get booking by ID (auth required)
- `GET /booking/user/:userId` - Get user bookings (auth required)
- `POST /booking` - Create booking (auth required)
- `PUT /booking/:id` - Update booking (auth required)
- `DELETE /booking/:id` - Delete booking (auth required)

## 🔒 Security Features

- **Helmet**: Sets various HTTP headers for security
- **Rate Limiting**: 100 requests per 15 minutes per IP (5 for auth endpoints)
- **NoSQL Injection Protection**: Sanitizes MongoDB queries
- **HTTP Parameter Pollution Protection**: Prevents HPP attacks
- **CORS**: Configured for specific origins
- **JWT**: Secure token-based authentication with 10-day expiration
- **Password Hashing**: Bcrypt with salt rounds
- **Input Validation**: Joi validation on all inputs
- **Error Handling**: Custom error handling without exposing sensitive data

## 🎨 UI/UX Improvements

- **Modern Design**: Clean, professional interface with gradient accents
- **Loading States**: Skeleton screens and spinners
- **Error Boundaries**: Graceful error handling
- **Toast Notifications**: User-friendly feedback
- **Password Toggle**: Show/hide password functionality
- **Responsive Design**: Mobile-first approach
- **Accessible**: Semantic HTML and ARIA labels
- **Smooth Transitions**: Animations and hover effects

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading of routes
- **Image Optimization**: S3 storage with proper compression
- **Gzip Compression**: Server-side compression
- **Efficient Queries**: Optimized MongoDB queries
- **Caching**: Browser caching for static assets
- **Debouncing**: Search input debouncing (recommended)

## 🧪 Testing (Recommended)

```bash
# Run tests (when implemented)
npm test

# Run test coverage
npm run test:coverage
```

## 📦 Building for Production

### Client
```bash
cd client
npm run build
# Build output in client/dist
```

### Server
```bash
cd server
# Set NODE_ENV=production in .env
npm start
```

## 📈 Future Enhancements

- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Review and rating system
- [ ] Chat functionality between hosts and guests
- [ ] Calendar integration
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Social media authentication

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Wallace Stene**
- GitHub: [@wallicestene](https://github.com/wallicestene)

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the flexible database
- Radix UI for accessible components
- All open-source contributors

---

**Note**: For detailed information about recent modernization updates, see [MODERNIZATION.md](./MODERNIZATION.md)
