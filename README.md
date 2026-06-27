# UMIC Yearbook 2026 — "The Prime Forge Set"

A digital yearbook for the graduating SS3 class of Unique Model International College.
Built with Flask + SQLite, photos stored as base64 directly in the database (no filesystem
dependency, so it survives restarts on ephemeral-disk hosts like Render/Railway free tiers).

## What's included

- **Public site:** landing page, class selector, student profiles (swipeable photo gallery +
  full questionnaire), staff directory (teaching/non-teaching, by department), school
  leadership, articles/write-ups, photo gallery, site-wide search.
- **Admin panel** at `/admin` — intentionally not linked from anywhere on the public site.
  No password by design (per requirements); treat the URL itself as the access control,
  and put it behind your host's basic-auth or a firewall rule if you want a second layer.
  Handles: Excel import per class, multi-photo upload per student with cover-photo
  selection, student edit/delete, staff add/import/photo, leadership profiles, articles,
  gallery uploads, and yearbook-wide settings (name, motto, year, logo).

## Running locally

```bash
pip install -r requirements.txt
python3 app.py
```

Visit `http://localhost:5000`. The SQLite database (`yearbook.db`) is created
automatically on first run.

## Importing your class data

1. Go to `/admin/students` → **Import Excel**.
2. Type the class name exactly as you want it to appear (e.g. `SSS 3A`).
3. Upload the Google Forms Excel export for that class.
4. Repeat for each class (SSS 3B, SSS 3C, etc).

The importer recognizes the standard UMIC questionnaire column headers automatically
(full name, nickname, post held, favourite subject, and so on — about 45 fields total).
It deduplicates by name automatically, keeping whichever submitted row has the most
filled-in fields if a student accidentally submitted the form twice.

## Uploading student photos

`/admin/students` → click the camera icon next to a student → drag and drop as many
photos as you have for them. The first one uploaded becomes the cover photo automatically;
you can change this with the star icon on any other photo. There's no hard limit on
photo count per student.

## Deploying to Render or Railway

This app needs a **persistent disk** for `yearbook.db` — without one, every deploy or
restart wipes the database, since the container filesystem is otherwise ephemeral.

### Render
1. New → Web Service → connect this repo.
2. Build command: `pip install -r requirements.txt`
3. Start command: leave blank (Render reads the `Procfile`) or set explicitly to
   `gunicorn app:app --bind 0.0.0.0:$PORT`
4. Add a **Disk** (Render dashboard → your service → Disks): mount path `/app` (or
   wherever your repo root lands), at least 1 GB. This is what keeps `yearbook.db`
   across deploys.
5. Deploy. First request will auto-create the database tables.

### Railway
1. New Project → Deploy from GitHub repo.
2. Railway auto-detects the `Procfile`. Confirm the start command is
   `gunicorn app:app --bind 0.0.0.0:$PORT`.
3. Add a **Volume** (Railway dashboard → your service → Volumes) and mount it at the
   directory containing `app.py` (e.g. `/app`) — same reasoning as Render's Disk.
4. Deploy.

### Running under a subpath (e.g. yourschooldomain.com/yearbook)

If you want the yearbook to appear under a path on your main school domain rather
than at the bare Render/Railway URL, you need two things:

1. **Set the `URL_PREFIX` environment variable** on Render/Railway to the path you're
   using, e.g. `/yearbook` (no trailing slash). On Render: Dashboard → your service →
   Environment → Add Environment Variable. This makes every link, redirect, and AJAX
   call the app generates resolve correctly under that prefix instead of the domain
   root — without it, the site will load with broken styling and dead links once
   proxied under a subpath.

2. **Proxy that path to this app** from wherever your main domain is hosted. If your
   main site sits behind Cloudflare (common with GitHub Pages or similar static
   hosting), the way to do this is a **Cloudflare Worker** with a route like
   `yourschooldomain.com/yearbook/*` that forwards the request to your Render/Railway
   URL and streams the response back. A plain DNS record or redirect is not enough —
   it has to actively proxy the request so the address bar keeps showing your domain.
   If your main site instead runs on a server you control (Nginx, Apache, etc.), a
   standard reverse-proxy `location /yearbook/ { proxy_pass ...; }` block does the
   same job.

   Without step 2, setting `URL_PREFIX` alone does nothing for visitors — it only
   prepares the app to be correctly proxied; something still has to do the proxying.

   A ready-to-use Worker script for this exact setup is in `cloudflare-worker/worker.js`
   — see the comment at the top of that file for the four-step setup in the Cloudflare
   dashboard. One thing to know: Cloudflare's free plan caps request body size at
   100MB, which is comfortably above this app's own 60MB upload limit, so multi-photo
   admin uploads should be fine — but if you ever raise `MAX_CONTENT_LENGTH` in
   `app.py` past 100MB, the Worker will reject large uploads before Flask even sees them.

### A note on photo storage at this scale
Storing photos as base64-in-SQLite is simple and dependency-free, which matters for a
one-off school project, but it does mean the database file grows quickly — figure
roughly 150–400KB per photo once base64-encoded. For ~150 students × 3 photos each,
budget for a database in the few-hundred-MB range; size your disk/volume accordingly
(start at 2GB to be safe). If the yearbook grows well beyond this (multiple graduating
classes, video, etc.), the natural next step is moving photo storage to S3-compatible
object storage and keeping only URLs in SQLite — happy to help with that migration if
it becomes necessary.

## Project structure

```
app.py                  Flask routes, DB helpers, import/upload logic
schema.sql               SQLite schema
templates/               Jinja2 templates (public site + admin/ subfolder)
static/css/style.css     Public site styling (gold/forest-green seal motif)
static/css/admin.css     Admin panel styling
static/js/main.js        Shared front-end behaviors (avatars, lightbox, toasts, nav)
static/js/admin.js       Admin panel AJAX helpers
requirements.txt         Python dependencies
Procfile                 Process definition for Render/Railway
```
