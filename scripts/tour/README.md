# The 60-second home page tour

`public/media/studybien-tour.{mp4,webm}` is a scripted walk through the real
site: home, the Menu, worksheets and answer keys, quizzes, games, Learn with
Plumi (voice picker, a lesson, the ink splash), teacher sign-up and a course,
and a student joining with the code. No voice-over: captions on screen, the
upbeat Latin guitar track underneath, and a pop on every click.

To re-record after the site changes (needs the app running on :3100 and a
local database):

    mkdir -p /var/tmp/tour/raw
    npx tsx scripts/tour/record.mts          # writes /var/tmp/tour/raw.webm + timeline.json
    bash scripts/tour/compose.sh <music.mp3> <pop.mp3>

Music: "Upbeat Latin Guitar" (sonican) and the pop sound (dragon-studio),
both from Pixabay under the Pixabay Content License, which allows use in
videos and websites without attribution.
