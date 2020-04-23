import { SocialStrategies } from "./SocialStrategies";
import passwordPolicies from "auth0-password-policies";

/**
 * Given Auth0 Page Config, Loads the connections using `<clientId>.js` file via
 * JSONP. This is basically a wrapper for JSONP
 * @param {Any} pageConfig
 *
 * @returns {Promise<Connection[]>}
 */
function loadConnections(pageConfig) {
  return new Promise((resolve, reject) => {
    if (window.Auth0) {
      throw new Error(
        "Failed to initialize, Auth0 Object already present on window, possible causes: multiple libraries are loaded, please check config"
      );
    }

    window.Auth0 = {
      setClient(config) {
        const connections = config.strategies
          .map(({ name, connections }) => {
            connections.forEach(connection => (connection.strategy = name));
            return connections;
          })
          .flat();
        resolve(connections);
      }
    };

    // Fetch the client configuration
    const script = document.createElement("script");
    script.src = `${pageConfig.clientConfigurationBaseUrl}client/${pageConfig.clientID}.js`;
    script.async = true;
    document.body.appendChild(script);

    setTimeout(
      () => reject(new Error("Failed to load")),
      pageConfig.loadTimeout || 10 * 1000
    );
  });
}

/**
 * Email validator
 * @param {String} email Email address to check if valid
 */
