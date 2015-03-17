var through = require('through2'),
    fs = require('fs'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError;

var Generator = require('jison').Generator,
    ebnfParser = require('ebnf-parser'),
    lexParser = require('lex-parser');

module.exports = function (options) {
    options = options || {};

    return through.obj(function (file, enc, cb) {

        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            return cb(new PluginError('gulp-jison-parser', 'Streams not supported'));
        }

        var str = file.contents.toString();

        try {
            var grammar = ebnfParser.parse(str);
            if (options.lexFile) {
                var lexFile = fs.readFileSync(options.lexFile, 'utf-8');
                grammar.lex = lexParser.parse(lexFile);
            }
            file.contents = new Buffer(new Generator(grammar, options).generate());
            file.path = gutil.replaceExtension(file.path, ".js");
            this.push(file);
        } catch (err) {
            // Convert the keys so PluginError can read them
            err.lineNumber = err.line;
            err.fileName = err.filename;

            // Add a better error message
            err.message = err.message + ' in file ' + err.fileName + ' line no. ' + err.lineNumber;

            throw new PluginError('gulp-jison-parser', err);
        }
        return cb();
    });
};