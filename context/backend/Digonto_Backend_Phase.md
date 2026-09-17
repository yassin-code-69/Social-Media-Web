# Digonto Platform - Backend Phase Plan

## Purpose

This document defines the complete backend implementation roadmap for the **Digonto Platform**.

Use this file together with:

- `Digonto_Master_Context.md`
- `Digonto_Master_Phase.md`
- `Digonto_Backend_Context.md`

The goal is to build the backend in controlled phases so an AI coding agent can implement the system step by step without creating security gaps, duplicated financial logic, inconsistent API behavior, or architecture that becomes difficult to maintain later.

The backend stack is locked as:

- Bun
- Hono.js
- TypeScript
- REST API
- Zod
- Drizzle ORM
- PostgreSQL on Supabase
- Supabase Auth
- Cloudinary
- Railway

The backend must be:

- Secure
- Transaction-safe
- Strictly typed
- Modular
- Auditable
- Idempotent for critical operations
- Reusable by future clients
- Production-ready
- Easy to extend

---

# Global Backend Execution Rules

Before working on any backend phase:

1. Read `Digonto_Master_Context.md`.
2. Read `Digonto_Master_Phase.md`.
3. Read `Digonto_Backend_Context.md`.
4. Inspect the existing codebase before modifying anything.
5. Work only on the requested phase.
6. Do not bypass the service layer for business-critical logic.
7. Do not trust client-provided user IDs, roles, balances, prices, rewards, or approval states.
8. Validate every external input with Zod.
9. Use strict TypeScript.
10. Use Drizzle ORM for database access.
11. Use transactions for multi-step financial operations.
12. Make approval endpoints idempotent.
13. Use stable API error codes.
14. Never return raw database errors.
15. Never expose secrets.
16. Keep audit logging for sensitive admin and financial actions.
17. Keep notification creation centralized.
18. Use pagination for large lists.
19. Respect current business rules and avoid inventing new ones.
20. Complete validation and testing before moving to the next phase.

---

# Phase B0 - Backend Architecture Lock

## Objective

Finalize backend structure and conventions before writing feature logic.

## Tasks

Confirm:

- Hono application structure
- API versioning
- module boundaries
- service/repository separation
- middleware strategy
- error response shape
- success response shape
- auth context typing
- logging convention
- environment variable names
- database package structure
- deployment command
- API documentation strategy

## Recommended Structure

```text
apps/api/
|
|-- src/
|   |-- app.ts
|   |-- index.ts
|   |
|   |-- config/
|   |-- lib/
|   |-- middleware/
|   |-- modules/
|   |-- shared/
|   `-- types/
|
|-- tests/
|-- package.json
|-- tsconfig.json
`-- railway.json
```

## Deliverables

- Final module map
- Final route prefix
- Error contract
- Response contract
- Auth context contract
- Environment template

## Exit Criteria

- No architecture ambiguity remains.
- All modules have clear ownership.
- API conventions are documented.

---

# Phase B1 - Backend Project Initialization

## Objective

Create the Hono backend foundation.

## Tasks

Install/configure:

- Bun
- Hono
- TypeScript
- Zod
- Drizzle ORM
- PostgreSQL driver
- Supabase SDK
- Cloudinary SDK

Create:

- `app.ts`
- `index.ts`
- environment loader
- base config
- centralized logger
- base error handler
- base success response helper
- request ID middleware
- health route

## Initial Route

```text
GET /api/v1/health
```

Expected response:

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

## Deliverables

- Running Hono API
- Versioned route prefix
- Health endpoint
- Environment validation

## Exit Criteria

- API boots with Bun.
- Health endpoint works.
- Missing required env variables fail fast in production mode.

---

# Phase B2 - Environment and Configuration Layer

## Objective

Centralize configuration safely.

## Tasks

Create:

- `config/env.ts`
- `config/constants.ts`
- CORS configuration
- app environment detection
- safe startup validation

## Expected Environment Variables

```text
NODE_ENV=
PORT=

DATABASE_URL=

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

FRONTEND_URL=

LOG_LEVEL=
```

Only keep variables actually required.

## Rules

- Use Zod to validate environment.
- Never log secret values.
- Do not expose backend env values through APIs.

## Deliverables

- Typed environment config
- `.env.example`

## Exit Criteria

- Startup fails clearly for missing critical variables.
- No module accesses raw `process.env` everywhere.

---

# Phase B3 - Database Connection and Drizzle Foundation

## Objective

Connect the backend cleanly to Supabase PostgreSQL.

## Tasks

Create:

- shared database client
- Drizzle initialization
- connection handling
- test query
- migration workflow
- database error mapping helper

## Rules

- Do not create a new DB connection per request.
- Use the shared DB package/client.
- Respect Supabase connection recommendations.
- Configure SSL where required.

## Deliverables

- Working database connection
- Drizzle client
- migration command
- database health verification

## Exit Criteria

- API can query the database.
- Connection handling works in Railway-like environment.
- Database errors are not leaked to clients.

---

# Phase B4 - Shared Error and Response Architecture

## Objective

Create consistent API behavior before feature development.

## Create Error Types

Examples:

- `ValidationError`
- `UnauthorizedError`
- `ForbiddenError`
- `NotFoundError`
- `ConflictError`
- `BusinessRuleError`
- `RateLimitError`

## Create Stable Error Codes

Examples:

```text
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
USER_NOT_FOUND
TASK_NOT_FOUND
PACKAGE_NOT_FOUND
INSUFFICIENT_BALANCE
DUPLICATE_TRANSACTION_ID
TASK_ALREADY_SUBMITTED
WITHDRAWAL_ALREADY_PROCESSED
```

## Success Response

Standardize:

```json
{
  "success": true,
  "data": {},
  "meta": null
}
```

## Error Response

Standardize:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Safe message",
    "details": null
  }
}
```

## Deliverables

- App error classes
- Error middleware
- Response helpers

## Exit Criteria

- Routes use consistent error responses.
- Stack traces are hidden in production.

---

# Phase B5 - Request Logging and Request IDs

## Objective

Create production-friendly request tracing.

## Tasks

Add:

- request ID middleware
- structured request logs
- response timing
- normalized error logs

## Log Fields

Potential fields:

- requestId
- method
- route
- status
- duration
- authenticated user ID when safe
- error code

## Never Log

- access tokens
- passwords
- service-role key
- Cloudinary secret
- full withdrawal account number

## Deliverables

- Request logger
- Request ID propagation

## Exit Criteria

- Every request is traceable.
- Sensitive data is excluded.

---

# Phase B6 - Supabase Auth Verification

## Objective

Implement trusted authentication at API level.

## Request Flow

```text
Authorization: Bearer <Supabase Access Token>
            |
            v
Verify Token
            |
            v
Resolve Supabase User
            |
            v
Resolve Application Profile
            |
            v
Attach Auth Context
```

## Create Middleware

Recommended:

```text
requireAuth
optionalAuth
```

## Auth Context

Conceptually:

```ts
type AuthContext = {
  authUserId: string
  userId: string
  role: "USER" | "ADMIN" | "SUPER_ADMIN"
  status: "ACTIVE" | "SUSPENDED" | "BLOCKED"
}
```

## Rules

- Never trust an unverified JWT payload.
- Never take authenticated user ID from request body.
- Respect suspended/blocked user rules.

## Deliverables

- Supabase integration
- Auth middleware
- typed user context

## Exit Criteria

- Valid token succeeds.
- Invalid/expired token is rejected.
- Protected route works.

---

# Phase B7 - Role and Permission Middleware

## Objective

Secure admin routes and future role-based behavior.

## Create Helpers

Examples:

```text
requireRole("ADMIN")
requireAnyRole(["ADMIN", "SUPER_ADMIN"])
```

## Rules

- Backend role is authoritative.
- Frontend role is UX only.
- Resource-level permission checks still belong in services.

## Deliverables

- Role middleware
- permission helpers

## Exit Criteria

- USER cannot access ADMIN route.
- SUPER_ADMIN access rules work as designed.

---

# Phase B8 - User Profile Bootstrap

## Objective

Create platform records after Supabase Auth registration.

## Required Bootstrap Flow

```text
Supabase Auth User
       |
       v
Create/Resolve Profile
       |
       v
Create Wallet
       |
       v
Generate Referral Code
       |
       v
