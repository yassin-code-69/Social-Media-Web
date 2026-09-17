# Digonto Platform - Frontend Context

## Purpose

This document defines the complete frontend architecture, UI/UX rules, component strategy, routing structure, data-fetching patterns, authentication behavior, responsive design rules, and engineering standards for the **Digonto Platform**.

This file should be used together with:

- `Digonto_Master_Context.md`
- `Digonto_Master_Phase.md`

The frontend must be production-ready, mobile-first, visually polished, maintainable, and easy to extend.

---

# 1. Frontend Technology Stack

Use the following stack:

- Next.js
- React
- TypeScript
- Next.js App Router
- Tailwind CSS
- shadcn/ui
- Lucide React
- TanStack Query
- React Hook Form
- Zod
- Zustand only where global client state is truly necessary
- Supabase Auth on the client side for authentication/session handling
- REST API communication with the Hono.js backend
- Vercel for deployment

Do not replace this stack unless there is a strong architectural reason.

---

# 2. Frontend Responsibilities

The frontend is responsible for:

- Rendering the public website
- Authentication UI
- User dashboard UI
- Admin panel UI
- Form handling
- API requests
- Client-side validation
- Session-aware navigation
- Loading states
- Empty states
- Error states
- Responsive layouts
- Task screenshot preview
- Deposit screenshot preview
- History views
- Notifications UI
- User-friendly feedback
- Accessibility
- Visual consistency

The frontend must **not** be the source of truth for:

- Wallet balance changes
- Referral reward logic
- User roles
- Admin authorization
- Task reward approval
- Deposit approval
- Withdrawal processing
- Package activation
- Sensitive financial rules

All sensitive business logic must remain on the backend.

---

# 3. Product Experience

The product should feel like a modern commercial earning/fintech platform.

The UI must not look like:

- A generic admin template
- A quick AI-generated dashboard
- A copied bootstrap panel
- A prototype with random colors
- A desktop-first enterprise interface squeezed into mobile

The target experience is:

- Clean
- Fast
- Mobile-first
- Trustworthy
- Simple to understand
- Visually modern
- Consistent
- Professional

---

# 4. Visual Direction

Use the provided reference image as the main visual inspiration.

## General Style

- Mobile app-like layout
- Rounded cards
- Soft shadows
- Clear sections
- Compact but readable spacing
- Modern iconography
- Strong contrast between primary actions and supporting actions
- Friendly fintech/product feel

## Color Direction

### Primary
Deep blue

Suggested role:

- Main action buttons
- Header accents
- Navigation active state
- Important text
- Primary brand identity

### Secondary
Bright green

Suggested role:

- Positive balance
- Success state
- Active status
- Referral rewards
- Deposit success
- Approved state

### Accent
Yellow / Gold

Suggested role:

- Rewards
- Bonus
- Premium package
- Highlighted actions
- Earnings emphasis

### Background
Soft white / light gray

Suggested role:

- Main page background
- Section separation
- Neutral card zones

### Danger
Muted red

Suggested role:

- Rejected
- Failed
- Destructive actions
- Warning messages

Do not overuse gradients.

Use gradients only when they genuinely improve hero cards, premium cards, or specific promotional sections.

---

# 5. Typography

Use a professional modern sans-serif font.

Recommended:

- Inter
- Geist
- Manrope

For Bangla support, use a font that renders Bengali cleanly.

Examples:

- Noto Sans Bengali
- Hind Siliguri

Typography must remain consistent across English and Bangla content.

## Hierarchy

### Page Title
Strong, clear, compact

### Section Title
Medium emphasis

### Card Title
Readable and concise

### Supporting Text
Lower contrast

### Financial Numbers
Slightly stronger weight

### Status
Compact badges

Avoid overly large headings on mobile.

---

# 6. Responsive Strategy

The frontend must be designed mobile-first.

Primary target widths:

```text
320px
360px
375px
390px
414px
430px
768px
1024px
1280px+
```

## Mobile

Use:

