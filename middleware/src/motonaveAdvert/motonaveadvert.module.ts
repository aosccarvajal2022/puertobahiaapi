import { Module, HttpModule, MiddlewareConsumer } from '@nestjs/common';
import { motonaveAdvertController } from './motonaveadvert.controller';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { MotonaveAdvertService } from './motonaveAdvert.service';

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
  providers: [MotonaveAdvertService],
  controllers: [motonaveAdvertController],
  exports: [MotonaveAdvertService],
})
export class MotonaveAdvertModule {}
