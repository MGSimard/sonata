import { useEffect, useState } from "react";
import * as Tone from "tone";
import { noteMap, keyMap } from "@/_utils/maps";

/* NOTES
 * e.keyCode is deprecated
 * e.charCode is deprecated
 * e.code maps to physical key
 * e.key maps to mapped key (final output)
 */

/* PROBLEM
 * - User's layout might not match their keyboard's physical layout (remapped keys, diff layouts)
 * - Language layouts add an additional layer of complexity for SYMBOLS on number keys (6 -> ^ or ?)
 */

/* SOLUTION?
 * - Since regardless of layout, numbers should be in the same spots, we can use e.code safely
 * - Since letters might not match the keyboard's physical layout, we can use e.key for the actual character
 * - This is safe because lowercase and uppercase versions of letter keys are always consistent
 * - In short, use a hybrid method:
 *   - If e.key is not A-Za-z, refer to e.code + e.shiftKey
 *   - If e.key is A-Za-z, refer to e.key
 *   - Code could be shorter if we do an assignment then just thing.toLowerCase() + e.shiftKey
 *   - Rather than running either e.code + e.shiftKey or e.key (intrinsic lowercase/uppercase)
 * - This gives the greatest compatibility regarding both physical and digitally mapped keys
 */

export const KeyTester = () => {
  const [transpose, setTranspose] = useState(0);
  const synth = new Tone.PolySynth(Tone.Synth).toDestination();
  const now = Tone.now();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const pressedKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.code.startsWith("Digit") ? e.code : e.key.toLowerCase();
      if (!keyMap[key as keyof typeof keyMap] || pressedKeys.has(key)) return;

      pressedKeys.add(key);
      const [flatNote, sharpNote] = keyMap[key as keyof typeof keyMap];

      if (e.shiftKey && sharpNote) {
        synth.triggerAttackRelease(noteMap[sharpNote + transpose]!, "8n");
        console.log("Sharp Note:", noteMap[sharpNote + transpose]);
      } else if (flatNote) {
        synth.triggerAttackRelease(noteMap[flatNote + transpose]!, "8n");
        console.log("Flat Note:", noteMap[flatNote + transpose]);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.code.startsWith("Digit") ? e.code : e.key.toLowerCase();
      if (!keyMap[key as keyof typeof keyMap]) return;
      pressedKeys.delete(key);
    };

    window.addEventListener("keydown", handleKeyDown, { signal });
    window.addEventListener("keyup", handleKeyUp, { signal });

    return () => controller.abort();
  }, [transpose]);

  const handleStart = async () => {
    await Tone.start();
    console.log("Tone.started");
  };

  const handleTranspose = (delta: number) => {
    // max -12 to +12
    const newTranspose = Math.min(Math.max(transpose + delta, -12), 12);
    setTranspose(newTranspose);
  };

  return (
    <div>
      KeyTester
      <button type="button" onClick={handleStart}>
        Start Tone.js
      </button>
      <button type="button" onClick={() => handleTranspose(-1)}>
        -
      </button>
      <span>Transposition:{transpose}</span>
      <button type="button" onClick={() => handleTranspose(1)}>
        +
      </button>
    </div>
  );
};
