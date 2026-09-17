# Digonto Platform - Database Context

## Purpose

This document defines the complete database architecture, schema principles, relational model, financial data rules, constraints, indexes, security posture, migration strategy, and data-integrity requirements for the **Digonto Platform**.

Use this file together with:

- `Digonto_Master_Context.md`
- `Digonto_Master_Phase.md`
- `Digonto_Backend_Context.md`
- `Digonto_Backend_Phase.md`

The database is one of the most critical parts of Digonto because it stores authentication-linked profiles, package purchases, tasks, proof submissions, wallet balances, financial ledger entries, deposits, withdrawals, referrals, notifications, audit logs, and platform settings.

The schema must prioritize:

- Financial integrity
- Referential integrity
- Auditability
- Idempotency
- Security
- Maintainability
- Query performance
- Future expansion

---

# 1. Finalized Database Stack

Use:

- Database Engine: PostgreSQL
- Provider: Supabase PostgreSQL
- ORM: Drizzle ORM
- Migration Tool: Drizzle Kit
- Backend Runtime: Bun
- Backend API: Hono.js
- Authentication Identity Provider: Supabase Auth
- Media Storage: Cloudinary

The frontend must not directly query application tables.

All application data must flow through the Hono backend API.

Supabase on the frontend is used for authentication/session handling only.

---

# 2. Database as Source of Truth

PostgreSQL is the authoritative source for:

- User application profiles
- Roles/status
- Referral relationships
- Packages
- Package purchases
- Active user packages
- Tasks
- Task submissions
- Wallets
- Wallet ledger
- Deposits
- Withdrawals
- Notifications
- Media metadata
- Audit logs
- System settings
- Payment methods
- Idempotency records

The frontend must never be treated as the source of truth for:

- Balance
- Reward amount
- Package price
- Role
- Approval status
- Referral reward
- Financial transaction state
- Package eligibility
- Task eligibility

---

# 3. Database Naming Convention

Use PostgreSQL `snake_case`.

Examples:

```text
profiles
wallet_transactions
package_purchases
task_submissions
payment_methods
system_settings
created_at
updated_at
user_id
```

In TypeScript, Drizzle may expose camelCase property names while mapping to snake_case database columns.

Example:

```ts
createdAt -> created_at
userId -> user_id
```

Do not mix naming styles inside PostgreSQL.

---

# 4. Primary Key Strategy

Use UUID primary keys for major domain entities.

Recommended default:

```sql
gen_random_uuid()
```

Use UUID for:

- profiles
- wallets
- wallet_transactions
- packages
- package_purchases
- user_packages
- tasks
- task_submissions
- deposits
- withdrawals
- referrals
- notifications
- media_assets
- audit_logs
- payment_methods
- idempotency_records

For `profiles`, the profile ID should normally match the Supabase Auth user ID.

This allows:

```text
Supabase auth user id
        =
profiles.id
```

The backend remains responsible for ensuring the authenticated Supabase user resolves to the correct profile.

---

# 5. Timestamp Strategy

Use:

```text
TIMESTAMPTZ
```

for application timestamps.

Examples:

- created_at
- updated_at
- submitted_at
- approved_at
- rejected_at
- expires_at
- processed_at
- read_at

Store timestamps in UTC.

Return ISO 8601 timestamps from the backend.

The frontend handles localized display.

Do not store unqualified local timestamps.

---

# 6. Money Storage Strategy - Locked

All money must be stored internally as **integer minor units**.

For BDT:

```text
1 BDT = 100 paisa
```

Example:

```text
৳10.00  -> 1000
৳100.00 -> 10000
৳500.50 -> 50050
```

Use PostgreSQL:

```text
BIGINT
```

for monetary minor-unit columns.

Examples:

```text
balance_minor
amount_minor
price_minor
reward_minor
```

Do not use PostgreSQL `REAL`, `FLOAT`, or JavaScript floating-point values for authoritative financial arithmetic.

---

# 7. Money API Serialization

JavaScript `bigint` cannot be serialized directly to JSON.

Therefore, backend money helpers must convert minor-unit values safely.

Recommended API representation:

```json
{
  "amount": "100.00",
  "currency": "BDT"
}
```

Internally:

```text
10000 minor units
```

Alternatively, internal APIs may expose:

```json
{
  "amountMinor": "10000",
  "currency": "BDT"
}
```

but one format must be chosen and used consistently.

Never convert large monetary `BIGINT` values through unsafe JavaScript floating-point arithmetic.

---

# 8. Currency Strategy

Current currency:

```text
BDT
```

Use ISO currency code:

```text
CHAR(3)
```

or validated text.

Recommended default:

```text
BDT
```

Include currency on financial records where appropriate so future multi-currency support does not require destructive redesign.

---

# 9. PostgreSQL Enum Strategy

Use PostgreSQL enums for stable domain statuses.

Recommended enums include:

## user_role

```text
USER
ADMIN
SUPER_ADMIN
```

## user_status

```text
ACTIVE
SUSPENDED
BLOCKED
```

## review_status

```text
PENDING
APPROVED
REJECTED
```

## package_status

```text
ACTIVE
INACTIVE
ARCHIVED
```

## user_package_status

```text
ACTIVE
EXPIRED
CANCELLED
```

## task_status

```text
ACTIVE
INACTIVE
ARCHIVED
```

## task_type

```text
FACEBOOK
YOUTUBE
TIKTOK
WEBSITE
CONTENT
VIDEO
OTHER
```

## transaction_direction

```text
CREDIT
DEBIT
```

## wallet_transaction_type

```text
TASK_REWARD
REFERRAL_REWARD
DEPOSIT
WITHDRAWAL
WITHDRAWAL_REVERSAL
PACKAGE_PURCHASE
BONUS
ADMIN_ADJUSTMENT
```

