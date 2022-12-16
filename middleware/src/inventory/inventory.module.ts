import { Module, HttpModule, MiddlewareConsumer } from '@nestjs/common';
import { DocumentController } from './inventory.controller';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { DocumentService } from './inventory.service';
import { Validations } from './validations';
import { ValidationsItem } from './validationsItem';

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
  providers: [DocumentService, Validations, ValidationsItem],
  controllers: [DocumentController],
  exports: [DocumentService],
})
export class DocumentModule {}
