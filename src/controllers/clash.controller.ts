import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  fileUpload,
  formatError,
  ImageValidator,
  removeImage,
  renderEmail,
} from "../helper.js";
import { clashSchema } from "../validations/clashValidation.js";
import { UploadedFile } from "express-fileupload";
import prisma from "../configs/db.js";

export const postClash = asyncHandler(async (req, res) => {
  const body = req.body;
  const payload = clashSchema.safeParse(body);

  if (!payload.success && payload.error) {
    const errors = formatError(payload.error);
    return res
      .status(422)
      .json(
        new ApiResponse(
          422,
          errors,
          "Invalid Data. Please check your data properly."
        )
      );
  }
  if (!req.files.image)
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Image is required."));

  //file validation
  const img = req.files.image as UploadedFile; // not an array single file
  const validationMsg = ImageValidator(img.size, img.mimetype); //comes automatically with expressfile upload
  if (validationMsg)
    return res
      .status(422)
      .json(
        new ApiResponse(422, { image: validationMsg }, "Invalid image type.")
      );

  payload.data.image = await fileUpload(img);

  await prisma.clash.create({
    data: {
      title: payload.data.title,
      description: payload.data.description,
      image: payload.data.image,
      user_id: req.user?.id,
      created_at: new Date(Date.now()),
      expired_at: new Date(payload.data.expired_at),
    },
  });
  return res.json(new ApiResponse(200, null, "Clash created successfully."));
});

export const getClash = asyncHandler(async (req, res) => {
  const clash = await prisma.clash.findMany({
    where: {
      user_id: req.user?.id,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  if (!clash.length)
    return res
      .status(404)
      .json(
        new ApiResponse(404, null, "No clash found. Please create your Clash.")
      );

  return res.json(
    new ApiResponse(200, clash, "User Clash fetched successfully.")
  );
});

export const getClashByID = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const clash = await prisma.clash.findUnique({
    where: {
      id: id,
    },
    select: {
      title: true,
      image: true,
      description: true,
      created_at: true,
      expired_at: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  if (!clash)
    return res
      .status(404)
      .json(
        new ApiResponse(404, null, "No clash found. Please create your Clash.")
      );

  return res.json(
    new ApiResponse(200, clash, "User Clash fetched successfully.")
  );
});

export const updateClash = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const payload = clashSchema.safeParse(body);

  if (!payload.success && payload.error) {
    const errors = formatError(payload.error);
    return res
      .status(422)
      .json(
        new ApiResponse(
          422,
          errors,
          "Invalid Data. Please check your data properly."
        )
      );
  }

  if (req.files?.image) {
    //file validation
    const img = req.files.image as UploadedFile; // not an array single file
    const validationMsg = ImageValidator(img.size, img.mimetype); //comes automatically with expressfile upload
    if (validationMsg)
      return res
        .status(422)
        .json(
          new ApiResponse(422, { image: validationMsg }, "Invalid image type.")
        );

    const clash = await prisma.clash.findUnique({
      where: {
        id,
      },
      select: {
        image: true,
      },
    });
    if (!clash)
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Clash not found. Please try again."));

    //delete old image
    removeImage(clash.image);

    payload.data.image = await fileUpload(img);
  }
  await prisma.clash.update({
    data: {
      ...payload.data,
      expired_at: new Date(payload.data.expired_at),
    },
    where: {
      id,
    },
  });
  return res.json(
    new ApiResponse(200, null, "User clash updated successfully.")
  );
});

export const deleteClash = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const clash = await prisma.clash.findUnique({
    where: {
      id,
    },
    select: {
      image: true,
    },
  });
  if (!clash)
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Clash not found. Please try again."));
  removeImage(clash.image);
  await prisma.clash.delete({
    where: {
      id,
    },
  });
  return res.json(new ApiResponse(200, null, "Clash deleted successfully."));
});