- Bottom navigation
- Single-column content
- Compact cards
- Full-width action buttons where appropriate
- Swipe-friendly and tap-friendly areas
- Large enough touch targets
- Sticky top/header patterns where useful

## Tablet

Use:

- Wider cards
- Two-column sections where appropriate
- Collapsible side navigation if useful

## Desktop

Use:

- Sidebar navigation
- Multi-column dashboard
- Wider content area
- Tables where appropriate
- Better spacing
- Do not simply stretch mobile cards

---

# 7. Recommended Frontend Folder Structure

Use a modular App Router structure.

```text
apps/web/
|
|-- src/
|   |
|   |-- app/
|   |   |
|   |   |-- (public)/
|   |   |   |-- page.tsx
|   |   |   `-- about/
|   |   |
|   |   |-- (auth)/
|   |   |   |-- login/
|   |   |   |-- register/
|   |   |   |-- forgot-password/
|   |   |   `-- reset-password/
|   |   |
|   |   |-- (dashboard)/
|   |   |   |-- dashboard/
|   |   |   |-- packages/
|   |   |   |-- tasks/
|   |   |   |-- wallet/
|   |   |   |-- deposit/
|   |   |   |-- withdraw/
|   |   |   |-- referral/
|   |   |   |-- history/
|   |   |   |-- notifications/
|   |   |   `-- profile/
|   |   |
|   |   |-- admin/
|   |   |   |-- dashboard/
|   |   |   |-- users/
|   |   |   |-- packages/
|   |   |   |-- tasks/
|   |   |   |-- submissions/
|   |   |   |-- deposits/
|   |   |   |-- withdrawals/
|   |   |   |-- referrals/
|   |   |   |-- transactions/
|   |   |   |-- reports/
|   |   |   `-- settings/
|   |   |
|   |   |-- layout.tsx
|   |   `-- globals.css
|   |
|   |-- components/
|   |   |
|   |   |-- ui/
|   |   |-- layout/
|   |   |-- auth/
|   |   |-- dashboard/
|   |   |-- packages/
|   |   |-- tasks/
|   |   |-- wallet/
|   |   |-- referral/
|   |   |-- history/
|   |   |-- notifications/
|   |   |-- profile/
|   |   `-- admin/
|   |
|   |-- features/
|   |   |
|   |   |-- auth/
|   |   |-- dashboard/
|   |   |-- packages/
|   |   |-- tasks/
|   |   |-- wallet/
|   |   |-- deposits/
|   |   |-- withdrawals/
|   |   |-- referrals/
|   |   |-- history/
|   |   `-- admin/
|   |
|   |-- hooks/
|   |
|   |-- lib/
|   |   |-- api/
|   |   |-- auth/
|   |   |-- query/
|   |   |-- utils/
|   |   `-- constants/
|   |
|   |-- stores/
|   |
|   |-- types/
|   |
|   `-- styles/
|
|-- public/
|-- next.config.ts
|-- tailwind.config.ts
|-- tsconfig.json
`-- package.json
```

---

# 8. Route Strategy

## Public Routes

```text
/
```

Optional future routes:

```text
/about
/contact
/terms
/privacy
```

## Auth Routes

```text
/login
/register
/forgot-password
/reset-password
```

## User Routes

```text
/dashboard
/packages
/packages/[id]
/tasks
/tasks/[id]
/wallet
/deposit
/withdraw
/referral
/history
/notifications
/profile
```

## Admin Routes

```text
/admin/dashboard
/admin/users
/admin/users/[id]
/admin/packages
/admin/tasks
/admin/submissions
/admin/deposits
/admin/withdrawals
/admin/referrals
/admin/transactions
/admin/reports
/admin/settings
```

---

# 9. Layout Architecture

## Root Layout

Responsibilities:

- Global font
- Global styles
- Query provider
- Toast provider
- Theme setup
- Global error boundary
- Metadata

## User Dashboard Layout

Contains:

- Top header
- Mobile bottom navigation
- Desktop sidebar
- Main content area
- Notification access
- User menu
- Responsive shell

## Admin Layout

Contains:

- Admin sidebar
- Admin header
- Role-aware navigation
- Main content region
- Breadcrumbs where useful

