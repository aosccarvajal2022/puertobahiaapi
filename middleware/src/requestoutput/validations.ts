const Ajv = require('ajv');
const ajv = new Ajv();

export class Validations {
  validate = async (body) => {
    const schema = {
      title: 'requestOutput',
      type: 'object',
      properties: {
        nitCustomAgency: { type: 'string', minLength: 1 },
        nitCustomer: { type: 'string', minLength: 1 },
        nitOfficial: { type: 'string', minLength: 1 },
        official: { type: 'string', minLength: 1 },
        nitOfficialAuthorized: { type: 'string', minLength: 1 },
        officialAuthorized: { type: 'string' },
        modalityOperation: { type: 'string', minLength: 1 },
        nitTransportCompany: { type: 'string', minLength: 1 },
        typeOperation: { type: 'string', minLength: 1 },
        replyEmail: { type: 'string', minLength: 1 },
        observation: { type: 'string' },
        radicado: { type: 'string' },
        requestNumber: { type: 'string' },
        drivers: {
          type: 'array',
          items: {
            type: 'object',
            allOf: [
              {
                properties: {
                  placaCabezote: { type: 'string' },
                  placaRemolque: { type: 'string' },
                  codigoEjes: { type: 'string' },
                  driverId: { type: 'string' },
                  destination: { type: 'string' },
                  suggestedDate: { type: 'string' },
                  suggestedTime: { type: 'string' },
                  cargoManifest: { type: 'string' },
                  cycle: { type: 'string' },
                  itemsToRemove: {
                    type: 'array',
                    items: {
                      type: 'object',
                      allOf: [
                        {
                          properties: {
                            NIUC: { type: 'string' },
                            VINReference: { type: 'string' },
                            lineItem: { type: 'string' },
                            quantity: { type: 'string' },
                          },
                          required: [
                            'NIUC',
                            'VINReference',
                            'lineItem',
                            'quantity',
                          ],
                        },
                      ],
                    },
                  },
                },
                required: [
                  'placaCabezote',
                  'placaRemolque',
                  'codigoEjes',
                  'driverId',
                  'destination',
                  'suggestedDate',
                  'suggestedTime',
                  'cargoManifest',
                  'cycle',
                  'itemsToRemove',
                ],
              },
            ],
          },
        },
      },
      required: [
        'nitCustomAgency',
        'nitCustomer',
        'nitOfficial',
        'official',
        'nitOfficialAuthorized',
        'officialAuthorized',
        'modalityOperation',
        'nitTransportCompany',
        'typeOperation',
        'replyEmail',
        'observation',
        'radicado',
        'requestNumber',
        
      ],
    };

    const validate = ajv.compile(schema);
  
    const valid = validate(body);
    console.log(body); 
    if (!valid) {
      const errors = [];
      for (const { message, instancePath: field } of validate.errors) {
        
        errors.push({ message, field });
      }
      return { status: false, errors: errors };
    }
    return { status: true };
  };
}
