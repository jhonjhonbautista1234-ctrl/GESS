# GESS Survey Quest

Public route: `/games`, linked as **Game** in desktop and mobile navigation.

Reworks the supplied GAMES concept into three beginner missions using its emerald
map direction and City Grid, Coastal Bay, and Mountain Pass locations. Each mission
has ordered observations, two knowledge checks, corrective feedback, and 100 XP.
Completion unlocks the next mission. Replaying does not duplicate XP.

Content and typed payloads: `src/features/games/content.ts`. UI is split into the
quest shell, mission interaction, and SVG field map. Styles are scoped to `.quest`.
The existing application error boundary also covers this route.

Completed mission IDs are saved in `gess-survey-quest-v1` in localStorage. Malformed
or out-of-order records are sanitized. Storage failures leave the game playable
for the current visit. In-progress observations restart when leaving a mission.
Reset requires an inline confirmation. This is local learning progress, not a
verified credential or a shared leaderboard; no account or database is required.

All coordinates and readings are simulated. Hydrographic examples omit tide,
draft, motion, and sound-speed-profile corrections. Field maps are schematic.
Sources: NOAA Hydrographic Surveying and USGS Finding Your Way with Map and Compass,
linked on the game page. Text is rendered through React; no raw HTML injection or
server mutation forms are used, so there is no new CSRF endpoint.
