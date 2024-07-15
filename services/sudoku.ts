export const EMPTY = 0;

/**
 * parse a sudoku puzzle string into an array of 81 number representing
 * the board value
 *
 * example puzzle string:
 * "634.28.15...456283528.13.6.45.397128213865.4.8..14.5.6.6.58..91381279654945631872"
 */
export function deserialize(puzzle: string): number[] {
  if (!/^[1-9\.]{81}$/.test(puzzle)) {
    throw new Error("invalid puzzle");
  }

  const grid: number[] = Array(81).fill(EMPTY);

  for (let i = 0; i < 81; i++) {
    const char = puzzle[i];
    const val = char === "." ? EMPTY : parseInt(char, 10);
    grid[i] = val;
  }

  return grid;
}
