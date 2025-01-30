import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import type { Request } from "express";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization;
  if (token === null || token === undefined) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unauthorized action."));
  }

  // user data from payload data
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err)
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Unauthorized action."));
    req.user = user as AuthUser;
    next();
  });
});

export default authMiddleware;
