import { router } from "../trpc";
// import { authRouter } from "./auth";
// import { exampleRouter } from "./example";

import { attemptRouter } from "./attempt";
import { viewRouter } from "./view";
import { importRouter } from "./import";

export const appRouter = router({
  // example: exampleRouter,
  // auth: authRouter,
  attempt: attemptRouter,
  view: viewRouter,
  import: importRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
