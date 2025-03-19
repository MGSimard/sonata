import { Fragment, useEffect, useState, useRef, type Dispatch, type SetStateAction } from "react";
import * as Tone from "tone";
import { getNoteName, keyMap, type NoteTypes } from "@/_utils/maps";

/* THIS MIGHT BE HUGE FOR PERFORMANCE/MEMORY/DATA USAGE
 * "Multiple samples can also be combined into an instrument.
 * If you have audio files organized by note, Tone.Sampler will
 * pitch shift the samples to fill in gaps between notes.
 * So for example, if you only have every 3rd note on a piano sampled,
 * you could turn that into a full piano sample. Unlike the other synths,
 * Tone.Sampler is polyphonic so doesn't need to be passed into Tone.PolySynth"
 * https://tonejs.github.io/#tonesampler
 */

export const KeyTester = () => {
  const [transpose, setTranspose] = useState(0);
  const pressedKeys = useRef<Set<string>>(new Set());
  const synth = new Tone.PolySynth(Tone.Synth).toDestination();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    window.addEventListener("keydown", handleKeyDown, { signal });
    window.addEventListener("keyup", handleKeyUp, { signal });

    return () => controller.abort();
  }, [transpose]);

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.code.startsWith("Digit") ? e.code : e.key.toLowerCase();
    if (!keyMap[key] || pressedKeys.current.has(key)) return;
    pressedKeys.current.add(key);
    const [whiteNote, blackNote] = keyMap[key];

    if (e.shiftKey && blackNote) {
      synth.triggerAttackRelease(getNoteName(blackNote.noteIndex, transpose)!, "4n");
      console.log("Black Note:", getNoteName(blackNote.noteIndex, transpose));
    } else if (whiteNote) {
      synth.triggerAttackRelease(getNoteName(whiteNote.noteIndex, transpose)!, "4n");
      console.log("White Note:", getNoteName(whiteNote.noteIndex, transpose));
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    const key = e.code.startsWith("Digit") ? e.code : e.key.toLowerCase();
    if (!keyMap[key]) return;
    pressedKeys.current.delete(key);
  };

  const handleStart = async () => {
    await Tone.start();
    console.log("Tone.started");
  };

  return (
    <div>
      KeyTester
      <button type="button" onClick={handleStart}>
        Start Tone.js
      </button>
      <TransposeController transpose={transpose} setTranspose={setTranspose} />
      <div id="piano-keys">
        {Object.entries(keyMap).map(([_, notes]) => {
          return (
            <Fragment>
              {notes[0] && <PianoKey note={notes[0]} isWhite={true} />}
              {notes[1] && <PianoKey note={notes[1]} isWhite={false} />}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

function PianoKey({ note, isWhite }: { note: NoteTypes; isWhite: boolean }) {
  console.log(note);
  return (
    <button type="button" className={`key ${isWhite ? "key-white" : "key-black"}`}>
      {note.char}
    </button>
  );
}

interface TransposeControllerProps {
  transpose: number;
  setTranspose: Dispatch<SetStateAction<number>>;
}
function TransposeController({ transpose, setTranspose }: TransposeControllerProps) {
  return (
    <div>
      <button type="button" onClick={() => setTranspose((prev) => Math.min(Math.max(prev - 1, -12), 12))}>
        -
      </button>
      <span>Transposition:{transpose}</span>
      <button type="button" onClick={() => setTranspose((prev) => Math.min(Math.max(prev + 1, -12), 12))}>
        +
      </button>
    </div>
  );
}
