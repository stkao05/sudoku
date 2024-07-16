"use client";
import { EMPTY } from "@/services/sudoku";
import clsx from "clsx";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

export function Board(props: { id: string; puzzle: number[] }) {
  const [board, setBoard] = useBoardState(props.id, props.puzzle);
  const [focusIdx, setFocusIdx] = useState(-1);

  const isEditable = (index: number) => props.puzzle[index] === EMPTY;
  const onCellClick = (index: number) => setFocusIdx(index);

  const onKeyDown = (event: KeyboardEvent) => {
    const nextIdx = arrowNavigation(focusIdx, event.key);
    setFocusIdx(nextIdx);

    if (focusIdx !== -1 && isEditable(focusIdx)) {
      if (event.key === "Backspace") {
        const b = [...board];
        b[focusIdx] = EMPTY;
        setBoard(b);
      }
      if (/[1-9]/.test(event.key)) {
        const b = [...board];
        b[focusIdx] = parseInt(event.key);
        setBoard(b);
      }
    }
  };

  const invalidIdxs = validate(board);
  const completed = !board.includes(EMPTY) && invalidIdxs.size === 0;

  return (
    <div>
      <div
        className="grid grid-cols-9 grid-rows-9 h-[100vw] sm:w-[552px] sm:h-[552px] border-2 border-black select-none outline-none"
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
        {completed && "Congrat! You have completed the puzzle ✅"}
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

  // cells that should have the thick right & bottom border
  const rightBorder = [
    2, 11, 20, 29, 38, 47, 56, 65, 74, 5, 14, 23, 32, 41, 50, 59, 68, 77,
  ];
  const bottomBorder = [
    18, 19, 20, 21, 22, 23, 24, 25, 26, 45, 46, 47, 48, 49, 50, 51, 52, 53,
  ];
  const cls = clsx({
    "bg-yellow-400": focus && editable,
    "bg-[#D6AF14]": focus && !editable,
    "bg-neutral-100": !focus && !editable,
    "text-red-600": invalid,
    "cursor-pointer ": editable,
    "border-r-2 border-r-black": rightBorder.includes(index),
    "border-b-2 border-b-black": bottomBorder.includes(index),
  });

  return (
    <input
      type="text"
      className={`appearance-none rounded-none font-semibold text-xl flex text-center justify-center items-center border-r border-b border-neutral-300 outline-none caret-transparent ${cls}`}
      onClick={() => onClick(index)}
      value={value === EMPTY ? "" : value}
      readOnly={!editable}
      onChange={() => {}} // stub method to clear up react warning; input change event will be handled by the parent (Board)
    ></input>
  );
}

/**
 * useBoardState hook manages the board state. It will load
 * any previously stored state from localStorage and also persist
 * the board state when there is a new change.
 */
function useBoardState(id: string, puzzle: number[]) {
  const [board, setBoard] = useState(puzzle);
  const loadedId = useRef<string | null>(null);

  useEffect(() => {
    localStorage.setItem(`board:${id}`, JSON.stringify(board));
  }, [id, board]);

  // SSR: Skip localStorage logic and return board state directly
  if (typeof window === "undefined") {
    return [board, setBoard] as const;
  }

  // when user switches to a different puzzle
  if (loadedId.current !== id) {
    loadedId.current = null;
    setBoard(puzzle);
  }

  if (loadedId.current === null) {
    const boardJson = localStorage.getItem(`board:${id}`);
    if (boardJson) {
      setBoard(JSON.parse(boardJson));
    }
    loadedId.current = id;
  }

  return [board, setBoard] as const;
}

/**
 * Check if every cell satisfies the uniqueness constraint
 * (every number should be unique within a 9-cell group).
 * @returns A set of cell indices that violate the constraint.
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

  const invalidIdx = new Set<number>();
  for (const group of groups) {
    const invalid = validateGroup(board, group);
    invalid.forEach((idx) => invalidIdx.add(idx));
  }

  return invalidIdx;
}

/**
 * Check if a cell group (could be either vertical, horizontal, or 3x3 group)
 * satisfies the uniqueness constraint.
 *
 * @param board - The current board state.
 * @param indexes - An array of size 9, containing cell indices of a group.
 * @returns An array of cell indices that violate the constraint.
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

/**
 * Determines the next focus cell index based on arrow key navigation.
 * @returns The next focus cell index
 */
function arrowNavigation(idx: number, eventKey: string): number {
  switch (eventKey) {
    case "ArrowRight":
      return idx % 9 === 8 ? idx : idx + 1;
    case "ArrowLeft":
      return idx % 9 === 0 ? idx : idx - 1;
    case "ArrowDown":
      return idx + 9 >= 81 ? idx : idx + 9;
    case "ArrowUp":
      return idx - 9 < 0 ? idx : idx - 9;
    case "Escape":
      return -1;
    default:
      return idx;
  }
}