Do not reuse the user navigation shell directly for admin.

---

# 10. Navigation

## Mobile Bottom Navigation

Suggested items:

- Home
- Tasks
- Wallet
- Referral
- Profile

Keep 4 to 5 primary items.

Avoid overcrowding the bottom bar.

## Desktop Sidebar

Suggested items:

- Dashboard
- Packages
- Tasks
- Wallet
- Deposit
- Withdraw
- Referral
- History
- Notifications
- Profile

## Admin Sidebar

- Dashboard
- Users
- Packages
- Tasks
- Screenshot Review
- Deposits
- Withdrawals
- Referrals
- Transactions
- Reports
- Settings

---

# 11. Core UI Components

Create reusable components.

## Layout Components

- `AppHeader`
- `MobileBottomNav`
- `DesktopSidebar`
- `AdminSidebar`
- `AdminHeader`
- `PageContainer`
- `PageHeader`
- `SectionHeader`

## Data Components

- `StatCard`
- `WalletCard`
- `PackageCard`
- `TaskCard`
- `TransactionRow`
- `HistoryItem`
- `ReferralCard`
- `NotificationItem`

## Status Components

- `StatusBadge`
- `ApprovalBadge`
- `PackageStatusBadge`
- `TransactionTypeBadge`

## Feedback Components

- `EmptyState`
- `ErrorState`
- `LoadingState`
- `SkeletonCard`
- `InlineAlert`
- `ConfirmDialog`
- `SuccessDialog`

## Form Components

- `FormInput`
- `FormTextarea`
- `FormSelect`
- `AmountInput`
- `FileUpload`
- `ImagePreview`
- `PasswordInput`

Do not create duplicate versions of the same visual pattern.

---

# 12. User Dashboard

The dashboard is one of the most important screens.

It should visually follow the supplied reference.

## Recommended Sections

### User Header
- Profile image
- User name
- User ID or short identifier
- Current package

### Wallet Summary
- Available balance
- Deposit
- Withdraw

### Statistics
- Completed tasks
- Total earnings
- Referral count
- Current package

### Quick Actions
- Daily Bonus
- Free Task
- Job Post
- Lucky Spin
- Leaderboard
- Referral
- Gift Code
- Content
- Video Tasks
- Offers

### Popular Tasks
Show task cards with:

- Task name
- Category
- Reward
- Status
- CTA

## Dashboard Rules

- Avoid huge empty spaces.
- Prioritize money and tasks.
- Keep balance visible.
- Keep primary actions easy to tap.
- Use real API data.
- Use skeletons while loading.

---

# 13. Package UI

## Package List

Each package card should show:

- Package name
- Price
- Duration
- Daily task limit
- Reward benefit
- Referral benefit
- Status
- CTA

Highlight premium packages carefully.

Do not make all packages visually identical.

## Package Details

Include:

- Package summary
- Full benefits
- Price
- Validity
- Purchase CTA
- Current package warning if relevant

## Package History

Use:

- Mobile cards
- Desktop table if appropriate

Display:

- Package name
- Price
- Date
- Transaction ID
- Status

---

# 14. Task UI

## Task List

Support:

- Category filter
- Status filter
- Search if needed
- Pagination or infinite loading
- Package restrictions

Task card should show:

- Icon/category
- Title
- Reward
- Short instruction
- Eligibility state
- CTA

## Task Details

Display:

- Task title
- Reward
- Description
- Step-by-step instructions
- External task link
- Screenshot requirements
- Submission form

## Submission UI

User should be able to:

- Upload screenshot
- Preview screenshot
- Remove screenshot
- Submit
- See submission state

Disable duplicate submit while request is pending.

---

# 15. Cloudinary Upload Experience

Frontend must never expose Cloudinary secrets.

The UI must support:

- File selection
- Image preview
- Upload progress if practical
- File type validation
- File size validation
- Remove/replace image
- Clear failure messages

Use backend-generated or secure upload strategy as defined by the backend.

---

# 16. Wallet UI

## Wallet Overview

Display:

