'use strict';

var fs = require('fs');

module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-replace');

	grunt.registerTask('configure', ['clean:pre', 'bower:install']);

	grunt.registerTask('compile', ['copy:less', 'copy:less_plugins', 'concat:less_theme_dependencies', 'concat:less_plugins', 'concat:js', 'less:uncompressed', 'clean_bootstrap2_css', 'replace', 'build_standalone', 'uglify', 'clean:post']);

	grunt.registerTask('default', ['configure', 'compile']);

	grunt.registerTask('clean_bootstrap2_css', 'Cleans CSS rules ocurring before the header comment.', function () {
		var file = 'dist/css/selectize.bootstrap2.css';
		var source = fs.readFileSync(file, 'utf8');
		grunt.file.write(file, source.replace(/^(.|\s)+?\/\*/m, '/*'));
		grunt.log.writeln('Cleaned "' + file + '".');
	});

	grunt.registerTask('build_standalone', '', function () {
		var files,
		    i,
		    n,
		    source,
		    name,
		    path,
		    modules = [];

		// amd definitions must be changed to be not anonymous
		// @see https://github.com/brianreavis/selectize.js/issues/89
		files = [];
		for (i = 0, n = files_js_dependencies.length; i < n; i++) {
			path = files_js_dependencies[i];
			name = path.match(/([^\/]+?).js$/)[1];
			source = grunt.file.read(path).replace('define(factory);', 'define(\'' + name + '\', factory);');
			modules.push(source);
		}

		path = 'dist/js/selectize.js';
		source = grunt.file.read(path).replace(/define\((.*?)factory\);/, 'define(\'selectize\', $1factory);');
		modules.push(source);

		// write output
		path = 'dist/js/standalone/selectize.js';
		grunt.file.write(path, modules.join('\n\n'));
		grunt.log.writeln('Built "' + path + '".');
	});

	var files_js = ['src/contrib/*.js', 'src/*.js', '!src/.wrapper.js', '!src/defaults.js', '!src/selectize.js', '!src/selectize.jquery.js', 'src/selectize.js', 'src/defaults.js', 'src/selectize.jquery.js'];

	var files_js_dependencies = ['bower_components/sifter/sifter.js', 'bower_components/microplugin/src/microplugin.js'];

	var less_imports = [];
	var less_plugin_files = [];

	// enumerate plugins
	(function () {
		var selector_plugins = grunt.option('plugins');
		if (!selector_plugins) return;

		if (selector_plugins.indexOf(',') !== -1) {
			selector_plugins = '{' + selector_plugins.split(/\s*,\s*/).join(',') + '}';
		}

		// javascript
		files_js.push('src/plugins/' + selector_plugins + '/*.js');

		// less (css)
		var matched_files = grunt.file.expand(['src/plugins/' + selector_plugins + '/plugin.less']);
		for (var i = 0, n = matched_files.length; i < n; i++) {
			var plugin_name = matched_files[i].match(/src\/plugins\/(.+?)\//)[1];
			less_imports.push('@import "plugins/' + plugin_name + '";');
			less_plugin_files.push({ src: matched_files[i], dest: 'dist/less/plugins/' + plugin_name + '.less' });
		}
	})();

	grunt.initConfig({
		pkg: grunt.file.readJSON('bower.json'),
		bower: {
			install: {
				options: {
					copy: false,
					clean: false,
					layout: 'byComponent',
					action: 'install'
				}
			}
		},
		clean: {
			pre: ['dist'],
			post: ['**/*.tmp*']
		},
		copy: {
			less: {
				files: [{ expand: true, flatten: true, src: ['src/less/*.less'], dest: 'dist/less' }]
			},
			less_plugins: {
				files: less_plugin_files
			}
		},
		replace: {
			options: { prefix: '@@' },
			main: {
				options: {
					variables: {
						'version': '<%= pkg.version %>',
						'js': '<%= grunt.file.read("dist/js/selectize.js").replace(/\\n/g, "\\n\\t") %>',
						'css': '<%= grunt.file.read("dist/css/selectize.css") %>'
					}
				},
				files: [{ src: ['src/.wrapper.js'], dest: 'dist/js/selectize.js' }, { src: ['src/less/.wrapper.css'], dest: 'dist/css/selectize.css' }]
			},
			css_post: {
				options: {
					variables: {
						'version': '<%= pkg.version %>'
					}
				},
				files: [{ expand: true, flatten: false, src: ['dist/css/*.css'], dest: '' }, { expand: true, flatten: false, src: ['dist/less/*.less'], dest: '' }, { expand: true, flatten: false, src: ['dist/less/plugins/*.less'], dest: '' }]
			}
		},
		less: {
			options: {},
			uncompressed: {
				files: {
					'dist/css/selectize.css': ['dist/less/selectize.less'],
					'dist/css/selectize.default.css': ['dist/less/selectize.default.less'],
					'dist/css/selectize.legacy.css': ['dist/less/selectize.legacy.less'],
					'dist/css/selectize.bootstrap2.css': ['dist/less/selectize.bootstrap2.tmp.less'],
					'dist/css/selectize.bootstrap3.css': ['dist/less/selectize.bootstrap3.tmp.less']
				}
			}
		},
		concat: {
			options: {
				stripBanners: true,
				separator: grunt.util.linefeed + grunt.util.linefeed
			},
			js: {
				files: {
					'dist/js/selectize.js': files_js
				}
			},
			less_plugins: {
				options: {
					banner: less_imports.join('\n') + grunt.util.linefeed + grunt.util.linefeed
				},
				files: {
					'dist/less/selectize.less': ['dist/less/selectize.less']
				}
			},
			less_theme_dependencies: {
				options: { stripBanners: false },
				files: {
					'dist/less/selectize.bootstrap2.tmp.less': ['bower_components/bootstrap2/less/variables.less', 'bower_components/bootstrap2/less/mixins.less', 'dist/less/selectize.bootstrap2.less'],
					'dist/less/selectize.bootstrap3.tmp.less': ['bower_components/bootstrap3/less/variables.less', 'bower_components/bootstrap3/less/mixins/nav-divider.less', 'dist/less/selectize.bootstrap3.less']
				}
			}
		},
		uglify: {
			main: {
				options: {
					'banner': '/*! selectize.js - v<%= pkg.version %> | https://github.com/brianreavis/selectize.js | Apache License (v2) */\n',
					'report': 'gzip',
					'ascii-only': true
				},
				files: {
					'dist/js/selectize.min.js': ['dist/js/selectize.js'],
					'dist/js/standalone/selectize.min.js': ['dist/js/standalone/selectize.js']
				}
			}
		}
	});
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NlbGVjdGl6ZS5qcy9HcnVudGZpbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLEtBQUssUUFBUSxJQUFSLENBQVQ7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFVBQVMsS0FBVCxFQUFnQjtBQUNoQyxPQUFNLFlBQU4sQ0FBbUIsa0JBQW5CO0FBQ0EsT0FBTSxZQUFOLENBQW1CLHNCQUFuQjtBQUNBLE9BQU0sWUFBTixDQUFtQixzQkFBbkI7QUFDQSxPQUFNLFlBQU4sQ0FBbUIscUJBQW5CO0FBQ0EsT0FBTSxZQUFOLENBQW1CLG9CQUFuQjtBQUNBLE9BQU0sWUFBTixDQUFtQixvQkFBbkI7QUFDQSxPQUFNLFlBQU4sQ0FBbUIsZUFBbkI7O0FBRUEsT0FBTSxZQUFOLENBQW1CLFdBQW5CLEVBQWdDLENBQy9CLFdBRCtCLEVBRS9CLGVBRitCLENBQWhDOztBQUtBLE9BQU0sWUFBTixDQUFtQixTQUFuQixFQUE4QixDQUM3QixXQUQ2QixFQUU3QixtQkFGNkIsRUFHN0IsZ0NBSDZCLEVBSTdCLHFCQUo2QixFQUs3QixXQUw2QixFQU03QixtQkFONkIsRUFPN0Isc0JBUDZCLEVBUTdCLFNBUjZCLEVBUzdCLGtCQVQ2QixFQVU3QixRQVY2QixFQVc3QixZQVg2QixDQUE5Qjs7QUFjQSxPQUFNLFlBQU4sQ0FBbUIsU0FBbkIsRUFBOEIsQ0FDN0IsV0FENkIsRUFFN0IsU0FGNkIsQ0FBOUI7O0FBS0EsT0FBTSxZQUFOLENBQW1CLHNCQUFuQixFQUEyQyxzREFBM0MsRUFBbUcsWUFBVztBQUM3RyxNQUFJLE9BQU8sbUNBQVg7QUFDQSxNQUFJLFNBQVMsR0FBRyxZQUFILENBQWdCLElBQWhCLEVBQXNCLE1BQXRCLENBQWI7QUFDQSxRQUFNLElBQU4sQ0FBVyxLQUFYLENBQWlCLElBQWpCLEVBQXVCLE9BQU8sT0FBUCxDQUFlLGdCQUFmLEVBQWlDLElBQWpDLENBQXZCO0FBQ0EsUUFBTSxHQUFOLENBQVUsT0FBVixDQUFrQixjQUFj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ZnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihncnVudCkge1xuXHRncnVudC5sb2FkTnBtVGFza3MoJ2dydW50LWJvd2VyLXRhc2snKTtcblx0Z3J1bnQubG9hZE5wbVRhc2tzKCdncnVudC1jb250cmliLXVnbGlmeScpO1xuXHRncnVudC5sb2FkTnBtVGFza3MoJ2dydW50LWNvbnRyaWItY29uY2F0Jyk7XG5cdGdydW50LmxvYWROcG1UYXNrcygnZ3J1bnQtY29udHJpYi1jbGVhbicpO1xuXHRncnVudC5sb2FkTnBtVGFza3MoJ2dydW50LWNvbnRyaWItY29weScpO1xuXHRncnVudC5sb2FkTnBtVGFza3MoJ2dydW50LWNvbnRyaWItbGVzcycpO1xuXHRncnVudC5sb2FkTnBtVGFza3MoJ2dydW50LXJlcGxhY2UnKTtcblxuXHRncnVudC5yZWdpc3RlclRhc2soJ2NvbmZpZ3VyZScsIFtcblx0XHQnY2xlYW46cHJlJyxcblx0XHQnYm93ZXI6aW5zdGFsbCcsXG5cdF0pO1xuXG5cdGdydW50LnJlZ2lzdGVyVGFzaygnY29tcGlsZScsIFtcblx0XHQnY29weTpsZXNzJyxcblx0XHQnY29weTpsZXNzX3BsdWdpbnMnLFxuXHRcdCdjb25jYXQ6bGVzc190aGVtZV9kZXBlbmRlbmNpZXMnLFxuXHRcdCdjb25jYXQ6bGVzc19wbHVnaW5zJyxcblx0XHQnY29uY2F0OmpzJyxcblx0XHQnbGVzczp1bmNvbXByZXNzZWQnLFxuXHRcdCdjbGVhbl9ib290c3RyYXAyX2NzcycsXG5cdFx0J3JlcGxhY2UnLFxuXHRcdCdidWlsZF9zdGFuZGFsb25lJyxcblx0XHQndWdsaWZ5Jyxcblx0XHQnY2xlYW46cG9zdCcsXG5cdF0pO1xuXG5cdGdydW50LnJlZ2lzdGVyVGFzaygnZGVmYXVsdCcsIFtcblx0XHQnY29uZmlndXJlJyxcblx0XHQnY29tcGlsZSdcblx0XSk7XG5cblx0Z3J1bnQucmVnaXN0ZXJUYXNrKCdjbGVhbl9ib290c3RyYXAyX2NzcycsICdDbGVhbnMgQ1NTIHJ1bGVzIG9jdXJyaW5nIGJlZm9yZSB0aGUgaGVhZGVyIGNvbW1lbnQuJywgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGZpbGUgPSAnZGlzdC9jc3Mvc2VsZWN0aXplLmJvb3RzdHJhcDIuY3NzJztcblx0XHR2YXIgc291cmNlID0gZnMucmVhZEZpbGVTeW5jKGZpbGUsICd1dGY4Jyk7XG5cdFx0Z3J1bnQuZmlsZS53cml0ZShmaWxlLCBzb3VyY2UucmVwbGFjZSgvXigufFxccykrP1xcL1xcKi9tLCAnLyonKSk7XG5cdFx0Z3J1bnQubG9nLndyaXRlbG4oJ0NsZWFuZWQgXCInICsgZmlsZSArICdcIi4nKTtcblx0fSk7XG5cblx0Z3J1bnQucmVnaXN0ZXJUYXNrKCdidWlsZF9zdGFuZGFsb25lJywgJycsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBmaWxlcywgaSwgbiwgc291cmNlLCBuYW1lLCBwYXRoLCBtb2R1bGVzID0gW107XG5cblx0XHQvLyBhbWQgZGVmaW5pdGlvbnMgbXVzdCBiZSBjaGFuZ2VkIHRvIGJlIG5vdCBhbm9ueW1vdXNcblx0XHQvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9icmlhbnJlYXZpcy9zZWxlY3RpemUuanMvaXNzdWVzLzg5XG5cdFx0ZmlsZXMgPSBbXTtcblx0XHRmb3IgKGkgPSAwLCBuID0gZmlsZXNfanNfZGVwZW5kZW5jaWVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuXHRcdFx0cGF0aCA9IGZpbGVzX2pzX2RlcGVuZGVuY2llc1tpXTtcblx0XHRcdG5hbWUgPSBwYXRoLm1hdGNoKC8oW15cXC9dKz8pLmpzJC8pWzFdO1xuXHRcdFx0c291cmNlID0gZ3J1bnQuZmlsZS5yZWFkKHBhdGgpLnJlcGxhY2UoJ2RlZmluZShmYWN0b3J5KTsnLCAnZGVmaW5lKFxcJycgKyBuYW1lICsgJ1xcJywgZmFjdG9yeSk7Jyk7XG5cdFx0XHRtb2R1bGVzLnB1c2goc291cmNlKTtcblx0XHR9XG5cblx0XHRwYXRoID0gJ2Rpc3QvanMvc2VsZWN0aXplLmpzJztcblx0XHRzb3VyY2UgPSBncnVudC5maWxlLnJlYWQocGF0aCkucmVwbGFjZSgvZGVmaW5lXFwoKC4qPylmYWN0b3J5XFwpOy8sICdkZWZpbmUoXFwnc2VsZWN0aXplXFwnLCAkMWZhY3RvcnkpOycpO1xuXHRcdG1vZHVsZXMucHVzaChzb3VyY2UpO1xuXG5cdFx0Ly8gd3JpdGUgb3V0cHV0XG5cdFx0cGF0aCA9ICdkaXN0L2pzL3N0YW5kYWxvbmUvc2VsZWN0aXplLmpzJztcblx0XHRncnVudC5maWxlLndyaXRlKHBhdGgsIG1vZHVsZXMuam9pbignXFxuXFxuJykpO1xuXHRcdGdydW50LmxvZy53cml0ZWxuKCdCdWlsdCBcIicgKyBwYXRoICsgJ1wiLicpO1xuXHR9KTtcblxuXHR2YXIgZmlsZXNfanMgPSBbXG5cdFx0J3NyYy9jb250cmliLyouanMnLFxuXHRcdCdzcmMvKi5qcycsXG5cdFx0JyFzcmMvLndyYXBwZXIuanMnLFxuXHRcdCchc3JjL2RlZmF1bHRzLmpzJyxcblx0XHQnIXNyYy9zZWxlY3RpemUuanMnLFxuXHRcdCchc3JjL3NlbGVjdGl6ZS5qcXVlcnkuanMnLFxuXHRcdCdzcmMvc2VsZWN0aXplLmpzJyxcblx0XHQnc3JjL2RlZmF1bHRzLmpzJyxcblx0XHQnc3JjL3NlbGVjdGl6ZS5qcXVlcnkuanMnLFxuXHRdO1xuXG5cdHZhciBmaWxlc19qc19kZXBlbmRlbmNpZXMgPSBbXG5cdFx0J2Jvd2VyX2NvbXBvbmVudHMvc2lmdGVyL3NpZnRlci5qcycsXG5cdFx0J2Jvd2VyX2NvbXBvbmVudHMvbWljcm9wbHVnaW4vc3JjL21pY3JvcGx1Z2luLmpzJyxcblx0XTtcblxuXHR2YXIgbGVzc19pbXBvcnRzID0gW107XG5cdHZhciBsZXNzX3BsdWdpbl9maWxlcyA9IFtdO1xuXG5cdC8vIGVudW1lcmF0ZSBwbHVnaW5zXG5cdChmdW5jdGlvbigpIHtcblx0XHR2YXIgc2VsZWN0b3JfcGx1Z2lucyA9IGdydW50Lm9wdGlvbigncGx1Z2lucycpO1xuXHRcdGlmICghc2VsZWN0b3JfcGx1Z2lucykgcmV0dXJuO1xuXG5cdFx0aWYgKHNlbGVjdG9yX3BsdWdpbnMuaW5kZXhPZignLCcpICE9PSAtMSkge1xuXHRcdFx0c2VsZWN0b3JfcGx1Z2lucyA9ICd7JyArIHNlbGVjdG9yX3BsdWdpbnMuc3BsaXQoL1xccyosXFxzKi8pLmpvaW4oJywnKSArICd9Jztcblx0XHR9XG5cblx0XHQvLyBqYXZhc2NyaXB0XG5cdFx0ZmlsZXNfanMucHVzaCgnc3JjL3BsdWdpbnMvJyArIHNlbGVjdG9yX3BsdWdpbnMgKyAnLyouanMnKTtcblxuXHRcdC8vIGxlc3MgKGNzcylcblx0XHR2YXIgbWF0Y2hlZF9maWxlcyA9IGdydW50LmZpbGUuZXhwYW5kKFsnc3JjL3BsdWdpbnMvJyArIHNlbGVjdG9yX3BsdWdpbnMgKyAnL3BsdWdpbi5sZXNzJ10pO1xuXHRcdGZvciAodmFyIGkgPSAwLCBuID0gbWF0Y2hlZF9maWxlcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcblx0XHRcdHZhciBwbHVnaW5fbmFtZSA9IG1hdGNoZWRfZmlsZXNbaV0ubWF0Y2goL3NyY1xcL3BsdWdpbnNcXC8oLis/KVxcLy8pWzFdO1xuXHRcdFx0bGVzc19pbXBvcnRzLnB1c2goJ0BpbXBvcnQgXCJwbHVnaW5zLycgKyAgcGx1Z2luX25hbWUgKyAnXCI7Jyk7XG5cdFx0XHRsZXNzX3BsdWdpbl9maWxlcy5wdXNoKHtzcmM6IG1hdGNoZWRfZmlsZXNbaV0sIGRlc3Q6ICdkaXN0L2xlc3MvcGx1Z2lucy8nICsgcGx1Z2luX25hbWUgKyAnLmxlc3MnfSk7XG5cdFx0fVxuXHR9KSgpO1xuXG5cdGdydW50LmluaXRDb25maWcoe1xuXHRcdHBrZzogZ3J1bnQuZmlsZS5yZWFkSlNPTignYm93ZXIuanNvbicpLFxuXHRcdGJvd2VyOiB7XG5cdFx0XHRpbnN0YWxsOiB7XG5cdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHRjb3B5OiBmYWxzZSxcblx0XHRcdFx0XHRjbGVhbjogZmFsc2UsXG5cdFx0XHRcdFx0bGF5b3V0OiAnYnlDb21wb25lbnQnLFxuXHRcdFx0XHRcdGFjdGlvbjogJ2luc3RhbGwnXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdGNsZWFuOiB7XG5cdFx0XHRwcmU6IFsnZGlzdCddLFxuXHRcdFx0cG9zdDogWycqKi8qLnRtcConXVxuXHRcdH0sXG5cdFx0Y29weToge1xuXHRcdFx0bGVzczoge1xuXHRcdFx0XHRmaWxlczogW3tleHBhbmQ6IHRydWUsIGZsYXR0ZW46IHRydWUsIHNyYzogWydzcmMvbGVzcy8qLmxlc3MnXSwgZGVzdDogJ2Rpc3QvbGVzcyd9XVxuXHRcdFx0fSxcblx0XHRcdGxlc3NfcGx1Z2luczoge1xuXHRcdFx0XHRmaWxlczogbGVzc19wbHVnaW5fZmlsZXNcblx0XHRcdH1cblx0XHR9LFxuXHRcdHJlcGxhY2U6IHtcblx0XHRcdG9wdGlvbnM6IHtwcmVmaXg6ICdAQCd9LFxuXHRcdFx0bWFpbjoge1xuXHRcdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdFx0dmFyaWFibGVzOiB7XG5cdFx0XHRcdFx0XHQndmVyc2lvbic6ICc8JT0gcGtnLnZlcnNpb24gJT4nLFxuXHRcdFx0XHRcdFx0J2pzJzogJzwlPSBncnVudC5maWxlLnJlYWQoXCJkaXN0L2pzL3NlbGVjdGl6ZS5qc1wiKS5yZXBsYWNlKC9cXFxcbi9nLCBcIlxcXFxuXFxcXHRcIikgJT4nLFxuXHRcdFx0XHRcdFx0J2Nzcyc6ICc8JT0gZ3J1bnQuZmlsZS5yZWFkKFwiZGlzdC9jc3Mvc2VsZWN0aXplLmNzc1wiKSAlPicsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmlsZXM6IFtcblx0XHRcdFx0XHR7c3JjOiBbJ3NyYy8ud3JhcHBlci5qcyddLCBkZXN0OiAnZGlzdC9qcy9zZWxlY3RpemUuanMnfSxcblx0XHRcdFx0XHR7c3JjOiBbJ3NyYy9sZXNzLy53cmFwcGVyLmNzcyddLCBkZXN0OiAnZGlzdC9jc3Mvc2VsZWN0aXplLmNzcyd9XG5cdFx0XHRcdF1cblx0XHRcdH0sXG5cdFx0XHRjc3NfcG9zdDoge1xuXHRcdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdFx0dmFyaWFibGVzOiB7XG5cdFx0XHRcdFx0XHQndmVyc2lvbic6ICc8JT0gcGtnLnZlcnNpb24gJT4nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmlsZXM6IFtcblx0XHRcdFx0XHR7ZXhwYW5kOiB0cnVlLCBmbGF0dGVuOiBmYWxzZSwgc3JjOiBbJ2Rpc3QvY3NzLyouY3NzJ10sIGRlc3Q6ICcnfSxcblx0XHRcdFx0XHR7ZXhwYW5kOiB0cnVlLCBmbGF0dGVuOiBmYWxzZSwgc3JjOiBbJ2Rpc3QvbGVzcy8qLmxlc3MnXSwgZGVzdDogJyd9LFxuXHRcdFx0XHRcdHtleHBhbmQ6IHRydWUsIGZsYXR0ZW46IGZhbHNlLCBzcmM6IFsnZGlzdC9sZXNzL3BsdWdpbnMvKi5sZXNzJ10sIGRlc3Q6ICcnfSxcblx0XHRcdFx0XVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bGVzczoge1xuXHRcdFx0b3B0aW9uczoge30sXG5cdFx0XHR1bmNvbXByZXNzZWQ6IHtcblx0XHRcdFx0ZmlsZXM6IHtcblx0XHRcdFx0XHQnZGlzdC9jc3Mvc2VsZWN0aXplLmNzcyc6IFsnZGlzdC9sZXNzL3NlbGVjdGl6ZS5sZXNzJ10sXG5cdFx0XHRcdFx0J2Rpc3QvY3NzL3NlbGVjdGl6ZS5kZWZhdWx0LmNzcyc6IFsnZGlzdC9sZXNzL3NlbGVjdGl6ZS5kZWZhdWx0Lmxlc3MnXSxcblx0XHRcdFx0XHQnZGlzdC9jc3Mvc2VsZWN0aXplLmxlZ2FjeS5jc3MnOiBbJ2Rpc3QvbGVzcy9zZWxlY3RpemUubGVnYWN5Lmxlc3MnXSxcblx0XHRcdFx0XHQnZGlzdC9jc3Mvc2VsZWN0aXplLmJvb3RzdHJhcDIuY3NzJzogWydkaXN0L2xlc3Mvc2VsZWN0aXplLmJvb3RzdHJhcDIudG1wLmxlc3MnXSxcblx0XHRcdFx0XHQnZGlzdC9jc3Mvc2VsZWN0aXplLmJvb3RzdHJhcDMuY3NzJzogWydkaXN0L2xlc3Mvc2VsZWN0aXplLmJvb3RzdHJhcDMudG1wLmxlc3MnXVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRjb25jYXQ6IHtcblx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0c3RyaXBCYW5uZXJzOiB0cnVlLFxuXHRcdFx0XHRzZXBhcmF0b3I6IGdydW50LnV0aWwubGluZWZlZWQgKyBncnVudC51dGlsLmxpbmVmZWVkXG5cdFx0XHR9LFxuXHRcdFx0anM6IHtcblx0XHRcdFx0ZmlsZXM6IHtcblx0XHRcdFx0XHQnZGlzdC9qcy9zZWxlY3RpemUuanMnOiBmaWxlc19qcyxcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGxlc3NfcGx1Z2luczoge1xuXHRcdFx0XHRvcHRpb25zOiB7XG5cdFx0XHRcdFx0YmFubmVyOiBsZXNzX2ltcG9ydHMuam9pbignXFxuJykgKyBncnVudC51dGlsLmxpbmVmZWVkICsgZ3J1bnQudXRpbC5saW5lZmVlZFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRmaWxlczoge1xuXHRcdFx0XHRcdCdkaXN0L2xlc3Mvc2VsZWN0aXplLmxlc3MnOiBbJ2Rpc3QvbGVzcy9zZWxlY3RpemUubGVzcyddXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRsZXNzX3RoZW1lX2RlcGVuZGVuY2llczoge1xuXHRcdFx0XHRvcHRpb25zOiB7c3RyaXBCYW5uZXJzOiBmYWxzZX0sXG5cdFx0XHRcdGZpbGVzOiB7XG5cdFx0XHRcdFx0J2Rpc3QvbGVzcy9zZWxlY3RpemUuYm9vdHN0cmFwMi50bXAubGVzcyc6IFtcblx0XHRcdFx0XHRcdCdib3dlcl9jb21wb25lbnRzL2Jvb3RzdHJhcDIvbGVzcy92YXJpYWJsZXMubGVzcycsXG5cdFx0XHRcdFx0XHQnYm93ZXJfY29tcG9uZW50cy9ib290c3RyYXAyL2xlc3MvbWl4aW5zLmxlc3MnLFxuXHRcdFx0XHRcdFx0J2Rpc3QvbGVzcy9zZWxlY3RpemUuYm9vdHN0cmFwMi5sZXNzJ1xuXHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0J2Rpc3QvbGVzcy9zZWxlY3RpemUuYm9vdHN0cmFwMy50bXAubGVzcyc6IFtcblx0XHRcdFx0XHRcdCdib3dlcl9jb21wb25lbnRzL2Jvb3RzdHJhcDMvbGVzcy92YXJpYWJsZXMubGVzcycsXG5cdFx0XHRcdFx0XHQnYm93ZXJfY29tcG9uZW50cy9ib290c3RyYXAzL2xlc3MvbWl4aW5zL25hdi1kaXZpZGVyLmxlc3MnLFxuXHRcdFx0XHRcdFx0J2Rpc3QvbGVzcy9zZWxlY3RpemUuYm9vdHN0cmFwMy5sZXNzJ1xuXHRcdFx0XHRcdF1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0dWdsaWZ5OiB7XG5cdFx0XHRtYWluOiB7XG5cdFx0XHRcdG9wdGlvbnM6IHtcblx0XHRcdFx0XHQnYmFubmVyJzogJy8qISBzZWxlY3RpemUuanMgLSB2PCU9IHBrZy52ZXJzaW9uICU+IHwgaHR0cHM6Ly9naXRodWIuY29tL2JyaWFucmVhdmlzL3NlbGVjdGl6ZS5qcyB8IEFwYWNoZSBMaWNlbnNlICh2MikgKi9cXG4nLFxuXHRcdFx0XHRcdCdyZXBvcnQnOiAnZ3ppcCcsXG5cdFx0XHRcdFx0J2FzY2lpLW9ubHknOiB0cnVlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZpbGVzOiB7XG5cdFx0XHRcdFx0J2Rpc3QvanMvc2VsZWN0aXplLm1pbi5qcyc6IFsnZGlzdC9qcy9zZWxlY3RpemUuanMnXSxcblx0XHRcdFx0XHQnZGlzdC9qcy9zdGFuZGFsb25lL3NlbGVjdGl6ZS5taW4uanMnOiBbJ2Rpc3QvanMvc3RhbmRhbG9uZS9zZWxlY3RpemUuanMnXVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcbn07Il19