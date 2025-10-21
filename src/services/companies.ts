import { apiDelete, apiGet, apiPatch, apiPost } from 'utils/axios';
import type {
  ApiResponse,
  Company,
  CompanyCreateDto,
  CompanyQuery,
  CompanyUpdateDto,
  PaginatedResponse,
  UUID
} from 'types/api';

const BASE_PATH = '/api/companies';

export async function listCompanies(query?: CompanyQuery): Promise<PaginatedResponse<Company>> {
  return apiGet<PaginatedResponse<Company>>(BASE_PATH, { params: query });
}

export async function getCompany(id: UUID): Promise<Company> {
  return apiGet<Company>(`${BASE_PATH}/${id}`);
}

export async function createCompany(payload: CompanyCreateDto): Promise<Company> {
  return apiPost<CompanyCreateDto, Company>(BASE_PATH, payload);
}

export async function updateCompany(id: UUID, payload: CompanyUpdateDto): Promise<Company> {
  return apiPatch<CompanyUpdateDto, Company>(`${BASE_PATH}/${id}`, payload);
}

export async function deleteCompany(id: UUID): Promise<ApiResponse<void>> {
  return apiDelete<ApiResponse<void>>(`${BASE_PATH}/${id}`);
}

export const companiesApi = {
  listCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany
};