## notification_type

```text
TASK_APPROVED
TASK_REJECTED
DEPOSIT_APPROVED
DEPOSIT_REJECTED
WITHDRAWAL_APPROVED
WITHDRAWAL_REJECTED
PACKAGE_APPROVED
PACKAGE_REJECTED
REFERRAL_REWARD
ADMIN_ANNOUNCEMENT
SYSTEM
```

Do not create enums for values expected to change frequently.

---

# 10. Core Table Overview

The initial production schema should contain:

```text
profiles
wallets
wallet_transactions

packages
package_purchases
user_packages

tasks
task_submissions

payment_methods
deposits
withdrawals

referrals

media_assets
notifications
audit_logs
system_settings
idempotency_records
```

Optional future tables should not be created prematurely unless needed.

---

# 11. Profiles Table

## Table

```text
profiles
```

## Purpose

Stores application-specific user information linked to Supabase Auth.

## Recommended Columns

```text
id                  UUID PRIMARY KEY
display_name        VARCHAR
phone               VARCHAR NULL
avatar_asset_id     UUID NULL
role                user_role NOT NULL DEFAULT USER
status              user_status NOT NULL DEFAULT ACTIVE
referral_code       VARCHAR NOT NULL UNIQUE
referred_by_user_id UUID NULL
created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

Supabase Auth remains the authoritative source for authentication identity such as email/password.

Avoid duplicating sensitive authentication fields unless there is a real application need.

---

# 12. Profile Constraints

Required:

- `referral_code` unique
- `referred_by_user_id != id`
- referral code normalized consistently
- phone length/format handled by backend validation

Recommended self-reference:

```text
referred_by_user_id -> profiles.id
```

Delete behavior should not cascade through historical financial data.

---

# 13. Profile Indexes

Recommended indexes:

```text
profiles(referral_code) UNIQUE
profiles(referred_by_user_id)
profiles(status)
profiles(role)
profiles(created_at)
```

Do not add indexes without query justification, but these are expected to be useful.

---

# 14. Wallets Table

## Table

```text
wallets
```

## Purpose

Stores the current wallet snapshot.

The ledger remains the audit source for balance changes.

## Recommended Columns

```text
id                    UUID PRIMARY KEY
user_id               UUID NOT NULL UNIQUE
balance_minor         BIGINT NOT NULL DEFAULT 0
total_earned_minor    BIGINT NOT NULL DEFAULT 0
total_withdrawn_minor BIGINT NOT NULL DEFAULT 0
currency              CHAR(3) NOT NULL DEFAULT 'BDT'
created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

## Constraints

```text
balance_minor >= 0
total_earned_minor >= 0
total_withdrawn_minor >= 0
```

One user must have exactly one wallet.

---

# 15. Wallet Snapshot Rule

`wallets.balance_minor` is a performance-friendly current snapshot.

Every change to this value must have a corresponding row in:

```text
wallet_transactions
```

Never update wallet balance silently.

---

# 16. Wallet Transactions Table

## Table

```text
wallet_transactions
```

## Recommended Columns

```text
id                  UUID PRIMARY KEY
user_id             UUID NOT NULL
wallet_id           UUID NOT NULL
type                wallet_transaction_type NOT NULL
direction           transaction_direction NOT NULL
amount_minor        BIGINT NOT NULL
currency            CHAR(3) NOT NULL DEFAULT 'BDT'

reference_type      VARCHAR NULL
reference_id        UUID NULL
idempotency_key     VARCHAR NULL

description         VARCHAR NULL

balance_before_minor BIGINT NOT NULL
balance_after_minor  BIGINT NOT NULL

created_by_user_id  UUID NULL
created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

## Constraints

```text
amount_minor > 0
balance_before_minor >= 0
balance_after_minor >= 0
```

---

# 17. Wallet Transaction Invariants

For `CREDIT`:

```text
balance_after_minor
=
balance_before_minor + amount_minor
```

For `DEBIT`:

```text
balance_after_minor
=
balance_before_minor - amount_minor
```

The backend wallet service must enforce these invariants inside a database transaction.

---

# 18. Wallet Transaction Indexes

Recommended:

```text
wallet_transactions(user_id, created_at DESC)
wallet_transactions(wallet_id, created_at DESC)
wallet_transactions(type, created_at DESC)
wallet_transactions(reference_type, reference_id)
wallet_transactions(idempotency_key) UNIQUE WHERE idempotency_key IS NOT NULL
```

The reference index makes it possible to trace:

```text
Task Submission -> Reward Transaction
Deposit -> Wallet Credit
Withdrawal -> Wallet Debit
Referral -> Referral Reward
```

---

# 19. Final Withdrawal Balance Model - Locked

Use **debit-on-request with reversal-on-reject**.

This is the finalized initial model.

## On Withdrawal Request

Inside one transaction:

```text
1. Lock/read wallet
2. Validate available balance
3. Create withdrawal record with PENDING
4. Debit wallet immediately
5. Create wallet transaction:
   type = WITHDRAWAL
   direction = DEBIT
6. Commit
```

The pending withdrawal amount is no longer spendable.

## On Approval

```text
Withdrawal status -> APPROVED
```

No second wallet debit occurs.

## On Rejection

Inside one transaction:

```text
1. Ensure withdrawal is PENDING
2. Mark withdrawal REJECTED
3. Credit wallet back
4. Create transaction:
   type = WITHDRAWAL_REVERSAL
   direction = CREDIT
5. Commit
```

This model prevents users from overspending while a withdrawal is pending.

---

# 20. Packages Table

## Table

```text
packages
```

## Recommended Columns

```text
id                       UUID PRIMARY KEY
name                     VARCHAR NOT NULL
slug                     VARCHAR NOT NULL UNIQUE
description              TEXT NULL

