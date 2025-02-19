const apiScopes = ['public', 'admin'] as const;
export type ApiScope = (typeof apiScopes)[number];

export function isApiScope(value: unknown): value is ApiScope {
  return apiScopes.indexOf(value as ApiScope) !== -1;
}
