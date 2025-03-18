import { useEffect, Fragment } from "react";
import { noteMap, keyMap } from "@/_utils/maps";

export const KeyTester = () => {
  // Even though it could be numbers all the way down, I need noteMap strings
  // for key identifiers on UI if I choose to display them.

  const transpose = 0; // -12 to +12

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const pressedKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      console.log("KeyDown:", e.code);
      if (!keyMap[e.code as keyof typeof keyMap] || pressedKeys.has(e.code)) return;
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
      pressedKeys.delete(e.code);
    };

    window.addEventListener("keydown", handleKeyDown, { signal });
    window.addEventListener("keyup", handleKeyUp, { signal });

    return () => controller.abort();
  }, []);

  return <div>KeyTester</div>;
};
