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
import { ArimService } from './arim.service';
import { Request, Response } from 'express';
import { ConfigService } from '../config/config.service';
import {
  ApiBody,
  ApiHeader,
  ApiPayloadTooLargeResponse,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('ARIM')
export class ArimController {
  private ruta: string;
  constructor(
    private readonly ArimService: ArimService,
    private readonly ConfigService: ConfigService,
    private readonly httpService: HttpService,
  ) {}





  @ApiHeader({
    name: 'token',
    description: 'token de usuario'
  })  
  @Get()
  @ApiResponse({ status: 404, description: 'Arim not found.'})    
  @ApiResponse({ status: 200, 
  schema: {
  type: 'object',
  properties: {
      statusCode: { type: 'number', example: 200 },
      description:  { type: 'string', example: 'Service Load successfully found' },
      ARIM: {
          type: 'array',
          items: {
          type: 'object',
          properties: {
              Key: { type: 'string', example: '123123' },
              Record:{
                  type: 'object',
                  properties: {
                    ID: { type: 'string', example: '199124' },
                    ARIM: { type: 'string', example: '19111' },
                    placaVIN: { type: 'string', example: 'FJM288' },
                    cargoDescription: { type: 'string', example: 'Levantamiento' },
                    cargoLocation: { type: 'string', example: 'Test' },
                    driver: { type: 'string', example: '14155151' },
                    transportationCompany: { type: 'string', example: '199124' },
                    dateIssue: { type: 'string', example: '2022-02-02' },
                    typeOperation: { type: 'string', example: 'Carga' },
                    originDestiny: { type: 'string', example: 'Puerto' },
                    BL_IE: { type: 'string', example: '' },
                    Client: { type: 'string', example: '199124' },
                    CustomsAgency: { type: 'string', example: 'DHL' },
                    payrollReceiver: { type: 'string', example: 'test' },
                    portOperator: { type: 'string', example: 'Test' },
                  }
              }                    
          }
          }
      },
      
  },
  }})   
  async getAllArim(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['token'];
      if (!token)
        res.status(403).json({ statusCode: 403, description: 'missing token' });
      const validateToken = await this.ConfigService.validateToken(
        token.toString(),
      );
      console.log('token', validateToken);
      if (validateToken == 'Successfully Verified') {
        const config = new ConfigService();
        const { wallet, ccp } = await config.ConfigNetwork();
        const resArim = await this.ArimService.getAll(wallet, ccp);
        return resArim.length === 0
          ? res
              .status(404)
              .json({ statusCode: 404, description: 'ARIM not found' })
          : res.status(200).json({
              statusCode: 200,
              description: 'ARIM successfully found',
              ARIM: resArim,
            });
      } else {
        return res
          .status(403)
          .json({ statusCode: 403, description: validateToken });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ statusCode: 500, description: 'Internal server error' });
    }
  }
 
  
  @Get('/:id')
  async getArimById(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['token'];
      if (!token)
        res.status(403).json({ statusCode: 403, description: 'missing token' });
      const validateToken = await this.ConfigService.validateToken(
        token.toString(),
      );
      if (validateToken == 'Successfully Verified') {
        const config = new ConfigService();
        const { wallet, ccp } = await config.ConfigNetwork();
        const { id } = req.params;
        const resArim = await this.ArimService.getArimId(wallet, ccp, id);
        return resArim
          ? res.status(200).json({
              statusCode: 200,
              description: 'ARIM successfully found',
              ARIM: resArim,
            })
          : res.status(404).json({
              statusCode: 200,
              description: 'ARIM not found',
            });
      } else {
        return res
          .status(403)
          .json({ statusCode: 403, description: validateToken });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ statusCode: 500, description: 'Internal server error' });
    }
  }



  @ApiHeader({
    name: 'token',
    description: 'token de usuario'
  })  
  
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ID: { type: 'string', example: '199124' },
        ARIM: { type: 'string', example: '19111' },
        placaVIN: { type: 'string', example: 'FJM288' },
        cargoDescription: { type: 'string', example: 'Levantamiento' },
        cargoLocation: { type: 'string', example: 'Test' },
        driver: { type: 'string', example: '14155151' },
        transportationCompany: { type: 'string', example: '199124' },
        dateIssue: { type: 'string', example: '2022-02-02' },
        typeOperation: { type: 'string', example: 'Carga' },
        originDestiny: { type: 'string', example: 'Puerto' },
        BL_IE: { type: 'string', example: '' },
        Client: { type: 'string', example: '199124' },
        CustomsAgency: { type: 'string', example: 'DHL' },
        payrollReceiver: { type: 'string', example: 'test' },
        portOperator: { type: 'string', example: 'Test' },
        
      },
    },
  })   
  @Post()
  async createArim(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['token'];
      if (!token)
        res.status(403).json({ statusCode: 403, description: 'missing token' });
      const validateToken = await this.ConfigService.validateToken(
        token.toString(),
      );
      if (validateToken == 'Successfully Verified') {
        const config = new ConfigService();
        const { wallet, ccp } = await config.ConfigNetwork();
        const result = await this.ArimService.createArim(wallet, ccp, req);
        return result
          ? res.status(200).json({
              statusCode: 200,
              description: 'Arim create successfully',
            })
          : res.status(500).json({
              statusCode: 500,
              description: 'All fields are required',
            });
      } else {
        return res
          .status(403)
          .json({ statusCode: 403, description: validateToken });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ statusCode: 500, description: 'Internal server error' });
    }
  }
}
