import { Injectable, HttpService } from '@nestjs/common';

import { Gateway, Wallets } from 'fabric-network';
var fs = require('fs');

@Injectable()
export class AuthorizationADService {
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
      const contract = network.getContract('authorization');

      const result = await contract.evaluateTransaction(
        'queryAllAuthorizationAD',
      );

      return result.toString();
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
  }

  public async createAuthorization(wallet, ccp, req) {
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
      const contract = network.getContract('authorization');
      const requiredFiles = [{}];
      const status = 'gestionAD';
      const result = await contract.submitTransaction(
        'createAuthorizationAD',
        random,
        req.body.nitCustomAgency,
        req.body.nitCustomer,
        req.body.nitOfficial,
        req.body.official,
        req.body.nitTransportCompany,
        status,
        req.body.noAuthorizationAD,
        JSON.stringify(req.body.items),
      );

      return { code: 200, result, random };
    } catch (error) {
      return { code: 500, result: error };
    } finally {
      gateway.disconnect();
    }
  }
  /* 
  public async updateRegisterQuotes(wallet, ccp, req) {
    let result;
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    try {
      const identity = await wallet.get('appUser');

      await gateway.connect(ccp, {
        wallet,
        identity: 'appUser',
        discovery: { enabled: true, asLocalhost: true },
      });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');

      var random = Math.random().toString(36).substr(2, 5);

      // Get the contract from the network.
      const contract = network.getContract('quotes');

      const result = await contract.submitTransaction(
        'UpdateQuotes',
        random,
        req.body.ID,
        req.body.nit,
        req.body.customAgency,
        req.body.nitCustomer,
        req.body.customer,
        req.body.entryOrRemove,
        req.body.motonave,
        req.body.bL_IE,
        req.body.quantity,
        req.body.referenceLoad,
        req.body.description,
        req.body.codeIMO,
        req.body.codeUN,
        req.body.cicle.req.body.driver,
        req.bodyccDriver,
        req.body.plaqueE,
        req.body.plaqueR,
        req.body.axes,
        req.body.destination,
        req.body.date,
        req.body.hour,
      );
      return result;
    } catch (error) {
      return 'error';
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
  }*/

  async   validateInventory(wallet, ccp, body) {
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
      const contract = network.getContract('document');
      const result = await contract.evaluateTransaction(
        'queryAllDocumentClosure',
      );
      const inventory = JSON.parse(result.toString());
      const itemsError = [];
      const itemsExist = [];
      if (inventory.length > 0) {
        for (let item of body.items) {
          for (let inv of inventory) {
            for (let itemInv of inv.Record.items) {
              if (
                item.NIUC == itemInv.NIUC &&
                item.lineItem ==
                itemInv.lineItem
              ) {
                itemsExist.push(item);
                if (
                  Number(item.authorizedQuantity) >
                  Number(itemInv.amountReceived)
                ) {
                  itemsError.push(item);
                }
              }
            }
          }
        }
        for (let item of body.items) {
          let x = itemsExist.some((value) => {
            return value.NIUC == item.NIUC && value.lineItem == item.lineItem;
          });
          if (!x)
            return {
              code: 404,
              description: 'Item not found in inventory',
              item,
            };
        }
        if (itemsError.length > 0)
          return {
            code: 404,
            description: 'The following items exceed the quantity in stock',
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
          description: 'No inventory found',
          item: [],
        };
      }
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
  }

  public async uploadFilesAuthorization(wallet, ccp, id, files) {
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
      const idExist = await contract.evaluateTransaction(
        'RegisterAuthorizationAD',
        id,
      );

      if (idExist.toString() == 'false') {
        return {
          code: 404,
          description: `Authorization with id not found ${id}`,
        };
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
          'chargeFilesAuthorizationAD',
          id,
          JSON.stringify(filesRqLoad),
        );
        return { code: 200, description: 'Files uploaded successfully' };
      }
    } catch (error) {
      return { code: 500, description: 'Internal server error' };
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
  }
}
