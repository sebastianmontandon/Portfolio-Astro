import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_9Jazq2JK.mjs';
import { manifest } from './manifest_uhKGd3xC.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/auth/login.astro.mjs');
const _page2 = () => import('./pages/api/cache/clear.astro.mjs');
const _page3 = () => import('./pages/api/chatbot.astro.mjs');
const _page4 = () => import('./pages/api/contact.astro.mjs');
const _page5 = () => import('./pages/api/projects/_id_.astro.mjs');
const _page6 = () => import('./pages/api/projects.astro.mjs');
const _page7 = () => import('./pages/api/test.astro.mjs');
const _page8 = () => import('./pages/api/test-supabase.astro.mjs');
const _page9 = () => import('./pages/api/upload.astro.mjs');
const _page10 = () => import('./pages/api-docs.astro.mjs');
const _page11 = () => import('./pages/docs/api-spec.yaml.astro.mjs');
const _page12 = () => import('./pages/test-env.astro.mjs');
const _page13 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/auth/login.js", _page1],
    ["src/pages/api/cache/clear.js", _page2],
    ["src/pages/api/chatbot.js", _page3],
    ["src/pages/api/contact.ts", _page4],
    ["src/pages/api/projects/[id].js", _page5],
    ["src/pages/api/projects/index.js", _page6],
    ["src/pages/api/test/index.js", _page7],
    ["src/pages/api/test-supabase.js", _page8],
    ["src/pages/api/upload.js", _page9],
    ["src/pages/api-docs.astro", _page10],
    ["src/pages/docs/api-spec.yaml.js", _page11],
    ["src/pages/test-env.astro", _page12],
    ["src/pages/index.astro", _page13]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "057b4e65-92f7-4c6f-bf87-2de4f19522db",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
