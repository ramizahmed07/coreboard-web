import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios';

// export interface ApiResponse<T> {
//   data: T;
//   meta?: {
//     hasMore: boolean;
//     nextCursor: null | string;
//   };
//   status: 'success' | 'error';
// }

interface AxiosConfig extends AxiosRequestConfig {
  includeHeaders?: boolean;
}

// default headers, part of every request
const defaults = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// utility to remove undefined values from parameters if GET request
const removeUndefinedFromParams = (data: any) =>
  data &&
  Object.keys(data).reduce((acc, key) => {
    if (data[key] !== undefined) {
      acc[key] = data[key];
    }
    return acc;
  }, {} as typeof data);

type RequestReturnType<
  T,
  IncludeHeaders extends boolean | undefined
> = IncludeHeaders extends true ? AxiosResponse<T> : T;

const request = async <
  T,
  IncludeHeaders extends boolean | undefined = undefined
>(
  endpoint: string,
  method: Method,
  config: AxiosConfig = {}
): Promise<RequestReturnType<T, IncludeHeaders>> => {
  const { data, headers, ...restConfig } = config;

  const result = await axios<T>({
    ...restConfig,
    url: `${import.meta.env.VITE_SERVER_BASE_URL}${endpoint}`,
    method,
    headers: { ...defaults.headers, ...headers },
    params: method === 'get' ? removeUndefinedFromParams(data) : undefined,
    data: method !== 'get' ? data : undefined,
    withCredentials: true,
  });

  if (config.includeHeaders) {
    return result as RequestReturnType<T, IncludeHeaders>;
  } else {
    return result.data as RequestReturnType<T, IncludeHeaders>;
  }
};

export const httpClient = {
  get: <T>(endpoint: string, config?: AxiosConfig) =>
    request<T>(endpoint, 'get', config),
  post: <T>(endpoint: string, config: AxiosConfig) =>
    request<T>(endpoint, 'post', config),
  patch: <T>(endpoint: string, config: AxiosConfig) =>
    request<T>(endpoint, 'patch', config),
  put: <T>(endpoint: string, config: AxiosConfig) =>
    request<T>(endpoint, 'put', config),
  delete: <T>(endpoint: string, config?: AxiosConfig) =>
    request<T>(endpoint, 'delete', config),
};
