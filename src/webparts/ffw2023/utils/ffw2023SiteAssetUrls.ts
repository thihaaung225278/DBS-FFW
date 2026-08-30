/** Build SiteAssets URLs for classic `public/...` paths (iCal downloads). */
export function buildFfw2023SiteAssetUrl(baseUrl: string, classicPath: string): string {
  const normalized = classicPath.replace(/\\/g, '/');
  const relative = normalized.replace(/^public\//, '');
  const segments = relative.split('/').map((segment) => encodeURIComponent(segment));

  return `${baseUrl.replace(/\/$/, '')}/${segments.join('/')}`;
}

/** Resolve schedule .ics download href from SiteAssets base + classic path. */
export function resolveFfw2023IcalUrl(classicPath: string, icalBaseUrl: string): string {
  return buildFfw2023SiteAssetUrl(icalBaseUrl, classicPath);
}
