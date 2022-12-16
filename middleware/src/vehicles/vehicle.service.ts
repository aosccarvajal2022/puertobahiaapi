import { Injectable, HttpService } from "@nestjs/common";

import { Gateway, Wallets } from 'fabric-network';

@Injectable()
export class VehicleService{
    constructor(private readonly httpService: HttpService){}
    async getAll(wallet,ccp){
        let result
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        try {
          const identity = await wallet.get('appUser');
                
          await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
          const network = await gateway.getNetwork('mychannel');
              
           
          const contract = network.getContract('vehicle');          
          const result = await contract.evaluateTransaction('queryAllRegisterVehicles');
          return result.toString()        
        } finally {
           
            gateway.disconnect();
        }
        return result;
    }

    public async createVehicle(wallet,ccp,req) {
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
          const contract = network.getContract('vehicle');  
          const result = await contract.submitTransaction('createVehicle',req.body.Placa, req.body.Type, req.body.ClassVehicle );
        //   const result = await contract.submitTransaction('createVehicle',req.body.PLACA, req.body.Type, req.body.ClassVehicle );
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


    public async updateVehicle(wallet,ccp, req){
        let result
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        try {
          const identity = await wallet.get('appUser');
                
          await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

          // Get the network (channel) our contract is deployed to.
          const network = await gateway.getNetwork('mychannel');

          
              
          // Get the contract from the network.
          const contract = network.getContract('vehicle');  
      
          const result = await contract.submitTransaction('UpdateVehicle',req.body.PLACA, req.body.Type, req.body.ClassVehicle);
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