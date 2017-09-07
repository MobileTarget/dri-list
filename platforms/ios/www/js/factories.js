DomenowApp.factory('User', function () {
	'use strict';

	var user = this;
	user.remoteDbName = 'users';
	user.localDbName = 'user_db';

	user.username = "37924750-e42d-41f1-b52e-f70ee3d5e012-bluemix";
	user.password = "128d25e448350669a1c8561528400862f7540da2529a948ab16cb5f26a6675b8";
	user.remote = "https://" + user.username + ":" + user.password + "@" + user.username + ".cloudant.com";
	user.syncDBURL = user.remote + "/" + user.remoteDbName;
	user.syncOptions = {
		live: true,
		retry: true
	};
	user.dbOptions = {
		revs_limit: 1,
		auto_compaction: true
	};
	user.localDb = new PouchDB(user.localDbName, user.dbOptions);

	user.synced = -1;
	user.doSync = function () {
		console.log("user db sync started>>>");

		user.localDb.sync(user.syncDBURL, user.syncOptions)
			.on('change', function (info) {
				console.log("user db change", info);
			}).on('paused', function (err) {
				console.log("user db sync paused>>>", err);
			}).on('active', function () {
				console.log("replicate resumed");
			}).on('denied', function (err) {
				console.log("a document failed to replicate", err);
			}).on('complete', function (info) {
				console.log("user db sync completed>>>", info);
			}).on('error', function (err) {
				console.log("handle error", err);
			});
	};
	return user;
});

DomenowApp.factory('Detail', function ($filter) {
	'use strict';

	var detail = this;
	var remoteDbName = 'details';
	var localDbName = 'detail_db';
	detail.doc = null;
	detail.collection = [];

	detail.username = "37924750-e42d-41f1-b52e-f70ee3d5e012-bluemix";
	detail.password = "128d25e448350669a1c8561528400862f7540da2529a948ab16cb5f26a6675b8";
	detail.remote = "https://" + detail.username + ":" + detail.password + "@" + detail.username + ".cloudant.com";
	detail.syncDBURL = detail.remote + "/" + remoteDbName;
	detail.syncOptions = {
		live: true,
		retry: true
	};
	var dbOptions = {
		revs_limit: 1,
		auto_compaction: true
	};
	detail.localDb = new PouchDB(localDbName, dbOptions);

	detail.synced = -1;
	detail.doSync = function () {
		console.log("detail db sync started>>>");

		detail.localDb.sync(detail.syncDBURL, detail.syncOptions)
			.on('change', function (info) {
				console.log("detail db change", info);
			}).on('paused', function (err) {
				console.log("detail db sync paused>>>", err);
			}).on('active', function () {
				console.log("replicate resumed");
			}).on('denied', function (err) {
				console.log("a document failed to replicate", err);
			}).on('complete', function (info) {
				console.log("detail db sync completed>>>", info);
			}).on('error', function (err) {
				console.log("handle error", err);
			});
	};

	function getLocalData() {
		var lDb = detail.localDb.allDocs({
			include_docs: true
		});
		return lDb.then(function (result) {
			//console.log(result);
			detail.collection = [];

			result.rows.forEach(function (row) {
				detail.collection.push(row.doc);
			});
			return detail.collection;
		});
	}

	function allData(query) {
		return getLocalData().then(function (result) {
			return $filter('filter')(result, query, true);
		});
	}

	detail.getPage = function (page_id) {
		var query = {
			page_id: page_id
		};
		return allData(query).then(function (result) {
			return result;
		});
	};

	this.updateData = function () {
		var updateDoc = [{
			title: 'Lisa Says',
			_id: 'doc1',
			_rev: '65-ec428994856c1e69ba843841ca08c500'
		}, {
			title: 'Space Oddity',
			_id: 'doc2',
			_rev: '11-0697b3a2f2a7c948a967c7f92bb8c1ba'
		}];
		console.log(updateDoc);

		return this.localDb.bulkGet({
			docs: [{
				id: "doc-that-exists"
			}, {
				id: "doc-that-does-not-exist"
			}, {
				id: "doc-that-exists"
			}]
		}).then(function (result) {
			console.log(result);
			return result;
		}).catch(function (err) {
			console.log(err);
		});
	};
	return detail;
});

