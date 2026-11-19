AFRISAGE MULTI-PAGE WEBSITE

Upload ALL files in this folder to the ROOT of your existing GitHub repository, replacing the old index.html and adding the other files. Keep the filenames unchanged.

Pages: index.html (Home), books.html (Books), authors.html (Authors), about.html (About), account.html (Registration/Login).
Shared design: styles.css. Authentication logic: account.js.

The login reset error is fixed by calling HTMLFormElement.prototype.reset.call(loginForm), avoiding collision with the password-reset button. The old one-page layout is split into separate pages with navigation.

Supabase URL is set to https://hwepbiptkyyclolujwss.supabase.co and the existing publishable key is retained. Configure Supabase Auth Site URL and Redirect URLs to include https://salimonakeem165-byte.github.io/Afrisage-/ and https://salimonakeem165-byte.github.io/Afrisage-/account.html .

IMPORTANT: Books catalogue, manuscript uploads, payments, author dashboard, admin approvals and Guardian AI are not yet implemented. Registration metadata is stored in Supabase Auth user metadata; it is not automatically copied into the profiles table yet. Do not treat this as production-ready until database policies and workflows are secured and tested.
