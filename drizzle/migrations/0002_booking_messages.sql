CREATE TABLE public.booking_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL DEFAULT auth.uid(),
  sender_role text NOT NULL CHECK (sender_role IN ('admin','traveller')),
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX booking_messages_booking_idx ON public.booking_messages(booking_id, created_at);
GRANT SELECT, INSERT ON public.booking_messages TO authenticated;
GRANT ALL ON public.booking_messages TO service_role;
ALTER TABLE public.booking_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read booking chat" ON public.booking_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins write booking chat" ON public.booking_messages FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin') AND sender_role='admin' AND sender_id=auth.uid());
CREATE POLICY "Traveller reads own booking chat" ON public.booking_messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.bookings b WHERE b.id=booking_id AND b.user_id=auth.uid()));
CREATE POLICY "Traveller writes own booking chat" ON public.booking_messages FOR INSERT TO authenticated WITH CHECK (sender_role='traveller' AND sender_id=auth.uid() AND EXISTS (SELECT 1 FROM public.bookings b WHERE b.id=booking_id AND b.user_id=auth.uid()));
ALTER PUBLICATION supabase_realtime ADD TABLE public.booking_messages;