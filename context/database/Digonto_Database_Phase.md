# Digonto Platform - Database Phase Plan

## Purpose

This document defines the complete database implementation roadmap for the **Digonto Platform**.

Use this file together with:

- `Digonto_Master_Context.md`
- `Digonto_Master_Phase.md`
- `Digonto_Backend_Context.md`
- `Digonto_Backend_Phase.md`
- `Digonto_Database_Context.md`

The goal is to build the database in controlled phases so an AI coding agent can implement the schema, constraints, migrations, indexes, seed data, and financial integrity rules step by step without introducing inconsistencies or unsafe financial behavior.

The database stack is locked as:

- PostgreSQL
- Supabase PostgreSQL
- Drizzle ORM
- Drizzle Kit
- Hono.js backend
- Supabase Auth
- Cloudinary for media storage

The database must be:

- Relational
- Auditable
- Transaction-safe
- Financially consistent
- Strictly constrained
- Migration-safe
- Secure
- Easy to query
- Future-ready

---

# Global Database Execution Rules

Before working on any database phase:

1. Read `Digonto_Master_Context.md`.
2. Read `Digonto_Master_Phase.md`.
3. Read `Digonto_Backend_Context.md`.
4. Read `Digonto_Backend_Phase.md`.
5. Read `Digonto_Database_Context.md`.
6. Inspect all existing schema files and migrations before making changes.
7. Never edit production data manually without a controlled migration or operational procedure.
8. Use UUID primary keys consistently.
9. Use `TIMESTAMPTZ` for timestamps.
10. Use `BIGINT` minor units for money.
11. Never use floating-point columns for financial values.
12. Enforce critical business rules at database level where possible.
13. Use foreign keys.
14. Use explicit unique constraints.
15. Use check constraints for valid amounts/ranges.
16. Use indexes based on real query patterns.
17. Do not hard-delete financial or audit records.
18. Keep Supabase RLS enabled for defense-in-depth.
19. Do not expose application tables directly to frontend clients.
20. Review every generated migration before applying it outside development.

---

# Phase D0 - Database Architecture Lock

## Objective

Finalize database conventions before creating schema.

## Confirm

- PostgreSQL provider
- Drizzle package structure
- primary key strategy
- timestamp strategy
- money strategy
- enum strategy
- foreign key behavior
- deletion strategy
- indexing strategy
- migration workflow
- RLS strategy
- seed strategy

## Locked Standards

```text
Primary Keys:
UUID

Timestamps:
TIMESTAMPTZ

Money:
BIGINT minor units

Currency:
BDT initially

Naming:
snake_case

ORM:
Drizzle ORM

Migrations:
Drizzle Kit
```

## Deliverables

- Database conventions document
- schema folder structure
- migration folder structure

## Exit Criteria

- No unresolved schema convention remains.
- Money and timestamp strategies are locked.

---

# Phase D1 - Drizzle Database Package Setup

## Objective

Create the database package used by the backend.

## Recommended Structure

```text
packages/db/
|
|-- src/
|   |-- schema/
|   |-- relations/
|   |-- client.ts
|   `-- index.ts
|
|-- drizzle/
|-- drizzle.config.ts
|-- package.json
`-- tsconfig.json
```

## Tasks

- Install Drizzle ORM
- Install Drizzle Kit
- Configure PostgreSQL driver
- Configure database URL
- Configure schema path
- Configure migrations output
- Export database client
- Export schema

## Deliverables

- Working DB package
- Drizzle config
- schema entry point
- migration command

## Exit Criteria

- Backend can import the database package.
- Drizzle config resolves correctly.

---

# Phase D2 - PostgreSQL Connection Verification

## Objective

Verify Supabase PostgreSQL connectivity.

## Tasks

- Configure `DATABASE_URL`
- Configure SSL if required
- Test connection
- Test simple query
- Verify connection reuse
- Ensure backend does not create a new DB client per request

## Deliverables

- Shared connection client
- connectivity check

## Exit Criteria

- Railway-like environment can connect.
- Database connection errors are handled safely.

---

# Phase D3 - Core PostgreSQL Enums

## Objective

Create stable domain enums first.

## Enums

Create as finalized:

