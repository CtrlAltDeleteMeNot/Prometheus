import esbuild from 'esbuild';
import gulp from 'gulp'
import fs from 'fs';
import { Configuration } from "./_configuration";

export const jsBundleWorker = (configuration: Configuration): gulp.TaskFunction => {
    return function jsBundleWorkerImpl() {
        return esbuild.build({
            entryPoints: [configuration.esWorkerJs.input],      // input files
            outfile: configuration.esWorkerJs.output,           // output dir
            bundle: true,                                 // combine into one
            format: 'iife',                               // classic JS
            target: 'es6',                                // ES6 syntax
            platform: 'browser',
            define: {
                'IS_WORKER': 'true'
            },
            sourcemap: true,
            minify: false,
            treeShaking: true
        });
    }
};


export const jsBundleClient = (configuration: Configuration): gulp.TaskFunction => {
    return function jsBundleClientImpl() {
        return esbuild.build({
            entryPoints: [configuration.esClientJs.input],
            outfile: configuration.esClientJs.output,
            bundle: true,
            format: 'iife',
            target: 'es6',
            platform: 'browser',
            sourcemap: true,
            minify: false,
            treeShaking: true
        });
    }
};

export const jsWatchWorker = (configuration: Configuration, ...tasks: gulp.TaskFunction[]): gulp.TaskFunction => {
    const runTasks = gulp.series(jsBundleWorker(configuration), ...tasks);
    return function jsWatchWorkerImpl() {
        return gulp.watch(configuration.esWorkerJs.watch, runTasks);
    }
}

export const jsWatchClient = (configuration: Configuration, ...tasks: gulp.TaskFunction[]): gulp.TaskFunction => {
    const runTasks = gulp.series(jsBundleClient(configuration), ...tasks);
    return function jsWatchWorkerImpl() {
        return gulp.watch(configuration.esClientJs.watch, runTasks);
    }
}

export const jsCleanWorker = (configuration: Configuration): gulp.TaskFunction => {
    return function jsCleanWorkerImpl(cb: gulp.TaskFunctionCallback) {
        fs.rmSync(configuration.esWorkerJs.outputDir, { force: true, recursive:true });
        cb();
    }
}

export const jsCleanClient = (configuration: Configuration): gulp.TaskFunction => {
    return function jsCleanClientImpl(cb: gulp.TaskFunctionCallback) {
        fs.rmSync(configuration.esClientJs.outputDir, { force: true, recursive:true });
        cb();
    }
}