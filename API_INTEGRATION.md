# API Integration Guide - Oasejiwa Frontend

## Overview
Frontend admin panel sekarang terhubung dengan backend API. Tidak ada hardcoded data lagi, semua data diminta dari backend.

## Backend API Configuration

Frontend mengharapkan backend API berjalan di:
```
http://localhost:8000
```

Dapat dikonfigurasi via `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Required API Endpoints

### Dashboard Endpoints

#### 1. GET /api/admin/dashboard/stats
**Purpose:** Get overall dashboard statistics

**Response Example:**
```json
{
  "totalPatients": 156,
  "newPatientsThisMonth": 12,
  "todayBookings": 8,
  "upcomingBookings": 3,
  "pendingPayments": 5,
  "monthlyRevenue": 45000000,
  "revenueGrowth": 15,
  "activePsychologists": 7,
  "totalPsychologists": 10,
  "avgRating": 4.8,
  "totalReviews": 234
}
```

#### 2. GET /api/admin/bookings?limit=5&sort=desc
**Purpose:** Get recent bookings

**Response Example:**
```json
[
  {
    "id": "booking_001",
    "patient": "John Doe",
    "psychologist": "Dr. Sarah",
    "service": "Konseling Umum",
    "date": "2026-02-05",
    "time": "14:00",
    "status": "confirmed" | "pending" | "completed" | "cancelled",
    "duration": 60
  }
]
```

#### 3. GET /api/admin/payments?status=pending
**Purpose:** Get pending payments

**Response Example:**
```json
[
  {
    "id": "payment_001",
    "patient": "John Doe",
    "amount": 500000,
    "service": "Konseling Umum",
    "date": "2026-02-05",
    "dueDate": "2026-02-12",
    "method": "transfer" | "kartu_kredit",
    "status": "pending" | "paid" | "overdue"
  }
]
```

#### 4. GET /api/admin/schedule?date=2026-02-05
**Purpose:** Get today's schedule

**Response Example:**
```json
[
  {
    "id": "schedule_001",
    "time": "09:00",
    "psychologist": "Dr. Sarah",
    "patient": "John Doe",
    "duration": 60,
    "status": "scheduled" | "in_progress" | "completed"
  }
]
```

#### 5. GET /api/admin/alerts
**Purpose:** Get system alerts/notifications

**Response Example:**
```json
[
  {
    "id": "alert_001",
    "type": "warning" | "error" | "info" | "success",
    "title": "High number of cancellations",
    "message": "3 bookings were cancelled today",
    "timestamp": "2026-02-05T14:30:00Z",
    "actionUrl": "/admin/bookings"
  }
]
```

### Analytics Endpoints

#### 6. GET /api/admin/analytics/stats
**Purpose:** Get analytics statistics

**Response Example:**
```json
{
  "totalUsers": 340,
  "totalVisitors": 1250,
  "totalBookings": 567,
  "totalRevenue": 234500000
}
```

#### 7. GET /api/admin/analytics/bookings
**Purpose:** Get booking chart data (daily bookings count)

**Response Example:**
```json
[
  {
    "date": "2026-01-29",
    "count": 12
  },
  {
    "date": "2026-01-30",
    "count": 15
  }
]
```

#### 8. GET /api/admin/analytics/monthly-patients?year=2026
**Purpose:** Get monthly new patients data

**Response Example:**
```json
[
  {
    "month": "Jan",
    "count": 45
  },
  {
    "month": "Feb",
    "count": 38
  }
]
```

#### 9. GET /api/admin/analytics/revenue
**Purpose:** Get revenue breakdown

**Response Example:**
```json
{
  "paid": 189000000,
  "dp": 45500000,
  "total": 234500000
}
```

#### 10. GET /api/admin/analytics/top-tests
**Purpose:** Get top services/tests

**Response Example:**
```json
[
  {
    "name": "Konseling Depresi",
    "count": 87
  },
  {
    "name": "Tes Kepribadian",
    "count": 65
  }
]
```

#### 11. GET /api/admin/analytics/top-services
**Purpose:** Get top services

**Response Example:**
```json
[
  {
    "name": "Konseling Umum",
    "revenue": 45000000,
    "bookings": 120
  }
]
```

#### 12. GET /api/admin/analytics/recent-patients
**Purpose:** Get recent patients table data

**Response Example:**
```json
[
  {
    "id": "patient_001",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "081234567890",
    "bookings": 5,
    "lastBooking": "2026-02-05",
    "status": "active" | "inactive"
  }
]
```

## Authentication

Saat ini authentication header optional. Untuk production, tambahkan token via:

**Option 1: Environment Variable**
```env
NEXT_PUBLIC_AUTH_TOKEN=your_jwt_token
```

**Option 2: Backend Response (Cookie)**
Frontend akan mengirim auth token jika tersedia di environment variable.

## Error Handling

Jika backend tidak tersedia, admin page akan menampilkan error message yang user-friendly:
- Menunjukkan URL backend yang diharapkan
- Memberikan error details untuk debugging
- Tidak crash aplikasi

## Development Notes

1. Untuk testing dengan mock data:
   - Edit `USE_MOCK_DATA = true` di `/lib/api/dashboard.ts` dan `/lib/api/analytics.ts`
   - Restart dev server

2. Untuk production dengan real API:
   - Pastikan `USE_MOCK_DATA = false` (default saat ini)
   - Set `NEXT_PUBLIC_API_URL` ke backend production URL
   - Implementasi proper authentication dengan JWT tokens

3. CORS Handling:
   - Pastikan backend allow CORS dari frontend domain
   - Untuk development: `http://localhost:3000`
   - Untuk production: set appropriate CORS headers

## Testing the Integration

```bash
# 1. Start frontend dev server
pnpm run dev

# 2. Start your backend API server
# (usually on http://localhost:8000)

# 3. Navigate to http://localhost:3000/admin
# 4. Check browser console for API calls and responses
```

---
**Last Updated:** February 5, 2026
**Status:** Ready for backend integration
