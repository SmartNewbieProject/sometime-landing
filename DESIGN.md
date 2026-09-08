# Sometime Design System

## 1. Atmosphere & Identity
Existing brand, not a new visual identity: warm campus optimism, purple wordmark,
soft dimensional heart illustrations, and spacious Korean typography. Extracted
from ContentShell, StoreInstallCta, desktop landing sections, globals.css, and the
local font setup. The download signature is the supplied campus-moment artwork,
followed by five upright promotional examples. Installation comes before explanation.
The supplied artwork is not represented as current app screenshots or real users.

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
not a generic three-card grid. The desktop hero artwork is 300px wide; on mobile
it follows the store links at up to 380px. No image tilting, overlapping, or cropping.
The gallery uses one full-width item on mobile and 360px items from 640px upward.
Horizontal overflow is local to its native scroll region, not the page.

## 5. Components
- **ContentShell**: reuse existing brand header/footer and legal links; shared
  worker owns navigation and accessibility states.
- **StoreBadge**: reuse exported official image anchor, accessible store name,
  actual tracked href, native new-tab behavior, hover/pressed/focus states.
  Hero surface `landing_download_hub`; closing surface `landing_download_final`.
  Group on a lilac surface so white official badge assets have clear boundaries.
- **DesktopDownloadQrSection**: compact horizontal figure with regenerated QR SVG,
  112px image, short instructions, no redundant card or long URL block.
- **Preview**: supplied 01-campus-moment in the hero; 02-profile-interests through
  06-conversation in the gallery. Preserve every original disclosure and repeat
  example/AI labels in readable HTML captions. Full-size image links allow zoom.
  These replace the rejected /images/5.png and /images/7.png on /download.
- **Gallery**: semantic figures/list, focusable native horizontal scroll region,
  CSS scroll snap, and native named fragment anchors for item selection.
  Works with touch, trackpad, keyboard scrolling, and without JavaScript.
- **Feature rows**: numbered semantic articles with short copy and working links.
- **FAQ**: short visible question/answer list; full FAQ link; no JS accordion.
Only real anchors interact; no loading/empty/error states for static content.

## 6. Motion & Interaction
Use existing shared link/badge feedback. No decorative floating or autoplay.
Focus is visible, purple, offset; interactive hit areas at least 44px. Any local
transition uses 150-200ms and respects reduced motion. Previews remain static;
gallery navigation has no animation, timer, gesture interception, or client state.

## 7. Depth & Surface
Mixed, following existing brand: white + lilac tonal surfaces, soft purple
ambient radial light behind supplied assets, 1px lilac dividers. Let the artwork
carry its own depth; no extra image shadows or layered screen composition.
Existing radii: 12px (badge/QR), 24px (public panels), 32px (soft surfaces).
Do not enclose each content block in a card. No unrelated dark section.

## 8. Accessibility Constraints & Accepted Debt
Target WCAG AA: 4.5:1 body, 3:1 large text, meaningful alt text, semantic
landmarks/headings, keyboard-visible focus, 44px targets, reflow at 320px.
No gender-specific offers, quotas, refund strategy, or unsupported guarantees in
copy. All six supplied assets were visually reviewed: 01/02/05/06 disclose
example profiles/conversations and AI-generated people; 03 discloses example
settings; 04 discloses an app-source-based example composition. Preserve supplied
copy as artwork, not additional product guarantees. big-univ-verify.png remains
an existing illustration, not an app screen. No regenerated concepts or invented UI.

Accepted scope / handoff: retain existing tooling for this scoped change; no shared font/token
refactor. Assets are explicitly labeled examples, not current captures.
Parent owns integrated build and real-browser QA
(375/768/1280px, first-fold badges, keyboard links, QR, responsive overflow).
Targeted diagnostics and deterministic asset/gallery contract tests are the child
handoff gate, not a claim of browser verification. Keep only the hero and closing
store groups; shared-shell worker removes the redundant footer install panel.

## 9. Supplied Asset Provenance (2026-09-08)
Portrait originals: `/Users/smartnewbie_macmini/sometime-central/.orca/drops/`,
all 1320x2868 PNG. Bun.Image resizes proportionally to 990x2151 and encodes WebP
quality 88 without cropping. Shipped under `/images/download/`:

| Original basename | Original bytes | Shipped WebP bytes |
| --- | ---: | ---: |
| 01-campus-moment | 3460922 | 114298 |
| 02-profile-interests | 2645913 | 96150 |
| 03-privacy-settings | 715786 | 62006 |
| 04-university-verification | 625998 | 62770 |
| 05-matching-reason | 875778 | 66582 |
| 06-conversation | 675495 | 61150 |

Social original: supplied `orca-paste-1788805710757-befcbf06-5d4d-48cd-b488-65c80d66f8af.png`,
1024x500 PNG, 471255 bytes. SHA-256:
`dc17a7eb9683189606f2a576d0daebfc8dcbc44b1a0c57b7e9b4c5cd3bc5c764`.
Shipped **`/images/social/sometime-share-20260908.jpg`**, **1200x630**, **81209 bytes**.
Bun.Image proportional fit to 1200x586; macOS canvas adds 22px lilac padding above
and below; Bun.Image progressive JPEG quality 88. No text, faces, or AI disclosure
cropped; no stretching or new content. Parent owns the default OG/Twitter mapping.

QR: `/images/download/desktop-download-qr.svg`, qrencode 4.1.1, error correction M,
four-module quiet zone. Actual shipped SVG modules are rasterized and decoded by
Apple Vision to **`https://some-in-univ.com/download?surface=desktop_qr`**.
The decoder reads the shipped SVG, not its surrounding anchor or a second QR encoding.

Reproduce with existing Bun 1.4+, qrencode, and macOS Swift/AppKit/Vision:
`bun scripts/download-assets.mjs <drops-directory> <supplied-social-png>`.
The script reports source SHA-256 hashes, dimensions, byte counts, and decoded QR.
Validate with `bun test scripts/download-assets.test.mjs`; no new dependencies.
