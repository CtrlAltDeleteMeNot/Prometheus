import { Configuration } from "./_configuration";
import gulp from 'gulp'
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

export const soundsCopy = (configuration: Configuration): gulp.TaskFunction => {
    return async function soundsCopyImpl(cb) {
        const opName = 'soundsCopyImpl';
        const baseDir = process.cwd();
        const inputDir = path.resolve(baseDir, configuration.sounds.inputDir);
        const outputDir = path.resolve(baseDir, configuration.sounds.outputDir);
        const pattern = '*.mp3';
        const inputFilePaths = await glob(pattern, { cwd: inputDir, absolute: true });
        if (inputFilePaths.length === 0) {
            throw new Error(`No valid image files found for ${opName} task`);
        } else {
            console.info(`Found ${inputFilePaths.length} valid files for ${opName} task.`);
        }
        fs.mkdirSync(outputDir);
        for (const inputFilePath of inputFilePaths) {
            const fileName = path.basename(inputFilePath);
            const outFilePath = path.join(outputDir, fileName);
            fs.copyFileSync(inputFilePath, outFilePath);
        }
        cb();
    }
}

export const soundsClean = (configuration: Configuration): gulp.TaskFunction => {
    return function soundsCleanImpl(cb: gulp.TaskFunctionCallback) {
        fs.rmSync(configuration.sounds.outputDir, { force: true, recursive: true });
        cb();
    }
};