- Available balance
- Total earned
- Total withdrawn
- Pending amount if used

## Quick Actions

- Deposit
- Withdraw
- History

## Wallet History

Each transaction should show:

- Type
- Description
- Amount
- Credit/debit direction
- Date
- Status if applicable

Example:

```text
Task Reward
+৳10
17 Sep 2026
```

```text
Withdrawal
-৳500
17 Sep 2026
```

Use clear positive and negative visual differences.

---

# 17. Deposit UI

## Deposit Form

Fields:

- Amount
- Payment method
- Sender number/account
- Transaction ID
- Screenshot

## UX

- Show available payment methods
- Show clear instructions
- Validate required fields
- Preview screenshot
- Confirm before submit if needed

## Deposit History

Display:

- Amount
- Method
- Transaction ID
- Date
- Status
- Admin note if rejected

---

# 18. Withdrawal UI

## Withdrawal Form

Fields:

- Amount
- Method
- Account number

Display:

- Current available balance
- Minimum withdrawal amount
- Maximum withdrawal amount if configured
- Fee if later introduced

## Validation

- Required amount
- Positive amount
- Available balance
- Method selected
- Valid account format

## Withdrawal History

Display masked account number.

Example:

```text
017******45
```

Never display full sensitive account numbers in normal history UI.

---

# 19. Referral UI

## Referral Dashboard

Display:

- Referral code
- Referral link
- Copy button
- Total referrals
- Active referrals
- Referral earnings

## Referral List

Display:

- Display name
- User ID
- Join date
- Active/inactive status
- Reward

Use a simple share/copy experience.

---

# 20. History Center

Create a unified history experience.

Suggested tabs:

- All
- Packages
- Tasks
- Deposits
- Withdrawals
- Referrals
- Wallet

For mobile:

- Use tabs with horizontal scrolling if needed.
- Use card-based history.

For desktop:

- Use structured tables where useful.

---

# 21. Notifications UI

Support:

- Read
- Unread
- Mark as read
- Mark all as read
- Badge count

Notification examples:

- Task approved
- Task rejected
- Deposit approved
- Withdrawal processed
- Referral reward received
- Admin announcement

Use visual priority, not excessive colors.

---

# 22. Profile UI

Profile should include:

- Avatar
- Display name
- Email
- Phone
- User ID
- Referral code
- Package
- Account status

Allow:

- Profile photo change
- Name update
- Phone update where allowed
- Password change through Supabase flow

Sensitive fields should be handled carefully.

---

# 23. Admin Dashboard UI

The admin dashboard should feel like a real operations tool.

## Metrics

- Total users
- Active users
- Total deposits
- Total withdrawals
- Pending task reviews
- Pending deposits
- Pending withdrawals
- Package sales

## Admin Screens

### Users
- Search
- Filter
- View profile
- View package
- View wallet
- View history
- Suspend/reactivate

### Packages
- Create
- Edit
- Activate/deactivate

### Tasks
- Create
- Edit
- Publish
- Disable

### Submissions
- View screenshot
- Approve
- Reject
- Rejection reason

### Deposits
- Review
- Approve
- Reject

### Withdrawals
- Review
- Approve
- Reject
- Add note

### Referrals
- View relationship
- View reward state

### Transactions
- Search
- Filter
- User lookup
- Type filter

### Reports
- Date filters
- Summary cards
- Tables

### Settings
- Business settings
- Payment methods
- Referral settings
- Withdrawal rules

---

# 24. Data Fetching

Use TanStack Query for API-driven client state.

Use it for:

- Dashboard stats
- Packages
- Tasks
- Wallet
- History
- Referrals
- Notifications
- Admin lists
- Admin review queues

## Query Rules

- Use stable query keys.
- Keep query keys centralized.
- Invalidate only relevant queries after mutations.
- Avoid calling the same endpoint from many unrelated components.
- Use pagination for large lists.

Example conceptual key structure:

```text
["dashboard"]
["packages"]
["package", id]
["tasks", filters]
["task", id]
["wallet"]
["wallet-transactions", filters]
["referrals"]
["notifications"]
["admin-users", filters]
```

