import { Injectable } from '@nestjs/common';
import { CreateReadingDto } from './dto/create-reading.dto';
import { UpdateReadingDto } from './dto/update-reading.dto';
import { Reading } from './entities/reading.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReadingsService {
  constructor(
    @InjectRepository(Reading)
    private readingsRepository: Repository<Reading>,
  ) {}

  async create(createReadingDto: CreateReadingDto): Promise<Reading> {
    const newReading: Reading = {
      deviceId: createReadingDto.deviceId,
      timestamp: new Date(createReadingDto.timestamp * 1000),
      createdAt: new Date(),
      temperature_c: createReadingDto.temperature_c,
      humidity_pct: createReadingDto.humidity_pct,
      pressure_hpa: createReadingDto.pressure_hpa,
      pm1_0_ugm3: createReadingDto.pm1_0_ugm3,
      pm2_5_ugm3: createReadingDto.pm2_5_ugm3,
      pm10_ugm3: createReadingDto.pm10_ugm3,
    };

    return await this.readingsRepository.save(newReading);
  }

  findAll(): Promise<Reading[]> {
    return this.readingsRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} reading`;
  }

  update(id: number, updateReadingDto: UpdateReadingDto) {
    return `This action updates a #${id} reading`;
  }

  remove(id: number) {
    return `This action removes a #${id} reading`;
  }
}
