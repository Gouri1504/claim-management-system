import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Claim, ClaimDocument } from './schemas/claim.schema';

@Injectable()
export class ClaimsService {
  constructor(
    @InjectModel(Claim.name) private claimModel: Model<ClaimDocument>,
  ) {}

  async create(claimData: Partial<Claim>): Promise<Claim> {
    const newClaim = new this.claimModel(claimData);
    return newClaim.save();
  }

  async findAll(): Promise<Claim[]> {
    return this.claimModel.find().exec();
  }

  async findByEmail(email: string): Promise<Claim[]> {
    return this.claimModel.find({ email }).exec(); // Fetch only claims for a specific patient
  }

  async findById(id: string): Promise<Claim> {
    const claim = await this.claimModel.findById(id).exec();
    if (!claim) {
      throw new NotFoundException(`Claim with id ${id} not found`);
    }
    return claim;
  }

  async update(id: string, updateData: Partial<Claim>): Promise<Claim> {
    const updatedClaim = await this.claimModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedClaim) {
      throw new NotFoundException(`Claim with id ${id} not found`);
    }
    return updatedClaim;
  }

  async delete(id: string): Promise<{ message: string }> {
    const deletedClaim = await this.claimModel.findByIdAndDelete(id).exec();
    if (!deletedClaim) {
      throw new NotFoundException(`Claim with id ${id} not found`);
    }
    return { message: 'Claim deleted successfully' };
  }
}
