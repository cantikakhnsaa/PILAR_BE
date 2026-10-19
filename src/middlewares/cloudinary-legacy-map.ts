
import fs from 'node:fs';
import path from 'node:path';
import type { Core } from '@strapi/strapi';

export default (_config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  let legacyMap: Record<string, string> = {};

  try {
    const mapPath = path.resolve(
      process.cwd(),
      'src',
      'middlewares',
      'cloudinary-legacy-map.json'
    );

    // Baca JSON dan hapus UTF-8 BOM jika ada.
    const raw = fs
      .readFileSync(mapPath, 'utf8')
      .replace(/^\uFEFF/, '');

    const parsed: unknown = JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed)
    ) {
      throw new Error('Format file pemetaan harus berupa objek JSON.');
    }

    const validatedMap: Record<string, string> = {};

    for (const [filename, url] of Object.entries(parsed)) {
      if (
        typeof url === 'string' &&
        /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(url)
      ) {
        validatedMap[filename.toLowerCase()] = url;
      }
    }

    legacyMap = validatedMap;

    strapi.log.info(
      `[cloudinary-legacy-map] Loaded ${Object.keys(legacyMap).length} mappings`
    );

    if (Object.keys(legacyMap).length === 0) {
      strapi.log.warn(
        '[cloudinary-legacy-map] No valid Cloudinary mappings found.'
      );
    }
  } catch (error) {
    strapi.log.error(
      '[cloudinary-legacy-map] Failed to load mapping file',
      error
    );
  }

  return async (ctx: any, next: () => Promise<void>) => {
    await next();

    if (
      !ctx.path.startsWith('/api/') ||
      !ctx.body ||
      typeof ctx.body !== 'object'
    ) {
      return;
    }

    const rewriteUrls = (value: any): void => {
      if (!value || typeof value !== 'object') return;

      if (
        typeof value.url === 'string' &&
        value.url.startsWith('/uploads/')
      ) {
        const filename = value.url
          .split('/')
          .pop()
          ?.split('?')[0];

        if (filename) {
          const mappedUrl = legacyMap[filename.toLowerCase()];

          if (mappedUrl) {
            value.url = mappedUrl;
          }
        }
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          rewriteUrls(item);
        }
      } else {
        for (const child of Object.values(value)) {
          rewriteUrls(child);
        }
      }
    };

    rewriteUrls(ctx.body);
  };
};
