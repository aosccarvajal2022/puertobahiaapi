import { Controller, HttpService, Get, Param, Post, Body, Req, Put, Res } from '@nestjs/common';
import { CustomsAgencyService } from './customsAgency.service';
import { Request, Response } from 'express';
import {  ApiBody, ApiHeader, ApiResponse } from '@nestjs/swagger';



import * as FabricCAServices from 'fabric-ca-client';
import { Wallets, X509Identity } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '../config/config.service'

@Controller('customsAgency')
export class CustomsAgencyController{
    private ruta: string
    constructor(
        private readonly CustomsAgencyService: CustomsAgencyService, 
        private readonly httpService: HttpService,        
        private readonly ConfigService: ConfigService,
        ){       
        }
     
       
    @ApiHeader({
        name: 'token',
        description: 'token de usuario'
    })  
    @Get()
    @ApiResponse({ status: 404, description: 'Custom Agency not found.'})    
    @ApiResponse({ status: 200, 
        schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 200 },
            description:  { type: 'string', example: 'Custom Agency successfully found' },
            agency: {
                type: 'array',
                items: {
                type: 'object',
                properties: {
                    Key: { type: 'string', example: '121251554' },
                    Record:{
                        type: 'object',
                        properties: {
                            NIT: { type: 'string', example: '121251554' },
                            AgencyName: { type: 'string', example: 'DHL' },
                            AgencyContact: { type: 'string', example: 'Wilneld' },
                            AgencyPhoneNumber: { type: 'string', example: '111-1111' },
                        }
                    }                    
                }
                }
            },
            
        },
    }})   
    async getAll(@Req() req: Request, @Res() res: Response){

       
       try{

        const token = req.headers['token'];
        if (!token)
            res.status(403).json({ statusCode: 403, description: 'missing token' });

        const validateToken = await this.ConfigService.validateToken(
        token.toString(),
        );

        if (validateToken == 'Successfully Verified') {
          const config = new ConfigService();
          const {wallet,ccp} = await config.ConfigNetwork();   
          const resAgency  = await this.CustomsAgencyService.getAll(wallet,ccp);
          return resAgency.length === 0
          ? res
              .status(404)
              .json({ statusCode: 404, description: 'Agency not found' })
          : res.status(200).json({
              statusCode: 200,
              description: 'Agency successfully found',
              agency: resAgency,
            });
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
            NIT: { type: 'string', example: '1515181' },
            AgencyName: { type: 'string', example: 'DHL' },
            AgencyContact: { type: 'string', example: 'Wilneld' },
            AgencyPhoneNumber: { type: 'string', example: '111-1111' }
          },
        },
      })    
    @ApiHeader({
        name: 'token',
        description: 'token de usuario'
    })      
    @Post()
    @ApiResponse({ status: 200, description: 'Agency saved correctly.'})
    @ApiResponse({ status: 404, description: 'Check that all fields are entered.'})    
    async createAgency(@Req() req: Request, @Res() res: Response){
    try{
        const token = req.headers['token'];
        if (!token)
            res.status(403).json({ statusCode: 403, description: 'missing token' });

        const validateToken = await this.ConfigService.validateToken(
        token.toString(),
        );

        if (validateToken == 'Successfully Verified') {
          const config = new ConfigService();
          const {wallet,ccp} = await config.ConfigNetwork();  
          const resAgency  = await this.CustomsAgencyService.createAgency(wallet,ccp, req);
          return resAgency
          ? res
              .status(404)
              .json({ statusCode: 404, description: 'Agency not found' })
          : res.status(200).json({
                statusCode: 200,
                description: 'Agency create successfully',
            });
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
            NIT: { type: 'string', example: '1515181' },
            AgencyName: { type: 'string', example: 'DHL' },
            AgencyContact: { type: 'string', example: 'Wilneld' },
            AgencyPhoneNumber: { type: 'string', example: '111-1111' }
          },
        },
      })    
    @ApiHeader({
        name: 'token',
        description: 'token de usuario'
    })      
    @Post('/updateCustomsAgency')
    @ApiResponse({ status: 200, description: 'Agency update correctly.'})
    @ApiResponse({ status: 404, description: 'Check that all fields are entered.'})    
    async updateAgency(@Req() req: Request, @Res() res: Response){
        try{
            const token = req.headers['token'];
            if (!token)
                res.status(403).json({ statusCode: 403, description: 'missing token' });
    
            const validateToken = await this.ConfigService.validateToken(
            token.toString(),
            );
    
            if (validateToken == 'Successfully Verified') {
              const config = new ConfigService();
              const {wallet,ccp} = await config.ConfigNetwork();  
              const resAgency  = await this.CustomsAgencyService.updateAgency(wallet,ccp, req);
              return resAgency
              ? res
                  .status(404)
                  .json({ statusCode: 404, description: 'Agency not found' })
              : res.status(200).json({
                    statusCode: 200,
                    description: 'Agency create successfully',
                });
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


}