price_minor              BIGINT NOT NULL
currency                 CHAR(3) NOT NULL DEFAULT 'BDT'

validity_days            INTEGER NOT NULL
daily_task_limit         INTEGER NULL
daily_reward_limit_minor BIGINT NULL
referral_bonus_minor     BIGINT NULL

status                   package_status NOT NULL DEFAULT ACTIVE

sort_order               INTEGER NOT NULL DEFAULT 0

created_by_user_id       UUID NULL
created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

## Constraints

```text
price_minor >= 0
validity_days > 0
daily_task_limit > 0 when not null
daily_reward_limit_minor >= 0 when not null
referral_bonus_minor >= 0 when not null
```

---

# 21. Package Deletion Rule

Do not hard-delete packages referenced by purchase/history data.

Use:

```text
ACTIVE
INACTIVE
ARCHIVED
```

Historical purchases must remain traceable even if a package is no longer sold.

---

# 22. Package Purchases Table

## Table

```text
package_purchases
```

## Purpose

Tracks each attempt to purchase a package.

## Recommended Columns

```text
id                       UUID PRIMARY KEY
user_id                  UUID NOT NULL
package_id               UUID NOT NULL

package_name_snapshot    VARCHAR NOT NULL
package_price_minor      BIGINT NOT NULL
currency                 CHAR(3) NOT NULL DEFAULT 'BDT'

payment_method_id        UUID NULL
payment_transaction_id   VARCHAR NULL
payment_transaction_norm VARCHAR NULL
payment_proof_asset_id   UUID NULL

status                   review_status NOT NULL DEFAULT PENDING

admin_note               TEXT NULL
reviewed_by_user_id      UUID NULL
reviewed_at              TIMESTAMPTZ NULL

created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

Snapshots preserve historical truth even if package name/price changes later.

---

# 23. Package Purchase Constraints and Indexes

Recommended:

```text
package_purchases(user_id, created_at DESC)
package_purchases(package_id, created_at DESC)
package_purchases(status, created_at)
```

If manual payment transaction IDs are used:

```text
UNIQUE(payment_method_id, payment_transaction_norm)
WHERE payment_transaction_norm IS NOT NULL
```

This helps prevent the same external payment from being reused.

---

# 24. User Packages Table

## Table

```text
user_packages
```

## Purpose

Represents package entitlement after purchase approval.

## Recommended Columns

```text
id                  UUID PRIMARY KEY
user_id             UUID NOT NULL
package_id          UUID NOT NULL
package_purchase_id UUID NOT NULL UNIQUE

status              user_package_status NOT NULL DEFAULT ACTIVE

started_at          TIMESTAMPTZ NOT NULL
expires_at          TIMESTAMPTZ NOT NULL

created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

## Constraint

```text
expires_at > started_at
```

---

# 25. One Active Package Rule

For initial Digonto rules, assume one active package per user.

Use a partial unique index:

```text
UNIQUE(user_id)
WHERE status = 'ACTIVE'
```

Before activating a new package, the backend must expire/cancel the previous active record according to business rules.

If future business rules allow package stacking, this constraint must be intentionally redesigned.

---

# 26. Tasks Table

## Table

```text
tasks
```

## Recommended Columns

```text
id                  UUID PRIMARY KEY
title               VARCHAR NOT NULL
description         TEXT NULL
instructions        TEXT NOT NULL

type                task_type NOT NULL
target_url          TEXT NULL

reward_minor        BIGINT NOT NULL
currency            CHAR(3) NOT NULL DEFAULT 'BDT'

required_package_id UUID NULL

requires_screenshot BOOLEAN NOT NULL DEFAULT TRUE

daily_limit         INTEGER NULL
starts_at           TIMESTAMPTZ NULL
ends_at             TIMESTAMPTZ NULL

status              task_status NOT NULL DEFAULT ACTIVE

created_by_user_id  UUID NULL
created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

## Constraints

```text
reward_minor >= 0
daily_limit > 0 when not null
ends_at > starts_at when both exist
```

---

# 27. Task Indexes

Recommended:

```text
tasks(status, type)
tasks(required_package_id)
tasks(created_at DESC)
tasks(starts_at, ends_at)
```

Search indexes can be added later if task volume becomes large.

---

# 28. Task Submissions Table

## Table

```text
task_submissions
```

## Recommended Columns

```text
id                    UUID PRIMARY KEY
task_id               UUID NOT NULL
user_id               UUID NOT NULL

proof_asset_id        UUID NULL
user_note             TEXT NULL

status                review_status NOT NULL DEFAULT PENDING

reward_minor_snapshot BIGINT NOT NULL
currency              CHAR(3) NOT NULL DEFAULT 'BDT'

rejection_reason      TEXT NULL

reviewed_by_user_id   UUID NULL
reviewed_at            TIMESTAMPTZ NULL

submitted_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

The reward snapshot protects historical records if task reward changes later.

---

# 29. Task Submission Duplicate Strategy

Allow a future retry after rejection while preventing multiple active submissions.

Recommended partial unique index:

```text
UNIQUE(user_id, task_id)
WHERE status IN ('PENDING', 'APPROVED')
```

This means:

- User cannot create another submission while one is pending.
- User cannot resubmit an already approved task.
- A rejected task may be retried later if backend business rules allow it.

If retry is not allowed, backend can reject it even though the schema technically permits it.

---

# 30. Task Submission Indexes

Recommended:

```text
task_submissions(user_id, submitted_at DESC)
task_submissions(task_id, submitted_at DESC)
task_submissions(status, submitted_at)
task_submissions(reviewed_by_user_id)
```

---

# 31. Media Assets Table

## Table

```text
media_assets
```

## Purpose

Stores controlled Cloudinary metadata.

## Recommended Columns

