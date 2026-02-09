import type { PrismicSlice } from "@/types";

/**
 * Splits a slice array into hero slices and content slices.
 * Optionally extracts additional slice types into separate arrays.
 */
export function partitionSlices(
  slices: PrismicSlice[],
  extraTypes: string[] = []
) {
  const hero: PrismicSlice[] = [];
  const content: PrismicSlice[] = [];
  const extra: PrismicSlice[] = [];

  const extraSet = new Set(extraTypes);

  for (const slice of slices) {
    if (slice.slice_type === "hero") {
      hero.push(slice);
    } else if (extraSet.has(slice.slice_type)) {
      extra.push(slice);
    } else {
      content.push(slice);
    }
  }

  return { hero, content, extra };
}
