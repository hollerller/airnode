import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import {
  UpdateDeviceDto,
  UpdateDeviceStatusDto,
} from './dto/update-device.dto';
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

  async update(
    id: string,
    user: any,
    updateDeviceDto: UpdateDeviceDto,
  ): Promise<UpdateDeviceDto> {
    const device = await this.devicesRepository.findOneBy({
      user: { id: user.id },
      deviceId: id,
    });

    if (!device) {
      throw new HttpException('Device does not exist', HttpStatus.NOT_FOUND);
    }

    const updatedDevice = {
      ...device,
      deviceName: updateDeviceDto.deviceName,
    };

    await this.devicesRepository.save(updatedDevice);

    return updatedDevice;
  }

  async updateStatus(
    deviceToken: string,
    updateDeviceStatusDto: UpdateDeviceStatusDto,
  ) {
    const device = await this.devicesRepository.findOneBy({
      deviceToken: deviceToken,
    });

    if (!device) {
      throw new HttpException('Device does not exist', HttpStatus.NOT_FOUND);
    }

    const updatedDevice = {
      ...device,
      batteryMv: updateDeviceStatusDto.batteryMv,
      isOnline: updateDeviceStatusDto.isOnline,
      lastSeen: new Date(),
    };

    await this.devicesRepository.save(updatedDevice);

    return {
      success: true,
    };
  }

  async remove(id: string, user: any): Promise<string> {
    const device = await this.devicesRepository.findOneBy({
      user: { id: user.id },
      deviceId: id,
    });

    if (!device) {
      throw new HttpException('Device does not exist', HttpStatus.NOT_FOUND);
    }

    const name = device.deviceName;

    await this.devicesRepository.remove(device);

    return `This action removes a #${name} device`;
  }
}