Resolve Optional Referrer
```

## Requirements

The operation must be idempotent.

Do not create duplicate:

- profile
- wallet
- referral code
- referral relationship

## Possible Endpoint

```text
POST /api/v1/auth/bootstrap
```

or another finalized mechanism.

## Deliverables

- Bootstrap service
- profile creation
- wallet creation
- referral initialization

## Exit Criteria

- Retrying bootstrap is safe.
- Auth user maps to exactly one application profile.

---

# Phase B9 - Current User API

## Objective

Expose authenticated user data needed by the frontend.

## Routes

```text
GET   /api/v1/me
PATCH /api/v1/me
```

## Return Only Needed Data

Potential fields:

- id
- displayName
- email
- phone
- avatar
- role
- status
- referralCode
- currentPackage summary

## Deliverables

- User service
- user repository
- validation
- routes

## Exit Criteria

- User can only update allowed profile fields.
- Sensitive internal fields are not exposed.

---

# Phase B10 - Audit Log Foundation

## Objective

Create a reusable internal audit system before admin actions are built.

## Create Audit Service

Conceptual method:

```text
recordAuditEvent(...)
```

## Track

- actor
- action
- entity type
- entity ID
- reason
- previous state where useful
- new state where useful
- request ID
- timestamp

## Deliverables

- Audit service
- audit repository
- standard action names

## Exit Criteria

- Any module can create audit events consistently.

---

# Phase B11 - Notification Service Foundation

## Objective

Create centralized in-app notification logic.

## Create Notification Service

Conceptual methods:

```text
createNotification
markAsRead
markAllAsRead
listNotifications
```

## Notification Types

- TASK_APPROVED
- TASK_REJECTED
- DEPOSIT_APPROVED
- DEPOSIT_REJECTED
- WITHDRAWAL_APPROVED
- WITHDRAWAL_REJECTED
- PACKAGE_APPROVED
- PACKAGE_REJECTED
- REFERRAL_REWARD
- ADMIN_ANNOUNCEMENT

## Deliverables

- Notification service
- notification repository
- base routes

## Exit Criteria

- Notification creation works.
- Read/unread state works.

---

# Phase B12 - Settings Service Foundation

## Objective

Centralize changing business configuration.

## Potential Settings

- minimum withdrawal
- maximum withdrawal
- referral reward
- supported payment methods
- maintenance mode
- feature toggles
- support information

## Create Typed Accessors

Examples:

```text
getWithdrawalRules
getReferralRules
getPaymentMethods
getFeatureFlags
```

## Deliverables

- Settings service
- settings repository
- admin-ready settings model

## Exit Criteria

- Business modules can read settings without raw settings queries everywhere.

---

# Phase B13 - Package Read APIs

## Objective

Implement safe package browsing.

## Routes

```text
GET /api/v1/packages
GET /api/v1/packages/:id
```

## Return

- name
- price
- validity
- task limit
- benefits
- active state
- description

## Rules

- Only active packages shown to users unless explicitly requested otherwise.
- Price comes from database.

## Deliverables

- Package repository
- package service
- read routes

## Exit Criteria

- Package list/detail work.
- Inactive packages are handled correctly.

---

# Phase B14 - Admin Package Management

## Objective

Implement package CRUD for admins.

## Routes

Potential:

```text
POST   /api/v1/admin/packages
PATCH  /api/v1/admin/packages/:id
POST   /api/v1/admin/packages/:id/activate
POST   /api/v1/admin/packages/:id/deactivate
```

## Requirements

- Admin role required.
- Zod validation.
- Audit log.
- Stable state rules.

## Deliverables

- Admin package service
- package validators
- audit integration

## Exit Criteria

- USER cannot mutate packages.
- Package changes are audited.

---

# Phase B15 - Package Purchase Request

## Objective

Create user package purchase workflow.

## User Inputs

Only accept necessary external values such as:

- package ID
- payment method
- transaction ID
- payment screenshot metadata if required

Do not accept trusted price.

## Backend Flow

```text
Load Package
   |
   v
Validate Package Active
   |
   v
Read Authoritative Price
   |
   v
Validate Purchase Data
   |
   v
Create PENDING Purchase
```

## Route

```text
POST /api/v1/packages/:id/purchase
```

## Deliverables

- Package purchase service
- duplicate transaction checks
- purchase history endpoint

## Exit Criteria

- Price cannot be manipulated from frontend.
- Purchase starts as PENDING.

---

# Phase B16 - Admin Package Purchase Review

## Objective

Approve or reject package purchases safely.

## Routes

```text
POST /api/v1/admin/package-purchases/:id/approve
POST /api/v1/admin/package-purchases/:id/reject
```

## Approval Flow

```text
Load Purchase
      |
      v
Ensure PENDING
      |
      v
Activate User Package
      |
      v
Set Start/Expiry
      |
      v
Mark Purchase APPROVED
      |
      v
Notification
      |
      v
