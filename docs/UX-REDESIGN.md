# UX redesign and independent review

The November 16, 2026 redesign aims to make shopping for a PC, arranging a service, and contacting Upgrade Gaming PCs clear and satisfying. The owner authorized substantial style and layout changes with less repeated content.

## Design decisions

- Restore the actual original presentation from `f67d40fe2e30c0f9191c3bb1f1e4d51bf9a71782`: purple gradients and grid background, a floating white rounded header, the photographic Home banner, and purple glass panels/cards. The owner preferred this established style while retaining the improved functionality and concise navigation. The graphite/lime redesign and subsequent logo-blue experiment are superseded.
- Make products the main shopping journey. Show price, availability, and consistent essential specifications where buyers assess options. Keep sold PCs in an intentional archive.
- Keep Home to the original Hero, a preview of actual stock, and one concise service card. Remove the repeated proof strip, workshop photograph/pitch, and extra visit pitch rather than restoring the old generic PC marketing and map sections.
- Give services and contact pages distinct jobs. On Products, remove the bottom phone-help pitch that duplicates the inventory footnote. Label the collapsed archive **Previously sold PCs** so it is clearly distinct from current stock.
- Keep four task-oriented navigation routes with the logo linking Home. Remove the duplicate phone action from the mobile drawer; retain the persistent call control and the secondary Owner workspace entry in the footer.
- Preserve truthful product content, CMS editing, customer account boundaries, direct routes, and the existing Netlify release process. Do not invent performance claims, stock, photographs, reviews, guarantees, or service promises.

## Research translated into behavior

