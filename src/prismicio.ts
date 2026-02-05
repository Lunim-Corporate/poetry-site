import * as prismic from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import sm from "../slicemachine.config.json";

// Local type fallbacks to avoid CLI/type version mismatches
type ClientConfig = any;
type Route = any;
type LinkResolverFunction = (link: any) => string | null | undefined;

/**
 * The project's Prismic repository name.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * Link resolver for handling document links
 */
export const linkResolver: LinkResolverFunction = (link) => {
  if (link.type === "homepage") {
    return "/";
  }
  if (link.type === "judge_page") {
    return "/judge";
  }
  if (link.type === "past_winners_page") {
    return "/past-winners";
  }
  if (link.type === "past_winners_year") {
    if (link.uid) return `/past-winners/${encodeURIComponent(link.uid)}`;
  }
  if (link.type === "enter_page") {
    return "/enter";
  }
  return undefined;
};

/**
 * A list of Route Resolver objects that define how a document's `url` field is resolved.
 */
const routes: Route[] = [
  { type: "homepage", path: "/" },
  { type: "judge_page", path: "/judge" },
  { type: "past_winners_page", path: "/past-winners" },
  { type: "past_winners_year", path: "/past-winners/:uid" },
  { type: "enter_page", path: "/enter" },
];

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (config: ClientConfig = {}) => {
  const client = (prismic as any).createClient(repositoryName, {
    routes,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 5 } },
    ...config,
  });

  enableAutoPreviews({ client });

  return client;
};
