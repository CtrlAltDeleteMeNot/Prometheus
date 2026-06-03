import gulp from 'gulp';

import { developmentConfiguration, publishConfiguration } from './build_tasks/_configuration';
import { cssGenerate, cssClean, cssWatch } from './build_tasks/cssTasks';
import { jsBundleClient, jsBundleWorker, jsCleanClient, jsCleanWorker, jsWatchClient, jsWatchWorker } from './build_tasks/jsTasks';
import { svgActionIconsRegistryGenerator, svgCryptoIconsRegistryGenerator } from './build_tasks/svgTasks';
import { startServer, reloadServer } from './build_tasks/localServerTasks'
import { htmlClean, htmlGenerate, htmlWatch } from './build_tasks/htmlTasks';
import { manifestCleanup, manifestGenerate } from './build_tasks/manifestTasks';
import { imagesClean, imagesGenerate } from './build_tasks/imgTasks';

const devConfig = developmentConfiguration;
const releaseConfig = publishConfiguration;

const cleanDev = gulp.parallel(imagesClean(devConfig), htmlClean(devConfig), cssClean(devConfig), jsCleanClient(devConfig), jsCleanWorker(devConfig), manifestCleanup(devConfig));
const buildDev = gulp.parallel(imagesGenerate(devConfig), manifestGenerate(devConfig), htmlGenerate(devConfig), svgActionIconsRegistryGenerator(devConfig), svgCryptoIconsRegistryGenerator(devConfig), cssGenerate(devConfig), jsBundleClient(devConfig), jsBundleWorker(devConfig));
const watchDev = gulp.parallel(
  jsWatchClient(devConfig, reloadServer()),
  jsWatchWorker(devConfig, reloadServer()),
  cssWatch(devConfig, reloadServer()),
  htmlWatch(devConfig, reloadServer())
);
const serveDev = gulp.series(startServer(devConfig), reloadServer(), watchDev)

export const dev = gulp.series(cleanDev, buildDev)
export const pub = gulp.series(
  imagesClean(releaseConfig), htmlClean(releaseConfig), cssClean(releaseConfig), jsCleanClient(releaseConfig), jsCleanWorker(releaseConfig), manifestCleanup(releaseConfig),
  imagesGenerate(releaseConfig),
  manifestGenerate(releaseConfig),
  htmlGenerate(releaseConfig),
  svgActionIconsRegistryGenerator(releaseConfig),
  svgCryptoIconsRegistryGenerator(releaseConfig),
  cssGenerate(releaseConfig),
  jsBundleClient(releaseConfig),
  jsBundleWorker(releaseConfig)
);

export const runDev =  gulp.series(
  dev, serveDev
);
export const all = gulp.parallel(dev,pub)

export default runDev;

