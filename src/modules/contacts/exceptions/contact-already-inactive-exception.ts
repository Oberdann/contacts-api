import { BaseContactsApiException } from 'src/common/exceptions/base-contacts-api-exception';

export class ContactAlreadyInactiveException extends BaseContactsApiException {
  constructor(message: string, code: number = 409) {
    super(message, code);
  }
}
