import { Injectable, HttpService } from '@nestjs/common';
import { Gateway } from 'fabric-network';

@Injectable()
export class ArimService {
  constructor(private readonly httpService: HttpService) {}

  async getAll(wallet, ccp) {
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

      // Get the contract from the network.
      const contract = network.getContract('arim');
      const result = await contract.evaluateTransaction('queryAllArim');
      return result.toString();
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
  }

  async getArimId(wallet, ccp, id) {
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

      // Get the contract from the network.
      const contract = network.getContract('arim');
      const result = await contract.evaluateTransaction('queryArim', id);
      return result.toString();
    } catch (err) {
      return false;
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
  }

  public async createArim(wallet, ccp, req) {
    let result;
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    try {
      const identity = await wallet.get('appUser');
      if (
        !req.body.arim ||
        !req.body.placaVIN ||
        !req.body.cargoDescription ||
        !req.body.cargoLocation ||
        !req.body.driver ||
        !req.body.transportationCompany ||
        !req.body.dateIssue ||
        !req.body.typeOperation ||
        !req.body.originDestiny ||
        !req.body.BL_IE ||
        !req.body.Client ||
        !req.body.CustomsAgency ||
        !req.body.payrollReceiver ||
        !req.body.portOperator
      )
        return false;
      await gateway.connect(ccp, {
        wallet,
        identity: 'appUser',
        discovery: { enabled: true, asLocalhost: true },
      });

      // Get the network (channel) our contract is deployed to.
      const network = await gateway.getNetwork('mychannel');

      var random = Math.random().toString(36).substr(2, 5);

      // Get the contract from the network.
      const contract = network.getContract('arim');
      let agencies = JSON.stringify(req.body.agency);
      const result = await contract.submitTransaction(
        'createArim',
        random,
        req.body.arim,
        req.body.placaVIN,
        req.body.cargoDescription,
        req.body.cargoLocation,
        req.body.driver,
        req.body.transportationCompany,
        req.body.dateIssue,
        req.body.typeOperation,
        req.body.originDestiny,
        req.body.BL_IE,
        req.body.Client,
        req.body.CustomsAgency,
        req.body.payrollReceiver,
        req.body.portOperator,
      );
      return result;
    } catch (error) {
      console.log(error);

      return 'error';
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
  }
}
