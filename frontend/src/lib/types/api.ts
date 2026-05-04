export type ApiResponse<TData> = {
  success: true;
  data: TData;
};

export type ApiListResponse<TData, TMeta> = {
  success: true;
  data: TData;
  meta: TMeta;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: Array<{ path?: string; message: string }>;
};
