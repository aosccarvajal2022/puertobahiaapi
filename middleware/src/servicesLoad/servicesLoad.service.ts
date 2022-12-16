import { Injectable, HttpService } from "@nestjs/common";
import { ConfigService } from '../config/config.service';
import { Gateway, Wallets } from 'fabric-network';

@Injectable()
export class serviceLoadService{
    constructor(private readonly httpService: HttpService){}
    
    async getAll(wallet, ccp) {
      let result;
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
        
  
        const contract = network.getContract('ServicesLoad');
        const result = await contract.evaluateTransaction(
          'queryAllRegisterServices',
        );
        return result.toString();
      } finally {
        gateway.disconnect();
      }
      return result;
    }



    public async createServiceLoad(wallet, ccp, req) {
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
        const contract = network.getContract('ServicesLoad');
  
        if(!req.body.serviceCode || !req.body.serviceName){
          return 404;
       }

        const result = await contract.submitTransaction(
          'createRegisterservice',
          req.body.serviceName,
          req.body.serviceCode
        );
        return result;
      } catch (error) {
        return 'error';
      } finally {
        // Disconnect from the gateway when the application is closing
        // This will close all connections to the network
        gateway.disconnect();
      }
    }

  public async updateServiceLoad(wallet, ccp, req) {
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

      if(!req.body.serviceCode || !req.body.serviceName){
        return 404;
     }

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');

      // var random = Math.random().toString(36).substr(2, 5);

      // Get the contract from the network.
      const contract = network.getContract('ServicesLoad');

      const result = await contract.submitTransaction(
        'UpdateService',
        req.body.serviceName,
        req.body.serviceCode
      );
      return result;
    } catch (error) {
      return 'error';
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
  }
  
}

