# Digonto Platform - Backend Context

## Purpose

This document defines the complete backend architecture, engineering rules, API conventions, authentication and authorization model, business-logic boundaries, database interaction patterns, financial-safety rules, media integration strategy, security requirements, testing expectations, and deployment standards for the **Digonto Platform**.

Use this file together with:

- `Digonto_Master_Context.md`
- `Digonto_Master_Phase.md`
- `Digonto_Frontend_Context.md`
- `Digonto_Frontend_Phase.md`

The backend must be production-ready, secure, maintainable, scalable, and structured so future clients such as a mobile application can reuse the same API without requiring a backend rewrite.

---

# 1. Finalized Backend Technology Stack

Use the following stack:

- Runtime: Bun
- Framework: Hono.js
- Language: TypeScript
- API Style: REST
- Validation: Zod
- ORM: Drizzle ORM
- Database: PostgreSQL on Supabase
- Authentication Provider: Supabase Auth
- File Storage / Media: Cloudinary
- Deployment: Railway

Recommended supporting packages may include:

- `@supabase/supabase-js`
- `drizzle-orm`
- `postgres` or the finalized PostgreSQL driver
- `zod`
- `cloudinary`
- Hono middleware packages where appropriate

Do not replace the finalized stack unless there is a strong architectural reason and the change is approved before implementation.

---

# 2. Backend Responsibilities

The backend is the trusted source of truth for all sensitive application behavior.

The backend is responsible for:

- Authentication token verification
- Authorization
- User profile management
- Role enforcement
- Package management
- Package purchase processing
- Package activation and expiry rules
- Task management
- Task eligibility rules
- Task submission processing
- Screenshot metadata handling
- Admin task review
- Wallet balance management
- Ledger transactions
- Deposit request processing
- Withdrawal processing
- Referral relationships
- Referral reward rules
- Transaction history
- Notifications
- Reports
- System settings
- Audit logging
- Financial consistency
- Validation
- Idempotency
- Security controls
- Controlled Cloudinary integration

The frontend must never be trusted for:

- User identity
- User role
- Wallet balance
- Reward amount
- Package entitlement
- Referral qualification
- Approval state
- Admin permission
- Final transaction amount
- Financial status transitions

---

# 3. Core Architectural Principle

Use a layered modular backend.

Recommended logical flow:

```text
HTTP Request
    |
    v
Hono Route
    |
    v
Middleware
    |
    v
Validation
    |
    v
Controller / Route Handler
    |
    v
Service
    |
    v
Repository / Data Access
    |
    v
Drizzle ORM
    |
    v
PostgreSQL
```

Business logic should live in services, not inside route definitions.

Database queries should be centralized enough to remain maintainable.

Avoid putting every responsibility into a single file.

---

# 4. Recommended Backend Folder Structure

```text
apps/api/
|
|-- src/
|   |
|   |-- index.ts
|   |-- app.ts
|   |
|   |-- config/
|   |   |-- env.ts
|   |   |-- cors.ts
|   |   `-- constants.ts
|   |
|   |-- lib/
|   |   |-- db.ts
|   |   |-- supabase.ts
|   |   |-- cloudinary.ts
|   |   `-- logger.ts
|   |
|   |-- middleware/
|   |   |-- auth.middleware.ts
|   |   |-- admin.middleware.ts
|   |   |-- error.middleware.ts
|   |   |-- request-id.middleware.ts
|   |   |-- rate-limit.middleware.ts
|   |   `-- audit.middleware.ts
|   |
|   |-- modules/
|   |   |
|   |   |-- auth/
|   |   |-- users/
|   |   |-- packages/
|   |   |-- tasks/
|   |   |-- submissions/
|   |   |-- wallet/
|   |   |-- deposits/
|   |   |-- withdrawals/
|   |   |-- referrals/
|   |   |-- notifications/
|   |   |-- reports/
|   |   |-- settings/
|   |   `-- admin/
|   |
|   |-- shared/
|   |   |-- errors/
|   |   |-- responses/
|   |   |-- validators/
|   |   |-- types/
|   |   |-- utils/
|   |   `-- constants/
|   |
|   `-- types/
|
|-- tests/
|
|-- package.json
|-- tsconfig.json
`-- railway.json
```

A feature module may follow:

```text
modules/tasks/
|
|-- task.routes.ts
|-- task.controller.ts
|-- task.service.ts
|-- task.repository.ts
|-- task.schema.ts
|-- task.types.ts
`-- task.constants.ts
```

Do not force every module to contain all files if a smaller module does not need them.

---

# 5. API Base Structure

Use versioned API routes.

Recommended:

```text
/api/v1
```

Example:

