import gulp from 'gulp';

import { config } from './build_tasks/_configuration';
import { cssGenerate, cssClean, cssWatch } from './build_tasks/cssTasks';
import { jsBundleClient, jsBundleWorker, jsCleanClient, jsCleanWorker, jsWatchClient, jsWatchWorker } from './build_tasks/jsTasks';
import { svgActionIconsRegistryGenerator, svgCryptoIconsRegistryGenerator } from './build_tasks/svgTasks';
import { startServer, reloadServer } from './build_tasks/localServerTasks'
import { githubCompatiblePublish } from './build_tasks/githubCompatiblePublish';


export const cleanup = gulp.parallel(cssClean(config), jsCleanClient(config), jsCleanWorker(config));
export const build = gulp.parallel(svgActionIconsRegistryGenerator(config), svgCryptoIconsRegistryGenerator(config), cssGenerate(config), jsBundleClient(config), jsBundleWorker(config));
export const watch = gulp.parallel(
  jsWatchClient(config, reloadServer()),
  jsWatchWorker(config, reloadServer()),
  cssWatch(config, reloadServer()),
);

export const serve = gulp.series(startServer(config), reloadServer(), watch)
export default gulp.series(
  cleanup, build, serve
);

export const publishForGithub = gulp.series(cleanup, build, githubCompatiblePublish(config));

