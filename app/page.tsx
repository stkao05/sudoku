import { createClient } from "@/services/supabase";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: puzzles } = await supabase.from("sudoku_puzzles").select("id");
  if (!puzzles) return null;

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="w-[500px] pt-10">
        <h1 className="font-medium text-2xl pb-1 mb-4 border-b border-neutral-200">
          Suduko
        </h1>
        <div className="border border-neutral-200">
          {puzzles.map((p) => {
            return (
              <a
                className="block border-b border-neutral-200 p-2 hover:bg-neutral-100"
                key={p.id}
                href={`/game/${p.id}`}
              >
                {p.id.substring(0, 8)}
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}
