import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class ExceptionGlobalFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();

      const response = exception.getResponse() as
        | { message?: string | string[] }
        | string;

      const message =
        typeof response === 'string'
          ? response
          : response?.message || 'Erro inesperado';

      return res.status(status).json({ message, data: [], success: false });
    }

    return res
      .status(500)
      .json({ message: 'Erro interno do servidor', data: [], success: false });
  }
}
