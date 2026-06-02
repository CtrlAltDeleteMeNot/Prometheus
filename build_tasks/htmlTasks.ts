import gulp from 'gulp'
import { Configuration } from "./_configuration";
import fs from 'fs';
import replace from "gulp-replace";
import esbuild from 'esbuild';



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
        }).format(new Date());
        return gulp
            .src(configuration.html.input)
            .pipe(replace("?v=1.0.0.version", `?v=${ts}`))
            .pipe(replace("Last build @ ##ts## UTC", `Last updated @ ${utcTimestamp} UTC`))
            .pipe(gulp.dest(configuration.html.outputDir))
    }
}

export const htmlClean = (configuration: Configuration): gulp.TaskFunction => {
    return function htmlCleanImpl(cb: gulp.TaskFunctionCallback) {
        fs.rmSync(configuration.html.output, { force: true, recursive: true });
        cb();
    }
}

export const htmlWatch = (configuration: Configuration, ...tasks: gulp.TaskFunction[]): gulp.TaskFunction => {
    const runTasks = gulp.series(htmlGenerate(configuration), ...tasks);
    return function htmlWatchImpl() {
        return gulp.watch(configuration.html.watch, runTasks);
    }
}