```text
GET    /api/v1/health
GET    /api/v1/me

GET    /api/v1/packages
GET    /api/v1/packages/:id
POST   /api/v1/packages/:id/purchase

GET    /api/v1/tasks
GET    /api/v1/tasks/:id
POST   /api/v1/tasks/:id/submissions

GET    /api/v1/wallet
GET    /api/v1/wallet/transactions

POST   /api/v1/deposits
GET    /api/v1/deposits

POST   /api/v1/withdrawals
GET    /api/v1/withdrawals

GET    /api/v1/referrals
GET    /api/v1/notifications

GET    /api/v1/admin/users
GET    /api/v1/admin/submissions
POST   /api/v1/admin/submissions/:id/approve
POST   /api/v1/admin/submissions/:id/reject
```

Use nouns for resources.

Use action endpoints only when a state transition cannot be expressed cleanly as normal CRUD.

---

# 6. API Response Convention

Use a consistent JSON envelope.

## Success

Example:

```json
{
  "success": true,
  "data": {},
  "meta": null
}
```

For paginated lists:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Error

Example:

```json
{
  "success": false,
  "error": {
    "code": "TASK_ALREADY_SUBMITTED",
    "message": "Task has already been submitted.",
    "details": null
  }
}
```

Never return raw PostgreSQL errors to the client.

---

# 7. HTTP Status Conventions

Use HTTP status codes consistently.

Examples:

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
```

Examples:

- Invalid body -> `400` or `422`
- Missing login -> `401`
- Logged in but not authorized -> `403`
- Duplicate transaction ID -> `409`
- Missing resource -> `404`

---

# 8. Environment Configuration

Validate backend environment variables at startup using Zod.

Example backend environment variables:

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

Add only variables actually required.

Rules:

- Never commit secrets.
- Never expose service-role credentials to frontend.
- Fail fast if mandatory production environment variables are missing.
- Keep `.env.example` without real values.

---

# 9. Supabase Authentication Strategy

Supabase Auth is responsible for identity authentication.

The backend remains responsible for application authorization.

## Request Flow

```text
Frontend logs in through Supabase
        |
        v
Supabase issues access token
        |
        v
Frontend calls Hono API
        |
        v
Authorization: Bearer <token>
        |
        v
Backend verifies token
        |
        v
Backend resolves application profile
        |
        v
Backend applies authorization rules
```

Never trust a user ID sent in a request body when the user ID can be obtained from the authenticated token.

---

# 10. Application Profile Model

Supabase Auth user identity and application profile data should be separated logically.

Supabase Auth stores authentication identity.

Application database stores platform-specific profile data.

Recommended profile fields may include:

- id
- auth_user_id
- display_name
- phone
- avatar_url
- role
- status
- referral_code
- referred_by
- created_at
- updated_at

The exact schema belongs in the Database Context.

---

# 11. Registration Bootstrap Flow

After a new Supabase Auth user is created, application bootstrap must safely create required platform records.

Recommended flow:

```text
Auth User Created
      |
      v
Application Profile Created
      |
      v
Wallet Created
      |
      v
Referral Code Generated
      |
      v
