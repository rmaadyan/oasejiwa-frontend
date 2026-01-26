# 🚀 Project Name (Contoh: Oase Jiwa Frontend)

Project ini dibangun menggunakan **Next.js 14+**, **Tailwind CSS**, dan dikelola dengan **pnpm**. Struktur folder didesain agar scalable untuk kebutuhan fitur yang kompleks.

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Package Manager:** [pnpm](https://pnpm.io/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Components:** [Shadcn UI](https://ui.shadcn.com/) (Optional)
* **Language:** [TypeScript](https://www.typescriptlang.org/)

---

## 📂 Project Structure

Project ini mengikuti pola **Feature-Based Structure** untuk memisahkan logika bisnis dengan komponen UI global.

```text
src/
├── app/              # Routing & Layout (App Router)
├── assets/           # Gambar, Icon, dan Global Static Files
├── components/       
│   ├── ui/           # Komponen atomik (Button, Input, dll)
│   ├── common/       # Komponen global (Navbar, Footer)
│   └── features/     # Komponen spesifik fitur (e.g., LandingPage, Dashboard)
├── hooks/            # Custom React Hooks
├── lib/              # Konfigurasi library (Axios, Utils, Prisma)
├── services/         # API Fetching logic
├── store/            # State Management (Zustand/Context API)
└── types/            # TypeScript Definitions & Interfaces

```

---

## 🚀 Getting Started

### 1. Prasyarat

Pastikan kamu sudah menginstall **Node.js** dan **pnpm**:

```bash
npm install -g pnpm

```

### 2. Instalasi

Clone repository dan install dependensi:

```bash
git clone [https://github.com/username/project-repo.git](https://github.com/username/project-repo.git)
cd project-repo
pnpm install

```

### 3. Menjalankan Mode Development

```bash
pnpm dev

```

Aplikasi akan berjalan di [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000).

### 4. Build untuk Production

```bash
pnpm build
pnpm start

```

---

## 📝 Konvensi Penulisan

* **Komponen:** Gunakan `PascalCase` (contoh: `HeroSection.tsx`).
* **Hooks/Utils:** Gunakan `kebab-case` (contoh: `use-local-storage.ts`).
* **Import:** Selalu gunakan alias `@/` untuk menghindari *deep nesting* (contoh: `import { Button } from '@/components/ui'`).

---

## 🤝 Kontribusi

1. Buat Branch baru (`git checkout -b feature/nama-fitur`)
2. Commit perubahanmu (`git commit -m 'Add some feature'`)
3. Push ke Branch (`git push origin feature/nama-fitur`)
4. Buat Pull Request

```
