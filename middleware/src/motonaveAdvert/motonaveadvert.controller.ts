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
} from '@nestjs/common';
import { MotonaveAdvertService } from './motonaveAdvert.service';
import { Request, Response } from 'express';
import {
  ApiBody,
  ApiHeader,
  ApiPayloadTooLargeResponse,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ConfigService } from 'src/config/config.service';

@Controller('motonaveAdvert')
export class motonaveAdvertController {
  [x: string]: any;
  private ruta: string;
  constructor(
    private readonly motonaveService: MotonaveAdvertService,
    private readonly httpService: HttpService,
  ) {
    //   this.ruta = '/home/datepe/Escritorio/blockchain/Puerto_bahia/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json'
    // this.ruta = '/home/david/puerto_bahia/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json';
  }

  @ApiHeader({
    name: 'token',
    description: 'token de usuario',
  })
  @Get()
  @ApiResponse({ status: 404, description: 'Motonave Advert not found.' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        description: {
          type: 'string',
          example: 'Service Load successfully found',
        },
        motonaveadvert: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              Key: { type: 'string', example: '123123' },
              Record: {
                type: 'object',
                properties: {
                  ID: { type: 'string', example: '1' },
                  serviceName: { type: 'string', example: 'Levantamiento' },
                  recalada: { type: 'string', example: 'RC199124' },
                  motonave: { type: 'string', example: '1991234' },
                  imo: { type: 'string', example: '' },
                  agency: { type: 'string', example: '' },
                  ETA: { type: 'string', example: '2022-01-01' },
                  ETD: { type: 'string', example: '2022-01-02' },
                  status: { type: 'string', example: 'Anulado' },
                },
              },
            },
          },
        },
      },
    },
  })
  async getAll(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['token'];
      if (!token)
        res.status(403).json({ statusCode: 403, description: 'missing token' });

      const config = new ConfigService();
      const validateToken = await config.validateToken(token.toString());

      if (validateToken == 'Successfully Verified') {
        const { wallet, ccp } = await config.ConfigNetwork();
        const resmotonave = await this.motonaveService.getAll(wallet, ccp);

        return resmotonave.length === 0
          ? res.status(404).json({
              statusCode: 404,
              description: 'Motonave not found',
            })
          : res.status(200).json({
              statusCode: 200,
              description: 'Motonave  successfully found',
              motonaveadvert: JSON.parse(resmotonave),
            });
      } else {
        return res
          .status(403)
          .json({ statusCode: 403, description: validateToken });
      }
    } catch (error) {
      return 'error';
    }
  }

  @ApiHeader({
    name: 'token',
    description: 'token de usuario',
  })
  @Get('filters')
  @ApiQuery({ name: 'dateFilterEnd', type: String, required: true })
  @ApiQuery({ name: 'dateFilterStart', type: String, required: true })
  async getFilters(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['token'];
      if (!token)
        res.status(403).json({ statusCode: 403, description: 'missing token' });

      const config = new ConfigService();
      const validateToken = await config.validateToken(token.toString());

      if (validateToken == 'Successfully Verified') {
        if (req.query.dateFilterStart == '' || req.query.dataFilterEnd == '')
          return res.status(403).json({
            statusCode: 403,
            description: 'fecha de filtro obligatorio',
          });

        const { wallet, ccp } = await config.ConfigNetwork();
        const resmotonave = await this.motonaveService.getAll(wallet, ccp);
        const resConvert = JSON.parse(resmotonave);
        const dateFilter = req.query.dateFilter;

        let motonavesfilter = [];
        for (const res of resConvert) {
          var entryDateObject = new Date(res.Record.ETD);
          var initialDateObject = new Date(
            JSON.stringify(req.query.dateFilterStart),
          );
          var finalDateObject = new Date(
            JSON.stringify(req.query.dataFilterEnd),
          );

          if (
            entryDateObject >= initialDateObject &&
            entryDateObject <= finalDateObject
          ) {
            motonavesfilter.push(res);
          }
        }

        if (motonavesfilter.length > 0) {
          res.status(404).json({
            statusCode: 200,
            description: 'Motonave  successfully found',
            motonaveadvert: motonavesfilter,
          });
        } else {
          res.status(404).json({
            statusCode: 404,
            description: 'Motonave not found',
          });
        }
        // return resmotonave.length === 0
        //   ? res.status(404).json({
        //       statusCode: 404,
        //       description: 'Motonave not found',
        //     })
        //   : res.status(200).json({
        //       statusCode: 200,
        //       description: 'Motonave  successfully found',
        //       motonaveadvert: resmotonave,
        //     });
        //   }
        //   else{
        //     return res
        //     .status(403)
        //     .json({ statusCode: 403, description: validateToken });
      }
    } catch (error) {
      return 'error';
    }
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        recalada: { type: 'string', example: 'RC199124' },
        motonave: { type: 'string', example: '1991234' },
        imo: { type: 'string', example: '' },
        agency: { type: 'string', example: '' },
        ETA: { type: 'string', example: '2022-01-01' },
        ETD: { type: 'string', example: '2022-01-02' },
        status: { type: 'string', example: 'Anulado' },
      },
    },
  })
  @ApiHeader({
    name: 'token',
    description: 'token de usuario',
  })
  @Post()
  @ApiResponse({
    status: 200,
    description: 'Motonave Advert  saved correctly.',
  })
  @ApiResponse({
    status: 404,
    description: 'Check that all fields are entered.',
  })
  async createMotonaveAdvert(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['token'];

      const config = new ConfigService();
      const validateToken = await config.validateToken(token.toString());

      if (validateToken == 'Successfully Verified') {
        const { wallet, ccp } = await config.ConfigNetwork();
        const resmotonave = await this.motonaveService.createMotonaveAdvert(
          wallet,
          ccp,
          req,
        );

        return res.status(200).json({
          statusCode: 200,
          description: 'Motonave Advert successfully',
          motonaveADvertID: resmotonave,
        });
      } else {
        return res
          .status(403)
          .json({ statusCode: 403, description: validateToken });
      }
    } catch (error) {
      return 'error';
    }
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        recalada: { type: 'string', example: 'RC199124' },
        motonave: { type: 'string', example: '1991234' },
        id: { type: 'string', example: '1' },
        imo: { type: 'string', example: '' },
        agency: { type: 'string', example: '' },
        ETA: { type: 'string', example: '2022-01-01' },
        ETD: { type: 'string', example: '2022-01-02' },
        status: { type: 'string', example: 'Anulado' },
      },
    },
  })
  @ApiHeader({
    name: 'token',
    description: 'token de usuario',
  })
  @Post('/UpdateMotonaveRecalada')
  @ApiResponse({ status: 200, description: 'Motonave Advert saved correctly.' })
  @ApiResponse({
    status: 404,
    description: 'Check that all fields are entered.',
  })
  async updateMotonaveAdvert(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['token'];
      const config = new ConfigService();
      const validateToken = await config.validateToken(token.toString());
      if (validateToken == 'Successfully Verified') {
        const { wallet, ccp } = await config.ConfigNetwork();
        const resmotonave = await this.motonaveService.updateMotonave(
          wallet,
          ccp,
          req,
        );

        return res.status(200).json({
          statusCode: 200,
          description: 'Motonave Advert successfully',
          motonaveADvertID: resmotonave,
        });
      } else {
        return res
          .status(403)
          .json({ statusCode: 403, description: validateToken });
      }
    } catch (error) {
      return 'error';
    }
  }
}
