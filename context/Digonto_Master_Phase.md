# Digonto Platform - Master Phase Plan

## Purpose

This document defines the complete implementation roadmap for the **Digonto Platform**.

The goal is to build the entire system in controlled phases so an AI coding agent or development team can execute the project step by step without creating architectural inconsistency, unnecessary technical debt, duplicated logic, or disconnected frontend/backend/database behavior.

This plan assumes the following finalized stack:

- Frontend: Next.js + React + TypeScript
- Styling: Tailwind CSS + shadcn/ui
- Backend: Hono.js + TypeScript
- Runtime: Bun
- Database: PostgreSQL on Supabase
- ORM: Drizzle ORM
- Authentication: Supabase Auth
- File Storage: Cloudinary
- Frontend Deployment: Vercel
- Backend Deployment: Railway
- Validation: Zod
- Client Data Fetching: TanStack Query
- Client State: Zustand where truly needed

The website must be mobile-first, responsive, production-ready, secure, maintainable, and easy to extend in the future.

---

# Global Execution Rules

Before starting any implementation phase, follow these rules:

1. Do not build random features outside the current phase.
2. Do not duplicate business logic between frontend and backend.
3. Keep backend as the source of truth for sensitive operations.
4. Do not update wallet balances without ledger transactions.
5. Do not trust client-submitted role, balance, package, or reward values.
6. Validate all incoming API payloads with Zod.
7. Use database transactions for financial or multi-step state changes.
8. Use strict TypeScript.
9. Keep environment variables outside source code.
10. Use reusable modules and avoid oversized files.
11. Keep mobile-first UX as the default.
12. Keep admin and user permissions clearly separated.
13. Add loading, empty, success, and error states to user-facing flows.
14. Every phase should end with verification before the next phase begins.

---

# Phase 0 - Project Planning and Architecture Lock

## Objective

Finalize the technical structure before writing application logic.

## Tasks

- Confirm monorepo structure.
- Confirm frontend and backend responsibilities.
- Confirm database provider and ORM.
- Confirm authentication provider.
- Confirm Cloudinary storage responsibilities.
- Define naming conventions.
- Define folder conventions.
- Define API route naming.
- Define role strategy.
- Define environment variable strategy.
- Define deployment environments.
- Define development workflow.

## Recommended Monorepo Structure

```text
digonto/
|
|-- apps/
|   |-- web/
|   |   `-- Next.js frontend
|   |
|   `-- api/
|       `-- Hono.js backend
|
|-- packages/
|   |-- db/
|   |   |-- schema/
|   |   |-- migrations/
|   |   `-- client/
|   |
|   |-- shared/
|   |   |-- types/
|   |   |-- constants/
|   |   `-- utilities/
|   |
|   `-- validators/
|
|-- package.json
|-- bun.lock
|-- tsconfig.json
`-- README.md
```

## Deliverables

- Project architecture documented.
- Monorepo initialized.
- Shared configuration established.
- Environment templates prepared.
- Development scripts working.

## Exit Criteria

Do not move forward until:

- Web app boots successfully.
- API boots successfully.
- Shared packages resolve correctly.
- TypeScript has no configuration conflicts.

---

# Phase 1 - Base Project Setup

## Objective

Create the foundational development environment for all applications.

## Frontend Setup

Install and configure:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- TanStack Query
- React Hook Form
- Zod
- Zustand

Create:

- Root layout
- Global styles
- Theme tokens
- Query provider
- Toast system
- Error boundary strategy
- Route organization

## Backend Setup

Install and configure:

- Bun
- Hono
- TypeScript
- Zod
- Drizzle ORM
- Supabase server utilities
- Cloudinary SDK
- CORS
- Security middleware
- Request logging

Create:

```text
apps/api/src/
|
|-- index.ts
|-- routes/
|-- controllers/
|-- services/
|-- repositories/
|-- middleware/
|-- validators/
|-- lib/
|-- config/
|-- utils/
`-- types/
```

## Deliverables

- Frontend app running.
- Backend app running.
- Shared environment setup.
- Base configuration completed.

## Exit Criteria

- `bun dev` or equivalent scripts work.
- Frontend can call a backend health endpoint.
- No TypeScript errors.
- Linting and formatting run successfully.

---

# Phase 2 - Database Foundation

## Objective

Create the complete database structure before implementing core business logic.

## Core Tables

