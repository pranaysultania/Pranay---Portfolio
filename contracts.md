# Backend Integration Contracts

## Overview
Transform the frontend portfolio from mock data to full-stack functionality with MongoDB database integration.

## API Endpoints to Implement

### 1. Reflections Management
**Base URL**: `/api/reflections`

- `GET /api/reflections` - Get all reflections (public)
- `GET /api/reflections/:id` - Get single reflection (public)
- `POST /api/reflections` - Create new reflection (admin)
- `PUT /api/reflections/:id` - Update reflection (admin)
- `DELETE /api/reflections/:id` - Delete reflection (admin)
- `GET /api/reflections/categories` - Get available categories

### 2. Contact Form
**Base URL**: `/api/contact`

- `POST /api/contact` - Submit contact form

### 3. Admin Authentication (Simple)
**Base URL**: `/api/admin`

- `POST /api/admin/login` - Simple admin login
- `GET /api/admin/verify` - Verify admin session

## Database Models

### Reflection Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  excerpt: String (required),
  content: String (required),
  category: String (enum: ['blog', 'journal', 'artwork']),
  tags: [String],
  date: Date (default: now),
  readTime: String (auto-calculated),
  published: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Contact Submission Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  reason: String (required),
  message: String (required),
  status: String (enum: ['new', 'read', 'replied']),
  submittedAt: Date (default: now)
}
```

### Admin Session Model (Simple)
```javascript
{
  _id: ObjectId,
  sessionId: String,
  expiresAt: Date,
  createdAt: Date
}
```

## Mock Data Migration Plan

### Current Mock Data (mock.js)
- `mockReflections` → MongoDB `reflections` collection
- `mockYogaOfferings` → Keep as static data (no changes needed)
- `mockInvestments` → Keep as static data (no changes needed)
- `mockVolunteeringInitiatives` → Keep as static data (no changes needed)
- `mockTestimonials` → Keep as static data (no changes needed)

## Frontend Integration Changes

### 1. Replace Mock Data Calls
**Files to Update:**
- `/app/frontend/src/pages/Homepage.jsx`
- `/app/frontend/src/pages/AdminDashboard.jsx`

**Changes:**
- Replace `import { mockReflections } from '../mock'` with API calls
- Add loading states and error handling
- Implement real form submission for contact form

### 2. API Integration Layer
**New File:** `/app/frontend/src/services/api.js`
- Centralized API calls using axios
- Error handling utilities
- Loading state management

### 3. Admin Authentication
- Simple session-based auth (no complex JWT for MVP)
- Protect admin routes
- Add login form for admin access

## Implementation Priority

### Phase 1: Core Backend (Essential)
1. Reflections CRUD endpoints
2. Contact form submission
3. Database models and connections
4. Seed initial reflection data

### Phase 2: Frontend Integration
1. Replace mock data with API calls
2. Add loading states and error handling
3. Implement contact form submission
4. Update admin dashboard to use real data

### Phase 3: Admin Authentication (Simple)
1. Basic login system
2. Session management
3. Protected admin routes
4. Logout functionality

## Error Handling Strategy
- Graceful degradation for API failures
- Loading states for all async operations
- User-friendly error messages
- Fallback to cached data when possible

## Testing Approach
- Test all API endpoints individually
- Verify frontend-backend integration
- Test admin functionality end-to-end
- Validate contact form submissions

## Notes
- Keep yoga offerings, investments, volunteering, and testimonials as static data
- Focus on making Reflections section fully dynamic
- Simple authentication sufficient for MVP
- Prioritize user experience and smooth transitions