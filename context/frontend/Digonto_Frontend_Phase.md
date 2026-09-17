# Digonto Platform - Frontend Phase Plan

## Purpose

This document defines the complete frontend implementation roadmap for the **Digonto Platform**.

Use this file together with:

- `Digonto_Master_Context.md`
- `Digonto_Master_Phase.md`
- `Digonto_Frontend_Context.md`

The goal is to build the frontend in controlled phases so that an AI coding agent can work step by step without breaking architecture, duplicating logic, or creating inconsistent UI.

The frontend stack is locked as:

- Next.js
- React
- TypeScript
- App Router
- Tailwind CSS
- shadcn/ui
- Lucide React
- TanStack Query
- React Hook Form
- Zod
- Zustand only where necessary
- Supabase Auth
- REST API consumption from Hono.js backend
- Vercel deployment

The frontend must be:

- Mobile-first
- Responsive
- Production-ready
- Visually polished
- Consistent
- Accessible
- Secure
- Maintainable
- Future-ready

---

# Global Frontend Execution Rules

Before working on any frontend phase:

1. Read the Master Context.
2. Read the Master Phase.
3. Read the Frontend Context.
4. Work only on the requested phase.
5. Do not create backend business logic in frontend code.
6. Do not trust client-side authorization as security.
7. Do not hardcode live production data.
8. Do not expose secrets in frontend environment variables.
9. Keep TypeScript strict.
10. Keep reusable components modular.
11. Use mobile-first responsive design.
12. Add loading, empty, error, and success states.
13. Use TanStack Query for API server state.
14. Use Zustand only for true client-global state.
15. Use React Hook Form + Zod for forms.
16. Avoid unnecessary client components.
17. Avoid duplicated fetch logic.
18. Keep visual behavior aligned with the provided reference image.
19. Do not make the interface look like a generic admin template.
20. Finish and verify each phase before moving to the next.

---

# Phase F0 - Frontend Architecture Lock

## Objective

Lock frontend architecture before building screens.

## Tasks

- Confirm Next.js App Router.
- Confirm folder structure.
- Confirm user route groups.
- Confirm admin route groups.
- Confirm public/auth route groups.
- Confirm API client structure.
- Confirm query key strategy.
- Confirm auth/session strategy.
- Confirm design tokens.
- Confirm mobile navigation strategy.
- Confirm desktop navigation strategy.
- Confirm component naming conventions.
- Confirm environment variable names.

## Recommended App Structure

