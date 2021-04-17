import { NextApiRequest, NextApiResponse } from "next";

import formidable from "formidable";
import { DataService } from "../../../../../service/data.service";
import * as fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();

    const dataService = new DataService();

    const { projectId } = req.query as {
      projectId: string;
    };

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(503)
        res.json({
          message: err.message
        })
        return
      }

      const imported = await dataService.importFromDisqus(
        projectId,
        fs.readFileSync(files.file.path, { encoding: "utf-8" })
      );
      res.json({
        data: {
          pageCount: imported.threads.length,
          commentCount: imported.posts.length
        },
      });
    });
  }
}