```text
id              UUID PRIMARY KEY
owner_user_id   UUID NULL
purpose         VARCHAR NOT NULL

public_id       VARCHAR NOT NULL UNIQUE
secure_url      TEXT NOT NULL

resource_type   VARCHAR NOT NULL DEFAULT 'image'
format          VARCHAR NULL
bytes           BIGINT NULL
width           INTEGER NULL
height          INTEGER NULL

created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
deleted_at      TIMESTAMPTZ NULL
```

Possible `purpose` values:

```text
TASK_PROOF
DEPOSIT_PROOF
PACKAGE_PAYMENT_PROOF
PROFILE_AVATAR
OTHER
```

Use backend validation rather than unrestricted user-defined values.

---

# 32. Media Storage Rule

PostgreSQL stores only Cloudinary metadata.

Actual image bytes remain in Cloudinary.

Do not store base64 images or binary screenshots in PostgreSQL.

---

# 33. Payment Methods Table

## Table

```text
payment_methods
```

## Purpose

Stores admin-configurable manual payment options.

Examples:

- bKash
- Nagad
- Rocket
- Bank

## Recommended Columns

```text
id                   UUID PRIMARY KEY
code                 VARCHAR NOT NULL UNIQUE
display_name         VARCHAR NOT NULL
account_label        VARCHAR NULL
account_value        VARCHAR NULL
instructions         TEXT NULL

is_deposit_enabled   BOOLEAN NOT NULL DEFAULT TRUE
is_package_enabled   BOOLEAN NOT NULL DEFAULT TRUE
is_withdraw_enabled  BOOLEAN NOT NULL DEFAULT FALSE

status               VARCHAR NOT NULL DEFAULT 'ACTIVE'
sort_order           INTEGER NOT NULL DEFAULT 0

created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

Sensitive operational details should only be exposed through appropriate backend serializers.

---

# 34. Deposits Table

## Table

```text
deposits
```

## Recommended Columns

```text
id                       UUID PRIMARY KEY
user_id                  UUID NOT NULL

amount_minor             BIGINT NOT NULL
currency                 CHAR(3) NOT NULL DEFAULT 'BDT'

payment_method_id        UUID NOT NULL
sender_reference         VARCHAR NULL

transaction_id           VARCHAR NOT NULL
transaction_id_norm      VARCHAR NOT NULL

proof_asset_id           UUID NULL

status                   review_status NOT NULL DEFAULT PENDING

admin_note               TEXT NULL
reviewed_by_user_id      UUID NULL
reviewed_at              TIMESTAMPTZ NULL

created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

## Constraint

```text
amount_minor > 0
```

---

# 35. Deposit Transaction Uniqueness

Use:

```text
UNIQUE(payment_method_id, transaction_id_norm)
```

The backend must normalize supported transaction IDs consistently before insert.

This prevents one external payment transaction from crediting multiple accounts through normal application flow.

---

# 36. Deposit Indexes

Recommended:

```text
deposits(user_id, created_at DESC)
deposits(status, created_at)
deposits(payment_method_id, transaction_id_norm) UNIQUE
```

---

# 37. Withdrawals Table

## Table

```text
withdrawals
```

## Recommended Columns

```text
id                    UUID PRIMARY KEY
user_id               UUID NOT NULL

amount_minor          BIGINT NOT NULL
currency              CHAR(3) NOT NULL DEFAULT 'BDT'

payment_method_id     UUID NOT NULL

account_value_enc     TEXT NOT NULL
account_last4         VARCHAR NULL

status                review_status NOT NULL DEFAULT PENDING

wallet_transaction_id UUID NOT NULL UNIQUE
reversal_transaction_id UUID NULL UNIQUE

admin_note            TEXT NULL
reviewed_by_user_id   UUID NULL
reviewed_at            TIMESTAMPTZ NULL

created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

## Constraint

```text
amount_minor > 0
```

---

# 38. Withdrawal Account Privacy

Do not store only the masked account value if operations require the full destination.

Recommended:

- Encrypt the full withdrawal destination at application level before storing in `account_value_enc`.
- Store only the final digits separately in `account_last4` for safe display.

Example user display:

```text
017******45
```

The encryption key must live in backend secrets, not PostgreSQL rows and not frontend code.

If application-level encryption is not implemented initially, treat full account values as sensitive and restrict all exposure strictly.

---

# 39. Withdrawal Indexes

Recommended:

```text
withdrawals(user_id, created_at DESC)
withdrawals(status, created_at)
withdrawals(wallet_transaction_id) UNIQUE
withdrawals(reversal_transaction_id) UNIQUE WHERE reversal_transaction_id IS NOT NULL
```

---

# 40. Referrals Table

## Table

```text
referrals
```

## Purpose

Tracks referral relationships and reward qualification.

## Recommended Columns

```text
id                     UUID PRIMARY KEY

referrer_user_id       UUID NOT NULL
referred_user_id       UUID NOT NULL UNIQUE

referral_code_snapshot VARCHAR NOT NULL

qualified_at           TIMESTAMPTZ NULL
rewarded_at            TIMESTAMPTZ NULL

reward_minor           BIGINT NULL
currency               CHAR(3) NOT NULL DEFAULT 'BDT'

reward_transaction_id  UUID NULL UNIQUE

created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

## Constraints

```text
referrer_user_id != referred_user_id
reward_minor >= 0 when not null
```

---

# 41. Referral Integrity

A referred user can only belong to one referrer.

Enforce:

```text
UNIQUE(referred_user_id)
```

The reward transaction must also be unique.

This makes repeated referral reward execution safe.

---

# 42. Referral Indexes

Recommended:

```text
referrals(referrer_user_id, created_at DESC)
referrals(referred_user_id) UNIQUE
referrals(reward_transaction_id) UNIQUE WHERE reward_transaction_id IS NOT NULL
```

