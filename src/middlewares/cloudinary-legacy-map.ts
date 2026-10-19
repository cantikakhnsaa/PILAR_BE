
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

    if (ctx.path === '/upload/files') {
      const bodyType = Array.isArray(ctx.body)
        ? 'array'
        : ctx.body === null
          ? 'null'
          : typeof ctx.body;

      strapi.log.info(
        `[cloudinary-legacy-map] upload-files response: bodyType=${bodyType}, hasBody=${Boolean(ctx.body)}`
      );
    }

    if (
      !(ctx.path.startsWith('/api/') || ctx.path.startsWith('/upload/')) ||
      !ctx.body ||
      typeof ctx.body !== 'object'
    ) {
      return;
    }

    let localUrlCount = 0;
    let mappedUrlCount = 0;

    const rewriteUrls = (value: any): void => {
      if (!value || typeof value !== 'object') return;

      if (
        typeof value.url === 'string' &&
        value.url.startsWith('/uploads/')
      ) {
        localUrlCount++;

        const filename = value.url
          .split('/')
          .pop()
          ?.split('?')[0];

        if (filename) {
          const mappedUrl = legacyMap[filename.toLowerCase()];

          if (mappedUrl) {
            value.url = mappedUrl;
            mappedUrlCount++;
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

    if (ctx.path === '/upload/files') {
      strapi.log.info(
        `[cloudinary-legacy-map] upload-files URLs: local=${localUrlCount}, mapped=${mappedUrlCount}`
      );
    }
  };
};
