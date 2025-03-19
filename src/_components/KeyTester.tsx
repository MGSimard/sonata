import { Fragment, useEffect, useState, useRef, type Dispatch, type SetStateAction } from "react";
import * as Tone from "tone";
import { getNoteName, keyMap, type NoteIndex, type NoteTypes } from "@/_utils/maps";

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
  const pointerPressedNotes = useRef<Set<number>>(new Set());
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const isPointerDown = useRef<boolean>(false);
  const synth = useRef<Tone.PolySynth>(new Tone.PolySynth(Tone.Synth).toDestination());

  // Helper functions for note management
  const addActiveNote = (noteIndex: NoteIndex) => {
    playNote(noteIndex);
    setActiveNotes((prev) => {
      const updated = new Set(prev);
      updated.add(noteIndex);
      return updated;
    });
  };

  const removeActiveNote = (noteIndex: NoteIndex) => {
    setActiveNotes((prev) => {
      const updated = new Set(prev);
      updated.delete(noteIndex);
      return updated;
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    window.addEventListener("keydown", handleKeyDown, { signal });
    window.addEventListener("keyup", handleKeyUp, { signal });
    window.addEventListener("pointerup", () => (isPointerDown.current = false), { signal });

    return () => controller.abort();
  }, [transpose]);

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.code.startsWith("Digit") ? e.code : e.key.toLowerCase();
    if (!keyMap[key] || pressedKeys.current.has(key)) return;

    pressedKeys.current.add(key);
    const [whiteNote, blackNote] = keyMap[key];

    const noteToPlay = e.shiftKey && blackNote ? blackNote : whiteNote;
    if (noteToPlay) addActiveNote(noteToPlay.noteIndex);
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    const key = e.code.startsWith("Digit") ? e.code : e.key.toLowerCase();
    if (!keyMap[key]) return;

    pressedKeys.current.delete(key);
    const [whiteNote, blackNote] = keyMap[key];

    // Remove both possible notes for this key
    if (whiteNote) removeActiveNote(whiteNote.noteIndex);
    if (blackNote) removeActiveNote(blackNote.noteIndex);
  };

  const handleStart = async () => {
    await Tone.start();
    console.log("Tone.started");
  };

  const playNote = (noteIndex: NoteIndex) => {
    const noteName = getNoteName(noteIndex, transpose);
    synth.current.triggerAttackRelease(noteName, "4n");
    return noteName;
  };

  // Unified pointer event handlers
  const handlePointerDown = (noteIndex: NoteIndex) => {
    isPointerDown.current = true;
    pointerPressedNotes.current.add(noteIndex);
    addActiveNote(noteIndex);
  };

  const handlePointerUp = (noteIndex: NoteIndex) => {
    isPointerDown.current = false;
    pointerPressedNotes.current.delete(noteIndex);
    removeActiveNote(noteIndex);
  };

  const handlePointerEnter = (noteIndex: NoteIndex) => {
    if (isPointerDown.current) {
      pointerPressedNotes.current.add(noteIndex);
      addActiveNote(noteIndex);
    }
  };

  const handlePointerLeave = (noteIndex: NoteIndex) => {
    if (pointerPressedNotes.current.has(noteIndex)) {
      pointerPressedNotes.current.delete(noteIndex);
      removeActiveNote(noteIndex);
    }
  };

  return (
    <div>
      KeyTester
      <button type="button" onClick={handleStart}>
        Start Tone.js
      </button>
      <TransposeController transpose={transpose} setTranspose={setTranspose} />
      <div id="piano-keys">
        {Object.entries(keyMap).map(([key, notes], keyIndex) => {
          const whiteNote = notes[0];
          const blackNote = notes[1];

          return (
            <Fragment key={key}>
              {whiteNote && (
                <PianoKey
                  note={whiteNote}
                  isWhite={true}
                  index={keyIndex}
                  isPlaying={activeNotes.has(whiteNote.noteIndex)}
                  onPointerDown={() => handlePointerDown(whiteNote.noteIndex)}
                  onPointerUp={() => handlePointerUp(whiteNote.noteIndex)}
                  onPointerEnter={() => handlePointerEnter(whiteNote.noteIndex)}
                  onPointerLeave={() => handlePointerLeave(whiteNote.noteIndex)}
                />
              )}
              {blackNote && (
                <PianoKey
                  note={blackNote}
                  isWhite={false}
                  index={keyIndex}
                  isPlaying={activeNotes.has(blackNote.noteIndex)}
                  onPointerDown={() => handlePointerDown(blackNote.noteIndex)}
                  onPointerUp={() => handlePointerUp(blackNote.noteIndex)}
                  onPointerEnter={() => handlePointerEnter(blackNote.noteIndex)}
                  onPointerLeave={() => handlePointerLeave(blackNote.noteIndex)}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

function PianoKey({
  note,
  isWhite,
  index,
  isPlaying,
  onPointerDown,
  onPointerUp,
  onPointerEnter,
  onPointerLeave,
}: {
  note: NoteTypes;
  isWhite: boolean;
  index: number;
  isPlaying: boolean;
  onPointerDown: () => void;
  onPointerUp: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) {
  return (
    <button
      type="button"
      className={`key ${isWhite ? "key-white" : "key-black"} ${isPlaying ? "playing" : ""}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      style={
        isWhite
          ? undefined
          : {
              left: `calc(var(--keyWidth) * ${index} + var(--keyWidth) * 0.7)`,
            }
      }>
      {note.char}
    </button>
  );
}

interface TransposeControllerProps {
  transpose: number;
  setTranspose: Dispatch<SetStateAction<number>>;
}
function TransposeController({ transpose, setTranspose }: TransposeControllerProps) {
  const adjustTranspose = (amount: number) => {
    setTranspose((prev) => Math.max(-12, Math.min(12, prev + amount)));
  };

  return (
    <div>
      <button type="button" onClick={() => adjustTranspose(-1)}>
        -
      </button>
      <span>Transposition: {transpose}</span>
      <button type="button" onClick={() => adjustTranspose(1)}>
        +
      </button>
    </div>
  );
}
