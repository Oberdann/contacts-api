import { Module } from '@nestjs/common';
import { ContactModule } from './modules/contacts/contacts.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL ?? ''),
    ContactModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
