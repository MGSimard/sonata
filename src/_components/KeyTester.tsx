import { useEffect } from "react";
import * as Tone from "tone";
import { noteMap, keyMap } from "@/_utils/maps";

/* NOTES
 * e.keyCode is deprecated
 * e.charCode is deprecated
 * e.code maps to physical key
 * e.key maps to mapped key (final output)
 */

// If character is not a-z, refer to e.code
// If character is a-z, refer to e.key?
// This would give the greatest compatibility regarding both physical and digitally mapped keys

export const KeyTester = () => {
  const transpose = 0; // -12 to +12

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const pressedKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!keyMap[e.code as keyof typeof keyMap] || pressedKeys.has(e.code)) return;
      console.log("Code:", e.code);
      pressedKeys.add(e.code);
      const [flatNote, sharpNote] = keyMap[e.code as keyof typeof keyMap];

      if (e.shiftKey && sharpNote) {
        console.log("Sharp Note:", noteMap[sharpNote + transpose]);
      } else if (flatNote) {
        console.log("Flat Note:", noteMap[flatNote + transpose]);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!keyMap[e.code as keyof typeof keyMap]) return;
      console.log("Released:", e.code);
      pressedKeys.delete(e.code);
    };

    window.addEventListener("keydown", handleKeyDown, { signal });
    window.addEventListener("keyup", handleKeyUp, { signal });

    return () => controller.abort();
  }, []);

  return <div>KeyTester</div>;
};
