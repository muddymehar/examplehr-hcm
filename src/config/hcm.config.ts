export interface HcmConfig {
  baseUrl: string;
  degradationMode: 'STRICT' | 'OPTIMISTIC';
  circuitBreakerThreshold: number;
  circuitBreakerWindowMs: number;
  timeoutMs: number;
}

export const getHcmConfig = (): HcmConfig => ({
  baseUrl: process.env.HCM_BASE_URL || 'http://localhost:4000',
  degradationMode: (process.env.HCM_DEGRADATION_MODE as any) || 'OPTIMISTIC',
  circuitBreakerThreshold: parseInt(process.env.HCM_CIRCUIT_BREAKER_THRESHOLD || '5', 10),
  circuitBreakerWindowMs: parseInt(process.env.HCM_CIRCUIT_BREAKER_WINDOW_MS || '60000', 10),
  timeoutMs: parseInt(process.env.HCM_TIMEOUT_MS || '5000', 10),
});
