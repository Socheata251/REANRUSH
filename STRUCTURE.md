# ReanRush folder guide

screens/      One folder per role. Each screen = its own .html (+ its own .js if it has one).
  public/     login, signup, home, pricing, blog, settings, 404 ...
  student/    join-pin, nickname, team, lobby, battle, flashcards, practice ...
  teacher/    dashboard, quiz-creator, host-lobby, reports ...
  admin/      dashboard, users, live-games, settings ...

components/   Shared parts used by many screens. Change here = changes everywhere.
  layout.js           builds header, footer and nav links for each role (edit the NAV lists)
  toast.js, modal.js  popup helpers
  header-*.html, nav-public.html, footer.html, sidebar-*.html, bottom-nav-student.html, khmer-strip.html
  header.css, nav.css, footer.css, components.css

core/         Logic and data, no design. data.js, store.js, guard.js (role check), engine.js, game-state.js, main.js, jQuery, tailwind-config.js

css/          base.css (global styles)
images/       All pictures
_archive/     Old copies kept just in case (copilot-old, old-pages, unused-js, unused-css). Safe to delete later.
_stitch-source/  Original Stitch export (do not edit)

Rule of thumb:
- Changing how one page looks or works  -> edit files inside screens/<role>/
- Changing header, footer, menu, popup  -> edit files inside components/
- Changing data, login check, game logic -> edit files inside core/

Paths inside a screen:  ../../core/x.js   ../../components/x.js   ../../images/x.jpg
Links between screens:  ../student/home.html   ../public/login.html
