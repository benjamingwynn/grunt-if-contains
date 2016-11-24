(function () {
	/*
	 *	grunt-if-contains
	 *	https://github.com/benjamingwynn/grunt-if-contains
	 *
	 *	Copyright (c) 2016 Benjamin Gwynn (http://xenxier.com)
	 *	Licensed under the MIT license.
	 */

	'use strict';
	/*jslint node:true*/

	/* load modules */
	var findup = require('findup-sync'),
		S = require('string'),
		extend = require('extend');

	module.exports = function (grunt) {
		grunt.registerMultiTask('grunt-if-contains', "WORK IN PROGRESS", function () {
			/* declare variables */
			var files = this.filesSrc,
				options = this.options({
					matchMode: 2,
					regExp: false
				}),
				doesContain = false,
				taskFlag,
				taskOptions = {},
				taskIndex = 0;


			/*
				doTask
				executes the task with the selected file/files/all files
			*/

			function doTask(taskFiles) {
				grunt.verbose.writeln("Running doTask...");

				// if no file path get file path from global files
				if (!taskFiles) {
					grunt.verbose.writeln("no taskFiles...");
					taskFiles = [];
					files.forEach(function (fileInFiles, i) {
						grunt.verbose.writeln("Looped through taskFiles i=" + i + "...");
						taskFiles.push(fileInFiles);
					});
				}

				grunt.verbose.writeln("taskFiles=" + taskFiles);

				// if file is string cast to array
				if (typeof taskFiles === "string") {
					grunt.verbose.writeln("Casting doTask to array...");
					taskFiles = [taskFiles];
				}

				var	taskName,
					target;

				if (Array.isArray(taskFiles)) { // single file path
					for (taskName in options.tasks) {
						if (options.tasks.hasOwnProperty(taskName)) {
							taskIndex += 1;
							target = 'target_' + taskIndex;

							if (grunt.config.get(target)) {
								grunt.verbose.error("already defined");
							} else {
								taskOptions = extend({}, options.tasks[taskName], true); // copy, dont modify directly
								taskOptions.src = taskFiles;

								grunt.verbose.ok("Setting config for task " + taskName + "...");
								grunt.config.set(taskName + '.' + target, taskOptions);

								// queue to run
								grunt.verbose.ok("Queueing task " + taskName + ":" + target + "...");
								grunt.task.run(taskName + ":" + target);
							}
						}
					}
				} else {
					grunt.fail.fatal("Path provided is not a string or array. This is probably a problem with either your config, or grunt-if-configs itself. Check your config is write and lines up with the example provided on the README.md and file an issue at https://github.com/benjamingwynn/grunt-if-contains/issues if the error persists.");
				}
			}

			if (!files.length) {
				grunt.fail.fatal("No files provided to check the contents of.");
			}

			// handle string alias
			switch (options.matchMode.toString()) {
			case 'all':
				options.matchMode = 0;
				break;

			case 'none':
				options.matchMode = 1;
				break;

			case 'individually-immediately':
				options.matchMode = 2;
				break;

			case 'individually-queue':
				options.matchMode = 3;
				break;

			case 'any':
				options.matchMode = 4;
				break;

			case 'once-first':
				options.matchMode = 5;
				break;

			case 'once-last':
				options.matchMode = 6;
				break;

			// if already set to a valid number
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
				break;

			// error
			default:
				grunt.fail.fatal("Unknown matchMode. See README.md");
			}

			// ensure this is a number
			if (isNaN(options.matchMode)) {
				options.matchMode = parseInt(options.matchMode, 10);
				grunt.verbose.writeln("Parsed matchMode to a number: #" + options.matchMode);
			}

			if (!options.ifContains) {
				grunt.fail.fatal("Not all of the required options were passed. See README.md. Missing ifContains.");
			}

			if (!options.tasks) {
				grunt.fail.fatal("Not all of the required options were passed. See README.md. Missing tasks.");
			}

			/*
				set default doTask data types
			*/

			switch (options.matchMode) {
			case 0: // doTask when all contain
				grunt.log.ok("Checking all files contain the query...");
				taskFlag = true;
				break;

			case 1:
				grunt.log.ok("Checking no files contain the query...");
				taskFlag = true;
				break;
			case 2:
				grunt.log.ok("Checking if files(s) contain the query and immediately executing the task on each which do...");
				taskFlag = true;
				break;

			case 3:
				grunt.log.ok("Checking if files(s) contain the query and queueing them to be executed with the task...");
				taskFlag = [];
				break;

			case 4:
				grunt.log.ok("Checking if any files(s) contain the query...");
				taskFlag = false;
				break;

			case 5:
				grunt.log.ok("Checking if file(s) contains the query and executing the task once, on the first task...");
				taskFlag = '';
				break;

			case 6:
				grunt.log.ok("Checking if file(s) contains the query and executing the task once, on the last task...");
				taskFlag = '';
				break;

			default:
				grunt.log.error("Unknown matchMode (" + options.matchMode + ")");
			}

			/*
				for each file found
			*/

			files.forEach(function (filename) {
				var filepath = findup(filename),
					contents;

				grunt.verbose.ok("Reading '" + filepath + "'...");

				if (!filepath || !grunt.file.exists(filepath)) {
					grunt.fail.fatal("file(s) not found: " + filename);
				}

				contents = new S(grunt.file.read(filepath));

				if (options.regExp) {
					doesContain = contents.contains(new RegExp(options.ifContains));
				} else {
					doesContain = contents.contains(options.ifContains);
				}

				if (doesContain) {
					grunt.verbose.ok("'" + filepath + "' contains '" + options.ifContains + "'");
				} else {
					grunt.verbose.ok("'" + filepath + "' does not contain '" + options.ifContains + "'");
				}

				switch (options.matchMode) {
				case 0: // when ALL FILES
					if (taskFlag) { // if last one succeceded
						taskFlag = doesContain; // only do the task if contains the string
					}

					break;

				case 1: // when no files
					if (taskFlag) { // if last one succeceded
						taskFlag = !doesContain; // only do the task if didnt contain the string
					}

					break;

				case 2: // do this
					if (doesContain) {
						doTask(filepath);
					}

					break;

				case 3: // do these
					if (doesContain) {
						taskFlag.push(filepath);
					}

					break;

				case 4: // when any
					if (!taskFlag) {
						taskFlag = doesContain;
					}

					break;

				case 5: // when first
					if (doesContain) {
						if (taskFlag === '') {
							taskFlag = filepath; // save path
						} else {
							taskFlag = null; // remove taskFlag to set above if condition to never fire but also never to fire the if in the switch case below
						}
					}

					break;

				case 6: // when last
					if (doesContain) {
						taskFlag = filepath; // save path
					}

					break;
				}
			});

			/*
				when finished looping through files
			*/

			switch (options.matchMode) {
			case 0: // when ALL FILES
				if (taskFlag) {
					doTask();
				}

				break;

			case 1: // when no files
				if (taskFlag) {
					doTask();
				}

				break;

			/* do nothing on case 2 because its task was done immediately */

			case 3: // do these
				if (taskFlag.length) {
					taskFlag.forEach(function (filePath) {
						doTask(filePath);
					});
				}

				break;

			case 4: // when any
				if (taskFlag) {
					doTask();
				}

				break;

			case 5: // when first
			case 6: // when last
				if (taskFlag && taskFlag !== '') {
					doTask(taskFlag);
				}

				break;
			}

			if (!taskIndex) {
				grunt.log.ok('(executed no tasks)');
			}
		});
	};
}());
