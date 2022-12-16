import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { DocumentModule } from './inventory/inventory.module';
import { JwtTokenModule } from './jwtToken/jwtToken.module';
import { TrasnportModule } from './transport/transport.module';
import { CustomsAgencyModule } from './customsAgency/customsAgency.module';
import { VehicleModule } from './vehicles/vehicle.module';
import { DriverModule } from './drivers/driver.madule';
import { RequestOutputModule } from './requestoutput/requestOutput.module';
import { ArimModule } from './ARIM/arim.module';
import { RequestLoadModule } from './requestLoad/requestLoad.module';
import { FileModule } from './files/file.module';
import { MandatosModule } from './mandatos/mandatos.module';
import { MotonaveAdvertModule } from './motonaveAdvert/motonaveadvert.module';
import { AuthorizationADModule } from './authorization/authorization.model';
import { ServicesLoadModule } from './servicesLoad/servicesLoad.module';
@Module({
  imports: [
    JwtTokenModule,
    ArimModule,
    AuthorizationADModule,
    CustomsAgencyModule,
    ConfigModule,
    ConfigService,
    DriverModule,
    FileModule,
    DocumentModule,
    MandatosModule,
    MotonaveAdvertModule,
    RequestLoadModule,
    RequestOutputModule,
    ServicesLoadModule,
    TrasnportModule,
    VehicleModule,
   
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
