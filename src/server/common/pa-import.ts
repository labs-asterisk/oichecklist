import got from "got";
import * as cheerio from "cheerio";

export async function getPythonAnywhereProblems(url: string) {
  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  const r = await got(url);
  const paHtml = r.body;
  const lines = paHtml.split("\n");
  let solved = []
  let trying = []
  let mindsolved = []
  for (var i = 0; i < lines.length; i++) {
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
  for (var i = 0; i < solved.length; i++) {
    solved[i] = parseInt(solved[i]);
    freq.set(solved[i], 2);
  }
  for (var i = 0; i < trying.length; i++) {
    trying[i] = parseInt(trying[i]);
    freq.set(trying[i], 0);
  }
  for (var i = 0; i < mindsolved.length; i++) {
    mindsolved[i] = parseInt(mindsolved[i]);
    freq.set(mindsolved[i], 1);
  }

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
  // tdObjs.map(async (idx, elem) => {
  //   // console.log(Object.keys(elem));

  //   try {
  //     console.log(elem.attribs);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // });

  // return [];
}
