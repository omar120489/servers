import { apiDelete, apiGet, apiPatch, apiPost } from 'utils/axios';
import type {
  ApiResponse,
  Contact,
  ContactCreateDto,
  ContactQuery,
  ContactUpdateDto,
  PaginatedResponse,
  UUID
} from 'types/api';

const BASE_PATH = '/api/contacts';

export async function listContacts(query?: ContactQuery): Promise<PaginatedResponse<Contact>> {
  return apiGet<PaginatedResponse<Contact>>(BASE_PATH, { params: query });
}

export async function getContact(id: UUID): Promise<Contact> {
  return apiGet<Contact>(`${BASE_PATH}/${id}`);
}

export async function createContact(payload: ContactCreateDto): Promise<Contact> {
  return apiPost<ContactCreateDto, Contact>(BASE_PATH, payload);
}

export async function updateContact(id: UUID, payload: ContactUpdateDto): Promise<Contact> {
  return apiPatch<ContactUpdateDto, Contact>(`${BASE_PATH}/${id}`, payload);
}

export async function deleteContact(id: UUID): Promise<ApiResponse<void>> {
  return apiDelete<ApiResponse<void>>(`${BASE_PATH}/${id}`);
}

export const contactsApi = {
  listContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact
};
