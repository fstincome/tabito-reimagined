import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

const TEAM_EMAIL = "u.connectburundi.tabito@gmail.com";
const SENDER_NAME = "TABITO";

type SendResult = { sent: boolean; reason?: string };

function b64(value: string) {
  return btoa(Array.from(new TextEncoder().encode(value), (b) => String.fromCharCode(b)).join(""));
}

function header(value: string) {
  return /^[\x00-\x7F]*$/.test(value) ? value : `=?UTF-8?B?${b64(value)}?=`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrap(title: string, rows: string) {
  return `<div style="font-family:Segoe UI,Arial,sans-serif;color:#123">
  <h2 style="color:#0b4f6c;margin:0 0 12px">${escapeHtml(title)}</h2>
  ${rows}
  <p style="margin-top:24px;font-size:12px;color:#667">TABITO — Tourisme au Burundi</p>
</div>`;
}

function list(entries: Array<[string, string | number | null | undefined]>) {
  return `<table style="border-collapse:collapse">${entries
    .filter(([, v]) => v !== null && v !== undefined && `${v}`.trim() !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#667">${escapeHtml(k)}</td><td style="padding:4px 0"><strong>${escapeHtml(
          String(v),
        )}</strong></td></tr>`,
    )
    .join("")}</table>`;
}

async function sendGmail(options: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string | null;
}): Promise<SendResult> {
  // Voie 1 : pont Google Apps Script déployé depuis la boîte TABITO
  // (envoie réellement depuis u.connectburundi.tabito@gmail.com).
  const bridgeUrl = process.env["GMAIL_BRIDGE_URL"];
  const bridgeToken = process.env["GMAIL_BRIDGE_TOKEN"];
  if (bridgeUrl && bridgeToken) {
    const response = await fetch(bridgeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: bridgeToken,
        to: options.to,
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo ?? undefined,
      }),
    });
    if (!response.ok) {
      const body = await response.text();
      console.error(`Gmail bridge send failed [${response.status}]: ${body}`);
      return { sent: false, reason: `bridge_error_${response.status}` };
    }
    return { sent: true };
  }

  // Voie 2 : connexion Google officielle si elle est reliée au projet.
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_MAIL_API_KEY"];
  if (!lovableKey || !connectionKey) {
    console.warn("Gmail notification skipped: no Gmail bridge or connection configured.");
    return { sent: false, reason: "gmail_not_connected" };
  }

  const mime = [
    `From: ${header(SENDER_NAME)} <${TEAM_EMAIL}>`,
    `To: ${options.to}`,
    options.replyTo ? `Reply-To: ${options.replyTo}` : null,
    `Subject: ${header(options.subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    options.html,
  ]
    .filter(Boolean)
    .join("\r\n");

  const raw = b64(mime).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const response = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectionKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Gmail send failed [${response.status}]: ${body}`);
    return { sent: false, reason: `gmail_error_${response.status}` };
  }
  return { sent: true };
}

function isEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length < 255;
}

function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

/** Notifie l'équipe + accuse réception au visiteur pour une nouvelle réservation. */
export const notifyBooking = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string }) => {
    if (!isEmail(input?.email)) throw new Error("invalid_email");
    return { email: input.email };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .select(
        "id,name,email,phone,category,item_label,travel_date,return_date,departure_point,people,message,created_at",
      )
      .eq("email", data.email)
      .gte("created_at", new Date(Date.now() - 5 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !booking) return { sent: false, reason: "not_found" } satisfies SendResult;

    const details = list([
      ["Nom", booking.name],
      ["E-mail", booking.email],
      ["Téléphone", booking.phone],
      ["Catégorie", booking.category],
      ["Choix", booking.item_label],
      ["Départ", booking.departure_point],
      ["Date de voyage", booking.travel_date],
      ["Date de retour", booking.return_date],
      ["Voyageurs", booking.people],
      ["Message", booking.message],
    ]);

    const team = await sendGmail({
      to: TEAM_EMAIL,
      subject: `Nouvelle réservation — ${booking.name}`,
      html: wrap("Nouvelle demande de réservation", details),
      replyTo: isEmail(booking.email) ? booking.email : null,
    });

    if (isEmail(booking.email)) {
      await sendGmail({
        to: booking.email,
        subject: "Votre demande de réservation TABITO a bien été reçue",
        html: wrap(
          `Merci ${booking.name} !`,
          `<p>Nous avons bien reçu votre demande. Notre équipe vous répond sous 48 heures.</p>${details}`,
        ),
        replyTo: TEAM_EMAIL,
      });
    }
    return team;
  });

/** Notifie l'équipe + accuse réception au visiteur pour un message de contact. */
export const notifyContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string }) => {
    if (!isEmail(input?.email)) throw new Error("invalid_email");
    return { email: input.email };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: msg, error } = await supabaseAdmin
      .from("contact_messages")
      .select("id,name,email,phone,subject,message,created_at")
      .eq("email", data.email)
      .gte("created_at", new Date(Date.now() - 5 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !msg) return { sent: false, reason: "not_found" } satisfies SendResult;

    const details = list([
      ["Nom", msg.name],
      ["E-mail", msg.email],
      ["Téléphone", msg.phone],
      ["Sujet", msg.subject],
      ["Message", msg.message],
    ]);

    const team = await sendGmail({
      to: TEAM_EMAIL,
      subject: `Message de contact — ${msg.subject || msg.name}`,
      html: wrap("Nouveau message de contact", details),
      replyTo: isEmail(msg.email) ? msg.email : null,
    });

    if (isEmail(msg.email)) {
      await sendGmail({
        to: msg.email,
        subject: "TABITO a bien reçu votre message",
        html: wrap(
          `Merci ${msg.name} !`,
          "<p>Votre message est arrivé chez notre équipe, qui vous répondra très vite.</p>",
        ),
        replyTo: TEAM_EMAIL,
      });
    }
    return team;
  });

/** Bienvenue à un nouvel abonné + alerte interne. */
export const notifyNewsletterSignup = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string }) => {
    if (!isEmail(input?.email)) throw new Error("invalid_email");
    return { email: input.email.toLowerCase() };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("email")
      .eq("email", data.email)
      .maybeSingle();
    if (!row) return { sent: false, reason: "not_found" } satisfies SendResult;

    await sendGmail({
      to: TEAM_EMAIL,
      subject: "Nouvel abonné à la newsletter TABITO",
      html: wrap("Nouvel abonné", list([["E-mail", row.email]])),
      replyTo: row.email,
    });

    return sendGmail({
      to: row.email,
      subject: "Bienvenue dans la newsletter TABITO",
      html: wrap(
        "Bienvenue !",
        "<p>Merci pour votre inscription. Vous recevrez nos évènements, circuits et bons plans touristiques au Burundi.</p>",
      ),
      replyTo: TEAM_EMAIL,
    });
  });

/** Annonce un évènement de l'agenda aux abonnés (réservé aux administrateurs). */
export const notifyEventAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => {
    if (!isUuid(input?.id)) throw new Error("invalid_id");
    return { id: input.id };
  })
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("is_admin");
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: ev } = await supabaseAdmin
      .from("events")
      .select("id,title,description,place,start_date,end_date,published")
      .eq("id", data.id)
      .maybeSingle();
    if (!ev || !ev.published) return { sent: 0, reason: "not_publishable" };

    const { data: subscribers } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("email")
      .limit(500);

    const html = wrap(
      ev.title,
      `${ev.description ? `<p>${escapeHtml(ev.description)}</p>` : ""}${list([
        ["Lieu", ev.place],
        ["Début", ev.start_date],
        ["Fin", ev.end_date],
      ])}<p style="margin-top:16px"><a href="https://tabito-reimagined.lovable.app/evenements">Voir l'agenda TABITO</a></p>`,
    );

    let sent = 0;
    for (const sub of subscribers ?? []) {
      if (!isEmail(sub.email)) continue;
      const result = await sendGmail({
        to: sub.email,
        subject: `Évènement TABITO — ${ev.title}`,
        html,
        replyTo: TEAM_EMAIL,
      });
      if (result.sent) sent += 1;
    }
    return { sent };
  });