---

# 43. Notifications Table

## Table

```text
notifications
```

## Recommended Columns

```text
id             UUID PRIMARY KEY
user_id        UUID NOT NULL

type           notification_type NOT NULL
title          VARCHAR NOT NULL
message        TEXT NOT NULL

reference_type VARCHAR NULL
reference_id   UUID NULL

read_at        TIMESTAMPTZ NULL
created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

## Indexes

```text
notifications(user_id, created_at DESC)
notifications(user_id, read_at, created_at DESC)
```

---

# 44. Audit Logs Table

## Table

```text
audit_logs
```

## Purpose

Immutable operational history for sensitive actions.

## Recommended Columns

```text
id             UUID PRIMARY KEY

actor_user_id  UUID NULL

action         VARCHAR NOT NULL
entity_type    VARCHAR NOT NULL
entity_id      UUID NULL

reason         TEXT NULL

previous_data  JSONB NULL
new_data       JSONB NULL

request_id     VARCHAR NULL
ip_address     INET NULL

created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

Use `JSONB` only for snapshots that are useful for auditing.

Do not place secrets or full sensitive financial destination data inside audit JSON.

---

# 45. Audit Log Rule

Audit logs must be append-only from normal application workflows.

Do not expose update/delete endpoints for normal admins.

Important actions include:

- Task approval/rejection
- Deposit approval/rejection
- Withdrawal approval/rejection
- Package approval/rejection
- Wallet adjustment
- User suspension/reactivation
- Package configuration change
- Task configuration change
- System settings change

---

# 46. Audit Log Indexes

Recommended:

```text
audit_logs(actor_user_id, created_at DESC)
audit_logs(entity_type, entity_id, created_at DESC)
audit_logs(action, created_at DESC)
audit_logs(created_at DESC)
```

---

# 47. System Settings Table

## Table

```text
system_settings
```

## Recommended Columns

```text
key          VARCHAR PRIMARY KEY
value        JSONB NOT NULL
description  TEXT NULL
is_public    BOOLEAN NOT NULL DEFAULT FALSE

updated_by_user_id UUID NULL
created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

Recommended setting keys may include:

```text
withdrawal_rules
referral_rules
feature_flags
support_info
maintenance_mode
platform_announcement
```

Do not store secrets in `system_settings`.

Secrets belong in Railway/Supabase environment variables.

---

# 48. Idempotency Records Table

## Table

```text
idempotency_records
```

## Purpose

Provides request-level replay protection for critical mutation APIs when needed.

## Recommended Columns

```text
id               UUID PRIMARY KEY
key              VARCHAR NOT NULL UNIQUE

user_id          UUID NULL
scope            VARCHAR NOT NULL

request_hash     VARCHAR NULL

response_code    INTEGER NULL
response_body    JSONB NULL

expires_at       TIMESTAMPTZ NULL
created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

Potential scopes:

```text
TASK_APPROVAL
DEPOSIT_APPROVAL
WITHDRAWAL_REQUEST
WITHDRAWAL_REVIEW
PACKAGE_APPROVAL
WALLET_ADJUSTMENT
```

Database-level unique constraints remain mandatory even when idempotency records are used.

---

# 49. Foreign Key Strategy

Use foreign keys for relational integrity.

Important relationships:

```text
wallets.user_id
    -> profiles.id

wallet_transactions.user_id
    -> profiles.id

wallet_transactions.wallet_id
    -> wallets.id

package_purchases.user_id
    -> profiles.id

package_purchases.package_id
    -> packages.id

user_packages.user_id
    -> profiles.id

user_packages.package_id
    -> packages.id

user_packages.package_purchase_id
    -> package_purchases.id

task_submissions.task_id
    -> tasks.id

task_submissions.user_id
    -> profiles.id

deposits.user_id
    -> profiles.id

withdrawals.user_id
    -> profiles.id

referrals.referrer_user_id
    -> profiles.id

referrals.referred_user_id
    -> profiles.id

notifications.user_id
    -> profiles.id
```

---

# 50. Delete Behavior Strategy

Financial and historical records must not disappear accidentally.

Prefer:

```text
ON DELETE RESTRICT
```

or:

```text
ON DELETE NO ACTION
```

for:

- wallet transactions
- deposits
- withdrawals
- package purchases
- user packages
- task submissions
- referrals
- audit logs

Use deactivation/archive states instead of destructive deletion.

---

# 51. Hard Delete Rules

Do not hard-delete:

- wallet transactions
- approved/rejected deposits
- withdrawals
- package purchases
- user packages with history
- task submissions
- referral rewards
- audit logs

Packages and tasks should normally be archived/deactivated.

Media assets should use `deleted_at` when cleanup is needed.

---

# 52. Supabase Auth Relationship

Supabase Auth remains separate from application data.

Recommended model:

```text
auth.users.id
       |
       | same UUID identity
       v
profiles.id
```

The Hono backend verifies the Supabase token and then loads:

```text
profiles.id = authenticated Supabase user id
```

Do not let frontend choose a different profile ID.

---

# 53. Row Level Security - Required Defense

Because Supabase may expose tables through its Data API, application tables must not be openly readable/writable from the browser.

For v1:

- Enable RLS on all application tables in the Supabase `public` schema.
- Do not create permissive `anon` or `authenticated` policies for core application tables.
- Route application data access through the Hono backend.
- Frontend Supabase usage is for Auth only.

This creates defense-in-depth if someone attempts to query Supabase tables directly with the public anon key.

If the project later intentionally allows direct Supabase table access, create narrow RLS policies explicitly and review them carefully.

---

# 54. RLS and Railway Backend

The Railway backend connects to PostgreSQL using a trusted server-side database connection.

