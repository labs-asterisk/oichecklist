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
      let cls = $(td).attr("class");

      if (!cls?.includes("table-light") && !cls?.includes("bg-light")) {
        return {
          name: $(td)
            .text()
            .replace(/[\r\n\t]+/gm, "")
            .trim(),
          status: cls?.includes("table-warning")
            ? "yellow"
            : cls?.includes("table-primary")
            ? "blue"
            : cls?.includes("table-success")
            ? "green"
            : cls?.includes("table-danger")
            ? "red"
            : "white",
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
