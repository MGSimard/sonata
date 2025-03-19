import { useEffect } from "react";
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
  const transpose = 0; // -12 to +12

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const pressedKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.code.startsWith("Digit") ? e.code : e.key.toLowerCase();
      if (!keyMap[key as keyof typeof keyMap] || pressedKeys.has(key)) return;

      console.log("Valid Key:", key);

      // console.log("Code:", e.code);
      // pressedKeys.add(e.code);
      // const [flatNote, sharpNote] = keyMap[e.code as keyof typeof keyMap];

      // if (e.shiftKey && sharpNote) {
      //   console.log("Sharp Note:", noteMap[sharpNote + transpose]);
      // } else if (flatNote) {
      //   console.log("Flat Note:", noteMap[flatNote + transpose]);
      // }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.code.startsWith("Digit") ? e.code : e.key.toLowerCase();
      if (!keyMap[key as keyof typeof keyMap]) return;
      console.log("Released:", key);
      pressedKeys.delete(key);
    };

    window.addEventListener("keydown", handleKeyDown, { signal });
    window.addEventListener("keyup", handleKeyUp, { signal });

    return () => controller.abort();
  }, []);

  return <div>KeyTester</div>;
};
