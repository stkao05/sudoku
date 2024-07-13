"use client";
import { KeyboardEvent, useState } from "react";
import clsx from "clsx";

const EMPTY = 0;

export function Board(props: { puzzle: number[] }) {
  const [board, setBoard] = useState(props.puzzle);
  const [focusIdx, setFocusIdx] = useState(-1);

  const onCellClick = (index: number) => {
    setFocusIdx(index);
  };

  const isEditable = (index: number) => props.puzzle[index] === EMPTY;

  const onKeyDown = (event: KeyboardEvent) => {
    const nextIdx = arrowNavigation(focusIdx, event.key);
    if (nextIdx !== null) {
      setFocusIdx(nextIdx);
    }

    if (focusIdx !== -1 && isEditable(focusIdx)) {
      if (event.key === "Backspace") {
        const b = [...board];
        b[focusIdx] = 0;
        setBoard(b);
        return;
      }

      if (/[1-9]/.test(event.key)) {
        const b = [...board];
        b[focusIdx] = parseInt(event.key);
        setBoard(b);
        return;
      }
    }
  };

  const invalidIdxs = validate(board);
  const completed = !board.includes(EMPTY) && invalidIdxs.size === 0;

  return (
    <div>
      <div
        className="grid grid-cols-9 grid-rows-9 border-2 border-black select-none focus:outline-none"
        onKeyDown={onKeyDown}
        tabIndex={0}
      >
        {board.map((value, idx) => {
          return (
            <Cell
              key={idx}
              index={idx}
              value={value}
              focus={idx == focusIdx}
              invalid={invalidIdxs.has(idx)}
              editable={isEditable(idx)}
              onClick={onCellClick}
            />
          );
        })}
      </div>
      <div className="text-center mt-2">
        {!completed && "🎉 You have completed the puzzle! 🎉 "}
      </div>
    </div>
  );
}

function Cell(props: {
  index: number;
  value: number;
  focus: boolean;
  invalid: boolean;
  editable: boolean;
  onClick: (index: number) => void;
}) {
  const { index, value, focus, invalid, editable, onClick } = props;

  let cls = "";
  const rb = [
    2, 11, 20, 29, 38, 47, 56, 65, 74, 5, 14, 23, 32, 41, 50, 59, 68, 77,
  ];
  const bb = [
    18, 19, 20, 21, 22, 23, 24, 25, 26, 45, 46, 47, 48, 49, 50, 51, 52, 53,
  ];
  if (rb.includes(index)) {
    cls += " border-r-4";
  }
  if (bb.includes(index)) {
    cls += " border-b-4";
  }

  const c = clsx({
    "bg-yellow-400": focus && editable,
    "bg-[#D6AF14]": focus && !editable,
    "bg-zinc-200": !focus && !editable,
    "text-red-600": invalid,
    "cursor-pointer ": editable,
  });

  return (
    <div
      className={`w-14 h-14 overflow-hidden font-semibold text-xl flex justify-center items-center border border-zinc-400 ${cls} ${c}`}
      onClick={() => onClick(index)}
    >
      {value === EMPTY ? null : value}
    </div>
  );
}

/**
 * @returns a set of cell index of which it contains invalid value
 */
function validate(board: number[]): Set<number> {
  const groups = [];

  // horizonal groups
  for (let r = 0; r < 9; r++) {
    const g = [];
    for (let c = 0; c < 9; c++) {
      g.push(r * 9 + c);
    }
    groups.push(g);
  }

  // vertical groups
  for (let c = 0; c < 9; c++) {
    const g = [];
    for (let r = 0; r < 9; r++) {
      g.push(r * 9 + c);
    }
    groups.push(g);
  }

  // 3x3 square box groups
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const g = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          g.push((boxRow * 3 + r) * 9 + (boxCol * 3 + c));
        }
      }
      groups.push(g);
    }
  }

  let invalidIdx = new Set<number>();
  for (const group of groups) {
    const invalid = validateGroup(board, group);
    invalidIdx = invalidIdx.union(invalid);
  }

  return invalidIdx;
}

/**
 * @param board
 * @param indexes
 * @returns
 */
function validateGroup(board: number[], indexes: number[]): Set<number> {
  const count: { [val: number]: number } = {};
  for (let idx of indexes) {
    const val = board[idx];
    if (val === EMPTY) continue;

    if (!count[val]) {
      count[val] = 0;
    }
    count[val] += 1;
  }

  const invalidIdx = new Set<number>();
  for (let idx of indexes) {
    if (count[board[idx]] > 1) {
      invalidIdx.add(idx);
    }
  }

  return invalidIdx;
}

function arrowNavigation(idx: number, eventKey: string) {
  if (idx === -1) return null;
  switch (eventKey) {
    case "ArrowRight":
      return idx % 9 === 8 ? idx : idx + 1;
    case "ArrowLeft":
      return idx % 9 === 0 ? idx : idx - 1;
    case "ArrowDown":
      return idx + 9 >= 81 ? idx : idx + 9;
    case "ArrowUp":
      return idx - 9 < 0 ? idx : idx - 9;
    default:
      return null;
  }
}
