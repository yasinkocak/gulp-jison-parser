# gulp-jison-parser
Jison plugin for gulp (gulpjs.com)

Usage
-----

```javascript
var jison = require('gulp-jison');

gulp.task('jison', function() {
    return gulp.src('./src/*.jison')
        .pipe(jison({ moduleType: 'commonjs' }))
        .pipe(gulp.dest('./src/'));
});
```

With a seperate lexical grammar file
```javascript
var jison = require('gulp-jison');

gulp.task('jison', function() {
    return gulp.src('./src/*.jison')
        .pipe(jison({ lexFile: 'lex.jisonlex' }))
        .pipe(gulp.dest('./src/'));
});
```