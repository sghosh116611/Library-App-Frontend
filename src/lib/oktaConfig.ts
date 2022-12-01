export const oktaConfig = {
    clientId: '0oa7etdsyeUJ1HPan5d7',
    issuer: 'https://dev-81245269.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}