import { Injectable, HttpService, ConsoleLogger, Catch } from '@nestjs/common';
import { Gateway } from 'fabric-network';
import { ConfigService } from '../config/config.service';

@Injectable()
export class DocumentService {
  
  constructor(private readonly httpService: HttpService, private configservice: ConfigService) {
  }

  async getAll(wallet, ccp) {
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway(); 
    try {
    
      await gateway.connect(ccp, {
        wallet,
        identity: 'appUser',
        discovery: { enabled: true, asLocalhost: true },
      });

       const network = await gateway.getNetwork('mychannel');
    
        // Get the contract from the network.
        const contract = network.getContract('document');
      
     

        const result = await contract.evaluateTransaction(
        'queryAllDocumentClosure',
      );
      return result.toString();
    
    }catch (error) {
      console.log(error);

      return 'error';
    }
    finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      // gateway.disconnect();
    }
  }

  public async createDocumentClosure(wallet, ccp, req) {
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
      const contract = network.getContract('document');
      await contract.submitTransaction(
        'createDocumentClosure',
        random,
        req.body.recalada,
        req.body.maritimeAgency,
        req.body.motonave,
        JSON.stringify(req.body.items),
      );

      return random;
    } catch (error) {
      console.log(error);

      return 'error';
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
  }

  public async updateDocumentClosure(wallet, ccp, req) {
    // Create a new gateway for connecting to our peer node.
     
    try {

      const gateway = new Gateway(); 
      await gateway.connect(ccp, {
        wallet,
        identity: 'appUser',
        discovery: { enabled: true, asLocalhost: true },
      });

      const network = await gateway.getNetwork('mychannel');
    
      // Get the contract from the network.
      const contract = network.getContract('document');
    
      const id = req.body.inventoryId;
      // Get the contract from the network.
      
      const idExist = await contract.submitTransaction(
        'DocumentClosureExists',
        id,
      );
      if (idExist.toString() == 'true') {
        let inventory = await contract.submitTransaction('queryInventory', id);
        const inventoryObject = JSON.parse(inventory.toString());
        const pos = inventoryObject.items.findIndex(
          (item) =>
            item.NIUC == req.body.NIUC && item.lineItem == req.body.lineItem,
        );
      
        if (pos >= 0) {
          delete req.body.inventoryId;
          await contract.submitTransaction(
            'updateDocumentClosure',
            id,
            pos,
            JSON.stringify(req.body),
          );

          return {
            code: 200,
            description: `Item with NIC ${req.body.NIUC} successfully updated in inventory`,
          };
        } else {
          return {
            code: 404,
            description: `NIC ${req.body.NIUC} not found in inventory`,
          };
        }
      } else {
        return {
          code: 404,
          description: `Inventory with id ${id} not found`,
        };
      }
    } catch (error) {
      return {
        code: 505,
        description: `Internal server error`,
      };
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
       
    }
  }

  async getAllMandatos(wallet, ccp) {
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
      const contract = network.getContract('mandatos');


     
      const result = await contract.evaluateTransaction('queryAllRegister');
      return result.toString();
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
    
    }
  }

  public async updateMasive(wallet, ccp, id, req) {
    // Create a new gateway for connecting to our peer node.
    
    try {
       
      const fecha = new Date();

      // Get the contract from the network.
      const gateway = new Gateway(); 
      
      await gateway.connect(ccp, {
        wallet,
        identity: 'appUser',
        discovery: { enabled: true, asLocalhost: true },
      });

        
      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');
      const contract = network.getContract('document');

      const result = await contract.submitTransaction('deleteInventory', id);

      if (result) {
        await contract.submitTransaction(
          'createDocumentClosure',
          id,
          req.body.recalada,
          req.body.maritimeAgency,
          req.body.motonave,
          JSON.stringify(req.body.items),
        );
      }

      return id;
    } catch (error) {
      console.log(error);

      return 'error';
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      
    }
  }
}

