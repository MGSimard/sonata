import { useEffect } from "react";

export const KeyTester = () => {
  // Observations: event.code is better since it retains a consistent mapping across keyboard layouts
  // This means we can map notes directly to a physical ordering of the user's keyboard regardless of
  // what letters are where within their layout - we'll need to detect the user's layout and change
  // the letters on the piano to match later but that's fine. Additional UX could be translating sheet
  // music across keyboard layouts, with regular QWERTY being the default.

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event.code);
    };
    window.addEventListener("keydown", handleKeyDown, { signal });

    return () => controller.abort();
  }, []);

  return <div>KeyTester</div>;
};
