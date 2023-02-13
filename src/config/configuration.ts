import * as process from 'process';
import * as Joi from '@hapi/joi';

export default () => {
  const config = {
    server: {
      port: process.env.PORT,
      domainName: process.env.DOMAIN_NAME,
    },
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      databaseName: process.env.DB_NAME,
    },
    jwtSecret: process.env.JWT_SECRET,
    sendGridKey: process.env.SENDGRID_API_KEY,
  };
  const schema = Joi.object({
    server: {
      port: Joi.number().required().default(3000),
      domainName: Joi.string().required().default('localhost'),
    },
    database: {
      host: Joi.string().required(),
      port: Joi.number().required().default(5432),
      username: Joi.string().required(),
      password: Joi.string().required(),
      databaseName: Joi.string().required(),
    },
    jwtSecret: Joi.string().required(),
    sendGridKey: Joi.string().required(),
  });
  const validateResult = schema.validate(config);
  if (validateResult.error) {
    throw new Error(validateResult.error);
  } else {
    return config;
  }
};
