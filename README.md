# EstateAura Pro Property Portal — Demo Starter

This package includes a public property listing website plus a browser-based admin dashboard.

## Included features
- Public homepage with Buy / Rent / Lease search, location, category and budget filters.
- Property cards and detail modal.
- Featured, Urgent Sale and Offer badges.
- Admin dashboard with overview statistics.
- Add/edit listings, upload an image, update description/price/specifications.
- Mark a property Sold, relist it, mark Rented/Under Offer/Draft, or remove an ad.
- Filter admin listings by keyword, status and category.
- Responsive layout for mobile and desktop.

## Open locally
1. Extract the ZIP.
2. Open `index.html` to preview the public site.
3. Open `admin.html` to use the admin demo.
4. Demo login: username `admin`; password `Estate@123`.

## Critical limitations — read before using for a real business
This version is a **front-end prototype**. Listings and uploaded main photos are saved in the browser's `localStorage`, not a cloud database. That means:
- Admin changes are visible only in the same browser/device that made them.
- Clearing browser storage can delete your listings.
- It does not sync between staff or devices.
- The demo login is client-side and is NOT secure authentication. Do not publish this admin panel as a secure production system or use real confidential data.
- Browser storage has a size limit. Large images may fail; image uploads are compressed but still local.
- The public enquiry form opens the visitor's email app; it does not save leads in a database.
- There is no server-side image storage, staff roles, audit history, or backup service.

## Before publishing
1. Edit `config.js` and replace sample business name, phone, WhatsApp number and email.
2. Replace sample/demo properties and images with real authorised listings.
3. For a production dashboard, connect a backend such as Supabase/Firebase with secure authentication, database and image storage. Use server-side access rules and never rely on a password hidden in JavaScript.
4. Host the public site on a static web host or your existing hosting service. Keep `index.html`, `admin.html`, `styles.css`, `admin.css`, `config.js`, `seed-data.js`, `app.js`, and `admin.js` in the same folder.
5. Connect the domain through your host's DNS instructions. Keep your Google Workspace MX records intact.
6. Add a real privacy policy, terms, HTTPS, backups and tested lead storage before taking customer enquiries.

## Property fields
Each property has: `id`, `title`, `category`, `purpose`, `location`, `price`, `area`, `beds`, `baths`, `featured`, `urgent`, `offer`, `status`, `badge`, `image`, `images`, `description`, `amenities`, `updatedAt`.

Allowed statuses: Available, Sold, Rented, Under Offer, Draft.
Allowed categories: Residential, Commercial, Land & Plots, Luxury.
Allowed purposes: Buy, Rent, Lease.

## Note on status and removal
Sold/Rented/Draft properties do not appear on the public website. Under Offer remains visible. Remove permanently deletes the listing from the current browser's local data.
