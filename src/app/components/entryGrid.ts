/**
 * Column classes for a grid of entries, sized to how many there are.
 *
 * Several lists on the site are shorter than the grid they were given.
 * There are two case studies, so "Related Case Studies" is always exactly
 * one; two of the four Academy domains hold two programmes, so their
 * "Related Programmes" is one; and /resources has two whitepapers. In a
 * three-column grid each of those leaves the row two-thirds empty, which
 * reads as content that failed to load rather than as a short list.
 *
 * The entry keeps roughly the width it has in a full row, and the grid
 * stops where the entries do. The classes are spelled out rather than
 * built, because Tailwind scans source text for class names.
 */
export function entryGrid(count: number): string {
  if (count >= 3) return "sm:grid-cols-2 lg:grid-cols-3";
  if (count === 2) return "sm:grid-cols-2 lg:max-w-3xl";
  return "max-w-sm";
}
