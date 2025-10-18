# Berry Scaffold — Quick Start

## ✅ What You Got

**23 new pages** — All Berry-styled, responsive, ready to wire
**Full navigation** — Sidebar with collapsible Admin section
**3 docs** — Complete guides for wiring and customization

---

## 🚀 Run It Now

```bash
npm run dev
# Open http://localhost:3000
# Click through sidebar navigation
```

---

## 📄 Page Inventory

### ✅ Already Wired (4 pages)
- `/contacts` — Full CRUD with DataGrid
- `/companies` — Full CRUD with DataGrid
- `/deals` — Full CRUD with DataGrid
- `/activities` — Full CRUD with DataGrid

### 🎨 Styled Stubs (19 pages)
Ready to wire with copy-paste code from `WIRE_STUBS.md`:

**Core/Sales (2)**
- `/dashboard` — KPIs and stats
- `/pipeline` — Kanban board (drag-drop ready)
- `/calendar` — Calendar view + ICS feed

**Reports (1)**
- `/reports` — Charts and analytics

**Notifications (1)**
- `/notifications` — List with mark-as-read

**Admin (4)**
- `/admin/users` — User management
- `/admin/roles` — Role management
- `/admin/webhooks` — Webhook subscriptions
- `/admin/audit-log` — Audit trail

**Settings (2)**
- `/settings` — Workspace settings
- `/profile` — User profile

**Auth (3)**
- `/auth/login` — Login form
- `/auth/register` — Registration form
- `/auth/forgot-password` — Password reset

**Errors (2)**
- `/404` — Not Found (styled)
- `/500` — Server Error (styled)

**Optional (4)**
- `/pricing` — Plan comparison
- `/invoice/[id]` — Invoice details
- `/chat` — Internal chat
- `/tickets` — Support tickets

---

## 🔥 Wire Your First Page (5 min)

### Option A: Pipeline (Kanban)
```bash
# 1. Install dependency
npm install @hello-pangea/dnd

# 2. Copy code from WIRE_STUBS.md → Pipeline section
# 3. Replace pages/pipeline.tsx
# 4. Refresh browser → drag deals between stages
```

### Option B: Reports (Charts)
```bash
# 1. Install dependency
npm install @mui/x-charts

# 2. Copy code from WIRE_STUBS.md → Reports section
# 3. Replace pages/reports/index.tsx
# 4. Refresh browser → see funnel and time-to-close charts
```

### Option C: Notifications
```bash
# 1. Copy code from WIRE_STUBS.md → Notifications section
# 2. Replace pages/notifications.tsx
# 3. Refresh browser → see notification list with mark-as-read
```

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `BERRY_COMPLETE.md` | Full overview of what was created |
| `WIRE_STUBS.md` | Copy-paste code for wiring pages |
| `BERRY_SCAFFOLD.md` | Detailed feature breakdown |
| `QUICK_START_BERRY.md` | This file (quick reference) |

---

## 🎯 Priority Order

1. **Pipeline** — High visual impact, drag-drop Kanban
2. **Reports** — Analytics and charts
3. **Notifications** — User engagement
4. **Auth pages** — Login/register flow
5. **Admin pages** — User/role management

---

## 🛠️ Common Tasks

### Re-run scaffold (safe, skips existing)
```bash
./scripts/scaffold-berry-pages.sh
```

### Add a new page
```bash
# Edit scripts/scaffold-berry-pages.sh
# Add: mkpage "pages/my-page.tsx" "My Page" "Description"
./scripts/scaffold-berry-pages.sh
```

### Update navigation
```bash
# Edit: src/components/layout/SidebarNav.tsx
# Add item to navItems array
```

---

## 📞 Get Help

**Need code for a specific page?**
→ Open `WIRE_STUBS.md` and copy the section

**Need to customize a page?**
→ Open the page file in `pages/` and edit

**Need to add a new page?**
→ Run `./scripts/scaffold-berry-pages.sh` after editing it

**Need help wiring?**
→ Say "wire [page name]" (e.g., "wire Pipeline page")

---

## ✨ What's Next?

1. Pick a page from the priority list
2. Open `WIRE_STUBS.md`
3. Copy the code for that page
4. Replace the stub file
5. Refresh browser
6. Repeat!

---

**You're ready to go!** 🚀

All pages are styled, navigation is wired, and you have copy-paste code for everything.

Start with Pipeline or Reports for maximum visual impact.