Audit
```

Use transaction if multiple database changes occur.

## Rejection

Require reason where business rule requires it.

## Deliverables

- Review service
- state validation
- notifications
- audit logs

## Exit Criteria

- Repeat approval does not duplicate activation.
- Invalid transitions are blocked.

---

# Phase B17 - Task Read APIs

## Objective

Expose user task feeds and task details.

## Routes

```text
GET /api/v1/tasks
GET /api/v1/tasks/:id
```

## Backend Responsibilities

Determine:

- active task state
- package eligibility
- task availability
- existing submission state
- daily limits if implemented

## Query Support

Potential filters:

```text
category
status
page
limit
```

## Deliverables

- Task repository
- task service
- read routes

## Exit Criteria

- User receives accurate eligibility.
- Inactive tasks are hidden or marked appropriately.

---

# Phase B18 - Admin Task Management

## Objective

Implement task CRUD.

## Routes

Potential:

```text
POST   /api/v1/admin/tasks
PATCH  /api/v1/admin/tasks/:id
POST   /api/v1/admin/tasks/:id/activate
POST   /api/v1/admin/tasks/:id/deactivate
```

## Authoritative Fields

Backend controls:

- reward
- category
- package requirement
- status
- task limits

## Deliverables

- Task admin service
- validators
- audit logs

## Exit Criteria

- Task CRUD works.
- Reward cannot be changed by users.

---

# Phase B19 - Cloudinary Upload Security

## Objective

Create secure upload support before task/deposit submissions use it.

## Decide Upload Pattern

Recommended options:

- Backend-generated signed upload
- Backend-controlled upload proxy

Prefer a secure approach that does not expose Cloudinary secret.

## Routes

Possible:

```text
POST /api/v1/uploads/sign
POST /api/v1/uploads/delete
```

Only create deletion route if required.

## Validate

- auth
- upload purpose
- file type
- file size
- folder scope

## Supported Purposes

- task submission
- deposit proof
- profile image

## Deliverables

- Cloudinary client
- upload service
- signature endpoint
- validation rules

## Exit Criteria

- Secret stays backend-only.
- Invalid file purpose is rejected.
- Upload metadata is controlled.

---

# Phase B20 - Task Submission

## Objective

Allow users to submit proof for tasks.

## Route

```text
POST /api/v1/tasks/:id/submissions
```

## User Inputs

Only accept:

- screenshot reference
- optional user note if supported

Do not accept reward.

## Backend Flow

```text
Authenticate
   |
   v
Load Task
   |
   v
Validate User Status
   |
   v
Validate Task Active
   |
   v
Validate Package Eligibility
   |
   v
Validate Daily Limits
   |
   v
Check Duplicate Submission
   |
   v
Create PENDING Submission
```

## Deliverables

- Submission service
- duplicate prevention
- validation
- user task history integration

## Exit Criteria

- Duplicate rule works.
- Reward remains backend-authoritative.
- Submission starts PENDING.

---

# Phase B21 - Admin Task Submission Review

## Objective

Approve/reject task proof safely.

## Routes

```text
GET  /api/v1/admin/submissions
GET  /api/v1/admin/submissions/:id

POST /api/v1/admin/submissions/:id/approve
POST /api/v1/admin/submissions/:id/reject
```

## Approval Must

- Ensure PENDING
- Load task reward
- Credit wallet
- Create ledger transaction
- Mark submission APPROVED
- Create notification
- Create audit log

All financial changes must be atomic.

## Rejection Must

- Ensure PENDING
- require rejection reason
- mark REJECTED
- notify user
- audit action

## Exit Criteria

- Approval cannot reward twice.
- Rejection reason is stored.
- Concurrent approvals are safe.

---

# Phase B22 - Wallet Service Core

## Objective

Build the financial source of truth.

## Create Wallet Service

Conceptual methods:

```text
getWallet
credit
debit
reserve
release
adjust
getTransactions
```

Only implement methods needed by finalized balance model.

## Rules

Every balance mutation must create ledger entry.

Every ledger entry must include:

- user
- type
- direction
- amount
- reference
- description
- balance before
- balance after

## Deliverables

- Wallet service
- wallet repository
- transaction repository
- amount validation helpers

## Exit Criteria

- Direct balance mutations outside wallet service are prohibited.
- Ledger always matches mutations.

---

# Phase B23 - Wallet Read APIs

## Objective

Expose wallet data safely to the user.

## Routes

```text
GET /api/v1/wallet
GET /api/v1/wallet/transactions
```

## Pagination

Support:

```text
page
limit
type
dateFrom
dateTo
```

## Deliverables

- Wallet summary endpoint
- wallet history endpoint

## Exit Criteria

- User only sees own wallet.
- Large transaction history is paginated.

---

# Phase B24 - Admin Wallet Adjustment

## Objective

Allow controlled manual adjustments.

## Route

Potential:

```text
POST /api/v1/admin/users/:id/wallet-adjustments
```

## Required Input

- direction
- amount
- reason

## Operation Must

- validate admin permission
- use wallet service
- prevent invalid negative balance
- create ledger entry
- create audit log
- optionally notify user

## Exit Criteria

- No silent balance editing.
- Every adjustment is traceable.

---

# Phase B25 - Deposit Request API

## Objective

Allow users to create manual deposit requests.

## Route

```text
POST /api/v1/deposits
GET  /api/v1/deposits
```

## Validate

- amount > 0
- payment method allowed
- transaction ID format
- duplicate transaction ID
- proof screenshot if required

## Create

Status:

```text
PENDING
```

## Deliverables

- Deposit service
- deposit repository
- user history API

## Exit Criteria

- Duplicate transaction IDs are prevented.
- User only sees own deposits.

---

# Phase B26 - Admin Deposit Review

## Objective

Safely approve or reject deposits.

## Routes

```text
GET  /api/v1/admin/deposits
GET  /api/v1/admin/deposits/:id