Optional Referral Relationship Created
```

This flow must be idempotent.

If a request is retried, it must not create:

- duplicate profile
- duplicate wallet
- duplicate referral code
- duplicate referral relationship

---

# 12. Roles and Authorization

Minimum roles:

```text
USER
ADMIN
SUPER_ADMIN
```

Possible future roles:

```text
REVIEWER
FINANCE_ADMIN
SUPPORT_ADMIN
```

Do not design current business logic around frontend-only role checks.

Use backend middleware/helpers.

Recommended patterns:

```text
requireAuth
requireRole("ADMIN")
requireAnyRole(["ADMIN", "SUPER_ADMIN"])
```

For resource-level authorization, use explicit checks in services.

---

# 13. User Status

Recommended user statuses:

```text
ACTIVE
SUSPENDED
BLOCKED
```

Potential future status:

```text
PENDING_VERIFICATION
```

A suspended or blocked user must be restricted according to the finalized business rule.

Sensitive mutations should check account status before processing.

---

# 14. Validation Strategy

All external input must be validated.

Use Zod for:

- body
- query params
- path params
- filters
- pagination
- enum values
- file metadata
- admin actions

Examples:

- Deposit amount
- Withdrawal amount
- Task ID
- Package ID
- Transaction ID
- Rejection reason
- Account number
- Pagination limit

Do not rely only on frontend validation.

---

# 15. Shared Business Enums

Keep status values centralized.

Examples:

## Generic Review

```text
PENDING
APPROVED
REJECTED
```

## Package

```text
ACTIVE
INACTIVE
EXPIRED
```

## User

```text
ACTIVE
SUSPENDED
BLOCKED
```

## Transaction Direction

```text
CREDIT
DEBIT
```

## Wallet Transaction Type

```text
TASK_REWARD
REFERRAL_REWARD
DEPOSIT
WITHDRAWAL
PACKAGE_PURCHASE
BONUS
ADMIN_ADJUSTMENT
```

Avoid magic strings throughout the codebase.

---

# 16. Error Architecture

Create typed application errors.

Examples:

```text
ValidationError
UnauthorizedError
ForbiddenError
NotFoundError
ConflictError
BusinessRuleError
RateLimitError
```

Every error should map to:

- HTTP status
- stable error code
- safe client message

Example stable codes:

```text
USER_NOT_FOUND
PACKAGE_NOT_FOUND
TASK_NOT_FOUND
INSUFFICIENT_BALANCE
TASK_ALREADY_SUBMITTED
DUPLICATE_TRANSACTION_ID
WITHDRAWAL_ALREADY_PROCESSED
FORBIDDEN
```

Do not expose stack traces in production API responses.

---

# 17. Request IDs and Logging

Every request should have a request ID.

Log useful structured information:

- request ID
- method
- route
- response status
- duration
- authenticated user ID when safe
- error code
- internal operation identifiers

Do not log:

- passwords
- access tokens
- Supabase service key
- Cloudinary secret
- full sensitive account data
- unnecessary personally sensitive payloads

---

# 18. Audit Logging

Sensitive admin and financial actions must create audit records.

Examples:

- Task approved
- Task rejected
- Deposit approved
- Deposit rejected
- Withdrawal approved
- Withdrawal rejected
- Wallet manually adjusted
- User suspended
- User reactivated
- Package changed
- System setting changed

Audit event should capture:

- actor
- action
- entity type
- entity ID
- previous state when useful
- new state when useful
- reason/note
- timestamp
- request ID if useful

Audit logs must not be editable by normal users.

---

# 19. Database Access Rules

Use Drizzle ORM.

Rules:

- Prefer typed queries.
- Avoid raw SQL unless necessary.
- Parameterize raw SQL.
- Keep heavy queries reviewed.
- Select only needed columns.
- Use pagination for large collections.
- Use indexes for frequent lookups.
- Use transactions for multi-step consistency.

Do not let routes contain scattered complex SQL logic.

---

# 20. Transaction Safety

Database transactions are mandatory for business operations where several writes must either all succeed or all fail.

Examples:

- Approve task submission + create wallet credit
- Approve deposit + create wallet credit
- Process withdrawal + debit/reserve funds + update request state
- Package purchase + wallet debit if wallet-funded + purchase record
- Referral qualification + referral reward + wallet credit
- Admin wallet adjustment + ledger record + audit log

Example concept:

```ts
await db.transaction(async (tx) => {
  // validate current state
  // write business record
  // update wallet
  // insert ledger entry
  // insert notification/audit where required
})
```

---

# 21. Idempotency

Critical mutation endpoints must be idempotent.

Especially:

- Task approval
- Deposit approval
- Withdrawal processing
- Referral reward issuance
- Package purchase approval
- Wallet adjustment if retryable

A repeated request must not create repeated financial effects.

Recommended techniques:

- Unique business constraints
- Current-state checks
- Idempotency keys where useful
- Unique reference constraints
- Transaction-level locking / guarded updates where appropriate

---

# 22. Wallet Architecture

The wallet must use ledger-based accounting.

Never do this alone:

```text
wallet.balance = wallet.balance + reward
```

Without creating a corresponding ledger transaction.

Every balance mutation must create a transaction record.

Recommended wallet summary:

- available balance
- pending balance if the final model uses it
- total earned
- total withdrawn

The exact schema belongs in Database Context.

---

# 23. Wallet Transaction Record

Each transaction should contain enough information to audit why the balance changed.

Recommended fields:

- id
- user_id
- type
- direction
- amount
- reference_type
- reference_id
- description
- balance_before
- balance_after
- created_at

Potential metadata may be stored if truly needed.

Financial values must use decimal-safe database types.

Never use JavaScript floating point assumptions for money-critical calculations.

---

# 24. Wallet Service

All balance changes must go through one controlled service.

Example conceptual methods:

```text
credit(...)
debit(...)
reserve(...)
release(...)
adjust(...)
getBalance(...)
getTransactions(...)
```

Do not create wallet-update logic independently in:

- task service
- deposit service
- referral service
- withdrawal service

Those services should call the wallet service.

This prevents duplicated financial logic.

---

# 25. Task System

Backend responsibilities include:

- Task creation
- Task editing
- Task activation/deactivation
- Task eligibility
- Package restriction validation
- Task reward source of truth
- Submission validation
- Duplicate submission prevention
- Admin review
- Reward issuance

User must never submit the reward amount.

Backend reads task reward from database.

---

# 26. Task Eligibility

Before allowing submission, backend may validate:

- User account status
- Task active status
- Package requirement
- Package validity
- Daily task limit
- Existing submission
- Task-specific limits
- Availability period if introduced

Do not trust the frontend "eligible" state.

---

# 27. Task Submission

Recommended flow:

```text
Authenticated User
      |
      v
