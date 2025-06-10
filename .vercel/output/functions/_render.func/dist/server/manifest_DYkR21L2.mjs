import 'kleur/colors';
import { d as decodeKey } from './chunks/astro/server_B44yeyIZ.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_lMo36nOQ.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/Seba/Documents/Workspace/Portfolio-Astro/","cacheDir":"file:///C:/Users/Seba/Documents/Workspace/Portfolio-Astro/node_modules/.astro/","outDir":"file:///C:/Users/Seba/Documents/Workspace/Portfolio-Astro/dist/","srcDir":"file:///C:/Users/Seba/Documents/Workspace/Portfolio-Astro/src/","publicDir":"file:///C:/Users/Seba/Documents/Workspace/Portfolio-Astro/public/","buildClientDir":"file:///C:/Users/Seba/Documents/Workspace/Portfolio-Astro/dist/client/","buildServerDir":"file:///C:/Users/Seba/Documents/Workspace/Portfolio-Astro/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/login","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/login\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/login.js","pathname":"/api/auth/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/contact","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/contact\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/contact.ts","pathname":"/api/contact","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/projects/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/projects\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"projects","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/projects/[id].js","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/projects","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/projects\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"projects","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/projects/index.js","pathname":"/api/projects","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/test","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/test\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"test","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/test/index.js","pathname":"/api/test","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/upload","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/upload\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"upload","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/upload.js","pathname":"/api/upload","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.Ddo_zYLG.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/Seba/Documents/Workspace/Portfolio-Astro/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:src/pages/api/auth/login@_@js":"pages/api/auth/login.astro.mjs","\u0000@astro-page:src/pages/api/contact@_@ts":"pages/api/contact.astro.mjs","\u0000@astro-page:src/pages/api/projects/[id]@_@js":"pages/api/projects/_id_.astro.mjs","\u0000@astro-page:src/pages/api/projects/index@_@js":"pages/api/projects.astro.mjs","\u0000@astro-page:src/pages/api/test/index@_@js":"pages/api/test.astro.mjs","\u0000@astro-page:src/pages/api/upload@_@js":"pages/api/upload.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","C:/Users/Seba/Documents/Workspace/Portfolio-Astro/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BRYr6SRR.mjs","\u0000@astrojs-manifest":"manifest_DYkR21L2.mjs","C:/Users/Seba/Documents/Workspace/Portfolio-Astro/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts":"_astro/Layout.astro_astro_type_script_index_0_lang.BPYpYs4N.js","C:/Users/Seba/Documents/Workspace/Portfolio-Astro/src/components/Projects.astro?astro&type=script&index=0&lang.ts":"_astro/Projects.astro_astro_type_script_index_0_lang.COkKO_jD.js","C:/Users/Seba/Documents/Workspace/Portfolio-Astro/src/components/Contact.astro?astro&type=script&index=0&lang.ts":"_astro/Contact.astro_astro_type_script_index_0_lang.fq6gVRPc.js","C:/Users/Seba/Documents/Workspace/Portfolio-Astro/src/components/Navbar.astro?astro&type=script&index=0&lang.ts":"_astro/Navbar.astro_astro_type_script_index_0_lang.DRwu19Sx.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/Seba/Documents/Workspace/Portfolio-Astro/src/components/Contact.astro?astro&type=script&index=0&lang.ts","typeof window<\"u\"&&document.addEventListener(\"DOMContentLoaded\",()=>{const n=document.getElementById(\"contact-form\"),e=document.getElementById(\"form-status\"),t=n?.querySelector('button[type=\"submit\"]');if(!n||!e||!t)return;const l=async a=>{a.preventDefault();const i=a.target,o=new FormData(i);try{t.disabled=!0,t.innerHTML=`\n            <svg class=\"animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">\n              <circle class=\"opacity-25\" cx=\"12\" cy=\"12\" r=\"10\" stroke=\"currentColor\" stroke-width=\"4\"></circle>\n              <path class=\"opacity-75\" fill=\"currentColor\" d=\"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z\"></path>\n            </svg>\n            Sending...\n          `,e&&(e.className=\"mt-4 p-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-sm\",e.textContent=\"Sending your message...\",e.classList.remove(\"hidden\"));const s={name:o.get(\"name\"),email:o.get(\"email\"),subject:o.get(\"subject\"),message:o.get(\"message\")},r=await fetch(\"/api/contact\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify(s)}),d=await r.json();if(!r.ok)throw new Error(d.error||\"Failed to send message\");e&&(e.textContent=\"Message sent successfully! I'll get back to you soon!\",e.className=\"mt-4 p-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-sm\"),i.reset()}catch(s){console.error(\"Error:\",s),e&&(e.textContent=\"There was an error sending your message. Please try again or email me directly at sam171990@gmail.com\",e.className=\"mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm\")}finally{if(t&&(t.disabled=!1,t.innerHTML=`\n              <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-5 w-5 mr-2\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">\n                <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z\" />\n              </svg>\n              Send Message\n            `),e){const s=e.className.includes(\"bg-red-500/10\"),r=()=>{e&&e.classList.add(\"hidden\")};s?setTimeout(r,1e4):setTimeout(r,5e3)}}};n.addEventListener(\"submit\",l)});"],["C:/Users/Seba/Documents/Workspace/Portfolio-Astro/src/components/Navbar.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",()=>{const e=document.getElementById(\"menu-toggle\"),i=document.getElementById(\"mobile-menu\"),a=document.querySelectorAll(\"#mobile-menu a\"),r=document.querySelectorAll(\"[data-nav-link]\");e?.addEventListener(\"click\",()=>{const t=e.getAttribute(\"aria-expanded\")===\"true\";e.setAttribute(\"aria-expanded\",(!t).toString()),i?.classList.toggle(\"hidden\"),e.classList.toggle(\"active\")}),a.forEach(t=>{t.addEventListener(\"click\",()=>{i?.classList.add(\"hidden\"),e?.setAttribute(\"aria-expanded\",\"false\"),e?.classList.remove(\"active\")})});const o=()=>{const t=window.scrollY+100;document.querySelectorAll(\"section[id]\").forEach(c=>{const l=c,d=l.offsetTop,u=l.offsetHeight,m=c.getAttribute(\"id\");t>=d&&t<d+u&&r.forEach(s=>{if(!s)return;const f=s.getAttribute(\"href\"),n=s.querySelector(\"span:last-child\");f===`#${m}`?(s.classList.add(\"text-white\"),n&&n.classList.add(\"w-full\")):(s.classList.remove(\"text-white\"),n&&n.classList.remove(\"w-full\"))})})};return o(),window.addEventListener(\"scroll\",o),()=>{window.removeEventListener(\"scroll\",o)}});"]],"assets":["/_astro/index.Ddo_zYLG.css","/favicon.svg","/profile-pic.jpg","/images/profile.jpg","/_astro/Layout.astro_astro_type_script_index_0_lang.BPYpYs4N.js","/_astro/Projects.astro_astro_type_script_index_0_lang.COkKO_jD.js","/images/projects/csv2json.png","/images/projects/hands-translator.png","/images/projects/quiniela-app.png","/images/projects/store-site.png","/images/projects/TrackingDude.png","/images/projects/video-editor-portfolio.png"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"oLSjqoENHM3V3WW0GsqSUrQiwihRnepH74LLbzyBioc="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
