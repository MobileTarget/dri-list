// StorageAdapter factory
DomenowApp.factory('DbStorage', function ($ionicPlatform, $q) {
	'use strict';

	var self = this;

	self.doc = null;

	var DbStorage = function (storageKey, options) {
		var args = options || {},
			collection = [],
			db = null,
			saved = false,
			destroyed = false;

		// localstorage as default
		if (!args.adapter) {
			args.adapter = 'websql';
		}

		// default size is 100
		if (!args.size) {
			args.size = 100;
		}

		db = new PouchDB(storageKey, args);
		$ionicPlatform.ready(function () {
			if (ionic.Platform.platform() == 'ios') {
				args.adapter = 'cordova-sqlite';
				args.iosDatabaseLocation = 'Library';

				PouchDB.plugin(PouchAdapterCordovaSqlite);
				db = new PouchDB(storageKey, args);
			}
		});
		// PRIVATE METHODS
		function getLocalStorage() {
			var jDb = db.allDocs({
				include_docs: true
			});

			jDb.then(function (result) {
				collection = [];

				result.rows.forEach(function (row) {
					collection.push(row.doc);
				});
			});

			return collection;
		}

		function allData() {
			getLocalStorage();

			return collection;
		}

		function getParams(params) {
			var data = [],
				result, res = [];

			if (angular.isArray(params)) {
				result = data.concat(params);
			} else {
				data.push(params);
				result = data;
			}

			result.forEach(function (val) {
				if (val.id) {
					val._id = val.id.toString();
				}

				res.push(val);
			});

			return res;
		}

		function saveLocalStorage(params) {
			var data = getParams(params);

			db.bulkDocs(data).then(function (result) {
				saved = result.length === data.length;
			});

			return saved;
		}

		function resetLocalStorage() {
			db.destroy().then(function () {
				db = new PouchDB(storageKey, args);
			});
		}

		function removeLocalStorage() {
			db.destroy().then(function (response) {
				destroyed = response.ok;
			}).catch(function (err) {
				console.log(err);
			});

			return destroyed;
		}

		function getData(record) {
			var getDb = db.get(record._id);

			getDb.then(function (result) {
				self.doc = result;
			});

			return self.doc;
		}

		function updateData(record, params) {
			_.keys(params).forEach(function (val) {
				record[val] = params[val]
			});

			db.put(record).then(function (result) {
				console.log(result);
			});
		}

		function replaceData(record, params) {
			updateData(record, params);
		}

		function removeData(record) {
			db.remove(record._id);

			return true;
		}

		// PUBLIC METHODS
		function all() {
			return allData();
		}

		function save(params) {
			return saveLocalStorage(params);
		}

		function get(record) {
			getData(record);

			return {
				result: self.doc, // recall result
				update: function (params) {
					return updateData(record, params);
				},
				replace: function (params) {
					return replaceData(record, params);
				},
				remove: function () {
					return removeData(record);
				}
			};
		}

		function reset() {
			return resetLocalStorage();
		}

		function remove() {
			return removeLocalStorage();
		}

		function objectParams(params) {
			var objParams, attrs, object = '',
				keys = Object.keys(params);

			if (keys.length === 1) {
				object = keys[0];
			}

			if (params.hasOwnProperty(object)) {
				attrs = angular.copy(params);
				objParams = params[object];
				objParams.params = attrs;
			} else {
				objParams = params;
			}

			return objParams;
		}

		function sanitizer(params, callback) {
			var objects = [],
				sanitizerName = callback.name,
				forProperties = sanitizerName === 'normalizeObject';

			if (angular.isArray(params)) {
				for (var i = 0; i < params.length; i++) {
					objects[i] = forProperties ? callback(objectParams(params[i])) : callback(params[i]);
				}
			} else {
				objects = forProperties ? callback(objectParams(params)) : callback(params);
			}

			return objects;
		}

		return {
			db: db,
			doc: self.doc,
			all: all,
			save: save,
			get: get,
			reset: reset,
			remove: remove,
			object: {
				sanitizer: function (params, callback) {
					return sanitizer(params, callback);
				}
			}
		};
	};

	return DbStorage;
});