import gulp from 'gulp'
import { Configuration } from "./_configuration";
import fs from 'fs';
import path from 'path';
import replace from "gulp-replace";


const githubFolder = './docs/'
const manifest = {
    "name": "Prometheus",
    "short_name": "Prometheus",
    "description": "Prometheus is the ultimate companion for crypto traders focused on USDC pairs.",
    "icons": [
        {
            "src": "img/logo.svg",
            "sizes": "any",
            "type": "image/svg+xml"
        }
    ],
    "start_url": "https://ctrlaltdeletemenot.github.io/Prometheus/",
    "display": "standalone",
    "background_color": "#0E1220",
    "theme_color": "#111726",
    "orientation": "portrait",
    "scope": "/Prometheus/",
    "id": "/Prometheus/",
    "lang": "en-US"
};
export const githubCompatiblePublish = (configuration: Configuration): gulp.TaskFunction => {
    return function githubCompatiblePublishImpl() {
        fs.writeFileSync(
            path.join(githubFolder, "manifest.json"),
            JSON.stringify(manifest, null, 2)
        );
        const ts = Date.now(); 
        return gulp
            .src(`${configuration.appRootDir}/**/*`)
            .pipe(replace("?v=1.0.0.version", `?v=${ts}`))
            .pipe(gulp.dest(githubFolder))
    }
}