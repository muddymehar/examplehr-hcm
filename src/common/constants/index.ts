export const LEAVE_TYPES = {
  ANNUAL: 'annual',
  SICK: 'sick',
  PERSONAL: 'personal',
  UNPAID: 'unpaid',
};

export const TIME_OFF_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

export const SYNC_TYPES = {
  TIME_OFF_APPROVAL: 'time_off_approval',
  BALANCE_SYNC: 'balance_sync',
  BATCH_RECONCILIATION: 'batch_reconciliation',
};

export const AUDIT_ACTIONS = {
  BALANCE_INITIALIZED: 'balance_initialized',
  BALANCE_UPDATED: 'balance_updated',
  BALANCE_DEDUCTED: 'balance_deducted',
  BALANCE_RESTORED: 'balance_restored',
  BALANCE_SYNCED: 'balance_synced',
  BALANCE_RECONCILED: 'balance_reconciled',
};
