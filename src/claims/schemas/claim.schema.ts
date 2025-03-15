import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClaimDocument = Claim & Document;

@Schema()
export class Claim {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  claimAmount: number;

  @Prop()
  description: string;

  @Prop({ default: 'Pending' })
  status: 'Pending' | 'Approved' | 'Rejected';

  @Prop({ default: () => new Date() }) // Automatically sets submission date
  submissionDate: Date;

  @Prop()
  approvedAmount?: number;

  @Prop()
  insurerComments?: string;

  @Prop()
  documentUrl?: string; // Store file URL
}

export const ClaimSchema = SchemaFactory.createForClass(Claim);
