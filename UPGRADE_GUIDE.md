# Bookify v2.0 Upgrade Guide

## Overview
This guide walks you through the modernization upgrades made to Bookify and how to use the new features.

## 🎯 What's New

### Server-Side Enhancements

#### 1. Security Middleware
Your server now has enterprise-grade security:

```javascript
// Automatically applied to all routes:
- Helmet: Security headers
- Rate Limiting: 100 req/15min (5 for auth)
- NoSQL Injection Protection
- HPP Protection
- Compression
```

#### 2. Standardized Error Handling
All errors now follow a consistent format:

**Before:**
```javascript
res.status(400).json({ error: "Something went wrong" });
```

**After:**
```javascript
throw new ApiError(400, "Something went wrong");
// Automatically formatted to:
// { success: false, message: "...", errors: [], statusCode: 400 }
```

#### 3. Async/Await Pattern
All controllers now use modern async/await:

**Before:**
```javascript
const someController = (req, res) => {
  Model.find()
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
};
```

**After:**
```javascript
const someController = asyncHandler(async (req, res) => {
  const data = await Model.find();
  res.status(200).json(new ApiResponse(200, data, "Success"));
});
```

#### 4. Input Validation
Joi validation on all inputs:

```javascript
// In routes/UserRoutes.js
router.post("/user/signup", validate(signupSchema), signupUser);

// Automatically validates and returns clear error messages
```

### Client-Side Enhancements

#### 1. Centralized API Layer
Use the new API service instead of raw fetch:

**Before:**
```javascript
const response = await fetch(`${API_URL}/property`, {
  headers: { Authorization: `Bearer ${token}` }
});
const data = await response.json();
```

**After:**
```javascript
import { propertyAPI } from '@/services/api';
const properties = await propertyAPI.getAll();
// Token automatically attached!
```

#### 2. Error Boundaries
Wrap your app to catch React errors:

```javascript
import ErrorBoundary from '@/components/ErrorBoundary';

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

#### 3. Loading States
Use consistent loading components:

```javascript
import LoadingSpinner from '@/components/LoadingSpinner';
import PropertySkeleton from '@/components/PropertySkeleton';

{isLoading ? <LoadingSpinner /> : <Content />}
{isLoading ? <PropertySkeleton count={6} /> : <PropertyList />}
```

#### 4. Auth Hook
Simplified authentication:

```javascript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Use these instead of direct context access
}
```

## 🔄 Migration Steps

### For New Features

#### Adding a New API Endpoint

1. **Create the controller** (server/controllers/):
```javascript
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const myController = asyncHandler(async (req, res) => {
  // Your logic here
  const data = await Model.find();
  res.status(200).json(new ApiResponse(200, data, "Success"));
});

module.exports = { myController };
```

2. **Add validation schema** (server/utils/validation.js):
```javascript
const mySchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});
```

3. **Create route** (server/routes/):
```javascript
const { validate } = require("../utils/validation");
router.post("/api/endpoint", validate(mySchema), myController);
```

4. **Add to API service** (client/src/services/api.js):
```javascript
export const myAPI = {
  getData: async () => {
    const { data } = await axiosInstance.get("/api/endpoint");
    return data.data;
  },
};
```

### Updating Existing Components

#### Convert to Modern Patterns

**Old Component:**
```javascript
function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  return loading ? <div>Loading...</div> : <div>{data}</div>;
}
```

**Modern Component:**
```javascript
import { useState, useEffect } from 'react';
import { propertyAPI } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from 'sonner';

function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await propertyAPI.getAll();
        setData(result);
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  return <div>{/* render data */}</div>;
}
```

## 🛠️ Common Tasks

### Testing the Upgrades

1. **Test Rate Limiting:**
```bash
# Make multiple rapid requests
for i in {1..10}; do curl http://localhost:4000/property; done
```

2. **Test Validation:**
```bash
# Try invalid signup
curl -X POST http://localhost:4000/user/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"weak"}'
```

3. **Test Error Handling:**
```javascript
// In any component, throw an error to test ErrorBoundary
throw new Error("Test error");
```

### Debugging

**Server Errors:**
```javascript
// Error logs now show in development with full stack traces
// Check server/middleware/errorHandler.js
```

**Client Errors:**
```javascript
// Check browser console
// Check Network tab for API response formats
// Error Boundary will catch uncaught errors
```

## 📝 Best Practices

### DO:
✅ Use `asyncHandler` for all async controllers  
✅ Use `ApiResponse` for success responses  
✅ Throw `ApiError` for errors  
✅ Add Joi validation for new endpoints  
✅ Use the `api.js` service for API calls  
✅ Add loading states to all async operations  
✅ Use Error Boundaries for error handling  
✅ Lazy load routes for performance  

### DON'T:
❌ Use `.then()` chains (use async/await)  
❌ Use raw fetch (use axios instance)  
❌ Access localStorage directly for user (use useAuth)  
❌ Skip validation on endpoints  
❌ Return inconsistent response formats  
❌ Forget loading states  
❌ Skip error handling  

## 🚨 Breaking Changes

### API Response Format
All API responses now follow this structure:

```javascript
// Success
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { /* your data */ }
}

// Error
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": ["Field is required", "Email is invalid"]
}
```

**Migration:** Update any frontend code expecting the old format.

### Authentication
Tokens are still in localStorage but accessed via `useAuth` hook:

```javascript
// Old
const user = JSON.parse(localStorage.getItem('user'));
const token = user?.token;

// New
const { user } = useAuth();
// Token automatically handled by axios
```

## 📚 Additional Resources

- **Server Utils:** `server/utils/`
- **Client Services:** `client/src/services/`
- **Validation Schemas:** `server/utils/validation.js`
- **API Documentation:** See README.md
- **Error Codes:** See ApiError.js

## 🆘 Troubleshooting

### "Cannot find module" errors
```bash
cd server && npm install
cd client && npm install
```

### Rate limit errors in development
Increase limits in `server/server.js`:
```javascript
max: 1000, // Increase for dev
```

### CORS errors
Update `CLIENT_URL` in server `.env`:
```env
CLIENT_URL=http://localhost:5173
```

### Token expiration
Tokens expire after 10 days. Change in `userController.js`:
```javascript
jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "30d" });
```

## 🎓 Learning Resources

- [Express Async Errors](https://www.npmjs.com/package/express-async-errors)
- [Joi Validation](https://joi.dev/api/)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [React Lazy Loading](https://react.dev/reference/react/lazy)

---

**Questions?** Check `MODERNIZATION.md` or create an issue on GitHub.
