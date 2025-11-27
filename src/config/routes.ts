/**
 * Client routing configuration
 * Defines all available client routes dynamically
 */

export interface ClientRouteConfig {
  slug: string;
  path: string;
  name: string;
}

// Define all available client routes here
// As you add more clients, add them to this array
export const clientRoutes: ClientRouteConfig[] = [
  {
    slug: 'client1',
    path: '/client1',
    name: 'Client 1 Event',
  },
  // Add more clients here as needed
  // {
  //   slug: 'client2',
  //   path: '/client2',
  //   name: 'Client 2 Event',
  // },
];

// Get route by slug
export const getClientRoute = (slug: string): ClientRouteConfig | undefined => {
  return clientRoutes.find((route) => route.slug === slug);
};

// Get all client slugs
export const getClientSlugs = (): string[] => {
  return clientRoutes.map((route) => route.slug);
};

// Check if slug exists
export const isValidClientSlug = (slug: string): boolean => {
  return clientRoutes.some((route) => route.slug === slug);
};
