import { Injectable, HttpService } from '@nestjs/common';

import { Gateway, Wallets } from 'fabric-network';

@Injectable()
export class MotonaveAdvertService {
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

      const contract = network.getContract('motonaveAdvert');
      const result = await contract.evaluateTransaction(
        'queryAllRegisterMotonaveAdvert',
      );
      return result.toString();
    } finally {
      gateway.disconnect();
    }
    return result;
  }

  public async createMotonaveAdvert(wallet, ccp, req) {
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

      const fecha = new Date();
      const random = `3-${fecha.getFullYear()}${
        fecha.getMonth() + 1
      }${fecha.getDate()}${Math.floor(Math.random() * (9999 - 1111) + 1111)}`;

      // Get the contract from the network.
      const contract = network.getContract('motonaveAdvert');

      const result = await contract.submitTransaction(
        'createRegister',
        random,
        req.body.recalada,
        req.body.motonave,
        req.body.imo,
        req.body.agency,
        req.body.ETD,
        req.body.ETA,
        req.body.status,
      );
      return random;
    } catch (error) {
      return 'error';
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
  }

  public async updateMotonave(wallet, ccp, req) {
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
      const contract = network.getContract('motonaveAdvert');

      const result = await contract.submitTransaction(
        'UpdateMptonaveAdvert',
        req.body.id,
        req.body.recalada,
        req.body.motonave,
        req.body.imo,
        req.body.agency,
        req.body.ETD,
        req.body.ETA,
        req.body.status,
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
