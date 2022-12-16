import {
  Controller,
  HttpService,
  Get,
  Param,
  Post,
  Body,
  Req,
  Res,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiPayloadTooLargeResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { MandatoService } from './mandatos.service';
import { Request, Response } from 'express';
import { ConfigService } from '../config/config.service';
import * as FabricCAServices from 'fabric-ca-client';
import { Wallets, X509Identity } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';

@Controller('mandatos')
export class mandatosController {
  private ruta: string;
  constructor(
    private readonly mandatoservice: MandatoService,
    private readonly httpService: HttpService,
    private readonly ConfigService: ConfigService,
  ) {
    //   this.ruta = '/home/datepe/Escritorio/blockchain/Puerto_bahia/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json'
    //  this.ruta = '/home/david/puerto_bahia/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json';
  }

  @ApiHeader({
    name: 'token',
    description: 'token de usuario',
  })
  @Get()
  @ApiResponse({ status: 404, description: 'Mandatos not found.' })
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
        mandatos: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              Key: { type: 'string', example: '123123' },
              Record: {
                type: 'object',
                properties: {
                  ID: { type: 'string', example: '1' },
                  type: { type: 'string', example: 'Levantamiento' },
                  authorizing_third: { type: 'string', example: 'RC199124' },
                  approver_third: { type: 'string', example: '1991234' },
                  from: { type: 'string', example: '2022-01-01' },
                  to: { type: 'string', example: '2022-01-10' },
                },
              },
            },
          },
        },
      },
    },
  })
  @Get()
  async getAll(@Req() req: Request, @Res() res: Response) {
    try {
      const config = new ConfigService();
      const { wallet, ccp } = await config.ConfigNetwork();
      const resMandato = await this.mandatoservice.getAll(wallet, ccp);
      const token = req.headers['token'];
      if (!token)
          res.status(403).json({ statusCode: 403, description: 'missing token' });

      const validateToken = await this.ConfigService.validateToken(
      token.toString(),
      );

      if (validateToken == 'Successfully Verified') {
      return resMandato.length === 0
        ? res
            .status(404)
            .json({
              statusCode: 404,
              description: 'Mandatos closure not found',
            })
        : res
            .status(200)
            .json({
              statusCode: 200,
              description: 'Mandatos closure successfully found',
              mandatos: resMandato,
            });
        }
        else
        {
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
        ID: { type: 'string', example: '1' },
        type: { type: 'string', example: 'Levantamiento' },
        authorizing_third: { type: 'string', example: 'RC199124' },
        approver_third: { type: 'string', example: '1991234' },
        from: { type: 'string', example: '2022-01-01' },
        to: { type: 'string', example: '2022-01-10' },
      },
    },
  })
  @ApiHeader({
    name: 'token',
    description: 'token de usuario',
  })
  @Post()
  @ApiResponse({ status: 200, description: 'Mandatos  saved correctly.' })
  @ApiResponse({
    status: 404,
    description: 'Check that all fields are entered.',
  })
  async createMandato(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['token'];
      const validateToken = await this.ConfigService.validateToken(
        token.toString(),
      );
      if (validateToken == 'Successfully Verified') {
        const config = new ConfigService();
        const { wallet, ccp } = await config.ConfigNetwork();
        await this.mandatoservice.createMandato(wallet, ccp, req);
        return res
          .status(200)
          .json({
            statusCode: 200,
            description: 'Mandatos create successfully',
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
        ID: { type: 'string', example: '1' },
        type: { type: 'string', example: 'Levantamiento' },
        authorizing_third: { type: 'string', example: 'RC199124' },
        approver_third: { type: 'string', example: '1991234' },
        from: { type: 'string', example: '2022-01-01' },
        to: { type: 'string', example: '2022-01-10' },
      },
    },
  })
  @ApiHeader({
    name: 'token',
    description: 'token de usuario',
  })
  @Post('/UpdateMandato')
  @ApiResponse({ status: 200, description: 'Mandatos  saved correctly.' })
  @ApiResponse({
    status: 404,
    description: 'Check that all fields are entered.',
  })
  async UpdateMandato(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['token'];
      const validateToken = await this.ConfigService.validateToken(
        token.toString(),
      );
      if (validateToken == 'Successfully Verified') {
        const config = new ConfigService();
        const { wallet, ccp } = await config.ConfigNetwork();
        return await this.mandatoservice.updateMandato(wallet, ccp, req);
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
