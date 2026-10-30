import { auth } from '@/infra/auth';

export type AppSession = typeof auth.$Infer.Session;