Load Task
      |
      v
Validate Eligibility
      |
      v
Validate Screenshot Metadata
      |
      v
Create Submission
      |
      v
Status = PENDING
```

Recommended fields:

- task ID
- user ID
- screenshot URL / public ID
- submitted_at
- status

Optional metadata:

- file metadata
- submission note
- client metadata if justified

Do not store unnecessary browser fingerprinting data.

---

# 28. Task Review

Admin review flow:

```text
Load Submission
      |
      v
Ensure Status = PENDING
      |
      +---- Reject ----> Save reason
      |
      `---- Approve ---> Wallet credit
                         + Ledger entry
                         + Notification
```

Approval must be atomic.

If wallet credit fails, the submission should not become successfully approved without the reward unless the finalized model intentionally supports delayed settlement.

---

# 29. Package System

Backend is responsible for:

- Package CRUD
- Package active/inactive state
- Package pricing
- Package limits
- Validity
- Purchase request
- Purchase approval/rejection
- User package activation
- Package expiry

Package price must come from backend/database.

Never accept package price as trusted input from frontend.

---

# 30. User Package Rules

Recommended concepts:

- purchase request
- payment status
- start time
- expiry time
- active state

When a purchase is approved:

```text
Validate Purchase
      |
      v
Activate User Package
      |
      v
Set Start Date
      |
      v
Set Expiry Date
      |
      v
Create Notification
```

If multiple active packages are not allowed, enforce that rule server-side and at database level where appropriate.

---

# 31. Deposit System

Deposit requests are manual-payment review records.

User supplies:

- amount
- payment method
- transaction ID
- sender/account reference where applicable
- screenshot evidence

Backend must:

- validate amount
- validate payment method
- validate transaction ID
- protect against duplicates
- create pending request
- support admin review

Approved deposit:

```text
Pending Deposit
      |
      v
Admin Approves
      |
      v
Wallet Credit
      |
      v
Ledger Entry
      |
      v
Deposit = APPROVED
      |
      v
Notification
```

Use one database transaction.

---

# 32. Deposit Transaction ID

Where the payment method uses an external transaction ID:

- Normalize input where safe.
- Apply uniqueness constraints according to business rules.
- Do not allow the same external transaction ID to credit multiple users.
- Do not rely only on application-level duplicate checks.

---

# 33. Withdrawal System

Withdrawal processing requires strong financial consistency.

User provides:

- amount
- withdrawal method
- destination account

Backend must validate:

- account status
- amount
- configured minimum
- configured maximum
- available balance
- allowed method
- current withdrawal rules

---

# 34. Withdrawal Balance Strategy

The final project should use one clearly defined model.

Recommended model:

```text
Request Created
      |
      v
Funds Reserved
      |
      v
Admin Review
      |
      +---- Approved ---> Finalize debit / mark completed
      |
      `---- Rejected ---> Release reserved funds
```

Alternative models are possible, but the project must choose one and implement it consistently.

Do not allow pending withdrawals to leave spendable balance incorrectly available.

---

# 35. Withdrawal Security

Backend should prevent:

- withdrawal above available balance
- duplicate processing
- invalid state transitions
- repeated approval
- negative balance
- hidden fee manipulation
- destination modification after approval without controlled workflow

Normal user history should return masked destination data where appropriate.

Admin permissions may allow fuller data only when operationally required.

---

# 36. Referral System

Referral backend responsibilities:

- Generate unique referral codes
- Resolve referral code during registration
- Prevent self-referral
- Prevent duplicate referral relationship
- Track referred user
- Track qualification state
- Issue reward once
- Track reward transaction

The referral reward amount must come from backend-controlled settings.

---

# 37. Referral Qualification

Do not automatically reward account creation unless this is explicitly the finalized business rule.

Recommended qualification examples:

- Approved package purchase
- Verified activity
- Other configured event

The referral reward engine should be future-ready.

Concept:

```text
Referral Relationship
      |
      v
Qualifying Event
      |
      v
Check Reward Not Issued
      |
      v
Wallet Credit
      |
      v
