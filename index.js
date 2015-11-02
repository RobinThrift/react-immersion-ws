//index.js
'use strict';

var Metalsmith  = require('metalsmith'),
    markdown    = require('metalsmith-markdown'),
    templates   = require('metalsmith-templates'),
    Handlebars  = require('handlebars'),
    sass        = require('metalsmith-sass'),
    collections = require('metalsmith-collections'),
    ignore      = require('metalsmith-ignore'),
    slides      = require('./lib/slides'),
    autoTemplate = require('./lib/autoTemplate'),
    shortcodes  = require('metalsmith-flexible-shortcodes');

Handlebars.registerHelper('json', JSON.stringify);

Metalsmith(__dirname)
    .use(ignore([
        '_*', '.*',
        '**/_*', '**/.*'
    ]))    
    .use(slides.split())
    .use(slides.getProjectMeta())
    .use(slides.extractMeta())
    .use(markdown({
        gfm: true,
        tables: true,
        smartLists: true,
        smartypants: true,
        highlight: function (code, lang) {
            if (lang) {
                return require('highlight.js').highlight(lang, code).value;
            } else {
                return require('highlight.js').highlightAuto(code).value;
            }
        }
    }))
    .use(shortcodes({
        clean: true,
        shortcodes: {
            'fragment': function(str) {
                return '<div class="fragment">' + str + '</div>';
            },
            'colour': function(str, params) {
                return '<span style="color: #' + params.hex + ';">' + str + '</span>';
            },
            'var': function(str, params, data) {
                for (var name in params) {
                    return data.config[name];
                }
            },
            'white': function(str) {
                return '<span class="text--white">' + str + '</span>';
            },
            'shadowed': function(str) {
                return '<span class="text--shadowed">' + str + '</span>';
            },
            'accented': function(str) {
                return '<span class="text--accented">' + str + '</span>';
            },
            'emphasize': function(str) {
                return '<span class="text--emphasize">' + str + '</span>';
            },
            'small': function(str) {
                return '<small class="text--small">' + str + '</small>';
            },
            'half': function(str) {
                return '<div class="half">' + str + '</div>';
            }
        }
    }))
    .use(collections({
        slides: {
            pattern: 'slide-*',
            sortBy: 'num'
        }
    }))
    .use(autoTemplate({
        pattern: 'slide-*',
        templateName: 'slide.hbt'
    }))
    .use(templates({
        engine: 'handlebars'
    }))
    .use(slides.rmSlides())
    .use(slides.makePage('wrap.hbt'))
    .use(templates({
        engine: 'handlebars'
    }))
    .use(sass({
        outputStyle: 'expanded'
    }))
    .destination('./build')
    .build(function(err) {
        if (err) { throw err; }
        console.log('Built!', new Date()); 
    });
