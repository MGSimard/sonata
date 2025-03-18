import { useEffect } from "react";

export const KeyTester = () => {
  // Observations: event.code is better since it retains a consistent mapping across keyboard layouts
  // This means we can map notes directly to a physical ordering of the user's keyboard regardless of
  // what letters are where within their layout - we'll need to detect the user's layout and change
  // the letters on the piano to match later but that's fine. Additional UX could be translating sheet
  // music across keyboard layouts, with regular QWERTY being the default.

  // Valid keys are:
  // 1!2@34$5%6^78*9(0qQwWeErtTyYuiIoOpPasSdDfgGhHjJklLzZxcCvVbBnm
  // (Matches physical piano layout)

  // If shifting and valid shift match exist play that sharp note, otherwise play the flat note
  // This just so happens to allow players to play a sharp and a flat at the same time if the flat
  // doesn't have a sharp counterpart. This is better than just not playing the flat note at all.

  const keyMap = {
    Digit1: [0, 1],
    Digit2: [2, 3],
    Digit3: [4, null],
    Digit4: [5, 6],
    Digit5: [7, 8],
    Digit6: [9, 10],
    Digit7: [11, null],
    Digit8: [12, 13],
    Digit9: [14, 15],
    Digit0: [16, null],
    KeyQ: [17, 18],
    KeyW: [19, 20],
    KeyE: [21, 22],
    KeyR: [23, null],
    KeyT: [24, 25],
    KeyY: [26, 27],
    KeyU: [28, null],
    KeyI: [29, 30],
    KeyO: [31, 32],
    KeyP: [33, 34],
    KeyA: [35, null],
    KeyS: [36, 37],
    KeyD: [38, 39],
    KeyF: [40, null],
    KeyG: [41, 42],
    KeyH: [43, 44],
    KeyJ: [45, 46],
    KeyK: [47, null],
    KeyL: [48, 49],
    KeyZ: [50, 51],
    KeyX: [52, null],
    KeyC: [53, 54],
    KeyV: [55, 56],
    KeyB: [57, 58],
    KeyN: [59, null],
    KeyM: [60, null],
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log("Shift?", event.shiftKey);
      console.log(event.code);
    };
    window.addEventListener("keydown", handleKeyDown, { signal });

    return () => controller.abort();
  }, []);

  return <div>KeyTester</div>;
};
