import { Module, HttpModule, MiddlewareConsumer } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { CustomsAgencyService } from './customsAgency.service';
import { CustomsAgencyController } from './customsAgency.controller';

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
  providers: [CustomsAgencyService],
  controllers: [CustomsAgencyController],
  exports: [CustomsAgencyService]
})
export class CustomsAgencyModule 
{ 
}