| Principle | Application | Evidence |
| --- | --- | --- |
| Help people recognize options rather than remember them. | Consistent card specifications, visible labels and selected states; keep relevant product context during navigation. | [NN/G: Recognition and recall](https://www.nngroup.com/articles/recognition-and-recall/) |
| Make the destination clear before a click. | Task-oriented navigation and specific actions such as viewing PCs or contacting the business; accurate labels for the actual destination. | [NN/G: Information scent](https://www.nngroup.com/articles/information-scent/) |
| Give buyers enough information to assess an item in a list. | Price, availability, CPU, GPU, RAM, and storage in a consistent order; filters and meaningful empty states. | [Baymard: Product listing information](https://baymard.com/research-articles/product-listing-information) |
| Reduce competing irrelevant content and preserve control. | Fewer duplicate sections, clear visual hierarchy, reversible filtering, visible feedback, and obvious exits from dialogs. | [NN/G: Usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) |
| Make credibility concrete. | Real photos, accurate stock and prices, usable contact information, coherent presentation, and working links. | [Stanford: Web credibility](https://credibility.stanford.edu/guidelines/) |
| Respond visibly without delaying the task. | Immediate menu/filter/save feedback, understandable pending/error states, restrained motion, and lightweight rendering. | [Google: Interaction to Next Paint](https://web.dev/articles/inp) |
| Make controls usable with different input methods and motion preferences. | Semantic controls, visible keyboard focus, sufficient contrast, practical large touch targets, and reduced-motion support. | [W3C: Target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [W3C: Animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) |

These are evidence-informed design choices, not measured conversion or satisfaction results for this business. Fewer choices, dark colors, and animation are not universally better. Useful information and necessary repetition should remain. INP's good threshold is 200 ms or less at the 75th percentile; a brief local check cannot establish a field performance score. WCAG's 24 px minimum target criterion has exceptions; 44 px is a practical design target and the enhanced criterion, not the AA minimum.

## Two-account workflow

1. The implementing agent inspects current repository instructions, preserves existing work, and owns changes on a feature branch.
2. With the owner's authorization, use the other signed-in Chrome account as an independent reviewer. Give it the goal, full commit SHA, relevant files or source links, known constraints, and the real Netlify preview URL when available. Ask for actionable findings with file/location evidence, reproduction steps, severity, and a suggested outcome.
3. Require the reviewer to state what it actually inspected. A source-only audit does not verify the rendered interface, interactions, accessibility, or live authentication.
4. The implementing agent checks each finding against the selected revision. Reproduce bugs where possible, assess proposals against user goals, fix accepted issues, and verify affected behavior. Do not treat the second account's answer as proof by itself.
5. Persist accepted decisions in the repository and record finding dispositions, validation, and the exact reviewed commit in the PR. Request another review when material changes invalidate the previous one.
6. Build, run relevant tests, and review the actual Netlify Deploy Preview. Production remains an explicit owner-approved release; merging `main` may trigger deployment.

Accounts do not automatically share chat history, memory, or files. GitHub and these repository documents hold the durable project context. A working custom Cloud environment is optional for this workflow.

## Initial Chrome review: source findings

The independent review inspected `main` at `f67d40fe2e30c0f9191c3bb1f1e4d51bf9a71782` in [this review chat](https://chatgpt.com/local/6afb2ad0-69f8-8191-b969-c2d1ce0c00fe). It was a source-only audit with no interactive browser verification. The following records its findings; inclusion is not a claim that every item is a reproduced or completed fix. The PR should record final dispositions and validation.

| ID | Finding | Classification | Verification or acceptance needed |
| --- | --- | --- | --- |
| R1 | The Products hero, inventory, sold archive, showcase, and inventory guide repeat marketing while offering little help comparing PCs. | Design proposal | Consolidate structure; assess whether the new listing provides useful specifications and comparison without unnecessary sections. |
| R2 | `#pc-ID` links scroll but do not open details; targets hidden by active filters can fail. | Source-identified behavior bug | Test direct links, refreshing, opening from another route, and filtered-out targets. Verify the intended PC becomes accessible. |
| R3 | Inventory/archive filters and pagination use local state that resets during navigation. | Source-identified behavior bug | Leave a filtered or paged listing, inspect another route or product, return, and confirm browsing context survives appropriately. |
| R4 | Saving while signed out leads to a generic account URL and loses the selected PC. | Source-identified flow bug | Preserve the intended product/destination through sign-in; verify the result without treating a click as a completed save. |
| R5 | Product imagery lacks enlargement; the content model currently supplies one image rather than a gallery. | Design proposal | Consider an accessible enlargement interaction. Do not fabricate additional images or claim a multi-image gallery without supporting content. |
| R6 | A free-quote action leads to generic contact channels without a dedicated quotation flow. | Design proposal | Align the action label and destination with the actual supported contact process. |
| R7 | Reduced-motion handling leaves hover transforms/header resizing transitions; mobile search uses 13 px text with a browser zoom risk. | Source-identified accessibility and usability issues | Inspect reduced motion, keyboard use, touch input, and mobile field sizing. Browser-specific zoom remains an interaction check. |
| R8 | Owner workspace access should be stable and distinct from customer sign-in. | Design proposal | Keep owner/CMS entry understandable and separate from customer accounts. The review did not establish an authentication failure. |

## Task-based validation

- **Choose a PC:** Find available stock within a budget, narrow results, inspect consistent specifications and photographs, open details, and follow the appropriate inquiry action. Distinguish available, sold, and hidden draft content.
- **Keep browsing context:** Change search/filter/sort/page state; open details, follow a PC deep link, navigate away and return, refresh, and recover from zero results.
- **Arrange service:** Identify the relevant service, understand the next step, and reach an accurate contact action with useful context.
- **Use accounts when enabled:** Sign in, save a selected PC, reload, remove it, and reload again in the configured non-production account environment. A preview with accounts disabled cannot verify this flow. See `CUSTOMER_ACCOUNTS.md`.
- **Use different devices and input:** Check desktop and narrow mobile layouts, direct-route refreshes, keyboard navigation, dialog/menu focus and Escape behavior, 200% zoom, reduced motion, and touch target spacing. Check for horizontal overflow and obscured content.
- **Review the hosted result:** Run the required build and relevant tests, inspect the actual Netlify Deploy Preview, and record its URL, source commit, findings, fixes, and any remaining verification limits in the PR.

## Initial functionality implementation and review outcome

The checks below record the earlier implementation and review iterations. They are historical evidence for the functionality work, not a claim that the final restored presentation has completed hosted QA. Record verification of the restored presentation against its own commit and preview.

- R1, R6, and R8 were accepted design changes: repeated product marketing was removed, navigation/contact actions now describe their real destination, and the footer provides a stable Owner workspace link. Current stock remains distinct from the sold archive.
- R2 and R3 were verified against source and exercised in a browser: a filtered-out Flame deep link opens the correct details; listing filters and archive page survive navigation and Back; zero results have a working reset. Query updates preserve the current scroll position rather than repeatedly jumping to an anchor.
- R4 retains a validated product selection through the account route and tab-local OAuth handoff, with an explicit save confirmation. Two intent tests passed in that iteration. The configured Google OAuth round trip and remote saved-list persistence still require separate staging integration verification; the reviewed Deploy Preview had accounts disabled.
- R5 uses the genuine existing photograph with an accessible full-size image link. A multi-image gallery was not added because the product content currently supplies one photograph per PC. Consistent card specifications support comparison without introducing another workspace for two current PCs.
- R7 was addressed with 16 px form controls, visible focus, a stable header, and reduced-motion overrides. Browser checks exercised modal Tab/Shift+Tab wrapping, Escape, return-to-trigger focus, interior/backdrop clicks, and mobile menu Escape.
- The second Chrome review inspected commit `0c812a82891ade4ed506ebbdf3ba8651f2c9c810` in PR #6. It found that the sticky header was trapped by the layout wrapper's horizontal overflow rule. This was reproduced in the hosted preview and corrected by removing that ancestor overflow restriction. Rechecking after the fix exposed and corrected an intrinsic grid-width overflow in the mobile catalog controls.
- At that iteration, browser layout checks covered Home, Products, Services, About, Contact, and Account at 320 CSS px, including expanded sold inventory. The tested controls and document fit the viewport. Storefront images were also changed to existing upright variants, and the repeated home photograph was replaced with a genuine shop-team photo.
- Validation: production build/TypeScript, 34 content/account tests, local desktop/mobile interactions, and the real [Netlify Deploy Preview](https://deploy-preview-6--website3-2.netlify.app/). Review and validation details are maintained in [PR #6](https://github.com/Wilson0279737/UpGPC_Codex/pull/6). These checks establish the tested behavior, not a user-study satisfaction score or field performance result.

## Visual experiments and final direction

Two visual experiments preceded the final direction:

- The initial graphite/lime design simplified the page structure and introduced the browsing fixes, but the owner found the earlier site more visually striking.
- A later logo-blue experiment added navy/cobalt/cyan surfaces, blueprint and cooling-fan decoration, and a Space Grotesk display font. The owner subsequently requested the actual old purple styling. This experiment is superseded; its colors, decorative system, and font are not the current design specification.

The chosen direction restores the original purple gradient/grid, floating white rounded navigation, photographic banner, and purple glass/card styling across the website. It preserves the concise information architecture, accurate calls to action, inventory search/filter state, direct PC details links, image enlargement, account selection handoff, accessible controls, and reduced-motion work.

Home now follows **Hero → actual stock preview → concise service card**. Products keeps current inventory and a clearly labeled, collapsed **Previously sold PCs** archive; the duplicate bottom phone-help panel is removed. The four task routes, logo-as-Home, single mobile call action, and distinct Owner workspace entry keep navigation concise.

Final local and hosted validation for this restoration must be recorded separately in the PR or appended below. The feature-branch → PR → actual Netlify Deploy Preview → explicit owner-approved production release process remains in effect.

During restoration QA, the sold-archive shortcut was reproduced missing its first jump because its target only mounted after opening. The `sold-pcs` anchor now belongs to the always-present disclosure; the first click opens and lands below the fixed navigation. A source review also identified same-page header links preserving the previous scroll position. This was reproduced on Home and fixed so ordinary logo/active-route clicks return to the top while modifier-click behavior remains available. Build and all 34 content/account tests pass locally; final hosted results are recorded in PR #6.

## November 17 live follow-up

The follow-up reviewed the live site and source baseline `a2432f53d969c8c21024a5819f08e4bc2439540a`, keeping the restored original styling and the existing inventory, authentication, CMS, and Owner workspace behavior.

Three navigation issues were reproduced on the live baseline:

- Clicking the footer Home logo while already on Home left the viewport around `scrollY=1010`. A shared same-page navigation helper now returns to the top and focuses the main content, covering footer and header links consistently.
- Keyboard navigation from Account's **Keep browsing PCs** to `/products#inventory` scrolled to the inventory but left focus on `BODY`. Fragment navigation now focuses its destination, so the next Tab reaches the inventory search rather than restarting at the page header.
- Explicitly closing the sold archive and then changing the current-stock Budget reopened it because unrelated query updates retriggered the archive effect. Archive opening now follows relevant archive-intent keys and respects an explicit collapse during unrelated inventory changes.

Four bounded copy cuts remove repeated material: About's second see/ask/test pitch, the Contact photo panel's duplicate visit pitch, Account's third signed-out shortlist marketing card, and the sold dialog's duplicate bottom sold note. Genuine product descriptions, availability and historical-price context, useful contact/navigation access, and the CMS/owner guidance remain. The Products metadata no longer promises browsing peripherals when the route only browses PCs.

Local verification passed: footer Home returned to `scrollY=0` with main-content focus; the inventory fragment received focus and Tab reached search; changing Budget left an explicitly closed archive closed. The production build/TypeScript check and all 34 content/account tests passed.

The follow-up PR records the actual preview URL, reviewed commit, final hosted checks, and independent review. The local results above do not establish a production publication; the explicit production-release step remains separate.
