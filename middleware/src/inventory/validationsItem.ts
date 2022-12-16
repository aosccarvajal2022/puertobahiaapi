const Ajv = require('ajv');
const ajv = new Ajv();

export class ValidationsItem {
  validate = async (body) => {
    const schema = {
      title: 'inventory',
      type: 'object',
      properties: {
        inventoryId: { type: 'string' },
        BLMaster: { type: 'string' },
        NIUC: { type: 'string' },
        NIUCMaster: { type: 'string' },
        VINReferenceSerie: { type: 'string' },
        WeightAdvertised: { type: 'string' },
        amountReceived: { type: 'string' },
        balance: { type: 'string' },
        brand: { type: 'string' },
        chargingDocument: { type: 'string' },
        color: { type: 'string' },
        consignee: { type: 'string' },
        containerNumber: { type: 'string' },
        daysPort: { type: 'string' },
        description: { type: 'string' },
        entryDate: { type: 'string' }, //
        formalities: { type: 'string' },
        line: { type: 'string' },
        lineItem: { type: 'string' },
        loadDisposition: { type: 'string' },
        model: { type: 'string' },
        portDischarge: { type: 'string' },
        portLoading: { type: 'string' },
        position: { type: 'string' },
        receivedWeight: { type: 'string' },
        remarks: { type: 'string' },
        stamps: { type: 'string' },
        typeApplication: { type: 'string' },
        typeLoad: { type: 'string' },
        typeOperation: { type: 'string' },
        typePackaging: { type: 'string' },
        typeProduct: { type: 'string' },
        volumeAdvertised: { type: 'string' },
        volumeReceived: { type: 'string' },
        volumeStock: { type: 'string' },
        weightStock: { type: 'string' },
      },
      required: [
        'BLMaster',
        'NIUC',
        'NIUCMaster',
        'VINReferenceSerie',
        'WeightAdvertised',
        'amountReceived',
        'balance',
        'brand',
        'chargingDocument',
        'color',
        'consignee',
        'containerNumber',
        'daysPort',
        'description',
        'entryDate',
        'formalities',
        'line',
        'lineItem',
        'loadDisposition',
        'model',
        'portDischarge',
        'portLoading',
        'position',
        'receivedWeight',
        'remarks',
        'stamps',
        'typeApplication',
        'typeLoad',
        'typeOperation',
        'typePackaging',
        'typeProduct',
        'volumeAdvertised',
        'volumeReceived',
        'volumeStock',
        'weightStock',
      ],
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
