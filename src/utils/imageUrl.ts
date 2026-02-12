// Universal image URL utility for R2/CDN images
export function withImageParams(url: string, params: string): string {
  if (!url) return '';
  // Remove any trailing & or ? just in case
  url = url.replace(/[&?]+$/, '');
  const hasQuery = url.includes('?');
  return url + (hasQuery ? '&' : '?') + params;
}
