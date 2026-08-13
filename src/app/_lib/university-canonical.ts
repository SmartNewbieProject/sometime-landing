type UniversityCanonicalData = {
  university: { code: string };
  canonicalCode?: string;
};

export function canonicalUniversityPath(
  requestedCode: string,
  data: UniversityCanonicalData,
): string | null {
  const canonicalCode = data.canonicalCode ?? data.university.code;
  if (canonicalCode === requestedCode) return null;
  return `/university/${encodeURIComponent(canonicalCode)}`;
}
