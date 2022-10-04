import { OidcConfiguration } from '../services/config.service';

export class ServerConfig {
  environment: string;
  maintMsg: string;
  noticeMsg: string;
  oidc: OidcConfiguration;
  siteDown: boolean;
}
