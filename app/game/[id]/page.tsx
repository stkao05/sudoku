import { createClient } from "@/services/supabase";
import { cookies } from "next/headers";
import { Board } from "@/app/board";

export default async function Game(props: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { id } = props.params;
  const { data } = await supabase
    .from("sudoku_puzzles")
    .select()
    .eq("id", id)
    .limit(1)
    .single();

  const puzzle = parsePuzzleString(data.puzzle);
  return (
    <main className="flex justify-center pt-4">
      <Board puzzle={puzzle} />
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