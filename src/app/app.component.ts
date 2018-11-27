import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { JwksValidationHandler } from 'angular-oauth2-oidc';
import { OAuthService } from 'angular-oauth2-oidc';
import {environment} from '../environments/environment';
import { authConfig } from './auth.config';

@Component({
  selector: 'qs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  accessToken = "";
  validAccessToken = false;
  idToken = "";
  jsonIdToken: any;
  validIdToken = false;
  username: string;
  title: string;
  exp: Date;
  logotipo: string;

  constructor(      private oauthService: OAuthService, 
      private _iconRegistry: MatIconRegistry,
              private _domSanitizer: DomSanitizer) {
    this._iconRegistry.addSvgIconInNamespace('assets', 'teradata',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/teradata.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'github',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/github.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'covalent',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/covalent.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'covalent-mark',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/covalent-mark.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'teradata-ux',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/teradata-ux.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'appcenter',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/appcenter.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'listener',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/listener.svg'));
    this._iconRegistry.addSvgIconInNamespace('assets', 'querygrid',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/querygrid.svg'));
      this.configureWithNewConfigApi();

    }
    
    private configureWithNewConfigApi() {
      this.oauthService.configure(authConfig);
      this.oauthService.tokenValidationHandler = new JwksValidationHandler();
      this.oauthService.strictDiscoveryDocumentValidation = false;
      let self = this;
      this.oauthService.loadDiscoveryDocument().then(() => {
        this.oauthService.tryLogin({
          onTokenReceived: context => {
              environment.access_token = context.accessToken;
              this.load( context.accessToken );
              let claims = this.oauthService.getIdentityClaims();
          },
          onLoginError: (err) => {
              console.log('onLoginError:', err);
          }
        }).then(() => {
            if (!this.oauthService.hasValidIdToken() || !this.oauthService.hasValidAccessToken()) {
                this.oauthService.initImplicitFlow();
            } else {
              this.load( this.oauthService.getAccessToken() );
            }
        });      
      });
    }

  ngOnInit(): void {
    console.log('ngOnInit()');
    //this.authenticate();
  }

  public refreshToken() {
    var d = new Date();
    var n = d.getTime();
    this.oauthService.scope = environment.openid.scope + ' ' + n;
    this.oauthService.silentRefresh();
  }

  public authenticate() {
    console.log('authenticate');
    this.oauthService.strictDiscoveryDocumentValidation = environment.openid.strictDiscoveryDocumentValidation;
    this.oauthService.issuer = environment.openid.issuer;
    this.oauthService.loginUrl = environment.openid.loginUrl;
    this.oauthService.redirectUri = environment.openid.redirectUri;
    this.oauthService.clientId = environment.openid.clientId;
    this.oauthService.scope = environment.openid.scope;
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.oidc = true;
    this.oauthService.silentRefreshRedirectUri = environment.openid.redirectUri;
    this.oauthService.setStorage(sessionStorage);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocument().then(() => {
      this.oauthService.tryLogin({
        onTokenReceived: context => {
          environment.access_token = context.accessToken;
          this.load( context.accessToken );
          let claims = this.oauthService.getIdentityClaims();
        },
        onLoginError: (err) => {
          console.log('onLoginError:', err);
        }
      }).then(() => {
        console.log('then do tryLogin');
          if (!this.oauthService.hasValidIdToken() || !this.oauthService.hasValidAccessToken()) {
            console.log( 'antes do init');
            this.oauthService.initImplicitFlow();
            console.log('depois do init');
          } else {
            console.log('else do validtoken');
            console.log( this.oauthService.getAccessToken() );
            this.load( this.oauthService.getAccessToken() );
          }
      });
    });
  }

  async load( accessToken: string ): Promise<void> {

    console.log( "validate jwks: " + this.oauthService.hasValidIdToken);
    this.validAccessToken = this.oauthService.hasValidAccessToken();
    this.validIdToken = this.oauthService.hasValidIdToken();
    this.accessToken = this.oauthService.getAccessToken();
    this.idToken = this.oauthService.getIdToken();
    let _idtoken = this.parseJwt( this.idToken );
    this.jsonIdToken = JSON.stringify(_idtoken);
    console.log( "exp: " + _idtoken.exp );
    this.exp = new Date( _idtoken.exp );

  }

  public parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  public ConvertToDatetime(dateValue) {
    var regex = /-?\d+/;
    var match = regex.exec(dateValue);
    return new Date(parseInt(match[0]));
  }

}
