import { Module, HttpModule, MiddlewareConsumer } from '@nestjs/common';
import { ArimController } from './arim.controller';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { ArimService } from './arim.service';

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
  providers: [ArimService],
  controllers: [ArimController],
  exports: [ArimService]
})
export class ArimModule 
{ 
}