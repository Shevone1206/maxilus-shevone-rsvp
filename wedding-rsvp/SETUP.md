# RSVP spreadsheet connection

The website is ready to publish as-is. To collect RSVP responses in Google Sheets, create a blank sheet with these headings in row 1:

`submittedAt | attendance | primaryName | guestNames | pax | allergies`

In that spreadsheet, open **Extensions → Apps Script**, replace the starter code with this:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.submittedAt, data.attendance, data.primaryName, data.guestNames, data.pax, data.allergies]);
  return ContentService.createTextOutput("OK");
}
```

Choose **Deploy → New deployment → Web app**, set access to **Anyone**, then deploy. Copy the web-app URL and paste it into `RSVP_ENDPOINT` near the top of `script.js`.

## Adding photos

The save-the-date poster you shared is already included as `save-the-date-poster.jpeg`. When you share more photos, they can be added as a gallery or worked into the main design.

## Publishing on Vercel

Create a Vercel project and upload this folder (or connect it from a Git repository). No build command is needed: this is a static site. Vercel will provide a free `vercel.app` link.
