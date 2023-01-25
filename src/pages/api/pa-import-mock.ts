import { type NextApiRequest, type NextApiResponse } from "next";

import { getPythonAnywhereProblems } from "../../server/common/pa-import";

const paImportMock = async (req: NextApiRequest, res: NextApiResponse) => {
  const url =
    "oichecklist.pythonanywhere.com/view/27fad9750e8ef51312f80d05e4d260bc904c1a9a";

  const paProblems = await getPythonAnywhereProblems(url);

  console.log("got paProblems: ", paProblems);

  res.status(200).json(paProblems);
};

export default paImportMock;
