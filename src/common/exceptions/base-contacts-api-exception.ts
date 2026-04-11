import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseContactsApiException extends HttpException {
  constructor(
    message: string = 'BaseContactsApiException error',
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message, statusCode);
  }
}