Referral Reward Record
```

---

# 38. Notification System

Backend should create in-app notifications for meaningful events.

Examples:

- Task approved
- Task rejected
- Deposit approved
- Deposit rejected
- Withdrawal approved
- Withdrawal rejected
- Package approved
- Package rejected
- Referral reward credited
- Admin announcement

Recommended fields:

- user_id
- type
- title
- message
- read_at
- created_at
- reference_type
- reference_id

Keep notification creation centralized in a service.

---

# 39. Cloudinary Integration

Cloudinary stores uploaded media.

Use cases:

- Task screenshots
- Deposit screenshots
- Profile images
- Future media

Recommended folder structure:

```text
digonto/
|
|-- task-submissions/
|-- deposits/
|-- profiles/
`-- misc/
```

---

# 40. Cloudinary Security

Rules:

- Never expose Cloudinary API secret.
- Validate file type.
- Validate file size.
- Limit upload usage by authenticated identity.
- Use signed uploads or controlled backend upload strategy.
- Store `public_id` when useful for deletion/replacement.
- Store secure URL.
- Apply transformation rules only where useful.
- Clean up orphaned uploads where possible.

The exact upload architecture should be consistent across frontend and backend.

---

# 41. Media Metadata

Recommended database fields for uploaded assets may include:

- secure_url
- public_id
- resource_type
- width
- height
- bytes
- format

Store only what is useful.

Do not copy huge Cloudinary response payloads into PostgreSQL.

---

# 42. Pagination

All potentially large list endpoints must support pagination.

Examples:

- Tasks
- Wallet transactions
- Deposits
- Withdrawals
- Referral list
- Notifications
- Admin users
- Admin submissions
- Audit logs
- Reports

Recommended query params:

```text
?page=1&limit=20
```

Set a maximum limit.

Example:

```text
max limit = 100
```

Do not allow unrestricted massive result sets.

---

# 43. Filtering and Sorting

Use controlled filters.

Examples:

```text
status
type
category
packageId
userId
dateFrom
dateTo
search
sort
```

Validate all values.

Do not expose arbitrary SQL-like sorting/filtering syntax to clients.

---

# 44. Search

User/admin search may support:

- user ID
- display name
- email where permitted
- transaction ID
- task title
- package name

Use indexes according to the Database Context.

Do not return sensitive records beyond the caller's authorization.

---

# 45. Reports

Reports should be generated from backend-controlled queries.

Potential reports:

- User registrations
- Package sales
- Deposits
- Withdrawals
- Task submissions
- Approved task rewards
- Referral rewards
- Wallet movement

Reports should support filters such as:

- date range
- status
- package
- task category
- user

Do not make frontend calculate authoritative financial totals from paginated rows.

---

# 46. System Settings

Business values that may change should not all be hardcoded.

Potential configurable settings:

- minimum withdrawal amount
- maximum withdrawal amount
- referral reward
- payment methods
- maintenance mode
- feature toggles
- support information
- announcement

Use a settings service.

Sensitive settings must be admin-only.

---

# 47. Admin Actions

All admin mutations should:

1. Authenticate admin.
2. Authorize required role.
3. Validate payload.
4. Load current state.
5. Validate state transition.
6. Perform transaction if required.
7. Create audit log.
8. Create notification where relevant.
9. Return normalized response.

Do not let admin endpoints directly bypass financial safety rules.

---

# 48. State Transition Rules

Use explicit allowed state transitions.

Example task submission:

```text
PENDING -> APPROVED
PENDING -> REJECTED
```

Not allowed:

```text
APPROVED -> APPROVED
REJECTED -> APPROVED
```

unless a controlled reopen/review workflow is explicitly built.

Example deposit:

```text
PENDING -> APPROVED
PENDING -> REJECTED
```

State rules should be centralized.

---

# 49. Rate Limiting

Apply rate limiting to sensitive endpoints.

Examples:

- login-adjacent backend bootstrap endpoints
- registration bootstrap
- password-related support endpoints if any
- task submission
- deposit submission
- withdrawal submission
- file upload signature endpoint
- admin financial mutation endpoints

Use limits appropriate to real usage.

Do not apply overly aggressive limits to normal read endpoints.

---

# 50. CORS

Backend is deployed on Railway and frontend on Vercel.

CORS must allow only trusted origins in production.

Example:

```text
https://your-production-domain.com
```

Development may allow:

```text
http://localhost:3000
```

Do not use unrestricted production CORS when credentials or sensitive APIs are involved.

---

# 51. Security Headers

Use applicable security headers.

Examples:

- Content-Type protections
- Referrer policy where applicable
- Frame restrictions where appropriate
- HSTS at infrastructure/proxy level where supported

Hono/Railway deployment should be reviewed with frontend/Vercel behavior.

