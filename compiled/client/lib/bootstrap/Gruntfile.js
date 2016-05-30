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
  var glob = require('glob');
  var isTravis = require('is-travis');
  var npmShrinkwrap = require('npm-shrinkwrap');
  var mq4HoverShim = require('mq4-hover-shim');
  var autoprefixer = require('autoprefixer')({
    browsers: [
    //
    // Official browser support policy:
    // http://v4-alpha.getbootstrap.com/getting-started/browsers-devices/#supported-browsers
    //
    'Chrome >= 35', // Exact version number here is kinda arbitrary
    // Rather than using Autoprefixer's native "Firefox ESR" version specifier string,
    // we deliberately hardcode the number. This is to avoid unwittingly severely breaking the previous ESR in the event that:
    // (a) we happen to ship a new Bootstrap release soon after the release of a new ESR,
    //     such that folks haven't yet had a reasonable amount of time to upgrade; and
    // (b) the new ESR has unprefixed CSS properties/values whose absence would severely break webpages
    //     (e.g. `box-sizing`, as opposed to `background: linear-gradient(...)`).
    //     Since they've been unprefixed, Autoprefixer will stop prefixing them,
    //     thus causing them to not work in the previous ESR (where the prefixes were required).
    'Firefox >= 31', // Current Firefox Extended Support Release (ESR)
    // Note: Edge versions in Autoprefixer & Can I Use refer to the EdgeHTML rendering engine version,
    // NOT the Edge app version shown in Edge's "About" screen.
    // For example, at the time of writing, Edge 20 on an up-to-date system uses EdgeHTML 12.
    // See also https://github.com/Fyrd/caniuse/issues/1928
    'Edge >= 12', 'Explorer >= 9',
    // Out of leniency, we prefix these 1 version further back than the official policy.
    'iOS >= 8', 'Safari >= 8',
    // The following remain NOT officially supported, but we're lenient and include their prefixes to avoid severely breaking in them.
    'Android 2.3', 'Android >= 4', 'Opera >= 12']
  });

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
    banner: '/*!\n' + ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' + ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' + ' * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n' + ' */\n',
    jqueryCheck: 'if (typeof jQuery === \'undefined\') {\n' + '  throw new Error(\'Bootstrap\\\'s JavaScript requires jQuery\')\n' + '}\n',
    jqueryVersionCheck: '+function ($) {\n' + '  var version = $.fn.jquery.split(\' \')[0].split(\'.\')\n' + '  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] >= 3)) {\n' + '    throw new Error(\'Bootstrap\\\'s JavaScript requires at least jQuery v1.9.1 but less than v3.0.0\')\n' + '  }\n' + '}(jQuery);\n\n',

    // Task configuration.
    clean: {
      dist: 'dist',
      docs: 'docs/dist'
    },

    // JS build configuration
    lineremover: {
      es6Import: {
        files: {
          '<%= concat.bootstrap.dest %>': '<%= concat.bootstrap.dest %>'
        },
        options: {
          exclusionPattern: /^(import|export)/g
        }
      }
    },

    babel: {
      dev: {
        options: {
          sourceMap: true,
          modules: 'ignore'
        },
        files: {
          'js/dist/util.js': 'js/src/util.js',
          'js/dist/alert.js': 'js/src/alert.js',
          'js/dist/button.js': 'js/src/button.js',
          'js/dist/carousel.js': 'js/src/carousel.js',
          'js/dist/collapse.js': 'js/src/collapse.js',
          'js/dist/dropdown.js': 'js/src/dropdown.js',
          'js/dist/modal.js': 'js/src/modal.js',
          'js/dist/scrollspy.js': 'js/src/scrollspy.js',
          'js/dist/tab.js': 'js/src/tab.js',
          'js/dist/tooltip.js': 'js/src/tooltip.js',
          'js/dist/popover.js': 'js/src/popover.js'
        }
      },
      dist: {
        options: {
          modules: 'ignore'
        },
        files: {
          '<%= concat.bootstrap.dest %>': '<%= concat.bootstrap.dest %>'
        }
      },
      umd: {
        options: {
          modules: 'umd'
        },
        files: {
          'dist/js/umd/util.js': 'js/src/util.js',
          'dist/js/umd/alert.js': 'js/src/alert.js',
          'dist/js/umd/button.js': 'js/src/button.js',
          'dist/js/umd/carousel.js': 'js/src/carousel.js',
          'dist/js/umd/collapse.js': 'js/src/collapse.js',
          'dist/js/umd/dropdown.js': 'js/src/dropdown.js',
          'dist/js/umd/modal.js': 'js/src/modal.js',
          'dist/js/umd/scrollspy.js': 'js/src/scrollspy.js',
          'dist/js/umd/tab.js': 'js/src/tab.js',
          'dist/js/umd/tooltip.js': 'js/src/tooltip.js',
          'dist/js/umd/popover.js': 'js/src/popover.js'
        }
      }
    },

    eslint: {
      options: {
        configFile: 'js/.eslintrc'
      },
      target: 'js/src/*.js'
    },

    jscs: {
      options: {
        config: 'js/.jscsrc'
      },
      grunt: {
        src: ['Gruntfile.js', 'grunt/*.js']
      },
      core: {
        src: 'js/src/*.js'
      },
      test: {
        src: 'js/tests/unit/*.js'
      },
      assets: {
        options: {
          requireCamelCaseOrUpperCaseIdentifiers: null
        },
        src: ['docs/assets/js/src/*.js', 'docs/assets/js/*.js', '!docs/assets/js/*.min.js']
      }
    },

    stamp: {
      options: {
        banner: '<%= banner %>\n<%= jqueryCheck %>\n<%= jqueryVersionCheck %>\n+function ($) {\n',
        footer: '\n}(jQuery);'
      },
      bootstrap: {
        files: {
          src: '<%= concat.bootstrap.dest %>'
        }
      }
    },

    concat: {
      options: {
        stripBanners: false
      },
      bootstrap: {
        src: ['js/src/util.js', 'js/src/alert.js', 'js/src/button.js', 'js/src/carousel.js', 'js/src/collapse.js', 'js/src/dropdown.js', 'js/src/modal.js', 'js/src/scrollspy.js', 'js/src/tab.js', 'js/src/tooltip.js', 'js/src/popover.js'],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        compress: {
          warnings: false
        },
        mangle: true,
        preserveComments: /^!|@preserve|@license|@cc_on/i
      },
      core: {
        src: '<%= concat.bootstrap.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
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

    // CSS build configuration
    scsslint: {
      options: {
        bundleExec: true,
        config: 'scss/.scss-lint.yml',
        reporterOutput: null
      },
      src: ['scss/*.scss', '!scss/_normalize.scss']
    },

    postcss: {
      core: {
        options: {
          map: true,
          processors: [mq4HoverShim.postprocessorFor({ hoverSelectorPrefix: '.bs-true-hover ' }), autoprefixer]
        },
        src: 'dist/css/*.css'
      },
      docs: {
        options: {
          processors: [autoprefixer]
        },
        src: 'docs/assets/css/docs.min.css'
      },
      examples: {
        options: {
          processors: [autoprefixer]
        },
        expand: true,
        cwd: 'docs/examples/',
        src: ['**/*.css'],
        dest: 'docs/examples/'
      }
    },

    cssmin: {
      options: {
        // TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
        //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
        compatibility: 'ie9',
        keepSpecialComments: '*',
        sourceMap: true,
        advanced: false
      },
      core: {
        files: [{
          expand: true,
          cwd: 'dist/css',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/css',
          ext: '.min.css'
        }]
      },
      docs: {
        src: 'docs/assets/css/docs.min.css',
        dest: 'docs/assets/css/docs.min.css'
      }
    },

    csscomb: {
      options: {
        config: 'scss/.csscomb.json'
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
        bundleExec: true,
        config: '_config.yml',
        incremental: false
      },
      docs: {},
      github: {
        options: {
          raw: 'github: true'
        }
      }
    },

    htmllint: {
      options: {
        ignore: ['Element “img” is missing required attribute “src”.', 'Attribute “autocomplete” is only allowed when the input type is “color”, “date”, “datetime”, “datetime-local”, “email”, “month”, “number”, “password”, “range”, “search”, “tel”, “text”, “time”, “url”, or “week”.', 'Attribute “autocomplete” not allowed on element “button” at this point.', 'Element “div” not allowed as child of element “progress” in this context. (Suppressing further errors from this subtree.)', 'Consider using the “h1” element as a top-level heading only (all “h1” elements are treated as top-level headings by many screen readers and other tools).', 'The “datetime” input type is not supported in all browsers. Please be sure to test, and consider using a polyfill.']
      },
      src: ['_gh_pages/**/*.html', 'js/tests/visual/*.html']
    },

    watch: {
      src: {
        files: '<%= jscs.core.src %>',
        tasks: ['babel:dev']
      },
      sass: {
        files: 'scss/**/*.scss',
        tasks: ['dist-css', 'docs']
      },
      docs: {
        files: 'docs/assets/scss/**/*.scss',
        tasks: ['dist-css', 'docs']
      }
    },

    'saucelabs-qunit': {
      all: {
        options: {
          build: process.env.TRAVIS_JOB_ID,
          concurrency: 10,
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

    buildcontrol: {
      options: {
        dir: '_gh_pages',
        commit: true,
        push: true,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      pages: {
        options: {
          remote: 'git@github.com:twbs/derpstrap.git',
          branch: 'gh-pages'
        }
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
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies',
    // Exclude Sass compilers. We choose the one to load later on.
    pattern: ['grunt-*', '!grunt-sass', '!grunt-contrib-sass'] });
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
    testSubtasks = testSubtasks.concat(['dist-css', 'dist-js', 'test-scss', 'test-js', 'docs']);
  }
  // Skip HTML validation if running a different subset of the test suite
  if (runSubset('validate-html') && isTravis &&
  // Skip HTML5 validator when [skip validator] is in the commit message
  isUndefOrNonZero(process.env.TWBS_DO_VALIDATOR)) {
    testSubtasks.push('validate-html');
  }
  // Only run Sauce Labs tests if there's a Sauce access key
  if (typeof process.env.SAUCE_ACCESS_KEY !== 'undefined' &&
  // Skip Sauce if running a different subset of the test suite
  runSubset('sauce-js-unit') &&
  // Skip Sauce on Travis when [skip sauce] is in the commit message
  isUndefOrNonZero(process.env.TWBS_DO_SAUCE)) {
    testSubtasks.push('babel:dev');
    testSubtasks.push('connect');
    testSubtasks.push('saucelabs-qunit');
  }
  grunt.registerTask('test', testSubtasks);
  grunt.registerTask('test-js', ['eslint', 'jscs:core', 'jscs:test', 'jscs:grunt', 'qunit']);

  // JS distribution task.
  grunt.registerTask('dist-js', ['babel:dev', 'concat', 'lineremover', 'babel:dist', 'stamp', 'uglify:core', 'commonjs']);

  grunt.registerTask('test-scss', ['scsslint']);

  // CSS distribution task.
  // Supported Compilers: sass (Ruby) and libsass.
  (function (sassCompilerName) {
    require('./grunt/bs-sass-compile/' + sassCompilerName + '.js')(grunt);
  })(process.env.TWBS_SASS || 'libsass');
  // grunt.registerTask('sass-compile', ['sass:core', 'sass:extras', 'sass:docs']);
  grunt.registerTask('sass-compile', ['sass:core', 'sass:docs']);

  grunt.registerTask('dist-css', ['sass-compile', 'postcss:core', 'csscomb:dist', 'cssmin:core', 'cssmin:docs']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean:dist', 'dist-css', 'dist-js']);

  // Default task.
  grunt.registerTask('default', ['clean:dist', 'test']);

  grunt.registerTask('commonjs', ['babel:umd', 'npm-js']);

  grunt.registerTask('npm-js', 'Generate npm-js entrypoint module in dist dir.', function () {
    var srcFiles = Object.keys(grunt.config.get('babel.umd.files')).map(function (filename) {
      return './' + path.join('umd', path.basename(filename));
    });
    var destFilepath = 'dist/js/npm.js';
    generateCommonJSModule(grunt, srcFiles, destFilepath);
  });

  // Docs task.
  grunt.registerTask('docs-css', ['postcss:docs', 'postcss:examples', 'csscomb:docs', 'csscomb:examples', 'cssmin:docs']);
  grunt.registerTask('docs-js', ['uglify:docsJs']);
  grunt.registerTask('lint-docs-js', ['jscs:assets']);
  grunt.registerTask('docs', ['docs-css', 'docs-js', 'lint-docs-js', 'clean:docs', 'copy:docs']);
  grunt.registerTask('docs-github', ['jekyll:github', 'htmlmin']);

  grunt.registerTask('prep-release', ['dist', 'docs', 'docs-github', 'compress']);

  // Publish to GitHub
  grunt.registerTask('publish', ['buildcontrol:pages']);

  // Task for updating the cached npm packages used by the Travis build (which are controlled by test-infra/npm-shrinkwrap.json).
  // This task should be run and the updated file should be committed whenever Bootstrap's dependencies change.
  grunt.registerTask('update-shrinkwrap', ['exec:npmUpdate', '_update-shrinkwrap']);
  grunt.registerTask('_update-shrinkwrap', function () {
    var done = this.async();
    npmShrinkwrap({ dev: true, dirname: __dirname }, function (err) {
      if (err) {
        grunt.fail.warn(err);
      }
      var dest = 'grunt/npm-shrinkwrap.json';
      fs.renameSync('npm-shrinkwrap.json', dest);
      grunt.log.writeln('File ' + dest.cyan + ' updated.');
      done();
    });
  });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2NsaWVudC9saWIvYm9vdHN0cmFwL0dydW50ZmlsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFPQSxPQUFPLE9BQVAsR0FBaUIsVUFBVSxLQUFWLEVBQWlCO0FBQ2hDOzs7O0FBR0EsUUFBTSxJQUFOLENBQVcsUUFBWCxHQUFzQixJQUF0Qjs7QUFFQSxTQUFPLEtBQVAsR0FBZSxVQUFVLE1BQVYsRUFBa0I7QUFDL0IsV0FBTyxPQUFPLE9BQVAsQ0FBZSxzQkFBZixFQUF1QyxNQUF2QyxDQUFQO0FBQ0QsR0FGRDs7QUFJQSxNQUFJLEtBQUssUUFBUSxJQUFSLENBQVQ7QUFDQSxNQUFJLE9BQU8sUUFBUSxNQUFSLENBQVg7QUFDQSxNQUFJLE9BQU8sUUFBUSxNQUFSLENBQVg7QUFDQSxNQUFJLFdBQVcsUUFBUSxXQUFSLENBQWY7QUFDQSxNQUFJLGdCQUFnQixRQUFRLGdCQUFSLENBQXBCO0FBQ0EsTUFBSSxlQUFlLFFBQVEsZ0JBQVIsQ0FBbkI7QUFDQSxNQUFJLGVBQWUsUUFBUSxjQUFSLEVBQXdCO0FBQ3pDLGNBQVU7Ozs7O0FBS1Isa0JBTFEsRTs7Ozs7Ozs7O0FBY1IsbUJBZFEsRTs7Ozs7QUFtQlIsZ0JBbkJRLEVBb0JSLGVBcEJROztBQXNCUixjQXRCUSxFQXVCUixhQXZCUTs7QUF5QlIsaUJBekJRLEVBMEJSLGNBMUJRLEVBMkJSLGFBM0JRO0FBRCtCLEdBQXhCLENBQW5COztBQWdDQSxNQUFJLHlCQUF5QixRQUFRLGtDQUFSLENBQTdCO0FBQ0EsTUFBSSxlQUFlLE1BQU0sSUFBTixDQUFXLFFBQVgsQ0FBb0IsMkJBQXBCLEVBQWlELEVBQUUsVUFBVSxNQUFaLEVBQWpELENBQW5COztBQUVBLFNBQU8sSUFBUCxDQUFZLGFBQWEsS0FBekIsRUFBZ0MsT0FBaEMsQ0FBd0MsVUFBVSxHQUFWLEVBQWU7QUFDckQsaUJBQWEsS0FBYixDQUFtQixHQUFuQixFQUF3QixPQUF4QixDQUFnQyxVQUFVLEdBQVYs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QUFoQjtBQUNEO0FBQ0QsVUFBSSxPQUFPLDJCQUFYO0FBQ0EsU0FBRyxVQUFILENBQWMscUJBQWQsRUFBcUMsSUFBckM7QUFDQSxZQUFNLEdBQU4sQ0FBVSxPQUFWLENBQWtCLFVBQVUsS0FBSyxJQUFmLEdBQXNCLFdBQXhDO0FBQ0E7QUFDRCxLQVJEO0FBU0QsR0FYRDtBQVlELENBN2hCRCIsImZpbGUiOiJHcnVudGZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIEJvb3RzdHJhcCdzIEdydW50ZmlsZVxuICogaHR0cDovL2dldGJvb3RzdHJhcC5jb21cbiAqIENvcHlyaWdodCAyMDEzLTIwMTUgVHdpdHRlciwgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChncnVudCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgLy8gRm9yY2UgdXNlIG9mIFVuaXggbmV3bGluZXNcbiAgZ3J1bnQudXRpbC5saW5lZmVlZCA9ICdcXG4nO1xuXG4gIFJlZ0V4cC5xdW90ZSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1stXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xuICB9O1xuXG4gIHZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gIHZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICB2YXIgZ2xvYiA9IHJlcXVpcmUoJ2dsb2InKTtcbiAgdmFyIGlzVHJhdmlzID0gcmVxdWlyZSgnaXMtdHJhdmlzJyk7XG4gIHZhciBucG1TaHJpbmt3cmFwID0gcmVxdWlyZSgnbnBtLXNocmlua3dyYXAnKTtcbiAgdmFyIG1xNEhvdmVyU2hpbSA9IHJlcXVpcmUoJ21xNC1ob3Zlci1zaGltJyk7XG4gIHZhciBhdXRvcHJlZml4ZXIgPSByZXF1aXJlKCdhdXRvcHJlZml4ZXInKSh7XG4gICAgYnJvd3NlcnM6IFtcbiAgICAgIC8vXG4gICAgICAvLyBPZmZpY2lhbCBicm93c2VyIHN1cHBvcnQgcG9saWN5OlxuICAgICAgLy8gaHR0cDovL3Y0LWFscGhhLmdldGJvb3RzdHJhcC5jb20vZ2V0dGluZy1zdGFydGVkL2Jyb3dzZXJzLWRldmljZXMvI3N1cHBvcnRlZC1icm93c2Vyc1xuICAgICAgLy9cbiAgICAgICdDaHJvbWUgPj0gMzUnLCAvLyBFeGFjdCB2ZXJzaW9uIG51bWJlciBoZXJlIGlzIGtpbmRhIGFyYml0cmFyeVxuICAgICAgLy8gUmF0aGVyIHRoYW4gdXNpbmcgQXV0b3ByZWZpeGVyJ3MgbmF0aXZlIFwiRmlyZWZveCBFU1JcIiB2ZXJzaW9uIHNwZWNpZmllciBzdHJpbmcsXG4gICAgICAvLyB3ZSBkZWxpYmVyYXRlbHkgaGFyZGNvZGUgdGhlIG51bWJlci4gVGhpcyBpcyB0byBhdm9pZCB1bndpdHRpbmdseSBzZXZlcmVseSBicmVha2luZyB0aGUgcHJldmlvdXMgRVNSIGluIHRoZSBldmVudCB0aGF0OlxuICAgICAgLy8gKGEpIHdlIGhhcHBlbiB0byBzaGlwIGEgbmV3IEJvb3RzdHJhcCByZWxlYXNlIHNvb24gYWZ0ZXIgdGhlIHJlbGVhc2Ugb2YgYSBuZXcgRVNSLFxuICAgICAgLy8gICAgIHN1Y2ggdGhhdCBmb2xrcyBoYXZlbid0IHlldCBoYWQgYSByZWFzb25hYmxlIGFtb3VudCBvZiB0aW1lIHRvIHVwZ3JhZGU7IGFuZFxuICAgICAgLy8gKGIpIHRoZSBuZXcgRVNSIGhhcyB1bnByZWZpeGVkIENTUyBwcm9wZXJ0aWVzL3ZhbHVlcyB3aG9zZSBhYnNlbmNlIHdvdWxkIHNldmVyZWx5IGJyZWFrIHdlYnBhZ2VzXG4gICAgICAvLyAgICAgKGUuZy4gYGJveC1zaXppbmdgLCBhcyBvcHBvc2VkIHRvIGBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoLi4uKWApLlxuICAgICAgLy8gICAgIFNpbmNlIHRoZXkndmUgYmVlbiB1bnByZWZpeGVkLCBBdXRvcHJlZml4ZXIgd2lsbCBzdG9wIHByZWZpeGluZyB0aGVtLFxuICAgICAgLy8gICAgIHRodXMgY2F1c2luZyB0aGVtIHRvIG5vdCB3b3JrIGluIHRoZSBwcmV2aW91cyBFU1IgKHdoZXJlIHRoZSBwcmVmaXhlcyB3ZXJlIHJlcXVpcmVkKS5cbiAgICAgICdGaXJlZm94ID49IDMxJywgLy8gQ3VycmVudCBGaXJlZm94IEV4dGVuZGVkIFN1cHBvcnQgUmVsZWFzZSAoRVNSKVxuICAgICAgLy8gTm90ZTogRWRnZSB2ZXJzaW9ucyBpbiBBdXRvcHJlZml4ZXIgJiBDYW4gSSBVc2UgcmVmZXIgdG8gdGhlIEVkZ2VIVE1MIHJlbmRlcmluZyBlbmdpbmUgdmVyc2lvbixcbiAgICAgIC8vIE5PVCB0aGUgRWRnZSBhcHAgdmVyc2lvbiBzaG93biBpbiBFZGdlJ3MgXCJBYm91dFwiIHNjcmVlbi5cbiAgICAgIC8vIEZvciBleGFtcGxlLCBhdCB0aGUgdGltZSBvZiB3cml0aW5nLCBFZGdlIDIwIG9uIGFuIHVwLXRvLWRhdGUgc3lzdGVtIHVzZXMgRWRnZUhUTUwgMTIuXG4gICAgICAvLyBTZWUgYWxzbyBodHRwczovL2dpdGh1Yi5jb20vRnlyZC9jYW5pdXNlL2lzc3Vlcy8xOTI4XG4gICAgICAnRWRnZSA+PSAxMicsXG4gICAgICAnRXhwbG9yZXIgPj0gOScsXG4gICAgICAvLyBPdXQgb2YgbGVuaWVuY3ksIHdlIHByZWZpeCB0aGVzZSAxIHZlcnNpb24gZnVydGhlciBiYWNrIHRoYW4gdGhlIG9mZmljaWFsIHBvbGljeS5cbiAgICAgICdpT1MgPj0gOCcsXG4gICAgICAnU2FmYXJpID49IDgnLFxuICAgICAgLy8gVGhlIGZvbGxvd2luZyByZW1haW4gTk9UIG9mZmljaWFsbHkgc3VwcG9ydGVkLCBidXQgd2UncmUgbGVuaWVudCBhbmQgaW5jbHVkZSB0aGVpciBwcmVmaXhlcyB0byBhdm9pZCBzZXZlcmVseSBicmVha2luZyBpbiB0aGVtLlxuICAgICAgJ0FuZHJvaWQgMi4zJyxcbiAgICAgICdBbmRyb2lkID49IDQnLFxuICAgICAgJ09wZXJhID49IDEyJ1xuICAgIF1cbiAgfSk7XG5cbiAgdmFyIGdlbmVyYXRlQ29tbW9uSlNNb2R1bGUgPSByZXF1aXJlKCcuL2dydW50L2JzLWNvbW1vbmpzLWdlbmVyYXRvci5qcycpO1xuICB2YXIgY29uZmlnQnJpZGdlID0gZ3J1bnQuZmlsZS5yZWFkSlNPTignLi9ncnVudC9jb25maWdCcmlkZ2UuanNvbicsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KTtcblxuICBPYmplY3Qua2V5cyhjb25maWdCcmlkZ2UucGF0aHMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIGNvbmZpZ0JyaWRnZS5wYXRoc1trZXldLmZvckVhY2goZnVuY3Rpb24gKHZhbCwgaSwgYXJyKSB7XG4gICAgICBhcnJbaV0gPSBwYXRoLmpvaW4oJy4vZG9jcy9hc3NldHMnLCB2YWwpO1xuICAgIH0pO1xuICB9KTtcblxuICAvLyBQcm9qZWN0IGNvbmZpZ3VyYXRpb24uXG4gIGdydW50LmluaXRDb25maWcoe1xuXG4gICAgLy8gTWV0YWRhdGEuXG4gICAgcGtnOiBncnVudC5maWxlLnJlYWRKU09OKCdwYWNrYWdlLmpzb24nKSxcbiAgICBiYW5uZXI6ICcvKiFcXG4nICtcbiAgICAgICAgICAgICcgKiBCb290c3RyYXAgdjwlPSBwa2cudmVyc2lvbiAlPiAoPCU9IHBrZy5ob21lcGFnZSAlPilcXG4nICtcbiAgICAgICAgICAgICcgKiBDb3B5cmlnaHQgMjAxMS08JT0gZ3J1bnQudGVtcGxhdGUudG9kYXkoXCJ5eXl5XCIpICU+IDwlPSBwa2cuYXV0aG9yICU+XFxuJyArXG4gICAgICAgICAgICAnICogTGljZW5zZWQgdW5kZXIgTUlUIChodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvYmxvYi9tYXN0ZXIvTElDRU5TRSlcXG4nICtcbiAgICAgICAgICAgICcgKi9cXG4nLFxuICAgIGpxdWVyeUNoZWNrOiAnaWYgKHR5cGVvZiBqUXVlcnkgPT09IFxcJ3VuZGVmaW5lZFxcJykge1xcbicgK1xuICAgICAgICAgICAgICAgICAnICB0aHJvdyBuZXcgRXJyb3IoXFwnQm9vdHN0cmFwXFxcXFxcJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBqUXVlcnlcXCcpXFxuJyArXG4gICAgICAgICAgICAgICAgICd9XFxuJyxcbiAgICBqcXVlcnlWZXJzaW9uQ2hlY2s6ICcrZnVuY3Rpb24gKCQpIHtcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICcgIHZhciB2ZXJzaW9uID0gJC5mbi5qcXVlcnkuc3BsaXQoXFwnIFxcJylbMF0uc3BsaXQoXFwnLlxcJylcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICcgIGlmICgodmVyc2lvblswXSA8IDIgJiYgdmVyc2lvblsxXSA8IDkpIHx8ICh2ZXJzaW9uWzBdID09IDEgJiYgdmVyc2lvblsxXSA9PSA5ICYmIHZlcnNpb25bMl0gPCAxKSB8fCAodmVyc2lvblswXSA+PSAzKSkge1xcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJyAgICB0aHJvdyBuZXcgRXJyb3IoXFwnQm9vdHN0cmFwXFxcXFxcJ3MgSmF2YVNjcmlwdCByZXF1aXJlcyBhdCBsZWFzdCBqUXVlcnkgdjEuOS4xIGJ1dCBsZXNzIHRoYW4gdjMuMC4wXFwnKVxcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJyAgfVxcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ30oalF1ZXJ5KTtcXG5cXG4nLFxuXG4gICAgLy8gVGFzayBjb25maWd1cmF0aW9uLlxuICAgIGNsZWFuOiB7XG4gICAgICBkaXN0OiAnZGlzdCcsXG4gICAgICBkb2NzOiAnZG9jcy9kaXN0J1xuICAgIH0sXG5cbiAgICAvLyBKUyBidWlsZCBjb25maWd1cmF0aW9uXG4gICAgbGluZXJlbW92ZXI6IHtcbiAgICAgIGVzNkltcG9ydDoge1xuICAgICAgICBmaWxlczoge1xuICAgICAgICAgICc8JT0gY29uY2F0LmJvb3RzdHJhcC5kZXN0ICU+JzogJzwlPSBjb25jYXQuYm9vdHN0cmFwLmRlc3QgJT4nXG4gICAgICAgIH0sXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICBleGNsdXNpb25QYXR0ZXJuOiAvXihpbXBvcnR8ZXhwb3J0KS9nXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYmFiZWw6IHtcbiAgICAgIGRldjoge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgc291cmNlTWFwOiB0cnVlLFxuICAgICAgICAgIG1vZHVsZXM6ICdpZ25vcmUnXG4gICAgICAgIH0sXG4gICAgICAgIGZpbGVzOiB7XG4gICAgICAgICAgJ2pzL2Rpc3QvdXRpbC5qcycgICAgICA6ICdqcy9zcmMvdXRpbC5qcycsXG4gICAgICAgICAgJ2pzL2Rpc3QvYWxlcnQuanMnICAgICA6ICdqcy9zcmMvYWxlcnQuanMnLFxuICAgICAgICAgICdqcy9kaXN0L2J1dHRvbi5qcycgICAgOiAnanMvc3JjL2J1dHRvbi5qcycsXG4gICAgICAgICAgJ2pzL2Rpc3QvY2Fyb3VzZWwuanMnICA6ICdqcy9zcmMvY2Fyb3VzZWwuanMnLFxuICAgICAgICAgICdqcy9kaXN0L2NvbGxhcHNlLmpzJyAgOiAnanMvc3JjL2NvbGxhcHNlLmpzJyxcbiAgICAgICAgICAnanMvZGlzdC9kcm9wZG93bi5qcycgIDogJ2pzL3NyYy9kcm9wZG93bi5qcycsXG4gICAgICAgICAgJ2pzL2Rpc3QvbW9kYWwuanMnICAgICA6ICdqcy9zcmMvbW9kYWwuanMnLFxuICAgICAgICAgICdqcy9kaXN0L3Njcm9sbHNweS5qcycgOiAnanMvc3JjL3Njcm9sbHNweS5qcycsXG4gICAgICAgICAgJ2pzL2Rpc3QvdGFiLmpzJyAgICAgICA6ICdqcy9zcmMvdGFiLmpzJyxcbiAgICAgICAgICAnanMvZGlzdC90b29sdGlwLmpzJyAgIDogJ2pzL3NyYy90b29sdGlwLmpzJyxcbiAgICAgICAgICAnanMvZGlzdC9wb3BvdmVyLmpzJyAgIDogJ2pzL3NyYy9wb3BvdmVyLmpzJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGlzdDoge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgbW9kdWxlczogJ2lnbm9yZSdcbiAgICAgICAgfSxcbiAgICAgICAgZmlsZXM6IHtcbiAgICAgICAgICAnPCU9IGNvbmNhdC5ib290c3RyYXAuZGVzdCAlPicgOiAnPCU9IGNvbmNhdC5ib290c3RyYXAuZGVzdCAlPidcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHVtZDoge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgbW9kdWxlczogJ3VtZCdcbiAgICAgICAgfSxcbiAgICAgICAgZmlsZXM6IHtcbiAgICAgICAgICAnZGlzdC9qcy91bWQvdXRpbC5qcycgICAgICA6ICdqcy9zcmMvdXRpbC5qcycsXG4gICAgICAgICAgJ2Rpc3QvanMvdW1kL2FsZXJ0LmpzJyAgICAgOiAnanMvc3JjL2FsZXJ0LmpzJyxcbiAgICAgICAgICAnZGlzdC9qcy91bWQvYnV0dG9uLmpzJyAgICA6ICdqcy9zcmMvYnV0dG9uLmpzJyxcbiAgICAgICAgICAnZGlzdC9qcy91bWQvY2Fyb3VzZWwuanMnICA6ICdqcy9zcmMvY2Fyb3VzZWwuanMnLFxuICAgICAgICAgICdkaXN0L2pzL3VtZC9jb2xsYXBzZS5qcycgIDogJ2pzL3NyYy9jb2xsYXBzZS5qcycsXG4gICAgICAgICAgJ2Rpc3QvanMvdW1kL2Ryb3Bkb3duLmpzJyAgOiAnanMvc3JjL2Ryb3Bkb3duLmpzJyxcbiAgICAgICAgICAnZGlzdC9qcy91bWQvbW9kYWwuanMnICAgICA6ICdqcy9zcmMvbW9kYWwuanMnLFxuICAgICAgICAgICdkaXN0L2pzL3VtZC9zY3JvbGxzcHkuanMnIDogJ2pzL3NyYy9zY3JvbGxzcHkuanMnLFxuICAgICAgICAgICdkaXN0L2pzL3VtZC90YWIuanMnICAgICAgIDogJ2pzL3NyYy90YWIuanMnLFxuICAgICAgICAgICdkaXN0L2pzL3VtZC90b29sdGlwLmpzJyAgIDogJ2pzL3NyYy90b29sdGlwLmpzJyxcbiAgICAgICAgICAnZGlzdC9qcy91bWQvcG9wb3Zlci5qcycgICA6ICdqcy9zcmMvcG9wb3Zlci5qcydcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBlc2xpbnQ6IHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgY29uZmlnRmlsZTogJ2pzLy5lc2xpbnRyYydcbiAgICAgIH0sXG4gICAgICB0YXJnZXQ6ICdqcy9zcmMvKi5qcydcbiAgICB9LFxuXG4gICAganNjczoge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBjb25maWc6ICdqcy8uanNjc3JjJ1xuICAgICAgfSxcbiAgICAgIGdydW50OiB7XG4gICAgICAgIHNyYzogWydHcnVudGZpbGUuanMnLCAnZ3J1bnQvKi5qcyddXG4gICAgICB9LFxuICAgICAgY29yZToge1xuICAgICAgICBzcmM6ICdqcy9zcmMvKi5qcydcbiAgICAgIH0sXG4gICAgICB0ZXN0OiB7XG4gICAgICAgIHNyYzogJ2pzL3Rlc3RzL3VuaXQvKi5qcydcbiAgICAgIH0sXG4gICAgICBhc3NldHM6IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIHJlcXVpcmVDYW1lbENhc2VPclVwcGVyQ2FzZUlkZW50aWZpZXJzOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIHNyYzogWydkb2NzL2Fzc2V0cy9qcy9zcmMvKi5qcycsICdkb2NzL2Fzc2V0cy9qcy8qLmpzJywgJyFkb2NzL2Fzc2V0cy9qcy8qLm1pbi5qcyddXG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0YW1wOiB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGJhbm5lcjogJzwlPSBiYW5uZXIgJT5cXG48JT0ganF1ZXJ5Q2hlY2sgJT5cXG48JT0ganF1ZXJ5VmVyc2lvbkNoZWNrICU+XFxuK2Z1bmN0aW9uICgkKSB7XFxuJyxcbiAgICAgICAgZm9vdGVyOiAnXFxufShqUXVlcnkpOydcbiAgICAgIH0sXG4gICAgICBib290c3RyYXA6IHtcbiAgICAgICAgZmlsZXM6IHtcbiAgICAgICAgICBzcmM6ICc8JT0gY29uY2F0LmJvb3RzdHJhcC5kZXN0ICU+J1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGNvbmNhdDoge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBzdHJpcEJhbm5lcnM6IGZhbHNlXG4gICAgICB9LFxuICAgICAgYm9vdHN0cmFwOiB7XG4gICAgICAgIHNyYzogW1xuICAgICAgICAgICdqcy9zcmMvdXRpbC5qcycsXG4gICAgICAgICAgJ2pzL3NyYy9hbGVydC5qcycsXG4gICAgICAgICAgJ2pzL3NyYy9idXR0b24uanMnLFxuICAgICAgICAgICdqcy9zcmMvY2Fyb3VzZWwuanMnLFxuICAgICAgICAgICdqcy9zcmMvY29sbGFwc2UuanMnLFxuICAgICAgICAgICdqcy9zcmMvZHJvcGRvd24uanMnLFxuICAgICAgICAgICdqcy9zcmMvbW9kYWwuanMnLFxuICAgICAgICAgICdqcy9zcmMvc2Nyb2xsc3B5LmpzJyxcbiAgICAgICAgICAnanMvc3JjL3RhYi5qcycsXG4gICAgICAgICAgJ2pzL3NyYy90b29sdGlwLmpzJyxcbiAgICAgICAgICAnanMvc3JjL3BvcG92ZXIuanMnXG4gICAgICAgIF0sXG4gICAgICAgIGRlc3Q6ICdkaXN0L2pzLzwlPSBwa2cubmFtZSAlPi5qcydcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdWdsaWZ5OiB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgICAgd2FybmluZ3M6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIG1hbmdsZTogdHJ1ZSxcbiAgICAgICAgcHJlc2VydmVDb21tZW50czogL14hfEBwcmVzZXJ2ZXxAbGljZW5zZXxAY2Nfb24vaVxuICAgICAgfSxcbiAgICAgIGNvcmU6IHtcbiAgICAgICAgc3JjOiAnPCU9IGNvbmNhdC5ib290c3RyYXAuZGVzdCAlPicsXG4gICAgICAgIGRlc3Q6ICdkaXN0L2pzLzwlPSBwa2cubmFtZSAlPi5taW4uanMnXG4gICAgICB9LFxuICAgICAgZG9jc0pzOiB7XG4gICAgICAgIHNyYzogY29uZmlnQnJpZGdlLnBhdGhzLmRvY3NKcyxcbiAgICAgICAgZGVzdDogJ2RvY3MvYXNzZXRzL2pzL2RvY3MubWluLmpzJ1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBxdW5pdDoge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBpbmplY3Q6ICdqcy90ZXN0cy91bml0L3BoYW50b20uanMnXG4gICAgICB9LFxuICAgICAgZmlsZXM6ICdqcy90ZXN0cy9pbmRleC5odG1sJ1xuICAgIH0sXG5cbiAgICAvLyBDU1MgYnVpbGQgY29uZmlndXJhdGlvblxuICAgIHNjc3NsaW50OiB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGJ1bmRsZUV4ZWM6IHRydWUsXG4gICAgICAgIGNvbmZpZzogJ3Njc3MvLnNjc3MtbGludC55bWwnLFxuICAgICAgICByZXBvcnRlck91dHB1dDogbnVsbFxuICAgICAgfSxcbiAgICAgIHNyYzogWydzY3NzLyouc2NzcycsICchc2Nzcy9fbm9ybWFsaXplLnNjc3MnXVxuICAgIH0sXG5cbiAgICBwb3N0Y3NzOiB7XG4gICAgICBjb3JlOiB7XG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICBtYXA6IHRydWUsXG4gICAgICAgICAgcHJvY2Vzc29yczogW1xuICAgICAgICAgICAgbXE0SG92ZXJTaGltLnBvc3Rwcm9jZXNzb3JGb3IoeyBob3ZlclNlbGVjdG9yUHJlZml4OiAnLmJzLXRydWUtaG92ZXIgJyB9KSxcbiAgICAgICAgICAgIGF1dG9wcmVmaXhlclxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgc3JjOiAnZGlzdC9jc3MvKi5jc3MnXG4gICAgICB9LFxuICAgICAgZG9jczoge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgcHJvY2Vzc29yczogW1xuICAgICAgICAgICAgYXV0b3ByZWZpeGVyXG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICBzcmM6ICdkb2NzL2Fzc2V0cy9jc3MvZG9jcy5taW4uY3NzJ1xuICAgICAgfSxcbiAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICBwcm9jZXNzb3JzOiBbXG4gICAgICAgICAgICBhdXRvcHJlZml4ZXJcbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIGV4cGFuZDogdHJ1ZSxcbiAgICAgICAgY3dkOiAnZG9jcy9leGFtcGxlcy8nLFxuICAgICAgICBzcmM6IFsnKiovKi5jc3MnXSxcbiAgICAgICAgZGVzdDogJ2RvY3MvZXhhbXBsZXMvJ1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjc3NtaW46IHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgLy8gVE9ETzogZGlzYWJsZSBgemVyb1VuaXRzYCBvcHRpbWl6YXRpb24gb25jZSBjbGVhbi1jc3MgMy4yIGlzIHJlbGVhc2VkXG4gICAgICAgIC8vICAgIGFuZCB0aGVuIHNpbXBsaWZ5IHRoZSBmaXggZm9yIGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9pc3N1ZXMvMTQ4MzcgYWNjb3JkaW5nbHlcbiAgICAgICAgY29tcGF0aWJpbGl0eTogJ2llOScsXG4gICAgICAgIGtlZXBTcGVjaWFsQ29tbWVudHM6ICcqJyxcbiAgICAgICAgc291cmNlTWFwOiB0cnVlLFxuICAgICAgICBhZHZhbmNlZDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBjb3JlOiB7XG4gICAgICAgIGZpbGVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZXhwYW5kOiB0cnVlLFxuICAgICAgICAgICAgY3dkOiAnZGlzdC9jc3MnLFxuICAgICAgICAgICAgc3JjOiBbJyouY3NzJywgJyEqLm1pbi5jc3MnXSxcbiAgICAgICAgICAgIGRlc3Q6ICdkaXN0L2NzcycsXG4gICAgICAgICAgICBleHQ6ICcubWluLmNzcydcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBkb2NzOiB7XG4gICAgICAgIHNyYzogJ2RvY3MvYXNzZXRzL2Nzcy9kb2NzLm1pbi5jc3MnLFxuICAgICAgICBkZXN0OiAnZG9jcy9hc3NldHMvY3NzL2RvY3MubWluLmNzcydcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY3NzY29tYjoge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBjb25maWc6ICdzY3NzLy5jc3Njb21iLmpzb24nXG4gICAgICB9LFxuICAgICAgZGlzdDoge1xuICAgICAgICBleHBhbmQ6IHRydWUsXG4gICAgICAgIGN3ZDogJ2Rpc3QvY3NzLycsXG4gICAgICAgIHNyYzogWycqLmNzcycsICchKi5taW4uY3NzJ10sXG4gICAgICAgIGRlc3Q6ICdkaXN0L2Nzcy8nXG4gICAgICB9LFxuICAgICAgZXhhbXBsZXM6IHtcbiAgICAgICAgZXhwYW5kOiB0cnVlLFxuICAgICAgICBjd2Q6ICdkb2NzL2V4YW1wbGVzLycsXG4gICAgICAgIHNyYzogJyoqLyouY3NzJyxcbiAgICAgICAgZGVzdDogJ2RvY3MvZXhhbXBsZXMvJ1xuICAgICAgfSxcbiAgICAgIGRvY3M6IHtcbiAgICAgICAgc3JjOiAnZG9jcy9hc3NldHMvY3NzL3NyYy9kb2NzLmNzcycsXG4gICAgICAgIGRlc3Q6ICdkb2NzL2Fzc2V0cy9jc3Mvc3JjL2RvY3MuY3NzJ1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjb3B5OiB7XG4gICAgICBkb2NzOiB7XG4gICAgICAgIGV4cGFuZDogdHJ1ZSxcbiAgICAgICAgY3dkOiAnZGlzdC8nLFxuICAgICAgICBzcmM6IFtcbiAgICAgICAgICAnKiovKidcbiAgICAgICAgXSxcbiAgICAgICAgZGVzdDogJ2RvY3MvZGlzdC8nXG4gICAgICB9XG4gICAgfSxcblxuICAgIGNvbm5lY3Q6IHtcbiAgICAgIHNlcnZlcjoge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgcG9ydDogMzAwMCxcbiAgICAgICAgICBiYXNlOiAnLidcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBqZWt5bGw6IHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgYnVuZGxlRXhlYzogdHJ1ZSxcbiAgICAgICAgY29uZmlnOiAnX2NvbmZpZy55bWwnLFxuICAgICAgICBpbmNyZW1lbnRhbDogZmFsc2VcbiAgICAgIH0sXG4gICAgICBkb2NzOiB7fSxcbiAgICAgIGdpdGh1Yjoge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgcmF3OiAnZ2l0aHViOiB0cnVlJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGh0bWxsaW50OiB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGlnbm9yZTogW1xuICAgICAgICAgICdFbGVtZW50IOKAnGltZ+KAnSBpcyBtaXNzaW5nIHJlcXVpcmVkIGF0dHJpYnV0ZSDigJxzcmPigJ0uJyxcbiAgICAgICAgICAnQXR0cmlidXRlIOKAnGF1dG9jb21wbGV0ZeKAnSBpcyBvbmx5IGFsbG93ZWQgd2hlbiB0aGUgaW5wdXQgdHlwZSBpcyDigJxjb2xvcuKAnSwg4oCcZGF0ZeKAnSwg4oCcZGF0ZXRpbWXigJ0sIOKAnGRhdGV0aW1lLWxvY2Fs4oCdLCDigJxlbWFpbOKAnSwg4oCcbW9udGjigJ0sIOKAnG51bWJlcuKAnSwg4oCccGFzc3dvcmTigJ0sIOKAnHJhbmdl4oCdLCDigJxzZWFyY2jigJ0sIOKAnHRlbOKAnSwg4oCcdGV4dOKAnSwg4oCcdGltZeKAnSwg4oCcdXJs4oCdLCBvciDigJx3ZWVr4oCdLicsXG4gICAgICAgICAgJ0F0dHJpYnV0ZSDigJxhdXRvY29tcGxldGXigJ0gbm90IGFsbG93ZWQgb24gZWxlbWVudCDigJxidXR0b27igJ0gYXQgdGhpcyBwb2ludC4nLFxuICAgICAgICAgICdFbGVtZW50IOKAnGRpduKAnSBub3QgYWxsb3dlZCBhcyBjaGlsZCBvZiBlbGVtZW50IOKAnHByb2dyZXNz4oCdIGluIHRoaXMgY29udGV4dC4gKFN1cHByZXNzaW5nIGZ1cnRoZXIgZXJyb3JzIGZyb20gdGhpcyBzdWJ0cmVlLiknLFxuICAgICAgICAgICdDb25zaWRlciB1c2luZyB0aGUg4oCcaDHigJ0gZWxlbWVudCBhcyBhIHRvcC1sZXZlbCBoZWFkaW5nIG9ubHkgKGFsbCDigJxoMeKAnSBlbGVtZW50cyBhcmUgdHJlYXRlZCBhcyB0b3AtbGV2ZWwgaGVhZGluZ3MgYnkgbWFueSBzY3JlZW4gcmVhZGVycyBhbmQgb3RoZXIgdG9vbHMpLicsXG4gICAgICAgICAgJ1RoZSDigJxkYXRldGltZeKAnSBpbnB1dCB0eXBlIGlzIG5vdCBzdXBwb3J0ZWQgaW4gYWxsIGJyb3dzZXJzLiBQbGVhc2UgYmUgc3VyZSB0byB0ZXN0LCBhbmQgY29uc2lkZXIgdXNpbmcgYSBwb2x5ZmlsbC4nXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBzcmM6IFsnX2doX3BhZ2VzLyoqLyouaHRtbCcsICdqcy90ZXN0cy92aXN1YWwvKi5odG1sJ11cbiAgICB9LFxuXG4gICAgd2F0Y2g6IHtcbiAgICAgIHNyYzoge1xuICAgICAgICBmaWxlczogJzwlPSBqc2NzLmNvcmUuc3JjICU+JyxcbiAgICAgICAgdGFza3M6IFsnYmFiZWw6ZGV2J11cbiAgICAgIH0sXG4gICAgICBzYXNzOiB7XG4gICAgICAgIGZpbGVzOiAnc2Nzcy8qKi8qLnNjc3MnLFxuICAgICAgICB0YXNrczogWydkaXN0LWNzcycsICdkb2NzJ11cbiAgICAgIH0sXG4gICAgICBkb2NzOiB7XG4gICAgICAgIGZpbGVzOiAnZG9jcy9hc3NldHMvc2Nzcy8qKi8qLnNjc3MnLFxuICAgICAgICB0YXNrczogWydkaXN0LWNzcycsICdkb2NzJ11cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJ3NhdWNlbGFicy1xdW5pdCc6IHtcbiAgICAgIGFsbDoge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgYnVpbGQ6IHByb2Nlc3MuZW52LlRSQVZJU19KT0JfSUQsXG4gICAgICAgICAgY29uY3VycmVuY3k6IDEwLFxuICAgICAgICAgIG1heFJldHJpZXM6IDMsXG4gICAgICAgICAgbWF4UG9sbFJldHJpZXM6IDQsXG4gICAgICAgICAgdXJsczogWydodHRwOi8vMTI3LjAuMC4xOjMwMDAvanMvdGVzdHMvaW5kZXguaHRtbD9oaWRlcGFzc2VkJ10sXG4gICAgICAgICAgYnJvd3NlcnM6IGdydW50LmZpbGUucmVhZFlBTUwoJ2dydW50L3NhdWNlX2Jyb3dzZXJzLnltbCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZXhlYzoge1xuICAgICAgbnBtVXBkYXRlOiB7XG4gICAgICAgIGNvbW1hbmQ6ICducG0gdXBkYXRlJ1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBidWlsZGNvbnRyb2w6IHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgZGlyOiAnX2doX3BhZ2VzJyxcbiAgICAgICAgY29tbWl0OiB0cnVlLFxuICAgICAgICBwdXNoOiB0cnVlLFxuICAgICAgICBtZXNzYWdlOiAnQnVpbHQgJXNvdXJjZU5hbWUlIGZyb20gY29tbWl0ICVzb3VyY2VDb21taXQlIG9uIGJyYW5jaCAlc291cmNlQnJhbmNoJSdcbiAgICAgIH0sXG4gICAgICBwYWdlczoge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgcmVtb3RlOiAnZ2l0QGdpdGh1Yi5jb206dHdicy9kZXJwc3RyYXAuZ2l0JyxcbiAgICAgICAgICBicmFuY2g6ICdnaC1wYWdlcydcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBjb21wcmVzczoge1xuICAgICAgbWFpbjoge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgYXJjaGl2ZTogJ2Jvb3RzdHJhcC08JT0gcGtnLnZlcnNpb24gJT4tZGlzdC56aXAnLFxuICAgICAgICAgIG1vZGU6ICd6aXAnLFxuICAgICAgICAgIGxldmVsOiA5LFxuICAgICAgICAgIHByZXR0eTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBmaWxlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGV4cGFuZDogdHJ1ZSxcbiAgICAgICAgICAgIGN3ZDogJ2Rpc3QvJyxcbiAgICAgICAgICAgIHNyYzogWycqKiddLFxuICAgICAgICAgICAgZGVzdDogJ2Jvb3RzdHJhcC08JT0gcGtnLnZlcnNpb24gJT4tZGlzdCdcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9XG5cbiAgfSk7XG5cblxuICAvLyBUaGVzZSBwbHVnaW5zIHByb3ZpZGUgbmVjZXNzYXJ5IHRhc2tzLlxuICByZXF1aXJlKCdsb2FkLWdydW50LXRhc2tzJykoZ3J1bnQsIHsgc2NvcGU6ICdkZXZEZXBlbmRlbmNpZXMnLFxuICAgIC8vIEV4Y2x1ZGUgU2FzcyBjb21waWxlcnMuIFdlIGNob29zZSB0aGUgb25lIHRvIGxvYWQgbGF0ZXIgb24uXG4gICAgcGF0dGVybjogWydncnVudC0qJywgJyFncnVudC1zYXNzJywgJyFncnVudC1jb250cmliLXNhc3MnXSB9KTtcbiAgcmVxdWlyZSgndGltZS1ncnVudCcpKGdydW50KTtcblxuICAvLyBEb2NzIEhUTUwgdmFsaWRhdGlvbiB0YXNrXG4gIGdydW50LnJlZ2lzdGVyVGFzaygndmFsaWRhdGUtaHRtbCcsIFsnamVreWxsOmRvY3MnLCAnaHRtbGxpbnQnXSk7XG5cbiAgdmFyIHJ1blN1YnNldCA9IGZ1bmN0aW9uIChzdWJzZXQpIHtcbiAgICByZXR1cm4gIXByb2Nlc3MuZW52LlRXQlNfVEVTVCB8fCBwcm9jZXNzLmVudi5UV0JTX1RFU1QgPT09IHN1YnNldDtcbiAgfTtcbiAgdmFyIGlzVW5kZWZPck5vblplcm8gPSBmdW5jdGlvbiAodmFsKSB7XG4gICAgcmV0dXJuIHZhbCA9PT0gdW5kZWZpbmVkIHx8IHZhbCAhPT0gJzAnO1xuICB9O1xuXG4gIC8vIFRlc3QgdGFzay5cbiAgdmFyIHRlc3RTdWJ0YXNrcyA9IFtdO1xuICAvLyBTa2lwIGNvcmUgdGVzdHMgaWYgcnVubmluZyBhIGRpZmZlcmVudCBzdWJzZXQgb2YgdGhlIHRlc3Qgc3VpdGVcbiAgaWYgKHJ1blN1YnNldCgnY29yZScpICYmXG4gICAgLy8gU2tpcCBjb3JlIHRlc3RzIGlmIHRoaXMgaXMgYSBTYXZhZ2UgYnVpbGRcbiAgICBwcm9jZXNzLmVudi5UUkFWSVNfUkVQT19TTFVHICE9PSAndHdicy1zYXZhZ2UvYm9vdHN0cmFwJykge1xuICAgIHRlc3RTdWJ0YXNrcyA9IHRlc3RTdWJ0YXNrcy5jb25jYXQoWydkaXN0LWNzcycsICdkaXN0LWpzJywgJ3Rlc3Qtc2NzcycsICd0ZXN0LWpzJywgJ2RvY3MnXSk7XG4gIH1cbiAgLy8gU2tpcCBIVE1MIHZhbGlkYXRpb24gaWYgcnVubmluZyBhIGRpZmZlcmVudCBzdWJzZXQgb2YgdGhlIHRlc3Qgc3VpdGVcbiAgaWYgKHJ1blN1YnNldCgndmFsaWRhdGUtaHRtbCcpICYmXG4gICAgICBpc1RyYXZpcyAmJlxuICAgICAgLy8gU2tpcCBIVE1MNSB2YWxpZGF0b3Igd2hlbiBbc2tpcCB2YWxpZGF0b3JdIGlzIGluIHRoZSBjb21taXQgbWVzc2FnZVxuICAgICAgaXNVbmRlZk9yTm9uWmVybyhwcm9jZXNzLmVudi5UV0JTX0RPX1ZBTElEQVRPUikpIHtcbiAgICB0ZXN0U3VidGFza3MucHVzaCgndmFsaWRhdGUtaHRtbCcpO1xuICB9XG4gIC8vIE9ubHkgcnVuIFNhdWNlIExhYnMgdGVzdHMgaWYgdGhlcmUncyBhIFNhdWNlIGFjY2VzcyBrZXlcbiAgaWYgKHR5cGVvZiBwcm9jZXNzLmVudi5TQVVDRV9BQ0NFU1NfS0VZICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgLy8gU2tpcCBTYXVjZSBpZiBydW5uaW5nIGEgZGlmZmVyZW50IHN1YnNldCBvZiB0aGUgdGVzdCBzdWl0ZVxuICAgICAgcnVuU3Vic2V0KCdzYXVjZS1qcy11bml0JykgJiZcbiAgICAgIC8vIFNraXAgU2F1Y2Ugb24gVHJhdmlzIHdoZW4gW3NraXAgc2F1Y2VdIGlzIGluIHRoZSBjb21taXQgbWVzc2FnZVxuICAgICAgaXNVbmRlZk9yTm9uWmVybyhwcm9jZXNzLmVudi5UV0JTX0RPX1NBVUNFKSkge1xuICAgIHRlc3RTdWJ0YXNrcy5wdXNoKCdiYWJlbDpkZXYnKTtcbiAgICB0ZXN0U3VidGFza3MucHVzaCgnY29ubmVjdCcpO1xuICAgIHRlc3RTdWJ0YXNrcy5wdXNoKCdzYXVjZWxhYnMtcXVuaXQnKTtcbiAgfVxuICBncnVudC5yZWdpc3RlclRhc2soJ3Rlc3QnLCB0ZXN0U3VidGFza3MpO1xuICBncnVudC5yZWdpc3RlclRhc2soJ3Rlc3QtanMnLCBbJ2VzbGludCcsICdqc2NzOmNvcmUnLCAnanNjczp0ZXN0JywgJ2pzY3M6Z3J1bnQnLCAncXVuaXQnXSk7XG5cbiAgLy8gSlMgZGlzdHJpYnV0aW9uIHRhc2suXG4gIGdydW50LnJlZ2lzdGVyVGFzaygnZGlzdC1qcycsIFsnYmFiZWw6ZGV2JywgJ2NvbmNhdCcsICdsaW5lcmVtb3ZlcicsICdiYWJlbDpkaXN0JywgJ3N0YW1wJywgJ3VnbGlmeTpjb3JlJywgJ2NvbW1vbmpzJ10pO1xuXG4gIGdydW50LnJlZ2lzdGVyVGFzaygndGVzdC1zY3NzJywgWydzY3NzbGludCddKTtcblxuICAvLyBDU1MgZGlzdHJpYnV0aW9uIHRhc2suXG4gIC8vIFN1cHBvcnRlZCBDb21waWxlcnM6IHNhc3MgKFJ1YnkpIGFuZCBsaWJzYXNzLlxuICAoZnVuY3Rpb24gKHNhc3NDb21waWxlck5hbWUpIHtcbiAgICByZXF1aXJlKCcuL2dydW50L2JzLXNhc3MtY29tcGlsZS8nICsgc2Fzc0NvbXBpbGVyTmFtZSArICcuanMnKShncnVudCk7XG4gIH0pKHByb2Nlc3MuZW52LlRXQlNfU0FTUyB8fCAnbGlic2FzcycpO1xuICAvLyBncnVudC5yZWdpc3RlclRhc2soJ3Nhc3MtY29tcGlsZScsIFsnc2Fzczpjb3JlJywgJ3Nhc3M6ZXh0cmFzJywgJ3Nhc3M6ZG9jcyddKTtcbiAgZ3J1bnQucmVnaXN0ZXJUYXNrKCdzYXNzLWNvbXBpbGUnLCBbJ3Nhc3M6Y29yZScsICdzYXNzOmRvY3MnXSk7XG5cbiAgZ3J1bnQucmVnaXN0ZXJUYXNrKCdkaXN0LWNzcycsIFsnc2Fzcy1jb21waWxlJywgJ3Bvc3Rjc3M6Y29yZScsICdjc3Njb21iOmRpc3QnLCAnY3NzbWluOmNvcmUnLCAnY3NzbWluOmRvY3MnXSk7XG5cbiAgLy8gRnVsbCBkaXN0cmlidXRpb24gdGFzay5cbiAgZ3J1bnQucmVnaXN0ZXJUYXNrKCdkaXN0JywgWydjbGVhbjpkaXN0JywgJ2Rpc3QtY3NzJywgJ2Rpc3QtanMnXSk7XG5cbiAgLy8gRGVmYXVsdCB0YXNrLlxuICBncnVudC5yZWdpc3RlclRhc2soJ2RlZmF1bHQnLCBbJ2NsZWFuOmRpc3QnLCAndGVzdCddKTtcblxuICBncnVudC5yZWdpc3RlclRhc2soJ2NvbW1vbmpzJywgWydiYWJlbDp1bWQnLCAnbnBtLWpzJ10pO1xuXG4gIGdydW50LnJlZ2lzdGVyVGFzaygnbnBtLWpzJywgJ0dlbmVyYXRlIG5wbS1qcyBlbnRyeXBvaW50IG1vZHVsZSBpbiBkaXN0IGRpci4nLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNyY0ZpbGVzID0gT2JqZWN0LmtleXMoZ3J1bnQuY29uZmlnLmdldCgnYmFiZWwudW1kLmZpbGVzJykpLm1hcChmdW5jdGlvbiAoZmlsZW5hbWUpIHtcbiAgICAgIHJldHVybiAnLi8nICsgcGF0aC5qb2luKCd1bWQnLCBwYXRoLmJhc2VuYW1lKGZpbGVuYW1lKSlcbiAgICB9KVxuICAgIHZhciBkZXN0RmlsZXBhdGggPSAnZGlzdC9qcy9ucG0uanMnO1xuICAgIGdlbmVyYXRlQ29tbW9uSlNNb2R1bGUoZ3J1bnQsIHNyY0ZpbGVzLCBkZXN0RmlsZXBhdGgpO1xuICB9KTtcblxuICAvLyBEb2NzIHRhc2suXG4gIGdydW50LnJlZ2lzdGVyVGFzaygnZG9jcy1jc3MnLCBbJ3Bvc3Rjc3M6ZG9jcycsICdwb3N0Y3NzOmV4YW1wbGVzJywgJ2Nzc2NvbWI6ZG9jcycsICdjc3Njb21iOmV4YW1wbGVzJywgJ2Nzc21pbjpkb2NzJ10pO1xuICBncnVudC5yZWdpc3RlclRhc2soJ2RvY3MtanMnLCBbJ3VnbGlmeTpkb2NzSnMnXSk7XG4gIGdydW50LnJlZ2lzdGVyVGFzaygnbGludC1kb2NzLWpzJywgWydqc2NzOmFzc2V0cyddKTtcbiAgZ3J1bnQucmVnaXN0ZXJUYXNrKCdkb2NzJywgWydkb2NzLWNzcycsICdkb2NzLWpzJywgJ2xpbnQtZG9jcy1qcycsICdjbGVhbjpkb2NzJywgJ2NvcHk6ZG9jcyddKTtcbiAgZ3J1bnQucmVnaXN0ZXJUYXNrKCdkb2NzLWdpdGh1YicsIFsnamVreWxsOmdpdGh1YicsICdodG1sbWluJ10pO1xuXG4gIGdydW50LnJlZ2lzdGVyVGFzaygncHJlcC1yZWxlYXNlJywgWydkaXN0JywgJ2RvY3MnLCAnZG9jcy1naXRodWInLCAnY29tcHJlc3MnXSk7XG5cbiAgLy8gUHVibGlzaCB0byBHaXRIdWJcbiAgZ3J1bnQucmVnaXN0ZXJUYXNrKCdwdWJsaXNoJywgWydidWlsZGNvbnRyb2w6cGFnZXMnXSk7XG5cbiAgLy8gVGFzayBmb3IgdXBkYXRpbmcgdGhlIGNhY2hlZCBucG0gcGFja2FnZXMgdXNlZCBieSB0aGUgVHJhdmlzIGJ1aWxkICh3aGljaCBhcmUgY29udHJvbGxlZCBieSB0ZXN0LWluZnJhL25wbS1zaHJpbmt3cmFwLmpzb24pLlxuICAvLyBUaGlzIHRhc2sgc2hvdWxkIGJlIHJ1biBhbmQgdGhlIHVwZGF0ZWQgZmlsZSBzaG91bGQgYmUgY29tbWl0dGVkIHdoZW5ldmVyIEJvb3RzdHJhcCdzIGRlcGVuZGVuY2llcyBjaGFuZ2UuXG4gIGdydW50LnJlZ2lzdGVyVGFzaygndXBkYXRlLXNocmlua3dyYXAnLCBbJ2V4ZWM6bnBtVXBkYXRlJywgJ191cGRhdGUtc2hyaW5rd3JhcCddKTtcbiAgZ3J1bnQucmVnaXN0ZXJUYXNrKCdfdXBkYXRlLXNocmlua3dyYXAnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRvbmUgPSB0aGlzLmFzeW5jKCk7XG4gICAgbnBtU2hyaW5rd3JhcCh7IGRldjogdHJ1ZSwgZGlybmFtZTogX19kaXJuYW1lIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgZ3J1bnQuZmFpbC53YXJuKGVycik7XG4gICAgICB9XG4gICAgICB2YXIgZGVzdCA9ICdncnVudC9ucG0tc2hyaW5rd3JhcC5qc29uJztcbiAgICAgIGZzLnJlbmFtZVN5bmMoJ25wbS1zaHJpbmt3cmFwLmpzb24nLCBkZXN0KTtcbiAgICAgIGdydW50LmxvZy53cml0ZWxuKCdGaWxlICcgKyBkZXN0LmN5YW4gKyAnIHVwZGF0ZWQuJyk7XG4gICAgICBkb25lKCk7XG4gICAgfSk7XG4gIH0pO1xufTtcbiJdfQ==