```text
user_role
user_status
review_status
package_status
user_package_status
task_status
task_type
transaction_direction
wallet_transaction_type
notification_type
```

## Rules

- Use enums only for stable values.
- Do not use enums for frequently changing settings.
- Keep enum names consistent with backend constants.

## Deliverables

- `enums.ts`
- migration creating enums

## Exit Criteria

- Backend shared types align with DB enum values.

---

# Phase D4 - Profiles Schema

## Objective

Create application profiles linked to Supabase Auth.

## Table

```text
profiles
```

## Core Fields

```text
id
display_name
phone
avatar_asset_id
role
status
referral_code
referred_by_user_id
created_at
updated_at
```

## Constraints

- primary key on `id`
- unique `referral_code`
- self-referral check
- self-reference FK for `referred_by_user_id`

## Indexes

```text
referral_code
referred_by_user_id
status
role
created_at
```

## Deliverables

- profile schema
- relations
- migration

## Exit Criteria

- Profile can map exactly to Supabase Auth user ID.
- Referral code uniqueness is enforced.

---

# Phase D5 - Wallet Schema

## Objective

Create one wallet per user.

## Table

```text
wallets
```

## Fields

```text
id
user_id
balance_minor
total_earned_minor
total_withdrawn_minor
currency
created_at
updated_at
```

## Constraints

- one wallet per user
- nonnegative balances
- currency default BDT

## Indexes

```text
user_id UNIQUE
```

## Deliverables

- wallet schema
- profile/wallet relation

## Exit Criteria

- Database rejects duplicate wallets.
- Wallet cannot store negative snapshot values.

---

# Phase D6 - Wallet Ledger Schema

## Objective

Create immutable financial history.

## Table

```text
wallet_transactions
```

## Fields

```text
id
user_id
wallet_id
type
direction
amount_minor
currency
reference_type
reference_id
idempotency_key
description
balance_before_minor
balance_after_minor
created_by_user_id
created_at
```

## Constraints

- amount > 0
- balances nonnegative
- unique idempotency key when present

## Indexes

```text
(user_id, created_at DESC)
(wallet_id, created_at DESC)
(type, created_at DESC)
(reference_type, reference_id)
idempotency_key UNIQUE where not null
```

## Deliverables

- ledger schema
- wallet relation
- migration

## Exit Criteria

- All future wallet-changing modules can reference this ledger.

---

# Phase D7 - Packages Schema

## Objective

Create packages available for purchase.

## Table

```text
packages
```

## Fields

```text
id
name
slug
description
price_minor
currency
validity_days
daily_task_limit
daily_reward_limit_minor
referral_bonus_minor
status
sort_order
created_by_user_id
created_at
updated_at
```

## Constraints

- unique slug
- nonnegative price
- validity > 0
- valid task/reward limits

## Indexes

```text
slug UNIQUE
status
sort_order
created_at
```

## Deliverables

- packages schema
- migration

## Exit Criteria

- Packages support active/inactive/archived lifecycle.

---

# Phase D8 - Package Purchases Schema

## Objective

Track each package purchase request and history.

## Table

```text
package_purchases
```

## Fields

```text
id
user_id
package_id
package_name_snapshot
package_price_minor
currency
payment_method_id
payment_transaction_id
payment_transaction_norm
payment_proof_asset_id
status
admin_note
reviewed_by_user_id
reviewed_at
created_at
updated_at
```

## Constraints

Where applicable:

```text
UNIQUE(payment_method_id, payment_transaction_norm)
```

when normalized transaction ID exists.

## Indexes

```text
(user_id, created_at DESC)
(package_id, created_at DESC)
(status, created_at)
```

## Deliverables

- package purchase schema
- relations
- migration

## Exit Criteria

- Historical package name/price remain preserved.
- External payment reuse is prevented where applicable.

---

# Phase D9 - User Packages Schema

## Objective

Represent active/expired package entitlement.

## Table

```text
user_packages
```

## Fields

```text
id
user_id
package_id
package_purchase_id
status
started_at
expires_at
created_at
updated_at
```

## Constraints

- unique package purchase reference
- `expires_at > started_at`
- one active package per user for initial business model

Recommended partial unique index:

```text
UNIQUE(user_id)
WHERE status = 'ACTIVE'
```

## Deliverables

