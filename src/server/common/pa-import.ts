import got from "got";
import * as cheerio from "cheerio";

export async function getPythonAnywhereProblems(url: string) {
  if (!url.startsWith("http")) {
    url = "https://" + url;
  }

  const r = await got(url);
  const paHtml = r.body;

  // console.log(paHtml);

  const $ = cheerio.load(paHtml);

  return [
    ...$("td").map((i, td) => {
      if (!$(td).attr("class")?.includes("table-light")) {
        return $(td).text();
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
