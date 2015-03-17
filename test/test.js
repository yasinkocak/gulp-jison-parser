var should = require('should');
var rawJison = require('jison');
var Generator = require('jison').Generator;
var gulpJison = require('../');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');
var lexParser = require('lex-parser');
var ebnfParser = require('ebnf-parser');
require('mocha');

var createVirtualFile = function (filename, contents) {
    return new gutil.File({
        path: path.join(__dirname, 'fixtures', filename),
        base: path.join(__dirname, 'fixtures'),
        cwd: process.cwd(),
        contents: contents
    });
};

describe('gulp-jison', function() {
    it('should output the same parser as jison', function (done) {
        var filepath = 'test/fixtures/calculator.jison';
        var text = fs.readFileSync(filepath);
        var expected = rawJison.Parser(text.toString()).generate();

        gulpJison()
            .on('error', done)
            .on('data', function(data) {
                data.contents.toString().should.equal(expected);
                done();
            })
            .write(createVirtualFile('calculator.jison', text));
    });

    it('should work with options', function (done) {
        var options = {
            type: 'slr',
            moduleType: 'amd',
            moduleName: 'jsoncheck',
            lexFile: 'test/fixtures/calculator.jisonlex'
        };

        var filepath = 'test/fixtures/calculator.jison';
        var grammarText = fs.readFileSync(filepath, 'utf-8');

        var grammar = ebnfParser.parse(grammarText);
        grammar.lex = lexParser.parse(fs.readFileSync(options.lexFile, 'utf-8'));
        var expectedGrammar = new Generator(grammar, options).generate();

        gulpJison(options)
            .on('error', done)
            .on('data', function(data) {
                data.contents.toString().should.equal(expectedGrammar);
                done();
            })
            .write(createVirtualFile('calculator.jison', new Buffer(grammarText)));
    });
});