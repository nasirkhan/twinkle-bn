/*
 ****************************************
 *** twinklespeedy.js: CSD module
 ****************************************
 * Mode of invocation:     Tab ("CSD")
 * Active on:              Non-special, existing pages
 * Config directives in:   TwinkleConfig
 *
 * NOTE FOR DEVELOPERS:
 *   If adding a new criterion, check out the default values of the CSD preferences
 *   in twinkle.header.js, and add your new criterion to those if you think it would
 *   be good. 
 */

Twinkle.speedy = function twinklespeedy() {
	// Disable on:
	// * special pages
	// * non-existent pages
	if (mw.config.get('wgNamespaceNumber') < 0 || !mw.config.get('wgArticleId')) {
		return;
	}

	if ( userIsInGroup( 'sysop' ) ) {
		$(twAddPortletLink("#", "দ্রুত অপসারণ", "tw-csd", "WP:CSD মতে দ্রুত অপসারণ ", "")).click(Twinkle.speedy.callback);
	} else if (twinkleUserAuthorized) {
		$(twAddPortletLink("#", "দ্রুত অপসারণ", "tw-csd", "WP:CSD মতে দ্রুত অপসারণের আবেদন", "")).click(Twinkle.speedy.callback);
	} else {
		$(twAddPortletLink("#", 'দ্রুত অপসারণ', 'tw-csd', 'WP:CSD মতে দ্রুত অপসারণের আবেদন', '')).click(function() {
			alert("নবাগত,আপনার অ্যাকাঊন্টটি  টুইংকল ব্যবহার করার জন্য নয়।");
		});
	}
};

// This function is run when the CSD tab/header link is clicked
Twinkle.speedy.callback = function twinklespeedyCallback() {
	Twinkle.speedy.initDialog(userIsInGroup( 'sysop' ) ? Twinkle.speedy.callback.evaluateSysop : Twinkle.speedy.callback.evaluateUser, true);
};