Create schema for:

- profiles
- roles if a dedicated role model is required
- packages
- user_packages
- tasks
- task_submissions
- wallets
- wallet_transactions
- deposits
- withdrawals
- referrals
- notifications
- audit_logs
- system_settings

Potential future-ready tables:

- promo_codes
- gift_codes
- leaderboard_snapshots
- daily_bonus_claims
- task_categories
- payment_methods

## Core Database Rules

- Use UUID primary keys where appropriate.
- Use foreign keys.
- Add unique constraints where required.
- Add timestamps consistently.
- Add indexes for frequently queried columns.
- Use enums or controlled text values for statuses.
- Use numeric/decimal-safe types for monetary values.
- Avoid floating point values for money.

## Deliverables

- Drizzle schema.
- Migrations.
- Database indexes.
- Initial seed data.
- Development database connected.

## Exit Criteria

- All migrations run successfully.
- Relations are verified.
- Seed data loads.
- No orphan relationships exist.
- Core status flows are represented correctly.

---

# Phase 3 - Supabase Authentication Integration

## Objective

Implement secure authentication while keeping authorization under backend control.

## Features

- Register
- Login
- Logout
- Forgot password
- Password reset
- Current session
- Current user
- Protected routes

## Registration Flow

```text
User Registration
        |
        v
Supabase Auth User Created
        |
        v
Application Profile Created
        |
        v
Wallet Created
        |
        v
Referral Code Generated
```

## Backend Requirements

- Verify Supabase access tokens.
- Read authenticated user ID from validated token only.
- Never accept user ID from request body for privileged operations.
- Attach authenticated user context through middleware.

## Roles

Minimum:

- USER
- ADMIN
- SUPER_ADMIN

Role must be validated server-side.

## Deliverables

- Auth middleware.
- Protected API routes.
- Frontend login/register screens.
- Session-aware frontend.
- Role-aware route protection.

## Exit Criteria

- Unauthorized requests are rejected.
- User login persists correctly.
- Admin-only routes reject normal users.
- Logout fully clears authenticated state.

---

# Phase 4 - Design System and App Shell

## Objective

Build the consistent visual foundation before implementing feature-heavy pages.

## Design Direction

Based on the provided reference:

- Deep blue primary color
- Bright green secondary/accent color
- Gold/yellow reward accent
- Soft white/light gray backgrounds
- Rounded cards
- Soft shadows
- Strong visual hierarchy
- Mobile-app-like experience
- Clean, modern, premium layout

## Core Components

Create reusable:

- AppHeader
- MobileBottomNav
- DesktopSidebar
- PageHeader
- UserProfileCard
- WalletCard
- StatCard
- FeatureGridItem
- TaskCard
- PackageCard
- StatusBadge
- EmptyState
- LoadingState
- ErrorState
- ConfirmDialog
- FormField
- SectionCard

## Responsive Strategy

Mobile first:

```text
320px+
375px+
430px+
768px+
1024px+
1280px+
```

Desktop should not simply stretch mobile cards across the screen.

## Deliverables

- Design tokens.
- Base components.
- Mobile navigation.
- Desktop navigation.
- Responsive layout system.

## Exit Criteria

- Visual system is consistent.
- No random one-off colors.
- Typography hierarchy is clear.
- Mobile layout works before desktop enhancements.

---

# Phase 5 - User Dashboard

## Objective

Build the main logged-in experience.

## Dashboard Sections

- Welcome/profile section
- Current package
- Wallet balance
- Deposit action
- Withdraw action
- Completed task count
- Total earnings
- Referral count
- Package status
- Promotional banner
- Task shortcuts
- Daily bonus
- Free task
- Job post
- Lucky spin placeholder
- Leadership/leaderboard placeholder
- Referral shortcut
- Gift code
- Content earning
- Video tasks
- Popular tasks

## Data Rules

Dashboard values must come from backend APIs.

Do not hardcode live business values.

## Deliverables

- Dashboard page.
- Responsive cards.
- Real API integration.
- Loading/skeleton states.
- Empty states.

## Exit Criteria

- Dashboard displays authenticated user data.
- Mobile layout closely follows reference.
- Desktop layout remains polished.
- No fake production values remain.

---

# Phase 6 - Package System

## Objective

Allow package creation, display, purchase requests, approval, activation, and history.

## User Features

