import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuid } from "uuid";
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

// file upload and validations
import { supportMimes } from "./configs/fileSystem.js";
import { UploadedFile } from "express-fileupload";
export const ImageValidator = (size: number, mime: string): string | null => {
  if (byteToMB(size) > 2) {
    return "Image size must be less than 2 Mb.";
  } else if (!supportMimes.includes(mime)) {
    return "Please upload image only.";
  }
  return null;
};

export const byteToMB = (bytes: number): number => {
  return bytes / (1024 * 1024);
};

export const fileUpload = (img: UploadedFile) => {
  const imgExt = img?.name.split(".")[1]; //image extension
  const imgName = uuid() + "." + imgExt;
  const uploadPath = process.cwd() + "/public/images/" + imgName;
  img.mv(uploadPath, (err) => {
    if (err) throw err;
  });

  return imgName;
};

// file delete
import fs from "fs";
export const removeImage = (imageName: string) => {
  const path = process.cwd() + "/public/images/" + imageName;
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};