POST /api/v1/admin/deposits/:id/approve
POST /api/v1/admin/deposits/:id/reject
```

## Approval Transaction

```text
Ensure PENDING
      |
      v
Credit Wallet
      |
      v
Create Ledger
      |
      v
Mark APPROVED
      |
      v
Notification
      |
      v
Audit
```

## Exit Criteria

- Repeat approval cannot credit twice.
- Concurrent approval is safe.
- Rejected deposit never credits wallet.

---

# Phase B27 - Withdrawal Rule Engine

## Objective

Finalize and centralize withdrawal business rules.

## Read Settings

- minimum amount
- maximum amount
- supported methods
- fee if introduced
- daily limits if introduced

## Create Validation Service

Conceptual:

```text
validateWithdrawalRequest
calculateWithdrawalAmount
```

## Recommended Balance Model

Reserve funds at request time.

```text
Available Balance
      |
      v
Request Withdrawal
      |
      v
Reserve Funds
      |
      v
Pending Review
```

## Deliverables

- Withdrawal rule service
- clear balance reservation model

## Exit Criteria

- One withdrawal model is chosen and documented.
- No ambiguous balance behavior remains.

---

# Phase B28 - Withdrawal Request API

## Objective

Create secure withdrawal requests.

## Routes

```text
POST /api/v1/withdrawals
GET  /api/v1/withdrawals
```

## Validate

- authenticated account status
- amount
- available balance
- min/max rules
- method
- account destination
- daily rules if any

## Operation

Use transaction if funds are reserved.

## Deliverables

- Withdrawal service
- withdrawal repository
- masked history serializer

## Exit Criteria

- User cannot request above available funds.
- Pending withdrawals do not leave funds incorrectly spendable.

---

# Phase B29 - Admin Withdrawal Review

## Objective

Process withdrawals safely.

## Routes

```text
GET  /api/v1/admin/withdrawals
GET  /api/v1/admin/withdrawals/:id

POST /api/v1/admin/withdrawals/:id/approve
POST /api/v1/admin/withdrawals/:id/reject
```

## Approve

Depending on finalized reservation model:

- finalize reserved debit
- mark APPROVED
- notify user
- audit action

## Reject

- release reserved funds
- mark REJECTED
- store admin note
- notify user
- audit action

## Exit Criteria

- Duplicate processing is blocked.
- Rejected requests correctly release funds.
- Negative balances cannot occur.

---

# Phase B30 - Referral Relationship System

## Objective

Track referrals securely.

## Responsibilities

- generate unique referral code
- resolve referral code
- prevent self-referral
- prevent duplicate relationship
- track referrer/referred user
- track qualification

## Routes

```text
GET /api/v1/referrals
```

Registration bootstrap may create the relationship.

## Deliverables

- Referral service
- referral repository
- referral history API

## Exit Criteria

- Self-referral blocked.
- One referred user cannot be linked multiple times.

---

# Phase B31 - Referral Reward Engine

## Objective

Issue referral rewards only once after qualification.

## Recommended Trigger

A confirmed qualifying event such as:

- approved package purchase

unless business rules later specify another event.

## Flow

```text
Qualifying Event
      |
      v
Find Referral Relationship
      |
      v
Check Not Rewarded
      |
      v
Read Reward Setting
      |
      v
Credit Referrer Wallet
      |
      v
Create Ledger
      |
      v
Mark Reward Issued
      |
      v
