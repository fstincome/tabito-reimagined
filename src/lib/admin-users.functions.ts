import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertAdministrator, newAdminSchema } from "./admin-users.schema";

export const listAdministrators = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ownRoles = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    if (ownRoles.error) throw new Error("Vérification des droits impossible.");
    assertAdministrator(ownRoles.data ?? []);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const roles = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "admin");
    if (roles.error) throw new Error("Chargement impossible.");
    return Promise.all((roles.data ?? []).map(async ({ user_id }) => {
      const result = await supabaseAdmin.auth.admin.getUserById(user_id);
      if (result.error || !result.data.user) throw new Error("Chargement impossible.");
      const user = result.data.user;
      return { id: user.id, email: user.email ?? "", fullName: String(user.user_metadata?.['full_name'] ?? ""), createdAt: user.created_at };
    }));
  });

export const createAdministrator = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => newAdminSchema.parse(input))
  .handler(async ({ data, context }) => {
    const ownRoles = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    if (ownRoles.error) throw new Error("Vérification des droits impossible.");
    assertAdministrator(ownRoles.data ?? []);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const created = await supabaseAdmin.auth.admin.createUser({
      email: data.email, password: data.password,
      user_metadata: { full_name: data.fullName },
    });
    if (created.error || !created.data.user) {
      return { ok: false as const, message: "Création impossible : vérifiez l’adresse, le mot de passe et si ce compte existe déjà." };
    }
    const id = created.data.user.id;
    const grant = await supabaseAdmin.from("user_roles").upsert({ user_id: id, role: "admin" }, { onConflict: "user_id,role" });
    if (grant.error) {
      const rollback = await supabaseAdmin.auth.admin.deleteUser(id);
      return { ok: false as const, message: rollback.error ? "Le compte a été créé sans droits administrateur. Contactez un administrateur avant de réessayer." : "Les droits n’ont pas pu être attribués. Aucun compte n’a été conservé." };
    }
    return { ok: true as const, id };
  });