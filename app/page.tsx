import { createClient } from "@/services/supabase";
import Link from "next/link";
import clsx from "clsx";

export const revalidate = 60;

export default async function Home() {
  const supabase = createClient();
  const { data: puzzles } = await supabase
    .from("sudoku_puzzles")
    .select("id,difficulty")
    .order("difficulty", { ascending: true });

  if (!puzzles) {
    return <div>no data</div>;
  }

  const level = { 1: "easy", 2: "medium", 3: "hard" };

  return (
    <>
      <div className="mb-2">choose your game</div>
      <div>
        {puzzles.map((p) => {
          return (
            <Link
              className="flex justify-between border-b border-neutral-200 last:border-none py-2 hover:bg-neutral-100"
              key={p.id}
              href={`/game/${p.id}`}
            >
              <div>{p.id.substring(0, 8)}</div>
              <div
                className={clsx({
                  "text-green-500": p.difficulty === 1,
                  "text-yellow-500": p.difficulty === 2,
                  "text-red-500": p.difficulty === 3,
                })}
              >
                {p.difficulty && level[p.difficulty as 1 | 2 | 3]}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
