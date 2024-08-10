import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from 'src/prisma/prisma.service';
import * as multer from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn kích thước file (10MB)
    }),
  ],
  controllers: [CountryController],
  providers: [CountryService, PrismaService],
})
export class CountryModule {}
