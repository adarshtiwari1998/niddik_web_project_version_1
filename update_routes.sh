#!/bin/bash
sed -i 's|href="/my-applications"|href="/candidate/applications"|g' client/src/pages/CandidateDashboard.tsx
sed -i 's|href="/careers"|href="/candidate/jobs"|g' client/src/pages/CandidateDashboard.tsx
sed -i 's|href="/profile"|href="/candidate/profile"|g' client/src/pages/CandidateDashboard.tsx
sed -i 's|href=`/jobs/${|href=`/candidate/jobs/${|g' client/src/pages/CandidateDashboard.tsx
chmod +x update_routes.sh
./update_routes.sh
