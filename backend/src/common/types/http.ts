export type SuccessResponse<TData, TMeta = undefined> = TMeta extends undefined
  ? {
      success: true;
      data: TData;
    }
  : {
      success: true;
      data: TData;
      meta: TMeta;
    };

export type ErrorResponse = {
  success: false;
  message: string;
  errors?: unknown[];
};

