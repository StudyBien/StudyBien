# Plumi's voices

All clips were generated with [Piper](https://github.com/rhasspy/piper), a free,
open-source text-to-speech engine, using voices from
[rhasspy/piper-voices](https://huggingface.co/rhasspy/piper-voices). No speech
service is called at runtime; these are static files served with the site.

| Folder | Voice | Model | Licence |
|---|---|---|---|
| `mx-f` | Valeria (Mexico, female) | `es_MX-claude-high` | Apache License 2.0 |
| `es-f` | Lucía (Spain, female) | `es_ES-sharvard-medium`, speaker F | CC BY 3.0 — trained on the Sharvard corpus, University of Edinburgh (https://datashare.ed.ac.uk/handle/10283/574) |
| `mx-m` | Diego (Mexico, male) | `es_MX-ald-medium` | The Unlicense (public domain) |
| `es-m` | Javier (Spain, male) | `es_ES-davefx-medium` | CC0 (public domain) |

All four licences permit commercial use. CC BY 3.0 requires credit, given above
and on the site's Learn page.

Regenerate with `scripts/generate-voice.py`.