- Browse packages
- View package details
- Start purchase
- Submit payment information
- View package history
- View current active package

## Admin Features

- Create package
- Edit package
- Enable/disable package
- Review package purchase
- Approve
- Reject

## Package Purchase Status

- PENDING
- APPROVED
- REJECTED

## Business Rules

- User package activation only happens after approved purchase.
- Approved package must record validity.
- Package changes must be traceable.
- Expired package must be treated differently from active package.

## Deliverables

- Package APIs.
- Package screens.
- Purchase workflow.
- Admin package management.
- Package history.

## Exit Criteria

- Complete package purchase lifecycle works.
- Expiry logic works.
- Duplicate/invalid approvals are prevented.

---

# Phase 7 - Task System

## Objective

Implement task publishing, availability, completion, proof submission, and review.

## Task Categories

- Facebook
- YouTube
- TikTok
- Website
- Content
- Video
- Other

## Task Fields

- title
- description
- instructions
- reward
- target URL
- category
- required package
- screenshot required
- active status
- availability rules

## User Flow

```text
Task List
   |
   v
Task Details
   |
   v
Open Target
   |
   v
Complete Task
   |
   v
Upload Screenshot
   |
   v
Submit
   |
   v
Pending Review
```

## Submission Status

- PENDING
- APPROVED
- REJECTED

## Admin Review

Admin can:

- View proof
- Approve
- Reject
- Add rejection reason
- See submission metadata

## Critical Rule

Task reward must never be credited before approved submission.

## Deliverables

- Task CRUD.
- User task feed.
- Task details page.
- Screenshot upload flow.
- Task submission API.
- Admin review interface.

## Exit Criteria

- User cannot submit the same restricted task incorrectly.
- Reward is only applied once.
- Rejected submissions show reason.
- Approved submissions create wallet ledger entry.

---

# Phase 8 - Cloudinary Screenshot and Media Pipeline

## Objective

Implement secure screenshot/media handling.

## Usage

- Task screenshots
- Payment screenshots
- Profile image
- Future uploaded media

## Rules

- Restrict allowed file types.
- Restrict file size.
- Generate organized folder paths.
- Save only required Cloudinary metadata in database.
- Do not expose secret credentials to frontend.
- Prefer signed upload flows where required.
- Support deletion/replacement strategy.

## Recommended Folder Pattern

```text
digonto/
|
|-- users/
|-- task-submissions/
|-- deposits/
`-- profiles/
```

## Deliverables

- Upload API.
- Cloudinary integration.
- Image validation.
- Preview UI.
- Storage references in database.

## Exit Criteria

- Unauthorized upload is blocked.
- Invalid file formats are rejected.
- Submitted proof displays correctly to admin.

---

# Phase 9 - Wallet and Ledger System

## Objective

Create the financial core of the platform.

## Wallet Data

- Available balance
- Pending balance if needed
- Total earned
- Total withdrawn

## Ledger Transaction Types

- TASK_REWARD
- REFERRAL_REWARD
- DEPOSIT
- WITHDRAWAL
- PACKAGE_PURCHASE
- BONUS
- ADMIN_ADJUSTMENT

## Direction

- CREDIT
- DEBIT

## Every Transaction Must Store

- user
- amount
- type
- direction
- reference type
- reference ID
- balance before
- balance after
- description
- timestamp

## Critical Rule

Never mutate wallet balance independently from the ledger.

## Transaction Safety

Use database transactions for:

- Task approval + wallet credit
- Deposit approval + wallet credit
- Withdrawal approval + wallet debit
- Package debit + purchase record
- Referral reward + wallet credit

## Deliverables

- Wallet service.
- Ledger service.
- Wallet APIs.
- Wallet history page.
- Admin adjustment workflow.

## Exit Criteria

- Ledger is internally consistent.
- Duplicate reward calls do not duplicate balance.
- Transaction references are traceable.
- Negative balance rules are enforced.

---

# Phase 10 - Deposit / Recharge System

## Objective

Allow users to submit manual payment requests and admins to review them.

## User Fields

- Amount
- Payment method
- Sender/account reference
- Transaction ID
- Screenshot
- Date/time

## Status

- PENDING
- APPROVED
- REJECTED

## Admin Actions

- Review
- Approve
- Reject
- Add note

## Critical Rules

- Transaction ID should be uniqueness-checked where appropriate.
- Deposit approval should be idempotent.
- Approval creates wallet credit transaction.

## Deliverables

- Deposit request flow.
- Deposit history.
- Admin deposit queue.
- Wallet integration.

## Exit Criteria

- Duplicate approval cannot credit twice.
- History displays correct status.
- Rejected requests display admin note where appropriate.

---

# Phase 11 - Withdrawal System

## Objective

Allow users to request withdrawals safely.

## Fields

- Amount
- Method
- Account number
- Requested date
- Status
- Admin note

## User Display

Mask account numbers in history.

Example:

```text
017******45
```

## Recommended Flow

```text
Withdrawal Request
        |
        v
