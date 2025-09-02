import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import {
  ApiHealthTags,
  ApiHealthCheck,
  ApiReadinessProbe,
  ApiLivenessProbe,
  ApiEmailServiceInfo,
} from './decorators/swagger.decorators';

@ApiHealthTags()
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiHealthCheck()
  async check() {
    return this.healthService.check();
  }

  @Get('ready')
  @ApiReadinessProbe()
  async ready() {
    return this.healthService.ready();
  }

  @Get('live')
  @ApiLivenessProbe()
  async live() {
    return this.healthService.live();
  }

  @Get('email-service')
  @ApiEmailServiceInfo()
  async emailServiceInfo() {
    return this.healthService.getEmailServiceInfo();
  }
}