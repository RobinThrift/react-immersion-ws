//lib/autoTemplate.js


var autoTemplate = function(opts) {
    'use strict';
    var pattern = new RegExp(opts.pattern);

    return function(files, metalsmith, done) {
        for (var file in files) {
            if (pattern.test(file)) {
                var _f = files[file];
                if (!_f.template) {
                    _f.template = opts.templateName;

                }

            }

        }
        done();

    };

};
module.exports = autoTemplate;
