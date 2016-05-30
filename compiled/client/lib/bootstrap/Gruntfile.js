'use strict';

/*!
 * Bootstrap's Gruntfile
 * http://getbootstrap.com
 * Copyright 2013-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines

  grunt.util.linefeed = '\n';

  RegExp.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  var fs = require('fs');
  var path = require('path');
  var npmShrinkwrap = require('npm-shrinkwrap');
  var generateGlyphiconsData = require('./grunt/bs-glyphicons-data-generator.js');
  var BsLessdocParser = require('./grunt/bs-lessdoc-parser.js');
  var getLessVarsData = function getLessVarsData() {
    var filePath = path.join(__dirname, 'less/variables.less');
    var fileContent = fs.readFileSync(filePath, { encoding: 'utf8' });
    var parser = new BsLessdocParser(fileContent);
    return { sections: parser.parseFile() };
  };
  var generateRawFiles = require('./grunt/bs-raw-files-generator.js');
  var generateCommonJSModule = require('./grunt/bs-commonjs-generator.js');
  var configBridge = grunt.file.readJSON('./grunt/configBridge.json', { encoding: 'utf8' });

  Object.keys(configBridge.paths).forEach(function (key) {
    configBridge.paths[key].forEach(function (val, i, arr) {
      arr[i] = path.join('./docs/assets', val);
    });
  });

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' + ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' + ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' + ' * Licensed under the <%= pkg.license %> license\n' + ' */\n',
    jqueryCheck: configBridge.config.jqueryCheck.join('\n'),
    jqueryVersionCheck: configBridge.config.jqueryVersionCheck.join('\n'),

    // Task configuration.
    clean: {
      dist: 'dist',
      docs: 'docs/dist'
    },

    jshint: {
      options: {
        jshintrc: 'js/.jshintrc'
      },
      grunt: {
        options: {
          jshintrc: 'grunt/.jshintrc'
        },
        src: ['Gruntfile.js', 'package.js', 'grunt/*.js']
      },
      core: {
        src: 'js/*.js'
      },
      test: {
        options: {
          jshintrc: 'js/tests/unit/.jshintrc'
        },
        src: 'js/tests/unit/*.js'
      },
      assets: {
        src: ['docs/assets/js/src/*.js', 'docs/assets/js/*.js', '!docs/assets/js/*.min.js']
      }
    },

    jscs: {
      options: {
        config: 'js/.jscsrc'
      },
      grunt: {
        src: '<%= jshint.grunt.src %>'
      },
      core: {
        src: '<%= jshint.core.src %>'
      },
      test: {
        src: '<%= jshint.test.src %>'
      },
      assets: {
        options: {
          requireCamelCaseOrUpperCaseIdentifiers: null
        },
        src: '<%= jshint.assets.src %>'
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>\n<%= jqueryCheck %>\n<%= jqueryVersionCheck %>',
        stripBanners: false
      },
      bootstrap: {
        src: ['js/transition.js', 'js/alert.js', 'js/button.js', 'js/carousel.js', 'js/collapse.js', 'js/dropdown.js', 'js/modal.js', 'js/tooltip.js', 'js/popover.js', 'js/scrollspy.js', 'js/tab.js', 'js/affix.js'],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        compress: {
          warnings: false
        },
        mangle: true,
        preserveComments: 'some'
      },
      core: {
        src: '<%= concat.bootstrap.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      },
      customize: {
        src: configBridge.paths.customizerJs,
        dest: 'docs/assets/js/customize.min.js'
      },
      docsJs: {
        src: configBridge.paths.docsJs,
        dest: 'docs/assets/js/docs.min.js'
      }
    },

    qunit: {
      options: {
        inject: 'js/tests/unit/phantom.js'
      },
      files: 'js/tests/index.html'
    },

    less: {
      compileCore: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        src: 'less/bootstrap.less',
        dest: 'dist/css/<%= pkg.name %>.css'
      },
      compileTheme: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>-theme.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>-theme.css.map'
        },
        src: 'less/theme.less',
        dest: 'dist/css/<%= pkg.name %>-theme.css'
      }
    },

    autoprefixer: {
      options: {
        browsers: configBridge.config.autoprefixerBrowsers
      },
      core: {
        options: {
          map: true
        },
        src: 'dist/css/<%= pkg.name %>.css'
      },
      theme: {
        options: {
          map: true
        },
        src: 'dist/css/<%= pkg.name %>-theme.css'
      },
      docs: {
        src: ['docs/assets/css/src/docs.css']
      },
      examples: {
        expand: true,
        cwd: 'docs/examples/',
        src: ['**/*.css'],
        dest: 'docs/examples/'
      }
    },

    csslint: {
      options: {
        csslintrc: 'less/.csslintrc'
      },
      dist: ['dist/css/bootstrap.css', 'dist/css/bootstrap-theme.css'],
      examples: ['docs/examples/**/*.css'],
      docs: {
        options: {
          ids: false,
          'overqualified-elements': false
        },
        src: 'docs/assets/css/src/docs.css'
      }
    },

    cssmin: {
      options: {
        // TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
        //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
        compatibility: 'ie8',
        keepSpecialComments: '*',
        sourceMap: true,
        advanced: false
      },
      minifyCore: {
        src: 'dist/css/<%= pkg.name %>.css',
        dest: 'dist/css/<%= pkg.name %>.min.css'
      },
      minifyTheme: {
        src: 'dist/css/<%= pkg.name %>-theme.css',
        dest: 'dist/css/<%= pkg.name %>-theme.min.css'
      },
      docs: {
        src: ['docs/assets/css/ie10-viewport-bug-workaround.css', 'docs/assets/css/src/pygments-manni.css', 'docs/assets/css/src/docs.css'],
        dest: 'docs/assets/css/docs.min.css'
      }
    },

    csscomb: {
      options: {
        config: 'less/.csscomb.json'
      },
      dist: {
        expand: true,
        cwd: 'dist/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/'
      },
      examples: {
        expand: true,
        cwd: 'docs/examples/',
        src: '**/*.css',
        dest: 'docs/examples/'
      },
      docs: {
        src: 'docs/assets/css/src/docs.css',
        dest: 'docs/assets/css/src/docs.css'
      }
    },

    copy: {
      fonts: {
        expand: true,
        src: 'fonts/*',
        dest: 'dist/'
      },
      docs: {
        expand: true,
        cwd: 'dist/',
        src: ['**/*'],
        dest: 'docs/dist/'
      }
    },

    connect: {
      server: {
        options: {
          port: 3000,
          base: '.'
        }
      }
    },

    jekyll: {
      options: {
        config: '_config.yml'
      },
      docs: {},
      github: {
        options: {
          raw: 'github: true'
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          minifyCSS: true,
          minifyJS: true,
          removeAttributeQuotes: true,
          removeComments: true
        },
        expand: true,
        cwd: '_gh_pages',
        dest: '_gh_pages',
        src: ['**/*.html', '!examples/**/*.html']
      }
    },

    jade: {
      options: {
        pretty: true,
        data: getLessVarsData
      },
      customizerVars: {
        src: 'docs/_jade/customizer-variables.jade',
        dest: 'docs/_includes/customizer-variables.html'
      },
      customizerNav: {
        src: 'docs/_jade/customizer-nav.jade',
        dest: 'docs/_includes/nav/customize.html'
      }
    },

    htmllint: {
      options: {
        ignore: ['Attribute "autocomplete" not allowed on element "button" at this point.', 'Attribute "autocomplete" is only allowed when the input type is "color", "date", "datetime", "datetime-local", "email", "month", "number", "password", "range", "search", "tel", "text", "time", "url", or "week".', 'Element "img" is missing required attribute "src".']
      },
      src: '_gh_pages/**/*.html'
    },

    watch: {
      src: {
        files: '<%= jshint.core.src %>',
        tasks: ['jshint:core', 'qunit', 'concat']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
      less: {
        files: 'less/**/*.less',
        tasks: 'less'
      }
    },

    sed: {
      versionNumber: {
        pattern: function () {
          var old = grunt.option('oldver');
          return old ? RegExp.quote(old) : old;
        }(),
        replacement: grunt.option('newver'),
        exclude: ['dist/fonts', 'docs/assets', 'fonts', 'js/tests/vendor', 'node_modules', 'test-infra'],
        recursive: true
      }
    },

    'saucelabs-qunit': {
      all: {
        options: {
          build: process.env.TRAVIS_JOB_ID,
          throttled: 10,
          maxRetries: 3,
          maxPollRetries: 4,
          urls: ['http://127.0.0.1:3000/js/tests/index.html?hidepassed'],
          browsers: grunt.file.readYAML('grunt/sauce_browsers.yml')
        }
      }
    },

    exec: {
      npmUpdate: {
        command: 'npm update'
      }
    },

    compress: {
      main: {
        options: {
          archive: 'bootstrap-<%= pkg.version %>-dist.zip',
          mode: 'zip',
          level: 9,
          pretty: true
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**'],
          dest: 'bootstrap-<%= pkg.version %>-dist'
        }]
      }
    }

  });

  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);

  // Docs HTML validation task
  grunt.registerTask('validate-html', ['jekyll:docs', 'htmllint']);

  var runSubset = function runSubset(subset) {
    return !process.env.TWBS_TEST || process.env.TWBS_TEST === subset;
  };
  var isUndefOrNonZero = function isUndefOrNonZero(val) {
    return val === undefined || val !== '0';
  };

  // Test task.
  var testSubtasks = [];
  // Skip core tests if running a different subset of the test suite
  if (runSubset('core') &&
  // Skip core tests if this is a Savage build
  process.env.TRAVIS_REPO_SLUG !== 'twbs-savage/bootstrap') {
    testSubtasks = testSubtasks.concat(['dist-css', 'dist-js', 'csslint:dist', 'test-js', 'docs']);
  }
  // Skip HTML validation if running a different subset of the test suite
  if (runSubset('validate-html') &&
  // Skip HTML5 validator on Travis when [skip validator] is in the commit message
  isUndefOrNonZero(process.env.TWBS_DO_VALIDATOR)) {
    testSubtasks.push('validate-html');
  }
  // Only run Sauce Labs tests if there's a Sauce access key
  if (typeof process.env.SAUCE_ACCESS_KEY !== 'undefined' &&
  // Skip Sauce if running a different subset of the test suite
  runSubset('sauce-js-unit') &&
  // Skip Sauce on Travis when [skip sauce] is in the commit message
  isUndefOrNonZero(process.env.TWBS_DO_SAUCE)) {
    testSubtasks.push('connect');
    testSubtasks.push('saucelabs-qunit');
  }
  grunt.registerTask('test', testSubtasks);
  grunt.registerTask('test-js', ['jshint:core', 'jshint:test', 'jshint:grunt', 'jscs:core', 'jscs:test', 'jscs:grunt', 'qunit']);

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify:core', 'commonjs']);

  // CSS distribution task.
  grunt.registerTask('less-compile', ['less:compileCore', 'less:compileTheme']);
  grunt.registerTask('dist-css', ['less-compile', 'autoprefixer:core', 'autoprefixer:theme', 'csscomb:dist', 'cssmin:minifyCore', 'cssmin:minifyTheme']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean:dist', 'dist-css', 'copy:fonts', 'dist-js']);

  // Default task.
  grunt.registerTask('default', ['clean:dist', 'copy:fonts', 'test']);

  // Version numbering task.
  // grunt change-version-number --oldver=A.B.C --newver=X.Y.Z
  // This can be overzealous, so its changes should always be manually reviewed!
  grunt.registerTask('change-version-number', 'sed');

  grunt.registerTask('build-glyphicons-data', function () {
    generateGlyphiconsData.call(this, grunt);
  });

  // task for building customizer
  grunt.registerTask('build-customizer', ['build-customizer-html', 'build-raw-files']);
  grunt.registerTask('build-customizer-html', 'jade');
  grunt.registerTask('build-raw-files', 'Add scripts/less files to customizer.', function () {
    var banner = grunt.template.process('<%= banner %>');
    generateRawFiles(grunt, banner);
  });

  grunt.registerTask('commonjs', 'Generate CommonJS entrypoint module in dist dir.', function () {
    var srcFiles = grunt.config.get('concat.bootstrap.src');
    var destFilepath = 'dist/js/npm.js';
    generateCommonJSModule(grunt, srcFiles, destFilepath);
  });

  // Docs task.
  grunt.registerTask('docs-css', ['autoprefixer:docs', 'autoprefixer:examples', 'csscomb:docs', 'csscomb:examples', 'cssmin:docs']);
  grunt.registerTask('lint-docs-css', ['csslint:docs', 'csslint:examples']);
  grunt.registerTask('docs-js', ['uglify:docsJs', 'uglify:customize']);
  grunt.registerTask('lint-docs-js', ['jshint:assets', 'jscs:assets']);
  grunt.registerTask('docs', ['docs-css', 'lint-docs-css', 'docs-js', 'lint-docs-js', 'clean:docs', 'copy:docs', 'build-glyphicons-data', 'build-customizer']);

  grunt.registerTask('prep-release', ['dist', 'docs', 'jekyll:github', 'htmlmin', 'compress']);

  // Task for updating the cached npm packages used by the Travis build (which are controlled by test-infra/npm-shrinkwrap.json).
  // This task should be run and the updated file should be committed whenever Bootstrap's dependencies change.
  grunt.registerTask('update-shrinkwrap', ['exec:npmUpdate', '_update-shrinkwrap']);
  grunt.registerTask('_update-shrinkwrap', function () {
    var done = this.async();
    npmShrinkwrap({ dev: true, dirname: __dirname }, function (err) {
      if (err) {
        grunt.fail.warn(err);
      }
      var dest = 'test-infra/npm-shrinkwrap.json';
      fs.renameSync('npm-shrinkwrap.json', dest);
      grunt.log.writeln('File ' + dest.cyan + ' updated.');
      done();
    });
  });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvYm9vdHN0cmFwL0dydW50ZmlsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFPQSxPQUFPLE9BQVAsR0FBaUIsVUFBVSxLQUFWLEVBQWlCO0FBQ2hDOzs7O0FBR0EsUUFBTSxJQUFOLENBQVcsUUFBWCxHQUFzQixJQUF0Qjs7QUFFQSxTQUFPLEtBQVAsR0FBZSxVQUFVLE1BQVYsRUFBa0I7QUFDL0IsV0FBTyxPQUFPLE9BQVAsQ0FBZSxzQkFBZixFQUF1QyxNQUF2QyxDQUFQO0FBQ0QsR0FGRDs7QUFJQSxNQUFJLEtBQUssUUFBUSxJQUFSLENBQVQ7QUFDQSxNQUFJLE9BQU8sUUFBUSxNQUFSLENBQVg7QUFDQSxNQUFJLGdCQUFnQixRQUFRLGdCQUFSLENBQXBCO0FBQ0EsTUFBSSx5QkFBeUIsUUFBUSx5Q0FBUixDQUE3QjtBQUNBLE1BQUksa0JBQWtCLFFBQVEsOEJBQVIsQ0FBdEI7QUFDQSxNQUFJLGtCQUFrQixTQUFsQixlQUFrQixHQUFZO0FBQ2hDLFFBQUksV0FBVyxLQUFLLElBQUwsQ0FBVSxTQUFWLEVBQXFCLHFCQUFyQixDQUFmO0FBQ0EsUUFBSSxjQUFjLEdBQUcsWUFBSCxDQUFnQixRQUFoQixFQUEwQixFQUFFLFVBQVUsTUFBWixFQUExQixDQUFsQjtBQUNBLFFBQUksU0FBUyxJQUFJLGVBQUosQ0FBb0IsV0FBcEIsQ0FBYjtBQUNBLFdBQU8sRUFBRSxVQUFVLE9BQU8sU0FBUCxFQUFaLEVBQVA7QUFDRCxHQUxEO0FBTUEsTUFBSSxtQkFBbUIsUUFBUSxtQ0FBUixDQUF2QjtBQUNBLE1BQUkseUJBQXlCLFFBQVEsa0NBQVIsQ0FBN0I7QUFDQSxNQUFJLGVBQWUsTUFBTSxJQUFOLENBQVcsUUFBWCxDQUFvQiwyQkFBcEIsRUFBaUQsRUFBRSxVQUFVLE1BQVosRUFBakQsQ0FBbkI7O0FBRUEsU0FBTyxJQUFQLENBQVksYUFBYSxLQUF6QixFQUFnQyxPQUFoQyxDQUF3QyxVQUFV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akIsRUFBa0MsU0FBbEMsRUFBNkMsVUFBN0MsQ0FBbkM7Ozs7QUFJQSxRQUFNLFlBQU4sQ0FBbUIsbUJBQW5CLEVBQXdDLENBQUMsZ0JBQUQsRUFBbUIsb0JBQW5CLENBQXhDO0FBQ0EsUUFBTSxZQUFOLENBQW1CLG9CQUFuQixFQUF5QyxZQUFZO0FBQ25ELFFBQUksT0FBTyxLQUFLLEtBQUwsRUFBWDtBQUNBLGtCQUFjLEVBQUUsS0FBSyxJQUFQLEVBQWEsU0FBUyxTQUF0QixFQUFkLEVBQWlELFVBQVUsR0FBVixFQUFlO0FBQzlELFVBQUksR0FBSixFQUFTO0FBQ1AsY0FBTSxJQUFOLENBQVcsSUFBWCxDQUFnQixHQUFoQjtBQUNEO0FBQ0QsVUFBSSxPQUFPLGdDQUFYO0FBQ0EsU0FBRyxVQUFILENBQWMscUJBQWQsRUFBcUMsSUFBckM7QUFDQSxZQUFNLEdBQU4sQ0FBVSxPQUFWLENBQWtCLFVBQVUsS0FBSyxJQUFmLEdBQXNCLFdBQXhDO0FBQ0E7QUFDRCxLQVJEO0FBU0QsR0FYRDtBQVlELENBN2dCRCIsImZpbGUiOiJHcnVudGZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEJvb3RzdHJhcCdzIEdydW50ZmlsZVxuICogaHR0cDovL2dldGJvb3RzdHJhcC5jb21cbiAqIENvcHlyaWdodCAyMDEzLTIwMTUgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChncnVudCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gRm9yY2UgdXNlIG9mIFVuaXggbmV3bGluZXNcbiAgZ3J1bnQudXRpbC5saW5lZmVlZCA9ICdcXG4nO1xuXG4gIFJlZ0V4cC5xdW90ZSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1stXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xuICB9O1xuXG4gIHZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gIHZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICB2YXIgbnBtU2hyaW5rd3JhcCA9IHJlcXVpcmUoJ25wbS1zaHJpbmt3cmFwJyk7XG4gIHZhciBnZW5lcmF0ZUdseXBoaWNvbnNEYXRhID0gcmVxdWlyZSgnLi9ncnVudC9icy1nbHlwaGljb25zLWRhdGEtZ2VuZXJhdG9yLmpzJyk7XG4gIHZhciBCc0xlc3Nkb2NQYXJzZXIgPSByZXF1aXJlKCcuL2dydW50L2JzLWxlc3Nkb2MtcGFyc2VyLmpzJyk7XG4gIHZhciBnZXRMZXNzVmFyc0RhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGZpbGVQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2xlc3MvdmFyaWFibGVzLmxlc3MnKTtcbiAgICB2YXIgZmlsZUNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcbiAgICB2YXIgcGFyc2VyID0gbmV3IEJzTGVzc2RvY1BhcnNlcihmaWxlQ29udGVudCk7XG4gICAgcmV0dXJuIHsgc2VjdGlvbnM6IHBhcnNlci5wYXJzZUZpbGUoKSB9O1xuICB9O1xuICB2YXIgZ2VuZXJhdGVSYXdGaWxlcyA9IHJlcXVpcmUoJy4vZ3J1bnQvYnMtcmF3LWZpbGVzLWdlbmVyYXRvci5qcycpO1xuICB2YXIgZ2VuZXJhdGVDb21tb25KU01vZHVsZSA9IHJlcXVpcmUoJy4vZ3J1bnQvYnMtY29tbW9uanMtZ2VuZXJhdG9yLmpzJyk7XG4gIHZhciBjb25maWdCcmlkZ2UgPSBncnVudC5maWxlLnJlYWRKU09OKCcuL2dydW50L2NvbmZpZ0JyaWRnZS5qc29uJywgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuXG4gIE9iamVjdC5rZXlzKGNvbmZpZ0JyaWRnZS5wYXRocykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgY29uZmlnQnJpZGdlLnBhdGhzW2tleV0uZm9yRWFjaChmdW5jdGlvbiAodmFsLCBpLCBhcnIpIHtcbiAgICAgIGFycltpXSA9IHBhdGguam9pbignLi9kb2NzL2Fzc2V0cycsIHZhbCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIFByb2plY3QgY29uZmlndXJhdGlvbi5cbiAgZ3J1bnQuaW5pdENvbmZpZyh7XG5cbiAgICAvLyBNZXRhZGF0YS5cbiAgICBwa2c6IGdydW50LmZpbGUucmVhZEpTT04oJ3BhY2thZ2UuanNvbicpLFxuICAgIGJhbm5lcjogJy8qIVxcbicgK1xuICAgICAgICAgICAgJyAqIEJvb3RzdHJhcCB2PCU9IHBrZy52ZXJzaW9uICU+ICg8JT0gcGtnLmhvbWVwYWdlICU+KVxcbicgK1xuICAgICAgICAgICAgJyAqIENvcHlyaWdodCAyMDExLTwlPSBncnVudC50ZW1wbGF0ZS50b2RheShcInl5eXlcIikgJT4gPCU9IHBrZy5hdXRob3IgJT5cXG4nICtcbiAgICAgICAgICAgICcgKiBMaWNlbnNlZCB1bmRlciB0aGUgPCU9IHBrZy5saWNlbnNlICU+IGxpY2Vuc2VcXG4nICtcbiAgICAgICAgICAgICcgKi9cXG4nLFxuICAgIGpxdWVyeUNoZWNrOiBjb25maWdCcmlkZ2UuY29uZmlnLmpxdWVyeUNoZWNrLmpvaW4oJ1xcbicpLFxuICAgIGpxdWVyeVZlcnNpb25DaGVjazogY29uZmlnQnJpZGdlLmNvbmZpZy5qcXVlcnlWZXJzaW9uQ2hlY2suam9pbignXFxuJyksXG5cbiAgICAvLyBUYXNrIGNvbmZpZ3VyYXRpb24uXG4gICAgY2xlYW46IHtcbiAgICAgIGRpc3Q6ICdkaXN0JyxcbiAgICAgIGRvY3M6ICdkb2NzL2Rpc3QnXG4gICAgfSxcblxuICAgIGpzaGludDoge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBqc2hpbnRyYzogJ2pzLy5qc2hpbnRyYydcbiAgICAgIH0sXG4gICAgICBncnVudDoge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAganNoaW50cmM6ICdncnVudC8uanNoaW50cmMnXG4gICAgICAgIH0sXG4gICAgICAgIHNyYzogWydHcnVudGZpbGUuanMnLCAncGFja2FnZS5qcycsICdncnVudC8qLmpzJ11cbiAgICAgIH0sXG4gICAgICBjb3JlOiB7XG4gICAgICAgIHNyYzogJ2pzLyouanMnXG4gICAgICB9LFxuICAgICAgdGVzdDoge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAganNoaW50cmM6ICdqcy90ZXN0cy91bml0Ly5qc2hpbnRyYydcbiAgICAgICAgfSxcbiAgICAgICAgc3JjOiAnanMvdGVzdHMvdW5pdC8qLmpzJ1xuICAgICAgfSxcbiAgICAgIGFzc2V0czoge1xuICAgICAgICBzcmM6IFsnZG9jcy9hc3NldHMvanMvc3JjLyouanMnLCAnZG9jcy9hc3NldHMvanMvKi5qcycsICchZG9jcy9hc3NldHMvanMvKi5taW4uanMnXVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBqc2NzOiB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGNvbmZpZzogJ2pzLy5qc2NzcmMnXG4gICAgICB9LFxuICAgICAgZ3J1bnQ6IHtcbiAgICAgICAgc3JjOiAnPCU9IGpzaGludC5ncnVudC5zcmMgJT4nXG4gICAgICB9LFxuICAgICAgY29yZToge1xuICAgICAgICBzcmM6ICc8JT0ganNoaW50LmNvcmUuc3JjICU+J1xuICAgICAgfSxcbiAgICAgIHRlc3Q6IHtcbiAgICAgICAgc3JjOiAnPCU9IGpzaGludC50ZXN0LnNyYyAlPidcbiAgICAgIH0sXG4gICAgICBhc3NldHM6IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIHJlcXVpcmVDYW1lbENhc2VPclVwcGVyQ2FzZUlkZW50aWZpZXJzOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIHNyYzogJzwlPSBqc2hpbnQuYXNzZXRzLnNyYyAlPidcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY29uY2F0OiB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGJhbm5lcjogJzwlPSBiYW5uZXIgJT5cXG48JT0ganF1ZXJ5Q2hlY2sgJT5cXG48JT0ganF1ZXJ5VmVyc2lvbkNoZWNrICU+JyxcbiAgICAgICAgc3RyaXBCYW5uZXJzOiBmYWxzZVxuICAgICAgfSxcbiAgICAgIGJvb3RzdHJhcDoge1xuICAgICAgICBzcmM6IFtcbiAgICAgICAgICAnanMvdHJhbnNpdGlvbi5qcycsXG4gICAgICAgICAgJ2pzL2FsZXJ0LmpzJyxcbiAgICAgICAgICAnanMvYnV0dG9uLmpzJyxcbiAgICAgICAgICAnanMvY2Fyb3VzZWwuanMnLFxuICAgICAgICAgICdqcy9jb2xsYXBzZS5qcycsXG4gICAgICAgICAgJ2pzL2Ryb3Bkb3duLmpzJyxcbiAgICAgICAgICAnanMvbW9kYWwuanMnLFxuICAgICAgICAgICdqcy90b29sdGlwLmpzJyxcbiAgICAgICAgICAnanMvcG9wb3Zlci5qcycsXG4gICAgICAgICAgJ2pzL3Njcm9sbHNweS5qcycsXG4gICAgICAgICAgJ2pzL3RhYi5qcycsXG4gICAgICAgICAgJ2pzL2FmZml4LmpzJ1xuICAgICAgICBdLFxuICAgICAgICBkZXN0OiAnZGlzdC9qcy88JT0gcGtnLm5hbWUgJT4uanMnXG4gICAgICB9XG4gICAgfSxcblxuICAgIHVnbGlmeToge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBjb21wcmVzczoge1xuICAgICAgICAgIHdhcm5pbmdzOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBtYW5nbGU6IHRydWUsXG4gICAgICAgIHByZXNlcnZlQ29tbWVudHM6ICdzb21lJ1xuICAgICAgfSxcbiAgICAgIGNvcmU6IHtcbiAgICAgICAgc3JjOiAnPCU9IGNvbmNhdC5ib290c3RyYXAuZGVzdCAlPicsXG4gICAgICAgIGRlc3Q6ICdkaXN0L2pzLzwlPSBwa2cubmFtZSAlPi5taW4uanMnXG4gICAgICB9LFxuICAgICAgY3VzdG9taXplOiB7XG4gICAgICAgIHNyYzogY29uZmlnQnJpZGdlLnBhdGhzLmN1c3RvbWl6ZXJKcyxcbiAgICAgICAgZGVzdDogJ2RvY3MvYXNzZXRzL2pzL2N1c3RvbWl6ZS5taW4uanMnXG4gICAgICB9LFxuICAgICAgZG9jc0pzOiB7XG4gICAgICAgIHNyYzogY29uZmlnQnJpZGdlLnBhdGhzLmRvY3NKcyxcbiAgICAgICAgZGVzdDogJ2RvY3MvYXNzZXRzL2pzL2RvY3MubWluLmpzJ1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBxdW5pdDoge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBpbmplY3Q6ICdqcy90ZXN0cy91bml0L3BoYW50b20uanMnXG4gICAgICB9LFxuICAgICAgZmlsZXM6ICdqcy90ZXN0cy9pbmRleC5odG1sJ1xuICAgIH0sXG5cbiAgICBsZXNzOiB7XG4gICAgICBjb21waWxlQ29yZToge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgc3RyaWN0TWF0aDogdHJ1ZSxcbiAgICAgICAgICBzb3VyY2VNYXA6IHRydWUsXG4gICAgICAgICAgb3V0cHV0U291cmNlRmlsZXM6IHRydWUsXG4gICAgICAgICAgc291cmNlTWFwVVJMOiAnPCU9IHBrZy5uYW1lICU+LmNzcy5tYXAnLFxuICAgICAgICAgIHNvdXJjZU1hcEZpbGVuYW1lOiAnZGlzdC9jc3MvPCU9IHBrZy5uYW1lICU+LmNzcy5tYXAnXG4gICAgICAgIH0sXG4gICAgICAgIHNyYzogJ2xlc3MvYm9vdHN0cmFwLmxlc3MnLFxuICAgICAgICBkZXN0OiAnZGlzdC9jc3MvPCU9IHBrZy5uYW1lICU+LmNzcydcbiAgICAgIH0sXG4gICAgICBjb21waWxlVGhlbWU6IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIHN0cmljdE1hdGg6IHRydWUsXG4gICAgICAgICAgc291cmNlTWFwOiB0cnVlLFxuICAgICAgICAgIG91dHB1dFNvdXJjZUZpbGVzOiB0cnVlLFxuICAgICAgICAgIHNvdXJjZU1hcFVSTDogJzwlPSBwa2cubmFtZSAlPi10aGVtZS5jc3MubWFwJyxcbiAgICAgICAgICBzb3VyY2VNYXBGaWxlbmFtZTogJ2Rpc3QvY3NzLzwlPSBwa2cubmFtZSAlPi10aGVtZS5jc3MubWFwJ1xuICAgICAgICB9LFxuICAgICAgICBzcmM6ICdsZXNzL3RoZW1lLmxlc3MnLFxuICAgICAgICBkZXN0OiAnZGlzdC9jc3MvPCU9IHBrZy5uYW1lICU+LXRoZW1lLmNzcydcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYXV0b3ByZWZpeGVyOiB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGJyb3dzZXJzOiBjb25maWdCcmlkZ2UuY29uZmlnLmF1dG9wcmVmaXhlckJyb3dzZXJzXG4gICAgICB9LFxuICAgICAgY29yZToge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgbWFwOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHNyYzogJ2Rpc3QvY3NzLzwlPSBwa2cubmFtZSAlPi5jc3MnXG4gICAgICB9LFxuICAgICAgdGhlbWU6IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIG1hcDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBzcmM6ICdkaXN0L2Nzcy88JT0gcGtnLm5hbWUgJT4tdGhlbWUuY3NzJ1xuICAgICAgfSxcbiAgICAgIGRvY3M6IHtcbiAgICAgICAgc3JjOiBbJ2RvY3MvYXNzZXRzL2Nzcy9zcmMvZG9jcy5jc3MnXVxuICAgICAgfSxcbiAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgIGV4cGFuZDogdHJ1ZSxcbiAgICAgICAgY3dkOiAnZG9jcy9leGFtcGxlcy8nLFxuICAgICAgICBzcmM6IFsnKiovKi5jc3MnXSxcbiAgICAgICAgZGVzdDogJ2RvY3MvZXhhbXBsZXMvJ1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjc3NsaW50OiB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGNzc2xpbnRyYzogJ2xlc3MvLmNzc2xpbnRyYydcbiAgICAgIH0sXG4gICAgICBkaXN0OiBbXG4gICAgICAgICdkaXN0L2Nzcy9ib290c3RyYXAuY3NzJyxcbiAgICAgICAgJ2Rpc3QvY3NzL2Jvb3RzdHJhcC10aGVtZS5jc3MnXG4gICAgICBdLFxuICAgICAgZXhhbXBsZXM6IFtcbiAgICAgICAgJ2RvY3MvZXhhbXBsZXMvKiovKi5jc3MnXG4gICAgICBdLFxuICAgICAgZG9jczoge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgaWRzOiBmYWxzZSxcbiAgICAgICAgICAnb3ZlcnF1YWxpZmllZC1lbGVtZW50cyc6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHNyYzogJ2RvY3MvYXNzZXRzL2Nzcy9zcmMvZG9jcy5jc3MnXG4gICAgICB9XG4gICAgfSxcblxuICAgIGNzc21pbjoge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICAvLyBUT0RPOiBkaXNhYmxlIGB6ZXJvVW5pdHNgIG9wdGltaXphdGlvbiBvbmNlIGNsZWFuLWNzcyAzLjIgaXMgcmVsZWFzZWRcbiAgICAgICAgLy8gICAgYW5kIHRoZW4gc2ltcGxpZnkgdGhlIGZpeCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2lzc3Vlcy8xNDgzNyBhY2NvcmRpbmdseVxuICAgICAgICBjb21wYXRpYmlsaXR5OiAnaWU4JyxcbiAgICAgICAga2VlcFNwZWNpYWxDb21tZW50czogJyonLFxuICAgICAgICBzb3VyY2VNYXA6IHRydWUsXG4gICAgICAgIGFkdmFuY2VkOiBmYWxzZVxuICAgICAgfSxcbiAgICAgIG1pbmlmeUNvcmU6IHtcbiAgICAgICAgc3JjOiAnZGlzdC9jc3MvPCU9IHBrZy5uYW1lICU+LmNzcycsXG4gICAgICAgIGRlc3Q6ICdkaXN0L2Nzcy88JT0gcGtnLm5hbWUgJT4ubWluLmNzcydcbiAgICAgIH0sXG4gICAgICBtaW5pZnlUaGVtZToge1xuICAgICAgICBzcmM6ICdkaXN0L2Nzcy88JT0gcGtnLm5hbWUgJT4tdGhlbWUuY3NzJyxcbiAgICAgICAgZGVzdDogJ2Rpc3QvY3NzLzwlPSBwa2cubmFtZSAlPi10aGVtZS5taW4uY3NzJ1xuICAgICAgfSxcbiAgICAgIGRvY3M6IHtcbiAgICAgICAgc3JjOiBbXG4gICAgICAgICAgJ2RvY3MvYXNzZXRzL2Nzcy9pZTEwLXZpZXdwb3J0LWJ1Zy13b3JrYXJvdW5kLmNzcycsXG4gICAgICAgICAgJ2RvY3MvYXNzZXRzL2Nzcy9zcmMvcHlnbWVudHMtbWFubmkuY3NzJyxcbiAgICAgICAgICAnZG9jcy9hc3NldHMvY3NzL3NyYy9kb2NzLmNzcydcbiAgICAgICAgXSxcbiAgICAgICAgZGVzdDogJ2RvY3MvYXNzZXRzL2Nzcy9kb2NzLm1pbi5jc3MnXG4gICAgICB9XG4gICAgfSxcblxuICAgIGNzc2NvbWI6IHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgY29uZmlnOiAnbGVzcy8uY3NzY29tYi5qc29uJ1xuICAgICAgfSxcbiAgICAgIGRpc3Q6IHtcbiAgICAgICAgZXhwYW5kOiB0cnVlLFxuICAgICAgICBjd2Q6ICdkaXN0L2Nzcy8nLFxuICAgICAgICBzcmM6IFsnKi5jc3MnLCAnISoubWluLmNzcyddLFxuICAgICAgICBkZXN0OiAnZGlzdC9jc3MvJ1xuICAgICAgfSxcbiAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgIGV4cGFuZDogdHJ1ZSxcbiAgICAgICAgY3dkOiAnZG9jcy9leGFtcGxlcy8nLFxuICAgICAgICBzcmM6ICcqKi8qLmNzcycsXG4gICAgICAgIGRlc3Q6ICdkb2NzL2V4YW1wbGVzLydcbiAgICAgIH0sXG4gICAgICBkb2NzOiB7XG4gICAgICAgIHNyYzogJ2RvY3MvYXNzZXRzL2Nzcy9zcmMvZG9jcy5jc3MnLFxuICAgICAgICBkZXN0OiAnZG9jcy9hc3NldHMvY3NzL3NyYy9kb2NzLmNzcydcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY29weToge1xuICAgICAgZm9udHM6IHtcbiAgICAgICAgZXhwYW5kOiB0cnVlLFxuICAgICAgICBzcmM6ICdmb250cy8qJyxcbiAgICAgICAgZGVzdDogJ2Rpc3QvJ1xuICAgICAgfSxcbiAgICAgIGRvY3M6IHtcbiAgICAgICAgZXhwYW5kOiB0cnVlLFxuICAgICAgICBjd2Q6ICdkaXN0LycsXG4gICAgICAgIHNyYzogW1xuICAgICAgICAgICcqKi8qJ1xuICAgICAgICBdLFxuICAgICAgICBkZXN0OiAnZG9jcy9kaXN0LydcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY29ubmVjdDoge1xuICAgICAgc2VydmVyOiB7XG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICBwb3J0OiAzMDAwLFxuICAgICAgICAgIGJhc2U6ICcuJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGpla3lsbDoge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBjb25maWc6ICdfY29uZmlnLnltbCdcbiAgICAgIH0sXG4gICAgICBkb2NzOiB7fSxcbiAgICAgIGdpdGh1Yjoge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgcmF3OiAnZ2l0aHViOiB0cnVlJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGh0bWxtaW46IHtcbiAgICAgIGRpc3Q6IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIGNvbGxhcHNlV2hpdGVzcGFjZTogdHJ1ZSxcbiAgICAgICAgICBjb25zZXJ2YXRpdmVDb2xsYXBzZTogdHJ1ZSxcbiAgICAgICAgICBtaW5pZnlDU1M6IHRydWUsXG4gICAgICAgICAgbWluaWZ5SlM6IHRydWUsXG4gICAgICAgICAgcmVtb3ZlQXR0cmlidXRlUXVvdGVzOiB0cnVlLFxuICAgICAgICAgIHJlbW92ZUNvbW1lbnRzOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIGV4cGFuZDogdHJ1ZSxcbiAgICAgICAgY3dkOiAnX2doX3BhZ2VzJyxcbiAgICAgICAgZGVzdDogJ19naF9wYWdlcycsXG4gICAgICAgIHNyYzogW1xuICAgICAgICAgICcqKi8qLmh0bWwnLFxuICAgICAgICAgICchZXhhbXBsZXMvKiovKi5odG1sJ1xuICAgICAgICBdXG4gICAgICB9XG4gICAgfSxcblxuICAgIGphZGU6IHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgcHJldHR5OiB0cnVlLFxuICAgICAgICBkYXRhOiBnZXRMZXNzVmFyc0RhdGFcbiAgICAgIH0sXG4gICAgICBjdXN0b21pemVyVmFyczoge1xuICAgICAgICBzcmM6ICdkb2NzL19qYWRlL2N1c3RvbWl6ZXItdmFyaWFibGVzLmphZGUnLFxuICAgICAgICBkZXN0OiAnZG9jcy9faW5jbHVkZXMvY3VzdG9taXplci12YXJpYWJsZXMuaHRtbCdcbiAgICAgIH0sXG4gICAgICBjdXN0b21pemVyTmF2OiB7XG4gICAgICAgIHNyYzogJ2RvY3MvX2phZGUvY3VzdG9taXplci1uYXYuamFkZScsXG4gICAgICAgIGRlc3Q6ICdkb2NzL19pbmNsdWRlcy9uYXYvY3VzdG9taXplLmh0bWwnXG4gICAgICB9XG4gICAgfSxcblxuICAgIGh0bWxsaW50OiB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGlnbm9yZTogW1xuICAgICAgICAgICdBdHRyaWJ1dGUgXCJhdXRvY29tcGxldGVcIiBub3QgYWxsb3dlZCBvbiBlbGVtZW50IFwiYnV0dG9uXCIgYXQgdGhpcyBwb2ludC4nLFxuICAgICAgICAgICdBdHRyaWJ1dGUgXCJhdXRvY29tcGxldGVcIiBpcyBvbmx5IGFsbG93ZWQgd2hlbiB0aGUgaW5wdXQgdHlwZSBpcyBcImNvbG9yXCIsIFwiZGF0ZVwiLCBcImRhdGV0aW1lXCIsIFwiZGF0ZXRpbWUtbG9jYWxcIiwgXCJlbWFpbFwiLCBcIm1vbnRoXCIsIFwibnVtYmVyXCIsIFwicGFzc3dvcmRcIiwgXCJyYW5nZVwiLCBcInNlYXJjaFwiLCBcInRlbFwiLCBcInRleHRcIiwgXCJ0aW1lXCIsIFwidXJsXCIsIG9yIFwid2Vla1wiLicsXG4gICAgICAgICAgJ0VsZW1lbnQgXCJpbWdcIiBpcyBtaXNzaW5nIHJlcXVpcmVkIGF0dHJpYnV0ZSBcInNyY1wiLidcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHNyYzogJ19naF9wYWdlcy8qKi8qLmh0bWwnXG4gICAgfSxcblxuICAgIHdhdGNoOiB7XG4gICAgICBzcmM6IHtcbiAgICAgICAgZmlsZXM6ICc8JT0ganNoaW50LmNvcmUuc3JjICU+JyxcbiAgICAgICAgdGFza3M6IFsnanNoaW50OmNvcmUnLCAncXVuaXQnLCAnY29uY2F0J11cbiAgICAgIH0sXG4gICAgICB0ZXN0OiB7XG4gICAgICAgIGZpbGVzOiAnPCU9IGpzaGludC50ZXN0LnNyYyAlPicsXG4gICAgICAgIHRhc2tzOiBbJ2pzaGludDp0ZXN0JywgJ3F1bml0J11cbiAgICAgIH0sXG4gICAgICBsZXNzOiB7XG4gICAgICAgIGZpbGVzOiAnbGVzcy8qKi8qLmxlc3MnLFxuICAgICAgICB0YXNrczogJ2xlc3MnXG4gICAgICB9XG4gICAgfSxcblxuICAgIHNlZDoge1xuICAgICAgdmVyc2lvbk51bWJlcjoge1xuICAgICAgICBwYXR0ZXJuOiAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBvbGQgPSBncnVudC5vcHRpb24oJ29sZHZlcicpO1xuICAgICAgICAgIHJldHVybiBvbGQgPyBSZWdFeHAucXVvdGUob2xkKSA6IG9sZDtcbiAgICAgICAgfSkoKSxcbiAgICAgICAgcmVwbGFjZW1lbnQ6IGdydW50Lm9wdGlvbignbmV3dmVyJyksXG4gICAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgICAnZGlzdC9mb250cycsXG4gICAgICAgICAgJ2RvY3MvYXNzZXRzJyxcbiAgICAgICAgICAnZm9udHMnLFxuICAgICAgICAgICdqcy90ZXN0cy92ZW5kb3InLFxuICAgICAgICAgICdub2RlX21vZHVsZXMnLFxuICAgICAgICAgICd0ZXN0LWluZnJhJ1xuICAgICAgICBdLFxuICAgICAgICByZWN1cnNpdmU6IHRydWVcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJ3NhdWNlbGFicy1xdW5pdCc6IHtcbiAgICAgIGFsbDoge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgYnVpbGQ6IHByb2Nlc3MuZW52LlRSQVZJU19KT0JfSUQsXG4gICAgICAgICAgdGhyb3R0bGVkOiAxMCxcbiAgICAgICAgICBtYXhSZXRyaWVzOiAzLFxuICAgICAgICAgIG1heFBvbGxSZXRyaWVzOiA0LFxuICAgICAgICAgIHVybHM6IFsnaHR0cDovLzEyNy4wLjAuMTozMDAwL2pzL3Rlc3RzL2luZGV4Lmh0bWw/aGlkZXBhc3NlZCddLFxuICAgICAgICAgIGJyb3dzZXJzOiBncnVudC5maWxlLnJlYWRZQU1MKCdncnVudC9zYXVjZV9icm93c2Vycy55bWwnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGV4ZWM6IHtcbiAgICAgIG5wbVVwZGF0ZToge1xuICAgICAgICBjb21tYW5kOiAnbnBtIHVwZGF0ZSdcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY29tcHJlc3M6IHtcbiAgICAgIG1haW46IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIGFyY2hpdmU6ICdib290c3RyYXAtPCU9IHBrZy52ZXJzaW9uICU+LWRpc3QuemlwJyxcbiAgICAgICAgICBtb2RlOiAnemlwJyxcbiAgICAgICAgICBsZXZlbDogOSxcbiAgICAgICAgICBwcmV0dHk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgZmlsZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBleHBhbmQ6IHRydWUsXG4gICAgICAgICAgICBjd2Q6ICdkaXN0LycsXG4gICAgICAgICAgICBzcmM6IFsnKionXSxcbiAgICAgICAgICAgIGRlc3Q6ICdib290c3RyYXAtPCU9IHBrZy52ZXJzaW9uICU+LWRpc3QnXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfVxuXG4gIH0pO1xuXG5cbiAgLy8gVGhlc2UgcGx1Z2lucyBwcm92aWRlIG5lY2Vzc2FyeSB0YXNrcy5cbiAgcmVxdWlyZSgnbG9hZC1ncnVudC10YXNrcycpKGdydW50LCB7IHNjb3BlOiAnZGV2RGVwZW5kZW5jaWVzJyB9KTtcbiAgcmVxdWlyZSgndGltZS1ncnVudCcpKGdydW50KTtcblxuICAvLyBEb2NzIEhUTUwgdmFsaWRhdGlvbiB0YXNrXG4gIGdydW50LnJlZ2lzdGVyVGFzaygndmFsaWRhdGUtaHRtbCcsIFsnamVreWxsOmRvY3MnLCAnaHRtbGxpbnQnXSk7XG5cbiAgdmFyIHJ1blN1YnNldCA9IGZ1bmN0aW9uIChzdWJzZXQpIHtcbiAgICByZXR1cm4gIXByb2Nlc3MuZW52LlRXQlNfVEVTVCB8fCBwcm9jZXNzLmVudi5UV0JTX1RFU1QgPT09IHN1YnNldDtcbiAgfTtcbiAgdmFyIGlzVW5kZWZPck5vblplcm8gPSBmdW5jdGlvbiAodmFsKSB7XG4gICAgcmV0dXJuIHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCAhPT0gJzAnO1xuICB9O1xuXG4gIC8vIFRlc3QgdGFzay5cbiAgdmFyIHRlc3RTdWJ0YXNrcyA9IFtdO1xuICAvLyBTa2lwIGNvcmUgdGVzdHMgaWYgcnVubmluZyBhIGRpZmZlcmVudCBzdWJzZXQgb2YgdGhlIHRlc3Qgc3VpdGVcbiAgaWYgKHJ1blN1YnNldCgnY29yZScpICYmXG4gICAgICAvLyBTa2lwIGNvcmUgdGVzdHMgaWYgdGhpcyBpcyBhIFNhdmFnZSBidWlsZFxuICAgICAgcHJvY2Vzcy5lbnYuVFJBVklTX1JFUE9fU0xVRyAhPT0gJ3R3YnMtc2F2YWdlL2Jvb3RzdHJhcCcpIHtcbiAgICB0ZXN0U3VidGFza3MgPSB0ZXN0U3VidGFza3MuY29uY2F0KFsnZGlzdC1jc3MnLCAnZGlzdC1qcycsICdjc3NsaW50OmRpc3QnLCAndGVzdC1qcycsICdkb2NzJ10pO1xuICB9XG4gIC8vIFNraXAgSFRNTCB2YWxpZGF0aW9uIGlmIHJ1bm5pbmcgYSBkaWZmZXJlbnQgc3Vic2V0IG9mIHRoZSB0ZXN0IHN1aXRlXG4gIGlmIChydW5TdWJzZXQoJ3ZhbGlkYXRlLWh0bWwnKSAmJlxuICAgICAgLy8gU2tpcCBIVE1MNSB2YWxpZGF0b3Igb24gVHJhdmlzIHdoZW4gW3NraXAgdmFsaWRhdG9yXSBpcyBpbiB0aGUgY29tbWl0IG1lc3NhZ2VcbiAgICAgIGlzVW5kZWZPck5vblplcm8ocHJvY2Vzcy5lbnYuVFdCU19ET19WQUxJREFUT1IpKSB7XG4gICAgdGVzdFN1YnRhc2tzLnB1c2goJ3ZhbGlkYXRlLWh0bWwnKTtcbiAgfVxuICAvLyBPbmx5IHJ1biBTYXVjZSBMYWJzIHRlc3RzIGlmIHRoZXJlJ3MgYSBTYXVjZSBhY2Nlc3Mga2V5XG4gIGlmICh0eXBlb2YgcHJvY2Vzcy5lbnYuU0FVQ0VfQUNDRVNTX0tFWSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIC8vIFNraXAgU2F1Y2UgaWYgcnVubmluZyBhIGRpZmZlcmVudCBzdWJzZXQgb2YgdGhlIHRlc3Qgc3VpdGVcbiAgICAgIHJ1blN1YnNldCgnc2F1Y2UtanMtdW5pdCcpICYmXG4gICAgICAvLyBTa2lwIFNhdWNlIG9uIFRyYXZpcyB3aGVuIFtza2lwIHNhdWNlXSBpcyBpbiB0aGUgY29tbWl0IG1lc3NhZ2VcbiAgICAgIGlzVW5kZWZPck5vblplcm8ocHJvY2Vzcy5lbnYuVFdCU19ET19TQVVDRSkpIHtcbiAgICB0ZXN0U3VidGFza3MucHVzaCgnY29ubmVjdCcpO1xuICAgIHRlc3RTdWJ0YXNrcy5wdXNoKCdzYXVjZWxhYnMtcXVuaXQnKTtcbiAgfVxuICBncnVudC5yZWdpc3RlclRhc2soJ3Rlc3QnLCB0ZXN0U3VidGFza3MpO1xuICBncnVudC5yZWdpc3RlclRhc2soJ3Rlc3QtanMnLCBbJ2pzaGludDpjb3JlJywgJ2pzaGludDp0ZXN0JywgJ2pzaGludDpncnVudCcsICdqc2NzOmNvcmUnLCAnanNjczp0ZXN0JywgJ2pzY3M6Z3J1bnQnLCAncXVuaXQnXSk7XG5cbiAgLy8gSlMgZGlzdHJpYnV0aW9uIHRhc2suXG4gIGdydW50LnJlZ2lzdGVyVGFzaygnZGlzdC1qcycsIFsnY29uY2F0JywgJ3VnbGlmeTpjb3JlJywgJ2NvbW1vbmpzJ10pO1xuXG4gIC8vIENTUyBkaXN0cmlidXRpb24gdGFzay5cbiAgZ3J1bnQucmVnaXN0ZXJUYXNrKCdsZXNzLWNvbXBpbGUnLCBbJ2xlc3M6Y29tcGlsZUNvcmUnLCAnbGVzczpjb21waWxlVGhlbWUnXSk7XG4gIGdydW50LnJlZ2lzdGVyVGFzaygnZGlzdC1jc3MnLCBbJ2xlc3MtY29tcGlsZScsICdhdXRvcHJlZml4ZXI6Y29yZScsICdhdXRvcHJlZml4ZXI6dGhlbWUnLCAnY3NzY29tYjpkaXN0JywgJ2Nzc21pbjptaW5pZnlDb3JlJywgJ2Nzc21pbjptaW5pZnlUaGVtZSddKTtcblxuICAvLyBGdWxsIGRpc3RyaWJ1dGlvbiB0YXNrLlxuICBncnVudC5yZWdpc3RlclRhc2soJ2Rpc3QnLCBbJ2NsZWFuOmRpc3QnLCAnZGlzdC1jc3MnLCAnY29weTpmb250cycsICdkaXN0LWpzJ10pO1xuXG4gIC8vIERlZmF1bHQgdGFzay5cbiAgZ3J1bnQucmVnaXN0ZXJUYXNrKCdkZWZhdWx0JywgWydjbGVhbjpkaXN0JywgJ2NvcHk6Zm9udHMnLCAndGVzdCddKTtcblxuICAvLyBWZXJzaW9uIG51bWJlcmluZyB0YXNrLlxuICAvLyBncnVudCBjaGFuZ2UtdmVyc2lvbi1udW1iZXIgLS1vbGR2ZXI9QS5CLkMgLS1uZXd2ZXI9WC5ZLlpcbiAgLy8gVGhpcyBjYW4gYmUgb3ZlcnplYWxvdXMsIHNvIGl0cyBjaGFuZ2VzIHNob3VsZCBhbHdheXMgYmUgbWFudWFsbHkgcmV2aWV3ZWQhXG4gIGdydW50LnJlZ2lzdGVyVGFzaygnY2hhbmdlLXZlcnNpb24tbnVtYmVyJywgJ3NlZCcpO1xuXG4gIGdydW50LnJlZ2lzdGVyVGFzaygnYnVpbGQtZ2x5cGhpY29ucy1kYXRhJywgZnVuY3Rpb24gKCkgeyBnZW5lcmF0ZUdseXBoaWNvbnNEYXRhLmNhbGwodGhpcywgZ3J1bnQpOyB9KTtcblxuICAvLyB0YXNrIGZvciBidWlsZGluZyBjdXN0b21pemVyXG4gIGdydW50LnJlZ2lzdGVyVGFzaygnYnVpbGQtY3VzdG9taXplcicsIFsnYnVpbGQtY3VzdG9taXplci1odG1sJywgJ2J1aWxkLXJhdy1maWxlcyddKTtcbiAgZ3J1bnQucmVnaXN0ZXJUYXNrKCdidWlsZC1jdXN0b21pemVyLWh0bWwnLCAnamFkZScpO1xuICBncnVudC5yZWdpc3RlclRhc2soJ2J1aWxkLXJhdy1maWxlcycsICdBZGQgc2NyaXB0cy9sZXNzIGZpbGVzIHRvIGN1c3RvbWl6ZXIuJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBiYW5uZXIgPSBncnVudC50ZW1wbGF0ZS5wcm9jZXNzKCc8JT0gYmFubmVyICU+Jyk7XG4gICAgZ2VuZXJhdGVSYXdGaWxlcyhncnVudCwgYmFubmVyKTtcbiAgfSk7XG5cbiAgZ3J1bnQucmVnaXN0ZXJUYXNrKCdjb21tb25qcycsICdHZW5lcmF0ZSBDb21tb25KUyBlbnRyeXBvaW50IG1vZHVsZSBpbiBkaXN0IGRpci4nLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNyY0ZpbGVzID0gZ3J1bnQuY29uZmlnLmdldCgnY29uY2F0LmJvb3RzdHJhcC5zcmMnKTtcbiAgICB2YXIgZGVzdEZpbGVwYXRoID0gJ2Rpc3QvanMvbnBtLmpzJztcbiAgICBnZW5lcmF0ZUNvbW1vbkpTTW9kdWxlKGdydW50LCBzcmNGaWxlcywgZGVzdEZpbGVwYXRoKTtcbiAgfSk7XG5cbiAgLy8gRG9jcyB0YXNrLlxuICBncnVudC5yZWdpc3RlclRhc2soJ2RvY3MtY3NzJywgWydhdXRvcHJlZml4ZXI6ZG9jcycsICdhdXRvcHJlZml4ZXI6ZXhhbXBsZXMnLCAnY3NzY29tYjpkb2NzJywgJ2Nzc2NvbWI6ZXhhbXBsZXMnLCAnY3NzbWluOmRvY3MnXSk7XG4gIGdydW50LnJlZ2lzdGVyVGFzaygnbGludC1kb2NzLWNzcycsIFsnY3NzbGludDpkb2NzJywgJ2Nzc2xpbnQ6ZXhhbXBsZXMnXSk7XG4gIGdydW50LnJlZ2lzdGVyVGFzaygnZG9jcy1qcycsIFsndWdsaWZ5OmRvY3NKcycsICd1Z2xpZnk6Y3VzdG9taXplJ10pO1xuICBncnVudC5yZWdpc3RlclRhc2soJ2xpbnQtZG9jcy1qcycsIFsnanNoaW50OmFzc2V0cycsICdqc2NzOmFzc2V0cyddKTtcbiAgZ3J1bnQucmVnaXN0ZXJUYXNrKCdkb2NzJywgWydkb2NzLWNzcycsICdsaW50LWRvY3MtY3NzJywgJ2RvY3MtanMnLCAnbGludC1kb2NzLWpzJywgJ2NsZWFuOmRvY3MnLCAnY29weTpkb2NzJywgJ2J1aWxkLWdseXBoaWNvbnMtZGF0YScsICdidWlsZC1jdXN0b21pemVyJ10pO1xuXG4gIGdydW50LnJlZ2lzdGVyVGFzaygncHJlcC1yZWxlYXNlJywgWydkaXN0JywgJ2RvY3MnLCAnamVreWxsOmdpdGh1YicsICdodG1sbWluJywgJ2NvbXByZXNzJ10pO1xuXG4gIC8vIFRhc2sgZm9yIHVwZGF0aW5nIHRoZSBjYWNoZWQgbnBtIHBhY2thZ2VzIHVzZWQgYnkgdGhlIFRyYXZpcyBidWlsZCAod2hpY2ggYXJlIGNvbnRyb2xsZWQgYnkgdGVzdC1pbmZyYS9ucG0tc2hyaW5rd3JhcC5qc29uKS5cbiAgLy8gVGhpcyB0YXNrIHNob3VsZCBiZSBydW4gYW5kIHRoZSB1cGRhdGVkIGZpbGUgc2hvdWxkIGJlIGNvbW1pdHRlZCB3aGVuZXZlciBCb290c3RyYXAncyBkZXBlbmRlbmNpZXMgY2hhbmdlLlxuICBncnVudC5yZWdpc3RlclRhc2soJ3VwZGF0ZS1zaHJpbmt3cmFwJywgWydleGVjOm5wbVVwZGF0ZScsICdfdXBkYXRlLXNocmlua3dyYXAnXSk7XG4gIGdydW50LnJlZ2lzdGVyVGFzaygnX3VwZGF0ZS1zaHJpbmt3cmFwJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBkb25lID0gdGhpcy5hc3luYygpO1xuICAgIG5wbVNocmlua3dyYXAoeyBkZXY6IHRydWUsIGRpcm5hbWU6IF9fZGlybmFtZSB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGdydW50LmZhaWwud2FybihlcnIpO1xuICAgICAgfVxuICAgICAgdmFyIGRlc3QgPSAndGVzdC1pbmZyYS9ucG0tc2hyaW5rd3JhcC5qc29uJztcbiAgICAgIGZzLnJlbmFtZVN5bmMoJ25wbS1zaHJpbmt3cmFwLmpzb24nLCBkZXN0KTtcbiAgICAgIGdydW50LmxvZy53cml0ZWxuKCdGaWxlICcgKyBkZXN0LmN5YW4gKyAnIHVwZGF0ZWQuJyk7XG4gICAgICBkb25lKCk7XG4gICAgfSk7XG4gIH0pO1xufTtcbiJdfQ==