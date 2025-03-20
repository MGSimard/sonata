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

  const sampler = useRef<Tone.Sampler>(
    new Tone.Sampler({
      urls: {
        C1: "/assets/notes/C1.mp3",
        "C#1": "/assets/notes/Cs1.mp3",
        D1: "/assets/notes/D1.mp3",
        "D#1": "/assets/notes/Ds1.mp3",
        E1: "/assets/notes/E1.mp3",
        F1: "/assets/notes/F1.mp3",
        "F#1": "/assets/notes/Fs1.mp3",
        G1: "/assets/notes/G1.mp3",
        "G#1": "/assets/notes/Gs1.mp3",
        A1: "/assets/notes/A1.mp3",
        "A#1": "/assets/notes/As1.mp3",
        B1: "/assets/notes/B1.mp3",
        C2: "/assets/notes/C2.mp3",
        "C#2": "/assets/notes/Cs2.mp3",
        D2: "/assets/notes/D2.mp3",
        "D#2": "/assets/notes/Ds2.mp3",
        E2: "/assets/notes/E2.mp3",
        F2: "/assets/notes/F2.mp3",
        "F#2": "/assets/notes/Fs2.mp3",
        G2: "/assets/notes/G2.mp3",
        "G#2": "/assets/notes/Gs2.mp3",
        A2: "/assets/notes/A2.mp3",
        "A#2": "/assets/notes/As2.mp3",
        B2: "/assets/notes/B2.mp3",
        C3: "/assets/notes/C3.mp3",
        "C#3": "/assets/notes/Cs3.mp3",
        D3: "/assets/notes/D3.mp3",
        "D#3": "/assets/notes/Ds3.mp3",
        E3: "/assets/notes/E3.mp3",
        F3: "/assets/notes/F3.mp3",
        "F#3": "/assets/notes/Fs3.mp3",
        G3: "/assets/notes/G3.mp3",
        "G#3": "/assets/notes/Gs3.mp3",
        A3: "/assets/notes/A3.mp3",
        "A#3": "/assets/notes/As3.mp3",
        B3: "/assets/notes/B3.mp3",
        C4: "/assets/notes/C4.mp3",
        "C#4": "/assets/notes/Cs4.mp3",
        D4: "/assets/notes/D4.mp3",
        "D#4": "/assets/notes/Ds4.mp3",
        E4: "/assets/notes/E4.mp3",
        F4: "/assets/notes/F4.mp3",
        "F#4": "/assets/notes/Fs4.mp3",
        G4: "/assets/notes/G4.mp3",
        "G#4": "/assets/notes/Gs4.mp3",
        A4: "/assets/notes/A4.mp3",
        "A#4": "/assets/notes/As4.mp3",
        B4: "/assets/notes/B4.mp3",
        C5: "/assets/notes/C5.mp3",
        "C#5": "/assets/notes/Cs5.mp3",
        D5: "/assets/notes/D5.mp3",
        "D#5": "/assets/notes/Ds5.mp3",
        E5: "/assets/notes/E5.mp3",
        F5: "/assets/notes/F5.mp3",
        "F#5": "/assets/notes/Fs5.mp3",
        G5: "/assets/notes/G5.mp3",
        "G#5": "/assets/notes/Gs5.mp3",
        A5: "/assets/notes/A5.mp3",
        "A#5": "/assets/notes/As5.mp3",
        B5: "/assets/notes/B5.mp3",
        C6: "/assets/notes/C6.mp3",
        "C#6": "/assets/notes/Cs6.mp3",
        D6: "/assets/notes/D6.mp3",
        "D#6": "/assets/notes/Ds6.mp3",
        E6: "/assets/notes/E6.mp3",
        F6: "/assets/notes/F6.mp3",
        "F#6": "/assets/notes/Fs6.mp3",
        G6: "/assets/notes/G6.mp3",
        "G#6": "/assets/notes/Gs6.mp3",
        A6: "/assets/notes/A6.mp3",
        "A#6": "/assets/notes/As6.mp3",
        B6: "/assets/notes/B6.mp3",
        C7: "/assets/notes/C7.mp3",
        "C#7": "/assets/notes/Cs7.mp3",
        D7: "/assets/notes/D7.mp3",
        "D#7": "/assets/notes/Ds7.mp3",
        E7: "/assets/notes/E7.mp3",
        F7: "/assets/notes/F7.mp3",
        "F#7": "/assets/notes/Fs7.mp3",
        G7: "/assets/notes/G7.mp3",
        "G#7": "/assets/notes/Gs7.mp3",
        A7: "/assets/notes/A7.mp3",
        "A#7": "/assets/notes/As7.mp3",
        B7: "/assets/notes/B7.mp3",
        C8: "/assets/notes/C8.mp3",
      },
      release: 1,
      baseUrl: "http://localhost:3000",
    }).toDestination()
  );

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
    console.log("playNote", noteIndex);
    const noteName = getNoteName(noteIndex, transpose);
    sampler.current.triggerAttackRelease(noteName, 10);
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
