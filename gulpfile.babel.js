import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import gimage from "gulp-image";
import autop from "gulp-autoprefixer";
import miniCSS from "gulp-csso";
import gbro from "gulp-bro";
import babelify from "babelify";
import gghPages from "gulp-gh-pages";

const gsass = require("gulp-sass")(require("node-sass"));

const routes = {
  pug: {
    watch: "src/views/**/*.pug",
    src: "src/views/*.pug",
    dest: "build",
  },
  img: {
    src: "src/client/img/*",
    dest: "build/img",
  },
  scss: {
    watch: "src/client/scss/**/*.scss",
    src: "src/client/scss/styles.scss",
    dest: "build/css",
  },
  js: {
    watch: "src/client/js/**/*.js",
    src: "src/client/js/main.js",
    dest: "build/js",
  },
};

const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const img = () =>
  gulp.src(routes.img.src).pipe(gimage()).pipe(gulp.dest(routes.img.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(gsass().on("error", gsass.logError))
    .pipe(autop())
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      gbro({
        transform: [
          babelify.configure({ presets: ["@babel/preset-env"] }),
          ["uglifyify", { global: true }],
        ],
      })
    )
    .pipe(gulp.dest(routes.js.dest));

const clean = () => del(["build", ".publish"]);

const webserver = () =>
  gulp.src("build").pipe(ws({ livereload: true, open: true }));

const ghpage = () => gulp.src("build/**/*").pipe(gghPages());

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.src, styles);
  gulp.watch(routes.js.watch, js);
};

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles, js]);

const post = gulp.parallel([webserver, watch]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, post]);
export const deploy = gulp.series([build, ghpage, clean]);
