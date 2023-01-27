import got from "got";
import * as cheerio from "cheerio";

export async function getPythonAnywhereProblems(url: string) {
  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  const r = await got(url);
  const paHtml = r.body;
  const lines = paHtml.split("\n");

  let solvedProblems = [];
  let tryingProblems = [];
  let mindsolvedProblems = [];

  for (var i = 0; i < lines.length; i++) {
    if (lines[i]?.includes("var solved_problems")) {
      solvedProblems = lines[i]?.match(/\d+/g) as any;
    }

    if (lines[i]?.includes("var solving_problems")) {
      tryingProblems = lines[i]?.match(/\d+/g) as any;
    }

    if (lines[i]?.includes("var known_problems")) {
      mindsolvedProblems = lines[i]?.match(/\d+/g) as any;
    }
  }

  const freq = new Map();

  // for (var i = 0; i < solved.length; i++) {
  solvedProblems.forEach((solvedProblem: string, i: number) => {
    const sProbInt = parseInt(solvedProblem);
    solvedProblems[i] = sProbInt;
    freq.set(sProbInt, 2);
  });

  tryingProblems.forEach((tryingProblem: string, i: number) => {
    const tProbInt = parseInt(tryingProblem);
    tryingProblems[i] = tProbInt;
    freq.set(tProbInt, 0);
  });

  // for (var i = 0; i < trying.length; i++) {
  //   trying[i] = parseInt(trying[i]);
  //   freq.set(trying[i], 0);
  // }

  mindsolvedProblems.forEach((mindsolvedProblem: string, i: number) => {
    const msProbInt = parseInt(mindsolvedProblem);
    mindsolvedProblems[i] = msProbInt;
    freq.set(msProbInt, 1);
  });

  // for (var i = 0; i < mindsolved.length; i++) {
  //   mindsolved[i] = parseInt(mindsolved[i]);
  //   freq.set(mindsolved[i], 1);
  // }

  console.log({ solvedProblems, tryingProblems, mindsolvedProblems, freq });

  const $ = cheerio.load(paHtml);

  return [
    ...$("td").map((i, td) => {
      let cls = parseInt($(td).attr("id") as string);
      if (freq.has(cls)) {
        return {
          name: $(td)
            .text()
            .replace(/[\r\n\t]+/gm, "")
            .trim(),
          id: $(td).attr("data-title"),
          status: freq.get(cls),
        };
      }
    }),
  ];
}
