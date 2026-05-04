export function extractMessage(err: unknown): string {
  if (err && typeof err === 'object') {
    const axiosErr = err as {
      response?: { data?: { message?: string; errors?: Array<{ message: string }> } };
      message?: string;
    };
    if (axiosErr.response?.data) {
      const { message, errors } = axiosErr.response.data;
      if (errors?.length) return errors.map((e) => e.message).join(', ');
      if (message) return message;
    }
    if (typeof axiosErr.message === 'string') return axiosErr.message;
  }
  return 'An unexpected error occurred. Please try again.';
}
