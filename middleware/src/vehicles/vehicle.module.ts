import { Module, HttpModule, MiddlewareConsumer } from '@nestjs/common';
import {  VehicleController } from './vehicle.controller';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import {  VehicleService } from './vehicle.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule
  ],
  providers: [VehicleService],
  controllers: [VehicleController],
  exports: [VehicleService]
})
export class VehicleModule 
{ 
}