import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('healthcheck')
@Controller('healthcheck')
export class HealthcheckController {
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['UP'],
        },
        date: { type: 'string' },
      },
    },
  })
  healthCheck() {
    return {
      status: 'UP',
      date: new Date().toISOString(),
    };
  }
}
