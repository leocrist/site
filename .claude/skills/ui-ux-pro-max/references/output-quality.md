# Evidence-based output quality protocol

Contents: 1. Acceptance criteria; 2. Standards and sources; 3. Accessibility tests; 4. UI tests; 5. UX tasks; 6. Graphic principles; 7. Content and format; 8. Release gate and retesting.

Make quality a release gate, not a subjective compliment. Apply this protocol to the actual final artifact and its intended users/context. Distinguish normative standards, informative guidance, project acceptance thresholds and professional design heuristics. Never describe a personal aesthetic preference as an international requirement.

## 1. Establish acceptance criteria before implementation

Derive requirements from the user's brief, medium, audience, supported devices, tasks, viewing conditions, brand and output/editability requirements. State consequential assumptions. Define success for each primary user task before building: expected outcome, allowed critical errors, and any meaningful time/step threshold. Use user-specified thresholds first. If none are given, label proposed thresholds as project defaults, not universal benchmarks. Do not invent measured usability data.

Maintain a test ledger with:
`ID | requirement / user task | source + criterion/version or project rule | scope | test procedure | expected result / threshold | observed result + evidence | status | severity | fix + retest`

Use only PASS, FAIL, NOT TESTED, or NOT APPLICABLE. Justify every NOT APPLICABLE. Record exact artifact/version, viewport/zoom, browser/render tool and relevant test date. PASS requires evidence; a plan to test is NOT TESTED. Keep evidence as screenshots, rendered pages/slides, computed values, interaction logs, structured scan results or actual user-test observations. Record references without copying sensitive user data into public reports.

## 2. Standards hierarchy and sources

- Web accessibility: use WCAG 2.2 Level AA as the default target unless the user sets another target. Include ALL applicable Level A and AA success criteria in the scoped inventory, not merely the selected checks below. Re-check the official normative source when interpreting exceptions or claiming conformance: https://www.w3.org/TR/WCAG22/
- Use W3C's checklist and Understanding documents to select techniques and clarify criteria; distinguish informative guidance from normative requirements: https://www.w3.org/WAI/WCAG22/quickref/ and https://www.w3.org/WAI/WCAG22/Understanding/
- For custom widgets consult WAI-ARIA Authoring Practices patterns, and use native HTML where possible. APG is implementation guidance, not a standalone conformance certificate: https://www.w3.org/WAI/ARIA/apg/
- Frame usability around specified users, goals and context using ISO 9241-11:2018. Official scope: https://committee.iso.org/standard/63500.html . Do not claim ISO certification, reproduce unseen paid requirements or attribute project test thresholds to ISO.
- Graphic hierarchy, proximity, alignment, repetition, balance, scale, whitespace and typographic rhythm are design principles evaluated through declared project rules and evidence; they are not one universal ISO/WCAG numeric checklist.
- WCAG web interaction tests do not automatically apply to slide images, printed posters or standalone raster artwork. Apply relevant perceptual checks as project targets, use the format's actual accessibility workflow, and explicitly scope the claim. Never call a PDF/PPTX WCAG- or PDF/UA-conformant based only on visual contrast.

## 3. Web accessibility tests: minimum baseline, not exhaustive

