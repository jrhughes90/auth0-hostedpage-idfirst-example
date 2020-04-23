import auth0 from "auth0-js";

/**
 * Basically a Promise + extra wrapper for hosted-pages-js
 *
 *
 * @note: Some of this uses the following.
 * https://auth0.github.io/auth0.js/web-auth_hosted-pages.js.html
 */
export class UniversalLogin {
  constructor(config) {
    this.auth0 = new auth0.WebAuth({
      domain: config.auth0Domain,
      clientID: config.clientID,
      redirectUri: config.callbackURL,
      responseType: config.extraParams.response_type,
      scope: config.extraParams.scope,
      state: config.extraParams.state,
      nonce: config.extraParams.nonce,
      _csrf: config.extraParams._csrf,
      audience: config.extraParams.audience,
      overrides: { __tenant: config.auth0Tenant }
    });
  }

  /**
   * Wrapper for change password
   * @param {auth0.ChangePasswordOptions} options
   */
  changePassword(options) {
    return new Promise((resolve, reject) => {
      this.auth0.changePassword(options, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
  }

  /**
   * Wrapper for HostedLoginpage.signup method
   * @param {auth0.DbSignUpOptions} options
   */
  signup(options) {
    return new Promise((resolve, reject) => {
      this.auth0.signup(options, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
  }

  /**
   * Wrapper for passwordlessStart
   * @param {auth0.PasswordlessStartOptions} options
   */
  passwordlessStart(options) {
    return new Promise((resolve, reject) => {
      this.auth0.passwordlessStart(options, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
  }

  /**
   * Wrapper for HostedLoginPage's passwordless login
   * @param {auth0.PasswordlessLoginOptions} options
   */
  passwordlessLogin(options) {
    return new Promise((resolve, reject) => {
      this.auth0.passwordlessLogin(options, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
  }

  /**
   * Wrapper for login
   * @param {auth0.DefaultDirectoryLoginOptions} options
   */
  login(options) {
    return new Promise((resolve, reject) => {
      this.auth0.login(options, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
  }

  /**
   * Wrapper for /authorize
   * @param {auth0.AuthorizeOptions} options
   */
  federate(options) {
    return new Promise((resolve, reject) => {
      this.auth0.authorize(options, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
  }
}
