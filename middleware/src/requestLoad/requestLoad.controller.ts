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
import { RequestLoadService } from './requestLoad.service';
import { query, Request, Response } from 'express';
import { ConfigService } from '../config/config.service';
import {
  ApiBody,
  ApiHeader,
  ApiPayloadTooLargeResponse,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('requestLoad')
export class RequestLoadController {
  private ruta: string;
  constructor(
    private readonly RequestLoadService: RequestLoadService,
    private readonly ConfigService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  @ApiHeader({
    name: 'token',
    description: 'token de usuario',
  })
  @Get()
  async getAll(@Req() req: Request, @Res() res: Response) {
    try {
      let documents = [];
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
        let resDocument = await this.RequestLoadService.getAll(wallet, ccp);
        const resDocumentJson = JSON.parse(resDocument);

        for (const document of resDocumentJson) {
          console.log(document.Record);
          if (document.Record.status == '') {
            documents.push(document);
          }
        }

        return resDocument.length === 0
          ? res.status(404).json({
              statusCode: 404,
              description: 'Request to load not found',
            })
          : res.status(200).json({
              statusCode: 200,
              description: 'Load request successfully found',
              requestLoad: documents,
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
    description: 'token de usuario',
  })
  @Get('filters')
  async getRequetLoad(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.headers['token'];
      if (!token)
        return res.status(403).json({
          statusCode: 403,
          description: 'access-token required',
        });
      const validateToken = await this.ConfigService.validateToken(
        token.toString(),
      );
      if (validateToken == 'Successfully Verified') {
        const config = new ConfigService();
        if (!req.query || !req.query.NIT)
          return res.status(403).json({
            statusCode: 403,
            description: 'nit de agencia de aduana obligatorio',
          });
        const { wallet, ccp } = await config.ConfigNetwork();
        let resDocument = await this.RequestLoadService.getAll(wallet, ccp);
        const resConvert = JSON.parse(resDocument);
        const nit = req.query.NIT;
        const externalFiling = req.query.externalFiling
          ? req.query.externalFiling
          : null;
        const customerId = req.query.customerId ? req.query.customerId : null;
        const applicantId = req.query.applicantId
          ? req.query.applicantId
          : null;
        const requestStartDate = req.query.requestStartDate
          ? req.query.requestStartDate
          : null;
        const requestEndDate = req.query.requestEndDate
          ? req.query.requestEndDate
          : null;
        let documents = [];
        let documentsFilter = [];
        if (
          (requestStartDate && !requestEndDate) ||
          (!requestStartDate && requestEndDate)
        ) {
          return res.status(403).json({
            statusCode: 403,
            description: 'Start and end date required',
          });
        }
        for (const document of resConvert) {
          if (document.Record.customsAgencyId == nit) documents.push(document);
        }
        if (documents.length > 0) {
          for (const item of documents) {
            const doc = item.Record;
            if (externalFiling && customerId && applicantId) {
              if (
                externalFiling == doc.externalFiling &&
                customerId == doc.customerId &&
                applicantId == doc.applicantId
              )
                documentsFilter.push(item);
            } else if (externalFiling && customerId && !applicantId) {
              if (
                externalFiling == doc.externalFiling &&
                customerId == doc.customerId
              )
                documentsFilter.push(item);
            } else if (externalFiling && !customerId && applicantId) {
              if (
                externalFiling == doc.externalFiling &&
                applicantId == doc.applicantId
              )
                documentsFilter.push(item);
            } else if (!externalFiling && customerId && applicantId) {
              if (
                customerId == doc.customerId &&
                applicantId == doc.applicantId
              )
                documentsFilter.push(item);
            } else if (externalFiling && !customerId && !applicantId) {
              if (externalFiling == doc.externalFiling)
                documentsFilter.push(item);
            } else if (!externalFiling && customerId && !applicantId) {
              if (customerId == doc.customerId) documentsFilter.push(item);
            } else if (!externalFiling && !customerId && applicantId) {
              if (applicantId == doc.applicantId) documentsFilter.push(item);
            } else if (requestStartDate && requestEndDate) {
              if (
                requestStartDate < doc.requestDate &&
                requestEndDate > doc.requestDate
              )
                documentsFilter.push(item);
            }
          }
          if (
            !externalFiling &&
            !customerId &&
            !applicantId &&
            !requestStartDate &&
            !requestEndDate
          ) {
            return res.status(200).json({
              statusCode: 200,
              description: 'Successful',
              documentClosure: documents,
            });
          } else if (documentsFilter.length == 0) {
            return res.status(403).json({
              statusCode: 403,
              description: 'Customs agency has no request to load',
            });
          } else {
            return res.status(200).json({
              statusCode: 200,
              description: 'Successful',
              documentClosure: documentsFilter,
            });
          }
        } else {
          return res.status(403).json({
            statusCode: 403,
            description: 'Unauthorized customs agency',
          });
        }
      } else {
        return res
          .status(403)
          .json({ statusCode: 403, description: validateToken });
      }
    } catch (err) {
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
        dateApplication: { type: 'string', example: 'MORNING CHORUS3' },
        suggestedDate: { type: 'string', example: 'MORNING CHORUS3' },
        email: { type: 'string', example: 'MORNING CHORUS3' },
        applicantId: { type: 'string', example: 'MORNING CHORUS3' },
        applicantName: { type: 'string', example: 'MORNING CHORUS3' },
        customerNIT: { type: 'string', example: 'MORNING CHORUS3' },
        agencyNIT: { type: 'string', example: 'MORNING CHORUS3' },
        remarks: { type: 'string', example: 'MORNING CHORUS3' },
        radicado: { type: 'string', example: 'MORNING CHORUS3' },
        requestNumber: { type: 'string', example: 'MORNING CHORUS3' },
        status: { type: 'string', example: 'MORNING CHORUS3' },
        people: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              identification: { type: 'string', example: 'shipment' },
              name: { type: 'string', example: 'MORNING CHORUS3' },
              company: { type: 'string', example: 'MORNING CHORUS3' },
            },
          },
        },
        services: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'shipment' },
              serviceName: { type: 'string', example: 'MORNING CHORUS3' },
              amountService: { type: 'string', example: 'MORNING CHORUS3' },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    NIUC: { type: 'string', example: 'shipment' },
                    lineItem: { type: 'string', example: 'MORNING CHORUS3' },
                    VINReferenceSerie: {
                      type: 'string',
                      example: 'MORNING CHORUS3',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @Post()
  async createRequestLoad(@Req() req: Request, @Res() res: Response) {
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
        const result = await this.RequestLoadService.createRequestLoad(
          wallet,
          ccp,
          req,
        );
        const response =
          result.code == 200
            ? res.status(200).json({
                statusCode: 200,
                description: 'upload request created successfully',
                Id: result.id,
              })
            : res.status(500).json({
                statusCode: 500,
                description: 'error creating upload request',
              });
        return response;
        /* let existInventory = false;
        let inventory = await this.RequestLoadService.getAllInventory(
          wallet,
          ccp,
        );
        inventory = JSON.parse(inventory);
        inventory.map((item) => {
          if (item.Record.NIUC == req.body.NIUC) {
            existInventory = true;
          }
        });
        if (existInventory) {
          await this.RequestLoadService.createRequestLoad(wallet, ccp, req);
          return res.status(200).json({
            statusCode: 200,
            description: 'Request to load successfully created',
          });
        } else {
          return res.status(404).json({
            statusCode: 404,
            description: 'NIUC Inventory not found',
          });
        }*/
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
  @Put()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        idRequestLoad: { type: 'string', example: '1234' },
        radicado: { type: 'string', example: 'rd19914' },
        numberequest: { type: 'string', example: '191124' },
        newStatus: { type: 'string', example: 'En progreso' },
      },
    },
  })
  async updatedStatusRequestLoad(@Req() req: Request, @Res() res: Response) {
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
        if (
          !req.body.newStatus ||
          !req.body.idRequestLoad ||
          !req.body.radicado ||
          !req.body.numberequest
        ) {
          return res.status(403).json({
            statusCode: 403,
            description: 'new status or id Request Load is missing',
          });
        } else {
          if (
            req.body.newStatus == 'Pendiente' ||
            req.body.newStatus == 'En progreso' ||
            req.body.newStatus == 'Finalizado' ||
            req.body.newStatus == 'En Revisíon' ||
            req.body.newStatus == 'Cancelado' ||
            req.body.newStatus == 'Rechazado'
          ) {
            const result =
              await this.RequestLoadService.updatedStatusRequestLoad(
                wallet,
                ccp,
                req.body.idRequestLoad,
                req.body.newStatus,
                req.body.radicado,
                req.body.numberequest,
              );
            if (result.err) {
              return res.status(404).json({
                statusCode: 404,
                description: result.err,
              });
            } else {
              return res.status(200).json({
                statusCode: 200,
                description: result.desc,
              });
            }
          } else {
            return res.status(404).json({
              statusCode: 404,
              description: 'state not allowed',
            });
          }
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
  async uploadFilesRequestLoad(@Req() req: any, @Res() res: Response) {
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
        const result = await this.RequestLoadService.uploadFilesRequestLoad(
          wallet,
          ccp,
          req.query.id,
          files,
        );
        return res
          .status(200)
          .json({ statusCode: 200, description: result.desc });
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
