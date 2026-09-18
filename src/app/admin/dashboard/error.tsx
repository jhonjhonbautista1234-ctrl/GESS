"use client";
export default function WorkspaceError({ reset }: { reset: () => void }) {
  return <section className="studio-card"><p className="studio-eyebrow">Connection interrupted</p><h1 className="studio-heading">Your workspace could not be loaded.</h1><p className="studio-muted">Please try again. Your saved content has not been changed.</p><button className="studio-button is-primary mt-6" onClick={reset}>Try again</button></section>;
}