Validate Balance
        |
        v
Create Pending Request
        |
        v
Reserve/Debit According to Final Business Rule
        |
        v
Admin Review
        |
        +----> Approve
        |
        `----> Reject / Refund if reserved
```

The exact balance reservation model must be finalized before implementation.

## Deliverables

- Withdrawal API.
- Withdrawal form.
- Withdrawal history.
- Admin request queue.
- Admin note support.

## Exit Criteria

- User cannot request above permitted balance.
- Duplicate processing is prevented.
- Approved/rejected state transitions are controlled.

---

# Phase 12 - Referral System

## Objective

Implement trackable referral relationships and rewards.

## Features

- Unique referral code
- Referral link
- Referral registration tracking
- Referral list
- Active/inactive state
- Referral earnings
- Total referrals

## Recommended Reward Principle

Do not reward solely on account creation unless that is a confirmed business rule.

Prefer a qualifying event such as:

- Approved package purchase
- Verified activity
- Other configurable condition

## Deliverables

- Referral code generation.
- Referral relationship creation.
- Referral dashboard.
- Referral reward engine.
- Referral history.

## Exit Criteria

- Self-referral is blocked.
- Duplicate referral relationships are blocked.
- Reward cannot be issued twice for the same qualifying event.

---

# Phase 13 - User History Center

## Objective

Provide one place where users can audit all activity.

## History Categories

- Package Purchase History
- Task History
- Deposit/Recharge History
- Withdrawal History
- Referral History
- Wallet History

## Package History

Show:

- Package name
- Price
- Purchase date/time
- Transaction ID
- Payment status

## Task History

Show:

- Task name
- Reward
- Screenshot
- Submitted date
- Status
- Rejection reason

## Deposit History

Show:

- Amount
- Payment method
- Transaction ID
- Date/time
- Status

## Withdrawal History

Show:

- Amount
- Method
- Masked account
- Date/time
- Status
- Admin note

## Referral History

Show:

- User ID
- Display name
- Join date
- Active/inactive status
- Reward

## Wallet History

Show combined balance movements.

## Deliverables

- Unified history page.
- Filters.
- Pagination.
- Status filters.
- Date filters where useful.

## Exit Criteria

- Data matches backend records.
- Pagination works.
- Sensitive values are masked.

---

# Phase 14 - Admin Panel

## Objective

Build the full operational control center.

## Main Admin Navigation

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

## Admin Dashboard Metrics

- Total users
- Active users
- Total deposits
- Total withdrawals
- Pending task reviews
- Pending deposits
- Pending withdrawals
- Package sales
- Daily activity
- Transaction summary

## User Management

Admin can:

- View user
- View package
- View wallet
- View history
- Suspend user
- Reactivate user
- Add internal note
- Adjust wallet with reason

## Critical Rule

All sensitive admin actions should create audit logs.

## Deliverables

- Admin shell.
- Permission middleware.
- User management.
- Package management.
- Task management.
- Review queues.
- Reports.
- Settings.

## Exit Criteria

- Non-admin cannot access admin functionality.
- Sensitive actions are logged.
- Admin approval flows are protected against repeat processing.

---

# Phase 15 - Notifications

## Objective

Keep users informed about important account activity.

## Notification Events

- Task approved
- Task rejected
- Deposit approved
- Deposit rejected
- Withdrawal approved
- Withdrawal rejected
- Package approved
- Package rejected
- Referral reward received
- Admin announcement

## Deliverables

- Notification table.
- Notification API.
- Header badge.
- Notification list.
- Read/unread state.

## Exit Criteria

- Notification counts are correct.
- Important actions create notification records.

---

# Phase 16 - Reports and Analytics

## Objective

Provide operational insight without overengineering.

## Initial Reports

