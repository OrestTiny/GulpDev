const gulp = require("gulp"),
  strip = require("gulp-strip-comments"),
  babel = require("gulp-babel"),
  sourcemaps = require("gulp-sourcemaps"),
  sass = require("gulp-sass")(require("sass")),
  autoprefixer = require("gulp-autoprefixer"),
  gcmqp = require("gulp-css-mqpacker"),
  size = require("gulp-size"),
  notify = require("gulp-notify"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  cleanCSS = require("gulp-clean-css"),
  plumber = require("gulp-plumber");

gulp.task("scripts", function () {
  return gulp
    .src([
      "./THEME_NAME/assets/js/**/*.js",
      "!./THEME_NAME/assets/js/**/*.min.js",
    ])
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(strip())
    .pipe(gulp.dest("./THEME_NAME/assets/js"))
    .pipe(size());
});

gulp.task("widgets-scripts", function () {
  return gulp
    .src(["./THEME_NAME/widgets/**/*.js", "!./THEME_NAME/widgets/**/*.min.js"])
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(strip())
    .pipe(gulp.dest("./THEME_NAME/widgets/"))
    .pipe(size());
});

gulp.task("sass", function () {
  return gulp
    .src("./THEME_NAME/assets/css/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(
      sass({
        outputStyle: "expanded",
        includePaths: ["node_modules"],
      }).on("error", function (err) {
        this.emit("end");
        return notify().write(err);
      })
    )
    .pipe(
      autoprefixer({
        browserslistrc: ["> 1%', 'last 3 versions"],
        cascade: true,
      })
    )
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gcmqp())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./THEME_NAME/assets/css"))
    .pipe(size());
});

gulp.task("sass-widget", function () {
  return gulp
    .src("./THEME_NAME/widgets/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(
      sass({
        outputStyle: "expanded",
        includePaths: ["node_modules"],
      }).on("error", function (err) {
        this.emit("end");
        return notify().write(err);
      })
    )
    .pipe(
      autoprefixer({
        browserslistrc: ["> 1%', 'last 3 versions"],
        cascade: true,
      })
    )
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gcmqp())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./THEME_NAME/widgets"))
    .pipe(size());
});

//watcher
gulp.task("watch", function () {
  gulp.watch("./THEME_NAME/assets/css/**/*.scss", gulp.series("sass"));
  gulp.watch(
    ["./THEME_NAME/widgets/**/*.js", "!./THEME_NAME/widgets/**/*.min.js"],
    gulp.series("widgets-scripts")
  );
  gulp.watch("./THEME_NAME/widgets/**/*.scss", gulp.series("sass-widget"));
  gulp.watch(
    ["./THEME_NAME/assets/js/**/*.js", "!./THEME_NAME/assets/js/**/*.min.js"],
    gulp.series("scripts")
  );
});

gulp.task("default", gulp.series("watch"));
