import gulp from 'gulp';

import { developmentConfiguration, publishConfiguration } from './build_tasks/_configuration';
import { cssGenerate, cssClean, cssWatch } from './build_tasks/cssTasks';
import { jsBundleClient, jsBundleWorker, jsCleanClient, jsCleanWorker, jsWatchClient, jsWatchWorker } from './build_tasks/jsTasks';
import { svgActionIconsRegistryGenerator, svgCryptoIconsRegistryGenerator } from './build_tasks/svgTasks';
import { startServer, reloadServer } from './build_tasks/localServerTasks'
import { htmlClean, htmlGenerate, htmlWatch } from './build_tasks/htmlTasks';
import { manifestCleanup, manifestGenerate } from './build_tasks/manifestTasks';
import { imagesClean, imagesGenerate } from './build_tasks/imgTasks';

const dev = developmentConfiguration;
const pub = publishConfiguration;

const cleanup = gulp.parallel(imagesClean(dev), htmlClean(dev), cssClean(dev), jsCleanClient(dev), jsCleanWorker(dev), manifestCleanup(dev));
const build = gulp.parallel(imagesGenerate(dev), manifestGenerate(dev), htmlGenerate(dev), svgActionIconsRegistryGenerator(dev), svgCryptoIconsRegistryGenerator(dev), cssGenerate(dev), jsBundleClient(dev), jsBundleWorker(dev));
const watch = gulp.parallel(
  jsWatchClient(dev, reloadServer()),
  jsWatchWorker(dev, reloadServer()),
  cssWatch(dev, reloadServer()),
  htmlWatch(dev, reloadServer())
);
const serve = gulp.series(startServer(dev), reloadServer(), watch)
export default gulp.series(
  cleanup, build, serve
);
export const publish = gulp.series(
  imagesClean(pub), htmlClean(pub), cssClean(pub), jsCleanClient(pub), jsCleanWorker(pub), manifestCleanup(pub),
  imagesGenerate(pub), 
  manifestGenerate(pub), 
  htmlGenerate(pub), 
  svgActionIconsRegistryGenerator(pub), 
  svgCryptoIconsRegistryGenerator(pub), 
  cssGenerate(pub), 
  jsBundleClient(pub), 
  jsBundleWorker(pub)
);

