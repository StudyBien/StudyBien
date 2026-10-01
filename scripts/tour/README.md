# The home page tour

`public/media/studybien-tour.{mp4,webm}` is a scripted walk through the real
site, about a minute and a half: the home page and what it offers, each Menu
tab once (worksheets and answer keys, quizzes, tests, reading, games), Plumi
(voice picker, a lesson, the ink splash), then the classroom: teacher sign-up,
a course and its join code, assigning a quiz, the course tabs and calendar,
and a student joining with the code and doing the quiz. No voice-over: captions on screen, the
upbeat Latin guitar track underneath, and a pop on every click.

To re-record after the site changes (needs the app running on :3100 and a
local database):

    mkdir -p /var/tmp/tour/raw
    npx tsx scripts/tour/record.mts          # writes /var/tmp/tour/raw.webm + timeline.json
    SPEED=1.3 bash scripts/tour/compose.sh <music.mp3> <pop.mp3>

Music: "Upbeat Latin Guitar" (sonican) and the pop sound (dragon-studio),
both from Pixabay under the Pixabay Content License, which allows use in
videos and websites without attribution.
