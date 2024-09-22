import { Controller, Get } from '@nestjs/common';

@Controller('healthcheck')
export class HealthcheckController {
  @Get()
  healthCheck() {
    return {
      status: 'UP',
      date: new Date().toISOString(),
    };
  }
}
