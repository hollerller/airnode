import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviceDto } from './create-device.dto';

export class UpdateDeviceStatusDto {
  batteryMv: number;
  isOnline: boolean;
}

export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {}
