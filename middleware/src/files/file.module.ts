import { Module, HttpModule, MiddlewareConsumer } from '@nestjs/common';
import { FileController } from './file.controller';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { FileService } from './file.service';

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
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