DomenowApp.factory('Task', function () {
	'use strict';

	var task = this;
	this.remoteDbName = 'task_table';
	this.localDbName = 'task_db';

	this.username = "37924750-e42d-41f1-b52e-f70ee3d5e012-bluemix";
	this.password = "128d25e448350669a1c8561528400862f7540da2529a948ab16cb5f26a6675b8";
	this.remote = "https://" + this.username + ":" + this.password + "@" + this.username + ".cloudant.com";
	this.syncDBURL = this.remote + "/" + this.remoteDbName;
	this.syncOptions = {
		live: true,
		retry: true
	};
	this.dbOptions = {
		revs_limit: 1,
		auto_compaction: true
	};
	this.localDb = new PouchDB(this.localDbName, this.dbOptions);

	this.synced = -1;
	this.doSync = function () {
		console.log("task db sync started>>>");

		task.localDb.sync(task.syncDBURL, task.syncOptions)
			.on('change', function (info) {
				console.log("task db change", info);
			}).on('paused', function (err) {
				console.log("task db sync paused>>>", err);
			}).on('active', function () {
				console.log("replicate resumed");
			}).on('denied', function (err) {
				console.log("a document failed to replicate", err);
			}).on('complete', function (info) {
				console.log("task db sync completed>>>", info);
			}).on('error', function (err) {
				console.log("handle error", err);
			});
	};

	this.getData = function (task_id) {
		return task.localDb.get(task_id).then(function (doc) {
			return doc;
		});
	};
	return task;
});
DomenowApp.factory('Template', function ($q, $filter) {
	'use strict';

	var template = this;
	this.remoteDbName = 'templates';
	this.localDbName = 'template_db';

	this.username = "37924750-e42d-41f1-b52e-f70ee3d5e012-bluemix";
	this.password = "128d25e448350669a1c8561528400862f7540da2529a948ab16cb5f26a6675b8";
	this.remote = "https://" + this.username + ":" + this.password + "@" + this.username + ".cloudant.com";
	this.syncDBURL = this.remote + "/" + this.remoteDbName;
	this.syncOptions = {
		live: true,
		retry: true
	};
	this.dbOptions = {
		revs_limit: 1,
		auto_compaction: true
	};
	this.localDb = new PouchDB(this.localDbName, this.dbOptions);

	this.synced = -1;
	this.getLocalData = function () {
		var lDb = this.localDb.allDocs({
			include_docs: true
		});
		return lDb.then(function (result) {
			//console.log(result);
			var collection = [];

			result.rows.forEach(function (row) {
				collection.push(row.doc);
			});
			return collection;
		});
	};
	this.allData = function () {
		return this.getLocalData().then(function (result) {
			return result;
		});
	};
	this.getData = function (query) {
		return this.allData().then(function (result) {
			var template = {};
			template.header = $filter('filter')(result, {
				_id: query.header_id
			}, true);
			template.detail = $filter('filter')(result, {
				_id: query.detail_id
			}, true);
			template.footer = $filter('filter')(result, {
				_id: query.footer_id
			}, true);
			return template;
		});
	};
	this.updateData = function (updateObj) {
		var updateDoc = [updateObj.header, updateObj.detail, updateObj.footer];
		return this.localDb.bulkGet({
			docs: [{
				id: updateObj.header._id
			}, {
				id: updateObj.detail._id
			}, {
				id: updateObj.footer._id
			}]
		}).then(function (bulkDocs) {
			var results = bulkDocs.results;
			if (typeof results[0].docs[0].ok != "undefined") { //update
				updateObj.header._rev = results[0].docs[0].ok._rev;
				updateObj.detail._rev = results[1].docs[0].ok._rev;
				updateObj.footer._rev = results[2].docs[0].ok._rev;
				console.log("template updateDoc>>>", updateDoc);
				return template.localDb.bulkDocs(updateDoc);
			} else { //create template
				return template.localDb.bulkDocs(updateDoc);
			}
		}).catch(function (err) {
			console.log(err);
		});
	};
	return template;
});

