import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { User } from 'src/decorators/user.decorator';
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  create(@Body() createDeviceDto: CreateDeviceDto, @User() user: any) {
    return this.devicesService.create(createDeviceDto, user);
  }

  @Get()
  findAll(@User() user: any) {
    return this.devicesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.devicesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @User() user: any,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    return this.devicesService.update(id, user, updateDeviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: any) {
    return this.devicesService.remove(id, user);
  }
}