- user package schema
- relations
- partial unique index

## Exit Criteria

- A user cannot accidentally have two active packages.

---

# Phase D10 - Tasks Schema

## Objective

Create the task catalog.

## Table

```text
tasks
```

## Fields

```text
id
title
description
instructions
type
target_url
reward_minor
currency
required_package_id
requires_screenshot
daily_limit
starts_at
ends_at
status
created_by_user_id
created_at
updated_at
```

## Constraints

- reward >= 0
- daily limit positive when present
- valid date range

## Indexes

```text
(status, type)
required_package_id
created_at
(starts_at, ends_at)
```

## Deliverables

- task schema
- package relation
- migration

## Exit Criteria

- Task eligibility data can be queried efficiently.

---

# Phase D11 - Media Assets Schema

## Objective

Create Cloudinary metadata storage before proof submissions.

## Table

```text
media_assets
```

## Fields

```text
id
owner_user_id
purpose
public_id
secure_url
resource_type
format
bytes
width
height
created_at
deleted_at
```

## Constraints

- unique `public_id`

## Indexes

```text
public_id UNIQUE
owner_user_id
purpose
created_at
```

## Deliverables

- media asset schema
- migration

## Exit Criteria

- Cloudinary metadata can be reused by tasks, deposits, profile avatars, and package proofs.

---

# Phase D12 - Task Submissions Schema

## Objective

Track user proof submissions and review history.

## Table

```text
task_submissions
```

## Fields

```text
id
task_id
user_id
proof_asset_id
user_note
status
reward_minor_snapshot
currency
rejection_reason
reviewed_by_user_id
reviewed_at
submitted_at
updated_at
```

## Duplicate Strategy

Recommended partial unique index:

```text
UNIQUE(user_id, task_id)
WHERE status IN ('PENDING', 'APPROVED')
```

## Indexes

```text
(user_id, submitted_at DESC)
(task_id, submitted_at DESC)
(status, submitted_at)
reviewed_by_user_id
```

## Deliverables

- submission schema
- task/profile/media relations
- migration

## Exit Criteria

- Duplicate active submissions are blocked.
- Rejected submissions may be retried if backend permits.

---

# Phase D13 - Payment Methods Schema

## Objective

Make payment options configurable.

## Table

```text
payment_methods
```

## Fields

```text
id
code
display_name
account_label
account_value
instructions
is_deposit_enabled
is_package_enabled
is_withdraw_enabled
status
sort_order
created_at
updated_at
```

## Constraints

- unique `code`

## Deliverables

- payment method schema
- migration
- development seed

## Exit Criteria

- bKash/Nagad/etc. are not hardcoded into core business logic.

---

# Phase D14 - Deposits Schema

## Objective

Track deposit/recharge requests.

## Table

```text
deposits
```

## Fields

```text
id
user_id
amount_minor
currency
payment_method_id
sender_reference
transaction_id
transaction_id_norm
proof_asset_id
status
admin_note
reviewed_by_user_id
reviewed_at
created_at
updated_at
```

## Constraints

```text
amount_minor > 0
UNIQUE(payment_method_id, transaction_id_norm)
```

## Indexes

```text
(user_id, created_at DESC)
(status, created_at)
(payment_method_id, transaction_id_norm) UNIQUE
```

## Deliverables

- deposit schema
- relations
- migration

## Exit Criteria

- Same external transaction cannot normally be reused.

---

# Phase D15 - Withdrawals Schema

## Objective

Implement the finalized debit-on-request withdrawal model.

## Table

```text
withdrawals
```

## Fields

```text
id
user_id
amount_minor
currency
payment_method_id
account_value_enc
account_last4
status
wallet_transaction_id
reversal_transaction_id
admin_note
reviewed_by_user_id
reviewed_at
created_at
updated_at
```

## Constraints

- amount > 0
- unique wallet transaction
- unique reversal transaction when present

## Indexes

```text
(user_id, created_at DESC)
(status, created_at)
wallet_transaction_id UNIQUE
reversal_transaction_id UNIQUE where not null
```

## Deliverables

- withdrawal schema
- relations
- migration

## Exit Criteria

- Withdrawal can reference exactly one debit ledger record.
- Rejection can reference exactly one reversal ledger record.

---

