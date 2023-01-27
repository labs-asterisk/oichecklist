// @ts-nocheck
import { z } from "zod";
import got from "got";
import * as cheerio from "cheerio";

import { router, protectedProcedure } from "../trpc";
import data from "../../../data/problem_data.json";

import { AttemptingState } from "../../../types/problem-data";

export const importRouter = router({
  importProblems: protectedProcedure
  .input(
    z.object({
      link: z.string()
    })
  )
  .mutation(async ({ ctx, input }) => {
    console.log({ input, user: ctx.session.user });

    let { link: checklistLink } = input;
    const { id: userId } = ctx.session.user;

    if (!checklistLink.startsWith("https")) {
      checklistLink = "https://" + checklistLink.split("//")[-1];
    }
    const r = await got(checklistLink);
    const paHtml = r.body;
    const lines = paHtml.split("\n");
    let solved = [], trying = [], mindsolved = [];

    for (let i = 0; i < lines.length; i++) {
      if (lines[i]?.includes("var solved_problems")) {
          solved = lines[i]?.match(/\d+/g) as any;
      }
      if (lines[i]?.includes("var solving_problems")) {
          trying = lines[i]?.match(/\d+/g) as any;
      }
      if (lines[i]?.includes("var known_problems")) {
          mindsolved = lines[i]?.match(/\d+/g) as any;
      } 
    }
    
    const freq = new Map();
    for (let i = 0; i < solved.length; i++) {
      solved[i] = parseInt(solved[i]);
      freq.set(solved[i], 2);
    }
    for (let i = 0; i < trying.length; i++) {
      trying[i] = parseInt(trying[i]);
      freq.set(trying[i], 0);
    }
    for (let i = 0; i < mindsolved.length; i++) {
      mindsolved[i] = parseInt(mindsolved[i]);
      freq.set(mindsolved[i], 1);
    }

    const $ = cheerio.load(paHtml);
    const markedProblems = [
      ...$("td").map((i, td) => {
        let cls = parseInt($(td).attr("id") as string);
        if (freq.has(cls)) {
          return {
            name: $(td)
              .text()
              .replace(/[\r\n\t]+/gm, "")
              .trim(),
            olympiadName: $(td).attr("data-title")?.split(" ")[0],
            year: $(td).attr("data-title")?.split(" ")[1]?.slice(-2),
            status: freq.get(cls),
          };
        }
      })
    ]

    let markedSlugs = data.sections
      .map((s) => s.years
      .map((x) => x.problems
      .map((p) => p.slug))
    );
    markedSlugs = [].concat.apply([], markedSlugs);
    markedSlugs = [].concat.apply([], markedSlugs);

    for (let slug = 0; slug < markedSlugs.length; slug++) {
      let status = -1;
      for (let p = 0; p < markedProblems.length; p++) {
        const problem = markedProblems[p];
        if (markedSlugs[slug]?.toLowerCase().includes(problem["olympiadName"].toLowerCase()) && 
            markedSlugs[slug]?.toLowerCase().includes(problem["name"].toLowerCase()) && 
            markedSlugs[slug]?.toLowerCase().includes(problem["year"].toLowerCase())) {
          status = problem["status"];
        }
      }
      if (status > -1) {
        const attemptStatus = status === 0 ? AttemptingState.Attempting : (status == 1 ? AttemptingState.Unimplemented : AttemptingState.Solved);
        const problemSlug = markedSlugs[slug] as string;
        console.log(markedSlugs[slug], status);
        try {
          const userProblems = await ctx.prisma.userProblem.findMany({
            where: { userId, problemSlug },
          });
  
          console.log("init", { userProblems });
  
          if (userProblems.length !== 0) {
            console.log(
              "updated AS: ",
              await ctx.prisma.userProblem.update({
                where: { id: userProblems[0]?.id },
                data: { attemptingState: attemptStatus as AttemptingState },
              })
            );
          } else {
            console.log(
              "created AS: ",
              await ctx.prisma.userProblem.create({
                data: {
                  userId,
                  problemSlug,
                  attemptingState: attemptStatus,
                },
              })
            );
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    
    return {
      status: "success",
    };
  })
});
