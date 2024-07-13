"use client";
import { group } from "console";
import { useState, KeyboardEvent } from "react";

const EMPTY = 0;

export function Board(props: { puzzle: number[] }) {
  const [board, setBoard] = useState(props.puzzle);
  const [focusIdx, setFocusIdx] = useState(-1);

  const onCellClick = (index: number) => {
    setFocusIdx(index);
  };

  const isEditable = (index: number) => props.puzzle[index] === EMPTY;

  const onKeyDown = (event: KeyboardEvent) => {
    if (focusIdx === -1 || !isEditable(focusIdx)) {
      return;
    }

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
  };

  const invalidIdxs = validate(board);
  console.log(invalidIdxs);

  return (
    <div
      className="grid grid-cols-9 grid-rows-9"
      onKeyDown={onKeyDown}
      tabIndex={-1}
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
  return (
    <div
      className={`w-14 h-14 overflow-hidden flex justify-center items-center outline-1 outline-zinc-400 outline ${
        focus && "bg-yellow-400 bg-opacity-20"
      } ${!editable && "bg-zinc-200"}
      ${invalid && "bg-red-300"}
      `}
      onClick={() => onClick(index)}
    >
      {value === EMPTY ? null : value}
    </div>
  );
}

/**
 * @returns {Set<number>} a set of cell index of which it contains invalid value
 */
function validate(board: number[]) {
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

  let invalidIdxs = new Set();
  for (const group of groups) {
    const invalid = validateGroup(board, group);
    invalidIdxs = invalidIdxs.union(invalid);
  }

  return invalidIdxs;
}

/**
 * @param board
 * @param indexes
 * @returns
 */
function validateGroup(board: number[], indexes: number[]) {
  const count: { [val: number]: number } = {};
  for (let idx of indexes) {
    const val = board[idx];
    if (val === EMPTY) continue;

    if (!count[val]) {
      count[val] = 0;
    }
    count[val] += 1;
  }

  const invalidIdx = new Set();
  for (let idx of indexes) {
    if (count[board[idx]] > 1) {
      invalidIdx.add(idx);
    }
  }

  return invalidIdx;
}
