// Mock Auth0 handlers for Storybook
export const mockAuth0 = {
  isAuthenticated: true,
  isLoading: false,
  user: {
    sub: 'auth0|123456789',
    name: 'John Doe',
    email: 'john.doe@example.com',
    picture: 'https://via.placeholder.com/100',
    email_verified: true,
  },
  getAccessTokenSilently: async () => 'mock_access_token',
  loginWithRedirect: async () => {
    // Login redirect triggered
  },
  logout: () => {
    // Logout triggered
  },
  getIdTokenClaims: async () => ({
    __raw: 'mock_id_token',
    sub: 'auth0|123456789',
    name: 'John Doe',
    email: 'john.doe@example.com',
  }),
};

export const mockAuthProvider = (children: React.ReactNode) => {
  return children;
};
