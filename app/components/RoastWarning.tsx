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
    const scrollY = window.scrollY;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;
    dialog.showModal();
    cancelRef.current?.focus();
    document.body.style.overflow = "hidden";
    // Lock background scroll on iOS as well as desktop browsers.
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;
      window.scrollTo({ top: scrollY, behavior: "instant" });
      if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
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
