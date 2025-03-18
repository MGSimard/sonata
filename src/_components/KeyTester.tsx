import { useEffect } from "react";

const noteMap = [
  "C1",
  "C#1",
  "D1",
  "D#1",
  "E1",
  "F1",
  "F#1",
  "G1",
  "G#1",
  "A1",
  "A#1",
  "B1",
  "C2",
  "C#2",
  "D2",
  "D#2",
  "E2",
  "F2",
  "F#2",
  "G2",
  "G#2",
  "A2",
  "A#2",
  "B2",
  "C3",
  "C#3",
  "D3",
  "D#3",
  "E3",
  "F3",
  "F#3",
  "G3",
  "G#3",
  "A3",
  "A#3",
  "B3",
  "C4",
  "C#4",
  "D4",
  "D#4",
  "E4",
  "F4",
  "F#4",
  "G4",
  "G#4",
  "A4",
  "A#4",
  "B4",
  "C5",
  "C#5",
  "D5",
  "D#5",
  "E5",
  "F5",
  "F#5",
  "G5",
  "G#5",
  "A5",
  "A#5",
  "B5",
  "C6",
  "C#6",
  "D6",
  "D#6",
  "E6",
  "F6",
  "F#6",
  "G6",
  "G#6",
  "A6",
  "A#6",
  "B6",
  "C7",
];

const keyMap = {
  Digit1: [12, 13], // C2, C#2
  Digit2: [14, 15], // D2, D#2
  Digit3: [16, null], // E2
  Digit4: [17, 18], // F2, F#2
  Digit5: [19, 20], // G2, G#2
  Digit6: [21, 22], // A2, A#2
  Digit7: [23, null], // B2
  Digit8: [24, 25], // C3, C#3
  Digit9: [26, 27], // D3, D#3
  Digit0: [28, null], // E3
  KeyQ: [29, 30], // F3, F#3
  KeyW: [31, 32], // G3, G#3
  KeyE: [33, 34], // A3, A#3
  KeyR: [35, null], // B3
  KeyT: [36, 37], // C4, C#4
  KeyY: [38, 39], // D4, D#4
  KeyU: [40, null], // E4
  KeyI: [41, 42], // F4, F#4
  KeyO: [43, 44], // G4, G#4
  KeyP: [45, 46], // A4, A#4
  KeyA: [47, null], // B4
  KeyS: [48, 49], // C5, C#5
  KeyD: [50, 51], // D5, D#5
  KeyF: [52, null], // E5
  KeyG: [53, 54], // F5, F#5
  KeyH: [55, 56], // G5, G#5
  KeyJ: [57, 58], // A5, A#5
  KeyK: [59, null], // B5
  KeyL: [60, 61], // C6, C#6
  KeyZ: [62, 63], // D6, D#6
  KeyX: [64, null], // E6
  KeyC: [65, 66], // F6, F#6
  KeyV: [67, 68], // G6, G#6
  KeyB: [69, 70], // A6, A#6
  KeyN: [71, null], // B6
  KeyM: [72, null], // C7
};

export const KeyTester = () => {
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const pressedKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!keyMap[e.code as keyof typeof keyMap] || pressedKeys.has(e.code)) return;

      pressedKeys.add(e.code);
      const [flatNote, sharpNote] = keyMap[e.code as keyof typeof keyMap];

      if (e.shiftKey && sharpNote) {
        console.log("Sharp Note:", noteMap[sharpNote]);
      } else if (flatNote) {
        console.log("Flat Note:", noteMap[flatNote]);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.delete(e.code);
    };

    window.addEventListener("keydown", handleKeyDown, { signal });
    window.addEventListener("keyup", handleKeyUp, { signal });

    return () => controller.abort();
  }, []);

  return <div>KeyTester</div>;
};
