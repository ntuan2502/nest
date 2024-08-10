import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as XLSX from 'xlsx';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
interface CountryRow {
  Country: string;
  'Phone Code': string;
}

@Injectable()
export class CountryService {
  constructor(private prisma: PrismaService) {}

  async addCountriesFromExcel(file: Express.Multer.File) {
    // Đọc dữ liệu từ file Excel
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });

    if (!workbook.SheetNames.length) {
      throw new BadRequestException('File Excel không chứa sheet nào.');
    }

    const sheetName = workbook.SheetNames[0];
    const worksheet: CountryRow[] = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName],
    );

    if (!worksheet.length) {
      throw new BadRequestException('Sheet không chứa dữ liệu.');
    }

    for (const row of worksheet) {
      const { Country: name, 'Phone Code': phoneCode } = row;
      try {
        await this.prisma.country.create({
          data: { name, phoneCode },
        });
      } catch (error) {
        // Bỏ qua quốc gia đã tồn tại
        console.log(`Skipping ${name}, it already exists.`);
      }
    }
  }

  create(createCountryDto: CreateCountryDto) {
    return 'This action adds a new country';
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const countries = await this.prisma.country.findMany({
      skip: skip,
      take: limit,
    });

    const totalCountries = await this.prisma.country.count();
    const totalPages = Math.ceil(totalCountries / limit);

    return {
      data: countries,
      pagination: {
        totalCountries,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} country`;
  }

  update(id: number, updateCountryDto: UpdateCountryDto) {
    return `This action updates a #${id} country`;
  }

  remove(id: number) {
    return `This action removes a #${id} country`;
  }
}
