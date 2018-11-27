// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  user_info_url: "https://localhost:9443/oauth2/userinfo",
  openid : {
    strictDiscoveryDocumentValidation : false,
    discovery_url : 'https://localhost:9443/oauth2/token/.well-known/openid-configuration',
    issuer : 'https://localhost:9443/oauth2/token',
    loginUrl : "https://localhost:9443/oauth2/authorize",
    redirectUri : "http://localhost:4200",
    clientId : "XffqIZj7bEf_pxuhardsB6hO1U0a",
    scope : "openid profile",
    oidc : true
  },
  access_token: ""
};
