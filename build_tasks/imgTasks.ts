import { Configuration } from "./_configuration";
import gulp, { dest } from 'gulp'
import fs from 'fs'

export const imagesGenerate = (configuration: Configuration): gulp.TaskFunction => {
    return function imagesGenerateImpl() {
        fs.mkdirSync(configuration.imagesDestPath, {recursive:true});
        return gulp.src(configuration.imagesSourcePath,{encoding:false})
                .pipe(dest(configuration.imagesDestPath));
    }
};

export const imagesClean = (configuration: Configuration): gulp.TaskFunction => {
    return function imagesCleanImpl(cb: gulp.TaskFunctionCallback) {
        fs.rmSync(configuration.imagesDestPath, { force: true, recursive: true });
        cb();
    }
};