# SPSS Email Signature Builder

School-wide signature pilot for the University of Bedfordshire School of Sport, Psychology and Social Science.

The current interface is the **University Signature Studio**, a three-stage guided journey: Your details → Personalise → Ready to copy. The live preview continues using the existing Outlook-compatible renderer.

Live site: https://mikelnewell.github.io/SPSS-Signature-Builder-/

## How staff use the builder

1. Enter your name, job title, contact details, and optional profile/ORCID links.
2. Choose the subject area relevant to your role. The School and Faculty names are fixed.
3. Select optional professional affiliation logos that genuinely apply to your role.
4. Select and reorder up to three appropriate marketing claims. Sport, Psychology and Criminology claims are subject-specific and must never be presented as school-wide. Criminology is a separate subject from general Social Science.
5. Select **Copy my signature** for new messages, or **Copy compact reply signature** for replies. Both versions contain all nine mandatory student-support contacts.
6. Paste into Outlook > Settings > Accounts > Signatures (new Outlook / web) or File > Options > Mail > Signatures (classic Outlook).
7. Send a test message to an external address. Check layout, images, links and mobile display. You may use the HTML download fallback if your browser blocks clipboard access.

This website is a pilot pending approval from the Head of School. It is not evidence of current accreditation or institutional marketing approval.

## Maintainers

- \`config.js\`: School and Faculty names, University logo path and dimensions, ORCID icon, nine student support contacts, discipline list, affiliation approvals and marketing claim registry.
- \`app.js\`: display logic, selection controls, input validation and Outlook-compatible HTML generation.
- \`index.html\`: branded three-stage interface and accessible structure.
- \`studio.css\`: central interface design tokens, responsive typography, panels and interaction styles.
- \`studio.js\`: step navigation, accessible focus, inline guidance and restrained selection feedback. Does not change the signature HTML renderer.
- \`tests/studio.spec.mjs\`: Chromium regression checks for the journey, subject filters, required support contacts, signature HTML and mobile layout.
- \`.github/workflows/studio-qa.yml\`: automatic browser QA for the feature branch and pull requests.
- \`assets/logos/\`: approved or pilot branding assets. The current wordmark is \`university-of-bedfordshire-master.png\`. The legacy logo file is retained so existing emails do not break. Never rename an image file already used in sent email signatures.
- \`PILOT_CHECKLIST.md\`: test plan for staff and University Marketing.
- \`MARKETING_CLAIMS.md\`: source-by-source provenance for the new Psychology and Criminology figures, including marketing artwork filenames.

The source branch is \`main\`, publishing from repository root via GitHub Pages. Do not change the repository name or the GitHub Pages path.

### Adding an affiliation

Upload the original colour logo to \`assets/logos/\` and add an entry to \`config.js > affiliations\`, supplying a unique \`id\`, \`name\`, \`path\`, \`w\`, \`h\`, \`audience\`, \`status\` and \`note\`. Use \`status: "pending-asset"\` and \`path: null\` until the official asset and permission are confirmed. Rendered logos preserve aspect ratio, display in compact groups of up to four per row and use Outlook-compatible tables.

The Career Powered Education logo is not a selectable affiliation. It is a fixed promotional image (the cropped supplied JPEG, retaining its original colours and artwork at 685 × 685 pixels at `assets/logos/career-powered-clean.jpg`) displayed on the left of a table-based promotional panel only when one to three marketing claims are selected. No claims means no promotional panel; the compact reply signature never includes it. The logo and claims appear side-by-side in both the preview and Outlook HTML. The image URL is absolute HTTPS in exported signatures.

The BASES Accredited Laboratory claim/logo has been withdrawn pending a review of accreditation, and its obsolete file was deleted from the repository. The CASES logo remains available. The British Psychological Society (BPS) accreditation logo is available to staff working with BPS-accredited Psychology programmes; the artwork currently comes from the University's Psychology course page (https://www.beds.ac.uk/media/j5nbse4p/bps-logo.png), and can be moved to a locally hosted approved asset if supplied. It does not imply individual accreditation. The AHCS entry is intentionally disabled until an official asset and permission are supplied. The People & Planet logo explicitly states its historical 2023/24 year.

### Adding a ranking

Add a new item to \`config.js > claims\` with:
\`id\`, \`discipline\` (one of \`all\`, \`sport\`, \`psychology\`, \`criminology\`, \`social\`), \`category\`, \`figure\`, \`headline\`, \`source\`, \`year\`, \`review\`, \`status\`, \`priority\`.

Do not invent claims, conflate competing guide categories, or treat a discipline ranking as school-wide. The existing figures come from University marketing graphics and are labelled \`pilot-review\`. Confirm the appropriateness, accuracy and current status before rollout. \`status: "withdrawn"\` hides a claim from the selector.

### Student support information

The nine addresses and exact descriptions supplied by the Head of School are centrally maintained in \`config.js\`, always printed in both signature variants and never editable by staff.

### ORCID iDs

Accepts the complete identifier or a full ORCID profile link; validates the ISO 7064 Mod 11-2 check digit. Uses the official green ORCID iD icon URL, hyperlinked to the person's profile. Identifiers are manually entered and are not authenticated through ORCID OAuth; only the linked green icon and identifier appear in the signature, without an authentication label.

### Known pilot limitations

- The university wordmark now uses the University-supplied transparent master PNG, trimmed of its surrounding transparent margins and optimised at **1024 × 318 px**, displayed at **176 × 55 px** for sharp high-density rendering. Test image display after pasting into each Outlook client.
- Approval is still required for applicable programme and institutional accreditation logos, marketing claims and any additional school-wide material.
- A real desktop/Mac Outlook and external Gmail pilot is needed. The builder generates HTML tables with inline styles and absolute hosted HTTPS asset URLs, but browser testing does not substitute for Outlook paste and send tests.
- Web browser clipboard behaviour and images being blocked by recipient mail clients cannot be entirely controlled by the site.
- Form entries are generated client-side and not stored or transmitted to an application backend; normal remote image requests still occur.

## Change control

Staff pilot sign-off: Head of School and University Marketing.
Update the marketing claim registry and institutional images whenever a new annual guide or survey is released.

Do not announce the signature as an officially approved institution-wide standard until approval has been explicitly granted.

## Psychology and Criminology update (11 November 2026)

Eight claims were added to the central registry: four Psychology claims (including the 90% teaching statistic within the 96% support artwork), and four Criminology claims. Staff select Psychology or Criminology to see only relevant marketing claims; general Social Science remains separate. Source files and exact wording are recorded in \`MARKETING_CLAIMS.md\`.

The original 2048-pixel artwork was supplied by the requester but is not hosted in the repository; only the statistics are rendered as compact email-safe cards. No full-resolution images are embedded in email signatures.


## Signature Studio visual approach

The interactive builder adopts the **Guided Signature Journey** concept with editorial typography informed by the Editorial Signature Studio. Staff work through details, optional personalisation and a clear final copy step. The Outlook HTML itself retains one institutionally consistent design. The email-style preview frame is interface-only and is never part of the copied signature. No new server, sign-in, tracking or personal data storage has been added.

The application uses a small named token scale in `studio.css`, explicit responsive breakpoints and a reduced-motion fallback. All nine support contacts are mandatory and remain in both outputs. The School-wide pilot notice remains until approval.

Browser tests run in the feature branch and on pull requests. Passing automated browser checks does not substitute for an Outlook Windows/Mac and external-recipient test before general staff rollout.
