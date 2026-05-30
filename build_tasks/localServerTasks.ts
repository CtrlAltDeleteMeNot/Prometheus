
import browserSync from 'browser-sync';
import gulp from 'gulp'
import { Configuration } from "./_configuration";


const bs = browserSync.create();

export const startServer = (configuration: Configuration): gulp.TaskFunction => {
    return function startServerImpl(cb: gulp.TaskFunctionCallback) {
        bs.init({
            server: {
                baseDir: configuration.app
            },
            open: "external",
            notify: true,
            host: "legion.local",
            https: true,
            port: configuration.localDevPort
        });
        cb();
    }
};

export const reloadServer = (): gulp.TaskFunction => {
    return function reloadServerImpl(cb: gulp.TaskFunctionCallback) {
        bs.reload();
        cb();
    }
}