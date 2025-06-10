import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_P9k3tXt8.mjs';
import { manifest } from './manifest_DYkR21L2.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/auth/login.astro.mjs');
const _page2 = () => import('./pages/api/contact.astro.mjs');
const _page3 = () => import('./pages/api/projects/_id_.astro.mjs');
const _page4 = () => import('./pages/api/projects.astro.mjs');
const _page5 = () => import('./pages/api/test.astro.mjs');
const _page6 = () => import('./pages/api/upload.astro.mjs');
const _page7 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/auth/login.js", _page1],
    ["src/pages/api/contact.ts", _page2],
    ["src/pages/api/projects/[id].js", _page3],
    ["src/pages/api/projects/index.js", _page4],
    ["src/pages/api/test/index.js", _page5],
    ["src/pages/api/upload.js", _page6],
    ["src/pages/index.astro", _page7]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "df03b5f6-83f0-4aa8-84f8-d0fe87d9b7cf",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