| Check | Normative reference / threshold | Procedure and evidence |
|---|---|---|
| Text contrast | SC 1.4.3 AA: at least 4.5:1 ordinary text; 3:1 large text (at least 18 pt regular or 14 pt bold, approximately 24 CSS px / 18.67 CSS px). Respect normative exceptions including logotypes and incidental text. | Compute actual foreground/background relative luminance from rendered/composited colours. Record colours, ratio, text size/weight and state. Do not round 4.49 up to passing. For images/gradients inspect the least favourable actual background under text, not an average or arbitrary swatch. |
| Non-text contrast | SC 1.4.11 AA: 3:1 for visual information needed to identify UI components/states and essential graphical objects against adjacent colours, subject to exceptions. | Measure required boundaries/icons/chart elements in relevant states. Do not require 3:1 for every decorative border or disabled control. |
| Colour independence | SC 1.4.1 A | Check that status, error, links where relevant, and data distinctions have non-colour cues. |
| Keyboard and focus | SC 2.1.1, 2.1.2 A; 2.4.3 A; 2.4.7 AA; 2.4.11 AA | Traverse primary workflows using keyboard only; test activation, menus/dialogs, Escape and focus restoration where appropriate; confirm logical order, no traps, visible focus and focus not entirely obscured by author content. Record actual trace/screenshots. |
| Focus enhancement | SC 2.4.13 AAA, optional stronger project target | If adopted, verify the criterion's focus indicator area and contrast conditions. Do not mislabel this AAA criterion as an AA requirement. |
| Pointer target | SC 2.5.8 AA: 24 × 24 CSS px OR applicable spacing/equivalent/inline/user-agent/essential exceptions. Optional 44 × 44 project target aligns with SC 2.5.5 AAA subject to its exceptions. | Measure actual actionable bounds and neighbouring target spacing; record the exception if used. Do not confuse visual icon size with hit area. |
| Reflow and text enlargement | SC 1.4.10 AA: vertically scrolling content at 320 CSS px without loss or two-axis scrolling except essential two-dimensional content; SC 1.4.4 AA: resize text to 200% without loss, with its exceptions. | Test 320 CSS px equivalent / 1280 px at 400% browser zoom for reflow, plus text enlargement separately. Record clipping, horizontal overflow and permitted table/map exceptions. A mobile screenshot alone does not establish text resize compliance. |
| Text spacing overrides | SC 1.4.12 AA | Apply line-height 1.5×, paragraph spacing 2×, letter spacing .12×, word spacing .16× font size together; verify no content/function loss. These are override-test values, not mandatory default styling. |
| Structure and names | SC 1.1.1, 1.3.1, 1.3.2, 2.4.2, 2.4.4, 3.1.1, 4.1.2 as applicable | Inspect headings, landmarks, reading order, page title/language, alternatives, link purpose, accessible names/roles/values; use accessibility tree and assistive technology for complex controls. |
| Forms, errors, status | SC 3.3.1, 3.3.2 A; 3.3.3 AA; 4.1.3 AA; others as applicable | Test valid/invalid/empty submissions, programmatic labels, specific error identification, correction path and announced status. Include authentication/redundant entry criteria if applicable. |
| Motion, media, hover | Applicable criteria including 1.2.x, 1.4.13, 2.2.2, 2.3.1 | Inspect required alternatives/captions, pause controls, flashing limits, hover/focus dismissibility and persistence as applicable. Treat reduced-motion support as an additional project practice unless mapping a specific criterion. |

Use the WCAG contrast formula `(Llighter + 0.05) / (Ldarker + 0.05)`, with linearised sRGB relative luminance (0.2126 R + 0.7152 G + 0.0722 B). Composite alpha before measuring. Use an established tool or deterministic calculation; never guess from appearance.

Run an available automated accessibility checker where appropriate, then perform manual tests. Record tool/version/scope and results. A zero-issue scan, Lighthouse score, screenshot or passing contrast calculation alone does not establish WCAG conformance. Do not claim screen-reader testing unless it was performed with a named assistive technology; accessibility-tree inspection is distinct evidence.

## 4. UI and functional acceptance

Declare supported widths/devices and states. Use 320 CSS px plus representative mobile, tablet and desktop widths for responsive web work where relevant; explain scope for fixed-format assets.

Test every implemented primary action, destination, menu, dialog and form in scope. Include relevant default, hover, focus, active, disabled, loading, empty, error and success states. Confirm feedback, recovery and state persistence where required; distinguish mocked success from a working integration. Check labels and component behaviour for consistency. Verify touch and keyboard access separately. Record broken links, missing assets, runtime errors and overflow. Use actual output, not a source-code-only review.

If performance is in scope, measure using an appropriate current tool and declared environment; do not fabricate Core Web Vitals from a static mockup or assume a lab result equals field data. Verify current official metric definitions before making numeric compliance claims.

## 5. UX acceptance with observable outcomes

For each primary user task record starting state, action sequence, expected destination/outcome, observed completion, errors, and recovery. Check findability, understandable labels, feedback, consistency, prevention of avoidable errors and unnecessary steps. Use explicit task scenarios such as finding a price, locating an event date, registering, or opening a report.

