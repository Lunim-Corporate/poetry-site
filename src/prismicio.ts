import * as prismic from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import sm from "../slicemachine.config.json";

/**
 * The project's Prismic repository name.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * Link resolver for handling document links.
 */
export const linkResolver = (
  link: { type?: string; uid?: string }
): string | undefined => {
  switch (link.type) {
    case "homepage":
      return "/";
    case "judge_page":
      return "/judge";
    case "past_winners_page":
      return "/past-winners";
    case "past_winners_year":
      return link.uid ? `/past-winners/${encodeURIComponent(link.uid)}` : undefined;
    case "enter_page":
      return "/enter";
    default:
      return undefined;
  }
};

/**
 * Route Resolver objects that define how a document's `url` field is resolved.
 */
const routes: prismic.Route[] = [
  { type: "homepage", path: "/" },
  { type: "judge_page", path: "/judge" },
  { type: "past_winners_page", path: "/past-winners" },
  { type: "past_winners_year", path: "/past-winners/:uid" },
  { type: "enter_page", path: "/enter" },
];

/**
 * Creates a Prismic client for the project's repository.
 */
export const createClient = (config: prismic.ClientConfig = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" as RequestCache }
        : { next: { revalidate: 5 } },
    ...config,
  });

  enableAutoPreviews({ client });

  return client;
};