Notification
```

Use a transaction.

## Deliverables

- Reward qualification logic
- idempotency protection

## Exit Criteria

- Reward cannot be issued twice.
- Amount comes from backend settings.

---

# Phase B32 - Unified User History APIs

## Objective

Expose all required user histories cleanly.

## Required Histories

- package purchases
- tasks
- deposits
- withdrawals
- referrals
- wallet transactions

## Route Strategy

Possible:

```text
GET /api/v1/history/packages
GET /api/v1/history/tasks
GET /api/v1/history/deposits
GET /api/v1/history/withdrawals
GET /api/v1/history/referrals
GET /api/v1/history/wallet
```

or leverage module-specific history routes consistently.

## Requirements

- pagination
- filtering
- safe data masking
- user ownership

## Exit Criteria

- All history requirements are available to frontend.
- Sensitive withdrawal data is masked where appropriate.

---

# Phase B33 - User Notifications API

## Objective

Finish user notification APIs.

## Routes

```text
GET  /api/v1/notifications
POST /api/v1/notifications/:id/read
POST /api/v1/notifications/read-all
```

## Requirements

- pagination
- unread count
- ownership validation

## Exit Criteria

- User cannot mark another user's notification.
- Unread count is accurate.

---

# Phase B34 - Admin User Management

## Objective

Provide secure user management APIs.

## Routes

Potential:

```text
GET  /api/v1/admin/users
GET  /api/v1/admin/users/:id

