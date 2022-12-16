import { Controller, HttpService, Get, Param, Post, Body, Req, Put, Res } from '@nestjs/common';
import { serviceLoadService } from './servicesLoad.service';
import { Request , Response } from 'express';
import { ApiBody, ApiHeader, ApiPayloadTooLargeResponse,ApiResponse } from '@nestjs/swagger';
import { ConfigService } from 'src/config/config.service';


@Controller('servicesload')
export class serviceLoadController{
    private ruta: string
    constructor(
        private readonly serviceLoadService: serviceLoadService, 
        private readonly httpService: HttpService,        
        ){
        //   this.ruta = '/home/datepe/Escritorio/blockchain/Puerto_bahia/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json'
            // this.ruta = '/home/david/puerto_bahia/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json';
        }
     
       
      
    @ApiHeader({
        name: 'token',
        description: 'token de usuario'
    })  
    @Get()
    @ApiResponse({ status: 404, description: 'Service Load not found.'})    
    @ApiResponse({ status: 200, 
    schema: {
    type: 'object',
    properties: {
        statusCode: { type: 'number', example: 200 },
        description:  { type: 'string', example: 'Service Load successfully found' },
        serviceload: {
            type: 'array',
            items: {
            type: 'object',
            properties: {
                Key: { type: 'string', example: '123123' },
                Record:{
                    type: 'object',
                    properties: {
                        serviceCode: { type: 'string', example: '199124' },
                        serviceName: { type: 'string', example: 'Levantamiento' },
                        
                    }
                }                    
            }
            }
        },
        
    },
    }})   
    async getAll(@Req() req: Request, @Res()res: Response){
        
        const token = req.headers['token'];
        const config = new ConfigService();

        const validateToken = await config.validateToken(
            token.toString(),
          );
          if (validateToken == 'Successfully Verified') {
            try{
             
              const { wallet, ccp } = await config.ConfigNetwork();
              const resServices = await this.serviceLoadService.getAll(wallet, ccp);

                return resServices.length === 0
                  ? res.status(404).json({
                      statusCode: 404,
                      description: 'Services Load  not found',
                    })
                  : res.status(200).json({
                      statusCode: 200,
                      description: 'Services Load  successfully found',
                      serviceload: resServices,
                    });
              } catch (error) {
                return 'error';
              }
             }else {
                return res
                  .status(403)
                  .json({ statusCode: 403, description: validateToken });
              }

    }


    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            serviceCode: { type: 'string', example: '199124' },
            serviceName: { type: 'string', example: 'Levantamiento' },
            
          },
        },
      })    
    @ApiHeader({
        name: 'token',
        description: 'token de usuario'
    })      
    @Post()
    @ApiResponse({ status: 200, description: 'Service saved correctly.'})
    @ApiResponse({ status: 404, description: 'Check that all fields are entered.'})    
    async createService(@Req() req: Request, @Res() res: Response){
        try {
            const token = req.headers['token'];
            const config = new ConfigService();
            const validateToken = await config.validateToken(
              token.toString(),
            );
            if (validateToken == 'Successfully Verified') {
              
              const { wallet, ccp } = await config.ConfigNetwork();
              await this.serviceLoadService.createServiceLoad(wallet, ccp, req);
              return res.status(200).json({
                statusCode: 200,
                description: 'Service Load  create successfully',
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
            serviceCode: { type: 'string', example: '199124' },
            serviceName: { type: 'string', example: 'Levantamiento' },
            
          },
        },
      })    
    @ApiHeader({
        name: 'token',
        description: 'token de usuario'
    })      
    @Post('/UpdateServiceLoad')
    @ApiResponse({ status: 200, description: 'ServiceLoad saved correctly.'})
    @ApiResponse({ status: 404, description: 'Check that all fields are entered.'})    
    async Updatevehicle(@Req() req: Request, @Res()res: Response){
        try {
            const token = req.headers['token'];
            const config = new ConfigService();
            const validateToken = await config.validateToken(
              token.toString(),
            );
            if (validateToken == 'Successfully Verified') {
              
              const { wallet, ccp } = await config.ConfigNetwork();
              return await this.serviceLoadService.updateServiceLoad(wallet, ccp, req);
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