DomenowApp.factory('Usertask', function ($q, $filter, utilityService) {
	'use strict';

	var usertask = this;
	this.remoteDbName = 'user_task';
	this.localDbName = 'user_task_db';

	this.username = "37924750-e42d-41f1-b52e-f70ee3d5e012-bluemix";
	this.password = "128d25e448350669a1c8561528400862f7540da2529a948ab16cb5f26a6675b8";
	this.remote = "https://" + this.username + ":" + this.password + "@" + this.username + ".cloudant.com";
	this.syncDBURL = this.remote + "/" + this.remoteDbName;
	this.syncOptions = {
		live: true,
		retry: true
	};
	this.dbOptions = {
		revs_limit: 1,
		auto_compaction: true
	};
	this.localDb = new PouchDB(this.localDbName, this.dbOptions);

	this.synced = -1;
	this.doSync = function () {
		console.log("usertask db sync started>>>");

		usertask.localDb.sync(this.syncDBURL, this.syncOptions)
			.on('change', function (info) {
				console.log("usertask db change", info);
			}).on('paused', function (err) {
				console.log("usertask db sync paused>>>", err);
			}).on('active', function () {
				console.log("replicate resumed");
			}).on('denied', function (err) {
				console.log("a document failed to replicate", err);
			}).on('complete', function (info) {
				console.log("usertask db sync completed>>>", info);
			}).on('error', function (err) {
				console.log("handle error", err);
			});
		utilityService.setBusy(false);
	};

	function getLocalData() {
		var lDb = usertask.localDb.allDocs({
			include_docs: true
		});
		return lDb.then(function (result) {
			//console.log(result);
			var collection = [];

			result.rows.forEach(function (row) {
				collection.push(row.doc);
			});
			return collection;
		});
	}

	function allData() {
		return getLocalData().then(function (result) {
			return result;
		});
	}

	this.getData = function (query) {
		return allData().then(function (result) {
			var obj = {};
			obj.header = $filter('filter')(result, {
				_id: query.header_id
			}, true);
			obj.detail = $filter('filter')(result, {
				_id: query.detail_id
			}, true);
			obj.footer = $filter('filter')(result, {
				_id: query.footer_id
			}, true);
			return obj;
		});
	};

	this.updateData = function (updateObj) {
		var id = updateObj._id;
		return usertask.localDb.get(id).then(function () {
			console.log("user task update data>>>", updateObj);
			return usertask.localDb.put(updateObj);
		}).then(function (response) {
			return response;
		}).catch(function (err) {
			console.log(err);
		});
	};

	this.getUserTask = function (page_id) {
		console.log("get local user_task page_id: ", page_id);
		var userTaskObj = {};
		return this.localDb.query(function (doc, emit) {
			if (doc.page_id === page_id) {
				emit(doc);
			}
		}).then(function (result) {
			if (result.rows.length > 0) {
				userTaskObj = result.rows[0].key;
				return userTaskObj;
			} else {
				//auto-generate an _id
				return usertask.localDb.post({
					"page_id": page_id,
					"synchronized": 0
				}).then(function (res) {
					userTaskObj = {
						"_id": res.id,
						"_rev": res.rev,
						"page_id": page_id,
						"synchronized": 0
					};
					return userTaskObj;
				}).catch(function (err) {
					console.log(err);
				});
			}
		}).catch(function (err) {
			console.log(err);
		});
	};

	this.getDirtyList = function () {
		var dirtyList = [];
		return this.localDb.query(function (doc, emit) {
			if (doc.dirty === 1) {
				emit(doc);
			}
		}).then(function (result) {
			for (var ind = 0; ind < result.rows.length; ind++) {
				dirtyList[ind] = result.rows[ind].key;
			}
			return dirtyList;
		}).catch(function (err) {
			console.log(err);
		});
	};
	return usertask;
});
DomenowApp.factory('Localpages', function ($q, $filter, utilityService, Template) {
	'use strict';

	var localpage = this;
	this.localDbName = 'local_page_db';
	this.dbOptions = {
		revs_limit: 1,
		auto_compaction: true
	};
	this.localDb = new PouchDB(this.localDbName, this.dbOptions);

	this.synced = -1;

	function getLocalData() {
		var lDb = localpage.localDb.allDocs({
			include_docs: true
		});
		return lDb.then(function (result) {
			//console.log(result);
			var collection = [];

			result.rows.forEach(function (row) {
				collection.push(row.doc);
			});
			return collection;
		});
	}

	function allData() {
		return getLocalData().then(function (result) {
			return result;
		});
	}

	this.getData = function (query) {
		return allData().then(function (result) {
			var obj = {};
			obj.header = $filter('filter')(result, {
				_id: query.header_id
			}, true);
			obj.detail = $filter('filter')(result, {
				_id: query.detail_id
			}, true);
			obj.footer = $filter('filter')(result, {
				_id: query.footer_id
			}, true);
			return obj;
		});
	};

	this.updatePageData = function (pageObj) {
		pageObj._id = pageObj._id.toString();
		return this.localDb.query(function (doc, emit) {
			if (doc._id == pageObj._id) {
				emit(doc);
			}
		}).then(function (result) {
			if (result.rows.length > 0) {
				var key = result.rows[0].key;
				pageObj._rev = key._rev;
				return localpage.localDb.put(pageObj);
			} else {
				return localpage.localDb.put(pageObj);
			}
		}).catch(function (err) {
			console.log(err);
		});
	};
	this.getPage = function (page_id) {
		page_id = page_id.toString();
		return this.localDb.get(page_id).then(function (doc) {
			console.log("get local page result>>>", doc);
			doc.page_id = doc._id;
			var query = {
				header_id: doc.task.header_template_id,
				detail_id: doc.task.detail_template_id,
				footer_id: doc.task.footer_template_id
			};
			return Template.getData(query).then(function (res) {
				console.log("Template result>>>", res);
				var templateObj = {
					header: res.header[0],
					detail: res.detail[0],
					footer: res.footer[0]
				};
				doc.task.template = templateObj;
				return doc;
			});
		}).catch(function (err) {
			console.log(err);
			return err;
		});
	};
	return localpage;
});