---

# 25. API Client

Create a centralized API layer.

Recommended:

```text
src/lib/api/
|
|-- client.ts
|-- auth.ts
|-- dashboard.ts
|-- packages.ts
|-- tasks.ts
|-- wallet.ts
|-- deposits.ts
|-- withdrawals.ts
|-- referrals.ts
|-- history.ts
|-- notifications.ts
`-- admin.ts
```

Do not scatter raw fetch calls everywhere.

The API client should handle:

- Base URL
- Authentication headers
- Standard JSON parsing
- Error normalization
- Unauthorized handling
- Request options

---

# 26. Authentication Handling

Supabase Auth manages authentication.

Frontend responsibilities:

- Login form
- Register form
- Session handling
- Logout
- Password reset
- Protected navigation
- Access token forwarding to backend

Backend remains responsible for final authorization.

## Important

Do not trust client role checks as security.

Client role checks are only for UX.

Backend must enforce actual permissions.

---

# 27. State Management

Use state carefully.

## TanStack Query

Use for:

- Server state
- API data
- Caching
- Mutations

## Zustand

Use only for persistent global UI/client state such as:

- Sidebar state
- Temporary multi-step form state
- UI preferences
- Lightweight app-level client state

Do not store server data in Zustand if TanStack Query already manages it.

## Local State

Use React state for:

- Modal open/close
- Input state
- Small local interactions
- Temporary selected values

---

# 28. Forms

Use:

- React Hook Form
- Zod

Every form needs:

- Validation
- Disabled submit state
- Loading state
- Error feedback
- Success feedback

Important forms:

- Login
- Register
- Package purchase
- Task submission
- Deposit
- Withdrawal
- Profile update
- Admin create/edit package
- Admin create/edit task
- Admin reject action

Do not allow repeated submissions while mutation is in progress.

---

# 29. Error Handling

User-facing error messages must be understandable.

Avoid displaying raw server errors.

Example:

Bad:

```text
PostgresError: duplicate key violation
```

Good:

```text
এই Transaction ID ইতোমধ্যে ব্যবহার করা হয়েছে।
```

Use:

- Toast for short feedback
- Inline form errors
- Full-page error state for page-level failures
- Retry button where useful

---

# 30. Loading States

Every API-driven page needs loading behavior.

Use:

- Skeletons for cards
- Skeleton rows for lists/tables
- Button loading state
- Upload progress if appropriate

Avoid blank screens.

Avoid global spinners for every small action.

---

# 31. Empty States

Examples:

- No tasks available
- No transactions
- No referrals
- No notifications
- No withdrawal history
- No package history

Each empty state should explain:

- What is missing
- What the user can do next

---

# 32. Status System

Use consistent statuses everywhere.

## General

- Pending
- Approved
- Rejected
- Active
- Inactive
- Completed
- Expired
- Suspended

## Visual Rules

- Pending: neutral/gold
- Approved: green
- Rejected: red
- Active: green
- Inactive: gray
- Suspended: red/orange
- Expired: muted gray

Use the same badge component throughout.

---

# 33. Accessibility

Frontend must support:

- Keyboard navigation
- Focus states
- Accessible labels
- Form labels
- Proper button elements
- Semantic headings
- Good contrast
- `aria-*` only where useful
- Dialog focus management

Icons must not be the only meaning for critical actions.

---

# 34. Performance

Use Next.js features appropriately.

## Rules

- Prefer Server Components for static/layout-heavy content.
- Use Client Components only where interaction is required.
- Avoid unnecessary `"use client"`.
- Lazy-load heavy admin modules if useful.
- Optimize images.
- Use pagination for large lists.
- Avoid giant client bundles.
- Avoid unnecessary re-renders.

---

# 35. Security Rules for Frontend

- Never expose backend secrets.
- Never expose Cloudinary secret.
- Never expose service role keys.
- Never trust client-supplied wallet values.
- Never trust client-supplied role values.
- Never calculate final financial values only on the client.
- Never store sensitive secrets in localStorage.
- Never render full withdrawal account numbers in history.
- Do not expose internal admin-only metadata to normal users.

---

# 36. Environment Variables

Frontend environment variables should be limited to safe public values.

Example:

```text
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Do not put:

- Database password
- Supabase service role key
- Cloudinary API secret
- Railway secrets

in the frontend environment.

---

# 37. Internationalization Readiness

The project may initially use Bangla or English.

Structure text so future localization is possible.

Avoid:

- Hardcoding long text inside deeply nested components
- Mixing business logic with display strings

Future-ready language support may include:

- Bangla
- English

---

# 38. Professional UI Rules

The frontend should not contain:

- Random emoji as primary UI icons
- Inconsistent rounded corners
- Random shadow values
- Different button styles per page
- Excessive gradients
- Overly bright backgrounds
- Huge text blocks
- Unaligned cards
- Poor mobile spacing
- Too many floating actions

Use Lucide icons for interface actions.

Emojis may be used sparingly only in promotional or reward contexts if the brand direction supports them.

---

# 39. Component Quality Rules

Each component should have:

- Clear responsibility
- Predictable props
- Strong TypeScript types
- Minimal duplicated logic
- Reusable styling
- Good naming

Avoid:

- 1000-line page components
- Repeating markup across routes
- Passing too many unrelated props
- Global state for everything

---

# 40. Table Strategy

Desktop admin pages may use tables.

Mobile pages should not rely on wide tables.

For mobile:

- Convert rows into cards
- Use compact metadata
- Use expandable detail if needed

For admin desktop:

- Search
- Filters
- Pagination
- Sort if useful
- Row actions

---

# 41. Confirmation UX

Use confirmation dialogs for:

- Withdrawal submit
- Package purchase
- Admin approve
- Admin reject
- Wallet adjustment
- User suspension
- Destructive actions

Do not use confirmation dialogs for harmless navigation.

---

# 42. Frontend Testing Priorities

Test:

- Login
- Register
- Protected routes
- Dashboard rendering
- Task submission
- Screenshot upload
- Deposit form
- Withdrawal form
- Package purchase
- Referral copy/share
- History filters
- Admin approval flows
- Responsive navigation

Priority should be highest for flows involving money or approvals.

---

# 43. Agent Implementation Rules

When an AI coding agent receives this file:

1. Read `Digonto_Master_Context.md` first.
2. Read `Digonto_Master_Phase.md` second.
3. Use this file as the source of truth for frontend implementation.
4. Do not change the finalized frontend stack.
5. Do not place backend business logic inside frontend pages.
6. Do not create pages with placeholder architecture that must later be rebuilt.
7. Keep components reusable.
8. Keep mobile-first behavior.
9. Keep TypeScript strict.
10. Keep API requests centralized.
11. Use TanStack Query for server state.
12. Use Zustand only where necessary.
13. Keep Supabase Auth isolated in auth utilities/providers.
14. Never expose secrets.
15. Add loading, empty, and error states.
16. Maintain visual consistency with the reference.
17. Do not introduce template-looking UI.
18. Build production-quality code, not demo code.

---

# 44. Frontend Definition of Done

The frontend is considered complete when:

- Public routes work.
- Authentication screens work.
- User dashboard is responsive.
- Package UI works.
- Task list/details/submission works.
- Cloudinary upload UX works.
- Wallet UI works.
- Deposit UI works.
- Withdrawal UI works.
- Referral UI works.
- History center works.
- Notifications UI works.
- Profile UI works.
- Admin panel works.
- Loading states exist.
- Empty states exist.
- Error states exist.
- Responsive behavior is verified.
- Client/server responsibilities are respected.
- No sensitive secret is exposed.
- Frontend is deployable to Vercel.
- The product feels professionally designed.

---

# Final Frontend Principle

The frontend must prioritize:

- clarity
- trust
- mobile usability
- consistency
- maintainability
- fast interaction
- professional visual quality

Every screen should feel like part of the same product.

Do not optimize only for visual appearance.

Optimize for a complete user experience that remains clean and scalable as the platform grows.