# Phase D16 - Referrals Schema

## Objective

Track one referrer relationship and safe reward state.

## Table

```text
referrals
```

## Fields

```text
id
referrer_user_id
referred_user_id
referral_code_snapshot
qualified_at
rewarded_at
reward_minor
currency
reward_transaction_id
created_at
updated_at
```

## Constraints

- referred user unique
- referrer != referred user
- reward transaction unique when present

## Indexes

```text
(referrer_user_id, created_at DESC)
referred_user_id UNIQUE
reward_transaction_id UNIQUE where not null
```

## Deliverables

- referral schema
- relations
- migration

## Exit Criteria

- One user cannot have multiple referrers.
- Reward reference cannot duplicate.

---

# Phase D17 - Notifications Schema

## Objective

Create user-facing event history.

## Table

```text
notifications
```

## Fields

```text
id
user_id
type
title
message
reference_type
reference_id
read_at
created_at
```

## Indexes

```text
(user_id, created_at DESC)
(user_id, read_at, created_at DESC)
```

## Deliverables

- notification schema
- migration

## Exit Criteria

- Efficient unread/list queries are supported.

---

# Phase D18 - Audit Logs Schema

## Objective

Create immutable sensitive-action history.

## Table

```text
audit_logs
```

## Fields

```text
id
actor_user_id
action
entity_type
entity_id
reason
previous_data
new_data
request_id
ip_address
created_at
```

## Rules

- append-only in normal application flow
- no normal admin delete endpoint
- never store secrets or full encrypted withdrawal destinations in snapshots

## Indexes

```text
(actor_user_id, created_at DESC)
(entity_type, entity_id, created_at DESC)
(action, created_at DESC)
created_at
```

## Deliverables

- audit schema
- migration

## Exit Criteria

- Sensitive operations can be traced.

---

# Phase D19 - System Settings Schema

## Objective

Store configurable non-secret platform rules.

## Table

```text
system_settings
```

## Fields

```text
key
value
description
is_public
updated_by_user_id
created_at
updated_at
```

## Constraints

- primary key on `key`

## Initial Keys

Potential:

```text
withdrawal_rules
referral_rules
feature_flags
maintenance_mode
support_info
platform_announcement
```

## Deliverables

- settings schema
- baseline seed

## Exit Criteria

- Business configuration can be changed without DB redesign.

---

# Phase D20 - Idempotency Records Schema

## Objective

Add request replay protection for critical mutation flows.

## Table

```text
idempotency_records
```

## Fields

```text
id
key
user_id
scope
request_hash
response_code
response_body
expires_at
created_at
```

## Constraints

- unique key

## Indexes

```text
key UNIQUE
(user_id, scope, created_at DESC)
expires_at
```

## Deliverables

- idempotency schema
- migration

## Exit Criteria

- Backend can protect selected mutation APIs against retries.

---

# Phase D21 - Foreign Key Audit

## Objective

Review every relation explicitly.

## Required Relationships

Verify:

```text
profiles -> profiles(referrer)

wallets -> profiles

wallet_transactions -> profiles
wallet_transactions -> wallets

packages -> profiles(created_by)

package_purchases -> profiles
package_purchases -> packages
package_purchases -> payment_methods
package_purchases -> media_assets

user_packages -> profiles
user_packages -> packages
user_packages -> package_purchases

tasks -> packages
tasks -> profiles(created_by)

task_submissions -> tasks
task_submissions -> profiles
task_submissions -> media_assets
task_submissions -> profiles(reviewer)

deposits -> profiles
deposits -> payment_methods
deposits -> media_assets
deposits -> profiles(reviewer)

withdrawals -> profiles
withdrawals -> payment_methods
withdrawals -> wallet_transactions
withdrawals -> profiles(reviewer)

referrals -> profiles(referrer)
referrals -> profiles(referred)
referrals -> wallet_transactions

notifications -> profiles

audit_logs -> profiles(actor)

system_settings -> profiles(updated_by)
```

## Deliverables

- complete FK review
- migration corrections if needed

## Exit Criteria

- No critical dangling relationship is possible.

---

# Phase D22 - Delete Behavior Audit

## Objective

Prevent accidental history loss.

## Use RESTRICT / NO ACTION for

