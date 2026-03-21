import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';

@Injectable()
export class DevicesService {
  private tempDevices: Device[] = [
    {
      deviceId: 'airnode_00001',
      deviceName: 'home',
      firmwareVersion: '1.0.3',
      batteryMv: 3100,
      isOnline: true,
      createdAt: new Date(2026, 3, 14, 10, 30, 0),
      lastSeen: new Date(2025, 3, 21, 10, 24, 0),
    },
  ];

  create(createDeviceDto: CreateDeviceDto): Device {
    const newDevice: Device = {
      deviceId: createDeviceDto.deviceId,
      deviceName: createDeviceDto.deviceName,
      firmwareVersion: createDeviceDto.firmwareVersion,
      batteryMv: 0,
      isOnline: false,
      createdAt: new Date(),
      lastSeen: new Date(),
    };

    this.tempDevices.push(newDevice);

    return newDevice;
  }

  findAll(): Device[] {
    return this.tempDevices;
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
