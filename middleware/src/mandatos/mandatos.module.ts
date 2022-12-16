import { Module, HttpModule, MiddlewareConsumer } from '@nestjs/common';
import {  mandatosController } from './mandatos.controller';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import {  MandatoService } from './mandatos.service';

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
  providers: [MandatoService],
  controllers: [mandatosController],
  exports: [MandatoService]
})
export class MandatosModule 
{ 
}