```text
apps/web/
|
|-- src/
|   |-- app/
|   |   |-- (public)/
|   |   |-- (auth)/
|   |   |-- (dashboard)/
|   |   |-- admin/
|   |   |-- layout.tsx
|   |   `-- globals.css
|   |
|   |-- components/
|   |-- features/
|   |-- hooks/
|   |-- lib/
|   |-- stores/
|   |-- types/
|   `-- styles/
|
|-- public/
|-- next.config.ts
|-- tsconfig.json
`-- package.json
```

## Deliverables

- Final route map
- Final frontend folder structure
- Shared naming conventions
- Environment variable template

## Exit Criteria

- Architecture is clear.
- No route ambiguity remains.
- No duplicate frontend responsibility exists.

---

# Phase F1 - Frontend Project Initialization

## Objective

Initialize the frontend application and development tooling.

## Tasks

Create/configure:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- TanStack Query
- React Hook Form
- Zod
- Zustand

Configure:

- strict TypeScript
- path aliases
- global CSS
- font loading
- basic metadata
- environment variables
- development scripts

## Recommended Aliases

```text
@/components
@/features
@/hooks
@/lib
@/stores
@/types
@/styles
```

## Deliverables

- Working Next.js project
- Global CSS
- Base Tailwind setup
- shadcn/ui setup
- Clean TypeScript configuration

## Exit Criteria

- App runs successfully.
- No TypeScript configuration errors.
- Tailwind styles render correctly.
- shadcn components work.

---

# Phase F2 - Design System Foundation

## Objective

Build a professional reusable visual system before feature pages.

## Define Design Tokens

Create consistent tokens for:

- Primary color
- Secondary color
- Accent color
- Success
- Warning
- Danger
- Neutral colors
- Background
- Border
- Radius
- Shadow
- Spacing
- Typography

## Visual Direction

Use the reference image as primary inspiration.

Target:

- Deep blue primary
- Bright green positive accent
- Gold/yellow reward accent
- Soft white/light gray background
- Rounded cards
- Soft shadows
- Professional modern feel

## Build Core UI Components

- Button
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Badge
- Card
- Dialog
- Drawer
- Sheet
- Tabs
- Dropdown
- Tooltip
- Skeleton
- Alert
- Toast
- Avatar
- Separator

## Custom Shared Components

Create:

- `PageContainer`
- `PageHeader`
- `SectionHeader`
- `StatCard`
- `StatusBadge`
- `EmptyState`
- `ErrorState`
- `LoadingState`
- `ConfirmDialog`
- `AmountDisplay`
- `ResponsiveCard`

## Deliverables

- Reusable design system
- Consistent visual tokens
- Shared UI primitives

## Exit Criteria

- Core components look consistent.
- No random one-off colors or spacing.
- Mobile readability is verified.

---

# Phase F3 - Application Shell and Navigation

## Objective

Create the main responsive layout systems.

## User Layout

Build:

- User header
- Mobile bottom navigation
- Desktop sidebar
- Main content container
- User dropdown/menu
- Notification shortcut

## Mobile Navigation

Recommended items:

- Home
- Tasks
- Wallet
- Referral
- Profile

## Desktop User Sidebar

Recommended items:

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

## Admin Layout

Build separately:

- Admin sidebar
- Admin header
- Admin content area
- Responsive admin drawer
- Breadcrumbs where useful

## Deliverables

- User layout
- Admin layout
- Mobile bottom navigation
- Responsive sidebar

## Exit Criteria

- Mobile navigation works.
- Desktop navigation works.
- User and admin shells are clearly separated.

---

# Phase F4 - API Client and Query Infrastructure

## Objective

Create a clean centralized frontend data layer.

## Create API Client

Recommended structure:

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

## API Client Responsibilities

- API base URL
- JSON handling
- auth token forwarding
- standard error parsing
- unauthorized handling
- request headers
- mutation helpers

## TanStack Query Setup

Create:

- Query provider
- Query client
- Query keys
- mutation helpers
- common cache invalidation patterns

## Suggested Query Keys

```text
["dashboard"]
["packages"]
["package", id]
["tasks", filters]
["task", id]
["wallet"]
["wallet-transactions", filters]
["deposits", filters]
["withdrawals", filters]
["referrals"]
["history", filters]
["notifications"]
["admin-users", filters]
["admin-submissions", filters]
```

## Deliverables

- Central API client
- TanStack Query provider
- Query key structure

## Exit Criteria

- One test API endpoint can be fetched successfully.
- Standard API errors are normalized.
- Unauthorized behavior is handled cleanly.

---

# Phase F5 - Supabase Authentication UI

## Objective

Implement the full authentication experience.

## Screens

Build:

```text
/login
/register
/forgot-password
/reset-password
```

## Login

Fields:

- Email / supported identifier
- Password

Features:

- Show/hide password
- Validation
- Loading state
- Error message
- Redirect after success

## Registration

Fields according to finalized backend/user profile requirements.

Possible fields:

- Full name
- Email
- Phone
- Password
- Confirm password
- Referral code if available

## Forgot Password

- Email field
- Success message
- Error state

## Session Behavior

- Detect current session
- Redirect authenticated user away from login/register where appropriate
- Redirect unauthenticated user from protected screens
- Forward access token to backend

## Important

Frontend auth protection is UX only.

Backend remains responsible for authorization.

## Deliverables

- Complete authentication UI
- Supabase session integration
- Protected route UX

## Exit Criteria

- Register works.
- Login works.
- Logout works.
- Password reset flow is functional.
- Session persists correctly.

---

# Phase F6 - User Dashboard UI

## Objective

Build the primary user experience using the supplied visual reference.

## Dashboard Sections

### Profile Area

Display:

- Avatar
- Name
- User ID
- Current package

### Wallet Card

Display:

- Available balance
- Deposit button
- Withdraw button

### Statistics

Display:

- Completed tasks
- Total earnings
- Referral count
- Package status

### Quick Action Grid

Potential items:

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

Show:

- Task title
- Category
- Reward
- Task state
- CTA

## Required States

- Skeleton loading
- Dashboard error state
- No active package state
- No task state

## Deliverables

- Fully responsive dashboard
- Real API data binding
- Reference-inspired styling

## Exit Criteria

- Works well on 320px+ widths.
- Desktop version is polished.
- No fake production numbers remain.

---

# Phase F7 - Package Experience

## Objective

Build user-facing package discovery, details, purchase, and history UI.

## Routes

```text
/packages
/packages/[id]
```

## Package List

Each card should include:

- Package name
- Price
- Validity
- Task limit
- Reward benefits
- Referral benefits
- Status
- CTA

## Package Detail

Include:

- Name
- Price
- Description
- Benefits
- Duration
- Purchase action
- Current package notice

## Purchase Flow

Create UI for:

- Payment method
- Transaction information
- Screenshot if required
- Confirmation state

## Package History

Display:

- Package name
- Price
- Purchase date
- Transaction ID
- Status

## Deliverables

- Package list
- Package detail
- Purchase flow
- Package history

## Exit Criteria

- Loading/error/empty states exist.
- Current package is visually distinguishable.
- Purchase submit cannot be duplicated.

---

# Phase F8 - Task List and Task Details

## Objective

Build task discovery and completion flow.

## Routes

```text
/tasks
/tasks/[id]
```

## Task List

Support:

- Category filter
- Status filter
- Pagination/infinite load
- Package eligibility indicators

## Task Card

Display:

- Category icon
- Title
- Reward
- Short instructions
- Eligibility
- CTA

## Task Detail

Display:

- Title
- Reward
- Full description
- Step-by-step instructions
- External target link
- Screenshot requirements
- Submission state

## Deliverables

- Task list
- Filters
- Task detail screen

## Exit Criteria

- Restricted tasks are clearly indicated.
- Reward display is consistent.
- External task action is clear.

---

# Phase F9 - Screenshot Upload Experience

## Objective

Create secure and user-friendly upload UX for task proof.

## UI Requirements

Support:

- Select image
- Preview image
- Replace image
- Remove image
- File type validation
- File size validation
- Upload progress where practical
- Upload failure state

## Submission Flow

```text
Choose Screenshot
      |
      v