---

# 52. CSRF Considerations

If API auth is bearer-token based via the `Authorization` header, traditional cookie CSRF exposure differs from cookie-session architectures.

If the final implementation uses cookies for auth forwarding, explicitly implement CSRF protections appropriate to that model.

Do not assume CSRF is irrelevant without reviewing the actual auth transport.

---

# 53. Input Security

Backend must handle untrusted input safely.

Rules:

- Validate URL fields.
- Validate enum fields.
- Validate numbers.
- Reject negative financial values.
- Set reasonable string length limits.
- Normalize fields only where semantically safe.
- Avoid directly rendering stored user input in privileged HTML contexts.
- Sanitize rich text if rich text is ever introduced.

---

# 54. Financial Precision

Use PostgreSQL numeric/decimal types or integer minor-unit architecture according to the finalized Database Context.

Do not use uncontrolled binary floating-point arithmetic for money.

Examples of unsafe assumptions:

```text
0.1 + 0.2
```

Business calculations must have deterministic rounding rules.

---

# 55. Concurrency Safety

Financial and approval operations must consider concurrent requests.

Potential risks:

- Two admins approving the same deposit
- Two requests spending the same balance
- Repeated task approval
- Referral reward issued twice
- Multiple package approvals

Use:

- guarded updates
- unique constraints
- transactions
- appropriate row locking or equivalent database strategy where necessary

---

# 56. API Authentication Middleware

Recommended auth middleware responsibilities:

- Read bearer token.
- Verify token with Supabase.
- Resolve authenticated identity.
- Resolve platform profile.
- Reject blocked/suspended state as required.
- Attach typed user context.

Typed context example concept:

```ts
type AuthContext = {
  authUserId: string
  userId: string
  role: "USER" | "ADMIN" | "SUPER_ADMIN"
  status: "ACTIVE" | "SUSPENDED" | "BLOCKED"
}
```

Do not parse unverified JWT payloads and trust them as authentication.

---

# 57. Backend TypeScript Rules

Use strict TypeScript.

Avoid:

- `any`
- unsafe type assertions
- duplicated domain types
- stringly-typed business logic

Prefer:

- inferred Zod types
- explicit service inputs
- domain enums/constants
- typed repository results

If `any` is unavoidable, document why.

---

# 58. Service Layer Rules

Services should represent business operations.

Examples:

```text
TaskService
PackageService
WalletService
DepositService
WithdrawalService
ReferralService
NotificationService
AuditService
SettingsService
```

Service methods should use clear verbs.

Example:

```text
approveSubmission
rejectSubmission
requestWithdrawal
approveDeposit
qualifyReferral
purchasePackage
```

---

# 59. Repository Layer Rules

Repository/data access layer should:

- hide repeated query construction
- encapsulate module-specific persistence
- keep Drizzle query details out of business logic where useful

Do not overengineer generic repositories.

A repository should exist when it improves clarity.

---

# 60. API Documentation

Document backend routes.

Recommended options:

- OpenAPI
- Hono OpenAPI integration
- Generated API docs
- Markdown API contract if necessary

At minimum document:

- method
- path
- auth requirement
- role requirement
- request schema
- response shape
- error codes

This helps the AI agent and frontend remain aligned.

---

# 61. Health and Readiness Endpoints

Provide:

```text
GET /api/v1/health
```

Possible response:

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

Optional readiness endpoint may validate critical dependencies.

Do not expose credentials or detailed internal infrastructure information.

---

# 62. Background Jobs - Current Scope

Do not introduce queues unnecessarily during the first version.

Synchronous operations are acceptable where fast and safe.

Future candidates for background processing:

- notification delivery
- email
- analytics aggregation
- cleanup jobs
- expired package processing
- report exports

Design service boundaries so background jobs can be added later.

---

# 63. Package Expiry

Package expiry can initially be computed from `expires_at`.

When the platform grows, a scheduled job may update derived status if required.

Do not require a background worker merely to know whether a package is expired.

Use authoritative time comparisons.

---

# 64. Time Handling

Store timestamps in UTC.

Return ISO 8601 timestamps.

Frontend is responsible for localized display.

Do not store local Bangladesh time as unqualified timestamps.

Business rules that depend on "day" boundaries must explicitly define timezone.

For example, daily task limits may need a configured business timezone.

---

# 65. Daily Limits

If daily limits exist:

- define business timezone
- calculate start/end of business day consistently
- query usage server-side
- do not trust frontend counters

Possible limits:

- daily tasks
- daily rewards
- daily withdrawals
- daily bonus claims

---

# 66. Duplicate Submission Prevention

Prevent duplicate task submissions using both:

- service validation
- database constraints where possible

