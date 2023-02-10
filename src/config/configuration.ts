import * as process from 'process';
import * as Joi from '@hapi/joi';

export default () => {
  const config = {
    port: process.env.PORT || 3000,
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      databaseName: process.env.DB_NAME,
    },
    jwtSecret: process.env.JWT_SECRET,
  };
  const schema = Joi.object({
    port: Joi.number().required().default(3000),
    database: {
      host: Joi.string().required(),
      port: Joi.number().required().default(5432),
      username: Joi.string().required(),
      password: Joi.string().required(),
      databaseName: Joi.string().required(),
    },
    jwtSecret: Joi.string().required(),
  });
  const validateResult = schema.validate(config);
  if (validateResult.error) {
    throw new Error(validateResult.error);
  } else {
    return config;
  }
};
