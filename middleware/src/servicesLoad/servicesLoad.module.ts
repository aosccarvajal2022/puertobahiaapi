import { Module, HttpModule, MiddlewareConsumer } from '@nestjs/common';
import { serviceLoadController } from './servicesLoad.controller';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { serviceLoadService } from './servicesLoad.service';

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
  providers: [serviceLoadService],
  controllers: [serviceLoadController],
  exports: [serviceLoadService]
})
export class ServicesLoadModule 
{ 
}