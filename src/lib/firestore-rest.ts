import { firebaseConfig } from "./firebase-config";

// Server-side reads for the public website, over the Firestore REST API with `fetch`.
// That keeps Next's fetch cache (60 s + revalidatePath after an admin save) and avoids a
// long-lived SDK connection during rendering. Rules only allow reading published/enabled docs.
const PROJECT = firebaseConfig.projectId;
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
const REVALIDATE_SECONDS = 60;

type Value = {
  stringValue?: string; integerValue?: string; doubleValue?: number; booleanValue?: boolean;
  timestampValue?: string; nullValue?: null; arrayValue?: { values?: Value[] }; mapValue?: { fields?: Record<string, Value> };
};
type RawDoc = { name: string; fields?: Record<string, Value> };

function decode(v: Value): unknown {
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("timestampValue" in v) return v.timestampValue;
  if ("arrayValue" in v) return (v.arrayValue?.values ?? []).map(decode);
  if ("mapValue" in v) return Object.fromEntries(Object.entries(v.mapValue?.fields ?? {}).map(([k, x]) => [k, decode(x)]));
  return null;
}

const toDoc = <T>(d: RawDoc): T & { id: string } =>
  ({ id: d.name.split("/").pop()!, ...Object.fromEntries(Object.entries(d.fields ?? {}).map(([k, v]) => [k, decode(v)])) }) as T & { id: string };

/** Docs of `collection` where every `equals` field matches. Returns null when Firestore is unreachable or refuses. */
export async function queryDocs<T>(collection: string, equals: Record<string, string | boolean>): Promise<(T & { id: string })[] | null> {
  const filters = Object.entries(equals).map(([field, value]) => ({
    fieldFilter: {
      field: { fieldPath: field }, op: "EQUAL",
      value: typeof value === "boolean" ? { booleanValue: value } : { stringValue: value },
    },
  }));
  try {
    const res = await fetch(`${BASE}:runQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: collection }],
          where: filters.length === 1 ? filters[0] : { compositeFilter: { op: "AND", filters } },
        },
      }),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as { document?: RawDoc }[];
    return rows.flatMap((r) => (r.document ? [toDoc<T>(r.document)] : []));
  } catch {
    return null;
  }
}