The database connection must be configured so backend operations have the required access.

Do not solve backend permission issues by creating broad anonymous RLS policies.

---

# 55. Database Roles and Least Privilege

Production should avoid unnecessary privilege.

At minimum:

- Frontend: no direct DB credentials
- Hono backend: server-side DB credentials only
- Supabase anon key: frontend Auth only
- Supabase service role: backend only and only if required

Never expose database password or service role to the browser.

---

# 56. Required Database Constraints

Application validation is not enough.

Important invariants must also exist in PostgreSQL.

Examples:

```text
wallet user unique
referral code unique
referred user unique
deposit transaction unique
package purchase payment transaction unique where applicable
withdrawal wallet transaction unique
referral reward transaction unique
active task submission unique
positive financial amounts
nonnegative wallet balance
valid package dates
valid task date ranges
```

The database must protect critical invariants even if a backend bug occurs.

---

# 57. Check Constraints

Recommended examples:

```text
wallets.balance_minor >= 0

packages.price_minor >= 0

tasks.reward_minor >= 0

deposits.amount_minor > 0

withdrawals.amount_minor > 0

wallet_transactions.amount_minor > 0

user_packages.expires_at > user_packages.started_at

tasks.ends_at > tasks.starts_at
when both are not null
```

---

# 58. Updated At Strategy

Every mutable domain table should have:

```text
created_at
updated_at
```

The backend should explicitly update `updated_at` during writes.

A database trigger may be introduced later, but do not mix trigger-managed and application-managed timestamps unpredictably.

---

# 59. Transaction Isolation and Concurrency

Financial operations must use transactions.

For balance-changing operations, use locking/guarded update techniques as required.

Critical concurrency cases:

- Two withdrawal requests at once
- Two admins approving one deposit
- Two admins approving one task
- Two referral qualification events
- Repeated package approval
- Manual wallet adjustment during another financial mutation

The database design must support safe atomic operations.

---

# 60. Wallet Mutation Transaction Pattern

Conceptual:

```text
BEGIN

SELECT wallet
FOR UPDATE

validate balance/current state

INSERT domain state change

UPDATE wallet snapshot

INSERT wallet transaction

INSERT notification if needed

INSERT audit log if needed

COMMIT
```

If any critical step fails:

```text
ROLLBACK
```

---

# 61. Task Approval Transaction Pattern

```text
BEGIN

lock/load task submission

ensure status = PENDING

load reward snapshot

lock wallet

credit wallet

insert wallet transaction

update task submission -> APPROVED

insert notification

insert audit log

COMMIT
```

The reward must never be credited twice.

---

# 62. Deposit Approval Transaction Pattern

```text
BEGIN

lock/load deposit

ensure status = PENDING

lock wallet

credit wallet

insert wallet transaction

update deposit -> APPROVED

insert notification

insert audit log

COMMIT
```

Repeat approval must fail safely.

---

# 63. Withdrawal Request Transaction Pattern

```text
BEGIN

lock wallet

validate balance

create withdrawal PENDING

debit wallet

insert WITHDRAWAL wallet transaction

attach wallet transaction to withdrawal

COMMIT
```

The amount becomes unavailable immediately.

---

# 64. Withdrawal Rejection Transaction Pattern

```text
BEGIN

lock withdrawal

ensure status = PENDING

lock wallet

credit amount back

insert WITHDRAWAL_REVERSAL transaction

update withdrawal -> REJECTED

store reversal transaction id

insert notification

insert audit log

COMMIT
```

---

# 65. Withdrawal Approval Pattern

```text
BEGIN

lock withdrawal

ensure status = PENDING

update withdrawal -> APPROVED

insert notification

insert audit log

COMMIT
```

No second wallet debit is performed because the debit already occurred when the request was created.

---

# 66. Referral Reward Transaction Pattern

```text
BEGIN

lock referral

ensure qualified

ensure rewarded_at is null

lock referrer wallet

read referral reward amount

credit wallet

insert wallet transaction

set rewarded_at

store reward_transaction_id

insert notification

COMMIT
```

Unique constraints protect against duplicate reward issuance.

---

# 67. Package Approval Transaction Pattern

```text
BEGIN

lock package purchase

ensure status = PENDING

expire/cancel existing active package if required

create user package

mark purchase APPROVED

insert notification

insert audit log

COMMIT
```

If referral qualification depends on package approval, invoke the referral qualification logic inside the same controlled workflow or through a safe idempotent follow-up.

---

# 68. Historical Snapshots

For records where source data may later change, store snapshots.

Examples:

Package purchase:

```text
package_name_snapshot
package_price_minor
```

Task submission:

```text
reward_minor_snapshot
```

Potential future:

```text
task_title_snapshot
payment_method_name_snapshot
```

Do not over-snapshot every field.

Store what is necessary for historical truth.

---

# 69. Search Strategy

Initial search can use standard indexed fields.

Examples:

- profiles.referral_code
- payment transaction ID
- package slug
- user ID
- task title

For large-scale text search later, consider:

- `pg_trgm`
- PostgreSQL full-text search

Do not introduce advanced search infrastructure before it is needed.

---

# 70. Pagination Strategy

All potentially large lists must use pagination.

Examples:

- transactions
- task submissions
- deposits
- withdrawals
- notifications
- audit logs
- admin users
- package purchases

Initial API can use:

```text
page + limit
```

For very large tables later, cursor pagination may be introduced.

Indexes must support common pagination ordering such as:

```text
created_at DESC
```

---

# 71. Reporting Strategy

Do not create report tables initially.

Admin reports should use optimized aggregate queries from source tables.

Examples:

```text
COUNT profiles
SUM deposits
SUM withdrawals
COUNT task_submissions
SUM task rewards
COUNT package purchases
```

If reporting becomes heavy later, introduce:

