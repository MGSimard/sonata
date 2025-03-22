import { useRef } from "react";
import { IconClose, IconQuestion } from "@/_components/Icons";

export function InfoButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()} aria-label="Information" title="Information">
        <IconQuestion />
      </button>
      <dialog ref={dialogRef}>
        <div className="dialog-header">
          <h2>Information</h2>
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close" title="Close">
            <IconClose />
          </button>
        </div>
        <section>Hello</section>
      </dialog>
    </>
  );
}
