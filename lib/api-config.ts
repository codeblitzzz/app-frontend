// API Configuration for backend communication
// This allows the frontend to work with different backend URLs

declare const process: {
  env: {
    NEXT_PUBLIC_API_URL?: string;
  };
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    health: '/health',
    query: '/query',
    providers: '/providers',
    duplicates: '/duplicates',
    processCSV: '/process_csv',
    analytics: {
      specialtyExperience: '/analytics/specialty-experience',
      providersBySpecialty: '/analytics/providers-by-specialty',
      providersByState: '/analytics/providers-by-state'
    }
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

export default apiConfig;
