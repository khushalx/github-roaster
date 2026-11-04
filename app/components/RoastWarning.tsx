"use client";

import { useEffect, useRef } from "react";

export default function RoastWarning({
  battleMode,
  onCancel,
  onConfirm,
}: {
  battleMode: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    cancelRef.current?.focus();
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="roast-warning"
      aria-labelledby="roast-warning-title"
      aria-describedby="roast-warning-description"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      <div className="roast-warning-kicker">
        <span aria-hidden="true">!</span> Content warning
      </div>
      <h2 id="roast-warning-title">This roast pulls no punches.</h2>
      <div id="roast-warning-description" className="roast-warning-copy">
        <p>
          Expect brutal insults, uncensored profanity, and jokes about
          {battleMode ? " both profiles’" : " the profile’s"} code, repos, and developer habits.
          No pep talks. No gentle ending.
        </p>
        <p>
          It’s AI-generated comedy, not a judgment of anyone’s ability or worth.
          Continue only if you’re comfortable with harsh language and ridicule.
        </p>
      </div>
      <div className="roast-warning-actions">
        <button ref={cancelRef} type="button" className="roast-warning-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="roast-warning-confirm" onClick={onConfirm}>
          {battleMode ? "I understand — start the battle" : "I understand — roast away"}
        </button>
      </div>
    </dialog>
  );
}
