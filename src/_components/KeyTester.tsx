import { Fragment, useEffect, useState, useRef, type Dispatch, type SetStateAction } from "react";
import * as Tone from "tone";
import { getNoteName, keyMap, type NoteIndex, type NoteTypes } from "@/_utils/maps";
import { getWhiteKeyShape } from "@/_utils/helpers";

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
        C1: "C1.mp3",
        "C#1": "Cs1.mp3",
        D1: "D1.mp3",
        "D#1": "Ds1.mp3",
        E1: "E1.mp3",
        F1: "F1.mp3",
        "F#1": "Fs1.mp3",
        G1: "G1.mp3",
        "G#1": "Gs1.mp3",
        A1: "A1.mp3",
        "A#1": "As1.mp3",
        B1: "B1.mp3",
        C2: "C2.mp3",
        "C#2": "Cs2.mp3",
        D2: "D2.mp3",
        "D#2": "Ds2.mp3",
        E2: "E2.mp3",
        F2: "F2.mp3",
        "F#2": "Fs2.mp3",
        G2: "G2.mp3",
        "G#2": "Gs2.mp3",
        A2: "A2.mp3",
        "A#2": "As2.mp3",
        B2: "B2.mp3",
        C3: "C3.mp3",
        "C#3": "Cs3.mp3",
        D3: "D3.mp3",
        "D#3": "Ds3.mp3",
        E3: "E3.mp3",
        F3: "F3.mp3",
        "F#3": "Fs3.mp3",
        G3: "G3.mp3",
        "G#3": "Gs3.mp3",
        A3: "A3.mp3",
        "A#3": "As3.mp3",
        B3: "B3.mp3",
        C4: "C4.mp3",
        "C#4": "Cs4.mp3",
        D4: "D4.mp3",
        "D#4": "Ds4.mp3",
        E4: "E4.mp3",
        F4: "F4.mp3",
        "F#4": "Fs4.mp3",
        G4: "G4.mp3",
        "G#4": "Gs4.mp3",
        A4: "A4.mp3",
        "A#4": "As4.mp3",
        B4: "B4.mp3",
        C5: "C5.mp3",
        "C#5": "Cs5.mp3",
        D5: "D5.mp3",
        "D#5": "Ds5.mp3",
        E5: "E5.mp3",
        F5: "F5.mp3",
        "F#5": "Fs5.mp3",
        G5: "G5.mp3",
        "G#5": "Gs5.mp3",
        A5: "A5.mp3",
        "A#5": "As5.mp3",
        B5: "B5.mp3",
        C6: "C6.mp3",
        "C#6": "Cs6.mp3",
        D6: "D6.mp3",
        "D#6": "Ds6.mp3",
        E6: "E6.mp3",
        F6: "F6.mp3",
        "F#6": "Fs6.mp3",
        G6: "G6.mp3",
        "G#6": "Gs6.mp3",
        A6: "A6.mp3",
        "A#6": "As6.mp3",
        B6: "B6.mp3",
        C7: "C7.mp3",
        "C#7": "Cs7.mp3",
        D7: "D7.mp3",
        "D#7": "Ds7.mp3",
        E7: "E7.mp3",
        F7: "F7.mp3",
        "F#7": "Fs7.mp3",
        G7: "G7.mp3",
        "G#7": "Gs7.mp3",
        A7: "A7.mp3",
        "A#7": "As7.mp3",
        B7: "B7.mp3",
        C8: "C8.mp3",
      },
      baseUrl: "/assets/notes/",
      release: 1,
      volume: -7,
      attack: 0,
    }).toDestination()
  );

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
    sampler.current.triggerAttack(noteName);
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

  const adjustTranspose = (amount: number) => {
    setTranspose((prev) => Math.max(-12, Math.min(12, prev + amount)));
  };

  return (
    <div>
      KeyTester
      <button type="button" onClick={handleStart}>
        Start Tone.js
      </button>
      <div id="piano">
        <div id="piano-header">
          <div>
            <div id="transpose-controls">
              <button type="button" onClick={() => adjustTranspose(-1)}>
                -
              </button>
              <button type="button" onClick={() => adjustTranspose(1)}>
                +
              </button>
            </div>
            <div id="piano-display">Display / Transpose: {transpose}</div>
          </div>
          <div id="piano-liner"></div>
        </div>
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
  // Check if it's the last white key (highest note)
  const isLastKey = isWhite && note.noteIndex === 72; // Using the last note in our keyMap (m key)

  return (
    <button
      type="button"
      className={`key ${isWhite ? "key-white" : "key-black"}${isPlaying ? " playing" : ""}${
        isWhite ? ` ${getWhiteKeyShape(note, isLastKey)}` : ""
      }`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      style={
        isWhite
          ? undefined
          : {
              left: `calc(var(--keyWhiteWidth) * ${index} + var(--keyWhiteWidth) * 0.7)`,
            }
      }>
      <div className="key-core">{note.char}</div>
      <div className="key-bottom"></div>
    </button>
  );
}
