import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
export const renderEmail = async (fileName: string, payload: any) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url)); // absolute path like @
  const html = await ejs.renderFile(
    __dirname + `/views/emails/${fileName}.ejs`,
    payload
  );
  return html;
};

import { ZodError } from "zod";
export const formatError = (err: ZodError) => {
  let totalErrors: any = {};
  err.errors.forEach((issue) => {
    totalErrors[issue.path?.[0]] = issue.message;
  });

  return totalErrors;
};
