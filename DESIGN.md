# Sometime Design System

## 1. Atmosphere & Identity
Existing brand, not a new visual identity: warm campus optimism, purple wordmark,
soft dimensional heart illustrations, and spacious Korean typography. Extracted
from ContentShell, StoreInstallCta, desktop landing sections, globals.css, and the
local font setup. The download signature is two overlapping **existing promotional
app screens**, not fabricated UI. Installation comes before explanation.

## 2. Color
Preserve existing light surfaces regardless of system dark mode. Brand/accent:
`#7A4AE2`; strong accent `#5B35B5`; lilac `#AD91EA`; ink `#201823`;
body `#625A68`; white `#FFFFFF`; wash `#FCFAFF`; lilac wash `#F4F0FF`;
line `#EEE8FF`; subtle line `#F1ECFA`. Purple is both brand identity and action.
Use the existing literal Tailwind color convention; no global token migration.

## 3. Typography
WantedSans Variable for display/headings; Pretendard Variable for body/utility,
using the existing next/font variables. Display 36-56px, weight 800-900, line
height 1.2-1.3, tracking -0.04em. Section headings 28-40px / 1.3 / 800.
Feature titles 20-24px / 1.4 / 700; body 16-18px / 1.7; utility 14px / 1.5;
small labels 12px / 1.5. Korean word-break keep-all, balanced headlines.

## 4. Spacing & Layout
4px base: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px. Existing public
shell is 900px; download composition may use 1152px for the split hero. Gutters
20px mobile, 32px tablet/desktop. Tailwind breakpoints 640/768/1024/1280px.
Document owns scrolling; no fullpage plugin or fixed install overlay. Hero:
copy + both native store anchors first, preview below on mobile; two columns on
desktop. QR is desktop-only (1024px+). Keep both badges above the mobile fold;
use a fluid two-column badge row even on narrow screens. Feature rows use open dividers,
not a generic three-card grid. Asymmetric screen overlap gives a focal point.

## 5. Components
- **ContentShell**: reuse existing brand header/footer and legal links; shared
  worker owns navigation and accessibility states.
- **StoreBadge**: reuse exported official image anchor, accessible store name,
  actual tracked href, native new-tab behavior, hover/pressed/focus states.
  Hero surface `landing_download_hub`; closing surface `landing_download_final`.
  Group on a lilac surface so white official badge assets have clear boundaries.
- **DesktopDownloadQrSection**: compact horizontal figure with original QR SVG,
  112px image, short instructions, no redundant card or long URL block.
- **Preview**: existing /images/5.png welcome and /images/7.png interests screens;
  preserve original proportions and label as promotional app screens that may
  differ from the current app. No invented metrics or fabricated chat/profile UI.
- **Feature rows**: numbered semantic articles with short copy and working links.
- **FAQ**: short visible question/answer list; full FAQ link; no JS accordion.
Only real anchors interact; no loading/empty/error states for static content.

## 6. Motion & Interaction
Use existing shared link/badge feedback. No decorative floating or autoplay.
Focus is visible, purple, offset; interactive hit areas at least 44px. Any local
transition uses 150-200ms and respects reduced motion. Previews remain static.

## 7. Depth & Surface
Mixed, following existing brand: white + lilac tonal surfaces, soft purple
ambient radial light behind actual assets, 1px lilac dividers. Restrict tinted
drop-shadow (0 24px 32px rgba(61,33,118,.14)) to the layered screen composition.
Existing radii: 12px (badge/QR), 24px (public panels), 32px (soft surfaces).
Do not enclose each content block in a card. No unrelated dark section.

## 8. Accessibility Constraints & Accepted Debt
Target WCAG AA: 4.5:1 body, 3:1 large text, meaningful alt text, semantic
landmarks/headings, keyboard-visible focus, 44px targets, reflow at 320px.
No gender-specific offers, quotas, refund strategy, or unsupported guarantees in
copy or visible image text. Asset review: 5.png and 7.png have none; reject 6.png
because it displays historical metrics/timing, and intro4.png because it exposes
a ticket count. big-univ-verify.png is an existing illustration, not an app screen.

Accepted scope / handoff: retain existing tooling for this scoped change; no shared font/token
refactor. Screens are existing promotional assets, explicitly labeled rather than
claimed as current captures. Parent owns integrated build and real-browser QA
(375/768/1280px, first-fold badges, keyboard links, QR, responsive overflow).
File diagnostics are the child handoff gate, not a claim of browser verification.
