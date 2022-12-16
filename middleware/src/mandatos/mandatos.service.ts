import { Injectable, HttpService } from '@nestjs/common';

import { Gateway, Wallets } from 'fabric-network';

@Injectable()
export class MandatoService {
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
      const network = await gateway.getNetwork('mychannel');

      const contract = network.getContract('mandatos');
      const result = await contract.evaluateTransaction('queryAllRegister');
      return result.toString();
    } finally {
      gateway.disconnect();
    }
    return result;
  }

  public async createMandato(wallet, ccp, req) {
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
      const contract = network.getContract('mandatos');

      const result = await contract.submitTransaction(
        'createRegisterMandato',
        random,
        req.body.type,
        req.body.authorizing_third,
        req.body.approver_third,
        req.body.from,
        req.body.to,
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

  public async updateMandato(wallet, ccp, req) {
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

      // var random = Math.random().toString(36).substr(2, 5);

      // Get the contract from the network.
      const contract = network.getContract('mandatos');

      const result = await contract.submitTransaction(
        'UpdateMandato',
        req.body.ID,
        req.body.type,
        req.body.authorizing_third,
        req.body.approver_third,
        req.body.from,
        req.body.to,
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
