import { type NextApiRequest, type NextApiResponse } from "next";

import { getPythonAnywhereProblems } from "../../server/common/pa-import";

const paImportMock = async (req: NextApiRequest, res: NextApiResponse) => {
  const url =
    "oichecklist.pythonanywhere.com/view/4c47fbe2fda9f464a8e57b895b0dc36574000586";

  const paProblems = await getPythonAnywhereProblems(url);

  console.log("got paProblems: ", paProblems);

  res.status(200).json(paProblems);
};

export default paImportMock;
