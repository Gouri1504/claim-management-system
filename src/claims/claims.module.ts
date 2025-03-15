import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClaimsService } from './claims.service';
import { ClaimsController } from './claims.controller';
import { Claim, ClaimSchema } from './schemas/claim.schema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Claim.name, schema: ClaimSchema }]), // Register Claim model
    MulterModule.register({
      dest: './uploads', // Save files to 'uploads' directory
    }),
  ],
  controllers: [ClaimsController],
  providers: [ClaimsService],
  exports: [ClaimsService], // Export if needed in another module
})
export class ClaimsModule {}