Preview
      |
      v
Upload
      |
      v
Submit Task
      |
      v
Pending Review
```

## Important

- Never expose Cloudinary secret.
- Prevent duplicate submission clicks.
- Show clear status after submit.

## Deliverables

- Reusable image upload component
- Task screenshot submission UI

## Exit Criteria

- Invalid file type is rejected.
- Oversized file gives clear feedback.
- Admin can later view uploaded screenshot.

---

# Phase F10 - Wallet UI

## Objective

Build a clear financial overview.

## Route

```text
/wallet
```

## Wallet Summary

Display:

- Available balance
- Pending balance if used
- Total earned
- Total withdrawn

## Actions

- Deposit
- Withdraw
- View history

## Transaction List

Show:

- Transaction type
- Description
- Amount
- Direction
- Date
- Status if relevant

Examples:

```text
Task Reward
+৳10
```

```text
Withdrawal
-৳500
```

## Deliverables

- Wallet overview
- Transaction history list
- Filters if needed

## Exit Criteria

- Credits and debits are visually clear.
- Financial data comes only from backend APIs.

---

# Phase F11 - Deposit UI

## Objective

Build deposit/recharge request experience.

## Route

```text
/deposit
```

## Form Fields

- Amount
- Payment method
- Sender/account information
- Transaction ID
- Screenshot

## UI Requirements

- Payment method cards/select
- Payment instructions
- Form validation
- Screenshot preview
- Submit loading state
- Success confirmation

## Deposit History

Show:

- Amount
- Method
- Transaction ID
- Date
- Status
- Admin note if applicable

## Deliverables

- Deposit form
- Deposit history

## Exit Criteria

- Duplicate click is prevented.
- API errors are friendly.
- Pending/approved/rejected states are visible.

---

# Phase F12 - Withdrawal UI

## Objective

Build withdrawal request and history experience.

## Route

```text
/withdraw
```

## Form Fields

- Amount
- Method
- Account number

## Display

- Available balance
- Minimum withdrawal
- Maximum withdrawal if configured
- Rules/fees if applicable

## Validation

- Required amount
- Valid amount
- Valid account input
- Balance constraints based on backend-provided rules

## Withdrawal History

Display:

- Amount
- Method
- Masked account
- Date
- Status
- Admin note

Example masked account:

```text
017******45
```

## Deliverables

- Withdrawal form
- Confirmation dialog
- Withdrawal history

## Exit Criteria

- Full account number is not shown in history.
- Duplicate requests are prevented at UI level.
- Backend validation errors are surfaced correctly.

---

# Phase F13 - Referral UI

## Objective

Build the referral experience.

## Route

```text
/referral
```

## Referral Dashboard

Display:

- Referral code
- Referral link
- Copy button
- Share button if appropriate
- Total referrals
- Active referrals
- Referral earnings

## Referral List

Display:

- Display name
- User ID
- Join date
- Active/inactive state
- Reward

## Deliverables

- Referral overview
- Copy/share behavior
- Referral history

## Exit Criteria

- Referral link copies correctly.
- Empty referral state looks intentional.

---

# Phase F14 - Unified History Center

## Objective

Create one clean location for user activity history.

## Route

```text
/history
```

## Tabs

- All
- Packages
- Tasks
- Deposits
- Withdrawals
- Referrals
- Wallet

## Mobile

Use:

- Card-based records
- Horizontally scrollable tabs if needed

## Desktop

Use:

- Tables where appropriate
- Filters
- Pagination

## Required Information

### Package
- Package
- Price
- Date
- Transaction ID
- Status

### Task
- Task
- Reward
- Screenshot
- Submission date
- Status
- Rejection reason

### Deposit
- Amount
- Method
- Transaction ID
- Date
- Status

### Withdrawal
- Amount
- Method
- Masked account
- Date
- Status
- Admin note

### Referral
- User
- Join date
- State
- Reward

### Wallet
- Description
- Credit/debit amount
- Date

## Deliverables

- Unified history page
- Filters
- Pagination

## Exit Criteria

- All histories render correctly.
- Sensitive values are masked.
- Empty states exist for each tab.

---

# Phase F15 - Notifications UI

## Objective

Build account notification experience.

## Route

```text
/notifications
```

## Features

- Notification list
- Read/unread state
- Mark as read
- Mark all as read
- Header badge count

## Notification Types

- Task approved
- Task rejected
- Deposit approved
- Deposit rejected
- Withdrawal approved
- Withdrawal rejected
- Package approved
- Package rejected
- Referral reward
- Admin announcement

## Deliverables

- Notification badge
- Notification page
- Read/unread states

## Exit Criteria

- Notification count is accurate.
- Unread notifications are visually distinct.

---

# Phase F16 - Profile UI

## Objective

Build user account management UI.

## Route

```text
/profile
```

## Display

- Avatar
- Name
- Email
- Phone
- User ID
- Referral code
- Package
- Account status

## Editable Fields

As allowed by backend:

- Avatar
- Name
- Phone
- Password through Supabase flow

## Deliverables

- Profile overview
- Edit profile
- Avatar upload
- Account information display

## Exit Criteria

- Sensitive immutable values are not casually editable.
- Update feedback is clear.

---

# Phase F17 - Admin Shell

## Objective

Build the admin application layout before admin modules.

## Admin Navigation

- Dashboard
- Users
- Packages
- Tasks
- Submissions
- Deposits
- Withdrawals
- Referrals
- Transactions
- Reports
- Settings

## Layout

Desktop:

- Sidebar
- Header
- Main content

Mobile/tablet:

- Drawer/sheet navigation

## Deliverables

- Admin shell
- Responsive admin navigation
- Admin page headers
- Shared admin table/card patterns

## Exit Criteria

- Admin shell is separate from user shell.
- Non-admin frontend UX is redirected appropriately.

---

# Phase F18 - Admin Dashboard

## Objective

Create the main admin overview.

## Metrics

- Total users
- Active users
- Total deposits
- Total withdrawals
- Pending submissions
- Pending deposits
- Pending withdrawals
- Package sales

## Optional Sections

- Recent transactions
- Recent registrations
- Recent review activity

## Deliverables

- Admin dashboard
- Loading and error states

## Exit Criteria

- Metrics load from backend.
- Layout is usable on tablet and desktop.

---

# Phase F19 - Admin User Management

## Objective

Build user management interface.

## Routes

```text
/admin/users
/admin/users/[id]
```

## User List

Support:

- Search
- Status filter
- Package filter
- Pagination

## User Detail

Display:

- Profile
- Package
- Wallet
- Referral info
- Histories
- Account status
- Admin notes

## Actions

Where authorized:

- Suspend
- Reactivate
- Wallet adjustment
- Add internal note

## Deliverables

- User list
- User detail page
- User actions

## Exit Criteria

- Sensitive actions require confirmation.
- Wallet adjustment requires reason.

---

# Phase F20 - Admin Package Management

## Objective

Build complete package CRUD interface.

## Features

- List packages
- Create package
- Edit package
- Activate/deactivate
- View package metrics if provided

## Form Fields

- Name
- Price
- Validity
- Task limits
- Reward limits
- Referral benefits
- Description
- Status

## Deliverables

- Package admin list
- Package form
- Confirmation flows

## Exit Criteria

- Forms validate correctly.
- Duplicate submissions are prevented.

---

# Phase F21 - Admin Task Management

## Objective

Build task creation and management interface.

## Features

- Task list
- Search/filter
- Create
- Edit
- Publish
- Disable

## Fields

- Title
- Category
- Description
- Instructions
- Reward
- Target URL
- Required package
- Screenshot requirement
- Status

## Deliverables

- Task CRUD UI
- Task form
- Status controls

## Exit Criteria

- Task form validates correctly.
- Active/inactive state is clear.

---

# Phase F22 - Admin Screenshot Review

## Objective

Build task submission review workflow.

## Route

```text
/admin/submissions
```

## Review Queue

Display:

- User
- Task
- Reward
- Submission date
- Screenshot
- Current status

## Review Detail

Admin can:

- Open screenshot
- Approve
- Reject
- Add rejection reason

## UX Rules

- Approval requires confirmation.
- Reject requires reason.
- Disable action while mutation is pending.

## Deliverables

- Review queue
- Screenshot viewer
- Approval/rejection actions

## Exit Criteria

- Repeat clicks do not trigger duplicate requests.
- Review status refreshes after action.

---

# Phase F23 - Admin Deposit Review

## Objective

Build deposit approval interface.

## Display

- User
- Amount
- Method
- Transaction ID
- Screenshot
- Request date
- Status

## Actions

- Approve
- Reject
- Add note

## Deliverables

- Deposit queue
- Deposit detail/review
- Search/filter

## Exit Criteria

- Sensitive actions require confirmation.
- Processed items visually update correctly.

---

# Phase F24 - Admin Withdrawal Review

## Objective

Build withdrawal processing interface.

## Display

- User
- Amount
- Method
- Account details according to permission
- Date
- Status

## Actions

- Approve
- Reject
- Add note

## Deliverables

- Withdrawal queue
- Review interface
- Filters

## Exit Criteria

- State changes are clearly reflected.
- Duplicate action buttons are disabled during processing.

---

# Phase F25 - Admin Referral and Transaction Views

## Objective

Provide operational visibility into referrals and wallet movements.

## Referral Admin

Display:

- Referrer
- Referred user
- Join date
- Qualification state
- Reward state

## Transaction Admin

Display:

- User
- Type
- Direction
- Amount
- Reference
- Date

Support:

- Search
- Filters
- Pagination

## Deliverables

- Referral management view
- Transaction explorer

## Exit Criteria

- Transaction data is readable and traceable.
- Filters work correctly.

---

# Phase F26 - Admin Reports

## Objective

Build report screens using backend-provided data.

## Reports

- User registrations
- Package sales
- Deposits
- Withdrawals
- Task completions
- Reward totals
- Referral performance
- Wallet volume

## Filters

- Date range
- Status
- Package
- Task category
- User where useful

## Deliverables

- Report cards
- Tables
- Filters

## Exit Criteria

- UI reflects backend totals accurately.
- Large result sets are paginated.

---

# Phase F27 - Admin Settings

## Objective

Build configurable system settings interface.

## Potential Settings

- Minimum withdrawal
- Maximum withdrawal
- Referral reward
- Payment methods
- Feature toggles
- Support information
- Maintenance mode
- Announcement

## Deliverables

- Settings form
- Grouped setting sections
- Save confirmation

## Exit Criteria

- Validation works.
- Save state gives clear feedback.

---

# Phase F28 - Global UX Hardening

## Objective

Polish every frontend flow.

## Review

Ensure all pages have:

- Loading state
- Error state
- Empty state
- Success feedback
- Disabled mutation state
- Responsive behavior

## Standardize

- Buttons
- Dialogs
- Status badges
- Forms
- Toasts
- Card spacing
- Page headers
- Mobile padding
- Desktop width

## Deliverables

- Consistency pass
- UX polish

## Exit Criteria

- No visually disconnected pages remain.
- No raw server error is shown to users.

---

# Phase F29 - Accessibility Pass

## Objective

Ensure the product is usable with keyboard and assistive technology.

## Tasks

- Check semantic headings.
- Check labels.
- Check focus states.
- Check tab order.
- Check dialogs.
- Check accessible names.
- Check color contrast.
- Ensure critical icons have labels.
- Ensure forms associate labels and inputs.

## Deliverables

- Accessibility fixes
- Keyboard navigation verification

## Exit Criteria

- Main flows can be completed by keyboard.
- Dialogs manage focus correctly.

---

# Phase F30 - Responsive QA

## Objective

Verify all major layouts across target sizes.

## Test Widths

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

## Focus Areas

- Dashboard
- Task cards
- Forms
- Bottom navigation
- Sidebars
- History cards
- Admin tables
- Dialogs
- Upload previews

## Deliverables

- Responsive bug fixes

## Exit Criteria

- No horizontal overflow on user pages.
- Admin tables degrade gracefully on smaller screens.

---

# Phase F31 - Frontend Security Review

## Objective

Ensure frontend does not expose sensitive information.

## Check

- No database password
- No Supabase service role key
- No Cloudinary secret
- No Railway private credentials
- No trusted role from local state only
- No trusted wallet calculations
- No sensitive account values in UI history
- No admin-only response data shown to users

## Deliverables

- Security cleanup

## Exit Criteria

- Browser bundle contains only safe public values.

---

# Phase F32 - Frontend Performance Optimization

## Objective

Improve loading performance and runtime behavior.

## Tasks

- Audit client components.
- Remove unnecessary `"use client"`.
- Optimize images.
- Lazy-load heavy components.
- Paginate large lists.
- Reduce unnecessary re-renders.
- Avoid duplicate API calls.
- Use route-level loading states.
- Review bundle size.
- Optimize fonts.

## Deliverables

- Performance pass

## Exit Criteria

- Dashboard feels fast on mobile.
- No obvious layout shifts.
- No unnecessary request storms.

---

# Phase F33 - Frontend Testing

## Objective

Test critical frontend behavior before production.

## Component/Unit Tests

Prioritize:

- Status badge behavior
- Amount formatting
- Account masking
- Form validation
- Query utilities
- Auth utilities

## Integration Tests

Prioritize:

- Login
- Register
- Dashboard fetch
- Task submission
- Deposit form
- Withdrawal form
- Package purchase
- Admin approval screens

## E2E Tests

Critical flows:

1. Register
2. Login
3. Dashboard
4. Package purchase
5. Task submission
6. Wallet update after backend approval
7. Deposit request
8. Withdrawal request
9. History
10. Admin review

## Deliverables

- Test coverage for core flows

## Exit Criteria

- Critical flows pass consistently.

---

# Phase F34 - Vercel Deployment Preparation

## Objective

Prepare frontend for production deployment.

## Environment Variables

Expected public variables:

```text
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Only add more public variables if safe.

