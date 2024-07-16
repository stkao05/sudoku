# Sudoku 

This repository contains a basic Sudoku web game implementation, following the assignment instructions. The app has been deployed to Vercel and could be viewed at: https://sudoku-virid-two.vercel.app

The following features are implemented:
- Loading Sudoku puzzles from hard-coded puzzles stored on Supabase
- A working and playable Sudoku web-based game
- Automatic saving of the user's progress to the browser's local storage
- Navigation of the board with arrow keys


Potential improvement features (not implemented):
- User login & game play history: it will be nice to remember which game user has played and completed and persist the history in the database.

## Setup

To run the project locally:
- Set up a Supabase project and a database
- Seed the database with the query from `supabase/seed.sql`
- Add a `.env.local` file with the following environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
