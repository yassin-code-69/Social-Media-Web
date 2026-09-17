# Digonto Platform - Master Project Context

## Project Overview

You are building a production-grade task earning platform called **Digonto**.

The application is a modern responsive web platform where users can purchase packages, complete online tasks, submit screenshot proof, earn rewards, manage wallet balance, refer users, deposit money, and request withdrawals.

The system must be built with scalable architecture so future features can be added without major restructuring.

The final product should feel like a professionally developed commercial application, not an AI-generated prototype.

---

# Technology Stack

## Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- React Hook Form
- Zod
- Zustand
- TanStack Query
- Deployment: Vercel

---

## Backend

- Bun Runtime
- Hono.js
- TypeScript
- REST API Architecture
- Zod Validation
- Drizzle ORM
- Deployment: Railway

---

## Database

- PostgreSQL
- Hosted on Supabase
- Drizzle ORM
- Drizzle Kit for migrations

---

## Authentication

Provider:

Supabase Authentication

Features:

- Register
- Login
- Logout
- Forgot Password
- Session Management

Architecture should remain future-ready for OAuth integration.

---

## Storage

Provider:

Cloudinary

Usage:

- Task screenshots
- Profile images
- Future media files

---

# Product Type

Digonto is a:

Task + Package + Wallet + Referral Management Platform

---

# User Journey

Register

↓

Login

↓

Purchase Package

↓

Receive Tasks

↓

Complete Tasks

↓

Upload Screenshot Proof

↓

Admin Review

↓

Reward Added To Wallet

↓

Withdraw Earnings

---

# User Features

## Dashboard

The dashboard should follow the provided reference design.

Main sections:

- User profile card
- Package status
- Wallet balance
- Deposit button
- Withdraw button
- Completed tasks
- Total earnings
- Referral count
- Task categories
- Popular tasks
- Bonus sections

---

# Package System

Users can purchase packages.

Package fields:

- Package name
- Price
- Validity period
- Daily task limit
- Reward limit
- Referral benefit
- Status

Package History:

- Package name
- Package price
- Purchase date
- Transaction ID
- Payment status

Payment status:

- Pending
- Approved
- Rejected

---

# Task System

Task Types:

- Facebook tasks
- YouTube tasks
- TikTok tasks
- Website tasks
- Content tasks
- Video tasks
- Other promotional tasks

Task fields:

- Title
- Description
- Reward amount
- Instructions
- Task URL
- Required package
- Screenshot requirement
- Status

User Flow:

View Task

↓

Complete Task

↓

Upload Screenshot

↓

Submit

↓

Admin Review

---

Submission Status:

- Pending
- Approved
- Rejected

Rejected submissions must include rejection reason.

---

# Wallet System

Wallet must use ledger-based architecture.

Never update balance without transaction history.

Examples:

Credit:

+৳10 Task Reward

+৳20 Referral Reward


Debit:

-৳100 Withdrawal

-৳500 Package Purchase


Every wallet transaction must contain:

- Transaction type
- Amount
- Reference
- Balance before
- Balance after
- Timestamp

---

# Deposit System

Users can submit recharge requests.

Required:

- Amount
- Payment method
- Transaction ID
- Screenshot
- Date and time

Admin:

- Approve
- Reject

Approved deposits add balance.

---

# Withdrawal System

Users can request withdrawal.

Fields:

- Amount
- Withdrawal method
- Account number

Account number display should be masked.

Example:

017******45

Admin actions:

- Approve
- Reject
- Add note

---

# Referral System

Every user gets a referral code.

Track:

- Referral user ID
- Display name
- Join date
- Active/inactive status
- Reward amount

Dashboard:

- Total referrals
- Active referrals
- Referral earnings

---

# Admin Panel

Separate admin dashboard.

Modules:

- Dashboard
- Users
- Packages
- Tasks
- Task submissions
- Screenshot review
- Deposit requests
- Withdraw requests
- Referral management
- Transactions
- Reports
- Settings

Admin abilities:

- Approve/reject tasks
- Manage packages
- Manage users
- Adjust wallet
- Review transactions

---

# Design System

Follow the provided screenshot reference.

Style:

Modern fintech earning platform.

Colors:

Primary:
Deep Blue

Secondary:
Bright Green

Accent:
Yellow/Gold

Background:
Soft white/light gray


UI Style:

- Rounded cards
- Clean spacing
- Soft shadows
- Modern icons
- Professional typography
- Mobile-first responsive design


Avoid:

- Generic AI dashboard appearance
- Excessive gradients
- Poor spacing
- Template-like UI

---

# Code Quality Rules

Follow:

- Clean architecture
- Reusable components
- Strong TypeScript typing
- Environment variables
- Proper error handling
- API validation
- Database transactions
- Loading states
- Empty states
- Error states
- Security best practices

---

# Business Rules

- Wallet changes must always create transactions.
- Sensitive actions require admin approval.
- User actions should be logged.
- Database must support future scalability.
- Architecture should allow future mobile applications.
- Avoid shortcuts that create future technical debt.

---

# Final Goal

Build Digonto as a premium quality commercial task earning platform.

The result should look and behave like a professionally engineered SaaS/Fintech product.
