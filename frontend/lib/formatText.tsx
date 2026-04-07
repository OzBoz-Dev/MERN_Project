import { Fragment, ReactNode } from "react";

// Allows for **bold** or *italics*
export function formatText(text: string): ReactNode {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {parseBold(line, `L${i}`)}
    </Fragment>
  ));
}

// String.split with a capturing group inserts the captured text
// at odd indices of the resulting array. Even indices = surrounding text.
function parseBold(text: string, kp: string): ReactNode[] {
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((part, i) =>
      i % 2 === 1 ? (
        <strong key={`${kp}-b${i}`}>{part}</strong>
      ) : (
        parseItalic(part, `${kp}-${i}`)
      ),
    );
}

function parseItalic(text: string, kp: string): ReactNode[] {
  return text
    .split(/\*(.+?)\*/g)
    .map((part, i) =>
      i % 2 === 1 ? <em key={`${kp}-i${i}`}>{part}</em> : part,
    );
}
