export interface Realms {
  roles: string[]
}

export interface ResourceAccess {
  account: {
    roles: string[]
  }
}

export interface Claims {
  exp: number
  iat: number
  auth_time: number
  jti: string
  iss: string
  aud: string
  sub: string
  typ: string
  azp: string
  nonce: string
  session_state: string
  acr: string
  'allowed-origins': string[]
  realm_access: Realms
  resource_access: ResourceAccess
  scope: string
  sid: string
  email_verified: boolean
  name: string
  preferred_username: string
  given_name: string
  family_name: string
  email: string
}
