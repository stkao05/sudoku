import { createClient } from "@/services/supabase";
import { Board } from "@/app/game/[id]/board";

export default async function Game(props: { params: { id: string } }) {
  const supabase = createClient();
  const { id } = props.params;
  const { data } = await supabase
    .from("sudoku_puzzles")
    .select()
    .eq("id", id)
    .limit(1)
    .single();

  if (!data) {
    return <div>internal error: unable to fetch the puzzle record</div>;
  }

  const puzzle = parsePuzzleString(data.puzzle);
  return <Board id={data.id} puzzle={puzzle} key={data.id} />;
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

export async function generateStaticParams() {
  const supabase = createClient();
  const { data: puzzles } = await supabase.from("sudoku_puzzles").select("id");
  return puzzles ? puzzles.map((p) => ({ id: p.id })) : [];
}
