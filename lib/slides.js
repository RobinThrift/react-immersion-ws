//lib/slides.js
'use strict';

var yaml = require('js-yaml'),
    getProjectMeta, split, rmSlides,
    stripMeta, extractMeta, makePage;
/*
 * Extracts the project meta from the first slide
 * and removes it
 */
getProjectMeta = function() {
    return function(files, metalsmith, done) {
        for (var file in files) {
            if (file === 'slide-0.md') {
                var meta = metalsmith.metadata(),
                    data = files[file].contents.toString();
                meta.config = yaml.safeLoad('---\n' + data);
                metalsmith.metadata(meta);
                delete files[file];
            }
        }
        done();
    };
}; 
module.exports.getProjectMeta = getProjectMeta; 



/*
 * Splits the slides at '--' and creates new files
 */
split = function(pattern) {
    var baseFile = pattern || /(slides)/g;
    return function(files, metalsmith, done) {
        for (var file in files) {
            if (baseFile.test(file)) {
                var slides = files[file].contents.toString(),
                    i      = 0;
                            
                slides.split(/^\-{2}/gm).forEach(function(val) {
                    files['slide-' + i + '.md'] = {
                        num: i,
                        shortcodes: true,
                        mode: '655',
                        contents: new Buffer(val.trim())
                    };
                    i++;
                });
                delete files[file];
            }
        }
        done();
    };
};
module.exports.split = split;

stripMeta = function(slide) {
    var pattern = /^-{2}(\s+\{\s*([\s\S]*?)\s*\}\s*)?/gm;
    return slide.replace(pattern, '').trim();
};

extractMeta = function() {
    var isSlide = /(slide-*)/i,
        merge   = require('lodash.merge');
    return function(files, metalsmith, done) {
        for (var file in files) {
            if (isSlide.test(file)) {
                file = files[file];
                var slide = '-- ' + file.contents.toString(),
                    pattern = /^-{2}\s+\{\s*([\s\S]*?)\s*\}\s*/gm,
                    extract = pattern.exec(slide),
                    parsed  = {};

                if (extract) {
                    extract = extract[1].replace(/^(\t|\s{2,4})/gm, '');
                    parsed  = require('js-yaml').safeLoad('---\n' + extract);
                }
                merge(file, parsed);
                file.contents = new Buffer(stripMeta(slide));
            }
        }
        done();
    };
};
module.exports.extractMeta = extractMeta;


rmSlides = function() {
    var pattern = /(slide-*)/i;
    return function(files, metalsmith, done) {
        for (var file in files) {
            if (pattern.test(file)) {
                delete files[file];
            }
        }
        done();
    };
};
module.exports.rmSlides = rmSlides;



makePage = function(template) {
    return function(files, metalsmith, done) {
        var page = metalsmith.metadata().config;
        page.mode = '655';
        page.contents = new Buffer('');
        page.template = template;
        files['index.html'] = page;
        done();
    };
};
module.exports.makePage = makePage;
