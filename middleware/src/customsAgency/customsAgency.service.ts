import { Injectable, HttpService } from "@nestjs/common";

import { Gateway, Wallets } from 'fabric-network';

@Injectable()
export class CustomsAgencyService{

    constructor(private readonly httpService: HttpService){}
    
    async getAll(wallet,ccp){
        let result
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        try {
          const identity = await wallet.get('appUser');
                
          await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

          // Get the network (channel) our contract is deployed to.
          const network = await gateway.getNetwork('mychannel');
              
          // Get the contract from the network.
          const contract = network.getContract('inventory');          
          const result = await contract.evaluateTransaction('queryAllRegisterAgency');
          return result.toString()        
        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }
        return result;
    }

    public async createAgency(wallet,ccp,req) {
        let result
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        try {
          const identity = await wallet.get('appUser');
                
          await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

          // Get the network (channel) our contract is deployed to.
          const network = await gateway.getNetwork('mychannel');

        //   var random = Math.random().toString(36).substr(2, 5);
              
          // Get the contract from the network.
          const contract = network.getContract('customsAgency');  
      
          const result = await contract.submitTransaction('createAgency',req.body.NIT, req.body.AgencyName, req.body.AgencyContact , req.body.AgencyPhoneNumber );
          return result;        
        }catch(error){
            return "error"; 
        } 
        finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }
    }


     public async updateAgency(wallet,ccp, req){
        
        let result
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        try {
          const identity = await wallet.get('appUser');
                
          await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

          // Get the network (channel) our contract is deployed to.
          const network = await gateway.getNetwork('mychannel');

        //   var random = Math.random().toString(36).substr(2, 5);
              
          // Get the contract from the network.
          const contract = network.getContract('customsAgency');  
          const result = await contract.submitTransaction('UpdateAgency',req.body.NIT, req.body.AgencyName, req.body.AgencyContact , req.body.AgencyPhoneNumber );
          return result;        
        }catch(error){
            return "error"; 
        } 
        finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }
    }


}