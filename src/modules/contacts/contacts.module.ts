import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from 'src/database/contacts.schema';
import { ContactsService } from './contacts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
  ],
  controllers: [ContactsController],
  providers: [
    {
      provide: 'IContactsService',
      useClass: ContactsService,
    },
  ],
  exports: [],
})
export class ContactModule {}
