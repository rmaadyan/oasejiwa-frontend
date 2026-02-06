# Admin Panel - Real API Integration

## Changes Made

### 1. **Removed Mock Data Mode**
- Changed `USE_MOCK_DATA = true` → `USE_MOCK_DATA = false` in both:
  - `/lib/api/dashboard.ts`
  - `/lib/api/analytics.ts`
- Removed all imports dari `@/lib/data/admin-data` (mock data)

### 2. **Updated API Layer**
- `/lib/api/dashboard.ts`: Now makes real API calls to backend
  - `getDashboardStats()` → GET `/api/admin/dashboard/stats`
  - `getRecentBookings()` → GET `/api/admin/bookings`
  - `getPendingPayments()` → GET `/api/admin/payments`
  - `getTodaySchedule()` → GET `/api/admin/schedule`
  - `getAlerts()` → GET `/api/admin/alerts`
  - `getAllDashboardData()` → Combines all above calls

- `/lib/api/analytics.ts`: Now makes real API calls to backend
  - `getAnalyticsStats()` → GET `/api/admin/analytics/stats`
  - `getBookingData()` → GET `/api/admin/analytics/bookings`
  - `getMonthlyPatients()` → GET `/api/admin/analytics/monthly-patients`
  - `getRevenueData()` → GET `/api/admin/analytics/revenue`
  - `getTopTests()` → GET `/api/admin/analytics/top-tests`
  - `getTopServices()` → GET `/api/admin/analytics/top-services`
  - `getRecentPatients()` → GET `/api/admin/analytics/recent-patients`
  - `getAllAnalyticsData()` → Combines all above calls

### 3. **Fixed Server-Side Auth Handling**
- Updated `getAuthToken()` function to work in server components
- Removed `localStorage` access (not available on server)
- Now reads token from `process.env.NEXT_PUBLIC_AUTH_TOKEN`

### 4. **Added Error Handling**
- `/app/admin/dashboard.tsx`: Try-catch with user-friendly error messages
- `/app/admin/analytics.tsx`: Try-catch with user-friendly error messages
- Shows backend URL and error details for debugging
- Won't crash if backend is unavailable

### 5. **Created .env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
# NEXT_PUBLIC_AUTH_TOKEN=your_token_here (optional for production)
```

### 6. **Documentation**
- Created `API_INTEGRATION.md` dengan:
  - Konfigurasi API
  - Semua required endpoints
  - Response format examples
  - Error handling
  - Testing instructions

## Backend Requirements

Backend harus menyediakan endpoints di `http://localhost:8000`:

**Dashboard Endpoints:**
- `GET /api/admin/dashboard/stats`
- `GET /api/admin/bookings?limit=5&sort=desc`
- `GET /api/admin/payments?status=pending`
- `GET /api/admin/schedule?date=YYYY-MM-DD`
- `GET /api/admin/alerts`

**Analytics Endpoints:**
- `GET /api/admin/analytics/stats`
- `GET /api/admin/analytics/bookings`
- `GET /api/admin/analytics/monthly-patients?year=YYYY`
- `GET /api/admin/analytics/revenue`
- `GET /api/admin/analytics/top-tests`
- `GET /api/admin/analytics/top-services`
- `GET /api/admin/analytics/recent-patients`

## Testing

1. **Start dev server:**
   ```bash
   pnpm run dev
   ```

2. **Start backend API:**
   ```bash
   # Your backend should run on http://localhost:8000
   ```

3. **Navigate to:**
   ```
   http://localhost:3000/admin
   http://localhost:3000/admin/analytics
   ```

4. **Check API calls:**
   - Open browser DevTools → Network tab
   - See all requests to backend endpoints
   - Check response data

## Fallback to Mock Data (if needed)

Jika backend belum siap, Anda bisa kembali ke mock data dengan:
1. Edit `/lib/api/dashboard.ts`: `USE_MOCK_DATA = true`
2. Edit `/lib/api/analytics.ts`: `USE_MOCK_DATA = true`
3. Restart dev server

## Status

✅ **Frontend:** Ready for backend integration
✅ **No hardcoded data** in admin pages
✅ **Proper error handling** when backend unavailable
⏳ **Waiting for:** Backend API implementation

---
Created: February 5, 2026
