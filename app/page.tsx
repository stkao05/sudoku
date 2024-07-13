import { createClient } from "@/services/supabase";
import { cookies } from "next/headers";
import { Board } from "./board";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: puzzles } = await supabase.from("sudoku_puzzles").select();

  if (!puzzles) return null; // TODO
  const p = puzzles[0];
  const puzzle = parsePuzzleString(p.puzzle);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>sudoku</h1>
      <Board puzzle={puzzle}></Board>
    </main>
  );
}

const EMPTY = 0;

function parsePuzzleString(puzzle: string) {
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
