# Sonata

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
- [ ] Get a better sample library (currently using exported custom from fl studio)
- [ ] Find out how to prevent audio overflows causing noise and crackling
- [ ] ...
- [ ] Establish application identity
- [ ] Color palette (Both Light & Dark Modes)
- [ ] ...
- [ ] Core Piano functions
- [ ] Sustain (On/Off/Hold)
- [ ] Note history
- [ ] Volume control
- [ ] Note transposition setting (-12, +12)
- [ ] Slight black key offsets (towards edges, center black key center)
- [ ] ...
- [ ] Piano popout?
- [ ] Sheet music popout (Forced on-top)
- [ ] ...
- [ ] Metadata assets
- [ ] Finalize index.html metadata
- [ ] Deploy

## Future Considerations

- [ ] Metronome
- [ ] Establish sheet music conventions
- [ ] Adding sheet music (Author, title, tempo, core genre)
- [ ] MIDI Support
- [ ] Customizable themes
