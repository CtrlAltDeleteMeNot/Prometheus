import gulp from 'gulp'
import { Configuration } from "./_configuration";
const githubFolder = '../Prometheus_Publish'
export const githubCompatiblePublish = (configuration: Configuration): gulp.TaskFunction => {
    return function githubCompatiblePublishImpl() {
        return gulp
            .src(`${configuration.appRootDir}/**/*`)
            .pipe(gulp.dest(githubFolder))
    }
}