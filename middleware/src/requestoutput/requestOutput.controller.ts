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
import { RequestOutputService } from './requestOutputservice.services';
import { Request, Response } from 'express';

import { Validations } from './validations';
import { ConfigService } from '../config/config.service';
import {
  ApiBody,
  ApiHeader,
  ApiPayloadTooLargeResponse,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('requestoutput')
export class RequestOutputController {
  private ruta: string;
  constructor(
    private readonly quoteService: RequestOutputService,
    private readonly Validations: Validations,
    private readonly httpService: HttpService,
    private readonly ConfigService: ConfigService,
  ) {}




  @ApiHeader({
    name: 'token',
    description: 'token de usuario'
})  
@Get()
@ApiResponse({ status: 404, description: 'Quotes not found.'})    
@ApiResponse({ status: 200, 
    schema: {
    type: 'object',
    properties: {
      statusCode: { type: 'number', example: 200 },
      description:  { type: 'string', example: 'request output successfully found' },
      quotes: {
         type: 'array',
         items: {
            type: 'object',
            properties: {
                Key: { type: 'string', example: '121251554' },
                Record:{
                    type: 'object',
                    properties: {
                      nitCustomAgency: { type: 'string', example: '121251554' },
                      nitCustomer: { type: 'string', example: 'DHL' },
                      nitOfficial: { type: 'string', example: '234444234' },
                      official: { type: 'string', example: 'Jose' },
                      nitOfficialAuthorized: { type: 'string', example: 'Ingreso' },
                      officialAuthorized: { type: 'string', example: 'das233' },
                      modalityOperation: { type: 'string', example: 'test' },
                      nitTransportCompany: { type: 'string', example: '15515-6' },
                      typeOperation: { type: 'string', example: '121251554' },
                      replyEmail: { type: 'string', example: 'test' },
                      observation: { type: 'string', example: '' },
                      radicado: { type: 'string', example: '' },
                      requestNumber: { type: 'string', example: '' },
                      drivers: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            placaCabezote: { type: 'string', example: 'shipment' },
                            placaRemolque: { type: 'string', example: 'MORNING CHORUS3' },
                            codigoEjes: { type: 'string', example: 'MORNING CHORUS3' },

                            driverId: { type: 'string', example: 'shipment' },
                            destination: { type: 'string', example: 'MORNING CHORUS3' },
                            suggestedDate: { type: 'string', example: 'MORNING CHORUS3' },
                            suggestedTime: { type: 'string', example: 'shipment' },
                            cargoManifest: { type: 'string', example: 'MORNING CHORUS3' },
                            cycle: { type: 'string', example: 'MORNING CHORUS3' },
                            itemsToRemove: {  
                              type: 'array', 
                              items: {
                                type: 'object',
                                properties: {
                                  NIUC: { type: 'string', example: 'shipment' },
                                  VINReference: { type: 'string', example: 'MORNING CHORUS3' },
                                  lineItem: { type: 'string', example: 'MORNING CHORUS3' },
                                  quantity: { type: 'string', example: 'shipment' },
                                }

                              } },
                            
                          },
                        }
                      }
                     
                  
                    }
                }                    
            }
         }
      },
      
    },
  }})    
  

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
        const resultInv = await this.quoteService.getAll(wallet, ccp);
        return resultInv.length === 0
          ? res
              .status(404)
              .json({ statusCode: 404, description: 'Quotes not found' })
          : res.status(200).json({
              StatusCode: 200,
              Description: 'Quotes successfully found',
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
          nitCustomAgency: { type: 'string', example: '121251554' },
          nitCustomer: { type: 'string', example: 'DHL' },
          nitOfficial: { type: 'string', example: '234444234' },
          official: { type: 'string', example: 'Jose' },
          nitOfficialAuthorized: { type: 'string', example: 'Ingreso' },
          officialAuthorized: { type: 'string', example: 'das233' },
          modalityOperation: { type: 'string', example: 'test' },
          nitTransportCompany: { type: 'string', example: '15515-6' },
          typeOperation: { type: 'string', example: '121251554' },
          replyEmail: { type: 'string', example: 'test' },
          observation: { type: 'string', example: '' },
          radicado: { type: 'string', example: '' },
          requestNumber: { type: 'string', example: '' },
          drivers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                placaCabezote: { type: 'string', example: 'shipment' },
                placaRemolque: { type: 'string', example: 'MORNING CHORUS3' },
                codigoEjes: { type: 'string', example: 'MORNING CHORUS3' },

                driverId: { type: 'string', example: 'shipment' },
                destination: { type: 'string', example: 'MORNING CHORUS3' },
                suggestedDate: { type: 'string', example: 'MORNING CHORUS3' },
                suggestedTime: { type: 'string', example: 'shipment' },
                cargoManifest: { type: 'string', example: 'MORNING CHORUS3' },
                cycle: { type: 'string', example: 'MORNING CHORUS3' },
                itemsToRemove: {  
                  type: 'array', 
                  items: {
                    type: 'object',
                    properties: {
                      NIUC: { type: 'string', example: 'shipment' },
                      VINReference: { type: 'string', example: 'MORNING CHORUS3' },
                      lineItem: { type: 'string', example: 'MORNING CHORUS3' },
                      quantity: { type: 'string', example: 'shipment' },
                    }

                  } },
                
              },
             
            }
        }                    
    }
    },
  })
  @Post()
  async createRequestOutput(@Req() req: Request, @Res() res: Response) {
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
        console.log(req.body)
        const valid = await this.Validations.validate(req.body);

        // if (!valid.status)
        //   return res
        //     .status(403)
        //     .json({ statusCode: 403, description: valid.errors });
        const config = new ConfigService();
        const { wallet, ccp } = await config.ConfigNetwork();
        // const isValid = await this.quoteService.getInventory(
        //   wallet,
        //   ccp,
        //   req.body,
        // );
        // if (isValid.code == 200) {
          const result = await this.quoteService.createRegisterQuotes(
            wallet,
            ccp,
            req,
          );
          const response =
            result.code == 200
              ? res.status(200).json({
                  statusCode: 200,
                  description: 'Request output create successfully',
                  Id: result,
                })
              : res.status(500).json({
                  statusCode: 500,
                  description: 'Failed to create request output',
                  error: result.result,
                });

                

          return response;
        // } else {
        //   return res.status(isValid.code).json({
        //     statusCode: isValid.code,
        //     description: isValid.description,
        //     item: isValid.item,
        //   });
        // }
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
              ID: { type: 'string', example: '121251554' },
              nitCustomAgency: { type: 'string', example: '121251554' },
              nitCustomer: { type: 'string', example: 'DHL' },
              nitOfficial: { type: 'string', example: '234444234' },
              official: { type: 'string', example: 'Jose' },
              nitOfficialAuthorized: { type: 'string', example: 'Ingreso' },
              officialAuthorized: { type: 'string', example: 'das233' },
              modalityOperation: { type: 'string', example: 'test' },
              nitTransportCompany: { type: 'string', example: '15515-6' },
              typeOperation: { type: 'string', example: '121251554' },
              replyEmail: { type: 'string', example: 'test' },
              observation: { type: 'string', example: '' },
              radicado: { type: 'string', example: '' },
              requestNumber: { type: 'string', example: '' },
              drivers: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    placaCabezote: { type: 'string', example: 'shipment' },
                    placaRemolque: { type: 'string', example: 'MORNING CHORUS3' },
                    codigoEjes: { type: 'string', example: 'MORNING CHORUS3' },

                    driverId: { type: 'string', example: 'shipment' },
                    destination: { type: 'string', example: 'MORNING CHORUS3' },
                    suggestedDate: { type: 'string', example: 'MORNING CHORUS3' },
                    suggestedTime: { type: 'string', example: 'shipment' },
                    cargoManifest: { type: 'string', example: 'MORNING CHORUS3' },
                    cycle: { type: 'string', example: 'MORNING CHORUS3' },
                    itemsToRemove: {  
                      type: 'array', 
                      items: {
                        type: 'object',
                        properties: {
                          NIUC: { type: 'string', example: 'shipment' },
                          VINReference: { type: 'string', example: 'MORNING CHORUS3' },
                          lineItem: { type: 'string', example: 'MORNING CHORUS3' },
                          quantity: { type: 'string', example: 'shipment' },
                        }

                      } },
                    
                  },
             
          
            }
        }                    
    }
    },
  })
  @Post('/update')
  async updateRegisterOutput(@Req() req: Request, @Res() res: Response) {
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
        console.log(req.body)
        const valid = await this.Validations.validate(req.body);

        // if (!valid.status)
        //   return res
        //     .status(403)
        //     .json({ statusCode: 403, description: valid.errors });
        const config = new ConfigService();
        const { wallet, ccp } = await config.ConfigNetwork();
        // const isValid = await this.quoteService.getInventory(
        //   wallet,
        //   ccp,
        //   req.body,
        // );
        // if (isValid.code == 200) {
          const result = await this.quoteService.updateRegisterQuotes(
            wallet,
            ccp,
            req,
          );
          const response =
            result.code == 200
              ? res.status(200).json({
                  statusCode: 200,
                  description: 'Request output create successfully',
                  Id: req.body.ID,
                })
              : res.status(500).json({
                  statusCode: 500,
                  description: 'Failed to create request output',
                  error: result.result,
                });

          return response;
        // } else {
        //   return res.status(isValid.code).json({
        //     statusCode: isValid.code,
        //     description: isValid.description,
        //     item: isValid.item,
        //   });
        // }
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
        const result = await this.quoteService.uploadFilesRequestOutput(
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
