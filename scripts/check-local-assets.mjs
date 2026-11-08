// Verify the scripts actually referenced by the local page, following login redirects.
const baseUrl = process.argv[2] || 'http://localhost:3000/';
const response = await fetch(baseUrl, { signal: AbortSignal.timeout(15000) });
if (!response.ok) throw new Error(`Page returned HTTP ${response.status}`);
const html = await response.text();
const assets = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match => match[1]);
if (assets.length === 0) throw new Error('No application scripts found');
console.log(`Page: HTTP ${response.status} (${new URL(response.url).pathname})`);
for (const asset of assets) {
  const result = await fetch(new URL(asset, response.url), { signal: AbortSignal.timeout(15000) });
  const contentType = result.headers.get('content-type') || '';
  await result.arrayBuffer();
  console.log(`HTTP ${result.status}: ${new URL(asset, response.url).pathname}`);
  if (!result.ok || !/javascript/.test(contentType)) process.exitCode = 1;
}
