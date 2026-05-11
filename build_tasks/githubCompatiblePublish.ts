import gulp from 'gulp'
import { Configuration } from "./_configuration";
const githubFolder = './docs'
export const githubCompatiblePublish = (configuration: Configuration): gulp.TaskFunction => {
    return function githubCompatiblePublishImpl() {
        return gulp
            .src(`${configuration.appRootDir}/**/*`)
            .pipe(gulp.dest(githubFolder))
    }
}