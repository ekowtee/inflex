export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  const jsonString = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}
