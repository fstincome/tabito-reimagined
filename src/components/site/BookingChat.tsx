import { Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { messageTeam, messageUser } from "@/lib/messages";

const db = supabase as any;

type ChatMessage = {
  id: string;
  sender_role: "admin" | "traveller";
  body: string;
  created_at: string;
};

export function BookingChat({
  bookingId,
  role,
  travellerId,
  fr = true,
}: {
  bookingId: string;
  role: "admin" | "traveller";
  travellerId?: string | null;
  fr?: boolean;
}) {
  const L = (a: string, b: string) => (fr ? a : b);
  const [items, setItems] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const { data } = await db
      .from("booking_messages")
      .select("id, sender_role, body, created_at")
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: true });
    setItems((data ?? []) as ChatMessage[]);
  }, [bookingId]);

  useEffect(() => {
    void load();
    const channel = supabase
      .channel(`booking-chat-${bookingId}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "booking_messages", filter: `booking_id=eq.${bookingId}` },
        () => void load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId, load]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [items.length]);

  async function send() {
    const body = text.trim();
    if (!body) return;
    setSending(true);
    const { error } = await db.from("booking_messages").insert({ booking_id: bookingId, sender_role: role, body });
    setSending(false);
    if (error) {
      toast.error(L("Envoi impossible.", "Could not send."));
      return;
    }
    setText("");
    void load();
    if (role === "admin" && travellerId) {
      await messageUser(travellerId, { kind: "booking_chat", title: "Nouvelle réponse de TABITO sur votre réservation", body, link: "/mon-compte" }).catch(() => undefined);
    } else if (role === "traveller") {
      await messageTeam({ kind: "booking_chat", title: "Nouveau message d'un voyageur sur une réservation", body, link: "/dashboard" }).catch(() => undefined);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-background p-4">
      <p className="font-display text-sm font-semibold text-primary">
        {L("Discussion avec ", "Conversation with ")}
        {role === "admin" ? L("le voyageur", "the traveller") : "TABITO"}
      </p>
      <div className="max-h-80 space-y-2 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground">{L("Aucun message pour l'instant.", "No messages yet.")}</p>
        ) : (
          items.map((m) => {
            const mine = m.sender_role === role;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                  <p className="text-[0.65rem] font-semibold opacity-80">
                    {m.sender_role === "admin" ? "TABITO" : L("Voyageur", "Traveller")} · {new Date(m.created_at).toLocaleString(fr ? "fr-FR" : "en-GB")}
                  </p>
                  <p className="whitespace-pre-wrap">{m.body}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>
      {role === "admin" && !travellerId && (
        <p className="text-xs text-muted-foreground">
          Réservation faite sans compte : le voyageur ne pourra lire la réponse que s'il est connecté. Contactez-le aussi par e-mail ou téléphone.
        </p>
      )}
      <div className="flex gap-2">
        <Textarea rows={2} value={text} maxLength={4000} onChange={(e) => setText(e.target.value)} placeholder={L("Votre message…", "Your message…")} />
        <Button type="button" variant="lagoon" onClick={send} disabled={sending || !text.trim()} aria-label={L("Envoyer", "Send")}>
          <Send className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
