import { supabase } from "@/integrations/supabase/client";

/**
 * Generic Supabase data-access layer.
 * Works with any table the user is allowed to query under RLS.
 *
 * NOTE: TableName is intentionally typed loosely (string) so this layer
 * remains reusable across schemas. For per-table type safety, prefer the
 * domain-specific services in this folder (voiceNotes, customers, tags).
 */

export interface ListOptions {
  filters?: Record<string, unknown>;
  search?: { column: string; query: string };
  orderBy?: { column: string; ascending?: boolean };
  page?: number;
  pageSize?: number;
  select?: string;
}

export class DbError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "DbError";
  }
}

function log(scope: string, ...args: unknown[]) {
  if (import.meta.env.DEV) console.debug(`[db:${scope}]`, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tbl = (name: string) => (supabase as any).from(name);

export async function getAll<T = unknown>(
  tableName: string,
  opts: ListOptions = {}
): Promise<{ rows: T[]; count: number }> {
  const { filters = {}, search, orderBy, page = 0, pageSize = 50, select = "*" } = opts;
  let q = tbl(tableName).select(select, { count: "exact" });

  for (const [k, v] of Object.entries(filters)) {
    if (v === undefined || v === null || v === "") continue;
    q = q.eq(k, v);
  }
  if (search?.query?.trim()) q = q.ilike(search.column, `%${search.query.trim()}%`);
  if (orderBy) q = q.order(orderBy.column, { ascending: orderBy.ascending ?? false });
  if (pageSize) q = q.range(page * pageSize, page * pageSize + pageSize - 1);

  const { data, error, count } = await q;
  if (error) {
    log(tableName, "getAll error", error);
    throw new DbError(error.message, error);
  }
  return { rows: (data ?? []) as T[], count: count ?? 0 };
}

export async function getById<T = unknown>(tableName: string, id: string, select = "*") {
  const { data, error } = await tbl(tableName).select(select).eq("id", id).maybeSingle();
  if (error) throw new DbError(error.message, error);
  return data as T | null;
}

export async function createRecord<T = unknown>(tableName: string, payload: Partial<T>) {
  const { data, error } = await tbl(tableName).insert(payload).select().single();
  if (error) throw new DbError(error.message, error);
  return data as T;
}

export async function updateRecord<T = unknown>(
  tableName: string,
  id: string,
  patch: Partial<T>
) {
  const { data, error } = await tbl(tableName).update(patch).eq("id", id).select().single();
  if (error) throw new DbError(error.message, error);
  return data as T;
}

export async function deleteRecord(tableName: string, id: string) {
  const { error } = await tbl(tableName).delete().eq("id", id);
  if (error) throw new DbError(error.message, error);
  return true;
}