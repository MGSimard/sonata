# Sonata

Sonata — a simple, elegant, and accessible piano app.

## Notes

- Notes 1-88
- Keyboard keys to nums
- Apply transpose calc
- Get matching note
- Prevent out of bounds
- Sustain OFF = same file but fade out early?
- Base C2 -> C7, support -12 + 12? (C1-C8)
- e.keyCode & e.charCode are deprecated
- e.code maps to physical key
- e.key maps to mapped key (final output)

## Resources

- Web Audio API: https://www.w3.org/TR/webaudio-1.1/
- Web Audio API https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
- Tone.js https://tonejs.github.io/
- VirtualPiano https://virtualpiano.net/

## Task List

- [x] Make decision on tone.js usage vs raw Web Audio API
- [x] Source an asset pack for core VST, <100kb per note (Wiggle room for low notes)
- [ ] Dump unused font weights
- [ ] Get a better sample library (currently using exported custom from fl studio)
- [ ] (p key and wetness of this library are especially bad)
- [x] Find out how to prevent audio overflows causing noise and crackling (Issue was volume?)
- [x] Not browser, not files (tested vp files), looks like volume related or buffer overflow.
- [x] But other apps using Tonejs have much more volume, so need to do some research on this issue.
- [ ] Solved
- [ ] Also, after finishing tests with new library downsize file usage to every ~2-4 notes alternated.
- [ ] ...
- [x] Establish application identity
- [x] Color palette (Both Light & Dark Modes)
- [x] Adjust theme data in index and manifest
- [ ] ...
- [x] Core Piano functions
- [ ] Sustain (On/Off/Hold)
- [x] Note history
- [ ] Metronome
- [x] Volume control
- [x] Note transposition setting (-12, +12)
- [ ] Slight black key offsets (towards edges, center black key center)
- [ ] Narrow down specific touch-action removal pieces
- [ ] ...
- [ ] Piano popout?
- [ ] Sheet music popout (Forced on-top)
- [ ] Switch white key layout around so you don't get keyspam on leftclick near clip-path on animation
- [ ] Allow color customization in a settings popup (write to localstorage for persistence?)
- [ ] ...
- [x] Metadata assets
- [x] Finalize index.html metadata
- [x] Deploy

## Future Considerations

- [ ] Adding sheet music (Author, title, tempo, core genre) (Would require fullstack)
- [ ] MIDI Support
- [ ] Customizable themes
