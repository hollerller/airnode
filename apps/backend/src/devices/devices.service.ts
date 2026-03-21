import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private devicesRepository: Repository<Device>,
  ) {}

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const newDevice: Device = {
      deviceId: createDeviceDto.deviceId,
      deviceName: createDeviceDto.deviceName,
      firmwareVersion: createDeviceDto.firmwareVersion,
      batteryMv: 0,
      isOnline: false,
      createdAt: new Date(),
      lastSeen: new Date(),
    };

    await this.devicesRepository.save(newDevice);

    return newDevice;
  }

  findAll(): Promise<Device[]> {
    return this.devicesRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} device`;
  }

  update(id: number, updateDeviceDto: UpdateDeviceDto) {
    return `This action updates a #${id} device`;
  }

  remove(id: number) {
    return `This action removes a #${id} device`;
  }
}
