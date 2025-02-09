import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  fileUpload,
  formatError,
  ImageValidator,
  removeImage,
} from "../helper.js";

import { FileArray, UploadedFile } from "express-fileupload";
import prisma from "../configs/db.js";

export const addClashItems = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const files: FileArray | null = req.files;

  let imgErrors: string[] = [];
  const images = files?.["images[]"] as UploadedFile[];

  if (!Array.isArray(images) || images.length < 2)
    return res
      .status(422)
      .json(
        new ApiResponse(
          422,
          ["Please provide two images for clashing."],
          "Please provide two images for clashing"
        )
      ); // for map value in frontend

  // validation
  images.forEach((img) => {
    const errMsg = ImageValidator(img.size, img.mimetype);
    if (errMsg) imgErrors.push(errMsg);
  });

  if (imgErrors.length) {
    return res
      .status(422)
      .json(
        new ApiResponse(
          422,
          imgErrors,
          "Please provide valid images for clashing."
        )
      );
  }
  const uploadedImages: Array<string> = images.map((img) => fileUpload(img));

  await Promise.all(
    // map doesnt handle async function properly
    uploadedImages.map((item) =>
      prisma.clashItem.create({
        data: {
          image: item,
          clash_id: id.toString(),
        },
      })
    )
  );

  return res
    .status(201)
    .json(new ApiResponse(201, null, "Clash item added successfully."));
});
