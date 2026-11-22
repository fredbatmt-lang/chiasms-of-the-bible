Chiasms of the Bible - hosted site with password-protected saving

index.html        the chart
api/edits.js      returns the shared edits
api/save.js       saves edits (needs the editor password)
api/_store.js     keeps the edits in Vercel Blob storage
package.json      tells Vercel to install @vercel/blob

On Vercel: connect a Blob store to the project (Storage tab), and add an
Environment Variable named EDIT_PASSWORD with the editor password. Redeploy.
To change the password later, edit EDIT_PASSWORD and redeploy.
