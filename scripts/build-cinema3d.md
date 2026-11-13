# cinema3d build
`assets/cinema3d.js` is a minified ES module bundled from `scripts/cinema3d.src.js` with three.js 0.187.0 (MIT, licence text kept at the end of the bundle):

    npm i three@0.187.0 esbuild
    npx esbuild scripts/cinema3d.src.js --bundle --minify --format=esm --target=es2019 --legal-comments=eof --outfile=assets/cinema3d.js

The product model (Magnetic Dashboard Phone Mount) is built from three.js primitives in that file; no third-party 3D model is used.