- User registrations
- Package sales
- Deposits
- Withdrawals
- Task completions
- Reward totals
- Referral performance
- Wallet transaction volume

## Filters

- Date range
- Status
- User
- Package
- Task type

## Deliverables

- Admin report endpoints.
- Summary cards.
- Tables.
- Export-ready architecture.

## Exit Criteria

- Report totals match raw database values.
- Queries are indexed and performant enough for expected scale.

---

# Phase 17 - System Settings

## Objective

Move business configuration out of hardcoded source files.

## Potential Settings

- Minimum withdrawal amount
- Maximum withdrawal amount
- Referral reward amount
- Daily bonus rules
- Supported payment methods
- Maintenance mode
- Feature toggles
- Support information
- Platform announcement

## Deliverables

- Settings table.
- Admin settings page.
- Backend settings service.
- Safe defaults.

## Exit Criteria

- Configurable business values no longer require redeploy where avoidable.

---

# Phase 18 - Security Hardening

## Objective

Prepare the application for production use.

## Required Controls

- Authentication validation
- Authorization
- Admin role protection
- Zod payload validation
- Rate limiting
- CORS configuration
- Security headers
- Secure environment variables
- Input sanitization where required
- File upload validation
- Idempotent financial endpoints
- Audit logs
- Database constraints
- Error response normalization
- Sensitive log protection

## Financial Endpoint Rules

Approval endpoints must be protected against:

- Double submission
- Double approval
- Race conditions
- Duplicate ledger entries
- Invalid state transitions

## Exit Criteria

- Security checklist completed.
- No secrets in frontend bundle.
- Critical mutation endpoints tested against duplicate requests.

---

# Phase 19 - Testing

## Objective

Verify critical product behavior before deployment.

## Unit Tests

Prioritize:

- Wallet calculations
- Referral reward logic
- Package expiry logic
- Masking utilities
- Status transition validation

## Integration Tests

Prioritize:

- Registration flow
- Task approval
- Deposit approval
- Withdrawal flow
- Package purchase approval
- Referral reward issuance

## End-to-End Tests

Critical user journeys:

1. Register and login
2. View dashboard
3. Purchase package
4. Submit task proof
5. Admin approves task
6. User receives reward
7. Deposit request
8. Withdrawal request
9. View history

## Exit Criteria

- Critical flows pass.
- Financial flows pass repeated-request testing.
- Major mobile layouts pass responsive testing.

---

# Phase 20 - Performance and UX Optimization

## Objective

Make the product feel polished and production-grade.

## Frontend Optimization

- Reduce unnecessary client components.
- Use server rendering where appropriate.
- Optimize images.
- Lazy-load heavy features.
- Add skeleton loading.
- Avoid layout shifts.
- Add useful empty states.
- Prevent duplicate button submissions.

## Backend Optimization

- Add indexes.
- Paginate large result sets.
- Avoid N+1 queries.
- Use controlled select fields.
- Cache only where safe and useful.

## UX Review

Verify:

- Navigation consistency
- Button hierarchy
- Form feedback
- Mobile touch targets
- Readable Bangla/English text
- Responsive tables
- Dialog behavior
- Confirmation flows

## Exit Criteria

- No obviously slow main screens.
- Mobile experience feels app-like.
- Repeated actions provide immediate feedback.

---

# Phase 21 - Deployment Preparation

## Objective

Prepare production environments.

## Vercel

Deploy:

- Next.js frontend

Configure:

- Frontend environment variables
- Backend API URL
- Supabase public keys
- Production domain

## Railway

Deploy:

- Hono.js backend
- Bun runtime

Configure:

- Supabase connection
- Supabase server credentials where required
- Cloudinary credentials
- CORS
- production environment
- logging

## Supabase

Configure:

- PostgreSQL database
- Supabase Auth
- Production redirect URLs
- Auth settings
- Secure connection configuration

## Cloudinary

Configure:

- Production cloud
- Upload rules
- Folder organization
- Allowed formats
- transformation strategy if needed

## Exit Criteria

- Production frontend connects to production backend.
- Production auth works.
- Production database migrations are complete.
- Uploads work.
- CORS works.
- No development secrets are used.

---

# Phase 22 - Production Launch Checklist

## Functional

