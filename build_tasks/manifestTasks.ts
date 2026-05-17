import { Configuration } from "./_configuration";
import gulp from 'gulp'
import fs from 'fs'

export const manifestGenerate = (configuration: Configuration): gulp.TaskFunction => {
    return function createManifestImpl(cb: gulp.TaskFunctionCallback) {
        fs.writeFileSync(configuration.manifestPath, JSON.stringify(configuration.manifest, null, 2));
        cb();
    }
};

export const manifestCleanup = (configuration: Configuration): gulp.TaskFunction => {
    return function manifestCleanupImpl(cb: gulp.TaskFunctionCallback) {
        fs.rmSync(configuration.manifestPath, { force: true, recursive:true });
        cb();
    }
};