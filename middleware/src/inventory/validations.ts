const Ajv = require('ajv');
const ajv = new Ajv();

export class Validations {
  validate = async (body) => {
    const schema = {
      title: 'document',
      type: 'object',
      properties: {
        recalada: { type: 'string' },
        maritimeAgency: { type: 'string' },
        motonave: { type: 'string' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            allOf: [
              {
                properties: {
                  typeApplication: { type: 'string' },
                  NIUC: { type: 'string' },
                  chargingDocument: { type: 'string' },
                  lineItem: { type: 'string' },
                  consignee: { type: 'string' },
                  typeLoad: { type: 'string' },
                  typeProduct: { type: 'string' },
                  typePackaging: { type: 'string' },
                  WeightAdvertised: { type: 'string' },
                  receivedWeight: { type: 'string' },
                  volumeAdvertised: { type: 'string' },
                  VINReferenceSerie: { type: 'string' },
                  loadDisposition: { type: 'string' },
                  brand: { type: 'string' },
                  description: { type: 'string' },
                  BLMaster: { type: 'string' },
                  NIUCMaster: { type: 'string' },
                  entryDate: { type: 'string' },
                  model: { type: 'string' },
                  amountReceived: { type: 'string' },
                  balance: { type: 'string' },
                  position: { type: 'string' },
                  portDischarge: { type: 'string' },
                  portLoading: { type: 'string' },
                  daysPort: { type: 'string' },
                  color: { type: 'string' },
                  line: { type: 'string' },
                  containerNumber: { type: 'string' },
                  stamps: { type: 'string' },
                  remarks: { type: 'string' },
                  formalities: { type: 'string' },
                  typeOperation: { type: 'string' },
                  weightStock: { type: 'string' },
                  volumeReceived: { type: 'string' },
                  volumeStock: { type: 'string' },
                },
                required: [
                  'typeApplication',
                  'NIUC',
                  'chargingDocument',
                  'lineItem',
                  'consignee',
                  'typeLoad',
                  'typeProduct',
                  'typePackaging',
                  'WeightAdvertised',
                  'receivedWeight',
                  'volumeAdvertised',
                  'VINReferenceSerie',
                  'loadDisposition',
                  'brand',
                  'description',
                  'BLMaster',
                  'NIUCMaster',
                  'entryDate',
                  'model',
                  'amountReceived',
                  'balance',
                  'position',
                  'portDischarge',
                  'portLoading',
                  'daysPort',
                  'color',
                  'line',
                  'containerNumber',
                  'stamps',
                  'remarks',
                  'formalities',
                  'typeOperation',
                  'weightStock',
                  'volumeReceived',
                  'volumeStock',
                ],
              },
            ],
          },
        },
      },
      required: ['recalada', 'maritimeAgency', 'motonave', 'items'],
    };

    const validate = ajv.compile(schema);
    const valid = validate(body);
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
