import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe} from '@nestjs/common';
import * as bodyparser from 'body-parser';
import fileUpload = require('express-fileupload');
import {ConfigService} from './config/config.service';
import * as socket from 'socket.io';
import setupSwagger from './swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
      
  setupSwagger(app);
  app.enableCors({
    origin: true,
        methods: ['POST', 'PUT', 'OPTIONS', 'DELETE', 'GET', 'PATCH'],
        allowedHeaders: [
          'Authorization',
          'Origin',
          'Access-Control-Allow-Origin',
          'X-Requested-With',
          'Content-Type',
          'Accept',
          'user-id',
          'x-request-public-key'
        ],
        credentials: false,
  });
  app.useGlobalPipes(new ValidationPipe());

  const config = new ConfigService();
  const port = config.get('APP_PORT') || 4000;
  app.use(bodyparser.json({limit: '50mb'}));
  app.use(bodyparser.urlencoded({extended: true, limit: '50mb'}));
  app.use((req, res, next) => {
    console.log(req.method.toUpperCase(), req.originalUrl);
    return next();
  });
  app.use(fileUpload(
    {
      useTempFiles : true,
      tempFileDir : '/tmp/'
  }
  ));
  const server = await app.listen(port, () => console.log(`Server started at http://localhost:${port}`));  
  const notifications = [];
  const io = socket(server);
  io.on('connection', socket =>{
    notifications.forEach(data =>{ socket.emit('NOTIFICATION', data)});
    socket.on('REMOVE_NOTIFICATION', data =>{
      const idOrder = data.id;
      const idProvider = data.providerId;
      const notificationIndex = notifications.findIndex(so => so.id === idOrder && so.providerId === idProvider);
      if(notificationIndex >= 0)
      {
        notifications.splice(notificationIndex, 1);
      }
      io.emit('NOTIFICATION_DELETE', data);
    });
    socket.on('SEND_NOTIFICATION', data => {notifications.push(data); io.emit('NOTIFICATION', data);});
  });
}
bootstrap();
