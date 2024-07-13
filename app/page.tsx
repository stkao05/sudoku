import { createClient } from "@/services/supabase";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: puzzles } = await supabase.from("sudoku_puzzles").select("id");
  if (!puzzles) return null;

  return (
    <main className="flex flex-col items-center justify-center pt-10">
      <h1 className="font-extrabold text-3xl mb-4">Suduko</h1>
      <div className="mb-2">Choose game</div>
      <div className="border border-zinc-200">
        {puzzles.map((p) => {
          return (
            <a
              className="block border-b border-zinc-200 p-2 hover:bg-yellow-300"
              key={p.id}
              href={`/game/${p.id}`}
            >
              {p.id.substring(0, 8)}
            </a>
          );
        })}
      </div>
    </main>
  );
}
