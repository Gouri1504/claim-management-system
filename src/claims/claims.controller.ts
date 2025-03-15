import { Controller, Post, Get, Param, Body, Put, UseGuards, Request, UseInterceptors, UploadedFile, Res, NotFoundException } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { Claim } from './schemas/claim.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { join } from 'path';
import { Response } from 'express';


@Controller('claims')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post()
  @Roles('patient')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Save files locally
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
    }),
  )
  async createClaim(
    @Request() req,
    @Body() claimData: Partial<Claim>,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Claim> {
    if (!req.user || !req.user.email) {
      throw new NotFoundException('User email is required');
    }

    claimData.email = req.user.email; // Set the user's email
    if (file) {
      claimData.documentUrl = `/claims/file/${file.filename}`; // Save file URL
    }

    // Create the claim and return it
    return this.claimsService.create(claimData);
  }

  @Get()
  async getAllClaims(@Request() req): Promise<Claim[]> {
    if (req.user.role === 'insurer') {
      return this.claimsService.findAll();
    }
    return this.claimsService.findByEmail(req.user.email);
  }

  @Put(':id')
  @Roles('insurer')
  updateClaim(
    @Param('id') id: string,
    @Body() updateData: Partial<Claim>,
  ): Promise<Claim> {
    return this.claimsService.update(id, updateData);
  }

  // Serve uploaded files
  @Get('file/:filename')
  @Roles('insurer', 'patient') // Both roles can view files
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'uploads', filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    return res.sendFile(filePath);
  }
}
