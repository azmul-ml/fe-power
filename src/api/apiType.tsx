export type ApiParamsType = {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
};

export interface NameKey {
  key: string;
  name: string;
}

export interface ApiError {
  field: string;
}

export interface ApiException {
  errors: [ApiError];
  message: string;
}
