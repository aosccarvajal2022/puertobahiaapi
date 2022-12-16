import { Controller, HttpService, Get, Param, Post, Body, Req, Put } from '@nestjs/common';
import { TransportService } from './transport.service';
import { Request } from 'express';
import { ConfigService } from '../config/config.service'
import * as fs from 'fs';

@Controller('transport')
export class TransportController{
    private ruta: string
    constructor(
        private readonly TransportService: TransportService, 
        private readonly httpService: HttpService,        
        ){} 
     
       
    @Get()
    async getAll(@Req() req: Request){
       try{
       const config = new ConfigService();
       const {wallet,ccp} = await config.ConfigNetwork();                         
       return await this.TransportService.getAll(wallet,ccp);
    }catch(error){
           return 'error'
       }
    }
    
    @Post()
    async createTransportDocument(@Req() req: Request){
        try{
            const config = new ConfigService();
            const {wallet,ccp} = await config.ConfigNetwork();    
            return await this.TransportService.createTransportDocument(wallet,ccp,req);
        }catch(error){
            return 'error'
        }
    }

    @Put()
    async uptadeTransportDocument(@Req() req: Request){
        try{
            const config = new ConfigService();
            const {wallet,ccp} = await config.ConfigNetwork();    
            return await this.TransportService.uptadeTransportDocument(wallet,ccp,req);        
        }catch(error){
            return 'error'
        }
    }

}