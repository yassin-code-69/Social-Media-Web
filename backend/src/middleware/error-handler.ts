import { Context } from "hono";
import { ZodError } from "zod";
import { AppError } from "@/shared/errors/app-error";
import { apiError } from "@/shared/responses/api-response";
import { logger } from "@/lib/logger";

export const errorHandler = (err: Error, c: Context) => {
  const requestId = c.get("requestId");

  // Domain AppError
  if (err instanceof AppError) {
    logger.warn(`[AppError] [${err.code}] ${err.message}`, {
      requestId,
      statusCode: err.statusCode,
      details: err.details,
    });
    return c.json(apiError(err.message, err.code, err.details), err.statusCode as any);
  }

  // Zod Validation Error
  if (err instanceof ZodError) {
    const formatted = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    logger.warn("[ZodValidationError]", { requestId, errors: formatted });
    return c.json(apiError("ইনপুট তথ্য সঠিক নয় (Validation Error)", "VALIDATION_ERROR", formatted), 422);
  }

  // Generic Uncaught Exception
  logger.error(`[UnhandledException] ${err.message}`, {
    requestId,
    stack: err.stack,
  });

  return c.json(
    apiError("সার্ভারে সমস্যা হয়েছে, কিছুক্ষণ পর পুনরায় চেষ্টা করুন।", "INTERNAL_SERVER_ERROR"),
    500
  );
};
