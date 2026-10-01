# Cloned voice: Diego

Diego (`public/voice/mx-m`) is a friend of the site owner who agreed to have
his voice used on StudyBien. His voice is
applied to clear Piper speech with the tone-colour converter from
[OpenVoice V2](https://github.com/myshell-ai/OpenVoice) (MIT licence), so the
words and Spanish pronunciation come from Piper and the voice character comes
from the friend.

`embeddings/*.pt` are the voice fingerprints (source and target) extracted
once from the friends' recordings; the recordings themselves are not stored in
this repository. To record new lines:

    pip install piper-tts lameenc librosa soundfile torch eng_to_ipa wavmark
    git clone https://github.com/myshell-ai/OpenVoice /var/tmp/openvoice
    # converter checkpoint from huggingface.co/myshell-ai/OpenVoiceV2 -> /var/tmp/ov_ckpt/converter
    npx tsx scripts/voice-lines.ts > /tmp/lines.txt
    python3 scripts/voice-clone/run_all.py mx-m diego es_MX-ald-medium - 0

Arguments: output folder, embedding name, Piper model, speaker (or `-`), and a
pitch shift in semitones applied before conversion (Javier's friend speaks
higher than the base voice).

Javier is not cloned yet: his reference recording was too noisy for a reliable
clone (most converted clips came out unvoiced). With a clean recording, run
clone.py to make `embeddings/javier.pt`, then
`run_all.py es-m javier es_ES-sharvard-medium 0 <semitones>`, and check every
clip before shipping. Weak Diego clips were re-converted; four that stayed weak
keep the plain Piper recording.
