import { ZodError } from "zod";
export const formatError = (err: ZodError) => {
  let totalErrors: any = {};
  err.errors.forEach((issue) => {
    totalErrors[issue.path?.[0]] = issue.message;
  });

  return totalErrors;
};
// ZodError: [
//       {
//          "code": "too_small",
//          "minimum": 6,
//          "type": "string",
//          "inclusive": true,
//          "exact": false,
//         "message": "Password must be at least six characters.",
//          "path": [
//            "password"
//          ]
//        },
//       {
//          "code": "invalid_type",
//          "expected": "string",
//          "received": "undefined",
//          "path": [
//            "confirmPassword"
//          ],
//          "message": "Required"
//        }
//      ]