- wallet transactions
- package purchases
- user packages
- task submissions
- deposits
- withdrawals
- referrals
- audit logs

## Use archive/deactivation instead of delete for

- packages
- tasks
- payment methods

## Deliverables

- FK delete rules reviewed

## Exit Criteria

- Removing a profile/package/task cannot silently destroy financial history.

---

# Phase D23 - Check Constraint Audit

## Objective

Add database-level validation for critical numeric/date rules.

## Verify Constraints

```text
wallet balance >= 0
wallet totals >= 0
wallet transaction amount > 0
package price >= 0
package validity > 0
task reward >= 0
deposit amount > 0
withdrawal amount > 0
referral reward >= 0 when present
user package expires_at > started_at
task ends_at > starts_at when both exist
```

## Deliverables

- named check constraints

## Exit Criteria

- Invalid financial amounts cannot be inserted directly.

---

# Phase D24 - Unique Constraint Audit

## Objective

Protect one-time business operations.

## Verify Uniqueness

```text
profiles.referral_code
wallets.user_id
packages.slug
payment_methods.code
media_assets.public_id
referrals.referred_user_id
referrals.reward_transaction_id
withdrawals.wallet_transaction_id
withdrawals.reversal_transaction_id
package_purchases payment transaction where applicable
deposits payment transaction
task submission active uniqueness
idempotency_records.key
```

## Exit Criteria

- Duplicate critical business states are blocked by PostgreSQL.

---

# Phase D25 - Index Optimization Pass

## Objective

Create indexes for expected production queries.

## User-Facing Queries

Optimize:

- user's wallet transactions
- user's package history
- user's task history
- user's deposits
- user's withdrawals
- user's referrals
- user's notifications

## Admin Queries

Optimize:

- pending submissions
- pending deposits
- pending withdrawals
- user search/status
- transaction type/date
- package/task status
- audit logs

## Rules

- Avoid indexing every column.
- Prefer composite indexes matching actual filters/order.

## Deliverables

- finalized index migration

## Exit Criteria

- Common list queries avoid unnecessary full-table scans at expected scale.

---

# Phase D26 - Drizzle Relations and Type Exports

## Objective

Improve developer ergonomics without weakening DB integrity.

## Tasks

Define Drizzle relations for core entities.

Export inferred types:

```text
Profile
Wallet
WalletTransaction
Package
PackagePurchase
UserPackage
Task
TaskSubmission
PaymentMethod
Deposit
Withdrawal
Referral
Notification
AuditLog
```

## Rules

- Database inferred types are not automatically API DTOs.
- Backend serializers remain responsible for safe exposure.

## Deliverables

- relation files
- type exports

## Exit Criteria

- Backend services can query relational data cleanly.

---

# Phase D27 - RLS Defense-in-Depth

## Objective

Prevent direct browser access to application tables through Supabase Data API.

## Tasks

Enable RLS on all application tables in `public`.

Do not add broad policies for:

```text
anon
authenticated
```

in v1.

Frontend should use Supabase for Auth only.

## Important

The trusted Railway backend must retain required access through its server-side PostgreSQL connection.

## Deliverables

- RLS migration
- security verification

## Exit Criteria

- Public anon key cannot read/write Digonto application tables directly.

---

# Phase D28 - Development Seed Data

## Objective

Create useful local/dev fixtures.

## Seed

- sample packages
- sample tasks
- payment methods
- baseline system settings

Optional database-only fixture records:

- sample profiles
- wallets

Be careful because real Supabase Auth identities may be required for full auth testing.

## Deliverables

- deterministic seed script

## Exit Criteria

- Running seed repeatedly does not create uncontrolled duplicates.

---

# Phase D29 - Baseline Payment Method Seed

## Objective

Prepare configurable manual payment options.

## Development Examples

```text
BKASH
NAGAD
ROCKET
BANK
```

Fields should include enable/disable flags for:

- deposits
- package payments
- withdrawals

## Deliverables

- payment methods seed

## Exit Criteria

- Backend can query enabled payment methods instead of hardcoding them.

---

# Phase D30 - Baseline Settings Seed

## Objective

Provide initial application settings.

## Seed Keys

```text
withdrawal_rules
referral_rules
feature_flags
maintenance_mode
support_info
```

