import esbuild from 'esbuild';
import fs from 'fs';
import gulp from 'gulp'
import { Configuration } from "./_configuration";


export const cssGenerate = (configuration: Configuration): gulp.TaskFunction => {
  return function cssGenerateImpl() {
    return esbuild.build({
      entryPoints: [configuration.esClientCss.input],
      outfile: configuration.esClientCss.output,
      bundle: true,
      minify: false,
      sourcemap: true,
      legalComments: 'inline',
    });
  }
};


export const cssClean = (configuration: Configuration): gulp.TaskFunction => {
  return function cssCleanImpl(cb: gulp.TaskFunctionCallback) {
    fs.rmSync(configuration.esClientCss.outputDir, { force: true, recursive: true });
    cb();
  }
};

export const cssWatch = (configuration: Configuration, ...tasks: gulp.TaskFunction[]): gulp.TaskFunction => {
  const runTasks = gulp.series(cssGenerate(configuration), ...tasks);
  return function cssWatchImpl() {
    return gulp.watch(configuration.esClientCss.watch, runTasks);
  }
};