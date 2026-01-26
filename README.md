# Oasejiwa Frontend

Aplikasi frontend untuk platform Oasejiwa yang dibangun menggunakan Next.js 16, React 19, TypeScript, dan Tailwind CSS.

## 📋 Daftar Isi

- [Prasyarat](#prasyarat)
- [Setup Project](#setup-project)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Struktur Project](#struktur-project)
- [Clean Code Guidelines](#clean-code-guidelines)
- [Scripts yang Tersedia](#scripts-yang-tersedia)
- [Tech Stack](#tech-stack)
- [Konvensi Kode](#konvensi-kode)
- [Best Practices](#best-practices)

## 🔧 Prasyarat

Pastikan Anda telah menginstall tools berikut:

- **Node.js**: versi 20.x atau lebih tinggi
- **pnpm**: package manager yang direkomendasikan
  ```bash
  npm install -g pnpm
  ```

## 🚀 Setup Project

### 1. Clone Repository

```bash
git clone <repository-url>
cd oasejiwa-frontend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables (jika diperlukan)

Buat file `.env.local` di root directory:

```env
# Contoh environment variables
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 💻 Menjalankan Aplikasi

### Development Mode

```bash
pnpm dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build aplikasi
pnpm build

# Jalankan production server
pnpm start
```

### Linting

```bash
pnpm lint
```

## 📁 Struktur Project

```
oasejiwa-frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── public/                # Static assets
├── components/            # Reusable components (akan dibuat)
├── lib/                   # Utility functions & helpers (akan dibuat)
├── types/                 # TypeScript type definitions (akan dibuat)
├── hooks/                 # Custom React hooks (akan dibuat)
├── eslint.config.mjs     # ESLint configuration
├── next.config.ts        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
├── postcss.config.mjs    # PostCSS configuration
└── package.json          # Project dependencies
```

## 🎯 Clean Code Guidelines

### 1. Struktur Folder yang Disarankan

```
app/
  ├── (auth)/              # Route groups untuk authentication
  ├── (dashboard)/         # Route groups untuk dashboard
  ├── api/                 # API routes
  └── ...

components/
  ├── ui/                  # UI components dasar (Button, Input, dll)
  ├── features/            # Feature-specific components
  └── layouts/             # Layout components

lib/
  ├── api/                 # API client & utilities
  ├── utils/               # Helper functions
  └── constants/           # Constants & configs

types/
  ├── api.ts              # API types
  ├── models.ts           # Data models
  └── ...
```

### 2. Naming Conventions

#### Files & Folders
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `UserTypes.ts`)
- **Route folders**: kebab-case (e.g., `user-profile/`)

#### Variables & Functions
```typescript
// ✅ Good
const userName = "John";
const fetchUserData = async () => {};
const isUserActive = true;

// ❌ Bad
const user_name = "John";
const FetchUserData = async () => {};
const UserActive = true;
```

#### Components
```typescript
// ✅ Good - PascalCase untuk component
export default function UserProfile() {
  return <div>Profile</div>;
}

// ✅ Good - Named export
export function Button({ children }: { children: React.ReactNode }) {
  return <button>{children}</button>;
}
```

### 3. Component Structure

```typescript
// 1. Imports
import { useState, useEffect } from 'react';
import type { User } from '@/types/models';

// 2. Types/Interfaces
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

// 3. Component
export default function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // 3.1 Hooks
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 3.2 Effects
  useEffect(() => {
    fetchUser();
  }, [userId]);

  // 3.3 Handlers & Functions
  const fetchUser = async () => {
    // Implementation
  };

  const handleUpdate = () => {
    // Implementation
  };

  // 3.4 Early returns
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  // 3.5 Render
  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}
```

### 4. TypeScript Best Practices

```typescript
// ✅ Good - Explicit types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const getUser = (id: string): Promise<User> => {
  // Implementation
};

// ✅ Good - Type-safe props
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

// ❌ Bad - Using 'any'
const getData = (id: string): Promise<any> => {
  // Avoid this!
};
```

### 5. Code Organization

#### Separate Concerns
```typescript
// ❌ Bad - Mixed concerns
export default function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);
  
  return <div>{/* render */}</div>;
}

// ✅ Good - Separated concerns
// hooks/useUsers.ts
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    const data = await apiClient.getUsers();
    setUsers(data);
    setLoading(false);
  };
  
  return { users, loading };
}

// components/UserList.tsx
export default function UserList() {
  const { users, loading } = useUsers();
  
  if (loading) return <Loading />;
  
  return <div>{/* render */}</div>;
}
```

### 6. Styling Conventions

#### Tailwind CSS
```typescript
// ✅ Good - Logical grouping
<button className="
  px-4 py-2 
  bg-blue-500 hover:bg-blue-600 
  text-white font-medium 
  rounded-lg 
  transition-colors
">
  Click me
</button>

// ✅ Good - Extract complex classes
const buttonStyles = cn(
  "px-4 py-2",
  "bg-blue-500 hover:bg-blue-600",
  "text-white font-medium",
  "rounded-lg transition-colors"
);
```

### 7. Error Handling

```typescript
// ✅ Good - Proper error handling
async function fetchUserData(id: string) {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error; // Re-throw for caller to handle
  }
}
```

### 8. Comments & Documentation

```typescript
// ✅ Good - Self-documenting code with minimal comments
function calculateDiscountedPrice(price: number, discountPercent: number): number {
  return price * (1 - discountPercent / 100);
}

// ✅ Good - Comments for complex logic
/**
 * Formats user data for display in the UI
 * @param user - Raw user data from API
 * @returns Formatted user object with computed fields
 */
function formatUserForDisplay(user: RawUser): DisplayUser {
  // Calculate age from birthdate
  const age = calculateAge(user.birthDate);
  
  return {
    ...user,
    age,
    displayName: `${user.firstName} ${user.lastName}`,
  };
}
```

## 📝 Scripts yang Tersedia

| Script | Deskripsi |
|--------|-----------|
| `pnpm dev` | Menjalankan development server |
| `pnpm build` | Build aplikasi untuk production |
| `pnpm start` | Menjalankan production server |
| `pnpm lint` | Menjalankan ESLint untuk check code quality |

## 🛠 Tech Stack

- **Framework**: Next.js 16.1.4 (App Router)
- **Language**: TypeScript 5.x
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4.x
- **Linting**: ESLint 9.x
- **Package Manager**: pnpm

## 📐 Konvensi Kode

### Git Commit Messages

Gunakan conventional commits:

```
feat: add user authentication
fix: resolve navigation bug
docs: update README
style: format code with prettier
refactor: restructure components folder
test: add user service tests
chore: update dependencies
```

### Branch Naming

```
feature/user-authentication
bugfix/navigation-error
hotfix/critical-security-issue
refactor/component-structure
```

## ✨ Best Practices

### Performance

1. **Use Server Components by default** (Next.js App Router)
   ```typescript
   // app/users/page.tsx - Server Component
   export default async function UsersPage() {
     const users = await fetchUsers(); // Runs on server
     return <UserList users={users} />;
   }
   ```

2. **Client Components hanya untuk interactivity**
   ```typescript
   'use client'; // Only when needed
   
   export function InteractiveButton() {
     const [count, setCount] = useState(0);
     return <button onClick={() => setCount(count + 1)}>{count}</button>;
   }
   ```

3. **Image Optimization**
   ```typescript
   import Image from 'next/image';
   
   <Image 
     src="/profile.jpg" 
     alt="Profile" 
     width={500} 
     height={500}
     priority // For above-fold images
   />
   ```

### Security

1. Jangan commit sensitive data (API keys, passwords)
2. Gunakan environment variables untuk konfigurasi
3. Validate input dari user
4. Sanitize data sebelum render

### Accessibility

1. Gunakan semantic HTML
2. Tambahkan proper ARIA labels
3. Pastikan keyboard navigation works
4. Test dengan screen readers

## 🤝 Contributing

1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: add some amazing feature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📚 Learn More

Untuk mempelajari lebih lanjut tentang Next.js:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Next.js GitHub repository](https://github.com/vercel/next.js)

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

**Happy Coding! 🚀**
