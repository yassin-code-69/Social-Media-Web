import { AuthenticatedUser } from "@/middleware/auth";

export interface AppVariables {
  user?: AuthenticatedUser;
  requestId: string;
}

export interface AppEnv {
  Variables: AppVariables;
}
