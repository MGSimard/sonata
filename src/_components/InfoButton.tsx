import { useRef } from "react";
import { IconClose, IconQuestion } from "@/_components/Icons";

export function InfoButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()} aria-label="Information" title="Information">
        <IconQuestion />
      </button>
      <dialog id="info-dialog" ref={dialogRef}>
        <div className="dialog-header">
          <h2>Information</h2>
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close" title="Close">
            <IconClose />
          </button>
        </div>
        <div className="dialog-content">
          {FAQ.map(({ q, a }) => (
            <section key={q}>
              <details>
                <summary>
                  <h3>{q}</h3>
                </summary>
                {a}
              </details>
            </section>
          ))}
        </div>
      </dialog>
    </>
  );
}

const FAQ = [
  {
    q: "How do I play?",
    a: (
      <p>
        While focusing anywhere within the page, press any valid key on your keyboard (A-Za-z, 0-9). White keys can be
        played using lowercase characters, while black keys can be played using uppercase characters.
      </p>
    ),
  },
  {
    q: "Where can I find sheet music?",
    a: (
      <p>
        There are a few decent sources for music sheets which fit the app's key pattern, apart from being able to search
        terms such as "[...] virtual piano sheet music", some core sources would be the{" "}
        <a className="link" href="https://virtualpiano.net/music-sheets/" target="_blank">
          VirtualPiano sheet music repository
        </a>{" "}
        and{" "}
        <a
          className="link"
          href="https://forums.pixeltailgames.com/t/gmod-tower-piano-sheet-music-for-you/15380"
          target="_blank">
          Tower Unite/Gmod Tower Forums
        </a>
        .
      </p>
    ),
  },
  {
    q: "How can I play white and black notes simultaneously?",
    a: (
      <p>
        Play them in quick succession, or for white keys without black counterparts, holding shift still allows you to
        play the white note. In some special cases you could mix keys + mouse click, macros, or multiple keyboards.
      </p>
    ),
  },
  {
    q: "How do I expand the piano's range?",
    a: (
      <p>
        At any given time your range will be limited to 61 keys. You can shift up to 12 notes in either directions by
        using the transposition feature. Generally sheet music will include a transpose value which you can match to
        ensure you're playing in the right key.
      </p>
    ),
  },
  {
    q: "What keyboard layouts are supported?",
    a: (
      <p>
        As long as you didn't remap your number keys, realistically all keyboard layouts are supported. Though the order
        of keys on the piano (QWERTY) won't change; so you won't have the same visual order of buttons as the piano.
      </p>
    ),
  },
];
