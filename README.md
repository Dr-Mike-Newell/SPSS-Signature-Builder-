# SPSS Email Signature Builder

A static, GitHub Pages-friendly signature builder for staff in the School of Sport, Psychology and Social Sciences, University of Bedfordshire.

## Features
- Editable staff details; standard, promotional and compact formats
- Individual accreditation and branding logo selection
- Up to three stackable, reorderable marketing claims
- Outlook-compatible HTML-table output and live preview
- Copy-to-clipboard and HTML download
- No backend, tracking, accounts or submitted personal details

## Launch using GitHub Pages
1. In the repository open **Settings > Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Choose **main**, **/(root)**, and save.
4. Once live, open https://mikelnewell.github.io/SPSS-Signature-Builder-/ .
5. Keep this repository public if external email recipients need to load its images.

## Maintaining logos and claims
Edit the `LOGOS` and `CLAIMS` arrays within `index.html`. Add images to `assets/logos/` and reference their relative paths. To add a logo, copy the structure of an existing entry, providing a unique ID, label, file and a specific applicability note.

Each image is referenced using a hosted HTTPS URL in exported signatures. Avoid renaming existing image files after publication because older signatures may break. For new ranking cycles, update the claim text and source, and remove outdated claims.

Logo selection does not mean a qualification or accreditation applies to every member of staff. Staff must only include relevant approved logos. Please get University Marketing approval before institutional rollout.

## Using the builder
Staff enter their own details, select which logos apply to them, then optionally select and order up to three marketing claims. Click Copy for Outlook; paste into Outlook's signature editor and test externally. A compact variant is provided for replies.
