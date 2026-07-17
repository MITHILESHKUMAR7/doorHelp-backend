# DoorHelp Backend

Shared Node.js/Express + MongoDB backend for the DoorHelp User App and Admin Panel.

## Quick Start

```bash
npm install
cp .env.example .env      # then edit MONGO_URI / JWT secrets if needed
npm run dev                # starts on http://localhost:5000
```

Health check: `GET http://localhost:5000/health`

## OTP (Dev Mode)

`OTP_STATIC_MODE=true` in `.env` means any phone number's OTP is always `OTP_STATIC_CODE` (default `1234`).
The OTP is still fully persisted (bcrypt-hashed, 5-min TTL, attempt-limited) in the `otps` collection —
only the code *generation + delivery* is static; everything else behaves like production.
See `src/modules/auth/auth.service.js` for the `TODO` marking exactly where real SMS integration plugs in later.

## Admin Account

```bash
npm run seed:superadmin
```
Creates the first superadmin using `SUPERADMIN_EMAIL` / `SUPERADMIN_PASSWORD` from `.env`.

## Postman Collection

Import `postman/DoorHelp.postman_collection.json` into Postman.

- Set collection variable `baseUrl` (default `http://localhost:5000/api/v1`) and `serverBaseUrl` (`http://localhost:5000`).
- Run **Auth** folder requests in order (1 → 2 → 3 if new user, 5 for admin) — tokens auto-save into
  collection variables via each request's built-in test script, so no manual copy-pasting of JWTs.
- Every request's description states which Figma screen / feature it powers.

## Project Structure

See `DoorHelp-Architecture.md` (root of the whole project, not this repo) for full architecture,
DB schema, and API planning. Folder structure inside this repo follows the feature-based module
pattern documented there — every module has its own `routes / controller / service / repository /
model / validator`, and `index.js` is the only file other modules should import from.

## Status

- ✅ Phase 1 — Project setup
- ✅ Phase 2 — Auth (static OTP, JWT, admin login)
- ✅ Phase 3 — All 12 database models
- ✅ Phase 4 — Categories + Subcategories module (public + admin)
- ⬜ Phase 5 — Services module
- ⬜ Phase 6 — Cart, Coupons, Bookings, Payments
- ⬜ Phase 7 — Addresses, Referrals
- ⬜ Phase 8 — Admin Panel (doorhelp-admin, separate repo)
