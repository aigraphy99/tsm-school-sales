import {
  School,
  Contact,
  Activity,
  Opportunity,
  ResearchJob,
  WhatsAppMessage,
  MessageTemplate,
  DataConflict,
  AuditLogItem,
  User,
  Territory,
  NextActionItem,
  DailyStats,
  Evidence,
  DuplicateCluster
} from './types.js';

export async function fetchMe(): Promise<{ user: User; availableUsers: User[]; territories: Territory[] }> {
  const res = await fetch('/api/auth/me');
  return res.json();
}

export async function switchUser(userId: string): Promise<{ success: boolean; user: User }> {
  const res = await fetch('/api/auth/switch-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  return res.json();
}

export async function fetchSchools(params?: {
  search?: string;
  territoryId?: string;
  board?: string;
  priority?: string;
  stage?: string;
  city?: string;
  unverifiedOnly?: boolean;
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<{ schools: School[]; total: number; page: number; limit: number; totalPages: number }> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.territoryId) query.set('territoryId', params.territoryId);
  if (params?.board) query.set('board', params.board);
  if (params?.priority) query.set('priority', params.priority);
  if (params?.stage) query.set('stage', params.stage);
  if (params?.city) query.set('city', params.city);
  if (params?.unverifiedOnly) query.set('unverifiedOnly', 'true');
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.sortField) query.set('sortField', params.sortField);
  if (params?.sortOrder) query.set('sortOrder', params.sortOrder);

  const res = await fetch(`/api/schools?${query.toString()}`);
  return res.json();
}

export async function fetchSchoolById(id: string): Promise<any> {
  const res = await fetch(`/api/schools/${id}`);
  return res.json();
}

export async function updateSchool(id: string, updates: Partial<School>): Promise<School> {
  const res = await fetch(`/api/schools/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return res.json();
}

export async function updateSchoolStage(id: string, stage: string): Promise<School> {
  const res = await fetch(`/api/schools/${id}/stage`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage })
  });
  return res.json();
}

export async function addContact(contact: Omit<Contact, 'id'>): Promise<Contact> {
  const res = await fetch('/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contact)
  });
  return res.json();
}

export async function updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
  const res = await fetch(`/api/contacts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return res.json();
}

export async function logActivity(data: {
  schoolId: string;
  type: string;
  title: string;
  description: string;
  nextFollowUpDate?: string;
  nextFollowUpAction?: string;
}): Promise<Activity> {
  const res = await fetch('/api/activities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchDashboardStats(): Promise<DailyStats> {
  const res = await fetch('/api/dashboard/stats');
  return res.json();
}

export async function fetchNextActions(): Promise<NextActionItem[]> {
  const res = await fetch('/api/dashboard/next-actions');
  return res.json();
}

export async function fetchTemplates(): Promise<MessageTemplate[]> {
  const res = await fetch('/api/templates');
  return res.json();
}

export async function sendWhatsAppMessage(data: {
  schoolId: string;
  recipientPhone: string;
  recipientName: string;
  designation?: string;
  templateId?: string;
  customText?: string;
}): Promise<{ success: boolean; message: WhatsAppMessage; whatsappUrl: string }> {
  const res = await fetch('/api/whatsapp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function simulateWhatsAppStatus(messageId: string, newStatus: string): Promise<WhatsAppMessage> {
  const res = await fetch('/api/whatsapp/simulate-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messageId, newStatus })
  });
  return res.json();
}

export async function fetchWhatsAppMessages(): Promise<WhatsAppMessage[]> {
  const res = await fetch('/api/whatsapp/messages');
  return res.json();
}

export async function fetchResearchJobs(): Promise<ResearchJob[]> {
  const res = await fetch('/api/research/jobs');
  return res.json();
}

export async function startSchoolResearch(schoolId: string): Promise<ResearchJob> {
  const res = await fetch('/api/research/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ schoolId })
  });
  return res.json();
}

export async function startBatchResearch(count?: number, schoolIds?: string[]): Promise<any> {
  const res = await fetch('/api/research/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count, schoolIds })
  });
  return res.json();
}

export async function retryFailedResearch(): Promise<{ retried: number }> {
  const res = await fetch('/api/research/retry-failed', { method: 'POST' });
  return res.json();
}

export async function fetchConflicts(): Promise<DataConflict[]> {
  const res = await fetch('/api/research/conflicts');
  return res.json();
}

export async function resolveConflict(conflictId: string, resolution: 'KEEP_INTERNAL' | 'ACCEPT_WEB'): Promise<any> {
  const res = await fetch('/api/research/resolve-conflict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conflictId, resolution })
  });
  return res.json();
}

export async function previewCsv(rawCsvText: string): Promise<any> {
  const res = await fetch('/api/import/preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawCsvText })
  });
  return res.json();
}

export async function commitImport(rows: any[], territoryId?: string): Promise<{ success: boolean; addedCount: number }> {
  const res = await fetch('/api/import/commit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows, territoryId })
  });
  return res.json();
}