The exact uniqueness rule may depend on:

- one submission ever
- one approved submission
- one submission per day
- configurable retry after rejection

Finalize rule before schema implementation.

---

# 67. Admin Wallet Adjustment

If admins can adjust wallets:

Required fields:

- user
- direction
- amount
- reason

The operation must:

- use wallet service
- create ledger record
- create audit log
- prevent invalid negative balance
- record actor

Never allow silent balance edits.

---

# 68. Data Privacy and Exposure

API responses should expose only required fields.

Examples:

Normal user should not receive:

- internal admin notes unless intentionally user-visible
- full audit logs
- another user's private details
- service credentials
- full withdrawal account details after masking rules apply

Admin response payloads should still minimize unnecessary sensitive data.

---

# 69. Soft Delete vs Hard Delete

Prefer status/deactivation over hard deletion for records with financial or audit importance.

Examples:

Do not hard-delete:

- wallet transactions
- approved deposits
- processed withdrawals
- audit logs
- financial package purchases

For editable content such as tasks/packages, deactivation is often safer than deletion.

---

# 70. Data Retention

Financial and audit records should remain traceable.

If user deletion is introduced later:

- authentication identity handling
- profile anonymization
- financial/legal retention

must be designed deliberately.

Do not cascade-delete critical transaction history accidentally.

---

# 71. Notifications vs Audit Logs

Do not confuse these.

## Notification

User-facing event.

Example:

```text
Your task was approved.
```

## Audit Log

Internal operational trace.

Example:

```text
Admin 123 approved task submission 456.
```

One action may create both.

---

# 72. Testing Strategy

Backend testing must prioritize business integrity.

## Unit Tests

Focus on:

- wallet calculations
- amount validation
- status transition rules
- referral qualification
- package expiry
- masking utilities
- permission helpers

## Integration Tests

Focus on:

- authentication middleware
- registration bootstrap
- task submission
- task approval
- deposit approval
- withdrawal processing
- package purchase
- referral reward
- admin wallet adjustment

## Concurrency / Retry Tests

Critical:

- repeated task approval
- repeated deposit approval
- repeated withdrawal approval
- duplicate referral reward
- parallel withdrawal attempts

---

# 73. Test Database

Use a dedicated test database or isolated schema.

Tests must never run against production database.

Integration tests should:

- create controlled data
- clean up safely
- remain deterministic

---

# 74. Seed Data

Development seed may create:

- test user profile
- admin profile
- sample packages
- sample tasks
- sample settings

Never seed production with test credentials by default.

---

# 75. Backend Performance

Performance priorities:

- proper indexes
- pagination
- avoiding N+1 queries
- minimal selected columns
- efficient joins
- controlled report queries

Do not add caching before measuring need.

Future cache candidates:

- public package list
- stable system settings
- read-heavy dashboard aggregations

Never cache sensitive balance values carelessly.

---

# 76. Railway Deployment

Backend will be deployed to Railway.

Production requirements:

- Bun-compatible start command
- environment variables configured
- health endpoint
- CORS configured for Vercel frontend
- production logging
- database migrations handled safely
- no development-only secrets

Recommended startup behavior:

1. Validate environment.
2. Initialize application.
3. Confirm required configuration.
4. Start HTTP server.

Do not automatically run dangerous schema changes on every production boot unless the migration strategy explicitly allows it.

---

# 77. Database Connection Management

Use a PostgreSQL connection strategy appropriate for Supabase and Railway.

Requirements:

- safe connection pooling
- no per-request new database client
- production SSL configuration where required
- graceful failure handling

Database connection details should be isolated in `lib/db.ts` or shared DB package.

---

# 78. Supabase Service Role Usage

Supabase service-role credentials are highly privileged.

Rules:

- Backend only
- Never frontend
- Use only when necessary
- Do not log
- Do not expose in API errors
- Keep operations narrowly scoped

Normal user identity verification should use the appropriate Supabase auth flow without unnecessarily elevating privileges.

---

# 79. Admin Security

Admin endpoints deserve extra protection.

Minimum:

- verified authentication
- server-side role check
- action validation
- audit logging
- rate limiting where appropriate
- strict state transition rules

Potential future improvements:

- MFA
- granular permissions
- finance-specific roles
- IP/risk monitoring

Do not block future adoption by hardcoding a single admin email everywhere.

---

# 80. Business Settings Service

Create a typed settings layer.

Avoid repeatedly querying raw settings rows from random services.

Example:

```text
getWithdrawalRules()
getReferralRules()
getPaymentMethods()
getFeatureFlags()
```

Use safe defaults where appropriate.

---

# 81. Feature Flags

Future-ready architecture may include flags such as:

