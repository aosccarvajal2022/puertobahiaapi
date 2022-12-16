const Ajv = require('ajv');
const ajv = new Ajv();

export class Validations {
  validate = async (body) => {
    const schema = {
      title: 'authorization',
      type: 'object',
      properties: {
        nitCustomAgency: { type: 'string', minLength: 1 },
        nitCustomer: { type: 'string', minLength: 1 },
        nitOfficial: { type: 'string', minLength: 1 },
        official: { type: 'string', minLength: 1 },
        nitTransportCompany: { type: 'string', minLength: 1 },
        noAuthorizationAD: { type: 'string' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            allOf: [
              {
                properties: {
                  NIUC: { type: 'string' },
                  VINReference: { type: 'string' },
                  lineItem: { type: 'string' },
                  authorizedQuantity: { type: 'string' },
                  description: { type: 'string' },
                  codeIMO: { type: 'string' },
                  codeUM: { type: 'string' },
                },
                required: [
                  'NIUC',
                  'VINReference',
                  'lineItem',
                  'authorizedQuantity',
                  'description',
                  'codeIMO',
                  'codeUM',
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
        'nitTransportCompany',
        'noAuthorizationAD',
        'items',
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