export function validateEmail(email) {
  // eslint-disable-next-line no-useless-escape
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

/**
 * Phone Validator this is the string that auth0 uses to validate this aswell
 * @param {String} phone Phone number to check if valid
 */
export function validatePhone(phone) {
  const re = /^\+[0-9]{1,15}$/;
  return re.test(phone);
}

const DEFAULT_CONNECTION_VALIDATION = { username: { min: 1, max: 15 } };

function formatConnectionValidation(connectionValidation = {}) {
  if (connectionValidation.username == null) {
    return null;
  }

  const validation = {
    ...DEFAULT_CONNECTION_VALIDATION,
    ...connectionValidation
  };
  const defaultMin = DEFAULT_CONNECTION_VALIDATION.username.min;
  const defaultMax = DEFAULT_CONNECTION_VALIDATION.username.max;

  validation.username.min = parseInt(validation.username.min, 10) || defaultMin;
  validation.username.max = parseInt(validation.username.max, 10) || defaultMax;

  if (validation.username.min > validation.username.max) {
    validation.username.min = defaultMin;
    validation.username.max = defaultMax;
  }

  return validation;
}

/**
 * ConnectionManager handles the connection layer, this will be helpful
 * when we get an endpoint. We can just replace the preloading code with
 * the endpoints response.
 */
export class ConnectionManager {
  static async create(pageConfig) {
    const connections = await loadConnections(pageConfig);
    const { getConnection } = pageConfig;
    return new ConnectionManager(connections, getConnection);
  }

  /**
   * Creates an instance of ClientResolver
   *
   * Note: A lot of the logic here is derived
   * https://github.com/auth0/lock/blob/10b68db110b60dd739b5151b88a6922bc501bed2/src/core/client/index.js#L109
   * @param {[Connection]} connections - List of Connections to resolve from
   * @param {(ConnectionManager, string): Promise<Connection>} getConnection - Helper function to get a connection from an async service etc
   */
  constructor(connections, getConnection) {
    this.connections = connections;
    this.socialConnections = connections.filter(({ strategy }) =>
      SocialStrategies.hasOwnProperty(strategy)
    );
    this.domainConnections = connections.filter(({ domain }) => !!domain);
    this.databaseConnections = connections.filter(
      ({ strategy }) => strategy === "auth0"
    );

    /**
     * Unpack domain connections
     */
    this.domainConnections.forEach(connection => {
      const domains = connection.domain_aliases || [];
      if (connection.domain) {
        domains.unshift(connection.domain);
      }
      connection.domains = domains;
    });

    /**
     * Unpack database connections
     */
    this.databaseConnections.forEach(connection => {
      connection.passwordPolicy =
        passwordPolicies[connection.passwordPolicy || "none"];
      if (
        connection.password_complexity_options &&
        connection.password_complexity_options.min_length
      ) {
        connection.passwordPolicy.length.minLength =
          connection.password_complexity_options.min_length;
      }
      connection.allowSignup =
        typeof connection.showSignup === "boolean"
          ? connection.showSignup
          : true;
      connection.allowForgot =
        typeof connection.showForgot === "boolean"
          ? connection.showForgot
          : true;
      connection.requireUsername =
        typeof connection.requires_username === "boolean"
          ? connection.requires_username
          : false;
      connection.validation = formatConnectionValidation(connection.validation);
    });
    this.passwordLessPhoneConnections = connections.filter(
      ({ strategy }) => strategy === "sms"
    );
    this.passwordLessEmailConnections = connections.filter(
      ({ strategy }) => strategy === "email"
    );

    this.getConnection = getConnection;
    this._ensureConfig();
    console.log(this);
  }

  _ensureConfig() {
    if (this.passwordLessPhoneConnections.length > 1) {
      console.warn(
        "There is > 1 passwordlessPhone connection configured, this configuration is not supported"
      );
    }

    if (this.passwordLessEmailConnections.length > 1) {
      console.warn(
        "There is > 1 passwordlessEmail connection configured, this configuration is not supported"
      );
    }

    if (this.databaseConnections.length > 1) {
      console.warn(
        "There is > 1 database connection configured, this configuration is not supported"
      );
    }
  }
  /**
   * @returns {Connection} instance of connection
   */
  get hasUsernameConnections() {
    return (
      this.databaseConnections[0] && this.databaseConnections[0].requireUsername
    );
  }

  /**
   * @returns {boolean}
   */
  get hasDomains() {
    return !!this.domainConnections.length;
  }

  /**
   * @returns {boolean}
   */
  get hasSocial() {
    return !!this.socialConnections.length;
  }

  /**
   * @returns {boolean}
   */
  get hasDatabase() {
    return !!this.databaseConnections.length;
  }

  /**
   * @returns {boolean}
   */
  get hasPasswordlessPhone() {
    return !!this.passwordLessPhoneConnections.length;
  }

  /**
   * @returns {boolean}
   */
  get hasPasswordlessEmail() {
    return !!this.passwordLessEmailConnections.length;
  }

  /**
   * This needs to be re-validated on evaluation
   * @returns {boolean}
   */
  get allowsSignup() {
    // If either email is enabled it'll show up
    if (this.hasPasswordlessEmail || this.hasPasswordlessPhone) {
      return true;
    }
    return this.getDatabaseConnection().allowsSignup;
  }

  /**
   * This returns if you can show the reset flow
   *
   * @returns {boolean}
   */
  get allowsReset() {
    if (!this.hasDatabase) {
      return false;
    }
    return this.getDatabaseConnection().showForgot;
  }

  /**
   * Given an identifier try and find the best match this usually
   * only helps finding connections for a given identifier. That
   * is it'll return
   *
   * SMS if there is a sms connection and the given identifier looks like
   * a phone number or can be a phone number.
   *
   * If enterprise connections are enabled this will return an enterprise
   * connection after resolving by domain names
   *
   * If these two aren't matched it'll call the getExternalConnections as
   * a last ditch attempt. Customers / External libs can use this to
   * extend.
   *
   * Finally it returns the default database connection
   *
   * @param {Connection} identifier - identifier to find the idp for
   */
  async getIdP(identifier) {
    if (!identifier) {
      return null;
    }

    const isPhoneNumber = validatePhone(identifier);
    const isEmail = validateEmail(identifier);

    // If we have any passwordless Connections
    if (isPhoneNumber && this.hasPasswordless) {
      return this.passwordLessPhoneConnections.find(
        ({ strategy }) => strategy === "sms"
      );
    }

    // Try to see if we can find a domain Match.
    if (isEmail) {
      // If we have a database connection find it
      if (this.hasDomains) {
        const domainConnection = this.domainConnections.find(({ domains }) =>
          domains.some(domain => identifier.endsWith(domain))
        );
        if (domainConnection) {
          return domainConnection;
        }
      }
    }

    if (this.getConnection) {
      return this.getConnection(this, identifier);
    }

    if (isEmail) {
      return this.databaseConnections[0];
    }

    if (isPhoneNumber) {
      return this.passwordLessPhoneConnections[0];
    }

    return null;
  }

  /**
   * @returns {Connection}
   */
  getDatabaseConnection() {
    return this.databaseConnections[0] || null;
  }
}
