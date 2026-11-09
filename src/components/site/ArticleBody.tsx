import ReactMarkdown from "react-markdown";

export function ArticleBody({ content }: { content: string }) {
  return <div className="prose-tabito whitespace-pre-wrap break-words text-sm lg:text-base">
    <ReactMarkdown skipHtml components={{
      img: ({ src, alt }) => typeof src === "string" && /^https?:\/\//.test(src) ? <img src={src} alt={alt ?? ""} loading="lazy" className="my-6 max-h-[640px] w-full rounded-md object-contain" /> : null,
      a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline">{children}</a>,
    }}>{content}</ReactMarkdown>
  </div>;
}