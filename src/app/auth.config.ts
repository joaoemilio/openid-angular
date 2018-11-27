import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {

  // Url of the Identity Provider
  issuer: 'https://localhost:9443/oauth2/token',

  // URL of the SPA to redirect the user to after login
  redirectUri: 'http://localhost:4200',
  

  // The SPA's id. The SPA is registerd with this id at the auth-server
  clientId: 'XffqIZj7bEf_pxuhardsB6hO1U0a',

  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  scope: 'openid profile email voucher',
}