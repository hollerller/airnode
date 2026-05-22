import { Injectable } from '@nestjs/common';
import { CreateReadingDto } from './dto/create-reading.dto';
import { UpdateReadingDto } from './dto/update-reading.dto';
import { Reading } from './entities/reading.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

@Injectable()
export class ReadingsService {
  constructor(
    @InjectRepository(Reading)
    private readingsRepository: Repository<Reading>,
  ) {}

  async create(createReadingDto: CreateReadingDto): Promise<Reading> {
    const newReading: Reading = {
      deviceId: createReadingDto.deviceId,
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

  async findDeviceReadings(
    deviceId: string,
    from: string,
    to: string,
    limit: number,
  ): Promise<Reading[]> {
    let deviceReadings: Reading[] = [];

    if (from) {
      deviceReadings = await this.readingsRepository.find({
        where: {
          deviceId: deviceId,
          createdAt: Between(new Date(from), new Date(to)),
        },
        ...(limit ? { take: limit } : {}),
      });
    } else {
      deviceReadings = await this.readingsRepository.find({
        where: {
          deviceId: deviceId,
        },
        ...(limit ? { take: limit } : {}),
      });
    }

    return deviceReadings;
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
