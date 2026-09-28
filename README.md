# CyberColt Booth Remote

Standalone remote-control page for the CyberColt Photobooth, hosted at
remote.cybercoltphotobooth.com (GitHub Pages).

An operator scans the QR shown on the booth console (Booth console -> Remote,
behind the operator code). The QR opens this page paired to that booth by
(event code, device id, pairing token). The page reads the booth's live status
from Firestore and writes Start / Cancel commands the booth executes.

Security: the booth only acts on commands whose token matches the one it minted
for the QR, and that token is only ever shown on the booth screen. "New code" on
the booth mints a fresh token and revokes the old link.

Static site, no build. Firebase (same cybercolt-photobooth project) via CDN.
