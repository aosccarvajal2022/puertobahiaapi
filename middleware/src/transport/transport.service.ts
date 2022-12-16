import { Injectable, HttpService } from "@nestjs/common";
import { ConfigService } from '../config/config.service';
import Axios from "axios";
import { Gateway, Wallets } from 'fabric-network';

@Injectable()
export class TransportService{
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
          const contract = network.getContract('transport');          
          const result = await contract.evaluateTransaction('queryAllDocumentTrasnport');
          return result.toString()        
        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }
        return result;
    }

    
    public async createTransportDocument(wallet,ccp,req) {
        let result
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        try {
          const identity = await wallet.get('appUser');
                
          await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

          // Get the network (channel) our contract is deployed to.
          const network = await gateway.getNetwork('mychannel');

          var random = Math.random().toString(36).substr(2, 5);
              
          // Get the contract from the network.
          const contract = network.getContract('transport');  
          const contractDocument = network.getContract('document');          
          let documents = await contractDocument.evaluateTransaction('queryAllDocumentClosure');
          documents = JSON.parse(documents.toString())
          for(let x in documents){
            console.log(documents[x])
          }
          const result = await contract.submitTransaction('createDocumentTrasnport',random,req.body.bl,req.body.recalada);
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

    public async uptadeTransportDocument(wallet,ccp,req){
        let result
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        try {
          const identity = await wallet.get('appUser');
                
          await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

          // Get the network (channel) our contract is deployed to.
          const network = await gateway.getNetwork('mychannel');

          var random = Math.random().toString(36).substr(2, 5);
              
          // Get the contract from the network.
          const contract = network.getContract('transport');  
      
          const result = await contract.submitTransaction('UpdateTransport',req.body.id,req.body.bl,req.body.recalada);
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