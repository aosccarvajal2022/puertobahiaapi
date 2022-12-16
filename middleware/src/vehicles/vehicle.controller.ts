import { Controller, HttpService, Get, Param, Post, Body, Req, Res, Put } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { Request,Response } from 'express';
import { ApiBody, ApiHeader, ApiPayloadTooLargeResponse,ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '../config/config.service'
import * as FabricCAServices from 'fabric-ca-client';
import { Wallets, X509Identity } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';

@Controller('vehicle')
export class VehicleController{
    private ruta: string
    constructor(
        private readonly vehicleservice: VehicleService, 
        private readonly httpService: HttpService,      
        private readonly ConfigService: ConfigService,   
        ){
        //   this.ruta = '/home/datepe/Escritorio/blockchain/Puerto_bahia/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json'
          //  this.ruta = '/home/david/puerto_bahia/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json';
        }
     
       
   
        @ApiHeader({
            name: 'token',
            description: 'token de usuario'
        })  
        @Get()
        @ApiResponse({ status: 404, description: 'Vehicles not found.'})    
        @ApiResponse({ status: 200, 
        schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 200 },
            description:  { type: 'string', example: 'Vehicles successfully found' },
            vehicle: {
                type: 'array',
                items: {
                type: 'object',
                properties: {
                    Key: { type: 'string', example: '123123' },
                    Record:{
                        type: 'object',
                        properties: {
                            Placa: { type: 'string', example: '199124' },
                            Type: { type: 'string', example: 'Camioneta' },
                            ClassVehicle : {type: 'string', example: 'Ford' }
                        }
                    }                    
                }
                }
            },
            
        },
        }})   
    async getAll(@Req() req: Request, @Res()res: Response){
       try{

        const token = req.headers['token'];
        const config = new ConfigService();


        const validateToken = await config.validateToken(
            token.toString(),
          );
      
        if (validateToken == 'Successfully Verified') {
            const {wallet,ccp} = await config.ConfigNetwork(); 
            const resVehicle = await this.vehicleservice.getAll(wallet,ccp);
            
            return resVehicle.length === 0 ? 
            res.status(404).json({statusCode: 404, description: "Vehicle closure not found"})
            : res.status(200).json({statusCode: 200, description: "Vehicle closure successfully found" ,vehicle: resVehicle})
        }
        else
        {
            return res
            .status(403)
            .json({ statusCode: 403, description: validateToken });
        }  
                
        }catch(error){
           return 'error'
       }
    }


    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            Placa: { type: 'string', example: 'FJM388' },
            Type: { type: 'string', example: 'CAMIONETA' },
            ClassVehicle: { type: 'string', example: 'CAMPERO' }
          },
        },
      })    
    @ApiHeader({
        name: 'token',
        description: 'token de usuario'
    })      
    @Post()
    @ApiResponse({ status: 200, description: 'Vehicle saved correctly.'})
    @ApiResponse({ status: 404, description: 'Check that all fields are entered.'})    
    async createVehicle(@Req() req: Request, @Res()res: Response){
    try{
        const token = req.headers['token'];
        const validateToken = await this.ConfigService.validateToken(token.toString());
        if(validateToken == 'Successfully Verified'){
            const config = new ConfigService();
            const {wallet,ccp} = await config.ConfigNetwork(); 
            await this.vehicleservice.createVehicle(wallet,ccp,req);
            return res.status(200).json({statusCode: 200, description: "Vehicle create successfully"})
        }else{
            return res.status(403).json({statusCode: 403, description: validateToken})
        }  
       }catch(error){
           return 'error'
       }
    }


    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            Placa: { type: 'string', example: 'FJM388' },
            Type: { type: 'string', example: 'CAMIONETA' },
            ClassVehicle: { type: 'string', example: 'CAMPERO' }
          },
        },
      })    
    @ApiHeader({
        name: 'token',
        description: 'token de usuario'
    })      
    @Post('/Updatevehicle')
    @ApiResponse({ status: 200, description: 'Vehicle saved correctly.'})
    @ApiResponse({ status: 404, description: 'Check that all fields are entered.'})    

    async Updatevehicle(@Req() req: Request, @Res()res: Response){
    try{
         
        const token = req.headers['token'];
        const validateToken = await this.ConfigService.validateToken(token.toString());
        if(validateToken == 'Successfully Verified'){
            const config = new ConfigService();
            const {wallet,ccp} = await config.ConfigNetwork(); 
          return await this.vehicleservice.updateVehicle(wallet,ccp,req);
        }else{
            return res.status(403).json({statusCode: 403, description: validateToken})
        }  
       }catch(error){
           return 'error'
       }
    }

}