Use safe example values only.

Do not treat sample financial limits as finalized business values unless the product owner confirms them.

## Deliverables

- settings seed

## Exit Criteria

- Settings service has required baseline values.

---

# Phase D31 - Migration Review Workflow

## Objective

Establish safe schema change procedure.

## Workflow

```text
Edit Schema
   |
   v
Generate Migration
   |
   v
Review SQL
   |
   v
Apply Development
   |
   v
Run Tests
   |
   v
Apply Staging/Production Deliberately
```

## Rules

- Never blindly deploy generated SQL.
- Never delete migration history.
- Never use destructive production push as normal workflow.

## Deliverables

- documented migration command/process

## Exit Criteria

- Every developer/agent follows the same migration workflow.

---

# Phase D32 - Initial Full Migration

## Objective

Generate and apply the complete baseline schema.

## Tasks

- Generate migration
- Inspect SQL
- Verify enums
- Verify tables
- Verify constraints
- Verify indexes
- Verify foreign keys
- Apply to development Supabase project

## Deliverables

- baseline migration set

## Exit Criteria

- Fresh database can be fully created from migrations alone.

---

# Phase D33 - Schema Introspection Verification

## Objective

Verify actual PostgreSQL state matches Drizzle schema.

## Check

- tables exist
- columns match
- enum values match
- default values match
- constraints exist
- indexes exist
- FKs exist
- RLS enabled

## Deliverables

- verification notes/fixes

## Exit Criteria

- No schema drift remains.

---

# Phase D34 - User Bootstrap Integrity Test

## Objective

Verify database supports idempotent registration bootstrap.

## Test

Create one logical user flow:

```text
profile
wallet
referral code
optional referral relation
```

Run bootstrap twice.

## Expected

- one profile
- one wallet
- one referral relationship maximum
- same referral code

## Exit Criteria

- Duplicate bootstrap cannot corrupt schema state.

---

# Phase D35 - Wallet Integrity Test

## Objective

Verify wallet snapshot and ledger behavior.

## Test

Credit:

```text
balance 0 -> 1000
ledger CREDIT 1000
```

Debit:

```text
balance 1000 -> 400
ledger DEBIT 600
```

Invalid debit:

```text
balance 400
attempt debit 500
```

Expected:

- transaction rolls back
- no negative balance
- no invalid ledger row

## Exit Criteria

- Snapshot and ledger remain consistent.

---

# Phase D36 - Task Approval Integrity Test

## Objective

Verify one approval produces one reward.

## Test

1. Create task
2. Create pending submission
3. Approve once
4. Attempt approve again

## Expected

```text
submission APPROVED
wallet credited once
one TASK_REWARD transaction
second approval blocked
```

## Exit Criteria

- Duplicate reward is impossible.

---

# Phase D37 - Deposit Integrity Test

## Objective

Verify deposit uniqueness and one-time credit.

## Test

1. Create deposit transaction ID
2. Attempt same method + normalized transaction ID again
3. Approve original
4. Attempt approve again

## Expected

- duplicate insert blocked
- wallet credited once
- one DEPOSIT ledger row

## Exit Criteria

- External transaction cannot produce repeated credit.

---

# Phase D38 - Withdrawal Integrity Test

## Objective

Verify debit-on-request / reversal-on-reject behavior.

## Scenario A - Request

Expected:

```text
withdrawal PENDING
wallet debited
one WITHDRAWAL ledger entry
```

## Scenario B - Approve

Expected:

```text
withdrawal APPROVED
no second debit
```

## Scenario C - Reject

Expected:

```text
withdrawal REJECTED
wallet credited back
one WITHDRAWAL_REVERSAL
```

## Exit Criteria

- No double debit.
- No double refund.
- Pending amount cannot be spent.

---

# Phase D39 - Referral Integrity Test

## Objective

Verify referral uniqueness and one-time rewards.

## Test

- self referral
- duplicate referred user
- first qualification
- repeated qualification

## Expected

- self-referral blocked
- only one referrer allowed
- reward transaction created once
- repeated qualification does not reward again

## Exit Criteria

- Referral reward is financially safe.

---

# Phase D40 - Package Activation Integrity Test

## Objective

Verify one-active-package rule.

## Test