DomenowApp.factory('STATIC_PAGES', function ($localStorage) {
	return {
		login: function () {
      console.log("going to server local login page");
      //remove any stored access_token if present in browser
      delete $localStorage.access_token;
      delete $localStorage.push_accepted;
      
			return {
				page_id: 1,
				status: 1,
				task: {
					task_name: "Login",
					task_id: "1_0",
					parent_id: "0",
					from_page_id: 0,
					date_created: "2017-03-15T10:29:39.453Z",
					child_task_id: null,
					template: {
						detail: {
							_id: "1_d",
							_rev: "17-c132016369c9335f48ffde72c4716c67",
							js: "",
							name: "Login Form",
							table: "template",
							html: '<ion-content padding="true"><div class="login-container"><h1 style="text-align:center;">{{title}}</h1><ion-list><div class="row responsive-xs"><div class="col"><label class="item item-input item-select" style="min-height:46px;"><select name="countryCode" ng-model="user.country_code"><option data-countryCode="GB" value="44">UK (+44)</option><option data-countryCode="US" value="1">USA (+1)</option><optgroup label="Other countries"><option data-countryCode="DZ" value="213">Algeria (+213)</option><option data-countryCode="AD" value="376">Andorra (+376)</option><option data-countryCode="AO" value="244">Angola (+244)</option><option data-countryCode="AI" value="1264">Anguilla (+1264)</option><option data-countryCode="AG" value="1268">Antigua &amp; Barbuda (+1268)</option><option data-countryCode="AR" value="54">Argentina (+54)</option><option data-countryCode="AM" value="374">Armenia (+374)</option><option data-countryCode="AW" value="297">Aruba (+297)</option><option data-countryCode="AU" value="61">Australia (+61)</option><option data-countryCode="AT" value="43">Austria (+43)</option><option data-countryCode="AZ" value="994">Azerbaijan (+994)</option><option data-countryCode="BS" value="1242">Bahamas (+1242)</option><option data-countryCode="BH" value="973">Bahrain (+973)</option><option data-countryCode="BD" value="880">Bangladesh (+880)</option><option data-countryCode="BB" value="1246">Barbados (+1246)</option><option data-countryCode="BY" value="375">Belarus (+375)</option><option data-countryCode="BE" value="32">Belgium (+32)</option><option data-countryCode="BZ" value="501">Belize (+501)</option><option data-countryCode="BJ" value="229">Benin (+229)</option><option data-countryCode="BM" value="1441">Bermuda (+1441)</option><option data-countryCode="BT" value="975">Bhutan (+975)</option><option data-countryCode="BO" value="591">Bolivia (+591)</option><option data-countryCode="BA" value="387">Bosnia Herzegovina (+387)</option><option data-countryCode="BW" value="267">Botswana (+267)</option><option data-countryCode="BR" value="55">Brazil (+55)</option><option data-countryCode="BN" value="673">Brunei (+673)</option><option data-countryCode="BG" value="359">Bulgaria (+359)</option><option data-countryCode="BF" value="226">Burkina Faso (+226)</option><option data-countryCode="BI" value="257">Burundi (+257)</option><option data-countryCode="KH" value="855">Cambodia (+855)</option><option data-countryCode="CM" value="237">Cameroon (+237)</option><option data-countryCode="CA" value="1">Canada (+1)</option><option data-countryCode="CV" value="238">Cape Verde Islands (+238)</option><option data-countryCode="KY" value="1345">Cayman Islands (+1345)</option><option data-countryCode="CF" value="236">Central African Republic (+236)</option><option data-countryCode="CL" value="56">Chile (+56)</option><option data-countryCode="CN" value="86">China (+86)</option><option data-countryCode="CO" value="57">Colombia (+57)</option><option data-countryCode="KM" value="269">Comoros (+269)</option><option data-countryCode="CG" value="242">Congo (+242)</option><option data-countryCode="CK" value="682">Cook Islands (+682)</option><option data-countryCode="CR" value="506">Costa Rica (+506)</option><option data-countryCode="HR" value="385">Croatia (+385)</option><option data-countryCode="CU" value="53">Cuba (+53)</option><option data-countryCode="CY" value="90392">Cyprus North (+90392)</option><option data-countryCode="CY" value="357">Cyprus South (+357)</option><option data-countryCode="CZ" value="42">Czech Republic (+42)</option><option data-countryCode="DK" value="45">Denmark (+45)</option><option data-countryCode="DJ" value="253">Djibouti (+253)</option><option data-countryCode="DM" value="1809">Dominica (+1809)</option><option data-countryCode="DO" value="1809">Dominican Republic (+1809)</option><option data-countryCode="EC" value="593">Ecuador (+593)</option><option data-countryCode="EG" value="20">Egypt (+20)</option><option data-countryCode="SV" value="503">El Salvador (+503)</option><option data-countryCode="GQ" value="240">Equatorial Guinea (+240)</option><option data-countryCode="ER" value="291">Eritrea (+291)</option><option data-countryCode="EE" value="372">Estonia (+372)</option><option data-countryCode="ET" value="251">Ethiopia (+251)</option><option data-countryCode="FK" value="500">Falkland Islands (+500)</option><option data-countryCode="FO" value="298">Faroe Islands (+298)</option><option data-countryCode="FJ" value="679">Fiji (+679)</option><option data-countryCode="FI" value="358">Finland (+358)</option><option data-countryCode="FR" value="33">France (+33)</option><option data-countryCode="GF" value="594">French Guiana (+594)</option><option data-countryCode="PF" value="689">French Polynesia (+689)</option><option data-countryCode="GA" value="241">Gabon (+241)</option><option data-countryCode="GM" value="220">Gambia (+220)</option><option data-countryCode="GE" value="7880">Georgia (+7880)</option><option data-countryCode="DE" value="49">Germany (+49)</option><option data-countryCode="GH" value="233">Ghana (+233)</option><option data-countryCode="GI" value="350">Gibraltar (+350)</option><option data-countryCode="GR" value="30">Greece (+30)</option><option data-countryCode="GL" value="299">Greenland (+299)</option><option data-countryCode="GD" value="1473">Grenada (+1473)</option><option data-countryCode="GP" value="590">Guadeloupe (+590)</option><option data-countryCode="GU" value="671">Guam (+671)</option><option data-countryCode="GT" value="502">Guatemala (+502)</option><option data-countryCode="GN" value="224">Guinea (+224)</option><option data-countryCode="GW" value="245">Guinea - Bissau (+245)</option><option data-countryCode="GY" value="592">Guyana (+592)</option><option data-countryCode="HT" value="509">Haiti (+509)</option><option data-countryCode="HN" value="504">Honduras (+504)</option><option data-countryCode="HK" value="852">Hong Kong (+852)</option><option data-countryCode="HU" value="36">Hungary (+36)</option><option data-countryCode="IS" value="354">Iceland (+354)</option><option data-countryCode="IN" value="91">India (+91)</option><option data-countryCode="ID" value="62">Indonesia (+62)</option><option data-countryCode="IR" value="98">Iran (+98)</option><option data-countryCode="IQ" value="964">Iraq (+964)</option><option data-countryCode="IE" value="353">Ireland (+353)</option><option data-countryCode="IL" value="972">Israel (+972)</option><option data-countryCode="IT" value="39">Italy (+39)</option><option data-countryCode="JM" value="1876">Jamaica (+1876)</option><option data-countryCode="JP" value="81">Japan (+81)</option><option data-countryCode="JO" value="962">Jordan (+962)</option><option data-countryCode="KZ" value="7">Kazakhstan (+7)</option><option data-countryCode="KE" value="254">Kenya (+254)</option><option data-countryCode="KI" value="686">Kiribati (+686)</option><option data-countryCode="KP" value="850">Korea North (+850)</option><option data-countryCode="KR" value="82">Korea South (+82)</option><option data-countryCode="KW" value="965">Kuwait (+965)</option><option data-countryCode="KG" value="996">Kyrgyzstan (+996)</option><option data-countryCode="LA" value="856">Laos (+856)</option><option data-countryCode="LV" value="371">Latvia (+371)</option><option data-countryCode="LB" value="961">Lebanon (+961)</option><option data-countryCode="LS" value="266">Lesotho (+266)</option><option data-countryCode="LR" value="231">Liberia (+231)</option><option data-countryCode="LY" value="218">Libya (+218)</option><option data-countryCode="LI" value="417">Liechtenstein (+417)</option><option data-countryCode="LT" value="370">Lithuania (+370)</option><option data-countryCode="LU" value="352">Luxembourg (+352)</option><option data-countryCode="MO" value="853">Macao (+853)</option><option data-countryCode="MK" value="389">Macedonia (+389)</option><option data-countryCode="MG" value="261">Madagascar (+261)</option><option data-countryCode="MW" value="265">Malawi (+265)</option><option data-countryCode="MY" value="60">Malaysia (+60)</option><option data-countryCode="MV" value="960">Maldives (+960)</option><option data-countryCode="ML" value="223">Mali (+223)</option><option data-countryCode="MT" value="356">Malta (+356)</option><option data-countryCode="MH" value="692">Marshall Islands (+692)</option><option data-countryCode="MQ" value="596">Martinique (+596)</option><option data-countryCode="MR" value="222">Mauritania (+222)</option><option data-countryCode="YT" value="269">Mayotte (+269)</option><option data-countryCode="MX" value="52">Mexico (+52)</option><option data-countryCode="FM" value="691">Micronesia (+691)</option><option data-countryCode="MD" value="373">Moldova (+373)</option><option data-countryCode="MC" value="377">Monaco (+377)</option><option data-countryCode="MN" value="976">Mongolia (+976)</option><option data-countryCode="MS" value="1664">Montserrat (+1664)</option><option data-countryCode="MA" value="212">Morocco (+212)</option><option data-countryCode="MZ" value="258">Mozambique (+258)</option><option data-countryCode="MN" value="95">Myanmar (+95)</option><option data-countryCode="NA" value="264">Namibia (+264)</option><option data-countryCode="NR" value="674">Nauru (+674)</option><option data-countryCode="NP" value="977">Nepal (+977)</option><option data-countryCode="NL" value="31">Netherlands (+31)</option><option data-countryCode="NC" value="687">New Caledonia (+687)</option><option data-countryCode="NZ" value="64">New Zealand (+64)</option><option data-countryCode="NI" value="505">Nicaragua (+505)</option><option data-countryCode="NE" value="227">Niger (+227)</option><option data-countryCode="NG" value="234">Nigeria (+234)</option><option data-countryCode="NU" value="683">Niue (+683)</option><option data-countryCode="NF" value="672">Norfolk Islands (+672)</option><option data-countryCode="NP" value="670">Northern Marianas (+670)</option><option data-countryCode="NO" value="47">Norway (+47)</option><option data-countryCode="OM" value="968">Oman (+968)</option><option data-countryCode="PW" value="680">Palau (+680)</option><option data-countryCode="PA" value="507">Panama (+507)</option><option data-countryCode="PG" value="675">Papua New Guinea (+675)</option><option data-countryCode="PY" value="595">Paraguay (+595)</option><option data-countryCode="PE" value="51">Peru (+51)</option><option data-countryCode="PH" value="63">Philippines (+63)</option><option data-countryCode="PL" value="48">Poland (+48)</option><option data-countryCode="PT" value="351">Portugal (+351)</option><option data-countryCode="PR" value="1787">Puerto Rico (+1787)</option><option data-countryCode="QA" value="974">Qatar (+974)</option><option data-countryCode="RE" value="262">Reunion (+262)</option><option data-countryCode="RO" value="40">Romania (+40)</option><option data-countryCode="RU" value="7">Russia (+7)</option><option data-countryCode="RW" value="250">Rwanda (+250)</option><option data-countryCode="SM" value="378">San Marino (+378)</option><option data-countryCode="ST" value="239">Sao Tome &amp; Principe (+239)</option><option data-countryCode="SA" value="966">Saudi Arabia (+966)</option><option data-countryCode="SN" value="221">Senegal (+221)</option><option data-countryCode="CS" value="381">Serbia (+381)</option><option data-countryCode="SC" value="248">Seychelles (+248)</option><option data-countryCode="SL" value="232">Sierra Leone (+232)</option><option data-countryCode="SG" value="65">Singapore (+65)</option><option data-countryCode="SK" value="421">Slovak Republic (+421)</option><option data-countryCode="SI" value="386">Slovenia (+386)</option><option data-countryCode="SB" value="677">Solomon Islands (+677)</option><option data-countryCode="SO" value="252">Somalia (+252)</option><option data-countryCode="ZA" value="27">South Africa (+27)</option><option data-countryCode="ES" value="34">Spain (+34)</option><option data-countryCode="LK" value="94">Sri Lanka (+94)</option><option data-countryCode="SH" value="290">St. Helena (+290)</option><option data-countryCode="KN" value="1869">St. Kitts (+1869)</option><option data-countryCode="SC" value="1758">St. Lucia (+1758)</option><option data-countryCode="SD" value="249">Sudan (+249)</option><option data-countryCode="SR" value="597">Suriname (+597)</option><option data-countryCode="SZ" value="268">Swaziland (+268)</option><option data-countryCode="SE" value="46">Sweden (+46)</option><option data-countryCode="CH" value="41">Switzerland (+41)</option><option data-countryCode="SI" value="963">Syria (+963)</option><option data-countryCode="TW" value="886">Taiwan (+886)</option><option data-countryCode="TJ" value="7">Tajikstan (+7)</option><option data-countryCode="TH" value="66">Thailand (+66)</option><option data-countryCode="TG" value="228">Togo (+228)</option><option data-countryCode="TO" value="676">Tonga (+676)</option><option data-countryCode="TT" value="1868">Trinidad &amp; Tobago (+1868)</option><option data-countryCode="TN" value="216">Tunisia (+216)</option><option data-countryCode="TR" value="90">Turkey (+90)</option><option data-countryCode="TM" value="7">Turkmenistan (+7)</option><option data-countryCode="TM" value="993">Turkmenistan (+993)</option><option data-countryCode="TC" value="1649">Turks &amp; Caicos Islands (+1649)</option><option data-countryCode="TV" value="688">Tuvalu (+688)</option><option data-countryCode="UG" value="256">Uganda (+256)</option><option data-countryCode="UA" value="380">Ukraine (+380)</option><option data-countryCode="AE" value="971">United Arab Emirates (+971)</option><option data-countryCode="UY" value="598">Uruguay (+598)</option><option data-countryCode="UZ" value="7">Uzbekistan (+7)</option><option data-countryCode="VU" value="678">Vanuatu (+678)</option><option data-countryCode="VA" value="379">Vatican City (+379)</option><option data-countryCode="VE" value="58">Venezuela (+58)</option><option data-countryCode="VN" value="84">Vietnam (+84)</option><option data-countryCode="VG" value="84">Virgin Islands - British (+1284)</option><option data-countryCode="VI" value="84">Virgin Islands - US (+1340)</option><option data-countryCode="WF" value="681">Wallis &amp; Futuna (+681)</option><option data-countryCode="YE" value="969">Yemen (North)(+969)</option><option data-countryCode="YE" value="967">Yemen (South)(+967)</option><option data-countryCode="ZM" value="260">Zambia (+260)</option><option data-countryCode="ZW" value="263">Zimbabwe (+263)</option></optgroup></select></label></div><div class="col col-75"><label class="item item-input"><input type="text" id="phone" ng-model="user.phone" placeholder="Phone" ng-change="checkNumber(user.phone)"></label></div></div></ion-list><div style="height: 40px;" class="spacer"></div><button class="button button-stable button-block" id="login-button" ng-click="login(user)">NEXT</button></div></ion-content>'
						},
						footer: {
							_id: "1_f",
							_rev: "1-4017312ca4533ad832c19a06d1d79b5d",
							html: "",
							js: "",
							name: "",
							table: "template"
						},
						header: {
							_id: "1_h",
							_rev: "14-f23236b6f2180c633cddaea449130adb",
							html: "",
							name: "",
							table: "template",
							js: "var task_info = myService.getTaskInfo();\n$scope.title = task_info.task_name;\nvar logged_number = seprateNumber($localStorage.logger_user_phone);\n\n$scope.user = {\n\tphone: logged_number.number,\n\tcountry_code: logged_number.countryCode \n};\n\n$scope.login = function(user) {\n\tvar number = user.phone ;\n\tif (!number) {\n\t\tutilityService.showAlert(\"Please enter phone number\").then(function(res) {\n\t\t\t$timeout(function() { $(\"#phone\").focus(); }, 100);\n\t\t});\n\t\treturn false;\n\t}\n\t\n\tnumber = number.replace(/[- )(]/g,'').trim();\n\tvar reg = new RegExp('^(0|[1-9][0-9]*)$');\n\t\n\tif(!reg.test(number)){\n\t\tutilityService.showAlert(\"Please enter valid phone number\").then(function(res) {\n\t\t\t$timeout(function() { $(\"#phone\").focus(); }, 100);\n\t\t});\n\t\treturn false;\n\t}\n\tnumber = user.country_code + number ;\n\tvar endpoint = $scope.api_url + \"/api/login\";\n\tvar parameters = {\n\t\tphone:\tnumber,\n\t\taccess_token:\t$localStorage.access_token,\n\t\tdevice_id : $localStorage.device_id ,\n\t\tpush_accepted: 1\n\t};\n\n\tif(number == $localStorage.logger_user_phone){\n\t\tutilityService.setBusy(true);\n\t\t$http.post(endpoint, parameters).then(function(res) {\n\t\t\tvar res_data = res.data;\n\t\t\tconsole.log(\"login res_data>>>\", res_data);\n\t\t\t$localStorage.access_token = res_data.access_token;\n\t\t\tmyService.apiResult = res_data;\n\t\t\tutilityService.setBusy(false);\n\t\t\tif(res_data.page_id === 2){\n\t\t\t\t$localStorage.logger_user_phone = number;\n\t\t\t}\n\t\t\t$scope.goPage(res_data.page_id);\n\t\t});\n\t}else{\n\t\tutilityService.setBusy(true);\n\t\t$http.post(endpoint, parameters).then(function(res) {\n\t\t\tvar res_data = res.data;\n\t\t\tconsole.log(\"login res_data>>>\", res_data);\n\t\t\t$localStorage.access_token = res_data.access_token;\n\t\t\tmyService.apiResult = res_data;\n\t\t\tutilityService.setBusy(false);\n\t\t\tif(res_data.page_id === 2){\n\t\t\t\t$localStorage.logger_user_phone = number;\n\t\t\t}\n\t\t\t$scope.goPage(res_data.page_id);\n\t\t});\n\t}\n};\n\n$scope.checkNumber = function(){\n\tif ($scope.user !== undefined && $scope.user.phone !== \"\") {\n\t\tvar charLength = ('' + $scope.user.phone).length;\n\t\tif (charLength == 9) {\n\t\t\tif (phone1 === '') {\n\t\t\t\tphone1 = $scope.user.phone.toString();\n\t\t\t\t$scope.user.phone = $scope.user.phone.toString();\n\t\t\t} else {\n\t\t\t\t$scope.user.phone = phone1;\n\t\t\t\tphone1 = '';\n\t\t\t}\n\t\t} else if (charLength == 10) {\n\t\t\tvar phone = $scope.user.phone.toString();\n\t\t\tformatted = '(' + phone.substr(0, 3) + ') ' + phone.substr(3, 3) + '-' + phone.substr(6, 4);\n\t\t\t$scope.user.phone = formatted;\n\t\t} else {\n\t\t\tif (charLength < 9) {\n\t\t\t\tphone1 = '';\n\t\t\t}\n\t\t\tvar phone2 = $scope.user.phone.toString();\n\t\t\t$scope.user.phone = phone2;\n\t\t}\n\t}\n};\n\nfunction seprateNumber(number){\n\tvar obj = {};\n\tif(number !== null && number !== undefined){\n\t\tobj.countryCode = number.substr(0, number.length - 10);\n\t\tnumber \t\t\t= number.substr(number.length - 10, number.length);\n\t\tobj.number = '(' + number.substr(0, 3) + ') ' + number.substr(3, 3) + '-' + number.substr(6, 4);\n\t}else{\n\t\tobj.countryCode = \"1\";\n\t\tobj.number = \"\";\n\t}\n\treturn obj ;\n}"
						}
					}
				},
				detail: [{
					_id: "1",
					count: {
						active: 1,
						unread: 0
					},
					date_created: "",
					from_user: {},
					from_user_id: "9092618242e9895441bc9e978fa15098",
					image: "",
					page_id: 1,
					task_id: "1_0",
					to_page_id: 0,
					type: {},
					user_id: "23d5c58422026c68269cd6e9ac22ca4a",
					user_incoming: {},
					watson_incoming: {}
				}]
			};
		}
	};
});