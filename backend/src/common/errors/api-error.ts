export type ApiErrorDetail = {
  path?: string;
  message: string;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errors: ApiErrorDetail[] = []
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

