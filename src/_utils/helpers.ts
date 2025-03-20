import { type NoteTypes } from "@/_utils/maps";

/**
 * Determines the shape class for a white piano key based on its position in the standard piano layout
 *
 * @param note - The note object containing the MIDI note index
 * @param isLastKey - Whether this is the last white key on the piano
 * @returns The CSS class name for the key shape ('right-L', 'double-L', 'left-L', or empty string)
 */
export function getWhiteKeyShape(note: NoteTypes, isLastKey = false): string {
  // Return empty string for black keys or the last key
  if (isLastKey) return "";

  // Calculate note position within octave (0-11)
  const noteName = note.noteIndex % 12;

  // Map MIDI note number to white key position
  // MIDI: C=0, C#=1, D=2, D#=3, E=4, F=5, F#=6, G=7, G#=8, A=9, A#=10, B=11
  let whiteKeyPosition;

  // Convert chromatic position to white key position
  switch (noteName) {
    case 0: // C
      whiteKeyPosition = 0;
      break;
    case 2: // D
      whiteKeyPosition = 1;
      break;
    case 4: // E
      whiteKeyPosition = 2;
      break;
    case 5: // F
      whiteKeyPosition = 3;
      break;
    case 7: // G
      whiteKeyPosition = 4;
      break;
    case 9: // A
      whiteKeyPosition = 5;
      break;
    case 11: // B
      whiteKeyPosition = 6;
      break;
    default:
      return ""; // This shouldn't happen for white keys
  }

  // Apply the pattern: Right L, Double L, Left L, Right L, Double L, Double L, Left L
  switch (whiteKeyPosition) {
    case 0: // C
      return "right-L";
    case 1: // D
      return "double-L";
    case 2: // E
      return "left-L";
    case 3: // F
      return "right-L";
    case 4: // G
      return "double-L";
    case 5: // A
      return "double-L";
    case 6: // B
      return "left-L";
    default:
      return "";
  }
}
