import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ClaimsModule } from './claims/claims.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://amanagrawal:admin@data.h8wem.mongodb.net/?retryWrites=true&w=majority&appName=data',
    ),
    ClaimsModule,
    AuthModule,
  ],
})
export class AppModule {}
