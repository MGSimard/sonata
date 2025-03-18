import { useEffect, Fragment } from "react";
import { noteMap, keyMap } from "@/_utils/maps";

export const KeyTester = () => {
  /* NOTES
   * e.keyCode is deprecated
   * e.charCode is deprecated
   * e.code maps to physical key
   * e.key maps to mapped key (final output)
   */

  const transpose = 0; // -12 to +12

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const pressedKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      console.log("Event:", e);
      console.log("Key:", e.key);
      console.log("Code:", e.code);
      console.log("CharCode:", e.charCode);
      console.log("KeyCode:", e.keyCode);

      // if (!keyMap[e.key as keyof typeof keyMap] || pressedKeys.has(e.key)) return;
      // pressedKeys.add(e.key);
      // const [flatNote, sharpNote] = keyMap[e.key as keyof typeof keyMap];
      // if (e.shiftKey && sharpNote) {
      //   console.log("Sharp Note:", noteMap[sharpNote + transpose]);
      // } else if (flatNote) {
      //   console.log("Flat Note:", noteMap[flatNote + transpose]);
      // }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!keyMap[e.key as keyof typeof keyMap]) return;
      pressedKeys.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown, { signal });
    window.addEventListener("keyup", handleKeyUp, { signal });

    return () => controller.abort();
  }, []);

  return <div>KeyTester</div>;
};
