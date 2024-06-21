import { ConfigService } from '@nestjs/config'
import { KeycloakConnectModule } from 'nest-keycloak-connect'

export const AuthModule = KeycloakConnectModule.registerAsync({
  useFactory: async (configService: ConfigService) => {
    return {
      authServerUrl: configService.get('KEY_CLOAK_URL'),
      realm: configService.get('KEY_CLOAK_REALM'),
      clientId: configService.get('KEY_CLOAK_CLIENT_ID'),
      secret: configService.get('KEY_CLOAK_CLIENT_SECRET'),
      bearerOnly: true
    }
  },
  inject: [ConfigService]
})
