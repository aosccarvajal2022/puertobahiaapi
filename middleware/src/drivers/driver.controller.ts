import {
  Controller,
  HttpService,
  Get,
  Param,
  Post,
  Body,
  Req,
  Put,
  Res,
  ConsoleLogger,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { Request, Response } from 'express';
import { ConfigService } from '../config/config.service';
import {
  ApiBody,
  ApiHeader,
  ApiPayloadTooLargeResponse,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('drivers')
export class DriverController {
  private ruta: string;
  constructor(
    private readonly DriverService: DriverService,
    private readonly ConfigService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  @ApiHeader({
    name: 'token',
    description: 'token de usuario',
  })
  @Get()
  @ApiResponse({ status: 404, description: 'Drivers not found.' })
  async getAll(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['token'];
      const validateToken = await this.ConfigService.validateToken(
        token.toString(),
      );
      if (validateToken == 'Successfully Verified') {
        const config = new ConfigService();
        const { wallet, ccp } = await config.ConfigNetwork();
        const resDocument = await this.DriverService.getAll(wallet, ccp);
        return resDocument.length === 0
          ? res.status(404).json({
              statusCode: 404,
              description: 'Drivers not found',
            })
          : res.status(200).json({
              statusCode: 200,
              description: 'Drivers successfully found',
              Drivers: resDocument,
            });
      } else {
        return res
          .status(403)
          .json({ statusCode: 403, description: validateToken });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ statusCode: 500, description: 'Internal server error' });
    }
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'MORNING CHORUS3' },
        ID_type: { type: 'string', example: 'MORNING CHORUS3' },
        first_name: { type: 'string', example: 'MORNING CHORUS3' },
        second_name: { type: 'string', example: 'MORNING CHORUS3' },
        surname: { type: 'string', example: 'MORNING CHORUS3' },
        second_surname: { type: 'string', example: 'MORNING CHORUS3' },
        ID_transport: {type: 'string', example: '1'}
      },
    },
  })
  @ApiHeader({
    name: 'token',
    description: 'token de usuario',
  })
  @Post()
  @ApiResponse({ status: 200, description: 'Driver saved correctly.' })
  @ApiResponse({
    status: 404,
    description: 'Check that all fields are entered.',
  })
  async createDriver(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['token'];
      const validateToken = await this.ConfigService.validateToken(
        token.toString(),
      );
      if (validateToken == 'Successfully Verified') {
        const config = new ConfigService();
        const { wallet, ccp } = await config.ConfigNetwork();
        await this.DriverService.createDriver(wallet, ccp, req);
         return res
          .status(200)
          .json({ statusCode: 200, description: 'Driver create successfully' });
      } else {
        return res
          .status(403)
          .json({ statusCode: 403, description: validateToken });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ statusCode: 500, description: 'Internal server error' });
    }
  }

  @Get('filter')
  async driverFilters(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.headers['token'])
        return res
          .status(404)
          .json({ statusCode: 404, description: 'token is missing' });

      const token = req.headers['token'];
      const validateToken = await this.ConfigService.validateToken(
        token.toString(),
      );
      if (validateToken == 'Successfully Verified') {
        const config = new ConfigService();

        const { wallet, ccp } = await config.ConfigNetwork();
        const resDrivers = await this.DriverService.getAll(wallet, ccp);
        const resConvert = JSON.parse(resDrivers);
        const auxArr = [];
        if (!req.query || !req.query.idCarrier)
          return res
            .status(404)
            .json({ statusCode: 404, description: 'id carrier not found' });

        for (const document of resConvert) {
          if (document.Record.ID_transport == req.query.idCarrier)
            auxArr.push(document);
        }
        if (auxArr.length > 0) {
          return res
            .status(200)
            .json({
              statusCode: 200,
              description: 'Drivers found',
              Drivers: auxArr,
            });
        } else {
          return res
            .status(404)
            .json({ statusCode: 404, description: 'Drivers not found' });
        }
      } else {
        return res
          .status(403)
          .json({ statusCode: 403, description: validateToken });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ statusCode: 500, description: 'Internal server error' });
    }
  }
}
