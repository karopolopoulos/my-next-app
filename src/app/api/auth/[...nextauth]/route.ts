import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: _getProviders(),
  session: {
    strategy: "jwt",
  },
});

function _getProviders() {
  /**
   * Returns different providers based on the environment variable
   * NEXT_PUBLIC_PROJX_USE_BASIC_CREDENTIALS basic credentials means it isn't going
   * to rely on an external provider to do authentication. Handy in dev and local
   * environments
   */
  return process.env.NEXT_PUBLIC_PROJX_USE_BASIC_CREDENTIALS
    ? [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            email: {
              label: "Email",
              type: "text",
              placeholder: "admin@projx.com",
            },
            password: {
              label: "Password",
              type: "password",
              placeholder: "admin",
            },
          },
          authorize: () => {
            return {
              id: "84159270-4d64-45a9-a285-6d83552083a8",
              name: "Admin",
              email: "admin@projx.com",
            };
          },
        }),
      ]
    : [
        CognitoProvider({
          clientId: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!,
          // This is blank because it doesn't make sense to use a client secret in a public facing page
          // Cognito is built to handle using its client without requiring a clientSecret.
          clientSecret: "",
          issuer: `https://cognito-idp.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID}`,
          client: {
            token_endpoint_auth_method: "none",
          },
        }),
      ];
}

export { handler as GET, handler as POST };
