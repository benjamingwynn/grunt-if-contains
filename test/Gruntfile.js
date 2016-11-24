(function () {
	/*
	 * grunt-if-contains
	 * https://github.com/benjamingwynn/grunt-if-contains
	 *
	 * Copyright (c) 2016 Benjamin Gwynn (http://xenxier.com)
	 * Licensed under the MIT license.
	 */

	'use strict';
	/*jslint node:true*/

	module.exports = function (grunt) {
		// load tasks
		grunt.loadTasks('../tasks/');
		grunt.loadNpmTasks('grunt-jslint');

		// configure
		grunt.initConfig({
			'grunt-if-contains': {
				test: {
					options: {
						ifContains: "use strict",

						tasks: {
							'jslint': { // options for grunt-jslint
								directives: {
									white: true
								},

								options: {
									failOnError: false
								}
							}
						}
					},

					src: [
						"tests/failsjslint.js",
						"tests/strict1.js",
						"tests/nonstrict1.js"
					]
				}
			}
		});

		// test
		grunt.registerTask('default', ['grunt-if-contains']);
	};
}());
