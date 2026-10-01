# Plumi's voices

Sofía, Lucía and Javier were generated with [Piper](https://github.com/rhasspy/piper), a free,
open-source text-to-speech engine, using voices from
[rhasspy/piper-voices](https://huggingface.co/rhasspy/piper-voices). No speech
service is called at runtime; these are static files served with the site.

| Folder | Voice | Model | Licence |
|---|---|---|---|
| `mx-f` | Sofía (Mexico, female) | `es_MX-claude-high` | Apache License 2.0 |
| `es-f` | Lucía (Spain, female) | `es_ES-sharvard-medium`, speaker F | CC BY 3.0 — trained on the Sharvard corpus, University of Edinburgh (https://datashare.ed.ac.uk/handle/10283/574) |
| `mx-m` | Diego (Mexico, male) | MeloTTS Spanish (MIT), converted to the voice of a friend of the site owner, used with his permission | voice used with consent; MeloTTS and OpenVoice V2, both MIT |
| `es-m` | Javier (Spain, male) | `es_ES-sharvard-medium`, speaker M | CC BY 3.0 — trained on the Sharvard corpus, University of Edinburgh (https://datashare.ed.ac.uk/handle/10283/574) |

All four licences permit commercial use. CC BY 3.0 (Lucía and Javier) requires credit, given above
and on the site's Learn page.

Regenerate Sofía, Lucía and Javier with `scripts/generate-voice.py`; Diego with
`scripts/voice-clone/` (see its README).
