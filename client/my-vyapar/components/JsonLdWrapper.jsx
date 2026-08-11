import { generateHomepageSchema } from "@/utils/homepage-schema";

export default function JsonLdWrapper() {
  const homepageSchema = generateHomepageSchema();

  return (
    <script
      id="homepage-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(homepageSchema),
      }}
    />
  );
}