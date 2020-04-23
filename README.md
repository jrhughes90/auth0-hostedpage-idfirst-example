# auth0-idfirst-login-sample

Auth0's Sample for Identifier First Login using custom universal login.

[![License](https://img.shields.io/:license-mit-blue.svg?style=flat)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Documentation](#documentation)
- [Installation](#installation)
- [Contributing](#contributing)
- [Support + Feedback](#support--feedback)
- [Frequently Asked Questions](#frequently-asked-questions)
- [Vulnerability Reporting](#vulnerability-reporting)
- [What is Auth0](#what-is-auth0)
- [License](#license)

## Installation

1. Clone this repository
2. Run `npm install`
3. Run `npm run build`
4. Host the file from `/dist` on your server and refer it in the Hosted Login Page as

```html
<script src="/path/to/dist/bundle.js" />
```

5. In the hosted login page add the code

```html
<script>
  const config = JSON.parse(
    decodeURIComponent(escape(window.atob("@@config@@")))
  );
  new window.LoginWidget().init({
    pageConfig: config
  });
</script>
```

## Developing Locally

1. Clone this repository
2. Run `npm install`
3. Run `npm run start`
4. Inject the built JS Files into the hosted login page

5. In the hosted login page add the code

```html
<script>
  const config = JSON.parse(
    decodeURIComponent(escape(window.atob("@@config@@")))
  );
  new window.LoginWidget().init({
    pageConfig: config
  });
</script>
```

## Contributing

We appreciate feedback and contribution to this repo! Before you get started, please see the following:

- [Auth0's general contribution guidelines](https://github.com/auth0/open-source-template/blob/master/GENERAL-CONTRIBUTING.md)
- [Auth0's code of conduct guidelines](https://github.com/auth0/open-source-template/blob/master/CODE-OF-CONDUCT.md)

## Support + Feedback

For support or to provide feedback, please [raise an issue on our issue tracker](https://github.com/auth0/auth0-idfirst-login-sample/issues).

## Frequently Asked Questions

For a rundown of common issues you might encounter when using the SDK, please check out [the FAQ](https://github.com/auth0/auth0-idfirst-login-sample/blob/master/FAQ.md).

## Vulnerability Reporting

Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## What is Auth0?

Auth0 helps you to easily:

- implement authentication with multiple identity providers, including social (e.g., Google, Facebook, Microsoft, LinkedIn, GitHub, Twitter, etc), or enterprise (e.g., Windows Azure AD, Google Apps, Active Directory, ADFS, SAML, etc.)
- log in users with username/password databases, passwordless, or multi-factor authentication
- link multiple user accounts together
- generate signed JSON Web Tokens to authorize your API calls and flow the user identity securely
- access demographics and analytics detailing how, when, and where users are logging in
- enrich user profiles from other data sources using customizable JavaScript rules

[Why Auth0?](https://auth0.com/why-auth0)

## License

This project is licensed under the MIT license. See the [LICENSE](https://github.com/auth0/auth0-idfirst-login-sample/blob/master/LICENSE) file for more info.