- daily bonus enabled
- lucky spin enabled
- gift code enabled
- video tasks enabled
- referral enabled
- withdrawals enabled

Do not build every future feature now.

Only create the structure if it simplifies future expansion.

---

# 82. Reports and Aggregations

For admin dashboard/reporting:

Prefer backend aggregate queries.

Examples:

```text
COUNT users
SUM approved deposits
SUM approved withdrawals
COUNT pending submissions
```

Do not fetch thousands of rows merely for frontend summation.

---

# 83. Public vs Protected Endpoints

Potential public:

```text
GET /health
GET /packages
```

if package browsing is intended publicly.

Protected user endpoints:

```text
/me
/dashboard
/tasks
/wallet
/deposits
/withdrawals
/referrals
/history
```

Admin protected:

```text
/admin/*
```

Finalize actual exposure based on product requirements.

---

# 84. Domain Naming Rules

Use consistent domain terms.

Choose one canonical term for each concept.

Examples:

Use:

```text
taskSubmission
walletTransaction
packagePurchase
withdrawal
deposit
referral
```

Avoid switching randomly between:

```text
cashout / withdrawal
recharge / deposit
job / task
```

UI may use localized labels, but backend domain names should remain consistent.

---

# 85. API Compatibility

Because the platform may support a mobile app later:

- keep API independent from Next.js internals
- do not return frontend-specific HTML
- return clean JSON
- version routes
- keep auth model reusable
- avoid server actions as the only backend interface

The Hono API should remain the canonical backend.

---

# 86. Web-Only Current Scope

The current product is a website.

Do not add unnecessary mobile-specific backend complexity now.

However, keep the API generic enough that future:

- iOS
- Android
- PWA
- other web clients

can use it.

---

# 87. Business Rule Source of Truth

Business rules must be centralized.

Examples:

- minimum withdrawal
- package expiry
- referral qualification
- task reward
- allowed task status transitions
- allowed withdrawal state transitions

Do not duplicate the same rule in multiple modules.

---

# 88. Secure Defaults

Default to:

- deny access unless allowed
- reject unknown enum values
- reject malformed data
- use least privilege
- expose minimal data
- preserve auditability
- require confirmation for critical admin actions at UI level
- enforce critical checks again on backend

---

# 89. Backend Definition of Done

The backend is considered complete when:

- Hono API runs successfully on Bun.
- API is versioned.
- Supabase Auth tokens are verified.
- User profiles are resolved correctly.
- Role authorization is enforced.
- Packages work end-to-end.
- Tasks work end-to-end.
- Task submissions work.
- Admin review works.
- Cloudinary upload integration works securely.
- Wallet uses ledger-based accounting.
- Deposits work.
- Withdrawals work safely.
- Referrals work.
- Notifications work.
- Histories can be queried.
- Admin operations are protected.
- Audit logs exist for sensitive actions.
- Critical financial operations are transactional.
- Duplicate processing is prevented.
- API errors are normalized.
- Pagination is implemented.
- Validation is implemented.
- Tests cover critical flows.
- Environment variables are validated.
- Backend deploys successfully to Railway.
- Frontend on Vercel can consume production APIs.

---

# 90. AI Agent Backend Implementation Rules

When an AI coding agent receives this file:

1. Read `Digonto_Master_Context.md`.
2. Read `Digonto_Master_Phase.md`.
3. Read this Backend Context completely.
4. Inspect existing code before editing.
5. Work only on the requested backend phase.
6. Do not change the finalized stack.
7. Do not put financial logic in route handlers.
8. Use services for business logic.
9. Use Drizzle for database access.
10. Use Zod for external input.
11. Verify Supabase tokens server-side.
12. Never trust client user ID, role, amount, balance, or reward values.
13. Use database transactions for multi-step financial actions.
14. Make critical approval endpoints idempotent.
15. Add audit logs for sensitive admin actions.
16. Do not expose raw database errors.
17. Do not expose secrets.
18. Keep TypeScript strict.
19. Keep APIs reusable for future clients.
20. Do not overengineer infrastructure that is not yet needed.

At the end of each backend phase, report:

- What was implemented
- Routes added
- Middleware added
- Services added
- Repositories added
- Validators added
- Database dependencies/changes required
- Environment variables added
- Business rules implemented
- Security considerations
- Tests added
- Manual testing instructions
- Remaining TODOs
- Known issues

---

# Final Backend Principle

The backend is the trusted core of Digonto.

It must prioritize:

- correctness
- financial integrity
- security
- auditability
- clear business rules
- modular architecture
- future API reuse
- operational reliability

Do not optimize for the smallest amount of code.

Optimize for a backend that remains understandable, safe, and extensible as the platform grows.
