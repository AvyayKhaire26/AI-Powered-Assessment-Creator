import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError, z } from "zod";
import { ApiResponse } from "../utils/response.util";
import { logger } from "../utils/logger";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    logger.info("Inside validate middleware");
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const tree = z.treeifyError(result.error as ZodError);

      // flatten tree into array of { field, message }
      const errors: { field: string; message: string }[] = [];

      const traverse = (node: any, path: string) => {
        if (node.errors?.length) {
          errors.push({ field: path, message: node.errors[0] });
        }
        if (node.properties) {
          for (const key of Object.keys(node.properties)) {
            traverse(node.properties[key], path ? `${path}.${key}` : key);
          }
        }
        if (node.items) {
          node.items.forEach((item: any, idx: number) => {
            traverse(item, `${path}[${idx}]`);
          });
        }
      };

      traverse(tree, "");

      logger.warn(`Validation failed: ${JSON.stringify(errors)}`);
      ApiResponse.badRequest(res, errors);
      return;
    }

    req.body = result.data;
    logger.info("End of validate middleware");
    next();
  };
}
