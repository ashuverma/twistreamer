/* jshint camelcase: false */
module.exports = function(grunt) {

    // Time how long tasks take. 
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            js: {
                files: ['client/js/*.js', 'server/**/*.js', 'gruntfile.js'],
                tasks: ['jshint', 'concat'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['public/views/**'],
                options: {
                    livereload: true,
                }
            },
            css: {
                files: ['client/css/*.css'],
                tasks: ['cssmin'],
                options: {
                    livereload: true
                }
            },
            karma: {
                files: ['unit/*.js'],
                tasks: ['karma:unit:run']
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: ['gruntfile.js', 'client/js/*.js', 'server/**/*.js']
        },
        nodemon: {
            dev: {
                script: 'app.js',
                options: {
                    args: [],
                    ignore: ['node_modules/**'],
                    watch: ['server'],
                    debug: true,
                    delay: 1,
                    env: {
                        PORT: 3000,
                        NODE_ENV: 'development'
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            basic_and_extras: {
                files: {
                    'public/assets/application.js': [
                        'client/vendor/jquery/dist/jquery.js',
                        'client/vendor/angular/angular.js',
                        'client/vendor/angular-sanitize/angular-sanitize.js',
                        'client/vendor/angular-animate/angular-animate.js',
                        'client/vendor/angular-route/angular-route.js',
                        'client/vendor/ngInfiniteScroll/build/ng-infinite-scroll.js',
                        'client/vendor/highcharts/highcharts.js',
                        'client/vendor/highcharts-ng/dist/highcharts-ng.js',
                       // 'client/vendor/d3/d3.js',
                        //'client/vendor/rickshaw/rickshaw.js',
                        'client/js/app.js',
                        'client/js/config.js',
                        'client/js/services.js',
                        'client/js/directives.js',
                        'client/js/controllers.js'
                    ]
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'public/assets/application.css': [
                        'client/vendor/bootstrap/dist/css/bootstrap.css',
                        'client/vendor/rickshaw/rickshaw.css',
                        'client/css/*.css'
                    ]
                }
            }
        },
        rev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8
            },
            assets: {
                files: [{
                    src: [
                        'public/assets/*.{js,css}'
                    ]
                }]
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    //'public/assets/application.<%= grunt.template.today("dd.mm.yyyy") %>.js': ['<%= concat.dist.dest %>']
                    'public/assets/application.js': ['public/assets/application.js']
                }
            }
        },
        clean: ['public/assets/'],
        env: {
            development: {
                NODE_ENV: 'development'
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                background: true
            }
        },
        mochaTest: {
            test: {
                options: {
                    colors: true,
                    reporter: 'spec',
                    timeout: 15000
                },
                src: ['tests/server/**/*.js']
            }
        }
    })

    //Load Npm Task
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-contrib-jshint')
    grunt.loadNpmTasks('grunt-nodemon')
    grunt.loadNpmTasks('grunt-concurrent')
    grunt.loadNpmTasks('grunt-env')
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-cssmin')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-rev')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-mocha-test');

    //grunt.option('force', true)
    grunt.registerTask('default', ['jshint', 'clean', 'concat','cssmin', 'concurrent'])
    grunt.registerTask('build', ['jshint',  'clean', 'concat', 'uglify','cssmin', 'rev'])
    grunt.registerTask('test', ['mochaTest'])
}
/* jshint camelcase: true */