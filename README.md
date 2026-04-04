# 💰 Finance Dashboard UI

## 📌 Overview

This project is a clean and interactive **Finance Dashboard UI** built as part of a frontend assignment.
It allows users to view financial summaries, explore transactions, and understand spending patterns through visualizations.

The focus of this project is on:

- UI/UX design
- Component structuring
- State management
- Interactive frontend behavior

---

## 🚀 Features

### 📊 Dashboard Overview

- Summary cards (Total Balance, Income, Expenses, Savings)
- Time-based chart (balance trend)
- Category-based chart (spending breakdown)
- Recent activity feed with full history dialog

### 📋 Transactions

- Transaction list with:

  - Date
  - Category
  - Amount
  - Type (Income/Expense)
- Search functionality
- Filtering (category/type)
- Sorting options
- Pagination

### 🔐 Role-Based UI (Frontend Simulation)

- Viewer Role:

  - Read-only access
- Admin Role:

  - Can add, edit, and delete transactions
  - Can export CSV/JSON
  - Can reset mock dataset

Role switching is implemented using frontend state (no backend/authentication).

### 📈 Insights

- Highest spending category
- Monthly comparison
- Smart financial observations
- Weekly planned vs actual spending chart

### 🎨 UI/UX

- Clean and modern design
- Fully responsive layout
- Smooth interactions and animations
- Empty state and no-data handling

---

## 🛠️ Tech Stack

- React (with Vite)
- TypeScript
- Tailwind CSS
- Radix UI primitives
- Recharts (for charts)
- Zustand (state management)
- Lucide Icons
- Framer Motion (animations)

---

## 🧩 Project Structure

```bash
src/
│
├── components/
│   ├── dashboard/    # Dashboard, Transactions, Insights, Settings modules
│   ├── layout/       # Topbar and Sidebar
│   └── ui/           # Reusable UI primitives
├── store/            # Zustand store
├── data/             # Mock transaction data
├── lib/              # Analytics, formatting, utility helpers
├── types/            # Shared TypeScript types
├── main.tsx
└── App.tsx
```

---

## ⚙️ Installation & Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
```

2. Navigate to the project:

```bash
cd finance-interface
```

3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

5. Open in browser:

```bash
http://localhost:5173
```

Additional scripts:

```bash
npm run lint
npm run build
npm run preview
```

---

## 📦 State Management Approach

The application uses **Zustand** with persistence middleware to manage:

- Transactions data
- Selected role (Viewer/Admin)
- Theme preference
- Filters and search queries
- Pagination state

This ensures:

- Centralized state
- Predictable updates
- Clean component communication
- Local persistence across page reloads

---

## 🔁 Role-Based UI Logic

The role-based behavior is simulated on the frontend:

- The selected role is stored in state
- UI elements are conditionally rendered:

  - Admin -> Full access (add/edit/delete/export/reset)
  - Viewer -> Read-only UI

Also, app-level handler guards are in place to block protected actions even if triggered indirectly.

Example:

```tsx
{role === 'admin' && <Button onClick={onAddTransaction}>New Entry</Button>}
```

---

## 📊 Data Handling

- Uses static/mock transaction data
- No backend integration
- Data updates dynamically based on user interaction
- Filters/sorts/search are applied through pure analytics helpers

---

## 🎯 Design Decisions

- Financial-first card hierarchy for quick KPI scan
- Tokenized light/dark styling for consistency
- Modular page sections for scalability
- Minimal but meaningful motion
- Clear empty/no-data messaging instead of blank panels

---

## 📱 Responsiveness

- Desktop: full dashboard layout with persistent sidebar
- Tablet: adjusted cards, spacing, compact controls
- Mobile: stacked layout with drawer sidebar and card-based records

---

## ⚠️ Edge Case Handling

- No transactions -> Empty state UI
- No search/filter results -> Friendly message
- No trend/category data -> Chart fallback placeholders
- Disabled/protected actions for Viewer role
- Safe pagination bounds after filtering

---

## ⚡ Performance Optimization

The build configuration includes **manual chunk splitting** for better bundle organization and caching:

- react
- charts
- motion
- radix
- state
- icons
- vendor fallback

This helps reduce a single large vendor bundle and improves asset caching behavior.

---

## ✨ Optional Features Implemented

- Dark mode
- Local storage persistence
- Animations
- Export functionality (CSV/JSON)
- Role-based UI simulation with guard logic

---

## 📸 Screenshots

Add dashboard screenshots here (desktop, tablet, mobile, transactions, insights, settings).

---

## 📌 Future Improvements

- Backend integration
- Authentication and real RBAC
- Automated tests (unit/integration)
- Advanced analytics and forecasting
- Real-time updates

---

## 👨‍💻 Author

Nandakishor

---

## 📄 License

This project is for educational/assignment purposes.