- materialized views
- daily aggregate tables
- scheduled aggregation

only when justified by real load.

---

# 72. Database Views

Views may be added for repeated complex read models.

Potential future examples:

```text
active_user_packages_view
wallet_summary_view
admin_transaction_feed_view
```

Do not hide critical write logic inside views.

---

# 73. JSONB Usage

Use `JSONB` only when data is genuinely flexible.

Good uses:

- system setting values
- audit snapshots
- optional structured metadata

Avoid storing core relational data in JSONB.

Bad examples:

- all package fields in JSON
- all wallet transactions in one JSON array
- referral list inside profile JSON

Core business data must remain relational.

---

# 74. Database Security for Sensitive Data

Never store:

- passwords
- raw Supabase access tokens
- Cloudinary API secret
- Railway credentials
- database password
- encryption keys

These belong in secure environment variables or the authentication provider.

---

# 75. Personal/Financial Data Minimization

Store only what the product needs.

For example:

- Do not store unnecessary browser fingerprint data.
- Do not duplicate user email in many tables.
- Do not copy full withdrawal account values into audit logs.
- Do not store entire Cloudinary response objects.

---

# 76. Data Retention

Financial and audit records should remain traceable.

If account deletion is introduced later:

- authentication identity deletion
- profile anonymization
- financial record retention
- audit retention

must be handled deliberately.

Do not cascade-delete financial history when an auth user is removed.

---

# 77. Soft Deletion / Archiving

Use status fields or `deleted_at` for records that should disappear from normal UI but remain traceable.

Recommended:

- packages -> ARCHIVED
- tasks -> ARCHIVED
- media assets -> deleted_at
- payment methods -> INACTIVE

Avoid adding `deleted_at` everywhere without a use case.

---

# 78. Development Seed Data

Development seed may create:

- one normal user profile
- one admin profile
- one super admin profile
- sample wallet
- sample packages
- sample tasks
- payment methods
- baseline settings

Do not seed production with known passwords or test identities.

Supabase Auth identities should be handled separately from DB-only seed rows.

---

# 79. Baseline Payment Methods

Development examples may include:

```text
BKASH
NAGAD
ROCKET
BANK
```

Do not hardcode these forever in application logic.

Use the `payment_methods` table so admins can enable/disable options.

---

# 80. Baseline System Settings

Recommended initial values:

```text
withdrawal_rules
referral_rules
feature_flags
maintenance_mode
support_info
```

Example conceptual `withdrawal_rules` value:

```json
{
  "minimumMinor": "10000",
  "maximumMinor": "5000000"
}
```

Do not treat example values as final business decisions.

---

# 81. Migration Strategy

Use Drizzle Kit migrations.

Workflow:

```text
1. Edit Drizzle schema
2. Generate migration
3. Review generated SQL
4. Run migration in development
5. Test
6. Apply to staging/production deliberately
```

Do not rely on unreviewed schema push in production.

---

# 82. Production Migration Rules

Never:

- drop financial tables casually
- change money column types without a migration plan
- remove enum values carelessly
- delete migration history
- run destructive migrations automatically at every app boot

Before risky migrations:

- create backup
- review SQL
- plan rollback
- test against realistic data

---

# 83. Migration Naming

Use descriptive migration names.

Examples:

```text
0001_create_core_profiles_wallets
0002_create_packages
0003_create_tasks_and_submissions
0004_create_deposits_withdrawals
0005_create_referrals_notifications
```

Avoid meaningless names when the tooling permits descriptive naming.

---

# 84. Database Backup Strategy

Supabase production backup capabilities should be enabled according to the selected plan.

Before major production migrations:

- confirm recent backup
- verify rollback plan
- avoid destructive manual edits

Financial data should never depend on a single unverified copy.

---

# 85. Drizzle Schema Organization

Recommended package structure:

```text
packages/db/
|
|-- src/
|   |-- schema/
|   |   |-- enums.ts
|   |   |-- profiles.ts
|   |   |-- wallets.ts
|   |   |-- packages.ts
|   |   |-- tasks.ts
|   |   |-- payments.ts
|   |   |-- referrals.ts
|   |   |-- notifications.ts
|   |   |-- audit.ts
|   |   `-- index.ts
|   |
|   |-- relations/
|   |-- client.ts
|   `-- index.ts
|
|-- drizzle/
|-- drizzle.config.ts
`-- package.json
```

Do not put the entire schema into one massive file.

---

# 86. Drizzle Relations

Define typed relations for developer ergonomics.

Examples:

```text
profile -> wallet
profile -> package purchases
profile -> user packages
profile -> task submissions
profile -> deposits
profile -> withdrawals
profile -> referrals
profile -> notifications

package -> purchases
package -> user packages
package -> tasks

