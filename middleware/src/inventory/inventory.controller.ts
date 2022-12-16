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
import { DocumentService } from './inventory.service';
import { query, Request, Response } from 'express';
import { Validations } from './validations';
import { ValidationsItem } from './validationsItem';
import { ConfigService } from '../config/config.service';
import {
  ApiBody,
  ApiHeader,
  ApiPayloadTooLargeResponse,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('inventory')
export class DocumentController {
  private ruta: string;
  constructor(
    private readonly DocumentService: DocumentService,
    private readonly ConfigService: ConfigService,
    private readonly Validations: Validations,
    private readonly ValidationsItem: ValidationsItem,
    private readonly httpService: HttpService,
  ) {}

  @ApiHeader({
    name: 'token',
    description: 'token de usuario',
  })
  @Get()
  async getAll(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.headers.token)
        return res
          .status(403)
          .json({ statusCode: 403, description: 'Token is missing' });

      const token = req.headers['token'];
      const validateToken = await this.ConfigService.validateToken(
        token.toString(),
      );
      if (validateToken == 'Successfully Verified') {
        const config = new ConfigService();
        const { wallet, ccp } = await config.ConfigNetwork();
        let resDocument = await this.DocumentService.getAll(wallet, ccp);
        resDocument = JSON.parse(resDocument);
        // console.log(resDocument[0].Record.items);
        return resDocument.length === 0
          ? res.status(404).json({
              statusCode: 404,
              description: 'Inventory not found',
            })
          : res.status(200).json({
              statusCode: 200,
              description: 'Inventory successfully found',
              Inventory: resDocument,
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

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        recalada: { type: 'string', example: 'MORNING CHORUS3' },
        maritimeAgency: { type: 'string', example: 'MORNING CHORUS3' },
        motonave: { type: 'string', example: 'MORNING CHORUS3' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              typeApplication: { type: 'string', example: 'shipment' },
              NIUC: { type: 'string', example: 'MORNING CHORUS3' },
              chargingDocument: { type: 'string', example: 'MORNING CHORUS3' },
              lineItem: { type: 'string', example: 'MORNING CHORUS3' },
              consignee: { type: 'string', example: 'MORNING CHORUS3' },
              typeLoad: { type: 'string', example: 'MORNING CHORUS3' },
              typeProduct: { type: 'string', example: 'MORNING CHORUS3' },
              typePackaging: { type: 'string', example: 'MORNING CHORUS3' },
              WeightAdvertised: { type: 'string', example: 'MORNING CHORUS3' },
              receivedWeight: { type: 'string', example: 'MORNING CHORUS3' },
              volumeAdvertised: { type: 'string', example: 'MORNING CHORUS3' },
              VINReferenceSerie: { type: 'string', example: 'MORNING CHORUS3' },
              loadDisposition: { type: 'string', example: 'MORNING CHORUS3' },
              brand: { type: 'string', example: 'MORNING CHORUS3' },
              description: { type: 'string', example: 'MORNING CHORUS3' },
              BLMaster: { type: 'string', example: 'MORNING CHORUS3' },
              NIUCMaster: { type: 'string', example: 'MORNING CHORUS3' },
              entryDate: { type: 'string', example: 'MORNING CHORUS3' },
              model: { type: 'string', example: 'MORNING CHORUS3' },
              amountReceived: { type: 'string', example: 'MORNING CHORUS3' },
              balance: { type: 'string', example: 'MORNING CHORUS3' },
              position: { type: 'string', example: 'MORNING CHORUS3' },
              portDischarge: { type: 'string', example: 'MORNING CHORUS3' },
              portLoading: { type: 'string', example: 'MORNING CHORUS3' },
              daysPort: { type: 'string', example: 'MORNING CHORUS3' },
              color: { type: 'string', example: 'MORNING CHORUS3' },
              line: { type: 'string', example: 'MORNING CHORUS3' },
              containerNumber: { type: 'string', example: 'MORNING CHORUS3' },
              stamps: { type: 'string', example: 'MORNING CHORUS3' },
              remarks: { type: 'string', example: 'MORNING CHORUS3' },
              formalities: { type: 'string', example: 'MORNING CHORUS3' },
              typeOperation: { type: 'string', example: 'MORNING CHORUS3' },
              weightStock: { type: 'string', example: 'MORNING CHORUS3' },
              volumeReceived: { type: 'string', example: 'MORNING CHORUS3' },
              volumeStock: { type: 'string', example: 'MORNING CHORUS3' },
            },
          },
        },
      },
    },
  })
  @ApiHeader({
    name: 'token',
    description: 'token de usuario',
  })
  @Post('create')
  async createDocumentClosure(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.headers.token)
        return res
          .status(403)
          .json({ statusCode: 403, description: 'Token is missing' });
      const token = req.headers['token'];
      let typeAppErr = false;
      const validateToken = await this.ConfigService.validateToken(
        token.toString(),
      );
      if (validateToken == 'Successfully Verified') {
        const valid = await this.Validations.validate(req.body);
        if (!valid.status)
          return res
            .status(403)
            .json({ statusCode: 403, description: valid.errors });
        req.body.items.map((item) => {
          if (
            item.typeApplication != 'shipment' &&
            item.typeApplication != 'landing'
          ) {
            typeAppErr = true;
          }
        });
        if (typeAppErr)
          return res.status(403).json({
            statusCode: 403,
            description:
              'typeApplication value not allowed, allowed values: (shipment, landing)',
          });
        const config = new ConfigService();
        const { wallet, ccp } = await config.ConfigNetwork();
        const id = await this.DocumentService.createDocumentClosure(
          wallet,
          ccp,
          req,
        );
        return res.status(200).json({
          statusCode: 200,
          description: 'Document closure create successfully',
          InventoryId: id,
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
  @ApiQuery({ name: 'motonave', type: String, required: false })
  @ApiQuery({ name: 'recalada', type: String, required: false })
  @ApiQuery({ name: 'id', type: String, required: false })
  @ApiQuery({ name: 'nitAgency', type: String, required: false })
  @Get('filters')
  async getDocumentByAduana(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.headers['token'])
        return res
          .status(404)
          .json({ statusCode: 404, description: 'token is missing' });

      const token = req.headers['token'];
      const validateToken = await this.ConfigService.validateToken(
        token.toString(),
      );
      if (validateToken == 'Successfully Verified') {
        const config = new ConfigService();

        const { wallet, ccp } = await config.ConfigNetwork();
        const resDocument = await this.DocumentService.getAll(wallet, ccp);
        const resConvert = JSON.parse(resDocument);
        const motonave = req.query.motonave ? req.query.motonave : null;
        const recalada = req.query.recalada ? req.query.recalada : null;
        const id = req.query.id ? req.query.id : null;
        const nitAgency = req.query.nitAgency ? req.query.nitAgency : null;
        const initialDate = req.query.initialDate
          ? req.query.initialDate
          : null;
        const finalDate = req.query.finalDate ? req.query.finalDate : null;
        let mandatosJSON = [];
        let documentsFilter = [];
        let itemsAgency = [];
        if (
          !motonave &&
          !recalada &&
          !id &&
          !nitAgency &&
          (!initialDate || !finalDate)
        ) {
          return res.status(403).json({
            statusCode: 403,
            description:
              'id or motonave or recalada is required as query parameter',
          });
        }

        if (nitAgency) {
          const mandatos = await this.DocumentService.getAllMandatos(
            wallet,
            ccp,
          );
          mandatosJSON = JSON.parse(mandatos);
        }

        for (const document of resConvert) {
          const doc = document.Record;
          if (nitAgency) {
            for (let item of doc.items) {
              if (item.consignee == nitAgency) {
                let authorized = mandatosJSON.some((value) => {
                  return value.Record.approver_third == item.consignee;
                });
                console.log(item);
                if (authorized && Number(item.balance) > 0) {
                  item.key = doc.ID;
                  itemsAgency.push(item);
                }
              }
            }
            if (itemsAgency.length > 0) {
              const aux = [];
              for (let value of itemsAgency) {
                if (value.key == doc.ID) aux.push(value);
              }
              if (aux.length > 0) {
                doc.items = aux;
                documentsFilter.push(document);
              }
            }
          } else if (initialDate && finalDate) {
            for (let item of doc.items) {
              var entryDateObject = new Date(item.entryDate);
              var initialDateObject = new Date(JSON.stringify(initialDate));
              var finalDateObject = new Date(JSON.stringify(finalDate));
              if (
                entryDateObject > initialDateObject &&
                entryDateObject < finalDateObject
              ) {
                item.key = doc.ID;
                itemsAgency.push(item);
              }
            }
            if (itemsAgency.length > 0) {
              const aux = [];
              for (let value of itemsAgency) {
                if (value.key == doc.ID) aux.push(value);
              }
              if (aux.length > 0) {
                doc.items = aux;
                documentsFilter.push(document);
              }
            }
          } else {
            if (motonave && recalada && id) {
              if (
                motonave == doc.motonave &&
                recalada == doc.recalada &&
                id == doc.ID
              )
                documentsFilter.push(document);
            } else if (motonave && recalada && !id) {
              if (motonave == doc.motonave && recalada == doc.recalada)
                documentsFilter.push(document);
            } else if (motonave && !recalada && id) {
              if (motonave == doc.motonave && id == doc.ID)
                documentsFilter.push(document);
            } else if (!motonave && recalada && id) {
              if (recalada == doc.recalada && id == doc.ID)
                documentsFilter.push(document);
            } else if (motonave && !recalada && !id) {
              if (motonave == doc.motonave) documentsFilter.push(document);
            } else if (!motonave && recalada && !id) {
              if (recalada == doc.recalada) documentsFilter.push(document);
            } else if (!motonave && !recalada && id) {
              if (id == doc.ID) documentsFilter.push(document);
            }
          }
        }

        if (documentsFilter.length == 0) {
          return res.status(404).json({
            statusCode: 404,
            description: 'Inventory not found',
          });
        } else {
          return res.status(200).json({
            statusCode: 200,
            description: 'Successful',
            Inventory: documentsFilter,
          });
        }
      } else {
        return res
          .status(403)
          .json({ statusCode: 403, description: validateToken });
      }
    } catch (err) {
      console.log(err);
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
        inventoryId: { type: 'string', example: 'shipment' },
        typeApplication: { type: 'string', example: 'shipment' },
        NIUC: { type: 'string', example: 'MORNING CHORUS3' },
        chargingDocument: { type: 'string', example: 'MORNING CHORUS3' },
        lineItem: { type: 'string', example: 'MORNING CHORUS3' },
        consignee: { type: 'string', example: 'MORNING CHORUS3' },
        typeLoad: { type: 'string', example: 'MORNING CHORUS3' },
        typeProduct: { type: 'string', example: 'MORNING CHORUS3' },
        typePackaging: { type: 'string', example: 'MORNING CHORUS3' },
        WeightAdvertised: { type: 'string', example: 'MORNING CHORUS3' },
        receivedWeight: { type: 'string', example: 'MORNING CHORUS3' },
        volumeAdvertised: { type: 'string', example: 'MORNING CHORUS3' },
        VINReferenceSerie: { type: 'string', example: 'MORNING CHORUS3' },
        loadDisposition: { type: 'string', example: 'MORNING CHORUS3' },
        brand: { type: 'string', example: 'MORNING CHORUS3' },
        description: { type: 'string', example: 'MORNING CHORUS3' },
        BLMaster: { type: 'string', example: 'MORNING CHORUS3' },
        NIUCMaster: { type: 'string', example: 'MORNING CHORUS3' },
        entryDate: { type: 'string', example: 'MORNING CHORUS3' },
        model: { type: 'string', example: 'MORNING CHORUS3' },
        amountReceived: { type: 'string', example: 'MORNING CHORUS3' },
        balance: { type: 'string', example: 'MORNING CHORUS3' },
        position: { type: 'string', example: 'MORNING CHORUS3' },
        portDischarge: { type: 'string', example: 'MORNING CHORUS3' },
        portLoading: { type: 'string', example: 'MORNING CHORUS3' },
        daysPort: { type: 'string', example: 'MORNING CHORUS3' },
        color: { type: 'string', example: 'MORNING CHORUS3' },
        line: { type: 'string', example: 'MORNING CHORUS3' },
        containerNumber: { type: 'string', example: 'MORNING CHORUS3' },
        stamps: { type: 'string', example: 'MORNING CHORUS3' },
        remarks: { type: 'string', example: 'MORNING CHORUS3' },
        formalities: { type: 'string', example: 'MORNING CHORUS3' },
        typeOperation: { type: 'string', example: 'MORNING CHORUS3' },
        weightStock: { type: 'string', example: 'MORNING CHORUS3' },
        volumeReceived: { type: 'string', example: 'MORNING CHORUS3' },
        volumeStock: { type: 'string', example: 'MORNING CHORUS3' },
      },
    },
  })
  @Put('update')
  async updateDocumentClosure(@Req() req: Request, @Res() res: Response) {
    if (!req.headers['token'])
      return res
        .status(404)
        .json({ statusCode: 404, description: 'token is missing' });
    const token = req.headers['token'];
    const validateToken = await this.ConfigService.validateToken(
      token.toString(),
    );
    if (validateToken == 'Successfully Verified') {
      const valid = await this.ValidationsItem.validate(req.body);
      if (!valid.status)
        return res
          .status(403)
          .json({ statusCode: 403, description: valid.errors });
      if (
        req.body.typeApplication != 'shipment' &&
        req.body.typeApplication != 'landing'
      )
        return res.status(403).json({
          statusCode: 403,
          description:
            'typeApplication value not allowed, allowed values: (shipment, landing)',
        });
      const config = new ConfigService();
      const { wallet, ccp } = await config.ConfigNetwork();
      const result = await this.DocumentService.updateDocumentClosure(
        wallet,
        ccp,
        req,
      );
      return res.status(result.code).json({
        statusCode: result.code,
        description: result.description,
      });
    } else {
      return res
        .status(403)
        .json({ statusCode: 403, description: validateToken });
    }
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '3-20228241200' },
        recalada: { type: 'string', example: 'MORNING CHORUS3' },
        maritimeAgency: { type: 'string', example: 'MORNING CHORUS3' },
        motonave: { type: 'string', example: 'MORNING CHORUS3' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              typeApplication: { type: 'string', example: 'shipment' },
              NIUC: { type: 'string', example: 'MORNING CHORUS3' },
              chargingDocument: { type: 'string', example: 'MORNING CHORUS3' },
              lineItem: { type: 'string', example: 'MORNING CHORUS3' },
              consignee: { type: 'string', example: 'MORNING CHORUS3' },
              typeLoad: { type: 'string', example: 'MORNING CHORUS3' },
              typeProduct: { type: 'string', example: 'MORNING CHORUS3' },
              typePackaging: { type: 'string', example: 'MORNING CHORUS3' },
              WeightAdvertised: { type: 'string', example: 'MORNING CHORUS3' },
              receivedWeight: { type: 'string', example: 'MORNING CHORUS3' },
              volumeAdvertised: { type: 'string', example: 'MORNING CHORUS3' },
              VINReferenceSerie: { type: 'string', example: 'MORNING CHORUS3' },
              loadDisposition: { type: 'string', example: 'MORNING CHORUS3' },
              brand: { type: 'string', example: 'MORNING CHORUS3' },
              description: { type: 'string', example: 'MORNING CHORUS3' },
              BLMaster: { type: 'string', example: 'MORNING CHORUS3' },
              NIUCMaster: { type: 'string', example: 'MORNING CHORUS3' },
              entryDate: { type: 'string', example: 'MORNING CHORUS3' },
              model: { type: 'string', example: 'MORNING CHORUS3' },
              amountReceived: { type: 'string', example: 'MORNING CHORUS3' },
              balance: { type: 'string', example: 'MORNING CHORUS3' },
              position: { type: 'string', example: 'MORNING CHORUS3' },
              portDischarge: { type: 'string', example: 'MORNING CHORUS3' },
              portLoading: { type: 'string', example: 'MORNING CHORUS3' },
              daysPort: { type: 'string', example: 'MORNING CHORUS3' },
              color: { type: 'string', example: 'MORNING CHORUS3' },
              line: { type: 'string', example: 'MORNING CHORUS3' },
              containerNumber: { type: 'string', example: 'MORNING CHORUS3' },
              stamps: { type: 'string', example: 'MORNING CHORUS3' },
              remarks: { type: 'string', example: 'MORNING CHORUS3' },
              formalities: { type: 'string', example: 'MORNING CHORUS3' },
              typeOperation: { type: 'string', example: 'MORNING CHORUS3' },
              weightStock: { type: 'string', example: 'MORNING CHORUS3' },
              volumeReceived: { type: 'string', example: 'MORNING CHORUS3' },
              volumeStock: { type: 'string', example: 'MORNING CHORUS3' },
            },
          },
        },
      },
    },
  })
  @ApiHeader({
    name: 'token',
    description: 'token de usuario',
  })
  @Post('updateallinventory')
  async updateMasiveInventory(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.headers.token)
        return res
          .status(403)
          .json({ statusCode: 403, description: 'Token is missing' });
      const token = req.headers['token'];
      let typeAppErr = false;
      const validateToken = await this.ConfigService.validateToken(
        token.toString(),
      );
      console.log("Procesing data " + req.body);
      if (validateToken == 'Successfully Verified') {
        const valid = await this.Validations.validate(req.body);
        if (!valid.status)
          return res
            .status(403)
            .json({ statusCode: 403, description: valid.errors });
        req.body.items.map((item) => {
          if (
            item.typeApplication != 'shipment' &&
            item.typeApplication != 'landing'
          ) {
            typeAppErr = true;
          }
        });
        if (typeAppErr)
          return res.status(403).json({
            statusCode: 403,
            description:
              'typeApplication value not allowed, allowed values: (shipment, landing)',
          });
        const config = new ConfigService();
        const { wallet, ccp } = await config.ConfigNetwork();
        const id = await this.DocumentService.updateMasive(
          wallet,
          ccp,
          req.body.id,
          req,
        );
        return res.status(200).json({
          statusCode: 200,
          description: 'Document closure update successfully',
          InventoryId: id,
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
