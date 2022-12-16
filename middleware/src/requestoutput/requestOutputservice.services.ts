import { Injectable, HttpService } from '@nestjs/common';

import { Gateway, Wallets } from 'fabric-network';
var fs = require('fs');

@Injectable()
export class RequestOutputService {
  constructor(private readonly httpService: HttpService) {}
  async getAll(wallet, ccp) {
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    try {
      await gateway.connect(ccp, {
        wallet,
        identity: 'appUser',
        discovery: { enabled: true, asLocalhost: true },
      });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');

      // Get the contract from the network.
      const contract = network.getContract('quotes');

      const result = await contract.evaluateTransaction(
        'queryAllRegisterQuotes',
      );
      console.log(result);

      return result.toString();
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
  }


   
  

  public async createRegisterQuotes(wallet, ccp, req) {
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    try {
      await gateway.connect(ccp, {
        wallet,
        identity: 'appUser',
        discovery: { enabled: true, asLocalhost: true },
      });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');

      const fecha = new Date();
      const random = `3-${fecha.getFullYear()}${
        fecha.getMonth() + 1
      }${fecha.getDate()}${Math.floor(Math.random() * (9999 - 1111) + 1111)}`;

      // Get the contract from the network.
      const contract = network.getContract('quotes');
      const requiredFiles = [{}];
      const status = 'Creado';
      const result = await contract.submitTransaction(
        'createRegisterQuotes',
        random,
        req.body.nitCustomAgency,
        req.body.nitCustomer,
        req.body.nitOfficial,
        req.body.official,
        req.body.nitOfficialAuthorized,
        req.body.officialAuthorized,
        req.body.modalityOperation,
        req.body.nitTransportCompany,
        req.body.typeOperation,
        req.body.replyEmail,
        req.body.observation,
        req.body.radicado,
        req.body.requestNumber,
        status,
        JSON.stringify(requiredFiles),
        JSON.stringify(req.body.drivers),
      );
      return { code: 200, result, random };
    } catch (error) {
      return { code: 500, result: error };
    } finally {
      gateway.disconnect();
    }
  }



  public async updateRegisterQuotes(wallet, ccp, req) {
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    try {
      await gateway.connect(ccp, {
        wallet,
        identity: 'appUser',
        discovery: { enabled: true, asLocalhost: true },
      });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');

       

      // Get the contract from the network.
      const contract = network.getContract('quotes');
      const requiredFiles = [{}];
       
      const result = await contract.submitTransaction(
        'Update',
        req.body.ID,
        req.body.nitCustomAgency,
        req.body.nitCustomer,
        req.body.nitOfficial,
        req.body.official,
        req.body.nitOfficialAuthorized,
        req.body.officialAuthorized,
        req.body.modalityOperation,
        req.body.nitTransportCompany,
        req.body.typeOperation,
        req.body.replyEmail,
        req.body.observation,
        req.body.radicado,
        req.body.requestNumber,
        req.body.status,
        JSON.stringify(requiredFiles),
        JSON.stringify(req.body.drivers),
      );
      return { code: 200, result };
    } catch (error) {
      return { code: 500, result: error };
    } finally {
      gateway.disconnect();
    }
  }
  

  async getInventory(wallet, ccp, body) {
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    try {
      await gateway.connect(ccp, {
        wallet,
        identity: 'appUser',
        discovery: { enabled: true, asLocalhost: true },
      });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');

      // Get the contract from the network.
      const contract = network.getContract('authorization');
      const result = await contract.evaluateTransaction(
        'queryAllAuthorizationAD',
      );
      const inventory = JSON.parse(result.toString());
      const errorQty = [];
      const itemsError = [];
      const itemsExist = [];

      if (inventory.length > 0) {
        for (let drivers of body.drivers) {
          for (let itemsRq of drivers.itemsToRemove) {
            for (let inv of inventory) {
              for (let itemInv of inv.Record.items) {
                if (
                  itemsRq.NIUC == itemInv.NIUC &&
                  itemsRq.lineItem &&
                  itemInv.lineItem
                ) {
                  itemsExist.push(itemsRq);
                  if (
                    Number(itemsRq.quantity) >
                    Number(itemInv.authorizedQuantity)
                  ) {
                    itemsError.push(itemsRq);
                  }
                }
              }
            }
          }
        }

        for (let drivers of body.drivers) {
          for (let itemsRq of drivers.itemsToRemove) {
            let x = itemsExist.some((value) => {
              return (
                value.NIUC == itemsRq.NIUC && value.lineItem == itemsRq.lineItem
              );
            });
            if (!x)
              return {
                code: 404,
                description: 'Item not found in authorizations',
                item: itemsRq,
              };
          }
        }
        if (itemsError.length > 0)
          return {
            code: 404,
            description:
              'The following items exceed the quantity in authorization',
            item: itemsError,
          };

        return {
          code: 200,
          description: 'correct inventory',
          item: [],
        };
      } else {
        return {
          code: 404,
          description: 'No authorizations found',
          item: [],
        };
      }
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
  }

  public async uploadFilesRequestOutput(wallet, ccp, id, files) {
    const gateway = new Gateway();
    try {
      await gateway.connect(ccp, {
        wallet,
        identity: 'appUser',
        discovery: { enabled: true, asLocalhost: true },
      });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');
      // Get the contract from the network.
      const contract = network.getContract('quotes');
      const idExist = await contract.evaluateTransaction(
        'RegisterExistQuotes',
        id,
      );

      if (idExist.toString() == 'false') {
        return { err: `The asset ${id} does not exist` };
      } else {
        const filesRqLoad = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          let name = file.name;
          let archivo = fs.readFileSync(file.tempFilePath);
          const buff = Buffer.from(archivo);
          const typeFile = name.split('.')[1];
          filesRqLoad.push({
            name,
            buff,
            typeFile,
          });
        }

        const result = await contract.submitTransaction(
          'chargeFilesQuotes',
          id,
          JSON.stringify(filesRqLoad),
        );
        return { desc: 'Request Updated Load Successfully' };
      }
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
  }
}
