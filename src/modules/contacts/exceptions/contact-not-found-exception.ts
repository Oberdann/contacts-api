import { BaseContactsApiException } from 'src/common/exceptions/base-contacts-api-exception';

export class ContactNotFoundException extends BaseContactsApiException {
  constructor(message: string, code: number = 404) {
    super(message, code);
  }
}
