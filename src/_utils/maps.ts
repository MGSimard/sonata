// Define MIDI note numbers for each note
type MidiNote = number;

// Map from MIDI note number to note name
const midiToNoteName: Record<MidiNote, string> = {
  0: "C1",
  1: "C#1",
  2: "D1",
  3: "D#1",
  4: "E1",
  5: "F1",
  6: "F#1",
  7: "G1",
  8: "G#1",
  9: "A1",
  10: "A#1",
  11: "B1",
  12: "C2",
  13: "C#2",
  14: "D2",
  15: "D#2",
  16: "E2",
  17: "F2",
  18: "F#2",
  19: "G2",
  20: "G#2",
  21: "A2",
  22: "A#2",
  23: "B2",
  24: "C3",
  25: "C#3",
  26: "D3",
  27: "D#3",
  28: "E3",
  29: "F3",
  30: "F#3",
  31: "G3",
  32: "G#3",
  33: "A3",
  34: "A#3",
  35: "B3",
  36: "C4",
  37: "C#4",
  38: "D4",
  39: "D#4",
  40: "E4",
  41: "F4",
  42: "F#4",
  43: "G4",
  44: "G#4",
  45: "A4",
  46: "A#4",
  47: "B4",
  48: "C5",
  49: "C#5",
  50: "D5",
  51: "D#5",
  52: "E5",
  53: "F5",
  54: "F#5",
  55: "G5",
  56: "G#5",
  57: "A5",
  58: "A#5",
  59: "B5",
  60: "C6",
  61: "C#6",
  62: "D6",
  63: "D#6",
  64: "E6",
  65: "F6",
  66: "F#6",
  67: "G6",
  68: "G#6",
  69: "A6",
  70: "A#6",
  71: "B6",
  72: "C7",
};

// Get a note name from a MIDI note number with optional transposition
export function getNoteName(midiNote: MidiNote, transpose = 0): string | undefined {
  return midiToNoteName[midiNote + transpose];
}

// Combined type definition for keyboard mapping
type KeyMap = Record<
  string,
  Array<{
    char: string;
    midiNote: MidiNote;
  }>
>;

/* WHY A HYBRID e.code + e.key METHOD
 * - e.code maps to physical key position.
 * - e.key maps to digital key output.
 * - User digital layout might not match physical layout due to remap.
 * - Language layouts add an additional layer of complexity (differing symbols on number keys).
 *
 * PROBLEM:
 * - Numbers are generally not remapped from their physical layout.
 * - But we can't refer them as their digital key due to language layouts (e.g. 6 -> ^ or ?).
 * SOLUTION:
 * - Use e.code for numbers, check e.shiftKey to jump into the sharp definition at [1].
 *
 * PROBLEM:
 * - Letters have the least consistency between physical and digital layouts due to remapping.
 * - This means we cannot use e.code which maps to physical.
 * SOLUTION:
 * - Use e.key for letters, which is always consistent across lowercase and uppercase output.
 * - For consistency's sake with numbers, we can run e.key.toLowerCase() + e.shiftKey instead of
 * a separate access entry for uppercase versions of letters.
 *
 * PROBLEM:
 * - Non-QWERTY layouts won't have the same note ordering (left-right, top-down).
 * - There is no real solution to this since we cannot detect keyboard layouts in JS.
 * - The only play would be making users conform to preset layouts, but it's a downside for UX.
 * - So users who aren't in QWERTY will have to deal with keyboard notes not being consecutive.
 * */
export const keyMap: KeyMap = {
  Digit1: [
    { char: "1", midiNote: 12 }, // C2
    { char: "!", midiNote: 13 }, // C#2
  ],
  Digit2: [
    { char: "2", midiNote: 14 }, // D2
    { char: "@", midiNote: 15 }, // D#2
  ],
  Digit3: [
    { char: "3", midiNote: 16 }, // E2
  ],
  Digit4: [
    { char: "4", midiNote: 17 }, // F2
    { char: "$", midiNote: 18 }, // F#2
  ],
  Digit5: [
    { char: "5", midiNote: 19 }, // G2
    { char: "%", midiNote: 20 }, // G#2
  ],
  Digit6: [
    { char: "6", midiNote: 21 }, // A2
    { char: "^", midiNote: 22 }, // A#2
  ],
  Digit7: [
    { char: "7", midiNote: 23 }, // B2
  ],
  Digit8: [
    { char: "8", midiNote: 24 }, // C3
    { char: "*", midiNote: 25 }, // C#3
  ],
  Digit9: [
    { char: "9", midiNote: 26 }, // D3
    { char: "(", midiNote: 27 }, // D#3
  ],
  Digit0: [
    { char: "0", midiNote: 28 }, // E3
  ],
  q: [
    { char: "q", midiNote: 29 }, // F3
    { char: "Q", midiNote: 30 }, // F#3
  ],
  w: [
    { char: "w", midiNote: 31 }, // G3
    { char: "W", midiNote: 32 }, // G#3
  ],
  e: [
    { char: "e", midiNote: 33 }, // A3
    { char: "E", midiNote: 34 }, // A#3
  ],
  r: [
    { char: "r", midiNote: 35 }, // B3
  ],
  t: [
    { char: "t", midiNote: 36 }, // C4
    { char: "T", midiNote: 37 }, // C#4
  ],
  y: [
    { char: "y", midiNote: 38 }, // D4
    { char: "Y", midiNote: 39 }, // D#4
  ],
  u: [
    { char: "u", midiNote: 40 }, // E4
  ],
  i: [
    { char: "i", midiNote: 41 }, // F4
    { char: "I", midiNote: 42 }, // F#4
  ],
  o: [
    { char: "o", midiNote: 43 }, // G4
    { char: "O", midiNote: 44 }, // G#4
  ],
  p: [
    { char: "p", midiNote: 45 }, // A4
    { char: "P", midiNote: 46 }, // A#4
  ],
  a: [
    { char: "a", midiNote: 47 }, // B4
  ],
  s: [
    { char: "s", midiNote: 48 }, // C5
    { char: "S", midiNote: 49 }, // C#5
  ],
  d: [
    { char: "d", midiNote: 50 }, // D5
    { char: "D", midiNote: 51 }, // D#5
  ],
  f: [
    { char: "f", midiNote: 52 }, // E5
  ],
  g: [
    { char: "g", midiNote: 53 }, // F5
    { char: "G", midiNote: 54 }, // F#5
  ],
  h: [
    { char: "h", midiNote: 55 }, // G5
    { char: "H", midiNote: 56 }, // G#5
  ],
  j: [
    { char: "j", midiNote: 57 }, // A5
    { char: "J", midiNote: 58 }, // A#5
  ],
  k: [
    { char: "k", midiNote: 59 }, // B5
  ],
  l: [
    { char: "l", midiNote: 60 }, // C6
    { char: "L", midiNote: 61 }, // C#6
  ],
  z: [
    { char: "z", midiNote: 62 }, // D6
    { char: "Z", midiNote: 63 }, // D#6
  ],
  x: [
    { char: "x", midiNote: 64 }, // E6
  ],
  c: [
    { char: "c", midiNote: 65 }, // F6
    { char: "C", midiNote: 66 }, // F#6
  ],
  v: [
    { char: "v", midiNote: 67 }, // G6
    { char: "V", midiNote: 68 }, // G#6
  ],
  b: [
    { char: "b", midiNote: 69 }, // A6
    { char: "B", midiNote: 70 }, // A#6
  ],
  n: [
    { char: "n", midiNote: 71 }, // B6
  ],
  m: [
    { char: "m", midiNote: 72 }, // C7
  ],
};