task -> submissions
```

Relations improve querying but do not replace actual PostgreSQL foreign keys.

---

# 87. Database Type Exports

Export Drizzle inferred types where useful.

Examples:

```text
Profile
NewProfile
Wallet
WalletTransaction
Package
Task
TaskSubmission
Deposit
Withdrawal
Referral
```

Do not duplicate these database row types manually in many modules.

API DTOs may still differ from database models.

---

# 88. API DTO vs Database Row

Never automatically expose full database rows to clients.

Create serializers/DTOs.

Example:

Database withdrawal may contain:

```text
account_value_enc
```

User API response should contain:

```text
maskedAccount
```

Database profile may contain internal fields not intended for normal user response.

---

# 89. Unique Business Keys

Use database uniqueness for stable identifiers.

Examples:

```text
profiles.referral_code
packages.slug
payment_methods.code
media_assets.public_id
system_settings.key
idempotency_records.key
```

Use normalized versions of external transaction IDs for uniqueness.

---

# 90. Referential Integrity Over Convenience

Do not create dangling references.

If a wallet transaction references a deposit or withdrawal, keep both records.

If a task is archived, historical task submissions must continue to reference it.

If a package is archived, historical purchases must remain valid.

---

# 91. Database Error Mapping

Backend must translate common database failures into stable domain errors.

Examples:

Unique violation:

```text
DUPLICATE_TRANSACTION_ID
REFERRAL_ALREADY_EXISTS
IDEMPOTENCY_CONFLICT
```

Foreign key violation:

```text
INVALID_REFERENCE
```

Check violation:

```text
INVALID_AMOUNT
```

Do not expose PostgreSQL internal constraint text directly to users.

---

# 92. Constraints Naming

Use explicit constraint/index names where practical.

Examples:

```text
wallets_user_id_unique
profiles_referral_code_unique
deposits_payment_tx_unique
task_submissions_active_unique
referrals_referred_user_unique
wallet_transactions_idempotency_unique
```

Clear names make production error diagnosis easier.

---

# 93. Admin Query Indexes

Admin pages commonly query by:

- status
- created_at
- user_id
- type
- transaction ID

Indexes should support these patterns.

Avoid indexing every column.

Indexes improve reads but increase write/storage cost.

---

# 94. Future Tables - Do Not Build Yet Unless Needed

Potential future modules:

```text
daily_bonus_claims
promo_codes
gift_codes
leaderboard_snapshots
task_categories
support_tickets
email_delivery_logs
sms_delivery_logs
device_sessions
feature_experiments
```

Design current foreign keys/types so these can be added cleanly later.

Do not create empty speculative tables without a real feature.

---

# 95. Future Mobile App Compatibility

No mobile app is required now.

However, database design must remain API-first.

Do not create schema assumptions tied specifically to Next.js.

Future clients should be able to use the same backend and database model.

---

# 96. Database Testing Requirements

Database tests should verify:

- wallet cannot go negative
- duplicate referral code fails
- referred user can only have one referrer
- duplicate deposit transaction fails
- duplicate active task submission fails
- duplicate referral reward transaction fails
- one active package per user
- withdrawal references one debit transaction
- financial amounts cannot be zero/negative where prohibited
- transaction rollback preserves consistency

---

# 97. Financial Consistency Tests

Test scenarios:

## Task Approval

After approval:

```text
submission = APPROVED
wallet increased once
one TASK_REWARD transaction exists
```

## Deposit Approval

After approval:

```text
deposit = APPROVED
wallet increased once
one DEPOSIT transaction exists
```

## Withdrawal Request

After request:

```text
withdrawal = PENDING
wallet reduced once
one WITHDRAWAL transaction exists
```

## Withdrawal Rejection

After rejection:

```text
withdrawal = REJECTED
wallet restored
one WITHDRAWAL_REVERSAL exists
```

## Withdrawal Approval

After approval:

```text
withdrawal = APPROVED
no second debit exists
```

## Referral Reward

After qualification:

```text
rewarded_at set
wallet increased once
one REFERRAL_REWARD transaction exists
```

---

# 98. Production Data Integrity Rule

If the application layer and database disagree, database constraints must prevent invalid critical states wherever reasonably possible.

Application validation provides good UX.

Database constraints provide final integrity.

Both are required.

---

# 99. AI Agent Database Implementation Rules

When an AI coding agent receives this file:

1. Read `Digonto_Master_Context.md`.
2. Read `Digonto_Master_Phase.md`.
3. Read `Digonto_Backend_Context.md`.
4. Read this Database Context completely.
5. Inspect existing Drizzle schema and migrations before editing.
6. Do not create a competing schema structure.
7. Use PostgreSQL constraints for critical invariants.
8. Use BIGINT minor units for money.
9. Never use float for financial storage.
10. Use TIMESTAMPTZ for timestamps.
11. Use UUIDs consistently.
12. Do not expose application tables directly to frontend.
13. Keep RLS enabled as defense-in-depth when using Supabase public schema.
14. Keep financial history immutable.
15. Do not hard-delete financial/audit records.
16. Add indexes based on actual query patterns.
17. Use descriptive migration names.
18. Review migration SQL before production.
19. Keep schema modular.
20. Preserve future API/mobile compatibility.

At the end of each database implementation phase, report:

- Tables created
- Columns created/changed
- Enums created/changed
- Foreign keys added
- Unique constraints added
- Check constraints added
- Indexes added
- RLS changes
- Migration files created
- Seed data changes
- Breaking changes
- Rollback considerations
- Backend code affected
- Tests required

---

# 100. Database Definition of Done

The database layer is complete when:

- Supabase PostgreSQL is connected.
- Drizzle schema is modular and typed.
- Migrations are reproducible.
- Profiles map safely to Supabase Auth users.
- Every user has one wallet.
- Wallet uses integer minor units.
- Wallet ledger is auditable.
- Packages and purchases are relational.
- User package activation/history is preserved.
- Tasks and submissions are relational.
- Task rewards are snapshotted.
- Cloudinary metadata is stored safely.
- Payment methods are configurable.
- Deposit transaction IDs are protected against reuse.
- Withdrawal debit/reversal model is enforced.
- Referrals are unique and reward-safe.
- Notifications work relationally.
- Audit logs are append-only in normal application flow.
- Critical database constraints exist.
- Relevant indexes exist.
- RLS blocks direct anonymous application-table access.
- Financial records cannot be accidentally deleted.
- Production migration strategy is documented.
- Critical financial transaction tests pass.

---

# Final Database Principle

The database must not merely store data.

It must actively protect Digonto's most important invariants.

Every schema decision should support:

- correctness
- financial safety
- historical traceability
- secure access
- reliable relationships
- controlled growth
- maintainable migrations
- future expansion

The application can evolve, but the database must preserve the truth.