## Tasks

- Configure production API URL.
- Configure Supabase redirect URLs.
- Configure metadata.
- Configure favicon/app icons.
- Configure production domain.
- Verify CORS compatibility with backend.
- Verify build.
- Verify environment separation.

## Deliverables

- Production-ready Vercel config

## Exit Criteria

- Production build succeeds.
- Frontend connects to Railway backend.
- Supabase Auth redirects correctly.

---

# Phase F35 - Production Frontend Launch Checklist

## Authentication

- Register works
- Login works
- Logout works
- Reset password works
- Protected routes behave correctly

## User Area

- Dashboard works
- Packages work
- Tasks work
- Screenshot upload works
- Wallet works
- Deposit works
- Withdraw works
- Referral works
- History works
- Notifications work
- Profile works

## Admin Area

- Admin dashboard works
- Users work
- Packages work
- Tasks work
- Submissions work
- Deposits work
- Withdrawals work
- Referrals work
- Transactions work
- Reports work
- Settings work

## UX

- Mobile tested
- Tablet tested
- Desktop tested
- Loading states checked
- Empty states checked
- Error states checked
- Forms checked
- Dialogs checked

## Security

- Secrets are not exposed
- Admin UI protection is present
- Sensitive data is masked

---

# Recommended Frontend Development Order

