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
import { AuthorizationADService } from './authorization.service';
import { Request, Response } from 'express';

import { Validations } from './validations';
import { ConfigService } from '../config/config.service';
import { ApiBody, ApiHeader, ApiConsumes } from '@nestjs/swagger';

@Controller('authorization')
export class AuthorizationController {
  private ruta: string;
  constructor(
    private readonly authorizationService: AuthorizationADService,
    private readonly Validations: Validations,
    private readonly httpService: HttpService,
    private readonly ConfigService: ConfigService,
  ) {}

  @ApiHeader({
    name: 'token',
    description: 'token de usuario',
  })
  @Get()
  async getAll(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['token'];
      if (!token)
        return res
          .status(403)
          .json({ statusCode: 403, description: 'token is missing' });
      const validateToken = await this.ConfigService.validateToken(
        token.toString(),
      );
      if (validateToken == 'Successfully Verified') {
        const config = new ConfigService();
        const { wallet, ccp } = await config.ConfigNetwork();
        const resultInv = await this.authorizationService.getAll(wallet, ccp);
        return JSON.parse(resultInv).length === 0
          ? res.status(404).json({
              statusCode: 404,
              description: 'Authorizations not found',
            })
          : res.status(200).json({
              StatusCode: 200,
              Description: 'Authorizations successfully found',
              Requests: JSON.parse(resultInv),
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

  @ApiHeader({
    name: 'token',
    description: 'token de usuario',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nitCustomAgency: { type: 'string', example: 'MORNING CHORUS3' },
        nitCustomer: { type: 'string', example: 'MORNING CHORUS3' },
        nitOfficial: { type: 'string', example: 'MORNING CHORUS3' },
        official: { type: 'string', example: 'MORNING CHORUS3' },
        nitTransportCompany: { type: 'string', example: 'MORNING CHORUS3' },
        noAuthorizationAD: { type: 'string', example: 'MORNING CHORUS3' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              NIUC: { type: 'string', example: 'shipment' },
              VINReference: { type: 'string', example: 'MORNING CHORUS3' },
              lineItem: { type: 'string', example: 'MORNING CHORUS3' },
              authorizedQuantity: {
                type: 'string',
                example: 'MORNING CHORUS3',
              },
              description: { type: 'string', example: 'MORNING CHORUS3' },
              codeIMO: { type: 'string', example: 'MORNING CHORUS3' },
              codeUM: { type: 'string', example: 'MORNING CHORUS3' },
            },
          },
        },
      },
    },
  })
  @Post()
  async createAuthorizationAD(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['token'];
      if (!token)
        return res
          .status(403)
          .json({ statusCode: 403, description: 'token is missing' });
      const validateToken = await this.ConfigService.validateToken(
        token.toString(),
      );
      if (validateToken == 'Successfully Verified') {
        const valid = await this.Validations.validate(req.body);
        if (!valid.status)
          return res
            .status(403)
            .json({ statusCode: 403, description: valid.errors });
        const config = new ConfigService();
        const { wallet, ccp } = await config.ConfigNetwork();

        const isValid = await this.authorizationService.validateInventory(
          wallet,
          ccp,
          req.body,
        );
        if (isValid.code == 200) {
          const result = await this.authorizationService.createAuthorization(
            wallet,
            ccp,
            req,
          );
          const response =
            result.code == 200
              ? res.status(200).json({
                  statusCode: 200,
                  description: 'Authorization create successfully',
                  Id: result.random,
                })
              : res.status(500).json({
                  statusCode: 500,
                  description: 'Failed to create authorization',
                  error: result.result,
                });

          return response;
        } else {
          return res.status(isValid.code).json({
            statusCode: isValid.code,
            description: isValid.description,
            item: isValid.item,
          });
        }
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

  @ApiHeader({
    name: 'token',
    description: 'token de usuario',
  })
  @Post('file')
  async uploadFilesAuthorization(@Req() req: any, @Res() res: Response) {
    try {
      if (!req.headers['token'])
        return res.status(403).json({
          statusCode: 403,
          description: 'The access token is missing',
        });
      const token = req.headers['token'];
      const validateToken = await this.ConfigService.validateToken(
        token.toString(),
      );
      if (validateToken == 'Successfully Verified') {
        const config = new ConfigService();
        const { wallet, ccp } = await config.ConfigNetwork();
        if (!req.files || !req.files.files)
          return res.status(403).json({
            statusCode: 403,
            description: 'File is missing',
          });
        if (!req.query.id)
          return res.status(403).json({
            statusCode: 403,
            description: 'Id is missing',
          });
        const files = req.files.files;
        const result = await this.authorizationService.uploadFilesAuthorization(
          wallet,
          ccp,
          req.query.id,
          files,
        );
        const response =
          result.code == 200
            ? res
                .status(200)
                .json({ statusCode: 200, description: result.description })
            : res.status(result.code).json({
                statusCode: result.code,
                description: result.description,
              });

        return response;
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
}
