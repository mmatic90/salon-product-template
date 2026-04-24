# Salon Product Template

Reusable salon management system built with **Next.js**, **Supabase**, **Tailwind CSS**, and optional **Twilio SMS** integration.

This repository is intended to become a productized template that can be customized and sold to multiple salons as a dedicated appointment and client-management system.

## Product Goal

The goal is not to build one generic public SaaS immediately. The better first version is a **repeatable custom salon app template**:

1. Reuse the same codebase for each salon.
2. Customize branding, services, employees, rooms, equipment, and working hours.
3. Deploy a separate instance for each client.
4. Charge a setup fee plus optional monthly maintenance/support.

This approach is easier to sell locally because salons get a system that feels custom-made for them without you rebuilding everything from zero.

## Current Core Features

- Admin and employee login through Supabase Auth
- Appointment creation and editing
- Client records
- Employees and schedules
- Rooms/resources
- Multi-service appointments
- Smart availability endpoint
- Appointment conflict validation
- SMS confirmation/reminder support through Twilio
- Audit log support
- Dashboard/reporting foundation

## Recommended Sellable Packages

### Starter

For small salons that only need internal scheduling.

- Appointment calendar
- Client database
- Employee list
- Services list
- Basic reports
- Manual appointment entry

### Professional

For salons with more employees and more complex scheduling.

- Everything in Starter
- Employee schedules and overrides
- Room/resource validation
- Multi-service appointments
- Smart slot suggestions
- Client notes and internal notes
- Status tracking: scheduled, completed, cancelled, no-show

### Premium

For salons that want automation and higher client retention.

- Everything in Professional
- SMS reminders
- Automated appointment confirmation messages
- No-show tracking
- Client history
- Monthly report export
- Priority support and updates

## Productization Checklist

Before selling this to multiple clients, complete these changes:

### 1. Remove hardcoded salon branding

Replace Body & Soul-specific names, SMS text, metadata, and UI copy with configurable salon settings.

Suggested settings table:

```sql
salon_settings (
  id uuid primary key,
  salon_name text not null,
  public_phone text,
  public_email text,
  address text,
  logo_url text,
  primary_color text,
  sms_signature text,
  timezone text default 'Europe/Zagreb',
  language text default 'hr'
)
```

### 2. Create safe environment configuration

Use `.env.example` for required variables and never commit real API keys, Supabase passwords, or demo credentials.

### 3. Add onboarding seed scripts

Create scripts for setting up a new salon quickly:

- create admin user
- create employees
- create rooms
- create services
- create default working hours
- create service-room/service-employee rules

### 4. Add a salon setup dashboard

Instead of editing the database manually, the owner/admin should be able to configure:

- salon info
- employees
- services
- rooms
- working hours
- SMS settings
- appointment statuses

### 5. Add client-facing booking later

Do not start with public booking if it slows you down. First sell the internal management system. Add public booking as a paid upgrade.

Future upgrade:

- public booking page
- available slot selection
- appointment request status
- admin confirmation flow
- automatic SMS/email confirmation

## Suggested Technical Roadmap

### Phase 1 — Clean Template

- Rename project from client-specific branding to generic salon template
- Remove secret/demo credential file
- Add `.env.example`
- Improve README and setup documentation
- Add configurable salon name and SMS signature

### Phase 2 — Admin Setup Area

- Salon profile settings
- Services management
- Employees management
- Rooms/equipment management
- Working hours editor

### Phase 3 — Sales-Ready Demo

- Add realistic demo data
- Add a polished landing/demo page
- Add demo login instructions without exposing private credentials
- Add screenshots/GIFs for pitching

### Phase 4 — Paid Client Deployment Flow

- Create deployment checklist
- Create database setup checklist
- Create client handover checklist
- Create support/maintenance checklist

## Deployment Model

Recommended starting model:

- One Supabase project per salon
- One deployed app per salon
- Shared codebase/template
- Client-specific environment variables
- Client-specific branding/settings

This keeps client data separated and makes support easier while you are still early.

## Environment Variables

Create `.env.local` based on `.env.example`.

Required:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Optional for SMS:

```bash
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_MESSAGING_SERVICE_SID=
TWILIO_FROM_NUMBER=
```

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Important Security Notes

- Do not commit `.env.local`.
- Do not commit client credentials.
- Do not commit real demo passwords.
- Rotate any credentials that were previously committed.
- Use separate Supabase projects for separate paying clients until a proper multi-tenant SaaS architecture is ready.
