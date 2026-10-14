# TenStages landing: design system

## Brief
- Subject: TenStages, a meditation training app (iOS + Android) built on *The Mind Illuminated*'s ten stages.
- Audience: people who want a structured practice, beginners and stuck intermediate meditators.
- Job: explain the method in seconds, make the ten stages tangible, send people to the stores.
- Assets: logo (switchback mark + wordmark), 3 real app screenshots from the current site, store badges, support email.
- Language: English (the app and current site are English).
- Kept from the current site: cream #FFFAD5, logo gold, teal grey header #3E4D4D.

## Concepts
| | Idea | Anchor | Signature | O/F/Fe/P |
|---|---|---|---|---|
| A. Name/mark | The page is the logo's switchback: one gold line turns ten times down the page, one turn per stage, and the page brightens from dusk to cream as you walk it | the logo IS a switchback path; the app's stage map is the same winding elephant path, dark at the start and gold at the end | scroll draws the line, a point of light (attention) walks it, ground and ink follow | 4 / 5 / 5 / 1 |
| B. Material | The traditional elephant path painting: the elephant whitens stage by stage | TMI's own illustration | an elephant silhouette fills with light per stage | 4 / 4 / 2 / 2 |
| C. Formal | The site breathes: every motion runs on a 6 breaths/min cycle | breath as the meditation object | type and line pulse with a breath clock | 3 / 3 / 4 / 4 |

Pick A: the mark, the app's map and the method are literally the same shape. Steal from C for the hero: the point of light breathes while idle.

## Concept card
```
Idea:        The logo's path, walked: ten turns down the page, and the page gets lighter at every turn.
Metaphor:    a switchback mountain path at dawn
Signature:   the path section: scroll draws the gold switchback, a breathing point of light walks it,
             ground goes dusk → cream, header counts "Stage 04 of 10" (driver module src/motion/path.ts)
Emotion:     quiet, unhurried, oriented. "I can see the whole way from here."
Motion verb: walk. Things advance steadily along a line and settle; nothing bounces.
Screenshot:  the turn between stage 6 and 7, where the dark line meets the light ground
```

## Palette (roles)
| Role | Dusk (stage 1) | Light (stage 10) |
|---|---|---|
| ground | #141B1B (old header teal, deepened) | #FFFAD5 (current site cream) |
| ink | #FFFAD5 | #2B2A26 |
| muted | #B9B49A | #5C584C |
| accent (text) | #D9BC7A (logo gold) | #7D5E22 (gold, darkened for AA) |
| line | ink at 16% | ink at 16% |
| path | umber #6B5232 → gold #D9BC7A → bright #E9CF8E |

Ground interpolates through #1E2828 → #3E4D4D → #F2EAC0; ink flips once, at the stage 6/7 turn ("the mind unifies").

## Type
- Display: Zodiak (Fontshare) 300/400 + italic. Book voice, sharp but calm. Tracking -0.03em at xl, -0.02 at l.
- Text/UI: General Sans 400/500. Geometric and rounded-leaning, kin to the logo wordmark.
- Numerals tabular in the stage counter.

## Grid & rhythm
12 cols desktop, 4 on phones, gutter fluid. Text hangs from col 2 and col 7. Section moods: hero full viewport, statement airy, app gallery tight, path full-length, letter airy, footer full viewport.

## Shape
One rule, from the logo stroke: round caps. Buttons are pills, lines have round caps, nothing else is rounded.

## Motion
Engine eases (expo.out / expo.inOut). Line reveals on headings, stroke draws for every line. Page transition: the ground rises from below with a gold edge line, like the next turn of the path.

## Composition
```
HERO (poster, dusk)          STATEMENT (8 cols)           THE APP (gallery wall, staggered)
| TenStages     path  app  ↓|  |    Most apps hand you   |  | [phone]       [phone]       |
|                    ═══╗   |  |    a timer. TenStages   |  |  map  [phone]  practice     |
| Ten stages        ╔═══╝   |  |    hands you a map...   |  |        mind                 |
| from first sit    ╚═══╗   |  |                         |  |                             |
| to a still mind.  ╔═══╝   |
| [App Store][Play] ╚═══    |
THE PATH (switchback, dusk→cream)       LETTER (cream, 6 cols right)     FOOTER (cream, poster)
|═══════════════════════════╗ |         |        Why we built it   |    | Begin at        |
| 01 Establishing a practice║ |         |        paragraph...      |    | stage one.      |
|╔══════════════════════════╝ |         |        signature         |    | [stores] email  |
|║  02 Interrupted attention  |
```

## Genericness test
- A generic model would put a centered hero over a gradient and three feature cards: replaced by the mark-as-map hero and a staggered gallery of real screenshots.
- Generic "timeline" for the stages: replaced by the logo's own switchback geometry, with ink/ground driven by the same variable.
- Cream + serif reads editorial-AI: the site spends its first half in dusk teal; the cream is earned at stage 10 and comes from the current brand.

## Languages (i18n)
- English at `/` and `/stages/N`; Spanish (Spain, informal "tú") at `/es/` and `/es/etapas/N`. Each page links its twin with `hreflang` (plus `x-default`), and `og:locale`, JSON-LD `inLanguage` and the OG image (`og.png` / `og-es.png`) follow the language.
- All copy lives in `src/i18n/en.ts` and `src/i18n/es.ts` (`es.ts` must satisfy the `Dict` type, so a missing key fails the build). Language-independent facts stay in `src/data/site.ts`.
- Pages are shared views in `src/views/` (Home, Stage, NotFound) with thin route files per language. Routes and anchors come from `src/i18n/index.ts`.
- There is no automatic redirect by browser language: the switcher in the header is the only way to change it.
- To add a language: add a dict, a `Lang` entry, a route folder, a slug in `i18n/index.ts` and an OG image.
