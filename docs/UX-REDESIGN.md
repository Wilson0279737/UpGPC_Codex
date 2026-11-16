# UX redesign and independent review

The November 16, 2026 redesign aims to make shopping for a PC, arranging a service, and contacting Upgrade Gaming PCs clear and satisfying. The owner authorized substantial style and layout changes with less repeated content.

## Design decisions

- Use a bold graphite and lime visual direction, clear type, generous spacing, consistent controls, and real product photography. Use the accent to emphasize actions and state rather than decorate every section.
- Make products the main shopping journey. Show price, availability, and consistent essential specifications where buyers assess options. Keep sold PCs in an intentional archive.
- Give services and contact pages distinct jobs. Consolidate repeated pitches, inventory guides, showcase sections, and generic calls to action. Retain useful navigation and contextual help.
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