- approve first package
- approve second package

## Expected

Depending on business rule:

- previous package transitions appropriately
- only one row remains ACTIVE

## Exit Criteria

- Partial unique active-package constraint is respected.

---

# Phase D41 - Task Submission Uniqueness Test

## Objective

Verify active submission rule.

## Test

### Pending

Second submission should fail.

### Approved

New submission should fail.

### Rejected

New submission may succeed if backend permits retries.

## Exit Criteria

- Database uniqueness matches business design.

---

# Phase D42 - RLS Security Test

## Objective

Verify Supabase public client cannot directly access application data.

## Test Using anon/authenticated client

Attempt:

- select profiles
- select wallets
- insert deposit
- update withdrawal

## Expected

Denied unless a future narrow policy intentionally allows it.

## Exit Criteria

- Browser clients cannot bypass Hono API.

---

# Phase D43 - Query Performance Review

## Objective

Verify expected admin/user queries.

## Review with EXPLAIN where useful

- wallet history
- pending submissions
- pending deposits
- pending withdrawals
- user package history
- notifications
- referrals
- audit logs

## Deliverables

- index adjustments if needed

## Exit Criteria

- No obvious avoidable full scans on core production queries.

---

# Phase D44 - Production Migration Preparation

## Objective

Prepare the database for production safely.

## Tasks

- Review migration order
- Verify no destructive accidental statements
- Confirm backup
- Confirm environment
- Verify production `DATABASE_URL`
- Verify extension requirements
- Verify RLS migration
- Verify seed policy

## Rules

Do not seed:

- test users
- test wallets
- demo financial records

into production.

Only seed required:

- payment methods
- baseline settings
- confirmed production packages/tasks if intentionally provided

## Exit Criteria

- Production migration is reviewed and repeatable.

---

# Phase D45 - Production Baseline Deployment

## Objective

Apply the schema to production Supabase PostgreSQL.

## Steps

```text
Backup/Verify Empty Production DB
      |
      v
Apply Reviewed Migrations
      |
      v
Verify Schema
      |
      v
Verify RLS
      |
      v
Insert Required Baseline Data
      |
      v
Backend Connectivity Test
```

## Exit Criteria

- Production schema matches migrations.
- Railway backend connects successfully.
- Frontend has no direct application-table access.

---

# Phase D46 - Production Data Integrity Checklist

## Profiles

- auth IDs map correctly
- referral codes unique
- self-referral prevented

## Wallet

- one wallet per user
- balances nonnegative
- ledger indexes exist

## Packages

- slugs unique
- prices valid
- one active package rule works

## Tasks

- rewards valid
- active submission uniqueness works

## Deposits

- normalized transaction IDs unique

## Withdrawals

- debit/reversal references unique
- amount positive

## Referrals

- one referred user -> one referrer
- reward transaction unique

## Security

- RLS enabled
- app tables not exposed to anon users

---

# Phase D47 - Backup and Recovery Readiness

## Objective

Prepare for production incidents.

## Confirm

- Supabase backup capability
- restore procedure
- migration history stored in repository
- risky migration checklist
- backup before destructive changes

## Future

For higher stakes/scale consider:

- point-in-time recovery
- dedicated staging database
- periodic restore testing

## Exit Criteria

- Team/agent knows how to recover from a failed migration.

---

# Phase D48 - Schema Evolution Rules

## Objective

Protect future upgrades.

## Additive Changes Preferred

Prefer:

- add nullable column
- backfill data
- enforce new constraint later

over:

- immediately renaming/dropping live columns
- destructive type conversion

## Financial Fields

Never change:

```text
BIGINT minor units
```

to float.

If currency model changes later, use a controlled migration.

## Enum Changes

Adding values is easier than removing them.

Avoid removing live enum values without data migration.

## Exit Criteria

- Future schema changes have a safe pattern.

---

# Phase D49 - Future Scaling Readiness

## Objective

Document upgrade paths without implementing them prematurely.

Potential future improvements:

- cursor pagination
- materialized report views
- daily aggregate tables
- full-text search
- `pg_trgm`
- partitioning of massive ledger/audit tables
- archive storage
- read replicas

Do not implement these until real scale requires them.

---

# Phase D50 - Database Documentation

## Objective

