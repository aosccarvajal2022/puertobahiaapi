import { Module, HttpModule, MiddlewareConsumer } from '@nestjs/common';
import { RequestLoadController } from './requestLoad.controller';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { RequestLoadService } from './requestLoad.service';

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
    ConfigModule,
  ],
  providers: [RequestLoadService],
  controllers: [RequestLoadController],
  exports: [RequestLoadService],
})
export class RequestLoadModule {}
