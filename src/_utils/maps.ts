// Define MIDI note numbers for each note
export type NoteIndex = number;

// Map from MIDI note number to note name
const noteIndexToNote: Record<NoteIndex, string> = {
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
  73: "C#7",
  74: "D7",
  75: "D#7",
  76: "E7",
  77: "F7",
  78: "F#7",
  79: "G7",
  80: "G#7",
  81: "A7",
  82: "A#7",
  83: "B7",
  84: "C8",
};

export function getNoteName(noteIndex: NoteIndex, transpose = 0): string {
  const boundIndex = Math.max(0, Math.min(84, noteIndex + transpose));
  return noteIndexToNote[boundIndex] ?? "C2"; // Nullish should never happen but w/e
}

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
// NOTE: "char" field is just for UI label on keys, it's not used for mapping
export interface NoteTypes {
  char: string;
  noteIndex: NoteIndex;
}
export const keyMap: Record<string, Array<NoteTypes>> = {
  Digit1: [
    { char: "1", noteIndex: 12 }, // C2
    { char: "!", noteIndex: 13 }, // C#2
  ],
  Digit2: [
    { char: "2", noteIndex: 14 }, // D2
    { char: "@", noteIndex: 15 }, // D#2
  ],
  Digit3: [
    { char: "3", noteIndex: 16 }, // E2
  ],
  Digit4: [
    { char: "4", noteIndex: 17 }, // F2
    { char: "$", noteIndex: 18 }, // F#2
  ],
  Digit5: [
    { char: "5", noteIndex: 19 }, // G2
    { char: "%", noteIndex: 20 }, // G#2
  ],
  Digit6: [
    { char: "6", noteIndex: 21 }, // A2
    { char: "^", noteIndex: 22 }, // A#2
  ],
  Digit7: [
    { char: "7", noteIndex: 23 }, // B2
  ],
  Digit8: [
    { char: "8", noteIndex: 24 }, // C3
    { char: "*", noteIndex: 25 }, // C#3
  ],
  Digit9: [
    { char: "9", noteIndex: 26 }, // D3
    { char: "(", noteIndex: 27 }, // D#3
  ],
  Digit0: [
    { char: "0", noteIndex: 28 }, // E3
  ],
  q: [
    { char: "q", noteIndex: 29 }, // F3
    { char: "Q", noteIndex: 30 }, // F#3
  ],
  w: [
    { char: "w", noteIndex: 31 }, // G3
    { char: "W", noteIndex: 32 }, // G#3
  ],
  e: [
    { char: "e", noteIndex: 33 }, // A3
    { char: "E", noteIndex: 34 }, // A#3
  ],
  r: [
    { char: "r", noteIndex: 35 }, // B3
  ],
  t: [
    { char: "t", noteIndex: 36 }, // C4
    { char: "T", noteIndex: 37 }, // C#4
  ],
  y: [
    { char: "y", noteIndex: 38 }, // D4
    { char: "Y", noteIndex: 39 }, // D#4
  ],
  u: [
    { char: "u", noteIndex: 40 }, // E4
  ],
  i: [
    { char: "i", noteIndex: 41 }, // F4
    { char: "I", noteIndex: 42 }, // F#4
  ],
  o: [
    { char: "o", noteIndex: 43 }, // G4
    { char: "O", noteIndex: 44 }, // G#4
  ],
  p: [
    { char: "p", noteIndex: 45 }, // A4
    { char: "P", noteIndex: 46 }, // A#4
  ],
  a: [
    { char: "a", noteIndex: 47 }, // B4
  ],
  s: [
    { char: "s", noteIndex: 48 }, // C5
    { char: "S", noteIndex: 49 }, // C#5
  ],
  d: [
    { char: "d", noteIndex: 50 }, // D5
    { char: "D", noteIndex: 51 }, // D#5
  ],
  f: [
    { char: "f", noteIndex: 52 }, // E5
  ],
  g: [
    { char: "g", noteIndex: 53 }, // F5
    { char: "G", noteIndex: 54 }, // F#5
  ],
  h: [
    { char: "h", noteIndex: 55 }, // G5
    { char: "H", noteIndex: 56 }, // G#5
  ],
  j: [
    { char: "j", noteIndex: 57 }, // A5
    { char: "J", noteIndex: 58 }, // A#5
  ],
  k: [
    { char: "k", noteIndex: 59 }, // B5
  ],
  l: [
    { char: "l", noteIndex: 60 }, // C6
    { char: "L", noteIndex: 61 }, // C#6
  ],
  z: [
    { char: "z", noteIndex: 62 }, // D6
    { char: "Z", noteIndex: 63 }, // D#6
  ],
  x: [
    { char: "x", noteIndex: 64 }, // E6
  ],
  c: [
    { char: "c", noteIndex: 65 }, // F6
    { char: "C", noteIndex: 66 }, // F#6
  ],
  v: [
    { char: "v", noteIndex: 67 }, // G6
    { char: "V", noteIndex: 68 }, // G#6
  ],
  b: [
    { char: "b", noteIndex: 69 }, // A6
    { char: "B", noteIndex: 70 }, // A#6
  ],
  n: [
    { char: "n", noteIndex: 71 }, // B6
  ],
  m: [
    { char: "m", noteIndex: 72 }, // C7
  ],
};

