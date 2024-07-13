"use client";

import { useState, KeyboardEvent } from "react";

const EMPTY = 0;

export function Board(props: { puzzle: number[] }) {
  const [puz, setPuz] = useState(props.puzzle);
  const [focusIdx, setFocusIdx] = useState(-1);

  const onCellClick = (index: number) => {
    setFocusIdx(index);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (focusIdx === -1) return;

    if (event.key === "Backspace") {
      const p = [...puz];
      p[focusIdx] = 0;
      setPuz(p);
      return;
    }

    if (/[1-9]/.test(event.key)) {
      const p = [...puz];
      p[focusIdx] = parseInt(event.key);
      setPuz(p);
      return;
    }
  };

  return (
    <div
      className="grid grid-cols-9 grid-rows-9"
      onKeyDown={onKeyDown}
      tabIndex={-1}
    >
      {puz.map((value, i) => {
        return (
          <Cell
            key={i}
            index={i}
            value={value}
            focus={i == focusIdx}
            onClick={onCellClick}
          />
        );
      })}
    </div>
  );
}

function Cell(props: {
  index: number;
  value: number;
  focus: boolean;
  onClick: (index: number) => void;
}) {
  const { index, focus, onClick } = props;
  return (
    <div
      className={`w-14 h-14 overflow-hidden flex justify-center items-center outline-1 outline-zinc-400 outline ${
        focus && "bg-yellow-400 bg-opacity-20"
      }`}
      onClick={() => onClick(index)}
    >
      {props.value === EMPTY ? null : props.value}
    </div>
  );
}