```text
F0  Architecture Lock
F1  Project Initialization
F2  Design System
F3  App Shell & Navigation
F4  API & Query Infrastructure
F5  Authentication
F6  User Dashboard
F7  Packages
F8  Task List & Details
F9  Screenshot Upload
F10 Wallet
F11 Deposit
F12 Withdrawal
F13 Referral
F14 History
F15 Notifications
F16 Profile
F17 Admin Shell
F18 Admin Dashboard
F19 Admin Users
F20 Admin Packages
F21 Admin Tasks
F22 Admin Submission Review
F23 Admin Deposit Review
F24 Admin Withdrawal Review
F25 Admin Referrals & Transactions
F26 Admin Reports
F27 Admin Settings
F28 UX Hardening
F29 Accessibility
F30 Responsive QA
F31 Security Review
F32 Performance
F33 Testing
F34 Vercel Deployment
F35 Launch Checklist
```

---

# AI Agent Rules for Every Frontend Phase

At the start of each phase:

1. Inspect existing frontend code.
2. Reuse existing patterns.
3. Do not rebuild unrelated modules.
4. Confirm required backend endpoints before integrating.
5. Keep temporary mocks isolated if an endpoint is not yet ready.
6. Never leave production pages permanently dependent on mock data.

At the end of each phase, report:

- What was implemented
- Routes created
- Components created
- Components updated
- Hooks created
- API modules created
- Query keys added
- Environment variables added
- Dependencies added
- Remaining TODOs
- Known issues
- Manual testing steps

---

# Frontend Definition of Done

The frontend is complete when:

- The mobile experience is polished.
- Desktop experience is professional.
- Authentication is integrated.
- Dashboard works with live API data.
- Packages work end-to-end.
- Tasks work end-to-end.
- Screenshot upload works.
- Wallet history is clear.
- Deposit and withdrawal flows work.
- Referral system UI works.
- History center works.
- Notifications work.
- Profile management works.
- Admin operations are usable.
- Loading states exist.
- Error states exist.
- Empty states exist.
- Financial actions prevent accidental repeat clicks.
- Sensitive values are protected.
- Accessibility is acceptable.
- Responsive QA is complete.
- Production build succeeds.
- Frontend deploys successfully on Vercel.

---

# Final Frontend Principle

Do not build the frontend as a collection of pages.

Build it as one coherent product.

Every feature should share the same:

- visual language
- navigation logic
- data patterns
- feedback patterns
- form behavior
- status system
- responsive philosophy

The final result should feel intentionally designed, commercially usable, and ready for future expansion.
