export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly code: string = "INTERNAL_SERVER_ERROR",
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "অনুরোধটি সঠিক নয় (Bad Request)", details?: unknown) {
    super(message, 400, "BAD_REQUEST", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "অনুগ্রহ করে লগইন করুন (Unauthorized)") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "আপনার এই কাজটি করার অনুমতি নেই (Forbidden)") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "কাঙ্ক্ষিত তথ্যটি খুঁজে পাওয়া যায়নি (Not Found)") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "তথ্যটি ইতোমধ্যে বিদ্যমান (Conflict)") {
    super(message, 409, "CONFLICT");
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message: string = "তথ্য প্রক্রিয়া করা সম্ভব হয়নি", details?: unknown) {
    super(message, 422, "UNPROCESSABLE_ENTITY", details);
  }
}
