/**
 * Strip comments and leading whitespace from a GLSL template string
 * (PERFORMANCE_PLAN.md §6.2). Identifiers are left alone: the debug value of
 * readable shader errors is worth more than the kilobyte.
 */
export function stripGlsl(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
}
