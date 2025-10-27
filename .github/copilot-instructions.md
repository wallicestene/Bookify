## Quick context for AI coding agents

This repository is a modern two-part MERN-style app (client + server) with recent v2.0 modernization:

- client/: React 18 + Vite + Tailwind (ES modules). Entry: `client/src/main.jsx`.
- server/: Express + Mongoose (CommonJS). Entry: `server/server.js`.

Primary data flow: the React frontend calls the Express REST API (routes in `server/routes/*.js`), which delegates to controller functions in `server/controllers/*.js` and persists data via Mongoose models in `server/models/*.js`.

Key integration points and patterns (concrete files to inspect):

- **Modern API layer**: `client/src/lib/axios.js` provides axios instance with automatic token attachment and global error handling. `client/src/services/api.js` contains typed API methods.
- **Error handling**: Client uses `client/src/components/ErrorBoundary.jsx` for React errors. Server uses `server/middleware/errorHandler.js` for centralized error handling with `server/utils/ApiError.js` and `server/utils/ApiResponse.js`.
- **Client-side state**: `client/src/hooks/Usercontext.jsx` (uses reducer in `client/src/hooks/userReducer.js`). `client/src/hooks/useAuth.js` provides auth utilities.
- **Server patterns**: All controllers use `server/utils/asyncHandler.js` wrapper and async/await (no promise chains). Validation via `server/utils/validation.js` (Joi schemas).
- **Security**: Server has Helmet, rate limiting (100/15min general, 5/15min auth), NoSQL injection protection, HPP, compression.
- **Static uploads**: Server serves `/uploads` from `./controllers/uploads` and uses AWS S3 for image storage.

Build / run / debug (Windows PowerShell examples):

1) Install deps and run server in dev (uses nodemon):

```powershell
cd server; npm install; npm run dev
```

2) Install deps and run client dev server (Vite):

```powershell
cd client; npm install; npm run dev
```

Notes and conventions to follow when editing code:

- Frontend uses ES modules (`import`), JSX, lazy loading (`React.lazy`), Suspense for loading states, Error Boundaries, and axios for API calls.
- Backend uses CommonJS (`require`), async/await (no `.then()`), asyncHandler wrapper, ApiError/ApiResponse classes, and Joi validation.
- **API responses** follow standardized format: `{ success: boolean, message: string, data: any, statusCode: number }`.
- **Error responses**: `{ success: false, message: string, errors: string[], statusCode: number }`.
- Auth: tokens stored in localStorage as `user` object; use `client/src/services/api.js` methods or `client/src/lib/axios.js` instance for API calls (auto-adds Authorization header).
- Environment: `MONGO_URI`, `JWT_SECRET`, `PORT`, `CLIENT_URL` required in server `.env`. Optional: AWS S3 credentials for image uploads.

Files that exemplify major patterns (start here):

- `server/server.js` — DB connection, security middleware, error handler registration.
- `server/utils/asyncHandler.js`, `server/utils/ApiError.js`, `server/utils/ApiResponse.js` — standardized error/response handling.
- `server/controllers/userController.js`, `server/controllers/propertyController.js` — async/await patterns, ApiResponse usage.
- `server/utils/validation.js` — Joi schemas for request validation.
- `client/src/lib/axios.js` — axios instance with interceptors.
- `client/src/services/api.js` — centralized API methods.
- `client/src/components/ErrorBoundary.jsx`, `client/src/components/LoadingSpinner.jsx` — UI error/loading patterns.
- `client/src/hooks/useAuth.js` — auth state management hook.
- `client/src/pages/LoginPage.jsx`, `client/src/pages/SignupPage.jsx` — modern form patterns with loading states and validation.

Practical examples to reference in generated code or tests:

- **To add a new API endpoint**: create route in `server/routes/`, implement async controller with asyncHandler in `server/controllers/`, use ApiResponse for success, throw ApiError for errors, add Joi validation schema in `server/utils/validation.js`.
- **To use auth in client**: import methods from `client/src/services/api.js` (e.g., `propertyAPI.getAll()`) or use `axiosInstance` from `client/src/lib/axios.js`. Authorization header is auto-added.
- **Error handling pattern**: wrap controller logic in asyncHandler, throw new ApiError(statusCode, message) for errors, return new ApiResponse(statusCode, data, message) for success.

Quality gates and quick checks agents should run locally:

- Verify server starts without errors and `/health` endpoint responds.
- Verify client builds and starts without TypeScript/linting errors.
- Test API endpoints with invalid inputs to see Joi validation errors.
- Test authentication flow (signup, login, logout, token expiration).
- Check network tab for standardized API response formats.

When merging or changing behavior, prefer minimal, well-scoped edits. Add validation for new inputs, use asyncHandler for new controllers, follow the ApiError/ApiResponse pattern, add loading states in UI, wrap new routes in lazy(), and document new env variables in `.env.example`.

If something is unclear, ask for expected runtime (local vs deployed) and whether test DB/sample env should be provided; otherwise assume local dev with env vars set.

---

**Recent Modernization (v2.0)**: See `MODERNIZATION.md` for comprehensive list of security, performance, and UX improvements including rate limiting, async/await refactor, error boundaries, loading states, and centralized API layer.
