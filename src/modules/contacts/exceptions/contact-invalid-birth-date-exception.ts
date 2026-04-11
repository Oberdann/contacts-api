import { BaseContactsApiException } from 'src/common/exceptions/base-contacts-api-exception';

export class ContactInvalidBirthDateException extends BaseContactsApiException {
  constructor(message: string, code: number = 422) {
    super(message, code);
  }
}
