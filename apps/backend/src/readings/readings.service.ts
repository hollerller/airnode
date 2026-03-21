import { Injectable } from '@nestjs/common';
import { CreateReadingDto } from './dto/create-reading.dto';
import { UpdateReadingDto } from './dto/update-reading.dto';
import { Reading } from './entities/reading.entity';

@Injectable()
export class ReadingsService {
  private tempReadings: Reading[] = [
    {
      deviceId: 'airnode_00001',
      timestamp: new Date(),
      createdAt: new Date(),
      temperature_c: 25.75,
      humidity_pct: 80.04,
      pressure_hpa: 84.2,
      pm1_0_ugm3: 10,
      pm2_5_ugm3: 12,
      pm10_ugm3: 12,
    },
  ];

  create(createReadingDto: CreateReadingDto): Reading {
    const newReading: Reading = {
      deviceId: createReadingDto.deviceId,
      timestamp: new Date(createReadingDto.timestamp),
      createdAt: new Date(),
      temperature_c: createReadingDto.temperature_c,
      humidity_pct: createReadingDto.humidity_pct,
      pressure_hpa: createReadingDto.pressure_hpa,
      pm1_0_ugm3: createReadingDto.pm1_0_ugm3,
      pm2_5_ugm3: createReadingDto.pm2_5_ugm3,
      pm10_ugm3: createReadingDto.pm10_ugm3,
    };

    this.tempReadings.push(newReading);

    return newReading;
  }

  findAll(): Reading[] {
    return this.tempReadings;
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
