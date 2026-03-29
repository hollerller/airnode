import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return { service: 'AirNode API', status: 'online', version: '0.1.0' };
  }
}
