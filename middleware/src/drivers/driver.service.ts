import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import Axios from 'axios';
import { Gateway, Wallets } from 'fabric-network';

@Injectable()
export class DriverService {
  constructor(private readonly httpService: HttpService) {}
  jwt = require('jsonwebtoken');

  async validateToken(token: string) {
    const config = new ConfigService();
    const key = config.get('KEYJWT') || 'KEYPUERTOBAHIA2022';

    if (token) {
      const verified = this.jwt.verify(token, key);
      if (verified) {
        return 'Successfully Verified';
      } else {
        // Access Denied
        return 'Token no Valida.';
      }
    } else {
      return 'Token no proveída.';
    }
  }

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

      // Get the contract from the network.
      const contract = network.getContract('driver');
      const result = await contract.evaluateTransaction('queryAllDrivers');
      return result.toString();
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
    return result;
  }

  public async createDriver(wallet, ccp, req) {
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

      var random = Math.random().toString(36).substr(2, 5);

      // Get the contract from the network.
      const contract = network.getContract('driver');
      const result = await contract.submitTransaction(
        'createDriver',
        req.body.id,
        req.body.ID_type,
        req.body.first_name,
        req.body.second_name,
        req.body.surname,
        req.body.second_surname,
        req.body.ID_transport,
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
