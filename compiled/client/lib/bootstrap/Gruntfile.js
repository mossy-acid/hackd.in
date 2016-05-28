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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9saWIvYm9vdHN0cmFwL0dydW50ZmlsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFPQSxPQUFPLE9BQVAsR0FBaUIsVUFBVSxLQUFWLEVBQWlCO0FBQ2hDOzs7QUFEZ0M7QUFJaEMsUUFBTSxJQUFOLENBQVcsUUFBWCxHQUFzQixJQUF0QixDQUpnQzs7QUFNaEMsU0FBTyxLQUFQLEdBQWUsVUFBVSxNQUFWLEVBQWtCO0FBQy9CLFdBQU8sT0FBTyxPQUFQLENBQWUsc0JBQWYsRUFBdUMsTUFBdkMsQ0FBUCxDQUQrQjtHQUFsQixDQU5pQjs7QUFVaEMsTUFBSSxLQUFLLFFBQVEsSUFBUixDQUFMLENBVjRCO0FBV2hDLE1BQUksT0FBTyxRQUFRLE1BQVIsQ0FBUCxDQVg0QjtBQVloQyxNQUFJLE9BQU8sUUFBUSxNQUFSLENBQVAsQ0FaNEI7QUFhaEMsTUFBSSxXQUFXLFFBQVEsV0FBUixDQUFYLENBYjRCO0FBY2hDLE1BQUksZ0JBQWdCLFFBQVEsZ0JBQVIsQ0FBaEIsQ0FkNEI7QUFlaEMsTUFBSSxlQUFlLFFBQVEsZ0JBQVIsQ0FBZixDQWY0QjtBQWdCaEMsTUFBSSxlQUFlLFFBQVEsY0FBUixFQUF3QjtBQUN6QyxjQUFVOzs7OztBQUtSLGtCQUxROzs7Ozs7Ozs7QUFjUixtQkFkUTs7Ozs7QUFtQlIsZ0JBbkJRLEVBb0JSLGVBcEJROztBQXNCUixjQXRCUSxFQXVCUixhQXZCUTs7QUF5QlIsaUJBekJRLEVBMEJSLGNBMUJRLEVBMkJSLGFBM0JRLENBQVY7R0FEaUIsQ0FBZixDQWhCNEI7O0FBZ0RoQyxNQUFJLHlCQUF5QixRQUFRLGtDQUFSLENBQXpCLENBaEQ0QjtBQWlEaEMsTUFBSSxlQUFlLE1BQU0sSUFBTixDQUFXLFFBQVgsQ0FBb0IsMkJBQXBCLEVBQWlELEVBQUUsVUFBVSxNQUFWLEVBQW5ELENBQWYsQ0FqRDRCOztBQW1EaEMsU0FBTyxJQUFQLENBQVksYUFBYSxLQUFiLENBQVosQ0FBZ0Ms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LGNBQW5CLEVBQW1DLENBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsYUFBakIsRUFBZ0MsVUFBaEMsQ0FBbkM7OztBQXpnQmdDLE9BNGdCaEMsQ0FBTSxZQUFOLENBQW1CLFNBQW5CLEVBQThCLENBQUMsb0JBQUQsQ0FBOUI7Ozs7QUE1Z0JnQyxPQWdoQmhDLENBQU0sWUFBTixDQUFtQixtQkFBbkIsRUFBd0MsQ0FBQyxnQkFBRCxFQUFtQixvQkFBbkIsQ0FBeEMsRUFoaEJnQztBQWloQmhDLFFBQU0sWUFBTixDQUFtQixvQkFBbkIsRUFBeUMsWUFBWTtBQUNuRCxRQUFJLE9BQU8sS0FBSyxLQUFMLEVBQVAsQ0FEK0M7QUFFbkQsa0JBQWMsRUFBRSxLQUFLLElBQUwsRUFBVyxTQUFTLFNBQVQsRUFBM0IsRUFBaUQsVUFBVSxHQUFWLEVBQWU7QUFDOUQsVUFBSSxHQUFKLEVBQVM7QUFDUCxjQUFNLElBQU4sQ0FBVyxJQUFYLENBQWdCLEdBQWhCLEVBRE87T0FBVDtBQUdBLFVBQUksT0FBTywyQkFBUCxDQUowRDtBQUs5RCxTQUFHLFVBQUgsQ0FBYyxxQkFBZCxFQUFxQyxJQUFyQyxFQUw4RDtBQU05RCxZQUFNLEdBQU4sQ0FBVSxPQUFWLENBQWtCLFVBQVUsS0FBSyxJQUFMLEdBQVksV0FBdEIsQ0FBbEIsQ0FOOEQ7QUFPOUQsYUFQOEQ7S0FBZixDQUFqRCxDQUZtRDtHQUFaLENBQXpDLENBamhCZ0M7Q0FBakIiLCJmaWxlIjoiR3J1bnRmaWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBCb290c3RyYXAncyBHcnVudGZpbGVcbiAqIGh0dHA6Ly9nZXRib290c3RyYXAuY29tXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1IFR3aXR0ZXIsIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZ3J1bnQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8vIEZvcmNlIHVzZSBvZiBVbml4IG5ld2xpbmVzXG4gIGdydW50LnV0aWwubGluZWZlZWQgPSAnXFxuJztcblxuICBSZWdFeHAucXVvdGUgPSBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bLVxcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcbiAgfTtcblxuICB2YXIgZnMgPSByZXF1aXJlKCdmcycpO1xuICB2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgdmFyIGdsb2IgPSByZXF1aXJlKCdnbG9iJyk7XG4gIHZhciBpc1RyYXZpcyA9IHJlcXVpcmUoJ2lzLXRyYXZpcycpO1xuICB2YXIgbnBtU2hyaW5rd3JhcCA9IHJlcXVpcmUoJ25wbS1zaHJpbmt3cmFwJyk7XG4gIHZhciBtcTRIb3ZlclNoaW0gPSByZXF1aXJlKCdtcTQtaG92ZXItc2hpbScpO1xuICB2YXIgYXV0b3ByZWZpeGVyID0gcmVxdWlyZSgnYXV0b3ByZWZpeGVyJykoe1xuICAgIGJyb3dzZXJzOiBbXG4gICAgICAvL1xuICAgICAgLy8gT2ZmaWNpYWwgYnJvd3NlciBzdXBwb3J0IHBvbGljeTpcbiAgICAgIC8vIGh0dHA6Ly92NC1hbHBoYS5nZXRib290c3RyYXAuY29tL2dldHRpbmctc3RhcnRlZC9icm93c2Vycy1kZXZpY2VzLyNzdXBwb3J0ZWQtYnJvd3NlcnNcbiAgICAgIC8vXG4gICAgICAnQ2hyb21lID49IDM1JywgLy8gRXhhY3QgdmVyc2lvbiBudW1iZXIgaGVyZSBpcyBraW5kYSBhcmJpdHJhcnlcbiAgICAgIC8vIFJhdGhlciB0aGFuIHVzaW5nIEF1dG9wcmVmaXhlcidzIG5hdGl2ZSBcIkZpcmVmb3ggRVNSXCIgdmVyc2lvbiBzcGVjaWZpZXIgc3RyaW5nLFxuICAgICAgLy8gd2UgZGVsaWJlcmF0ZWx5IGhhcmRjb2RlIHRoZSBudW1iZXIuIFRoaXMgaXMgdG8gYXZvaWQgdW53aXR0aW5nbHkgc2V2ZXJlbHkgYnJlYWtpbmcgdGhlIHByZXZpb3VzIEVTUiBpbiB0aGUgZXZlbnQgdGhhdDpcbiAgICAgIC8vIChhKSB3ZSBoYXBwZW4gdG8gc2hpcCBhIG5ldyBCb290c3RyYXAgcmVsZWFzZSBzb29uIGFmdGVyIHRoZSByZWxlYXNlIG9mIGEgbmV3IEVTUixcbiAgICAgIC8vICAgICBzdWNoIHRoYXQgZm9sa3MgaGF2ZW4ndCB5ZXQgaGFkIGEgcmVhc29uYWJsZSBhbW91bnQgb2YgdGltZSB0byB1cGdyYWRlOyBhbmRcbiAgICAgIC8vIChiKSB0aGUgbmV3IEVTUiBoYXMgdW5wcmVmaXhlZCBDU1MgcHJvcGVydGllcy92YWx1ZXMgd2hvc2UgYWJzZW5jZSB3b3VsZCBzZXZlcmVseSBicmVhayB3ZWJwYWdlc1xuICAgICAgLy8gICAgIChlLmcuIGBib3gtc2l6aW5nYCwgYXMgb3Bwb3NlZCB0byBgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KC4uLilgKS5cbiAgICAgIC8vICAgICBTaW5jZSB0aGV5J3ZlIGJlZW4gdW5wcmVmaXhlZCwgQXV0b3ByZWZpeGVyIHdpbGwgc3RvcCBwcmVmaXhpbmcgdGhlbSxcbiAgICAgIC8vICAgICB0aHVzIGNhdXNpbmcgdGhlbSB0byBub3Qgd29yayBpbiB0aGUgcHJldmlvdXMgRVNSICh3aGVyZSB0aGUgcHJlZml4ZXMgd2VyZSByZXF1aXJlZCkuXG4gICAgICAnRmlyZWZveCA+PSAzMScsIC8vIEN1cnJlbnQgRmlyZWZveCBFeHRlbmRlZCBTdXBwb3J0IFJlbGVhc2UgKEVTUilcbiAgICAgIC8vIE5vdGU6IEVkZ2UgdmVyc2lvbnMgaW4gQXV0b3ByZWZpeGVyICYgQ2FuIEkgVXNlIHJlZmVyIHRvIHRoZSBFZGdlSFRNTCByZW5kZXJpbmcgZW5naW5lIHZlcnNpb24sXG4gICAgICAvLyBOT1QgdGhlIEVkZ2UgYXBwIHZlcnNpb24gc2hvd24gaW4gRWRnZSdzIFwiQWJvdXRcIiBzY3JlZW4uXG4gICAgICAvLyBGb3IgZXhhbXBsZSwgYXQgdGhlIHRpbWUgb2Ygd3JpdGluZywgRWRnZSAyMCBvbiBhbiB1cC10by1kYXRlIHN5c3RlbSB1c2VzIEVkZ2VIVE1MIDEyLlxuICAgICAgLy8gU2VlIGFsc28gaHR0cHM6Ly9naXRodWIuY29tL0Z5cmQvY2FuaXVzZS9pc3N1ZXMvMTkyOFxuICAgICAgJ0VkZ2UgPj0gMTInLFxuICAgICAgJ0V4cGxvcmVyID49IDknLFxuICAgICAgLy8gT3V0IG9mIGxlbmllbmN5LCB3ZSBwcmVmaXggdGhlc2UgMSB2ZXJzaW9uIGZ1cnRoZXIgYmFjayB0aGFuIHRoZSBvZmZpY2lhbCBwb2xpY3kuXG4gICAgICAnaU9TID49IDgnLFxuICAgICAgJ1NhZmFyaSA+PSA4JyxcbiAgICAgIC8vIFRoZSBmb2xsb3dpbmcgcmVtYWluIE5PVCBvZmZpY2lhbGx5IHN1cHBvcnRlZCwgYnV0IHdlJ3JlIGxlbmllbnQgYW5kIGluY2x1ZGUgdGhlaXIgcHJlZml4ZXMgdG8gYXZvaWQgc2V2ZXJlbHkgYnJlYWtpbmcgaW4gdGhlbS5cbiAgICAgICdBbmRyb2lkIDIuMycsXG4gICAgICAnQW5kcm9pZCA+PSA0JyxcbiAgICAgICdPcGVyYSA+PSAxMidcbiAgICBdXG4gIH0pO1xuXG4gIHZhciBnZW5lcmF0ZUNvbW1vbkpTTW9kdWxlID0gcmVxdWlyZSgnLi9ncnVudC9icy1jb21tb25qcy1nZW5lcmF0b3IuanMnKTtcbiAgdmFyIGNvbmZpZ0JyaWRnZSA9IGdydW50LmZpbGUucmVhZEpTT04oJy4vZ3J1bnQvY29uZmlnQnJpZGdlLmpzb24nLCB7IGVuY29kaW5nOiAndXRmOCcgfSk7XG5cbiAgT2JqZWN0LmtleXMoY29uZmlnQnJpZGdlLnBhdGhzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBjb25maWdCcmlkZ2UucGF0aHNba2V5XS5mb3JFYWNoKGZ1bmN0aW9uICh2YWwsIGksIGFycikge1xuICAgICAgYXJyW2ldID0gcGF0aC5qb2luKCcuL2RvY3MvYXNzZXRzJywgdmFsKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gUHJvamVjdCBjb25maWd1cmF0aW9uLlxuICBncnVudC5pbml0Q29uZmlnKHtcblxuICAgIC8vIE1ldGFkYXRhLlxuICAgIHBrZzogZ3J1bnQuZmlsZS5yZWFkSlNPTigncGFja2FnZS5qc29uJyksXG4gICAgYmFubmVyOiAnLyohXFxuJyArXG4gICAgICAgICAgICAnICogQm9vdHN0cmFwIHY8JT0gcGtnLnZlcnNpb24gJT4gKDwlPSBwa2cuaG9tZXBhZ2UgJT4pXFxuJyArXG4gICAgICAgICAgICAnICogQ29weXJpZ2h0IDIwMTEtPCU9IGdydW50LnRlbXBsYXRlLnRvZGF5KFwieXl5eVwiKSAlPiA8JT0gcGtnLmF1dGhvciAlPlxcbicgK1xuICAgICAgICAgICAgJyAqIExpY2Vuc2VkIHVuZGVyIE1JVCAoaHR0cHM6Ly9naXRodWIuY29tL3R3YnMvYm9vdHN0cmFwL2Jsb2IvbWFzdGVyL0xJQ0VOU0UpXFxuJyArXG4gICAgICAgICAgICAnICovXFxuJyxcbiAgICBqcXVlcnlDaGVjazogJ2lmICh0eXBlb2YgalF1ZXJ5ID09PSBcXCd1bmRlZmluZWRcXCcpIHtcXG4nICtcbiAgICAgICAgICAgICAgICAgJyAgdGhyb3cgbmV3IEVycm9yKFxcJ0Jvb3RzdHJhcFxcXFxcXCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgalF1ZXJ5XFwnKVxcbicgK1xuICAgICAgICAgICAgICAgICAnfVxcbicsXG4gICAganF1ZXJ5VmVyc2lvbkNoZWNrOiAnK2Z1bmN0aW9uICgkKSB7XFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnICB2YXIgdmVyc2lvbiA9ICQuZm4uanF1ZXJ5LnNwbGl0KFxcJyBcXCcpWzBdLnNwbGl0KFxcJy5cXCcpXFxuJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnICBpZiAoKHZlcnNpb25bMF0gPCAyICYmIHZlcnNpb25bMV0gPCA5KSB8fCAodmVyc2lvblswXSA9PSAxICYmIHZlcnNpb25bMV0gPT0gOSAmJiB2ZXJzaW9uWzJdIDwgMSkgfHwgKHZlcnNpb25bMF0gPj0gMykpIHtcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICcgICAgdGhyb3cgbmV3IEVycm9yKFxcJ0Jvb3RzdHJhcFxcXFxcXCdzIEphdmFTY3JpcHQgcmVxdWlyZXMgYXQgbGVhc3QgalF1ZXJ5IHYxLjkuMSBidXQgbGVzcyB0aGFuIHYzLjAuMFxcJylcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICcgIH1cXG4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICd9KGpRdWVyeSk7XFxuXFxuJyxcblxuICAgIC8vIFRhc2sgY29uZmlndXJhdGlvbi5cbiAgICBjbGVhbjoge1xuICAgICAgZGlzdDogJ2Rpc3QnLFxuICAgICAgZG9jczogJ2RvY3MvZGlzdCdcbiAgICB9LFxuXG4gICAgLy8gSlMgYnVpbGQgY29uZmlndXJhdGlvblxuICAgIGxpbmVyZW1vdmVyOiB7XG4gICAgICBlczZJbXBvcnQ6IHtcbiAgICAgICAgZmlsZXM6IHtcbiAgICAgICAgICAnPCU9IGNvbmNhdC5ib290c3RyYXAuZGVzdCAlPic6ICc8JT0gY29uY2F0LmJvb3RzdHJhcC5kZXN0ICU+J1xuICAgICAgICB9LFxuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgZXhjbHVzaW9uUGF0dGVybjogL14oaW1wb3J0fGV4cG9ydCkvZ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGJhYmVsOiB7XG4gICAgICBkZXY6IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIHNvdXJjZU1hcDogdHJ1ZSxcbiAgICAgICAgICBtb2R1bGVzOiAnaWdub3JlJ1xuICAgICAgICB9LFxuICAgICAgICBmaWxlczoge1xuICAgICAgICAgICdqcy9kaXN0L3V0aWwuanMnICAgICAgOiAnanMvc3JjL3V0aWwuanMnLFxuICAgICAgICAgICdqcy9kaXN0L2FsZXJ0LmpzJyAgICAgOiAnanMvc3JjL2FsZXJ0LmpzJyxcbiAgICAgICAgICAnanMvZGlzdC9idXR0b24uanMnICAgIDogJ2pzL3NyYy9idXR0b24uanMnLFxuICAgICAgICAgICdqcy9kaXN0L2Nhcm91c2VsLmpzJyAgOiAnanMvc3JjL2Nhcm91c2VsLmpzJyxcbiAgICAgICAgICAnanMvZGlzdC9jb2xsYXBzZS5qcycgIDogJ2pzL3NyYy9jb2xsYXBzZS5qcycsXG4gICAgICAgICAgJ2pzL2Rpc3QvZHJvcGRvd24uanMnICA6ICdqcy9zcmMvZHJvcGRvd24uanMnLFxuICAgICAgICAgICdqcy9kaXN0L21vZGFsLmpzJyAgICAgOiAnanMvc3JjL21vZGFsLmpzJyxcbiAgICAgICAgICAnanMvZGlzdC9zY3JvbGxzcHkuanMnIDogJ2pzL3NyYy9zY3JvbGxzcHkuanMnLFxuICAgICAgICAgICdqcy9kaXN0L3RhYi5qcycgICAgICAgOiAnanMvc3JjL3RhYi5qcycsXG4gICAgICAgICAgJ2pzL2Rpc3QvdG9vbHRpcC5qcycgICA6ICdqcy9zcmMvdG9vbHRpcC5qcycsXG4gICAgICAgICAgJ2pzL2Rpc3QvcG9wb3Zlci5qcycgICA6ICdqcy9zcmMvcG9wb3Zlci5qcydcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRpc3Q6IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIG1vZHVsZXM6ICdpZ25vcmUnXG4gICAgICAgIH0sXG4gICAgICAgIGZpbGVzOiB7XG4gICAgICAgICAgJzwlPSBjb25jYXQuYm9vdHN0cmFwLmRlc3QgJT4nIDogJzwlPSBjb25jYXQuYm9vdHN0cmFwLmRlc3QgJT4nXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB1bWQ6IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIG1vZHVsZXM6ICd1bWQnXG4gICAgICAgIH0sXG4gICAgICAgIGZpbGVzOiB7XG4gICAgICAgICAgJ2Rpc3QvanMvdW1kL3V0aWwuanMnICAgICAgOiAnanMvc3JjL3V0aWwuanMnLFxuICAgICAgICAgICdkaXN0L2pzL3VtZC9hbGVydC5qcycgICAgIDogJ2pzL3NyYy9hbGVydC5qcycsXG4gICAgICAgICAgJ2Rpc3QvanMvdW1kL2J1dHRvbi5qcycgICAgOiAnanMvc3JjL2J1dHRvbi5qcycsXG4gICAgICAgICAgJ2Rpc3QvanMvdW1kL2Nhcm91c2VsLmpzJyAgOiAnanMvc3JjL2Nhcm91c2VsLmpzJyxcbiAgICAgICAgICAnZGlzdC9qcy91bWQvY29sbGFwc2UuanMnICA6ICdqcy9zcmMvY29sbGFwc2UuanMnLFxuICAgICAgICAgICdkaXN0L2pzL3VtZC9kcm9wZG93bi5qcycgIDogJ2pzL3NyYy9kcm9wZG93bi5qcycsXG4gICAgICAgICAgJ2Rpc3QvanMvdW1kL21vZGFsLmpzJyAgICAgOiAnanMvc3JjL21vZGFsLmpzJyxcbiAgICAgICAgICAnZGlzdC9qcy91bWQvc2Nyb2xsc3B5LmpzJyA6ICdqcy9zcmMvc2Nyb2xsc3B5LmpzJyxcbiAgICAgICAgICAnZGlzdC9qcy91bWQvdGFiLmpzJyAgICAgICA6ICdqcy9zcmMvdGFiLmpzJyxcbiAgICAgICAgICAnZGlzdC9qcy91bWQvdG9vbHRpcC5qcycgICA6ICdqcy9zcmMvdG9vbHRpcC5qcycsXG4gICAgICAgICAgJ2Rpc3QvanMvdW1kL3BvcG92ZXIuanMnICAgOiAnanMvc3JjL3BvcG92ZXIuanMnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZXNsaW50OiB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGNvbmZpZ0ZpbGU6ICdqcy8uZXNsaW50cmMnXG4gICAgICB9LFxuICAgICAgdGFyZ2V0OiAnanMvc3JjLyouanMnXG4gICAgfSxcblxuICAgIGpzY3M6IHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgY29uZmlnOiAnanMvLmpzY3NyYydcbiAgICAgIH0sXG4gICAgICBncnVudDoge1xuICAgICAgICBzcmM6IFsnR3J1bnRmaWxlLmpzJywgJ2dydW50LyouanMnXVxuICAgICAgfSxcbiAgICAgIGNvcmU6IHtcbiAgICAgICAgc3JjOiAnanMvc3JjLyouanMnXG4gICAgICB9LFxuICAgICAgdGVzdDoge1xuICAgICAgICBzcmM6ICdqcy90ZXN0cy91bml0LyouanMnXG4gICAgICB9LFxuICAgICAgYXNzZXRzOiB7XG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICByZXF1aXJlQ2FtZWxDYXNlT3JVcHBlckNhc2VJZGVudGlmaWVyczogbnVsbFxuICAgICAgICB9LFxuICAgICAgICBzcmM6IFsnZG9jcy9hc3NldHMvanMvc3JjLyouanMnLCAnZG9jcy9hc3NldHMvanMvKi5qcycsICchZG9jcy9hc3NldHMvanMvKi5taW4uanMnXVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGFtcDoge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBiYW5uZXI6ICc8JT0gYmFubmVyICU+XFxuPCU9IGpxdWVyeUNoZWNrICU+XFxuPCU9IGpxdWVyeVZlcnNpb25DaGVjayAlPlxcbitmdW5jdGlvbiAoJCkge1xcbicsXG4gICAgICAgIGZvb3RlcjogJ1xcbn0oalF1ZXJ5KTsnXG4gICAgICB9LFxuICAgICAgYm9vdHN0cmFwOiB7XG4gICAgICAgIGZpbGVzOiB7XG4gICAgICAgICAgc3JjOiAnPCU9IGNvbmNhdC5ib290c3RyYXAuZGVzdCAlPidcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBjb25jYXQ6IHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgc3RyaXBCYW5uZXJzOiBmYWxzZVxuICAgICAgfSxcbiAgICAgIGJvb3RzdHJhcDoge1xuICAgICAgICBzcmM6IFtcbiAgICAgICAgICAnanMvc3JjL3V0aWwuanMnLFxuICAgICAgICAgICdqcy9zcmMvYWxlcnQuanMnLFxuICAgICAgICAgICdqcy9zcmMvYnV0dG9uLmpzJyxcbiAgICAgICAgICAnanMvc3JjL2Nhcm91c2VsLmpzJyxcbiAgICAgICAgICAnanMvc3JjL2NvbGxhcHNlLmpzJyxcbiAgICAgICAgICAnanMvc3JjL2Ryb3Bkb3duLmpzJyxcbiAgICAgICAgICAnanMvc3JjL21vZGFsLmpzJyxcbiAgICAgICAgICAnanMvc3JjL3Njcm9sbHNweS5qcycsXG4gICAgICAgICAgJ2pzL3NyYy90YWIuanMnLFxuICAgICAgICAgICdqcy9zcmMvdG9vbHRpcC5qcycsXG4gICAgICAgICAgJ2pzL3NyYy9wb3BvdmVyLmpzJ1xuICAgICAgICBdLFxuICAgICAgICBkZXN0OiAnZGlzdC9qcy88JT0gcGtnLm5hbWUgJT4uanMnXG4gICAgICB9XG4gICAgfSxcblxuICAgIHVnbGlmeToge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBjb21wcmVzczoge1xuICAgICAgICAgIHdhcm5pbmdzOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBtYW5nbGU6IHRydWUsXG4gICAgICAgIHByZXNlcnZlQ29tbWVudHM6IC9eIXxAcHJlc2VydmV8QGxpY2Vuc2V8QGNjX29uL2lcbiAgICAgIH0sXG4gICAgICBjb3JlOiB7XG4gICAgICAgIHNyYzogJzwlPSBjb25jYXQuYm9vdHN0cmFwLmRlc3QgJT4nLFxuICAgICAgICBkZXN0OiAnZGlzdC9qcy88JT0gcGtnLm5hbWUgJT4ubWluLmpzJ1xuICAgICAgfSxcbiAgICAgIGRvY3NKczoge1xuICAgICAgICBzcmM6IGNvbmZpZ0JyaWRnZS5wYXRocy5kb2NzSnMsXG4gICAgICAgIGRlc3Q6ICdkb2NzL2Fzc2V0cy9qcy9kb2NzLm1pbi5qcydcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgcXVuaXQ6IHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgaW5qZWN0OiAnanMvdGVzdHMvdW5pdC9waGFudG9tLmpzJ1xuICAgICAgfSxcbiAgICAgIGZpbGVzOiAnanMvdGVzdHMvaW5kZXguaHRtbCdcbiAgICB9LFxuXG4gICAgLy8gQ1NTIGJ1aWxkIGNvbmZpZ3VyYXRpb25cbiAgICBzY3NzbGludDoge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBidW5kbGVFeGVjOiB0cnVlLFxuICAgICAgICBjb25maWc6ICdzY3NzLy5zY3NzLWxpbnQueW1sJyxcbiAgICAgICAgcmVwb3J0ZXJPdXRwdXQ6IG51bGxcbiAgICAgIH0sXG4gICAgICBzcmM6IFsnc2Nzcy8qLnNjc3MnLCAnIXNjc3MvX25vcm1hbGl6ZS5zY3NzJ11cbiAgICB9LFxuXG4gICAgcG9zdGNzczoge1xuICAgICAgY29yZToge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgbWFwOiB0cnVlLFxuICAgICAgICAgIHByb2Nlc3NvcnM6IFtcbiAgICAgICAgICAgIG1xNEhvdmVyU2hpbS5wb3N0cHJvY2Vzc29yRm9yKHsgaG92ZXJTZWxlY3RvclByZWZpeDogJy5icy10cnVlLWhvdmVyICcgfSksXG4gICAgICAgICAgICBhdXRvcHJlZml4ZXJcbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHNyYzogJ2Rpc3QvY3NzLyouY3NzJ1xuICAgICAgfSxcbiAgICAgIGRvY3M6IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIHByb2Nlc3NvcnM6IFtcbiAgICAgICAgICAgIGF1dG9wcmVmaXhlclxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgc3JjOiAnZG9jcy9hc3NldHMvY3NzL2RvY3MubWluLmNzcydcbiAgICAgIH0sXG4gICAgICBleGFtcGxlczoge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgcHJvY2Vzc29yczogW1xuICAgICAgICAgICAgYXV0b3ByZWZpeGVyXG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICBleHBhbmQ6IHRydWUsXG4gICAgICAgIGN3ZDogJ2RvY3MvZXhhbXBsZXMvJyxcbiAgICAgICAgc3JjOiBbJyoqLyouY3NzJ10sXG4gICAgICAgIGRlc3Q6ICdkb2NzL2V4YW1wbGVzLydcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY3NzbWluOiB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIC8vIFRPRE86IGRpc2FibGUgYHplcm9Vbml0c2Agb3B0aW1pemF0aW9uIG9uY2UgY2xlYW4tY3NzIDMuMiBpcyByZWxlYXNlZFxuICAgICAgICAvLyAgICBhbmQgdGhlbiBzaW1wbGlmeSB0aGUgZml4IGZvciBodHRwczovL2dpdGh1Yi5jb20vdHdicy9ib290c3RyYXAvaXNzdWVzLzE0ODM3IGFjY29yZGluZ2x5XG4gICAgICAgIGNvbXBhdGliaWxpdHk6ICdpZTknLFxuICAgICAgICBrZWVwU3BlY2lhbENvbW1lbnRzOiAnKicsXG4gICAgICAgIHNvdXJjZU1hcDogdHJ1ZSxcbiAgICAgICAgYWR2YW5jZWQ6IGZhbHNlXG4gICAgICB9LFxuICAgICAgY29yZToge1xuICAgICAgICBmaWxlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGV4cGFuZDogdHJ1ZSxcbiAgICAgICAgICAgIGN3ZDogJ2Rpc3QvY3NzJyxcbiAgICAgICAgICAgIHNyYzogWycqLmNzcycsICchKi5taW4uY3NzJ10sXG4gICAgICAgICAgICBkZXN0OiAnZGlzdC9jc3MnLFxuICAgICAgICAgICAgZXh0OiAnLm1pbi5jc3MnXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgZG9jczoge1xuICAgICAgICBzcmM6ICdkb2NzL2Fzc2V0cy9jc3MvZG9jcy5taW4uY3NzJyxcbiAgICAgICAgZGVzdDogJ2RvY3MvYXNzZXRzL2Nzcy9kb2NzLm1pbi5jc3MnXG4gICAgICB9XG4gICAgfSxcblxuICAgIGNzc2NvbWI6IHtcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgY29uZmlnOiAnc2Nzcy8uY3NzY29tYi5qc29uJ1xuICAgICAgfSxcbiAgICAgIGRpc3Q6IHtcbiAgICAgICAgZXhwYW5kOiB0cnVlLFxuICAgICAgICBjd2Q6ICdkaXN0L2Nzcy8nLFxuICAgICAgICBzcmM6IFsnKi5jc3MnLCAnISoubWluLmNzcyddLFxuICAgICAgICBkZXN0OiAnZGlzdC9jc3MvJ1xuICAgICAgfSxcbiAgICAgIGV4YW1wbGVzOiB7XG4gICAgICAgIGV4cGFuZDogdHJ1ZSxcbiAgICAgICAgY3dkOiAnZG9jcy9leGFtcGxlcy8nLFxuICAgICAgICBzcmM6ICcqKi8qLmNzcycsXG4gICAgICAgIGRlc3Q6ICdkb2NzL2V4YW1wbGVzLydcbiAgICAgIH0sXG4gICAgICBkb2NzOiB7XG4gICAgICAgIHNyYzogJ2RvY3MvYXNzZXRzL2Nzcy9zcmMvZG9jcy5jc3MnLFxuICAgICAgICBkZXN0OiAnZG9jcy9hc3NldHMvY3NzL3NyYy9kb2NzLmNzcydcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY29weToge1xuICAgICAgZG9jczoge1xuICAgICAgICBleHBhbmQ6IHRydWUsXG4gICAgICAgIGN3ZDogJ2Rpc3QvJyxcbiAgICAgICAgc3JjOiBbXG4gICAgICAgICAgJyoqLyonXG4gICAgICAgIF0sXG4gICAgICAgIGRlc3Q6ICdkb2NzL2Rpc3QvJ1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjb25uZWN0OiB7XG4gICAgICBzZXJ2ZXI6IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIHBvcnQ6IDMwMDAsXG4gICAgICAgICAgYmFzZTogJy4nXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgamVreWxsOiB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGJ1bmRsZUV4ZWM6IHRydWUsXG4gICAgICAgIGNvbmZpZzogJ19jb25maWcueW1sJyxcbiAgICAgICAgaW5jcmVtZW50YWw6IGZhbHNlXG4gICAgICB9LFxuICAgICAgZG9jczoge30sXG4gICAgICBnaXRodWI6IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIHJhdzogJ2dpdGh1YjogdHJ1ZSdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBodG1sbGludDoge1xuICAgICAgb3B0aW9uczoge1xuICAgICAgICBpZ25vcmU6IFtcbiAgICAgICAgICAnRWxlbWVudCDigJxpbWfigJ0gaXMgbWlzc2luZyByZXF1aXJlZCBhdHRyaWJ1dGUg4oCcc3Jj4oCdLicsXG4gICAgICAgICAgJ0F0dHJpYnV0ZSDigJxhdXRvY29tcGxldGXigJ0gaXMgb25seSBhbGxvd2VkIHdoZW4gdGhlIGlucHV0IHR5cGUgaXMg4oCcY29sb3LigJ0sIOKAnGRhdGXigJ0sIOKAnGRhdGV0aW1l4oCdLCDigJxkYXRldGltZS1sb2NhbOKAnSwg4oCcZW1haWzigJ0sIOKAnG1vbnRo4oCdLCDigJxudW1iZXLigJ0sIOKAnHBhc3N3b3Jk4oCdLCDigJxyYW5nZeKAnSwg4oCcc2VhcmNo4oCdLCDigJx0ZWzigJ0sIOKAnHRleHTigJ0sIOKAnHRpbWXigJ0sIOKAnHVybOKAnSwgb3Ig4oCcd2Vla+KAnS4nLFxuICAgICAgICAgICdBdHRyaWJ1dGUg4oCcYXV0b2NvbXBsZXRl4oCdIG5vdCBhbGxvd2VkIG9uIGVsZW1lbnQg4oCcYnV0dG9u4oCdIGF0IHRoaXMgcG9pbnQuJyxcbiAgICAgICAgICAnRWxlbWVudCDigJxkaXbigJ0gbm90IGFsbG93ZWQgYXMgY2hpbGQgb2YgZWxlbWVudCDigJxwcm9ncmVzc+KAnSBpbiB0aGlzIGNvbnRleHQuIChTdXBwcmVzc2luZyBmdXJ0aGVyIGVycm9ycyBmcm9tIHRoaXMgc3VidHJlZS4pJyxcbiAgICAgICAgICAnQ29uc2lkZXIgdXNpbmcgdGhlIOKAnGgx4oCdIGVsZW1lbnQgYXMgYSB0b3AtbGV2ZWwgaGVhZGluZyBvbmx5IChhbGwg4oCcaDHigJ0gZWxlbWVudHMgYXJlIHRyZWF0ZWQgYXMgdG9wLWxldmVsIGhlYWRpbmdzIGJ5IG1hbnkgc2NyZWVuIHJlYWRlcnMgYW5kIG90aGVyIHRvb2xzKS4nLFxuICAgICAgICAgICdUaGUg4oCcZGF0ZXRpbWXigJ0gaW5wdXQgdHlwZSBpcyBub3Qgc3VwcG9ydGVkIGluIGFsbCBicm93c2Vycy4gUGxlYXNlIGJlIHN1cmUgdG8gdGVzdCwgYW5kIGNvbnNpZGVyIHVzaW5nIGEgcG9seWZpbGwuJ1xuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgc3JjOiBbJ19naF9wYWdlcy8qKi8qLmh0bWwnLCAnanMvdGVzdHMvdmlzdWFsLyouaHRtbCddXG4gICAgfSxcblxuICAgIHdhdGNoOiB7XG4gICAgICBzcmM6IHtcbiAgICAgICAgZmlsZXM6ICc8JT0ganNjcy5jb3JlLnNyYyAlPicsXG4gICAgICAgIHRhc2tzOiBbJ2JhYmVsOmRldiddXG4gICAgICB9LFxuICAgICAgc2Fzczoge1xuICAgICAgICBmaWxlczogJ3Njc3MvKiovKi5zY3NzJyxcbiAgICAgICAgdGFza3M6IFsnZGlzdC1jc3MnLCAnZG9jcyddXG4gICAgICB9LFxuICAgICAgZG9jczoge1xuICAgICAgICBmaWxlczogJ2RvY3MvYXNzZXRzL3Njc3MvKiovKi5zY3NzJyxcbiAgICAgICAgdGFza3M6IFsnZGlzdC1jc3MnLCAnZG9jcyddXG4gICAgICB9XG4gICAgfSxcblxuICAgICdzYXVjZWxhYnMtcXVuaXQnOiB7XG4gICAgICBhbGw6IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIGJ1aWxkOiBwcm9jZXNzLmVudi5UUkFWSVNfSk9CX0lELFxuICAgICAgICAgIGNvbmN1cnJlbmN5OiAxMCxcbiAgICAgICAgICBtYXhSZXRyaWVzOiAzLFxuICAgICAgICAgIG1heFBvbGxSZXRyaWVzOiA0LFxuICAgICAgICAgIHVybHM6IFsnaHR0cDovLzEyNy4wLjAuMTozMDAwL2pzL3Rlc3RzL2luZGV4Lmh0bWw/aGlkZXBhc3NlZCddLFxuICAgICAgICAgIGJyb3dzZXJzOiBncnVudC5maWxlLnJlYWRZQU1MKCdncnVudC9zYXVjZV9icm93c2Vycy55bWwnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGV4ZWM6IHtcbiAgICAgIG5wbVVwZGF0ZToge1xuICAgICAgICBjb21tYW5kOiAnbnBtIHVwZGF0ZSdcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYnVpbGRjb250cm9sOiB7XG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGRpcjogJ19naF9wYWdlcycsXG4gICAgICAgIGNvbW1pdDogdHJ1ZSxcbiAgICAgICAgcHVzaDogdHJ1ZSxcbiAgICAgICAgbWVzc2FnZTogJ0J1aWx0ICVzb3VyY2VOYW1lJSBmcm9tIGNvbW1pdCAlc291cmNlQ29tbWl0JSBvbiBicmFuY2ggJXNvdXJjZUJyYW5jaCUnXG4gICAgICB9LFxuICAgICAgcGFnZXM6IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIHJlbW90ZTogJ2dpdEBnaXRodWIuY29tOnR3YnMvZGVycHN0cmFwLmdpdCcsXG4gICAgICAgICAgYnJhbmNoOiAnZ2gtcGFnZXMnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY29tcHJlc3M6IHtcbiAgICAgIG1haW46IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIGFyY2hpdmU6ICdib290c3RyYXAtPCU9IHBrZy52ZXJzaW9uICU+LWRpc3QuemlwJyxcbiAgICAgICAgICBtb2RlOiAnemlwJyxcbiAgICAgICAgICBsZXZlbDogOSxcbiAgICAgICAgICBwcmV0dHk6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgZmlsZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBleHBhbmQ6IHRydWUsXG4gICAgICAgICAgICBjd2Q6ICdkaXN0LycsXG4gICAgICAgICAgICBzcmM6IFsnKionXSxcbiAgICAgICAgICAgIGRlc3Q6ICdib290c3RyYXAtPCU9IHBrZy52ZXJzaW9uICU+LWRpc3QnXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfVxuXG4gIH0pO1xuXG5cbiAgLy8gVGhlc2UgcGx1Z2lucyBwcm92aWRlIG5lY2Vzc2FyeSB0YXNrcy5cbiAgcmVxdWlyZSgnbG9hZC1ncnVudC10YXNrcycpKGdydW50LCB7IHNjb3BlOiAnZGV2RGVwZW5kZW5jaWVzJyxcbiAgICAvLyBFeGNsdWRlIFNhc3MgY29tcGlsZXJzLiBXZSBjaG9vc2UgdGhlIG9uZSB0byBsb2FkIGxhdGVyIG9uLlxuICAgIHBhdHRlcm46IFsnZ3J1bnQtKicsICchZ3J1bnQtc2FzcycsICchZ3J1bnQtY29udHJpYi1zYXNzJ10gfSk7XG4gIHJlcXVpcmUoJ3RpbWUtZ3J1bnQnKShncnVudCk7XG5cbiAgLy8gRG9jcyBIVE1MIHZhbGlkYXRpb24gdGFza1xuICBncnVudC5yZWdpc3RlclRhc2soJ3ZhbGlkYXRlLWh0bWwnLCBbJ2pla3lsbDpkb2NzJywgJ2h0bWxsaW50J10pO1xuXG4gIHZhciBydW5TdWJzZXQgPSBmdW5jdGlvbiAoc3Vic2V0KSB7XG4gICAgcmV0dXJuICFwcm9jZXNzLmVudi5UV0JTX1RFU1QgfHwgcHJvY2Vzcy5lbnYuVFdCU19URVNUID09PSBzdWJzZXQ7XG4gIH07XG4gIHZhciBpc1VuZGVmT3JOb25aZXJvID0gZnVuY3Rpb24gKHZhbCkge1xuICAgIHJldHVybiB2YWwgPT09IHVuZGVmaW5lZCB8fCB2YWwgIT09ICcwJztcbiAgfTtcblxuICAvLyBUZXN0IHRhc2suXG4gIHZhciB0ZXN0U3VidGFza3MgPSBbXTtcbiAgLy8gU2tpcCBjb3JlIHRlc3RzIGlmIHJ1bm5pbmcgYSBkaWZmZXJlbnQgc3Vic2V0IG9mIHRoZSB0ZXN0IHN1aXRlXG4gIGlmIChydW5TdWJzZXQoJ2NvcmUnKSAmJlxuICAgIC8vIFNraXAgY29yZSB0ZXN0cyBpZiB0aGlzIGlzIGEgU2F2YWdlIGJ1aWxkXG4gICAgcHJvY2Vzcy5lbnYuVFJBVklTX1JFUE9fU0xVRyAhPT0gJ3R3YnMtc2F2YWdlL2Jvb3RzdHJhcCcpIHtcbiAgICB0ZXN0U3VidGFza3MgPSB0ZXN0U3VidGFza3MuY29uY2F0KFsnZGlzdC1jc3MnLCAnZGlzdC1qcycsICd0ZXN0LXNjc3MnLCAndGVzdC1qcycsICdkb2NzJ10pO1xuICB9XG4gIC8vIFNraXAgSFRNTCB2YWxpZGF0aW9uIGlmIHJ1bm5pbmcgYSBkaWZmZXJlbnQgc3Vic2V0IG9mIHRoZSB0ZXN0IHN1aXRlXG4gIGlmIChydW5TdWJzZXQoJ3ZhbGlkYXRlLWh0bWwnKSAmJlxuICAgICAgaXNUcmF2aXMgJiZcbiAgICAgIC8vIFNraXAgSFRNTDUgdmFsaWRhdG9yIHdoZW4gW3NraXAgdmFsaWRhdG9yXSBpcyBpbiB0aGUgY29tbWl0IG1lc3NhZ2VcbiAgICAgIGlzVW5kZWZPck5vblplcm8ocHJvY2Vzcy5lbnYuVFdCU19ET19WQUxJREFUT1IpKSB7XG4gICAgdGVzdFN1YnRhc2tzLnB1c2goJ3ZhbGlkYXRlLWh0bWwnKTtcbiAgfVxuICAvLyBPbmx5IHJ1biBTYXVjZSBMYWJzIHRlc3RzIGlmIHRoZXJlJ3MgYSBTYXVjZSBhY2Nlc3Mga2V5XG4gIGlmICh0eXBlb2YgcHJvY2Vzcy5lbnYuU0FVQ0VfQUNDRVNTX0tFWSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIC8vIFNraXAgU2F1Y2UgaWYgcnVubmluZyBhIGRpZmZlcmVudCBzdWJzZXQgb2YgdGhlIHRlc3Qgc3VpdGVcbiAgICAgIHJ1blN1YnNldCgnc2F1Y2UtanMtdW5pdCcpICYmXG4gICAgICAvLyBTa2lwIFNhdWNlIG9uIFRyYXZpcyB3aGVuIFtza2lwIHNhdWNlXSBpcyBpbiB0aGUgY29tbWl0IG1lc3NhZ2VcbiAgICAgIGlzVW5kZWZPck5vblplcm8ocHJvY2Vzcy5lbnYuVFdCU19ET19TQVVDRSkpIHtcbiAgICB0ZXN0U3VidGFza3MucHVzaCgnYmFiZWw6ZGV2Jyk7XG4gICAgdGVzdFN1YnRhc2tzLnB1c2goJ2Nvbm5lY3QnKTtcbiAgICB0ZXN0U3VidGFza3MucHVzaCgnc2F1Y2VsYWJzLXF1bml0Jyk7XG4gIH1cbiAgZ3J1bnQucmVnaXN0ZXJUYXNrKCd0ZXN0JywgdGVzdFN1YnRhc2tzKTtcbiAgZ3J1bnQucmVnaXN0ZXJUYXNrKCd0ZXN0LWpzJywgWydlc2xpbnQnLCAnanNjczpjb3JlJywgJ2pzY3M6dGVzdCcsICdqc2NzOmdydW50JywgJ3F1bml0J10pO1xuXG4gIC8vIEpTIGRpc3RyaWJ1dGlvbiB0YXNrLlxuICBncnVudC5yZWdpc3RlclRhc2soJ2Rpc3QtanMnLCBbJ2JhYmVsOmRldicsICdjb25jYXQnLCAnbGluZXJlbW92ZXInLCAnYmFiZWw6ZGlzdCcsICdzdGFtcCcsICd1Z2xpZnk6Y29yZScsICdjb21tb25qcyddKTtcblxuICBncnVudC5yZWdpc3RlclRhc2soJ3Rlc3Qtc2NzcycsIFsnc2Nzc2xpbnQnXSk7XG5cbiAgLy8gQ1NTIGRpc3RyaWJ1dGlvbiB0YXNrLlxuICAvLyBTdXBwb3J0ZWQgQ29tcGlsZXJzOiBzYXNzIChSdWJ5KSBhbmQgbGlic2Fzcy5cbiAgKGZ1bmN0aW9uIChzYXNzQ29tcGlsZXJOYW1lKSB7XG4gICAgcmVxdWlyZSgnLi9ncnVudC9icy1zYXNzLWNvbXBpbGUvJyArIHNhc3NDb21waWxlck5hbWUgKyAnLmpzJykoZ3J1bnQpO1xuICB9KShwcm9jZXNzLmVudi5UV0JTX1NBU1MgfHwgJ2xpYnNhc3MnKTtcbiAgLy8gZ3J1bnQucmVnaXN0ZXJUYXNrKCdzYXNzLWNvbXBpbGUnLCBbJ3Nhc3M6Y29yZScsICdzYXNzOmV4dHJhcycsICdzYXNzOmRvY3MnXSk7XG4gIGdydW50LnJlZ2lzdGVyVGFzaygnc2Fzcy1jb21waWxlJywgWydzYXNzOmNvcmUnLCAnc2Fzczpkb2NzJ10pO1xuXG4gIGdydW50LnJlZ2lzdGVyVGFzaygnZGlzdC1jc3MnLCBbJ3Nhc3MtY29tcGlsZScsICdwb3N0Y3NzOmNvcmUnLCAnY3NzY29tYjpkaXN0JywgJ2Nzc21pbjpjb3JlJywgJ2Nzc21pbjpkb2NzJ10pO1xuXG4gIC8vIEZ1bGwgZGlzdHJpYnV0aW9uIHRhc2suXG4gIGdydW50LnJlZ2lzdGVyVGFzaygnZGlzdCcsIFsnY2xlYW46ZGlzdCcsICdkaXN0LWNzcycsICdkaXN0LWpzJ10pO1xuXG4gIC8vIERlZmF1bHQgdGFzay5cbiAgZ3J1bnQucmVnaXN0ZXJUYXNrKCdkZWZhdWx0JywgWydjbGVhbjpkaXN0JywgJ3Rlc3QnXSk7XG5cbiAgZ3J1bnQucmVnaXN0ZXJUYXNrKCdjb21tb25qcycsIFsnYmFiZWw6dW1kJywgJ25wbS1qcyddKTtcblxuICBncnVudC5yZWdpc3RlclRhc2soJ25wbS1qcycsICdHZW5lcmF0ZSBucG0tanMgZW50cnlwb2ludCBtb2R1bGUgaW4gZGlzdCBkaXIuJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBzcmNGaWxlcyA9IE9iamVjdC5rZXlzKGdydW50LmNvbmZpZy5nZXQoJ2JhYmVsLnVtZC5maWxlcycpKS5tYXAoZnVuY3Rpb24gKGZpbGVuYW1lKSB7XG4gICAgICByZXR1cm4gJy4vJyArIHBhdGguam9pbigndW1kJywgcGF0aC5iYXNlbmFtZShmaWxlbmFtZSkpXG4gICAgfSlcbiAgICB2YXIgZGVzdEZpbGVwYXRoID0gJ2Rpc3QvanMvbnBtLmpzJztcbiAgICBnZW5lcmF0ZUNvbW1vbkpTTW9kdWxlKGdydW50LCBzcmNGaWxlcywgZGVzdEZpbGVwYXRoKTtcbiAgfSk7XG5cbiAgLy8gRG9jcyB0YXNrLlxuICBncnVudC5yZWdpc3RlclRhc2soJ2RvY3MtY3NzJywgWydwb3N0Y3NzOmRvY3MnLCAncG9zdGNzczpleGFtcGxlcycsICdjc3Njb21iOmRvY3MnLCAnY3NzY29tYjpleGFtcGxlcycsICdjc3NtaW46ZG9jcyddKTtcbiAgZ3J1bnQucmVnaXN0ZXJUYXNrKCdkb2NzLWpzJywgWyd1Z2xpZnk6ZG9jc0pzJ10pO1xuICBncnVudC5yZWdpc3RlclRhc2soJ2xpbnQtZG9jcy1qcycsIFsnanNjczphc3NldHMnXSk7XG4gIGdydW50LnJlZ2lzdGVyVGFzaygnZG9jcycsIFsnZG9jcy1jc3MnLCAnZG9jcy1qcycsICdsaW50LWRvY3MtanMnLCAnY2xlYW46ZG9jcycsICdjb3B5OmRvY3MnXSk7XG4gIGdydW50LnJlZ2lzdGVyVGFzaygnZG9jcy1naXRodWInLCBbJ2pla3lsbDpnaXRodWInLCAnaHRtbG1pbiddKTtcblxuICBncnVudC5yZWdpc3RlclRhc2soJ3ByZXAtcmVsZWFzZScsIFsnZGlzdCcsICdkb2NzJywgJ2RvY3MtZ2l0aHViJywgJ2NvbXByZXNzJ10pO1xuXG4gIC8vIFB1Ymxpc2ggdG8gR2l0SHViXG4gIGdydW50LnJlZ2lzdGVyVGFzaygncHVibGlzaCcsIFsnYnVpbGRjb250cm9sOnBhZ2VzJ10pO1xuXG4gIC8vIFRhc2sgZm9yIHVwZGF0aW5nIHRoZSBjYWNoZWQgbnBtIHBhY2thZ2VzIHVzZWQgYnkgdGhlIFRyYXZpcyBidWlsZCAod2hpY2ggYXJlIGNvbnRyb2xsZWQgYnkgdGVzdC1pbmZyYS9ucG0tc2hyaW5rd3JhcC5qc29uKS5cbiAgLy8gVGhpcyB0YXNrIHNob3VsZCBiZSBydW4gYW5kIHRoZSB1cGRhdGVkIGZpbGUgc2hvdWxkIGJlIGNvbW1pdHRlZCB3aGVuZXZlciBCb290c3RyYXAncyBkZXBlbmRlbmNpZXMgY2hhbmdlLlxuICBncnVudC5yZWdpc3RlclRhc2soJ3VwZGF0ZS1zaHJpbmt3cmFwJywgWydleGVjOm5wbVVwZGF0ZScsICdfdXBkYXRlLXNocmlua3dyYXAnXSk7XG4gIGdydW50LnJlZ2lzdGVyVGFzaygnX3VwZGF0ZS1zaHJpbmt3cmFwJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBkb25lID0gdGhpcy5hc3luYygpO1xuICAgIG5wbVNocmlua3dyYXAoeyBkZXY6IHRydWUsIGRpcm5hbWU6IF9fZGlybmFtZSB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGdydW50LmZhaWwud2FybihlcnIpO1xuICAgICAgfVxuICAgICAgdmFyIGRlc3QgPSAnZ3J1bnQvbnBtLXNocmlua3dyYXAuanNvbic7XG4gICAgICBmcy5yZW5hbWVTeW5jKCducG0tc2hyaW5rd3JhcC5qc29uJywgZGVzdCk7XG4gICAgICBncnVudC5sb2cud3JpdGVsbignRmlsZSAnICsgZGVzdC5jeWFuICsgJyB1cGRhdGVkLicpO1xuICAgICAgZG9uZSgpO1xuICAgIH0pO1xuICB9KTtcbn07XG4iXX0=