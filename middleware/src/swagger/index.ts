import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { SwaggerOptions } from './options';

import modules from '../swagger/modules';

const setupModule = function(
  app: INestApplication,
  options: SwaggerOptions,
  module: Function
) {
  const documentOptions = new DocumentBuilder()
    .setTitle(options.title)
    .setDescription(options.description)
    .setVersion(options.version)
    .addTag(options.tag)
    .build();

  const contentDocument = SwaggerModule.createDocument(app, documentOptions, {
    include: [module]
  });

  SwaggerModule.setup(`docs/${options.resourcePath}`, app, contentDocument);
};

function setupSwagger(app: INestApplication) {
  const documentOptions = new DocumentBuilder()
    .setTitle('Puerto Bahia')
    .setDescription('Api services')
    .setVersion('1.0')
    .addTag('SPPB')
    .build();

  const contentDocument = SwaggerModule.createDocument(app, documentOptions);

  SwaggerModule.setup(`docs`, app, contentDocument);

  //modules.forEach(m => setupModule(app, m.options, m.module));
}

export default setupSwagger;