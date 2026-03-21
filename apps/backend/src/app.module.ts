import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevicesModule } from './devices/devices.module';
import { ReadingsModule } from './readings/readings.module';

@Module({
  imports: [DevicesModule, ReadingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
