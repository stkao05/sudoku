import { createClient } from "@/services/supabase";
import Link from "next/link";

export default async function Home() {
  const supabase = createClient();
  const { data: puzzles } = await supabase.from("sudoku_puzzles").select("id");
  if (!puzzles) {
    return <div>no data</div>;
  }

  return (
    <>
      <div className="mb-2">Choose game</div>
      <div className="border border-neutral-200">
        {puzzles.map((p) => {
          return (
            <Link
              className="block border-b border-neutral-200 last:border-none p-2 hover:bg-neutral-100"
              key={p.id}
              href={`/game/${p.id}`}
            >
              {p.id.substring(0, 8)}
            </Link>
          );
        })}
      </div>
    </>
  );
}
