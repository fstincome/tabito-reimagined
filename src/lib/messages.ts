import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

export type InternalMessage = {
  id: string;
  audience: string;
  kind: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
};

/** Message déposé pour l'équipe TABITO (visible dans le tableau de bord). */
export async function messageTeam(input: {
  kind: string;
  title: string;
  body?: string | null;
  link?: string | null;
}) {
  await db.from("notifications").insert({
    audience: "admin",
    user_id: null,
    kind: input.kind,
    title: input.title.slice(0, 200),
    body: input.body ? String(input.body).slice(0, 4000) : null,
    link: input.link ?? null,
  });
}

/** Message déposé dans l'espace personnel d'un visiteur connecté. */
export async function messageUser(
  userId: string,
  input: { kind: string; title: string; body?: string | null; link?: string | null },
) {
  await db.from("notifications").insert({
    audience: "user",
    user_id: userId,
    kind: input.kind,
    title: input.title.slice(0, 200),
    body: input.body ? String(input.body).slice(0, 4000) : null,
    link: input.link ?? null,
  });
}

export async function listMyMessages(): Promise<InternalMessage[]> {
  const { data, error } = await db
    .from("notifications")
    .select("id, audience, kind, title, body, link, read, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []) as InternalMessage[];
}

export async function markMessageRead(id: string) {
  const { error } = await db.from("notifications").update({ read: true }).eq("id", id);
  if (error) throw error;
}
