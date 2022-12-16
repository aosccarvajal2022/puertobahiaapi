import { Module, HttpModule, MiddlewareConsumer } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationADService } from './authorization.service';
import { Validations } from './validations';

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
  providers: [AuthorizationADService, Validations],
  controllers: [AuthorizationController],
  exports: [AuthorizationADService],
})
export class AuthorizationADModule {}
