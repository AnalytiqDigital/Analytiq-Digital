export default function BlogContent({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/).filter(Boolean);

  return (
    <>
      {blocks.map((block, i) => {
        if (block.startsWith('## ')) {
          return (
            <h2 key={i} className="mb-3 mt-8 font-display text-2xl font-bold text-ink first:mt-0">
              {block.replace(/^##\s+/, '')}
            </h2>
          );
        }
        return (
          <p key={i} className="mb-4 leading-relaxed text-ink/80">
            {block}
          </p>
        );
      })}
    </>
  );
}