Separate expert walkthrough from testing with representative users. A self-performed walkthrough can establish functional findings but cannot establish user satisfaction or population success rates. If representative users are available and authorized, measure effectiveness (task completion/accuracy), efficiency (time/effort/steps) and satisfaction using declared methods and participant/sample limits. Without users, mark those empirical metrics NOT TESTED and label heuristic findings as expert judgments. Never invent a universal acceptable click count, success percentage or satisfaction score.

## 6. Graphic principles with explicit project criteria

| Principle | Operational acceptance rule | Evidence |
|---|---|---|
| Hierarchy | Identify primary message, supporting content and action in advance; ensure defined type size/weight/placement differentiates them. State the viewing size. | Annotated render plus actual sizes; use an actual comprehension task if claiming audience understanding. |
| Alignment/grid | Establish margins, column edges and anchor lines; require intended aligned elements to share anchors within declared format-appropriate tolerance. | Measured element bounds or guides over a render; justify intentional exceptions. |
| Proximity/spacing | Define spacing tokens; require related elements to group more closely than unrelated groups where grouping depends on space. | Gap measurements; inspect captions, labels and group boundaries. |
| Repetition/consistency | Assign roles to fonts, colours, shapes and component variants; avoid unexplained changes for the same role. | Token/style inventory and cross-page/slide comparison. |
| Balance/whitespace | Establish focal element and reading path; keep essential content inside declared margins/safe areas with no unintended overlap. | Full-size and thumbnail previews; documented compositional rationale. Do not invent a universal whitespace percentage. |
| Typography | Verify actual font/glyph support, wrapping, line length, line spacing and legibility at intended size; set project minimum type sizes before layout. | Render at viewing scale; no clipping, orphaned critical words or broken Vietnamese accents. Font-size defaults are project decisions, not universal standards. |
| Colour/data | Verify required contrast numerically, non-colour distinctions, correct axes/units/scales and truthful visual encodings. | Contrast report, source-to-chart comparison and rendered chart. |
| Asset fidelity | Preserve logo proportions, image quality, crop and supplied brand constraints. | Compare against source at final export size; note missing brand specifications. |

Do not use an arbitrary weighted beauty score to override a functional/accessibility failure. Record the evidence and consequence of each design issue, not vague claims such as 'premium', 'balanced' or 'user-friendly'.

## 7. Content, format and research integrity

Verify required names, dates, affiliations, data and claims against supplied sources. Mark missing facts; never fabricate testimonials/prices/citations. Preserve editability when requested. Render every page/slide; check chart accuracy, title wrapping and readable notes. For email, distinguish preview testing from real client testing. For slides, test the intended presentation view; for social graphics, inspect feed-scale crops. For links/previews test integration separately from image creation.

Keep reference source claims separate from visual observations and design inferences. Never claim an inaccessible reference was visually inspected or a curated ad has measured performance evidence.

## 8. Release gate and retesting

Classify severity by impact: blocker (cannot complete essential task / corrupt output / fabricated critical content), major (material accessibility, readability, responsive or functional defect), minor (nonblocking consistency/polish issue). Fix all known blockers and major defects in the deliverable scope, then rerun affected tests and primary workflows. Re-test contrast after palette changes and re-render after layout/font changes.

If a required test is unavailable, retain NOT TESTED; do not convert it to PASS. Deliver a clearly qualified draft/partial assessment when checks are incomplete, with the exact limitation and next test. Do not assert the full release gate passed or claim standards conformance. Honour user requests for an early draft while labelling it appropriately.

Report: artifact/version and tested scope; counts/statuses by category; unresolved issues and limitations; evidence links where useful. For small edits use a focused ledger and short final summary; for substantial delivery include a compact QA table or companion report through the normal artifact workflow. Only declare WCAG 2.2 AA conformance after the complete applicable A/AA inventory, full pages/processes and conformance requirements have been assessed with sufficient evidence. Otherwise say 'tested against selected WCAG 2.2 AA criteria' and list scope.
