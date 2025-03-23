import { Fragment, useEffect, useState, useRef } from "react";
import * as Tone from "tone";
import { fileMap, getNoteName, keyMap, type NoteIndex, type NoteTypes } from "@/_utils/maps";
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

export const Piano = () => {
  const [isLoaded, setIsLoaded] = useState(false); // Handles state of sampler
  const [transpose, setTranspose] = useState(0);
  const [volume, setVolume] = useState(0);
  const pressedKeys = useRef<Set<string>>(new Set());
  const pointerPressedNotes = useRef<Set<number>>(new Set());
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const sampler = useRef<Tone.Sampler>(null);

  // useEffect(() => {
  //   if (!sampler.current || !isLoaded) return;
  //   sampler.current.volume.value = volume;
  // }, [volume, setVolume, isLoaded, sampler]);

  useEffect(() => {
    sampler.current = new Tone.Sampler({
      urls: fileMap,
      baseUrl: "/assets/notes/",
      volume: -7,
      onload: () => {
        setIsLoaded(true);
      },
      onerror: (error) => {
        console.error("Error loading sampler", error);
      },
    }).toDestination();

    return () => {
      if (sampler.current) {
        sampler.current.dispose();
        sampler.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    window.addEventListener("keydown", handleKeyDown, { signal });
    window.addEventListener("keyup", handleKeyUp, { signal });
    return () => controller.abort();
  }, [transpose, isLoaded]);

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.code.startsWith("Digit") ? e.code : e.key.toLowerCase();
    if (!keyMap[key] || pressedKeys.current.has(key)) return;
    pressedKeys.current.add(key);
    const [whiteNote, blackNote] = keyMap[key];
    const noteToPlay = e.shiftKey && blackNote ? blackNote : whiteNote;
    if (noteToPlay) addActiveNote(noteToPlay.noteIndex);
  };

  const addActiveNote = (noteIndex: NoteIndex) => {
    if (isLoaded) {
      playNote(noteIndex);
    }
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

  const handleKeyUp = (e: KeyboardEvent) => {
    const key = e.code.startsWith("Digit") ? e.code : e.key.toLowerCase();
    if (!keyMap[key]) return;
    pressedKeys.current.delete(key);
    const [whiteNote, blackNote] = keyMap[key];
    if (whiteNote) removeActiveNote(whiteNote.noteIndex);
    if (blackNote) removeActiveNote(blackNote.noteIndex);
  };

  const handleStart = async () => {
    if (!isLoaded) return;
    await Tone.start();
    console.log("Tone.started");
  };

  const playNote = (noteIndex: NoteIndex) => {
    if (!sampler.current) return;
    const noteName = getNoteName(noteIndex, transpose);
    sampler.current.triggerAttack(noteName);
    return noteName;
  };

  const handlePointerDown = (noteIndex: NoteIndex) => {
    pointerPressedNotes.current.add(noteIndex);
    addActiveNote(noteIndex);
  };

  const handlePointerUp = (noteIndex: NoteIndex) => {
    pointerPressedNotes.current.delete(noteIndex);
    removeActiveNote(noteIndex);
  };

  const handlePointerEnter = (e: React.PointerEvent, noteIndex: NoteIndex) => {
    if (e.buttons & 1) {
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
    if (!isLoaded) return;
    setTranspose((prev) => Math.max(-12, Math.min(12, prev + amount)));
  };

  return (
    <section id="piano" className="noselect">
      <div id="soundbar"></div>
      <div id="piano-header">
        <h1>Sonata</h1>
        <button type="button" onClick={handleStart}>
          Start Tone.js
        </button>
        <div id="control-board">
          <div id="transpose-controls">
            <label htmlFor="transpose-controls">Transpose</label>
            <div className="transpose-control">
              <button
                id="transpose-minus"
                type="button"
                onClick={() => adjustTranspose(-1)}
                aria-label="Decrease"
                title="Decrease"></button>
            </div>
            <div className="transpose-control">
              <button
                id="transpose-plus"
                type="button"
                onClick={() => adjustTranspose(1)}
                aria-label="Increase"
                title="Increase"></button>
            </div>
          </div>
          <div id="display">
            <div id="screen">
              {isLoaded ? (
                <ul>
                  <li>- Volume: N/A</li>
                  <li>- Transpose: {transpose}</li>
                </ul>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div id="piano-keys-container">
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
                    onPointerEnter={(e) => handlePointerEnter(e, whiteNote.noteIndex)}
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
                    onPointerEnter={(e) => handlePointerEnter(e, blackNote.noteIndex)}
                    onPointerLeave={() => handlePointerLeave(blackNote.noteIndex)}
                  />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
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
  onPointerEnter: (e: React.PointerEvent) => void;
  onPointerLeave: () => void;
}) {
  const isLastKey = isWhite && note.noteIndex === 72;

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
