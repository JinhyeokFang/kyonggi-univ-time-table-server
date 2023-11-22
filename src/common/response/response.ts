import { Exception, ExceptionCode } from './exception';

export type ResponseBody = SuccessResponseBody | FailedResponseBody;

interface SuccessResponseBody {
  success: true;
  data: Record<string, unknown> | null;
}

interface FailedResponseBody {
  success: false;
  error: {
    message: string;
    code: ExceptionCode;
  };
}

export const SuccessResponse = (
  data: Record<string, unknown> | null,
): SuccessResponseBody => ({
  success: true,
  data,
});

export const FailedResponse = (exception: Exception): FailedResponseBody => ({
  success: false,
  error: {
    message: exception.message,
    code: exception.code,
  },
});
