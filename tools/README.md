# Notes import workflow

This folder documents the note publishing workflow.

## Current state

The site has an audit index generated from the Yunji backup folder:

- `../data/notes-review.csv`
- `../data/excluded-compile-principles.csv`
- `../data/notes.json`

The `.jnotes` files were indexed from the connected device, but direct PDF extraction is not confirmed yet. A copied sample appeared through the Windows device view as a placeholder directory rather than a normal readable file, so the safe first release keeps notes as an index until PDFs are exported.

## How to enable preview and download

After exporting a note to PDF and uploading it to GitHub Releases:

1. Find the matching row in `../data/notes-review.csv`.
2. Add the Release asset URL to the matching item in `../data/notes.json`:
   - `downloadUrl`: direct GitHub Release asset URL.
   - `previewUrl`: same PDF URL, or another browser-viewable PDF URL.
   - `status`: change to `published`.
3. Refresh `notes.html`; the buttons will become active automatically.

## Exclusion rule

Do not publish notes whose title or source name includes compile-principles keywords:

- 编译原理
- compiler
- compilation
- 词法分析
- 语法分析
- 龙书

