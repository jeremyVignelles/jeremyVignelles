/**
 * The grunt configuration file
 */

module.exports = function (grunt) {
    "use strict";

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            client: {
                src: ['script/*.ts'],
                out: 'script/output/script.js',
                options: {
                    sourceMap: true,
                    target: 'es5',
                    noImplicitAny: true,
                    removeComments: false
                }
            },
            nodeJS: {
                src: ['*.ts', 'tools/*.ts', 'i18n/i18n.ts', 'data/dataManager.ts'],
                options: {
                    module: 'commonjs',
                    target: 'es5',
                    noImplicitAny: true
                }
            }
        },
        less:{
            default : {
                files: {
                    "stylesheet/output/style.css": "stylesheet/style.less",
                    "stylesheet/output/style-ie.css": "stylesheet/style-ie.less"
                }
            }
        },
        jshint: {
            node: {
                src:['*.js', 'data/*.js', 'i18n/*.js', 'tools/*.js'],
                options: {
                    node: true,
                    curly: true,
                    eqeqeq: true,
                    forin: true,
                    futurehostile: true,
                    latedef: true,
                    nonew:true,
                    unused:true
                }
            },
            client: {
                src: ['script/output/*.js'],
                options: {
                    browser: true,
                    curly: true,
                    eqeqeq: true,
                    forin: true,
                    futurehostile: true,
                    latedef: true,
                    nonew:true,
                    unused:true
                }
            }
        },
        csslint: {
            all: {
                options: {
                    'ids': false,
                    'universal-selector': false,
                    'box-sizing': false
                },
                src: ['stylesheet/output/*.css']
            }
        }
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-csslint');

    grunt.registerTask('build', ['ts', 'less']);
    grunt.registerTask('check', ['jshint', 'csslint']);
    grunt.registerTask('default', ['build', 'check']);
};
