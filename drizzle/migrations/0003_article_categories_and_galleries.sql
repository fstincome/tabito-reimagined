ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'actualites';
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS gallery jsonb NOT NULL DEFAULT '[]'::jsonb;
COMMENT ON COLUMN public.blog_posts.content IS 'Article text supports Markdown formatting and inline images; raw HTML is not rendered.';
CREATE OR REPLACE FUNCTION public.validate_article_media() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF length(NEW.category) > 100 OR length(NEW.title) > 1000 OR length(NEW.content) > 200000 OR length(NEW.content_en) > 200000 THEN RAISE EXCEPTION 'Article field is too long'; END IF;
 IF jsonb_typeof(NEW.gallery) <> 'array' THEN RAISE EXCEPTION 'Gallery must be an array'; END IF;
 IF EXISTS (SELECT 1 FROM jsonb_array_elements(NEW.gallery) item WHERE jsonb_typeof(item) <> 'object' OR COALESCE(item->>'url','') !~ '^https?://' OR length(COALESCE(item->>'caption','')) > 1000) THEN RAISE EXCEPTION 'Invalid gallery image'; END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER validate_article_media BEFORE INSERT OR UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.validate_article_media();