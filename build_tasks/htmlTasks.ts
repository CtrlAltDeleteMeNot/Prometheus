import gulp from 'gulp'
import { Configuration } from "./_configuration";
import fs from 'fs';
import replace from "gulp-replace";
import path from 'path';




export const htmlGenerate = (configuration: Configuration): gulp.TaskFunction => {
    return function htmlGenerateImpl() {
        const ts = Date.now();
        const utcTimestamp = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'UTC',
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(ts);

        const htmlTask = gulp
            .src(configuration.html.input)
            .pipe(replace("?v=1.0.0.version", `?v=${ts}`))
            .pipe(replace("Last build @ ##ts## UTC", `Last updated @ ${utcTimestamp} UTC`))
            .pipe(gulp.dest(configuration.html.outputDir))

        const workerJs = `const VERSION = "${ts}";
const BUILD_TIME = "${utcTimestamp}";
self.addEventListener('install', event => {
    self.skipWaiting();
});


self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});`;

        fs.writeFileSync(
            configuration.html.outputJsWorker,
            workerJs
        );

        return htmlTask;
    }
}

export const htmlClean = (configuration: Configuration): gulp.TaskFunction => {
    return function htmlCleanImpl(cb: gulp.TaskFunctionCallback) {
        fs.rmSync(configuration.html.outputHtmlFile, { force: true, recursive: true });
        fs.rmSync(configuration.html.outputJsWorker, { force: true, recursive: true });
        cb();
    }
}

export const htmlWatch = (configuration: Configuration, ...tasks: gulp.TaskFunction[]): gulp.TaskFunction => {
    const runTasks = gulp.series(htmlGenerate(configuration), ...tasks);
    return function htmlWatchImpl() {
        return gulp.watch(configuration.html.watch, runTasks);
    }
}