export const fileMap = {
  C1: "C1.mp3",
  "C#1": "Cs1.mp3",
  D1: "D1.mp3",
  "D#1": "Ds1.mp3",
  E1: "E1.mp3",
  F1: "F1.mp3",
  "F#1": "Fs1.mp3",
  G1: "G1.mp3",
  "G#1": "Gs1.mp3",
  A1: "A1.mp3",
  "A#1": "As1.mp3",
  B1: "B1.mp3",
  C2: "C2.mp3",
  "C#2": "Cs2.mp3",
  D2: "D2.mp3",
  "D#2": "Ds2.mp3",
  E2: "E2.mp3",
  F2: "F2.mp3",
  "F#2": "Fs2.mp3",
  G2: "G2.mp3",
  "G#2": "Gs2.mp3",
  A2: "A2.mp3",
  "A#2": "As2.mp3",
  B2: "B2.mp3",
  C3: "C3.mp3",
  "C#3": "Cs3.mp3",
  D3: "D3.mp3",
  "D#3": "Ds3.mp3",
  E3: "E3.mp3",
  F3: "F3.mp3",
  "F#3": "Fs3.mp3",
  G3: "G3.mp3",
  "G#3": "Gs3.mp3",
  A3: "A3.mp3",
  "A#3": "As3.mp3",
  B3: "B3.mp3",
  C4: "C4.mp3",
  "C#4": "Cs4.mp3",
  D4: "D4.mp3",
  "D#4": "Ds4.mp3",
  E4: "E4.mp3",
  F4: "F4.mp3",
  "F#4": "Fs4.mp3",
  G4: "G4.mp3",
  "G#4": "Gs4.mp3",
  A4: "A4.mp3",
  "A#4": "As4.mp3",
  B4: "B4.mp3",
  C5: "C5.mp3",
  "C#5": "Cs5.mp3",
  D5: "D5.mp3",
  "D#5": "Ds5.mp3",
  E5: "E5.mp3",
  F5: "F5.mp3",
  "F#5": "Fs5.mp3",
  G5: "G5.mp3",
  "G#5": "Gs5.mp3",
  A5: "A5.mp3",
  "A#5": "As5.mp3",
  B5: "B5.mp3",
  C6: "C6.mp3",
  "C#6": "Cs6.mp3",
  D6: "D6.mp3",
  "D#6": "Ds6.mp3",
  E6: "E6.mp3",
  F6: "F6.mp3",
  "F#6": "Fs6.mp3",
  G6: "G6.mp3",
  "G#6": "Gs6.mp3",
  A6: "A6.mp3",
  "A#6": "As6.mp3",
  B6: "B6.mp3",
  C7: "C7.mp3",
  "C#7": "Cs7.mp3",
  D7: "D7.mp3",
  "D#7": "Ds7.mp3",
  E7: "E7.mp3",
  F7: "F7.mp3",
  "F#7": "Fs7.mp3",
  G7: "G7.mp3",
  "G#7": "Gs7.mp3",
  A7: "A7.mp3",
  "A#7": "As7.mp3",
  B7: "B7.mp3",
  C8: "C8.mp3",
};