Twinkle.speedy.dialog = null;
// Prepares the speedy deletion dialog and displays it
// Parameters:
//  - callbackfunc: the function to call when the dialog box is submitted
//  - firstTime: is this the first time? (false during a db-multiple run, true otherwise)
//  - content: (optional) a div element in which the form content should be rendered - allows
//    for placing content in an existing dialog box
Twinkle.speedy.initDialog = function twinklespeedyInitDialog(callbackfunc, firstTime, content) {
	var dialog;
	if (!content)
	{
		Twinkle.speedy.dialog = new SimpleWindow( Twinkle.getPref('speedyWindowWidth'), Twinkle.getPref('speedyWindowHeight') );
		dialog = Twinkle.speedy.dialog;
		dialog.setTitle( "দ্রুত  অপসারণের  বিচারধারা নির্বাচন করুন" );
		dialog.setScriptName( "টুইংকল" );
		dialog.addFooterLink( "দ্রুত অপসারণের নীতিমালা", "WP:CSD" );
		dialog.addFooterLink( "টুইংকল সাহায্য", "WP:TW/DOC#speedy" );
	}

	var form = new QuickForm( callbackfunc, 'change' );
	if( firstTime && userIsInGroup( 'sysop' ) ) {
		form.append( {
				type: 'checkbox',
				list: [
					{
						label: 'কেবলমাত্র ট্যাগ বসান, অপসারণ করবেন না।',
						value: 'tag_only',
						name: 'tag_only',
						tooltip: 'যদি আপনি শুধুমাত্র ট্যাগ দিতে চান অপসারণ না করে।',
						checked : Twinkle.getPref('deleteSysopDefaultToTag'),
						event: function( event ) {
							// enable/disable notify checkbox
							event.target.form.notify.disabled = !event.target.checked;
							event.target.form.notify.checked = event.target.checked;
							// enable/disable talk page checkbox
							if (event.target.form.talkpage) {
								event.target.form.talkpage.disabled = event.target.checked;
								event.target.form.talkpage.checked = !event.target.checked && Twinkle.getPref('deleteTalkPageOnDelete');
							}
							// enable/disable redirects checkbox
							event.target.form.redirects.disabled = event.target.checked;
							event.target.form.redirects.checked = !event.target.checked;
							// enable/disable multiple
							$(event.target.form).find('input[name="csd"][value="multiple"]')[0].disabled = !event.target.checked;
							event.stopPropagation();
						}
					}
				]
			} );
		form.append( { type: 'header', label: 'Delete-related options' } );
		if (mw.config.get('wgNamespaceNumber') % 2 === 0 && (mw.config.get('wgNamespaceNumber') !== 2 || (/\//).test(mw.config.get('wgTitle')))) {  // hide option for user pages, to avoid accidentally deleting user talk page
			form.append( {
				type: 'checkbox',
				list: [
					{
						label: 'আলাপ পাতাও অপসারণ করুন।',
						value: 'talkpage',
						name: 'talkpage',
						tooltip: " আপনি যদি ইহা নির্বাচন করেন তাহলে  সংশ্লিষ্ট আলাপ পাতাও অপসারণ  হবে।",
						checked: Twinkle.getPref('deleteTalkPageOnDelete'),
						disabled: Twinkle.getPref('deleteSysopDefaultToTag'),
						event: function( event ) {
							event.stopPropagation();
						}
					}
				]
			} );
		}
		form.append( {
				type: 'checkbox',
				list: [
					{
						label: 'সেইসাথে সকল পুনর্নির্দেশনাগুলি অপসারণ কর।',
						value: 'redirects',
						name: 'redirects',
						tooltip: "এর মাধ্যমে আপনি সকল পুনর্নির্দেশনাগুলি অপসারণ করতে পারবেন।",
						checked: true,
						disabled: Twinkle.getPref('deleteSysopDefaultToTag'),
						event: function( event ) {
							event.stopPropagation();
						}
					}
				]
			} );
		form.append( { type: 'header', label: 'ট্যাগ সম্পর্কিয় পছন্দ' } );
	}

	// don't show this notification checkbox for db-multiple, as the value is ignored
	// XXX currently not possible to turn off notification when using db-multiple
	if (firstTime) {
		form.append( {
				type: 'checkbox',
				list: [
					{
						label: 'যদি সম্ভব হয় প্রনেতাকে জানান',
						value: 'notify',
						name: 'notify',
						tooltip: "A notification template will be placed on the talk page of the creator, IF you have a notification enabled in your Twinkle preferences " +
							"for the criterion you choose AND this box is checked. The creator may be welcomed as well.",
						checked: !userIsInGroup( 'sysop' ) || Twinkle.getPref('deleteSysopDefaultToTag'),
						disabled: userIsInGroup( 'sysop' ) && !Twinkle.getPref('deleteSysopDefaultToTag'),
						event: function( event ) {
							event.stopPropagation();
						}
					}
				]
			}
		);
	} else {
		form.append( { type:'header', label: 'Tagging with {{db-multiple}}: Criterion ' + (Twinkle.speedy.dbmultipleCriteria.length + 1) } );
	}

	if (firstTime) {
		form.append( { type: 'radio', name: 'csd',
			list: [
				{
					label: 'অধিক বিচার ধারা মতে ট্যাগ যুক্ত করা',
					value: 'multiple',
					tooltip: 'Opens a series of further dialogs, allowing you to specify all the criteria you want to tag this page with.',
					disabled: userIsInGroup('sysop') && !Twinkle.getPref('deleteSysopDefaultToTag')
				}
			]
		} );
	} else if (Twinkle.speedy.dbmultipleCriteria.length > 0) {
		form.append( { type: 'radio', name: 'csd',
			list: [
				{
					label: 'আর কোনো বিচার ধারা প্রয়োগ করা যাবে না- ট্যাগিং সম্পুর্ণ করা হয়েছে',
					value: 'multiple-finish'
				}
			]
		} );
	}

	var namespace = mw.config.get('wgNamespaceNumber');
	if (namespace % 2 === 1 && namespace !== 3) {  // talk pages, but not user talk pages
		form.append( { type: 'header', label: 'আলাপ পাতা' } );
		form.append( { type: 'radio', name: 'csd', list: Twinkle.speedy.talkList } );
	}

	switch (namespace) {
		case 0:  // article
		case 1:  // talk
			form.append( { type: 'header', label: 'নিবন্ধ' } );
			form.append( { type: 'radio', name: 'csd', list: Twinkle.speedy.getArticleList(!firstTime) } );
			break;

		case 2:  // user
		case 3:  // user talk
			form.append( { type: 'header', label: 'ব্যবহারকারি পাতা' } );
			form.append( { type: 'radio', name: 'csd', list: Twinkle.speedy.userList } );
			break;

		case 6:  // file
		case 7:  // file talk
			form.append( { type: 'header', label: 'ফাইল' } );
			form.append( { type: 'radio', name: 'csd', list: Twinkle.speedy.getFileList(!firstTime) } );
			form.append( { type: 'div', label: 'Tagging for CSD F4 (no license), F5 (orphaned fair use), F6 (no fair use rationale), and F11 (no permission) can be done using Twinkle\'s "DI" tab.' } );
			break;

		case 10:  // template
		case 11:  // template talk
			form.append( { type: 'header', label: 'টেমপ্লেট' } );
			form.append( { type: 'radio', name: 'csd', list: Twinkle.speedy.getTemplateList(!firstTime) } );
			break;

		case 14:  // category
		case 15:  // category talk
			form.append( { type: 'header', label: 'বিষয়শ্রেণী' } );
			form.append( { type: 'radio', name: 'csd', list: Twinkle.speedy.categoryList } );
			break;

		case 100:  // portal
		case 101:  // portal talk
			form.append( { type: 'header', label: 'প্রবেশদ্বার' } );
			form.append( { type: 'radio', name: 'csd', list: Twinkle.speedy.getPortalList(!firstTime) } );
			break;

		default:
			break;
	}

	form.append( { type: 'header', label: 'সাধারণ বিচারধারা' } );
	form.append( { type: 'radio', name: 'csd', list: Twinkle.speedy.getGeneralList(!firstTime) });

	form.append( { type: 'header', label: 'পুনর্নির্দেশনা' } );
	form.append( { type: 'radio', name: 'csd', list: Twinkle.speedy.redirectList } );

	var result = form.render();
	if (dialog)
	{
		// render new dialog
		dialog.setContent( result );
		dialog.display();
	}
	else
	{
		// place the form content into the existing dialog box
		content.textContent = ''; // clear children
		content.appendChild(result);
	}
};

Twinkle.speedy.talkList = [
	{
		label: 'স৮:ইতিমধ্যেই অপসারিত বা অস্তিত্বহীন পাতার ওপর নির্ভরশীল পাতা বা আলাপ পাতা',
		value: 'talk',
		tooltip: 'ইতিমধ্যেই অপসারিত বা অস্তিত্বহীন পাতার ওপর নির্ভরশীল পাতা বা আলাপ পাতা যদি আলাপ পাতায় কোনো গুরুতকপূর্ণ আলোচনা থেকে থাকে তা যথাস্থানে সরিয়ে নিন।'
	}
];

// this is a function to allow for db-multiple filtering
Twinkle.speedy.getFileList = function twinklespeedyGetFileList(multiple) {
	var result = [];
	result.push({
		label: 'ফ১:অনাবশ্যক ফাইল',
		value: 'redundantimage',
		tooltip: 'কমন্সে বা এই উইকিতে আগেই আছে এমন ফাইলের অনাবশ্যক ফাইল '
	});
	result.push({
		label: 'ফ২:বিকৃত বা  চিত্রহীন ফাইল',
		value: 'noimage',
		tooltip: 'বিকৃত বা  চিত্রহীন ফাইল তাও ট্যাগ করার বা অপসারণ করার আগে রিফ্রেশ করে দেখে নি '
	});
	if (!multiple) {
		result.push({
			label: 'ফ২:কমন্সে থাকা ফাইলের অপ্রয়োজনিয় বর্ননামূলক ফাইল।',
			value: 'fpcfail',
			tooltip: 'কমন্সে থাকা ফাইলের অপ্রয়োজনিয় বর্ননামূলক ফাইল।'
		});
	}
	result.push({
		label: 'ফ৩:লাইসেন্স তথ্য  সঠিক নয়',
		value: 'noncom',
		tooltip: 'লাইসেন্স তথ্য  সঠিক নয়'
	});
	if (userIsInGroup('sysop')) {
		result.push({
			label: 'ফ৪:লাইসেন্স তথ্য নেই',
			value: 'unksource',
			tooltip: 'লাইসেন্স তথ্য নেই বা অভাব আছে,উৎস উল্লেখিত নেই'
		});
		result.push({
			label: 'ফ৫:অব্যবহৃত মুক্তনয় কপিরাইটেড ফাইল ',
			value: 'unfree',
			tooltip: 'মুক্তনয় কপিরাইটেড ফাইল অবশ্যই ব্যবহার করতে হবে '
		});
		result.push({
			label: 'ফ৬:সৌজন্যমূলক ব্যবহারের যৌক্তিকতা নেই ',
			value: 'norat',
			tooltip: 'সৌজন্যমূলক ব্যবহারের যৌক্তিকতা নেই '
		});
	}
	result.push({
		label: 'ফ৭:পরিষ্কার ভাবে অবৈধ  সৌজন্যমূলক ব্যবহার ( ফেয়ার উইজ) ট্যাগ',
		value: 'badfairuse',  // same as below
		tooltip: 'পরিষ্কার ভাবে অবৈধ  সৌজন্যমূলক ব্যবহার ( ফেয়ার উইজ) ট্যাগ'
	});
	if (!multiple) {
		result.push({
			label: 'ফ৭:সৌজন্যমূলক ব্যবহার যার বানিজ্যিক ব্যবহার নেই',
			value: 'badfairuse',  // same as above
			tooltip: 'সৌজন্যমূলক ব্যবহার যার বানিজ্যিক ব্যবহার নেই'
		});
	}
	if (!multiple) {
		result.push({
			label: 'ফ৮:এই ফাইলের একই ভালো অধিক স্পষ্ট  ছবি উইকিমিডিয়া কমন্সে আছে',
			value: 'nowcommons',
			tooltip: 'এই ফাইলের একই ভালো অধিক স্পষ্ট  ছবি উইকিমিডিয়া কমন্সে আছে'
		});
	}
	result.push({
		label: 'ফ৯:দ্ব্যর্থহীন [[উইকিপিডিয়া:কপিরাইট|কপিরাইট লঙ্ঘন]]',
		value: 'imgcopyvio',
		tooltip: 'পরিষ্কার ভাবে  বোঝা যাচ্ছে ফাইল টি অয়েবসাইট থেকে কপি করা হয়েছে।'
	});
	result.push({
		label: 'ফ১০:অপ্রয়োজনিয় মিডিয়া ফাইল',
		value: 'badfiletype',
		tooltip: 'অপ্রয়োজনিয় মিডিয়া ফাইল (e.g. .doc, .pdf, or .xls ফাইল)'
	});
	if (userIsInGroup('sysop')) {
		result.push({
			label: 'ফ১১: অনুমতির কোনো প্রমান নেই',
			value: 'nopermission',
			tooltip: 'আপলোডার যদি কোনো তৃতীয় কোনো ব্যক্তির ছবি  বা কপিরাইটেড ছবি আপলোড করেন তার অনুমতির নেওয়া আবশ্যক'
		});
	}
	result.push({
		label: 'স৮:ইতিমধ্যেই অপসারিত বা অস্তিত্বহীন পাতার ওপর নির্ভরশীল পাতা',
		value: 'imagepage',
		tooltip: 'ইতিমধ্যেই অপসারিত বা অস্তিত্বহীন পাতার ওপর নির্ভরশীল পাতা'
	});
	return result;
};

Twinkle.speedy.getArticleList = function twinklespeedyGetArticleList(multiple) {
	var result = [];
	result.push({
		label: 'নি১:নিবন্ধের বিষয়বস্তু যাচাই করার মতো যথেষ্ট পরিমাণ লেখা নেই ',
		value: 'nocontext',
		tooltip: 'অসংলগ্ন,অর্থহীন,অ-উল্লেখযোগ্য  বা অবোধগম্য পাতা ,লিখিত কোনো বিষয় নেই বা  প্রাথমিক উল্লেখযোগ্যতার মাপকাঠি অনুসারে ঠিক নয়'
	});
	result.push({
		label: 'নি২:বাংলা ভাষার নয় বা আড়ষ্ট অনুবাদ বা মেশিন অনুবাদ',
		value: 'foreign',
		tooltip: 'বাংলা ভাষার নয় বা আড়ষ্ট অনুবাদ বা মেশিন অনুবাদ'
	});
	result.push({
		label: 'নি৩:খালি নিবন্ধ বা কোনো তথ্য নেই ',
		value: 'nocontent',
		tooltip: 'তথ্যছক,বহিঃসংযোগ,আরও দেখুন,তথ্যসূত্র প্রভৃতি অনুচ্ছে, বিষয়শ্রেণী ও টেমপ্লেট ট্যাগ,আন্তঃউইকি সংযোগসমূহ উপাদান/বাক্য হিসেবে গণ্য করা হয় না।  '
	});
	result.push({
		label: 'নি৫: নিবন্ধ যা অন্য কোনো প্রকল্পের জন্য প্রযোজ্য বা স্থানান্তরিত',
		value: 'transwiki',
		tooltip: 'নিবন্ধ যা অন্য কোনো প্রকল্পের জন্য প্রযোজ্য বা স্থানান্তরিত'
	});
	result.push({
		label: 'নি৭: বিষয়বস্তুর গুরুত্ব বা উল্লেখযোগ্যতা সম্মন্ধে কোনো ব্যাখ্যা নেই (জীবিত ব্যক্তি,প্রতিষ্ঠান বা ওয়েব কন্টেন্টের ওপর নিবন্ধ)',
		value: 'a7',
		tooltip: 'বিষয়বস্তুর গুরুত্ব বা উল্লেখযোগ্যতা সম্মন্ধে কোনো ব্যাখ্যা/প্রমান নেই (জীবিত ব্যক্তি,প্রতিষ্ঠান বা ওয়েব কন্টেন্টের ওপর নিবন্ধ)'
	});
	if (!multiple) {
		result.push({
			label: 'নি৭: উল্লেখযোগ্য ব্যক্তি নন।',
			value: 'person',
			tooltip: 'উল্লেখযোগ্য ব্যক্তি নন বা উল্লেখযোগ্যতা প্রমানের জন্য কোনো তথ্যসূত্র প্রদান করা হয়নি।'
		});
		result.push({
			label: 'নি৭: উল্লেখযোগ্য সঙ্গিত নয় বা  সঙ্গিতজ্ঞ নন ।',
			value: 'band',
			tooltip: 'উল্লেখযোগ্য সঙ্গিত নয় বা  সঙ্গিতজ্ঞ নন  বা গানের দল নয়।'
		});
		result.push({
			label: 'নি৭: উল্লেখযোগ্য ক্লাব নয়',
			value: 'club',
			tooltip: 'উল্লেখযোগ্য ক্লাব নয়'
		});
		result.push({
			label: 'নি৭:উল্লেখযোগ্য কোম্পানি বা সংস্থা নয়',
			value: 'corp',
			tooltip: 'উল্লেখযোগ্য কোম্পানি বা সংস্থা নয়'
		});
		result.push({
			label: 'নি৭: উল্লেখযোগ্য ওয়েব সাইট নয়',
			value: 'web',
			tooltip: 'উল্লেখযোগ্য ওয়েব সাইট নয়'
		});
		result.push({
			label: 'নি৭:উল্লেখযোগ্য প্রানী নয়',
			value: 'animal',
			tooltip: 'উল্লেখযোগ্য প্রানী নয়'
		});
	}
	result.push({
		label: 'A9:উল্লেখযোগ্য  গান বা অ্যালবাম নয়',
		value: 'a9',
		tooltip: 'উল্লেখযোগ্য  গান বা অ্যালবাম নয়'
	});
	result.push({
		label: 'A10:সাম্প্রতিকালে প্রণীত নিবন্ধ যা বর্তমানে রয়েছে এমন বিষয়বস্তুর প্রতিলিপি',
		value: 'a10',
		tooltip: 'সাম্প্রতিকালে প্রণীত নিবন্ধ যা বর্তমানে রয়েছে এমন বিষয়বস্তুর প্রতিলিপি'
	});
	return result;
};

Twinkle.speedy.categoryList = [
	{
		label: 'C1:খালি বিষয়শ্রেণী',
		value: 'catempty',
		tooltip: 'খালি বিষয়শ্রেণী '
	},
	{
		label: 'G8:নাম পরিবর্তন বা প্রতিলিপি',
		value: 'templatecat',
		tooltip: 'নাম পরিবর্তন বা প্রতিলিপি'
	}
];

Twinkle.speedy.userList = [
	{
		label: 'U1:লেখকের অনুরোধ বা লেখক কর্তৃক খালিকৃত পাতা',
		value: 'userreq',
		tooltip: 'লেখকের অনুরোধ বা লেখক কর্তৃক খালিকৃত পাতা'
	},
	{
		label: 'U2:অস্তিত্বহীন ব্যবহারকারি ',
		value: 'nouser',
		tooltip: 'অস্তিত্বহীন ব্যবহারকারি (পরিক্ষা করুন Special:Listusers)'
	},
	{
		label: 'U3:মুক্ত নয় এমন গ্যালারি',
		value: 'gallery',
		tooltip: 'মুক্ত নয় এমন গ্যালারি'
	}
];

Twinkle.speedy.getTemplateList = function twinklespeedyGetTemplateList(multiple) {
	var result = [];
	result.push({
		label: 'T2:টেমপ্লেট টি প্রতিষ্ঠিত নীতির  বিরুদ্ধ ভাবে উপস্থাপনা করা হয়েছে',
		value: 'policy',
		tooltip: 'টেমপ্লেট টি প্রতিষ্ঠিত নীতির  বিরুদ্ধ ভাবে উপস্থাপনা করা হয়েছে'
	});
	if (!multiple) {
		result.push({
			label: 'T3:অব্যবহৃত ও অপ্রয়োজনীয় টেমপ্লেট',
			value: 't3',
			tooltip: 'অব্যবহৃত ও অপ্রয়োজনীয় টেমপ্লেট'
		});
	}
	return result;
};

Twinkle.speedy.getPortalList = function twinklespeedyGetPortalList(multiple) {
	var result = [];
	if (!multiple) {
		result.push({
			label: 'P1:প্রবেশদ্বার পাতা যা নিবন্ধ হিসেবে দ্রুত অপসারণের জন্য বিবেচ্য',
			value: 'p1',
			tooltip: 'প্রবেশদ্বার পাতা যা নিবন্ধ হিসেবে দ্রুত অপসারণের জন্য বিবেচ্য'
		});
	}
	result.push({
		label: 'P2:পর্যাপ্ত নিবন্ধ বা বিষয়বস্তু নেই এমন বিষয়ের ওপর প্রণীত প্রবেশদ্বার পাতা',
		value: 'emptyportal',
		tooltip: 'পর্যাপ্ত নিবন্ধ বা বিষয়বস্তু নেই এমন বিষয়ের ওপর প্রণীত প্রবেশদ্বার পাতা'
	});
	return result;
};

Twinkle.speedy.getGeneralList = function twinklespeedyGetGeneralList(multiple) {
	var result = [];
	if (!multiple) {
		result.push({
			label: 'Custom rationale' + (userIsInGroup('sysop') ? ' (custom deletion reason)' : ' using {'+'{db}} template'),
			value: 'reason',
			tooltip: '{'+'{db}} is short for "delete because". At least one of the other deletion criteria must still apply to the page, and you should (must?) make mention of this in your rationale. This is not a "catch-all" for when you can\'t find any criteria that fit.'
		});
	}
	result.push({
		label: 'স১:অসংলগ্ন,অর্থহীন,অ-উল্লেখযোগ্য  বা অবোধগম্য পাতা ',
		value: 'nonsense',
		tooltip: 'অসংলগ্ন,অর্থহীন,অ-উল্লেখযোগ্য  বা অবোধগম্য পাতা '
	});
	result.push({
		label: 'স২:পরীক্ষামূলক পাতা',
		value: 'test',
		tooltip: 'পরীক্ষামূলক পাতা'
	});
	result.push({
		label: 'স৩:[[উইকিপিডিয়া:ধ্বংসপ্রবণতা|ধ্বংসপ্রবণতা]]',
		value: 'vandalism',
		tooltip: 'স্পষ্ট ধ্বংসপ্রবণতা'
	});
	if (!multiple) {
		result.push({
			label: 'স৩:চালাকি বা তামাসা',
			value: 'hoax',
			tooltip: 'চালাকি বা তামাসা'
		});
	}
	result.push({
		label: 'স৪:পূর্বে অপসারিত পাতা',
		value: 'repost',
		tooltip: 'পূর্বে অপসারিত পাতা'
	});
	result.push({
		label: 'স৫:বাধাদানকৃত বা নিষিদ্ধ ব্যবহারকারী কর্তৃক সৃষ্ট পাতা',
		value: 'banned',
		tooltip: 'বাধাদানকৃত বা নিষিদ্ধ ব্যবহারকারী কর্তৃক সৃষ্ট পাতা'
	});
	if (!multiple) {
		result.push({
			label: 'স৬:ইতিহাস একিকরণ',
			value: 'histmerge',
			tooltip: 'ইতিহাস একিকরণ করার জন্য অস্থায়িভাবে অপসারণ করা হল।'
		});
		result.push({
			label: 'স৬:স্থানান্তর',
			value: 'move',
			tooltip: 'অবিতর্কিত স্থানান্তর'
		});
		result.push({
			label: 'G6: XfD',
			value: 'xfd',
			tooltip: 'An admin has closed a deletion discussion (at AfD, FfD, RfD, TfD, CfD, SfD, or MfD) as "delete", but they didn\'t actually delete the page.'
		});
		result.push({
			label: 'G6: Unnecessary disambiguation page',
			value: 'disambig',
			tooltip: 'This only applies for orphaned disambiguation pages which either: (1) disambiguate two or fewer existing Wikipedia pages and whose title ends in "(disambiguation)" (i.e., there is a primary topic); or (2) disambiguates no (zero) existing Wikipedia pages, regardless of its title.'
		});
		result.push({
			label: 'G6: Redirect to malplaced disambiguation page',
			value: 'movedab',
			tooltip: 'This only applies for redirects to disambiguation pages ending in (disambiguation) where a primary topic does not exist.'
		});
		result.push({
			label: 'G6: Copy-and-paste page move',
			value: 'copypaste',
			tooltip: 'This only applies for a copy-and-paste page move of another page that needs to be temporarily deleted to make room for a clean page move.'
		});
	}
	result.push({
		label: 'G6: Housekeeping',
		value: 'g6',
		tooltip: 'Other non-controversial "housekeeping" tasks'
	});
	result.push({
		label: 'G7: Author requests deletion, or author blanked',
		value: 'author',
		tooltip: 'Any page for which deletion is requested by the original author in good faith, provided the page\'s only substantial content was added by its author. If the author blanks the page, this can also be taken as a deletion request.'
	});
	result.push({
		label: 'G8: Pages dependent on a non-existent or deleted page',
		value: 'g8',
		tooltip: 'such as talk pages with no corresponding subject page; subpages with no parent page; file pages without a corresponding file; redirects to invalid targets, such as nonexistent targets, redirect loops, and bad titles; or categories populated by deleted or retargeted templates. This excludes any page that is useful to the project, and in particular: deletion discussions that are not logged elsewhere, user and user talk pages, talk page archives, plausible redirects that can be changed to valid targets, and file pages or talk pages for files that exist on Wikimedia Commons.'
	});
	if (!multiple) {
		result.push({
			label: 'G8: Subpages with no parent page',
			value: 'subpage',
			tooltip: 'This excludes any page that is useful to the project, and in particular: deletion discussions that are not logged elsewhere, user and user talk pages, talk page archives, plausible redirects that can be changed to valid targets, and file pages or talk pages for files that exist on Wikimedia Commons.'
		});
	}
	result.push({
		label: 'G10: Attack page',
		value: 'attack',
		tooltip: 'Pages that serve no purpose but to disparage their subject or some other entity (e.g., "John Q. Doe is an imbecile"). This includes a biography of a living person that is negative in tone and unsourced, where there is no NPOV version in the history to revert to. Administrators deleting such pages should not quote the content of the page in the deletion summary!'
	});
	if (!multiple) {
		result.push({
			label: 'G10: Wholly negative, unsourced BLP',
			value: 'negublp',
			tooltip: 'A biography of a living person that is entirely negative in tone and unsourced, where there is no neutral version in the history to revert to.'
		});
	}
	result.push({
		label: 'G11: Unambiguous advertising',
		value: 'spam',
		tooltip: 'Pages which exclusively promote a company, product, group, service, or person and which would need to be fundamentally rewritten in order to become encyclopedic. Note that an article about a company or a product which describes its subject from a neutral point of view does not qualify for this criterion; an article that is blatant advertising should have inappropriate content as well'
	});
	result.push({
		label: 'G12: Unambiguous copyright infringement',
		value: 'copyvio',
		tooltip: 'Either: (1) Material was copied from another website that does not have a license compatible with Wikipedia, or is photography from a stock photo seller (such as Getty Images or Corbis) or other commercial content provider; (2) There is no non-infringing content in the page history worth saving; or (3) The infringement was introduced at once by a single person rather than created organically on wiki and then copied by another website such as one of the many Wikipedia mirrors'
	});
	return result;
};

Twinkle.speedy.redirectList = [
	{
		label: 'R2: Redirects from mainspace to any other namespace except the Category:, Template:, Wikipedia:, Help: and Portal: namespaces',
		value: 'rediruser',
		tooltip: '(this does not include the Wikipedia shortcut pseudo-namespaces). If this was the result of a page move, consider waiting a day or two before deleting the redirect'
	},
	{
		label: 'R3: Redirects as a result of an implausible typo that were recently created',
		value: 'redirtypo',
		tooltip: 'However, redirects from common misspellings or misnomers are generally useful, as are redirects in other languages'
	},
	{
		label: 'G8: Redirects to invalid targets, such as nonexistent targets, redirect loops, and bad titles',
		value: 'redirnone',
		tooltip: 'This excludes any page that is useful to the project, and in particular: deletion discussions that are not logged elsewhere, user and user talk pages, talk page archives, plausible redirects that can be changed to valid targets, and file pages or talk pages for files that exist on Wikimedia Commons.'
	}
];

Twinkle.speedy.normalizeHash = {
	'reason': 'db',
	'multiple': 'multiple',
	'multiple-finish': 'multiple-finish',
	'nonsense': 'g1',
	'test': 'g2',
	'vandalism': 'g3',
	'hoax': 'g3',
	'repost': 'g4',
	'banned': 'g5',
	'histmerge': 'g6',
	'move': 'g6',
	'xfd': 'g6',
	'disambig': 'g6',
	'movedab': 'g6',
	'copypaste': 'g6',
	'g6': 'g6',
	'author': 'g7',
	'g8': 'g8',
	'talk': 'g8',
	'subpage': 'g8',
	'redirnone': 'g8',
	'templatecat': 'g8',
	'attack': 'g10',
	'negublp': 'g10',
	'spam': 'g11',
	'copyvio': 'g12',
	'nocontext': 'a1',
	'foreign': 'a2',
	'nocontent': 'a3',
	'transwiki': 'a5',
	'a7': 'a7',
	'person': 'a7',
	'corp': 'a7',
	'web': 'a7',
	'band': 'a7',
	'club': 'a7',
	'animal': 'a7',
	'a9': 'a9',
	'a10': 'a10',
	'rediruser': 'r2',
	'redirtypo': 'r3',
	'redundantimage': 'f1',
	'noimage': 'f2',
	'fpcfail': 'f2',
	'noncom': 'f3',
	'unksource': 'f4',
	'unfree': 'f5',
	'norat': 'f6',
	'badfairuse': 'f7',
	'nowcommons': 'f8',
	'imgcopyvio': 'f9',
	'badfiletype': 'f10',
	'nopermission': 'f11',
	'catempty': 'c1',
	'userreq': 'u1',
	'nouser': 'u2',
	'gallery': 'u3',
	'policy':'t2',
	't3': 't3',
	'p1': 'p1',
	'emptyportal': 'p2'
};

// keep this synched with [[MediaWiki:Deletereason-dropdown]]
Twinkle.speedy.reasonHash = {
	'reason': '',
// General
	'nonsense': 'অসংলগ্ন,অর্থহীন বা অবোধগম্য পাতা',
	'test': 'পরীক্ষামূলক পাতা,অনুগ্রহপূর্বক সকল পরীক্ষা [[উইকিপিডিয়া:খেলাঘর|খেলাঘরে]] করুন',
	'vandalism': 'নিশ্চিত[[উইকিপিডিয়া:ধ্বংসপ্রবণতা|ধ্বংসপ্রবণতা]]',
	'hoax': 'Blatant [[WP:Do not create hoaxes|hoax]]',
	'repost': 'Recreation of a page that was [[WP:DEL|deleted]] per a [[WP:XFD|deletion discussion]]',
	'banned': 'Creation by a [[WP:BLOCK|blocked]] or [[WP:BAN|banned]] user in violation of block or ban',
	'histmerge': 'Temporary deletion in order to merge page histories',
	'move': 'Making way for a non-controversial move',
	'xfd': 'Deleting page per result of [[WP:XfD|deletion discussion]]',
	'disambig': 'Unnecessary disambiguation page',
	'movedab': 'Redirect to [[WP:MALPLACED|malplaced disambiguation page]]',
	'copypaste': '[[WP:CPMV|Copy-and-paste]] page move',
	'g6': 'Housekeeping and routine (non-controversial) cleanup',
	'author': 'One author who has requested deletion or blanked the page',
	'g8': 'Page dependent on a deleted or nonexistent page',
	'talk': '[[Help:Talk page|Talk page]] of a deleted or nonexistent page',
	'subpage': '[[WP:Subpages|Subpage]] of a deleted or nonexistent page',
	'redirnone': '[[Wikipedia:Redirect|redirect]] to a deleted or nonexistent page',
	'templatecat': 'Populated by deleted or retargeted templates',
	'attack': '[[WP:ATP|Attack page]] or negative unsourced [[WP:BLP|BLP]]',
	'negublp': 'Negative unsourced [[WP:BLP|BLP]]',
	'spam': 'Unambiguous [[WP:ADS|advertising]] or promotion',
	'copyvio': 'Unambiguous [[WP:C|copyright infringement]]',
// Articles
	'nocontext': 'Not enough context to identify article\'s subject',
	'foreign': 'Article in a foreign language that exists on another project',
	'nocontent': 'Article that has no meaningful, substantive content',
	'transwiki': 'Article that has been transwikied to another project',
	'a7': 'No explanation of the subject\'s significance (real person, animal, organization, or web content)',
	'person' : 'No explanation of the subject\'s significance (real person)',
	'web': 'No explanation of the subject\'s significance (web content)',
	'corp': 'No explanation of the subject\'s significance (organization)',
	'club': 'No explanation of the subject\'s significance (organization)',
	'band': 'No explanation of the subject\'s significance (band/musician)',
	'animal': 'No explanation of the subject\'s significance (individual animal)',
	'a9': 'Music recording by redlinked artist and no indication of importance or significance',
	'a10': 'Recently created article that duplicates an existing topic',
// Images and media
	'redundantimage': 'File  redundant to another on Wikipedia',
	'noimage': 'Corrupt or empty file, or a file description page for a file on Commons',
	'noncom': 'File with improper license',
	'unksource': 'Lack of licensing information',
	'unfree': 'Unused non-free media',
	'norat': 'Non-free file without [[WP:RAT|fair-use rationale]]',
	'badfairuse': '[[WP:NFCC|Invalid]] fair-use claim',
	'nowcommons': 'Media file available on Commons',
	'imgcopyvio': 'File [[WP:COPYVIO|copyright violation]]',
	'badfiletype': 'Useless media file',
	'nopermission': 'No evidence of permission',
// Categories
	'catempty': 'Empty category',
// User pages
	'userreq': 'User request to delete page in own userspace',
	'nouser': 'Userpage or subpage of a nonexistent user',
	'gallery': '[[WP:NFC|Non-free]] [[Help:Gallery|gallery]]',
// Templates
	'policy': 'Template that unambiguously misrepresents established policy',
	't3': 'Unused, redundant template',
// Portals
	'p1': '[[WP:P|Portal]] page that would be subject to speedy deletion as an article',
	'emptyportal': '[[WP:P|Portal]] without a substantial topic base',
// Redirects
	'rediruser': 'Cross-[[WP:NS|namespace]] [[WP:R|redirect]] from mainspace',
	'redirtypo': 'Recently created, implausible [[WP:R|redirect]]'
};

Twinkle.speedy.callbacks = {
	sysop: {
		main: function( params ) {
			var thispage = new Wikipedia.page( mw.config.get('wgPageName'), "পাতা অপসারণ করা হচ্ছে।" );

			// delete page
			var reason;
			if (params.normalized === 'db') {
				reason = prompt("অপসারণ সারাংশ প্রদান করুন,যা অপসারণ লগে প্রদান করা হবে:", "");
			} else {
				var presetReason = "[[WP:CSD#" + params.normalized.toUpperCase() + "|" + params.normalized.toUpperCase() + "]]: " + params.reason;
				if (Twinkle.getPref("promptForSpeedyDeletionSummary").indexOf(params.normalized) !== -1) {
					reason = prompt("অপসারণ সারাংশ প্রদান করুন, অথবা  স্বয়ংক্রিয় ভাবে আগত সারাংশ গ্রহন করতে OK বোতাম চাপুন ", presetReason);
				} else {
					reason = presetReason;
				}
			}
			if (!reason || !reason.replace(/^\s*/, "").replace(/\s*$/, "")) {
				Status.error("Asking for reason", "you didn't give one.  I don't know... what with admins and their apathetic antics... I give up...");
				return;
			}
			thispage.setEditSummary( reason + Twinkle.getPref('deletionSummaryAd') );
			thispage.deletePage();

			// delete talk page
			if (params.deleteTalkPage &&
			    params.normalized !== 'f8' &&
			    document.getElementById( 'ca-talk' ).className !== 'new') {
				var talkpage = new Wikipedia.page( Wikipedia.namespaces[ mw.config.get('wgNamespaceNumber') + 1 ] + ':' + mw.config.get('wgTitle'), "Deleting talk page" );
				talkpage.setEditSummary('[[WP:CSD#G8|G8]]: Talk page of deleted page [[' + mw.config.get('wgPageName') + "]]. " + Twinkle.getPref('deletionSummaryAd'));
				talkpage.deletePage();
			}

			// promote Unlink tool
			var $link, $bigtext;
			if( mw.config.get('wgNamespaceNumber') === 6 && params.normalized !== 'f8' ) {
				$link = $('<a/>', {
					'href': '#',
					'text': 'click here to go to the Unlink tool',
					'css': { 'fontSize': '130%', 'fontWeight': 'bold' },
					'click': function(){
						Wikipedia.actionCompleted.redirect = null;
						Twinkle.speedy.dialog.close();
						Twinkle.unlink.callback("Removing usages of and/or links to deleted file " + mw.config.get('wgPageName'));
					}
				});
				$bigtext = $('<span/>', {
					'text': 'To orphan backlinks and remove instances of file usage',
					'css': { 'fontSize': '130%', 'fontWeight': 'bold' }
				});
				Status.info($bigtext[0], $link[0]);
			} else if (params.normalized !== 'f8') {
				$link = $('<a/>', {
					'href': '#',
					'text': 'click here to go to the Unlink tool',
					'css': { 'fontSize': '130%', 'fontWeight': 'bold' },
					'click': function(){
						Wikipedia.actionCompleted.redirect = null;
						Twinkle.speedy.dialog.close();
						Twinkle.unlink.callback("Removing links to deleted page " + mw.config.get('wgPageName'));
					}
				});
				$bigtext = $('<span/>', {
					'text': 'To orphan backlinks',
					'css': { 'fontSize': '130%', 'fontWeight': 'bold' }
				});
				Status.info($bigtext[0], $link[0]);
			}

			// open talk page of first contributor
			if( params.openusertalk ) {
				thispage = new Wikipedia.page( mw.config.get('wgPageName') );  // a necessary evil, in order to clear incorrect Status.text
				thispage.setCallbackParameters( params );
				thispage.lookupCreator( Twinkle.speedy.callbacks.sysop.openUserTalkPage );
			}

			// delete redirects
			if (params.deleteRedirects) {
				var query = {
					'action': 'query',
					'list': 'backlinks',
					'blfilterredir': 'redirects',
					'bltitle': mw.config.get('wgPageName'),
					'bllimit': 5000  // 500 is max for normal users, 5000 for bots and sysops
				};
				var wikipedia_api = new Wikipedia.api( 'getting list of redirects...', query, Twinkle.speedy.callbacks.sysop.deleteRedirectsMain,
					new Status( 'Deleting redirects' ) );
				wikipedia_api.params = params;
				wikipedia_api.post();
			}
		},
		openUserTalkPage: function( pageobj ) {
			pageobj.getStatusElement().unlink();  // don't need it anymore
			var user = pageobj.getCreator();
			var statusIndicator = new Status('Opening user talk page edit form for ' + user, 'opening...');

			var query = {
				'title': 'User talk:' + user,
				'action': 'edit',
				'preview': 'yes',
				'vanarticle': mw.config.get('wgPageName').replace(/_/g, ' ')
			};
			switch( Twinkle.getPref('userTalkPageMode') ) {
			case 'tab':
				window.open( mw.config.get('wgServer') + mw.config.get('wgScriptPath') + '/index.php?' + QueryString.create( query ), '_tab' );
				break;
			case 'blank':
				window.open( mw.config.get('wgServer') + mw.config.get('wgScriptPath') + '/index.php?' + QueryString.create( query ), '_blank', 'location=no,toolbar=no,status=no,directories=no,scrollbars=yes,width=1200,height=800' );
				break;
			case 'window':
				/* falls through */
				default :
				window.open( mw.config.get('wgServer') + mw.config.get('wgScriptPath') + '/index.php?' + QueryString.create( query ), 'twinklewarnwindow', 'location=no,toolbar=no,status=no,directories=no,scrollbars=yes,width=1200,height=800' );
				break;
			}

			statusIndicator.info( 'complete' );
		},
		deleteRedirectsMain: function( apiobj ) {
			var xmlDoc = apiobj.getXML();
			var $snapshot = $(xmlDoc).find('backlinks bl');

			var total = $snapshot.length;

			if( !total ) {
				return;
			}

			var statusIndicator = apiobj.statelem;
			statusIndicator.status("0%");

			var onsuccess = function( apiobj ) {
				var obj = apiobj.params.obj;
				var total = apiobj.params.total;
				var now = parseInt( 100 * ++(apiobj.params.current)/total, 10 ) + '%';
				obj.update( now );
				apiobj.statelem.unlink();
				if( apiobj.params.current >= total ) {
					obj.info( now + ' (completed)' );
					Wikipedia.removeCheckpoint();
				}
			};

			Wikipedia.addCheckpoint();

			var params = clone( apiobj.params );
			params.current = 0;
			params.total = total;
			params.obj = statusIndicator;

			$snapshot.each(function(key, value) {
				var title = $(value).attr('title');
				var page = new Wikipedia.page(title, 'Deleting redirect "' + title + '"');
				page.setEditSummary('[[WP:CSD#G8|G8]]: Redirect to deleted page [[' + mw.config.get('wgPageName') + "]]." + Twinkle.getPref('deletionSummaryAd'));
				page.deletePage(onsuccess);
			});
		}
	},





	user: {
		main: function(pageobj) {
			var statelem = pageobj.getStatusElement();

			if (!pageobj.exists()) {
				statelem.error( "It seems that the page doesn't exist; perhaps it has already been deleted" );
				return;
			}

			var text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();

			statelem.status( 'Checking for tags on the page...' );

			// check for existing deletion tags
			var tag = /(?:\{\{\s*(db|delete|db-.*?)(?:\s*\||\s*\}\}))/.exec( text );
			if( tag ) {
				statelem.error( [ htmlNode( 'strong', tag[1] ) , " is already placed on the page." ] );
				return;
			}

			var xfd = /(?:\{\{([rsaiftcm]fd|md1)[^{}]*?\}\})/i.exec( text );
			if( xfd && !confirm( "The deletion-related template {{" + xfd[1] + "}} was found on the page. Do you still want to add a CSD template?" ) ) {
				return;
			}

			var code, parameters, i;
			if (params.normalized === 'multiple')
			{
				code = "{{db-multiple";
				for (i in Twinkle.speedy.dbmultipleCriteria) {
					if (typeof Twinkle.speedy.dbmultipleCriteria[i] === 'string') {
						code += "|" + Twinkle.speedy.dbmultipleCriteria[i].toUpperCase();
					}
				}
				for (i in Twinkle.speedy.dbmultipleParameters) {
					if (typeof Twinkle.speedy.dbmultipleParameters[i] === 'string') {
						code += "|" + i + "=" + Twinkle.speedy.dbmultipleParameters[i];
					}
				}
				code += "}}";
				params.utparams = [];
			}
			else
			{
				parameters = Twinkle.speedy.getParameters(params.value, params.normalized, statelem);
				if (!parameters) {
					return;  // the user aborted
				}
				code = "{{db-" + params.value;
				for (i in parameters) {
					if (typeof parameters[i] === 'string') {
						code += "|" + i + "=" + parameters[i];
					}
				}
				code += "}}";
				params.utparams = Twinkle.speedy.getUserTalkParameters(params.normalized, parameters);
			}

			var thispage = new Wikipedia.page(mw.config.get('wgPageName'));
			// patrol the page, if reached from Special:NewPages
			if( Twinkle.getPref('markSpeedyPagesAsPatrolled') ) {
				thispage.patrol();
			}

			// Notification to first contributor
			if (params.usertalk) {
				var callback = function(pageobj) {
					var initialContrib = pageobj.getCreator();

					// don't notify users when their user talk page is nominated
					if (initialContrib === mw.config.get('wgTitle') && mw.config.get('wgNamespaceNumber') === 3) {
						Status.warn("Notifying initial contributor: this user created their own user talk page; skipping notification"); 
						return;
					}

					var usertalkpage = new Wikipedia.page('User talk:' + initialContrib, "Notifying initial contributor (" + initialContrib + ")");
					var notifytext;

					// specialcase "db" and "db-multiple"
					switch (params.normalized)
					{
						case 'db':
							notifytext = "\n\n{{subst:db-reason-notice|1=" + mw.config.get('wgPageName');
							break;
						case 'multiple':
							notifytext = "\n\n{{subst:db-notice-multiple|1=" + mw.config.get('wgPageName');
							break;
						default:
							notifytext = "\n\n{{subst:db-csd-notice-custom|1=" + mw.config.get('wgPageName') + "|2=" + params.value;
							break;
					}
					for (var i in params.utparams) {
						if (typeof params.utparams[i] === 'string') {
							notifytext += "|" + i + "=" + params.utparams[i];
						}
					}
					notifytext += (params.welcomeuser ? "" : "|nowelcome=yes") + "}} ~~~~";

					usertalkpage.setAppendText(notifytext);
					usertalkpage.setEditSummary("Notification: speedy deletion nomination of [[" + mw.config.get('wgPageName') + "]]." + Twinkle.getPref('summaryAd'));
					usertalkpage.setCreateOption('recreate');
					usertalkpage.setFollowRedirect(true);
					usertalkpage.append();

					// add this nomination to the user's userspace log, if the user has enabled it
					if (params.lognomination) {
						Twinkle.speedy.callbacks.user.addToLog(params, initialContrib);
					}
				};
				thispage.lookupCreator(callback);
			}
			// or, if not notifying, add this nomination to the user's userspace log without the initial contributor's name
			else if (params.lognomination) {
				Twinkle.speedy.callbacks.user.addToLog(params, null);
			}

			// Wrap SD template in noinclude tags if we are in template space.
			// Won't work with userboxes in userspace, or any other transcluded page outside template space
			if (mw.config.get('wgNamespaceNumber') === 10) {  // Template:
				code = "<noinclude>" + code + "</noinclude>";
			}

			// Remove tags that become superfluous with this action
			text = text.replace(/\{\{\s*(New unreviewed article|Userspace draft)\s*(\|(?:\{\{[^{}]*\}\}|[^{}])*)?\}\}\s*/ig, "");
			if (mw.config.get('wgNamespaceNumber') === 6) {
				// remove "move to Commons" tag - deletion-tagged files cannot be moved to Commons
				text = text.replace(/\{\{(mtc|(copy |move )?to ?commons|move to wikimedia commons|copy to wikimedia commons)[^}]*}}/gi, "");
			}

			// Generate edit summary for edit
			var editsummary;
			switch (params.normalized)
			{
				case 'db':
					editsummary = 'Requesting [[WP:CSD|speedy deletion]] with rationale \"' + parameters["1"] + '\".';
					break;
				case 'multiple':
					editsummary = 'Requesting speedy deletion (';
					for (i in Twinkle.speedy.dbmultipleCriteria) {
						if (typeof Twinkle.speedy.dbmultipleCriteria[i] === 'string') {
							editsummary += '[[WP:CSD#' + Twinkle.speedy.dbmultipleCriteria[i].toUpperCase() + '|CSD ' + Twinkle.speedy.dbmultipleCriteria[i].toUpperCase() + ']], ';
						}
					}
					editsummary = editsummary.substr(0, editsummary.length - 2); // remove trailing comma
					editsummary += ').';
					break;
				case 'g6':
					if (params.value === 'histmerge') {
						editsummary = "Requesting history merge with [[" + parameters["1"] + "]] ([[WP:CSD#G6|CSD G6]]).";
						break;
					}
					/* falls through */
				default:
					editsummary = "Requesting speedy deletion ([[WP:CSD#" + params.normalized.toUpperCase() + "|CSD " + params.normalized.toUpperCase() + "]]).";
					break;
			}

			pageobj.setPageText(code + ((params.normalized === 'g10' || Twinkle.speedy.dbmultipleCriteria.indexOf('g10') !== -1) ?
					'' : ("\n" + text) )); // cause attack pages to be blanked
			pageobj.setEditSummary(editsummary + Twinkle.getPref('summaryAd'));
			pageobj.setWatchlist(params.watch);
			pageobj.setCreateOption('nocreate');
			pageobj.save();
		},

		// note: this code is also invoked from twinkleimage
		// the params used are:
		//   for all: params.normalized
		//   for CSD: params.value
		//   for DI: params.fromDI = true, params.type
		addToLog: function(params, initialContrib) {
			var wikipedia_page = new Wikipedia.page("User:" + mw.config.get('wgUserName') + "/" + Twinkle.getPref('speedyLogPageName'), "Adding entry to userspace log");
			params.logInitialContrib = initialContrib;
			wikipedia_page.setCallbackParameters(params);
			wikipedia_page.load(Twinkle.speedy.callbacks.user.saveLog);
		},

		saveLog: function(pageobj) {
			var text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();

			// add blurb if log page doesn't exist
			if (!pageobj.exists()) {
				text =
					"This is a log of all [[WP:CSD|speedy deletion]] nominations made by this user using [[WP:TW|Twinkle]]'s CSD module.\n\n" +
					"If you no longer wish to keep this log, you can turn it off using the [[Wikipedia:Twinkle/Preferences|preferences panel]], and " +
					"nominate this page for speedy deletion under [[WP:CSD#U1|CSD U1]].\n";
				if (userIsInGroup("sysop")) {
					text += "\nThis log does not track outright speedy deletions made using Twinkle.\n";
				}
			}

			// create monthly header
			var date = new Date();
			var headerRe = new RegExp("^==+\\s*" + date.getUTCMonthName() + "\\s+" + date.getUTCFullYear() + "\\s*==+", "m");
			if (!headerRe.exec(text)) {
				text += "\n\n=== " + date.getUTCMonthName() + " " + date.getUTCFullYear() + " ===";
			}

			text += "\n# [[:" + mw.config.get('wgPageName') + "]]: ";
			if (params.fromDI) {
				text += "DI [[WP:CSD#" + params.normalized.toUpperCase() + "|CSD " + params.normalized.toUpperCase() + "]] (" + params.type + ")";
			} else {
				switch (params.normalized)
				{
					case 'db':
						text += "{{tl|db-reason}}";
						break;
					case 'multiple':
						text += "multiple criteria (";
						for (var i in Twinkle.speedy.dbmultipleCriteria) {
							if (typeof Twinkle.speedy.dbmultipleCriteria[i] === 'string') {
								text += '[[WP:CSD#' + Twinkle.speedy.dbmultipleCriteria[i].toUpperCase() + '|' + Twinkle.speedy.dbmultipleCriteria[i].toUpperCase() + ']], ';
							}
						}
						text = text.substr(0, text.length - 2);  // remove trailing comma
						text += ')';
						break;
					default:
						text += "[[WP:CSD#" + params.normalized.toUpperCase() + "|CSD " + params.normalized.toUpperCase() + "]] ({{tl|db-" + params.value + "}})";
						break;
				}
			}

			if (params.logInitialContrib) {
				text += "; notified {{user|" + params.logInitialContrib + "}}";
			}
			text += " ~~~~~\n";

			pageobj.setPageText(text);
			pageobj.setEditSummary("Logging speedy deletion nomination of [[" + mw.config.get('wgPageName') + "]]." + Twinkle.getPref('summaryAd'));
			pageobj.setCreateOption("recreate");
			pageobj.save();
		}
	}
};

// prompts user for parameters to be passed into the speedy deletion tag
Twinkle.speedy.getParameters = function twinklespeedyGetParameters(value, normalized, statelem)
{
	var parameters = [];
	switch( normalized ) {
		case 'db':
			var dbrationale = prompt('Please enter a mandatory rationale.   \n\"This page qualifies for speedy deletion because:\"', "");
			if (!dbrationale || !dbrationale.replace(/^\s*/, "").replace(/\s*$/, ""))
			{
				statelem.error( 'You must specify a rationale.  ব্যবহারকারি বাতিল করেছেন.' );
				return null;
			}
			parameters["1"] = dbrationale;
			break;
		case 'u1':
			if (mw.config.get('wgNamespaceNumber') === 3 && !((/\//).test(mw.config.get('wgTitle'))))
			{
				var u1rationale = prompt('Please provide a mandatory rationale to explain why this user talk page should be deleted:', "");
				if (!u1rationale || !u1rationale.replace(/^\s*/, "").replace(/\s*$/, ""))
				{
					statelem.error( 'You must specify a rationale.  ব্যবহারকারি বাতিল করেছেন.' );
					return null;
				}
				parameters.rationale = u1rationale;
			}
			break;
		case 'f8':
			var pagenamespaces = mw.config.get('wgPageName').replace( '_', ' ' );
			var filename = prompt( 'Please enter the name of the file on Commons:', pagenamespaces );
			if (filename === null)
			{
				statelem.error( 'ব্যবহারকারি বাতিল করেছেন' );
				return null;
			}
			if (filename !== '' && filename !== pagenamespaces)
			{
				if (filename.indexOf("Image:") === 0 || filename.indexOf("File:") === 0)
				{
					parameters["1"] = filename;
				}
				else
				{
					statelem.error("The File: prefix was missing from the image filename.  Aborted.");
					return null;
				}
			}
			parameters.date = "~~~~~";
			break;
		case 'g4':
			var deldisc = prompt( 'Please enter the name of the page where the deletion discussion took place.  \nNOTE: For regular AfD and MfD discussions, just click OK - a link will be automatically provided.', "" );
			if (deldisc === null)
			{
				statelem.error( 'ব্যবহারকারি বাতিল করেছেন' );
				return null;
			}
			if (deldisc !== "" && deldisc.substring(0, 9) !== "Wikipedia" && deldisc.substring(0, 3) !== "WP:")
			{
				statelem.error( 'The deletion discussion page name, if provided, must start with "Wikipedia:".  Cannot proceed.' );
				return null;
			}
			parameters["1"] = deldisc;
			break;
		case 'g5':
			var banneduser = prompt( 'Please enter the username of the banned user if available:', "" );
			if (banneduser === null)
			{
				statelem.error( 'ব্যবহারকারি বাতিল করেছেন' );
				return null;
			}
			parameters["1"] = banneduser;
			break;	
		case 'g6':
			switch( value ) {
				case 'histmerge':
					var mergetitle = prompt( 'Please enter the title to merge into:', "" );
					if (mergetitle === null)
					{
						statelem.error( 'ব্যবহারকারি বাতিল করেছেন' );
						return null;
					}
					parameters["1"] = mergetitle;
					break;
				case 'move':
					var title = prompt( 'Please enter the title of the page to be moved here:', "" );
					if (title === null)
					{
						statelem.error( 'ব্যবহারকারি বাতিল করেছেন' );
						return null;
					}
					var reason = prompt( 'Please enter the reason for the page move:', "" );
					if (reason === null)
					{
						statelem.error( 'ব্যবহারকারি বাতিল করেছেন' );
						return null;
					}
					parameters["1"] = title;
					parameters["2"] = reason;
					break;
				case 'xfd':
					var votepage = prompt( 'If the title of the discussion is different than the title of the page, and it is not an SfD discussion or a page where the discussion is not where it is expected to be, please enter the title of the discussion here (leave empty to skip):', "" );
					if (votepage === null)
					{
						statelem.error( 'ব্যবহারকারি বাতিল করেছেন' );
						return null;
					}
					if (votepage === '')
					{
						var fullvotepage = prompt( 'For SfD discussions and pages where discussions are not where they are expected to be, please enter the full title of the discussion, including the namespace, here: (leave empty to skip):', "" );
						if (fullvotepage === null)
						{
						statelem.error( 'ব্যবহারকারি বাতিল করেছেন' );
						return null;
						}
					}
					if (votepage !== '') {
						parameters.votepage = votepage;
					}
					if (fullvotepage !== '') {
						parameters.fullvotepage = fullvotepage;
					}
					if (confirm('If this page is a redirect that was discussed at RfD, click OK. Otherwise, click Cancel.')) {
						parameters.redirect = "yes";
					}
					break;
				case 'copypaste':
					var copytitle = prompt( 'Please enter the title of the original page that was copy-pasted here:', "" );
					if (copytitle === null)
					{
						statelem.error( 'ব্যবহারকারি বাতিল করেছেন' );
						return null;
					}
					parameters["1"] = copytitle;
					break;
				case 'g6':
					var g6rationale = prompt( 'Please provide an optional rationale (leave empty to skip):', "" );
					if (g6rationale === null)
					{
						statelem.error( 'ব্যবহারকারি বাতিল করেছেন' );
						return null;
					}
					if (g6rationale !== '')
					{
						parameters.rationale = g6rationale;
					}
					break;
				default:
					break;
			}
			break;
		case 'g7':
			if (Twinkle.getPref('speedyPromptOnG7'))
			{
				var g7rationale = prompt('Please provide an optional rationale (perhaps linking to where the author requested this deletion - leave empty to skip):', "");
				if (g7rationale === null)
				{
					statelem.error( 'ব্যবহারকারি বাতিল করেছেন' );
					return null;
				}
				if (g7rationale !== '')
				{
					parameters.rationale = g7rationale;
				}
			}
			break;
		case 'g12':
			var url = prompt( 'Please enter the URL if available, including the "http://":', "" );
			if (url === null)
			{
				statelem.error( 'ব্যবহারকারি বাতিল করেছেন' );
				return null;
			}
			parameters.url = url;
			break;
		case 'f9':
			var f9url = prompt( 'Please enter the URL of the copyvio, including the "http://".  \nIf you cannot provide a URL, please do not use CSD F9.  (Exception: for copyvios of non-Internet sources, leave the box blank.)', "" );
			if (f9url === null)
			{
				statelem.error( 'ব্যবহারকারি বাতিল করেছেন' );
				return null;
			}
			parameters.url = f9url;
			break;
		case 'a2':
			var source = prompt('Enter an interwiki link to the article on the foreign-language wiki (for example, "fr:Bonjour"):', "");
			if (source === null)
			{
				statelem.error('ব্যবহারকারি বাতিল করেছেন');
				return null;
			}
			parameters.source = source;
			break;
		case 'a10':
			var duptitle = prompt( 'Enter the article name that is duplicated:', "" );
			if (duptitle === null)
			{
				statelem.error( 'ব্যবহারকারি বাতিল করেছেন' );
				return null;
			}
			parameters.article = duptitle;
			break;
		case 'f1':
			var img = prompt( 'Enter the file this is redundant to, excluding the "Image:" or "File:" prefix:', "" );
			if (img === null)
			{
				statelem.error( 'ব্যবহারকারি বাতিল করেছেন' );
				return null;
			}
			parameters.filename = img;
			break;
		case 't3':
			var template = prompt( 'Enter the template this is redundant to, excluding the "Template:" prefix:', "" );
			if (template === null)
			{
				statelem.error( 'ব্যবহারকারি বাতিল করেছেন' );
				return null;
			}
			parameters["1"] = "~~~~~";
			parameters["2"] = template;
			break;
		case 'g10':
			parameters.blanked = 'yes';
			// it is actually blanked elsewhere in code, but setting the flag here
			break;
		case 'p1':
			var criterion = prompt( 'Enter the code of the article CSD criterion which this portal falls under:   \n\n(A1 = no context, A3 = no content, A7 = non-notable, A10 = duplicate)', "" );
			if (!criterion || !criterion.replace(/^\s*/, "").replace(/\s*$/, ""))
			{
				statelem.error( 'আপনাকে অবশ্যই বিচারধারা নির্বাচন করতে হবে। ব্যবহারকারি বাতিল করেছেন' );
				return null;
			}
			parameters["1"] = criterion;
			break;
		default:
			break;
	}
	return parameters;
};

// function for processing talk page notification template parameters
Twinkle.speedy.getUserTalkParameters = function twinklespeedyGetUserTalkParameters(normalized, parameters)
{
	var utparams = [];
	switch (normalized)
	{
		case 'db':
			utparams["2"] = parameters["1"];
			break;
		case 'a10':
			utparams.key1 = "article";
			utparams.value1 = parameters.article;
			break;
		default:
			break;
	}
	return utparams;
};

Twinkle.speedy.callback.evaluateSysop = function twinklespeedyCallbackEvaluateSysop(e)
{
	mw.config.set('wgPageName', mw.config.get('wgPageName').replace(/_/g, ' ')); // for queen/king/whatever and country!

	var tag_only = e.target.form.tag_only;
	if( tag_only && tag_only.checked ) {
		Twinkle.speedy.callback.evaluateUser(e);
		return;
	}

	var value = e.target.values;
	var normalized = Twinkle.speedy.normalizeHash[ value ];

	var params = {
		value: value,
		normalized: normalized,
		watch: Twinkle.getPref('watchSpeedyPages').indexOf( normalized ) !== -1,
		reason: Twinkle.speedy.reasonHash[ value ],
		openusertalk: Twinkle.getPref('openUserTalkPageOnSpeedyDelete').indexOf( normalized ) !== -1,
		deleteTalkPage: e.target.form.talkpage && e.target.form.talkpage.checked,
		deleteRedirects: e.target.form.redirects.checked
	};
	Status.init( e.target.form );

	Twinkle.speedy.callbacks.sysop.main( params );
};

Twinkle.speedy.callback.evaluateUser = function twinklespeedyCallbackEvaluateUser(e) {
	mw.config.set('wgPageName', mw.config.get('wgPageName').replace(/_/g, ' '));  // for queen/king/whatever and country!
	var value = e.target.values;

	if (value === 'multiple')
	{
		e.target.form.style.display = "none"; // give the user a cue that the dialog is being changed
		setTimeout(function() {
			Twinkle.speedy.initDialog(Twinkle.speedy.callback.doMultiple, false, e.target.form.parentNode);
		}, 150);
		return;
	}

	if (value === 'multiple-finish') {
		value = 'multiple';
	}
	else
	{
		// clear these out, whatever the case, to avoid errors
		Twinkle.speedy.dbmultipleCriteria = [];
		Twinkle.speedy.dbmultipleParameters = [];
	}

	var normalized = Twinkle.speedy.normalizeHash[ value ];

	// for sysops only
	if (['f4', 'f5', 'f6', 'f11'].indexOf(normalized) !== -1) {
		alert("Tagging with F4, F5, F6, and F11 is not possible using the CSD module.  Try using DI instead, or unchecking \"Tag page only\" if you meant to delete the page.");
		return;
	}

	var i;

	// analyse each db-multiple criterion to determine whether to watch the page/notify the creator
	var watchPage = false;
	if (value === 'multiple')
	{
		for (i in Twinkle.speedy.dbmultipleCriteria)
		{
			if (typeof Twinkle.speedy.dbmultipleCriteria[i] === 'string' &&
				Twinkle.getPref('watchSpeedyPages').indexOf(Twinkle.speedy.dbmultipleCriteria[i]) !== -1)
			{
				watchPage = true;
				break;
			}
		}
	}
	else
	{
		watchPage = Twinkle.getPref('watchSpeedyPages').indexOf(normalized) !== -1;
	}

	var notifyuser = false;
	if (value === 'multiple')
	{
		for (i in Twinkle.speedy.dbmultipleCriteria)
		{
			if (typeof Twinkle.speedy.dbmultipleCriteria[i] === 'string' &&
				Twinkle.getPref('notifyUserOnSpeedyDeletionNomination').indexOf(Twinkle.speedy.dbmultipleCriteria[i]) !== -1)
			{
				notifyuser = true;
				break;
			}
		}
	}
	else
	{
		notifyuser = (Twinkle.getPref('notifyUserOnSpeedyDeletionNomination').indexOf(normalized) !== -1) && e.target.form.notify.checked;
	}

	var welcomeuser = false;
	if (notifyuser)
	{
		if (value === 'multiple')
		{
			for (i in Twinkle.speedy.dbmultipleCriteria)
			{
				if (typeof Twinkle.speedy.dbmultipleCriteria[i] === 'string' &&
					Twinkle.getPref('welcomeUserOnSpeedyDeletionNotification').indexOf(Twinkle.speedy.dbmultipleCriteria[i]) !== -1)
				{
					welcomeuser = true;
					break;
				}
			}
		}
		else
		{
			welcomeuser = Twinkle.getPref('welcomeUserOnSpeedyDeletionNotification').indexOf(normalized) !== -1;
		}
	}

	var csdlog = false;
	if (Twinkle.getPref('logSpeedyNominations') && value === 'multiple')
	{
		for (i in Twinkle.speedy.dbmultipleCriteria)
		{
			if (typeof Twinkle.speedy.dbmultipleCriteria[i] === 'string' &&
				Twinkle.getPref('noLogOnSpeedyNomination').indexOf(Twinkle.speedy.dbmultipleCriteria[i]) === -1)
			{
				csdlog = true;
				break;
			}
		}
	}
	else
	{
		csdlog = Twinkle.getPref('logSpeedyNominations') && Twinkle.getPref('noLogOnSpeedyNomination').indexOf(normalized) === -1;
	}

	var params = {
		value: value,
		normalized: normalized,
		watch: watchPage,
		usertalk: notifyuser,
		welcomeuser: welcomeuser,
		lognomination: csdlog
	};

	Status.init( e.target.form );

	Wikipedia.actionCompleted.redirect = mw.config.get('wgPageName');
	Wikipedia.actionCompleted.notice = "Tagging complete";

	var wikipedia_page = new Wikipedia.page(mw.config.get('wgPageName'), "Tagging page");
	wikipedia_page.setCallbackParameters(params);
	wikipedia_page.load(Twinkle.speedy.callbacks.user.main);
};

Twinkle.speedy.dbmultipleCriteria = [];
Twinkle.speedy.dbmultipleParameters = [];
Twinkle.speedy.callback.doMultiple = function twinklespeedyCallbackDoMultiple(e)
{
	var value = e.target.values;
	var normalized = Twinkle.speedy.normalizeHash[value];
	if (value !== 'multiple-finish')
	{
		if (Twinkle.speedy.dbmultipleCriteria.indexOf(normalized) !== -1)
		{
			alert('You already selected that criterion. Please choose another.');
		}
		else
		{
			var parameters = Twinkle.speedy.getParameters(value, normalized, Status);
			if (parameters)
			{
				for (var i in parameters) {
					if (typeof parameters[i] === 'string') {
						Twinkle.speedy.dbmultipleParameters[i] = parameters[i];
					}
				}
				Twinkle.speedy.dbmultipleCriteria.push(normalized);
			}
		}
		e.target.form.style.display = "none"; // give the user a cue that the dialog is being changed
		setTimeout(function() {
			Twinkle.speedy.initDialog(Twinkle.speedy.callback.doMultiple, false, e.target.form.parentNode);
		}, 150);
	}
	else
	{
		Twinkle.speedy.callback.evaluateUser(e);
	}
};
