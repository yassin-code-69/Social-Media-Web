export interface ApiResponseSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiResponseError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

export const apiSuccess = <T>(data: T, meta?: Record<string, unknown>): ApiResponseSuccess<T> => {
  return {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  };
};

export const apiError = (message: string, code: string = "INTERNAL_ERROR", details?: unknown): ApiResponseError => {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  };
};