POST /api/v1/admin/users/:id/suspend
POST /api/v1/admin/users/:id/reactivate
POST /api/v1/admin/users/:id/block
```

## Requirements

- role authorization
- search
- pagination
- filters
- audit logs
- state validation

## Exit Criteria

- Sensitive actions are audited.
- Normal USER cannot use admin user endpoints.

---

# Phase B35 - Admin Referral and Transaction APIs

## Objective

Provide operational visibility.

## Routes

Potential:

```text
GET /api/v1/admin/referrals
GET /api/v1/admin/transactions
```

## Filters

- user
- type
- status
- date range
- direction

## Requirements

- pagination
- limited selected columns
- safe exposure

## Exit Criteria

- Admin can trace financial activity.
- Queries remain performant.

---

# Phase B36 - Admin Dashboard Metrics

## Objective

Provide backend aggregates for admin dashboard.

## Metrics

- total users
- active users
- total approved deposits
- total approved withdrawals
- pending task submissions
- pending deposits
- pending withdrawals
- package sales

## Route

```text
GET /api/v1/admin/dashboard
```

## Rule

Compute aggregates in backend/database.

Do not send thousands of raw rows for frontend aggregation.

## Exit Criteria

- Metrics are accurate.
- Queries are reasonably optimized.

---

# Phase B37 - Reports API

## Objective

Create filtered backend reports.

## Report Types

- user registrations
- package sales
- deposits
- withdrawals
- task submissions
- task rewards
- referral rewards
- wallet movement

## Filters

- dateFrom
- dateTo
- status
- packageId
- category
- userId

## Routes

Potential:

```text
GET /api/v1/admin/reports/users
GET /api/v1/admin/reports/packages
GET /api/v1/admin/reports/deposits
GET /api/v1/admin/reports/withdrawals
GET /api/v1/admin/reports/tasks
GET /api/v1/admin/reports/referrals
```

## Exit Criteria

- Totals match underlying data.
- Large data remains paginated or aggregated.

---

# Phase B38 - Admin Settings API

## Objective

Allow authorized configuration changes.

## Routes

Potential:

```text
GET   /api/v1/admin/settings
PATCH /api/v1/admin/settings
```

## Requirements

- strict validation
- audit logging
- typed settings
- safe defaults

## Exit Criteria

- Business rules update without code changes where intended.
- Unauthorized roles cannot modify settings.

---

# Phase B39 - Search, Pagination, and Filter Standardization

## Objective

Standardize list behavior across backend modules.

## Standard Query Parameters

```text
page
limit
search
status
sort
dateFrom
dateTo
```

Use only supported parameters for each route.

## Rules

- Default limit
- Maximum limit
- validated sort fields
- no arbitrary SQL field injection

## Deliverables

- Shared pagination schema
- pagination metadata helpers
- common filter helpers

## Exit Criteria

- List APIs behave consistently.

---

# Phase B40 - Rate Limiting

## Objective

Protect sensitive mutations and abuse-prone endpoints.

## Prioritize

- bootstrap
- task submission
- upload signature
- deposit submission
- withdrawal submission
- admin financial approvals

## Rules

- Do not over-limit normal reads.
- Return standardized `429` errors.
- Use production-appropriate storage/strategy.

## Exit Criteria

- Sensitive routes have rate limiting.
- Legitimate normal use is not unnecessarily blocked.

---

# Phase B41 - CORS and Production Origin Security

## Objective

Secure Railway backend access from Vercel frontend.

## Allow

Production frontend domain only.

Development:

```text
http://localhost:3000
```

## Rules

- Do not use wildcard production origins for sensitive APIs.
- Confirm Authorization header is allowed.

## Exit Criteria

- Vercel frontend can call backend.
- Unapproved origins are blocked according to final policy.

---

# Phase B42 - Security Hardening

## Objective

Perform a full backend security review.

## Verify

- auth verification
- server-side authorization
- account status checks
- Zod validation
- safe URL validation
- string length limits
- positive amounts
- idempotency
- duplicate prevention
- rate limiting
- safe error responses
- secret handling
- CORS
- file upload restrictions
- database constraints
- audit logging
- safe admin actions

## Exit Criteria

- Critical mutation paths are reviewed end-to-end.
- No trusted financial rule exists only on frontend.

---

# Phase B43 - Concurrency and Race Condition Hardening

## Objective

Protect financial operations under simultaneous requests.

## Test and Harden

- two task approvals
- two deposit approvals
- two withdrawal requests against same balance
- two withdrawal approvals
- two referral reward triggers
- two package approval attempts

## Techniques

Use as required:

- transactions
- guarded updates
- row locking
- unique constraints
- idempotency keys
- current-state conditions

## Exit Criteria

- Financial duplication cannot occur under normal concurrent requests.

---

# Phase B44 - API Documentation

## Objective

Create a reliable API contract for frontend and future clients.

## Document

For every route:

- HTTP method
- path
- auth required
- role required
- request body
- query params
- response
- error codes

## Recommended

Use OpenAPI if practical.

## Deliverables

- API documentation
- machine-readable contract if supported

## Exit Criteria

- Frontend team/agent can integrate without guessing.

---

# Phase B45 - Unit Testing

## Objective

Test isolated business logic.

## Priorities

- wallet calculations
- amount validation
- state transition helpers
- package expiry
- referral qualification
- account masking
- permission helpers
- settings parsing

## Exit Criteria

- High-risk business utilities have automated tests.

---

# Phase B46 - Integration Testing

## Objective

Test real backend workflows with test database.

## Critical Flows

1. Authenticated profile bootstrap
2. Package purchase
3. Package approval
4. Task submission
5. Task approval + wallet credit
6. Deposit request
7. Deposit approval + wallet credit
8. Withdrawal request
9. Withdrawal approval/rejection
10. Referral reward
11. Admin wallet adjustment

## Exit Criteria

- Core flows pass consistently.
- Tests never hit production database.

---

# Phase B47 - Retry and Idempotency Testing

## Objective

Specifically verify duplicate execution safety.

## Repeat Test Cases

- approve task twice
- approve deposit twice
- approve withdrawal twice
- reject processed withdrawal
- reward referral twice
- bootstrap user twice
- package approval twice

## Exit Criteria

- Repeated requests do not duplicate financial effects.
- Correct stable error/state response is returned.

---

# Phase B48 - Performance Review

## Objective

Optimize backend only where needed.

## Review

- query count
- indexes
- N+1 patterns
- large joins
- pagination
- report aggregation
- selected columns
- connection handling

## Rules

- Do not add premature caching.
- Never cache sensitive balances carelessly.

## Exit Criteria

- Main APIs perform acceptably.
- No obvious unbounded query remains.

---

# Phase B49 - Railway Deployment Preparation

## Objective

Prepare backend for production deployment.

## Tasks

- configure Bun start command
- configure Railway service
- configure env variables
- configure frontend origin
- configure production logging
- configure health check
- confirm DB SSL/connection
- confirm Cloudinary production credentials
- confirm Supabase credentials
- confirm migration process

## Deliverables

- Railway deployment config
- production environment checklist

## Exit Criteria

- Production backend starts successfully.
- Health endpoint is reachable.
- API can reach Supabase PostgreSQL.

---

# Phase B50 - Production Migration Strategy

## Objective

Define safe production schema migration behavior.

## Rules

- Do not run destructive migration automatically on every boot.
- Review migrations before production.
- Back up critical data before risky changes.
- Keep migration history consistent.

## Deliverables

- deployment migration procedure

## Exit Criteria

- Production schema update process is documented and repeatable.

---

# Phase B51 - Production Launch Checklist

## Authentication

- token verification works
- profile bootstrap works
- user status enforcement works
- admin role enforcement works

## Packages

- list works
- purchase request works
- admin review works
- expiry works

## Tasks

- list works
- detail works
- submission works
- review works
- reward is credited once

## Wallet

- summary works
- ledger works
- no direct undocumented mutation exists

## Deposit

- request works
- duplicate transaction ID blocked
- approval credits once

## Withdrawal

- request works
- balance rules work
- approval/rejection works
- reserved balance behavior works

## Referral

- relationship works
- self-referral blocked
- reward issued once

## Admin

- routes protected
- audit logs created
- reports load
- settings work

## Infrastructure

- Railway healthy
- Supabase healthy
- Cloudinary healthy
- Vercel origin allowed
- env vars verified

---

# Phase B52 - Post-Launch Monitoring Readiness

## Objective

Prepare the backend for safe operational monitoring.

## Monitor

- API 5xx errors
- auth failures
- failed task approvals
- failed deposit approvals
- failed withdrawal processing
- duplicate conflict errors
- DB connection issues
- Cloudinary upload failures
- slow report queries

## Future Tools

Consider later:

- Sentry
- structured log platform
- uptime monitoring
- queue system
- Redis
- background workers

Do not add them without a real need.

---

# Recommended Backend Development Order

```text
B0  Architecture Lock
B1  Project Initialization
B2  Environment & Config
B3  Database Connection
B4  Error & Response Architecture
B5  Logging & Request IDs
B6  Supabase Auth
B7  Roles & Permissions
B8  User Bootstrap
B9  Current User API
B10 Audit Log Foundation
B11 Notification Foundation
B12 Settings Foundation
B13 Package Read APIs
B14 Admin Package Management
B15 Package Purchase Request
B16 Package Purchase Review
B17 Task Read APIs
B18 Admin Task Management
B19 Cloudinary Upload Security
B20 Task Submission
B21 Task Review
B22 Wallet Core
B23 Wallet Read APIs
B24 Admin Wallet Adjustment
B25 Deposit Request
B26 Deposit Review
B27 Withdrawal Rules
B28 Withdrawal Request
B29 Withdrawal Review
B30 Referral Relationships
B31 Referral Reward Engine
B32 User History
B33 Notifications API
B34 Admin User Management
B35 Admin Referrals & Transactions
B36 Admin Dashboard Metrics
B37 Reports
B38 Settings API
B39 Pagination & Filters
B40 Rate Limiting
B41 CORS
B42 Security Hardening
B43 Concurrency Hardening
B44 API Documentation
B45 Unit Testing
B46 Integration Testing
B47 Idempotency Testing
B48 Performance Review
B49 Railway Deployment
B50 Production Migrations
B51 Launch Checklist
B52 Monitoring Readiness
```

---

# AI Agent Rules for Every Backend Phase

At the beginning of each phase:

1. Inspect existing backend code.
2. Read the current schema and shared types.
3. Confirm the requested phase dependencies already exist.
4. Reuse existing patterns.
5. Do not rewrite unrelated modules.
6. Do not introduce a second competing architecture.
7. Do not silently change business rules.

At the end of each phase, report:

- What was implemented
- Routes added
- Services added
- Repositories added
- Middleware added
- Validators added
- Types added
- Database requirements
- Environment variables added
- Security rules implemented
- Audit/notification integration
- Tests added
- Manual test instructions
- Remaining TODOs
- Known issues

---

# Backend Definition of Done

The backend is complete when:

- Hono API runs on Bun.
- Supabase Auth verification is secure.
- Role authorization works.
- User profile bootstrap is idempotent.
- Packages work end-to-end.
- Tasks work end-to-end.
- Cloudinary upload support is secure.
- Task approval rewards exactly once.
- Wallet ledger is authoritative.
- Deposits work safely.
- Withdrawals use a consistent financial model.
- Referrals work and reward exactly once.
- Histories are available.
- Notifications work.
- Admin management works.
- Reports work.
- Settings are configurable.
- Audit logs exist.
- Critical actions are transactional.
- Critical actions are idempotent.
- Race conditions are handled.
- Errors are normalized.
- Pagination is consistent.
- Tests cover high-risk flows.
- API documentation exists.
- Railway deployment succeeds.
- Vercel frontend can consume the backend securely.

---

# Final Backend Principle

Do not build the backend as a collection of endpoints.

Build it as one coherent domain system.

Every critical operation must preserve:

- identity
- authorization
- business rules
- database consistency
- financial integrity
- traceability
- recoverability
- future maintainability

The backend must remain the trusted source of truth for the entire Digonto platform.
