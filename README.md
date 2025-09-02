# chachachat
A Discord clone.

## Technologies used:
**Backend** - Prisma (ORM), Supabase (db), Clerk (auth), Socket.IO (websockets). 
For the most part, they're plug and play. If I were to expand on this in the future, I would most likely move away from using Clerk for auth since it seems to be a bad vendor for scaling with. I would either use Supabase's auth or Auth0 instead since I already use Supabase for my db and Auth0 seems more flexible. 

**Frontend** - Next.js w/ React (TypeScript), Tailwind CSS.
This seems to be an easy start for spinning up web apps since React has a large ecosystem to pull from (e.g. I used TanStack Query for pulling messages and shadcn for UI components.) Since I don't enjoy frontend that much, I would probably still use React as it makes it easier to build out without starting from scratch.
