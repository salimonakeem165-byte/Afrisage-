# AfriSage — Website prototype

This package is a mobile-responsive, installable-web-app starter for the existing `Afrisage-` GitHub repository.

## Files
- `index.html` — responsive AfriSage front-end, sample catalogue, sample reader, and local demo interest forms.
- `manifest.webmanifest` — app-install metadata.
- `sw.js` — basic offline shell caching.

## Important status
This is a front-end prototype, not the complete production platform. The interest forms store data only in the visitor's browser using localStorage. They do not send information to AfriSage. There is no secure login, cloud database, author manuscript upload, book file storage, real chapter content, payment processing, download protection, admin dashboard, or Guardian AI integration yet. Do not collect real manuscripts or sensitive personal information through this demo.

## Add to the existing GitHub repository
Upload these three files to the root of `https://github.com/salimonakeem165-byte/Afrisage-` on the `main` branch. Do not create a new repository. The simplest route is GitHub's **Add file → Upload files** on the repository page, then commit the changes.

## Next development phase
Connect a secure backend (for example, Cloudflare Pages/Workers + D1/R2, or another free-tier service), then implement authentication, roles, author submissions, moderation workflow, owner approval/publication, reader library, chapter reader, admin dashboard, and payment integration. Configure payment only after business/account verification and published commercial terms. Keep API secrets in hosting environment variables, never in browser code.
