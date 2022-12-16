import { Injectable, HttpService } from '@nestjs/common';
import { Gateway } from 'fabric-network';
var fs = require('fs');

@Injectable()
export class RequestLoadService {
  constructor(private readonly httpService: HttpService) {}

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
      const contract = network.getContract('requestLoad');
      const result = await contract.evaluateTransaction('queryAllRequestLoad');
      return result.toString();
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
  }

  async getAllInventory(wallet, ccp) {
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
      const contract = network.getContract('document');
      const result = await contract.evaluateTransaction(
        'queryAllDocumentClosure',
      );
      return result.toString();
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
    return result;
  }

  public async createRequestLoad(wallet, ccp, req) {
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

      const fecha = new Date();
      const random = `3-${fecha.getFullYear()}${
        fecha.getMonth() + 1
      }${fecha.getDate()}${Math.floor(Math.random() * (9999 - 1111) + 1111)}`;
      // Get the contract from the network.
      const contract = network.getContract('requestLoad');
      const status = 'Gestión AD';
      const result = await contract.submitTransaction(
        'createRequestLoad',
        random,
        req.body.dateApplication,
        req.body.suggestedDate,
        req.body.email,
        req.body.applicantId,
        req.body.applicantName,
        req.body.customerNIT,
        req.body.agencyNIT,
        req.body.remarks,
        req.body.radicado,
        req.body.requestNumber,
        req.body.status,
        JSON.stringify(req.body.people),
        JSON.stringify(req.body.services),
      );

      return { code: 200, id: random };
    } catch (error) {
      console.log(error);

      return { code: 500 };
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
  }

  public async updatedStatusRequestLoad(
    wallet,
    ccp,
    id,
    newStatus,
    radicado,
    numberequest,
  ) {
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
      const contract = network.getContract('requestLoad');
      const idExist = await contract.evaluateTransaction('AssetExists', id);

      if (idExist.toString() == 'false') {
        return { err: `The asset ${id} does not exist` };
      } else {
        const result = await contract.submitTransaction(
          'UpdateStatusRequestLoad',
          id,
          newStatus,
          radicado,
          numberequest,
        );
        return { desc: 'Request Updated Load Successfully' };
      }
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
  }

  public async uploadFilesRequestLoad(wallet, ccp, id, files) {
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
      const contract = network.getContract('requestLoad');
      const idExist = await contract.evaluateTransaction('AssetExists', id);

      if (idExist.toString() == 'false') {
        return { err: `The asset ${id} does not exist` };
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
          'chargeFilesRequestLoad',
          id,
          JSON.stringify(filesRqLoad),
        );
        return { desc: 'Request Updated Load Successfully' };
      }
    } finally {
      // Disconnect from the gateway when the application is closing
      // This will close all connections to the network
      gateway.disconnect();
    }
  }
}
