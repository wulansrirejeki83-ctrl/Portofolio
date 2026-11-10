import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getPublishedWorks } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publishedWorks = await getPublishedWorks();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: site.url,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site.url}/karya`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site.url}/tentang`,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${site.url}/kontak`,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];

  const workRoutes: MetadataRoute.Sitemap = publishedWorks.map((work) => ({
    url: `${site.url}/karya/${work.slug}`,
    lastModified: new Date(work.updatedAt ?? work.publishedAt),
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...workRoutes];
}
