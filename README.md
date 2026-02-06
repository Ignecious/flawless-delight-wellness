# Flawless Delight Wellness - Landing Page

Mock UI for the Flawless Delight Wellness digital booking platform.

## Tech Stack
- Angular 19.2.18 (with security patches)
- TypeScript
- SCSS
- Standalone Components

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   ng serve
   ```

3. Open browser to `http://localhost:4200`

## Features
- ✅ Responsive landing page
- ✅ Sage green wellness theme
- ✅ Signature services section
- ✅ Top treatments showcase
- ✅ Personalized skincare section
- ✅ Mobile-friendly design
- ✅ Security patched (Angular 19.2.18)

## Project Structure
```
src/
├── app/
│   ├── features/
│   │   └── client/
│   │       └── home/
│   ├── app.component.ts
│   └── app.routes.ts
├── assets/
└── styles.scss
```

## Security
This project uses Angular 19.2.18 which includes patches for:
- XSRF Token Leakage vulnerabilities
- XSS vulnerabilities via unsanitized SVG attributes
- Stored XSS vulnerabilities