- Register works
- Login works
- Logout works
- Password recovery works
- Dashboard loads
- Package purchase works
- Task submit works
- Screenshot upload works
- Admin review works
- Wallet reward works
- Deposit works
- Withdrawal works
- Referral works
- History works
- Notifications work
- Admin dashboard works

## Security

- Admin routes protected
- Financial routes protected
- Validation enabled
- Secrets secured
- Logs checked
- Rate limits active
- Duplicate processing blocked

## UI

- Mobile tested
- Tablet tested
- Desktop tested
- Empty states checked
- Error states checked
- Loading states checked

## Infrastructure

- Vercel production healthy
- Railway production healthy
- Supabase healthy
- Cloudinary healthy
- Environment variables verified

---

# Phase 23 - Post-Launch Monitoring

## Objective

Monitor the platform after deployment and fix real-world issues safely.

## Monitor

- API errors
- Authentication failures
- Failed uploads
- Failed financial actions
- Slow database queries
- Rejected user flows
- Admin processing issues

## Recommended Future Infrastructure

As the product grows, consider:

- Sentry
- Better structured logging
- Uptime monitoring
- Queue/background jobs
- Redis
- Email provider
- SMS provider
- Advanced analytics

Do not add these prematurely unless the project needs them.

---

# Phase 24 - Future Expansion Readiness

The architecture should support future features without rewrite.

Potential future additions:

- Mobile application
- PWA
- Advanced leaderboard
- Lucky spin
- Gift codes
- Promo codes
- Real-time notifications
- Email notifications
- SMS notifications
- Automated reports
- Advanced referral levels
- Package upgrade flow
- Multiple currencies
- Multiple languages
- Additional payment providers
- Moderation tools
- Customer support module
- API integrations

The current web-first architecture should remain the source of truth and future clients should consume the same backend API.

---

# Recommended Development Order

Execute the project in this exact high-level order:

```text
Phase 0
Architecture Lock

Phase 1
Base Project Setup

Phase 2
Database Foundation

Phase 3
Authentication

Phase 4
Design System

Phase 5
User Dashboard

Phase 6
Packages

Phase 7
Tasks

Phase 8
Cloudinary Upload System

Phase 9
Wallet and Ledger

Phase 10
Deposits

Phase 11
Withdrawals

Phase 12
Referrals

Phase 13
User History

Phase 14
Admin Panel

Phase 15
Notifications

Phase 16
Reports

Phase 17
System Settings

Phase 18
Security

Phase 19
Testing

Phase 20
Performance and UX

Phase 21
Deployment

Phase 22
Launch Checklist

Phase 23
Monitoring

Phase 24
Future Expansion
```

---

# AI Agent Execution Instructions

When this file is given to an AI coding agent, the agent must follow these rules:

1. Read the full Master Context before this Master Phase document.
2. Work only on the requested phase.
3. Do not skip foundational work.
4. Do not rebuild working architecture unnecessarily.
5. Reuse existing modules when possible.
6. Explain any architectural deviation before implementing it.
7. Never expose private credentials.
8. Never place trusted financial logic only on the frontend.
9. Never create duplicate wallet/reward logic.
10. Keep TypeScript strict and avoid `any` unless unavoidable and documented.
11. Use clear naming.
12. Keep code modular.
13. Keep UI mobile-first.
14. Ensure each phase is testable before proceeding.
15. At the end of each phase, provide:
   - What was implemented
   - Files created
   - Files changed
   - Environment variables added
   - Database changes
   - APIs added
   - Remaining TODOs
   - Testing instructions

---

# Definition of Done

The project is considered complete when:

- User authentication is secure.
- Mobile-first dashboard is polished.
- Packages work end-to-end.
- Tasks work end-to-end.
- Screenshot review works.
- Wallet uses a traceable ledger.
- Deposits work.
- Withdrawals work.
- Referrals work.
- All histories are available.
- Admin panel manages the full platform.
- Sensitive actions are audited.
- Critical actions are protected against duplicate execution.
- The application is responsive.
- Frontend is deployed on Vercel.
- Backend is deployed on Railway.
- PostgreSQL is running on Supabase.
- Supabase Auth is operational.
- Cloudinary storage is operational.
- The codebase is maintainable and future-ready.

---

# Final Principle

Do not optimize the project for the fastest possible prototype.

Optimize it for:

- correctness
- maintainability
- security
- future expansion
- professional user experience
- consistent architecture

Every major implementation decision should support those goals.