Create a human-readable schema reference.

## Document

For every table:

- purpose
- primary key
- key fields
- FKs
- unique constraints
- check constraints
- indexes
- deletion behavior
- business notes

Include an ERD if the agent/tooling supports it.

## Deliverables

- schema reference document
- optional Mermaid ERD

## Exit Criteria

- Backend developers can understand the model without reading every migration.

---

# Recommended Database Development Order

```text
D0  Architecture Lock
D1  Drizzle Package Setup
D2  PostgreSQL Connection
D3  Enums
D4  Profiles
D5  Wallets
D6  Wallet Transactions
D7  Packages
D8  Package Purchases
D9  User Packages
D10 Tasks
D11 Media Assets
D12 Task Submissions
D13 Payment Methods
D14 Deposits
D15 Withdrawals
D16 Referrals
D17 Notifications
D18 Audit Logs
D19 System Settings
D20 Idempotency Records
D21 Foreign Key Audit
D22 Delete Behavior Audit
D23 Check Constraints
D24 Unique Constraints
D25 Index Optimization
D26 Drizzle Relations & Types
D27 RLS
D28 Development Seed
D29 Payment Method Seed
D30 Settings Seed
D31 Migration Workflow
D32 Initial Full Migration
D33 Schema Verification
D34 Bootstrap Integrity Test
D35 Wallet Integrity Test
D36 Task Approval Test
D37 Deposit Test
D38 Withdrawal Test
D39 Referral Test
D40 Package Activation Test
D41 Task Submission Test
D42 RLS Security Test
D43 Query Performance
D44 Production Preparation
D45 Production Deployment
D46 Production Integrity Checklist
D47 Backup & Recovery
D48 Schema Evolution Rules
D49 Future Scaling Readiness
D50 Database Documentation
```

---

# AI Agent Rules for Every Database Phase

At the start of each phase:

1. Inspect current schema.
2. Inspect existing migration history.
3. Confirm the requested change does not conflict with prior constraints.
4. Preserve financial history.
5. Preserve referential integrity.
6. Reuse existing enum/type definitions.
7. Do not create duplicate tables for the same concept.
8. Avoid raw SQL unless Drizzle cannot express the required PostgreSQL feature cleanly.
9. When raw SQL is needed, keep it inside reviewed migration/database code.
10. Never silently weaken a constraint to make code easier.

At the end of each database phase, report:

- Tables added
- Tables changed
- Columns added/changed
- Enums added/changed
- Foreign keys added
- Unique constraints added
- Check constraints added
- Indexes added
- Partial indexes added
- RLS changes
- Migration files generated
- Seed changes
- Backend modules affected
- Breaking changes
- Data migration requirements
- Rollback concerns
- Tests performed
- Remaining TODOs

---

# Database Definition of Done

The database is complete when:

- PostgreSQL is running on Supabase.
- Drizzle package is stable.
- Migrations recreate the schema from scratch.
- Profiles align with Supabase Auth.
- Every user has one wallet.
- Money uses BIGINT minor units.
- Wallet ledger is traceable.
- Package purchase history is preserved.
- One-active-package rule is enforced.
- Tasks and submissions are relational.
- Task rewards are snapshotted.
- Cloudinary metadata is relational.
- Payment methods are configurable.
- Deposit transaction reuse is blocked.
- Withdrawal debit/reversal model is safe.
- Referrals are unique and reward-safe.
- Notifications are indexed.
- Audit logs are immutable in normal flows.
- System settings are configurable.
- Idempotency support exists.
- Foreign keys protect references.
- Check constraints protect values.
- Unique constraints protect one-time operations.
- Core indexes support real queries.
- RLS protects direct Supabase access.
- Development seed works.
- Production migration process is documented.
- Critical financial integrity tests pass.
- Backup/recovery plan exists.
- Schema documentation exists.

---

# Final Database Principle

Do not treat the database as passive storage.

The Digonto database must actively enforce the platform's most important truths:

- who owns what
- which transaction happened once
- how balances changed
- which package is active
- which task was completed
- whether a payment was reused
- whether a withdrawal was refunded
- whether a referral was rewarded
- who performed a sensitive admin action

Application code may fail.

Database constraints should make critical corruption difficult or impossible.
