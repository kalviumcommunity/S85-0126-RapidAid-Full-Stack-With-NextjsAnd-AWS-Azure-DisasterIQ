export type Permission = "read" | "create" | "update" | "delete";


export const ROLES: Record<string, Permission[]> = {
  GOVERNMENT_ADMIN: ["read", "create", "update", "delete"],
  ADMIN: ["read", "create", "update"],
  EDITOR: ["read", "update"],
  VIEWER: ["read"],
};

