import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as FabricCAServices from 'fabric-ca-client';
import { Gateway, Wallets, X509Identity } from 'fabric-network';

export class ConfigService {
  private envData: any;
  private environment: string;
  private gateway: Gateway;

  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.envData = dotenv.parse(fs.readFileSync(`${this.environment}.env`));
  
  }

  
  jwt = require('jsonwebtoken');

  



  public async createGateway(ccp, wallet)
  {

    this.gateway = new Gateway();
    try{
      await this.gateway.connect(ccp, {
        wallet,
        identity: 'appUser',
        discovery: { enabled: true, asLocalhost: true },
      });

      
    
      return this.gateway;
    }
    catch(error){
      console.error(`Failed to Evaluate transaction:  + ${error}`);
    }
  
  }

  public async getContract(){
  // Get the network (channel) our contract is deployed to.
    const network = await this.gateway.getNetwork('mychannel');
    
    // Get the contract from the network.
    const contract = network.getContract('document');

    return contract;
  }

  

  public async validateToken(token: string) {
    try {
      const config = new ConfigService();
      const key = config.get('KEYJWT') || 'KEYPUERTOBAHIA2022';

      if (token) {
        
        const respuesta = await this.jwt.verify(token, key, (err, decoded) => {
          if (err) {
            return 'Token no Valida.';
          }
          
          if(decoded)
          {
            return 'Successfully Verified';
          }
        });

        return respuesta;
      } else {
        return 'Token no proveída.';
      }
    } catch (err) {
      return 'Token expirado.';
    }
  }

  async ConfigNetwork() {
    const ruta = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'test-network',
      'organizations',
      'peerOrganizations',
      'org1.example.com',
      'connection-org1.json',
    );
    // load the network configuration
    const ccp = JSON.parse(fs.readFileSync(ruta, 'utf8'));
    // Create a new CA client for interacting with the CA.
    const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName,
    );
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    const identity = await wallet.get('admin');
    const userIdentity = await wallet.get('appUser');
    if (!identity) {
      // Check to see if we've already enrolled the admin user.
      const identity = await wallet.get('admin');

      const enrollment = await ca.enroll({
        enrollmentID: 'admin',
        enrollmentSecret: 'adminpw',
      });
      const x509Identity: X509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
      };
      await wallet.put('admin', x509Identity);
    }

    if (!userIdentity) {
      const adminIdentity = await wallet.get('admin');
      const provider = wallet
        .getProviderRegistry()
        .getProvider(adminIdentity.type);
      const adminUser = await provider.getUserContext(adminIdentity, 'admin');
      // Register the user, enroll the user, and import the new identity into the wallet.
      const secret = await ca.register(
        {
          affiliation: 'org1.department1',
          enrollmentID: 'appUser',
          role: 'client',
        },
        adminUser,
      );
      const enrollment = await ca.enroll({
        enrollmentID: 'appUser',
        enrollmentSecret: secret,
      });
      const x509Identity: X509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: 'Org1MSP',
        type: 'X.509',
      };
      await wallet.put('appUser', x509Identity);
      console.log(
        'Successfully registered and enrolled admin user "appUser" and imported it into the wallet',
      );
    }

    return { wallet, ccp };
  }

  get(key: string): any {
    return this.envData[key];
  }

  isDev(): boolean {
    return this.environment === 'development';
  }

  isProd(): boolean {
    return this.environment === 'production';
  }
}
