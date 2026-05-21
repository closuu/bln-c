# bln-c

**a personal web project by qobble / CaziWorks**

> **this project is not open source and is not free to use.**
> it's shared here for inspiration only. please don't copy, redistribute, or repurpose the code without permission.

bln-c is a multi-feature personal website built with plain html, css, and javascript — no frameworks. it runs on [github pages](https://pages.github.com) for hosting and [supabase](https://supabase.com) for the database, authentication, and real-time features — dynamic content powered by supabase on the frontend.

---

## pages

| page | description |
|---|---|
| `index.html` | home — typed intro, site overview |
| `games.html` | catalogue — browse uploaded projects and resources |
| `user.html` | user profile — avatar, stats, spider graphs, profile card download, catalogue submissions |
| `tracker.html` | mini notepad — personal task and achievement logger |
| `devlog.html` | devlog — development updates posted by admin |
| `rate.html` | rate my week — weekly 1–10 log with streak, ascii graph, reactions |
| `wall.html` | sticky wall — draw on a canvas, submit for approval, appears publicly |
| `messages.html` | messages — direct messaging between users by username |
| `gomoku.html` | gomoku — real-time multiplayer five-in-a-row with reactions and rankings |
| `rankings.html` | gomoku rankings — leaderboard with win/loss stats and avatars |
| `admin.html` | admin dashboard — manage users, catalogue, submissions, sticky notes |
| `404.html` | 404 error page |

---

## features

- **accounts** — register, login, custom profile picture, plan/status display
- **spider graphs** — two customisable radar charts per user (13 stats total)
- **profile card download** — generates a png card with avatar, stats, notepad, and spider graphs
- **catalogue** — admin uploads products; users can also submit for approval
- **mini notepad** — personal task list saved to the cloud
- **rate my week** — weekly mood log with streak counter, yearly average, ascii bar graph, word reactions
- **sticky wall** — canvas drawing tool with pen size, undo, submit for admin approval; approved art goes public
- **direct messages** — 1-on-1 messaging by username with kaomoji reaction presets and unread badges
- **gomoku** — real-time multiplayer board game; challenge by username, in-game kaomoji reactions, resign, rematch, win/loss tracking
- **rankings** — gomoku leaderboard ranked by wins with win rate bar
- **monochrome mode** — full site-wide oled black theme toggle, persists across sessions
- **sound effects** — procedural web audio api sounds for every interaction.
- **mobile responsive** — hamburger nav, touch canvas drawing, responsive layouts

---

## built with

| layer | tool |
|---|---|
| hosting | github pages (free, static) |
| database | supabase (postgresql) |
| auth | supabase auth |
| real-time | supabase realtime (broadcast + presence) |
| storage | supabase storage (avatars bucket) |
| frontend | vanilla html / css / js |
| font | d_bitmap9px (bitmap ttf) |
| sounds | web audio api (procedural, no audio files) |

---

## database tables

| table | purpose |
|---|---|
| `profiles` | user info, avatar, plan, gomoku stats, spider data toggle |
| `tracker_items` | mini notepad entries per user |
| `products` | catalogue items (admin-managed) |
| `product_submissions` | user-submitted catalogue items awaiting approval |
| `devlog` | devlog entries (admin-managed) |
| `week_ratings` | weekly mood ratings per user |
| `week_reactions` | word reactions on week entries |
| `sticky_notes` | canvas drawings (pending/approved) |
| `conversations` | dm conversation pairs |
| `messages` | individual messages within conversations |
| `user_spiders` | spider graph values per user |
| `gomoku_games` | active and finished gomoku matches |

---

## setup

1. create a [supabase](https://supabase.com) project
2. run the sql table setup scripts 
3. copy **Project URL** and **anon key** into `js/supabase-config.js`
4. push all files to a GitHub repo
5. enable **github pages** (settings → pages → deploy from branch: main)
6. add github pages URL to supabase → authentication → URL Configuration

---

## notes

- admin access is set manually in supabase → table editor → profiles → set `role` to `admin`
- monochrome theme persists via `localstorage`
- gomoku requires both players to be online and on the page simultaneously
- the sticky wall and catalogue submissions require admin approval before going public

---

© 2026 - CaziWorks - qobble
