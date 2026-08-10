import { CreateDeviceSettingsDto } from './create-device-settings.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateDeviceSettingsDto extends PartialType(
  CreateDeviceSettingsDto,
) {}
