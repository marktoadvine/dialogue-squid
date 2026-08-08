// TypeScript 7 errors on side-effect imports it can't resolve to a
// declaration (TS2882), so `import 'dialogue-squid/styles.css'` needs one to
// point at. The stylesheet exports nothing; this just gives the compiler a
// module to find. Wired up via the "types" condition on the "./styles.css"
// entry in package.json.
export {}
