var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var Generator = require('jison').Generator;

var ebnfParser = require('ebnf-parser');
var lexParser  = require('lex-parser');
var fs = require('fs');

const PLUGIN_NAME = 'gulp-jison';

module.exports = function (options) {
    options = options || {};

    return through.obj(function (file, enc, callback) {
        if (file.isNull()) {
            this.push(file);
            return callback();
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported'));
            return callback();
        }

        if (file.isBuffer()) {
            try {
                var grammar = ebnfParser.parse(file.contents.toString());
                if (options.lexFile) {
                    var lexFile = fs.readFileSync(options.lexFile, 'utf-8');
                    grammar.lex = lexParser.parse(lexFile);
                }
                file.contents = new Buffer(new Generator(grammar, options).generate());
                file.path = gutil.replaceExtension(file.path, ".js");
                this.push(file);
            } catch (error) {
                this.emit('error', new PluginError(PLUGIN_NAME, error));
            }
            return callback();
        }
    });
};