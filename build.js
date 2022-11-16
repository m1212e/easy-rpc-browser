console.log("starting build script");
const fs = require("fs");

if (!fs.existsSync("./build")) {
    console.log("creating ./build");
    fs.mkdirSync("./build");
}

console.log("running esbuild...");
require('esbuild').build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    outdir: './build',
    format: "cjs",
    platform: 'node',
    minify: true,
    target: "node14"
}).catch(() => process.exit(1));
console.log("esbuild complete");

// files/dirs on root level which should be included inside the build
const include = [
    "package.json",
    "package-lock.json",
];

console.log("copying files to ./build");
function copyToBuild(name) {
    console.log("copying " + name);
    fs.cpSync(`./${name}`, `./build/${name}`, {recursive: true});
}
include.forEach(name => copyToBuild(name));
console.log("copying complete");

console.log("modifying package.json");
const pkgjson = JSON.parse(fs.readFileSync("./build/package.json"));
if (process.env.REF_NAME) {
    console.log("setting version to " + process.env.REF_NAME);
    pkgjson.version = process.env.REF_NAME
}
fs.writeFileSync("./build/package.json", JSON.stringify(pkgjson))
console.log("modifying complete");
console.log("build script done");