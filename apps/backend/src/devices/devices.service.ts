import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private devicesRepository: Repository<Device>,
  ) {}

  async create(createDeviceDto: CreateDeviceDto, user: any): Promise<Device> {
    const buf = crypto.randomBytes(16).toString('hex');

    const newDevice = this.devicesRepository.create({
      deviceId: createDeviceDto.deviceId,
      deviceName: createDeviceDto.deviceName,
      firmwareVersion: createDeviceDto.firmwareVersion,
      batteryMv: 0,
      isOnline: false,
      user: { id: user.id },
      deviceToken: buf,
    });

    await this.devicesRepository.save(newDevice);

    return newDevice;
  }

  async findAll(user: any): Promise<UpdateDeviceDto[]> {
    const devices = await this.devicesRepository.find({
      where: {
        user: { id: user.id },
      },
    });

    const filteredDevices = devices.map(({ deviceToken, ...rest }) => rest);

    return filteredDevices;
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
