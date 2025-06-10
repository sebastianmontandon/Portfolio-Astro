import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint-BRilj6Mv.js';
import { manifest } from './manifest_Cvf3ziu5.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/auth/login.astro.mjs');
const _page2 = () => import('./pages/api/contact.astro.mjs');
const _page3 = () => import('./pages/api/projects.astro.mjs');
const _page4 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/auth/login.ts", _page1],
    ["src/pages/api/contact.ts", _page2],
    ["src/pages/api/projects/index.ts", _page3],
    ["src/pages/index.astro", _page4]
]);
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: undefined
});
const _args = {
    "middlewareSecret": "48c75307-acff-4d57-b308-89781a7801ef",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
