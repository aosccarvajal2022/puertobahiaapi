import { Module, HttpModule, MiddlewareConsumer } from '@nestjs/common';
import { TransportController } from './transport.controller';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { TransportService } from './transport.service';

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
  providers: [TransportService],
  controllers: [TransportController],
  exports: [TransportService]
})
export class TrasnportModule 
{ 
}