export async function fetchAuditLogs(): Promise<AuditLogItem[]> {
  const res = await fetch('/api/audit-logs');
  return res.json();
}

export async function callAiAssistant(schoolId: string, action: string, promptText?: string): Promise<{ output: string }> {
  const res = await fetch('/api/ai/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ schoolId, action, promptText })
  });
  return res.json();
}

export async function checkTruecallerNumber(params: {
  phone: string;
  targetName?: string;
  designation?: string;
  schoolName?: string;
}): Promise<any> {
  const res = await fetch('/api/verification/truecaller/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  return res.json();
}

export async function verifyContactTruecaller(contactId: string): Promise<{ success: boolean; contact: Contact; verification: any }> {
  const res = await fetch(`/api/verification/truecaller/verify-contact/${contactId}`, {
    method: 'POST'
  });
  return res.json();
}

export async function batchVerifyTruecaller(): Promise<{ success: boolean; verifiedCount: number; summary: any }> {
  const res = await fetch('/api/verification/truecaller/batch-verify', {
    method: 'POST'
  });
  return res.json();
}

export async function fetchTruecallerStats(): Promise<{
  totalContacts: number;
  verifiedContacts: number;
  unverifiedContacts: number;
  flaggedContacts: number;
  whatsAppVerified: number;
  principals: { total: number; verified: number; accuracyPct: number };
  coordinators: { total: number; verified: number; accuracyPct: number };
}> {
  const res = await fetch('/api/verification/truecaller/stats');
  return res.json();
}

export async function fetchFeatureConfig(): Promise<{
  config: import('./types.js').LiveFeatureConfig;
  history: import('./types.js').LiveChangeRecord[];
}> {
  const res = await fetch('/api/features/config');
  return res.json();
}

export async function updateFeatureConfigApi(params: {
  updates: Partial<import('./types.js').LiveFeatureConfig>;
  author?: string;
  title?: string;
  description?: string;
  category?: string;
}): Promise<{
  config: import('./types.js').LiveFeatureConfig;
  changeRecord: import('./types.js').LiveChangeRecord;
}> {
  const res = await fetch('/api/features/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  return res.json();
}

export async function rollbackFeatureChange(changeId: string, author?: string): Promise<any> {
  const res = await fetch('/api/features/rollback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ changeId, author })
  });
  return res.json();
}

export async function executeAiLiveBotCommand(command: string, author?: string): Promise<{
  success: boolean;
  message: string;
  changeRecord?: import('./types.js').LiveChangeRecord;
  revertedChange?: import('./types.js').LiveChangeRecord;
  config: import('./types.js').LiveFeatureConfig;
}> {
  const res = await fetch('/api/ai/live-bot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command, author })
  });
  return res.json();
}

export async function updateUserProfile(id: string, updates: Partial<User>): Promise<User> {
  const res = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return res.json();
}

// Master Admin, Deduplication, Fees & Web Verification
export async function resetDatabaseToMaster(): Promise<{ success: boolean; message: string; schoolCount: number; contactCount: number }> {
  const res = await fetch('/api/admin/reset-database', {
    method: 'POST'
  });
  return res.json();
}

export async function fetchDuplicateClusters(): Promise<{ clusters: import('./types.js').DuplicateCluster[]; count: number; totalDuplicates: number }> {
  const res = await fetch('/api/admin/duplicates');
  return res.json();
}

export async function resolveDuplicateCluster(params: {
  clusterId: string;
  keepSchoolId: string;
  mergeContacts?: boolean;
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/admin/resolve-duplicate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  return res.json();
}

export async function updateSchoolFee(schoolId: string, feeOverride: Partial<import('./types.js').School['feeOverride']>): Promise<{ success: boolean; school: School }> {
  const res = await fetch(`/api/admin/schools/${schoolId}/fee`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feeOverride)
  });
  return res.json();
}

export async function batchUpdateSchoolFees(schoolIds: string[], feeOverride: Partial<import('./types.js').School['feeOverride']>): Promise<{ success: boolean; updatedCount: number }> {
  const res = await fetch('/api/admin/schools/batch-fees', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ schoolIds, feeOverride })
  });
  return res.json();
}

export async function webVerifySchoolApi(schoolId: string): Promise<{ success: boolean; school: School; evidence: Evidence; message: string }> {
  const res = await fetch(`/api/schools/${schoolId}/web-verify`, {
    method: 'POST'
  });
  return res.json();
}

export async function batchWebVerifySchools(schoolIds?: string[]): Promise<{ success: boolean; verifiedCount: number; totalRequested: number }> {
  const res = await fetch('/api/schools/batch-web-verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ schoolIds })
  });
  return res.json();
}

export async function fullUpdateSchoolApi(schoolId: string, data: any): Promise<{ success: boolean; school: School; contacts: Contact[] }> {
  const res = await fetch(`/api/schools/${schoolId}/full-update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}


