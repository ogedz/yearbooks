-- UMIC Yearbook Database Schema

CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    school_name TEXT DEFAULT 'Unique Model International College',
    motto TEXT DEFAULT 'What will be will be, just make sure it doesn''t hinder your progress.',
    graduation_year TEXT DEFAULT '2026',
    theme_primary TEXT DEFAULT '#0A2F23',
    theme_accent TEXT DEFAULT '#C9A84C',
    principal_message TEXT DEFAULT '',
    logo TEXT DEFAULT ''
);

INSERT OR IGNORE INTO settings (id) VALUES (1);

CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    class_name TEXT NOT NULL,
    nickname TEXT DEFAULT '',
    post_held TEXT DEFAULT '',
    dob TEXT DEFAULT '',
    year_of_admission TEXT DEFAULT '',
    religion TEXT DEFAULT '',
    mode_of_schooling TEXT DEFAULT '',
    state_of_origin TEXT DEFAULT '',
    home_town TEXT DEFAULT '',
    contact_number TEXT DEFAULT '',
    social_media TEXT DEFAULT '',
    role_model TEXT DEFAULT '',
    hobbies TEXT DEFAULT '',
    best_friends TEXT DEFAULT '',
    folks_never_forget TEXT DEFAULT '',
    favourite_colour TEXT DEFAULT '',
    favourite_subject TEXT DEFAULT '',
    toughest_subject TEXT DEFAULT '',
    favourite_teacher TEXT DEFAULT '',
    most_admired_teacher TEXT DEFAULT '',
    favourite_non_teaching TEXT DEFAULT '',
    most_admired_classmate TEXT DEFAULT '',
    best_seat_partner TEXT DEFAULT '',
    day_one_friend TEXT DEFAULT '',
    class_crush TEXT DEFAULT '',
    teachers_missed TEXT DEFAULT '',
    favourite_food TEXT DEFAULT '',
    favourite_fruit TEXT DEFAULT '',
    movie_type TEXT DEFAULT '',
    best_artist TEXT DEFAULT '',
    best_slang TEXT DEFAULT '',
    favourite_quote TEXT DEFAULT '',
    best_moment TEXT DEFAULT '',
    embarrassing_moment TEXT DEFAULT '',
    weird_moment TEXT DEFAULT '',
    worst_moment TEXT DEFAULT '',
    never_forget TEXT DEFAULT '',
    better_than_thought TEXT DEFAULT '',
    impact_of_umic TEXT DEFAULT '',
    journey_description TEXT DEFAULT '',
    advice_to_future TEXT DEFAULT '',
    never_miss TEXT DEFAULT '',
    secretly_miss TEXT DEFAULT '',
    class_enjoyed_most TEXT DEFAULT '',
    notable_phobia TEXT DEFAULT '',
    future_ambition TEXT DEFAULT '',
    dreamland TEXT DEFAULT '',
    people_to_meet TEXT DEFAULT '',
    wish TEXT DEFAULT '',
    parting_words TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_name);

CREATE TABLE IF NOT EXISTS student_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    data_url TEXT NOT NULL,
    is_cover INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_photos_student ON student_photos(student_id);

CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department TEXT DEFAULT '',
    subject TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    category TEXT DEFAULT 'Teaching',
    years_of_service TEXT DEFAULT '',
    quote TEXT DEFAULT '',
    photo TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS leadership (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT DEFAULT '',
    message TEXT DEFAULT '',
    photo TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT DEFAULT '',
    category TEXT DEFAULT 'Reflection',
    content TEXT DEFAULT '',
    cover_image TEXT DEFAULT '',
    status TEXT DEFAULT 'Published',
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS gallery_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    caption TEXT DEFAULT '',
    category TEXT DEFAULT 'Events',
    data_url TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);
