import { createClient } from "@/services/supabase";
import { Board } from "@/app/game/[id]/board";
import { deserialize } from "@/services/sudoku";

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

  const puzzle = deserialize(data.puzzle);
  return <Board id={data.id} puzzle={puzzle} />;
}

export async function generateStaticParams() {
  const supabase = createClient();
  const { data: puzzles } = await supabase.from("sudoku_puzzles").select("id");
  return puzzles ? puzzles.map((p) => ({ id: p.id })) : [];
}
