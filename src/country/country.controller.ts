import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpException,
  Query,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import * as fs from 'fs';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    await this.countryService.addCountriesFromExcel(file);

    return { message: 'Upload successful' };
  }

  @Post()
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countryService.create(createCountryDto);
  }

  @Get()
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    return this.countryService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.countryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countryService.update(+id, updateCountryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.countryService.remove(+id);
  }
}
