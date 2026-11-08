# Mobile responsiveness and usability audit

## Scope and architecture

Reviewed the Next.js App Router project: `/`, `/battle`, `/how-it-works`, the
404 screen, metadata/image routes, and both API handlers. `RoastApp` owns the
client forms, warning, loading/error states, solo results, and share workflows.
Battle results and image cards load dynamically. Global CSS supplies the warm
courtroom/stage identity. Guide, FAQ, navigation, and footer content are shared
or server rendered. API handlers and GitHub/Groq helpers retain their behavior.

## Findings and changes

- Navigation links were small and wrapped unpredictably. Below 900px, use a
  compact, three-column navigation row with 44px targets and a current-page
  indicator. Navigation stays in normal flow; no fixed menu consumes space.
- The 760px cutoff left tablets with narrow battle columns. Forms and battle
  content now stack through 900px, while result actions use two columns where
  space permits and one column on narrow phones.
- Inputs used 15px text, risking iOS focus zoom. They now use 16px text, 44px
  input targets, visible field focus, and keyboard action hints. Enter in the
  first battle input advances to the second; submitting dismisses the input
  keyboard before opening the warning.
- Small labels and low-contrast supporting copy made evidence and results hard
  to scan. Mobile text, spacing, contrast, and button sizing were increased.
- Long handles, languages, repository names, verdicts, and button text could
  overflow or truncate. Grid children can shrink and dynamic text wraps.
- The warning now locks background scrolling with body positioning, restores
  scroll/focus on dismissal, and supports short viewports and safe areas.
- Mobile reveal delays, blur transitions, animated lights, texture compositing,
  and continuous decorative animations were reduced. Desktop motion remains,
  and reduced-motion preferences also select the quieter presentation.
- Fixed export dimensions are intentional: solo cards remain 1200×675 and battle
  cards remain 1080×1350. Export layouts were preserved and downloads verified.

## Verification

Production application exercised locally with Playwright:

- Chromium: 320, 360, 375, 390, 430, 768, 1024, and 1440px.
- WebKit: 320, 390, and 768px; additional short dialog viewport checks.
- All four page types, FAQ expansion, navigation, mode switching, form validation,
  loading, solo/battle results, errors and retry, warning cancel/confirm/Escape,
  focus behavior, and copy actions. Chromium uses the real browser clipboard;
  WebKit clipboard access was stubbed for automation.
- Stress fixtures include long usernames, unbroken project names, lengthy roast
  text, long language names, and large counters. Checks inspect page overflow,
  clipped result/control text, and primary target heights. Screenshots captured
  for visual inspection. Portrait and landscape dialog cancellation checked.
- Actual solo and battle PNG downloads checked in Chromium at 320, 768, 1440px.
- `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run seo:check --
  http://localhost:3118`, and `git diff --check` passed.

No dependencies, backend APIs, authentication, or business rules were changed.

## Limits

GitHub/Groq responses and avatar images were mocked in browser tests for
repeatable coverage; live AI generation was not retested. Browser viewport
emulation cannot fully reproduce a physical iPhone keyboard, browser chrome,
notch insets, Android performance, or OS download/share behavior. Verify those
on actual devices before release. The app still requires JavaScript and a
modern browser supporting native dialogs and dynamic viewport units.

