var settings = require("./../settings");

CONFIG = {};
for(var key in settings) {
  if(settings.hasOwnProperty(key)) {
    CONFIG[key] = settings[key];
  }
}

/**
 * HTTP Codes
 */
LOGIN_REQUIRED = 601;

/**
 * Paths
 */
LIB_DIR = __dirname + '/';
DAOS_DIR = __dirname + '/../daos/';
IMPLS_DIR = __dirname + '/../impls/';

/**
 * Domain related
 */
DOMAIN_HOST = CONFIG.domain.host;
DOMAIN_NAME = CONFIG.domain.name;

/**
 * Environment related
 */
ENVIRONMENT = process.env.NODE_ENV;
IS_PROD = ENVIRONMENT == 'production';
