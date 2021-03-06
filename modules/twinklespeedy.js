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

	twAddPortletLink( Twinkle.speedy.callback, "দ্রুত অপসারণ", "tw-csd", Morebits.userIsInGroup('sysop') ? "WP:CSD মতে দ্রুত অপসারণ" : "WP:CSD মতে দ্রুত অপসারণের আবেদন" );
};

// This function is run when the CSD tab/header link is clicked
Twinkle.speedy.callback = function twinklespeedyCallback() {
	if ( !twinkleUserAuthorized ) {
		alert("নবাগত,আপনার অ্যাকাঊন্টটি  টুইংকল ব্যবহার করার জন্য নয়।");
		return;
	}

	Twinkle.speedy.initDialog(Morebits.userIsInGroup( 'sysop' ) ? Twinkle.speedy.callback.evaluateSysop : Twinkle.speedy.callback.evaluateUser, true);
};

Twinkle.speedy.dialog = null;  // used by unlink feature

// Prepares the speedy deletion dialog and displays it
Twinkle.speedy.initDialog = function twinklespeedyInitDialog(callbackfunc) {
	var dialog;
	Twinkle.speedy.dialog = new Morebits.simpleWindow( Twinkle.getPref('speedyWindowWidth'), Twinkle.getPref('speedyWindowHeight') );
	dialog = Twinkle.speedy.dialog;
	dialog.setTitle( "দ্রুত  অপসারণের  বিচারধারা নির্বাচন করুন" );
	dialog.setScriptName( "দ্রুত অপসারণ" );
	dialog.addFooterLink( "দ্রুত অপসারণের নীতিমালা", "WP:CSD" );
	dialog.addFooterLink( "টুইংকল সাহায্য", "WP:TW/DOC#speedy" );

	var form = new Morebits.quickForm( callbackfunc, (Twinkle.getPref('speedySelectionStyle') === 'radioClick' ? 'change' : null) );
	if( Morebits.userIsInGroup( 'sysop' ) ) {
		form.append( {
				type: 'checkbox',
				list: [
					{
						label: 'কেবলমাত্র ট্যাগ বসান, অপসারণ করবেন না',
						value: 'tag_only',
						name: 'tag_only',
						tooltip: 'যদি আপনি শুধুমাত্র ট্যাগ দিতে চান অপসারণ না করে',
						checked : Twinkle.getPref('deleteSysopDefaultToTag'),
						event: function( event ) {
							var cForm = event.target.form;
							var cChecked = event.target.checked;
							// enable/disable talk page checkbox
							if (cForm.talkpage) {
								cForm.talkpage.disabled = cChecked;
								cForm.talkpage.checked = !cChecked && Twinkle.getPref('deleteTalkPageOnDelete');
							}
							// enable/disable redirects checkbox
							cForm.redirects.disabled = cChecked;
							cForm.redirects.checked = !cChecked;

							// enable/disable notify checkbox
							cForm.notify.disabled = !cChecked;
							cForm.notify.checked = cChecked;
							// enable/disable multiple
							cForm.multiple.disabled = !cChecked;
							cForm.multiple.checked = false;

							Twinkle.speedy.callback.dbMultipleChanged(cForm, false);

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
						label: 'আলাপ পাতাও অপসারণ করুন',
						value: 'talkpage',
						name: 'talkpage',
						tooltip: "আপনি যদি ইহা নির্বাচন করেন তাহলে  সংশ্লিষ্ট আলাপ পাতাও অপসারণ  হবে। আপনি যদি কারণ হিসাবে F8 (কমন্সে স্থানান্তর) নির্বাচন করে থাকেন, তাহলে এই অপশনটি কার্যকর হবে না এবং আলাপ পাতারি *অপসারিত হবে না*।",
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
						label: 'সেইসাথে সকল পুনর্নির্দেশনাগুলি অপসারণ কর',
						value: 'redirects',
						name: 'redirects',
						tooltip: "এর মাধ্যমে আপনি সকল পুনর্নির্দেশনাগুলি অপসারণ করতে পারবেন। নিয়মিত অপসারণ (যেমন: স্থানান্তর/একীকরণ) এর ক্ষেত্রে এই অপশনটি নির্বাচন না করার পরামর্শ দেয়া হচ্ছে।",
						checked: Twinkle.getPref('deleteRedirectsOnDelete'),
						disabled: Twinkle.getPref('deleteSysopDefaultToTag'),
						event: function( event ) {
							event.stopPropagation();
						}
					}
				]
			} );
		form.append( { type: 'header', label: 'ট্যাগ সম্পর্কিয় পছন্দ' } );
	}

	form.append( {
			type: 'checkbox',
			list: [
				{
					label: 'যদি সম্ভব হয় প্রনেতাকে জানান',
					value: 'notify',
					name: 'notify',
					tooltip: "প্রনেতার আলাপ পাতায় একটি নোটিফিকেশন টেমপ্লেট যুক্ত করা হবে, যদি আপনার টুইংকল পছন্দসমূহ পাতায় নোটিফিকেশন পাঠানোর অপশনটি চালু থাকে " +
						"যে অপশনগুলোর জন্য আপনি নোটিফিকেশন চালু রাখবেন সেই সকল ক্ষেত্রে প্রনেতাকে জানানো হবে, একই সাথে সেই ব্যবহারকারীকে স্বাগত জানানো হবে",
					checked: !Morebits.userIsInGroup( 'sysop' ) || Twinkle.getPref('deleteSysopDefaultToTag'),
					disabled: Morebits.userIsInGroup( 'sysop' ) && !Twinkle.getPref('deleteSysopDefaultToTag'),
					event: function( event ) {
						event.stopPropagation();
					}
				}
			]
		} );
	form.append( {
			type: 'checkbox',
			list: [
				{
					label: 'অধিক বিচার ধারা মতে ট্যাগ যুক্ত করা',
					value: 'multiple',
					name: 'multiple',
					tooltip: "আপনি একাধিক বিচার ধারা মতে ট্যাগ যুক্ত করতে পারবেন। যেমন নিবন্ধের ক্ষেত্রে প্রায় সময়ই G11 এবং A7 একই সাথে ব্যবহৃত হয়।",
					disabled: Morebits.userIsInGroup( 'sysop' ) && !Twinkle.getPref('deleteSysopDefaultToTag'),
					event: function( event ) {
						Twinkle.speedy.callback.dbMultipleChanged( event.target.form, event.target.checked );
						event.stopPropagation();
					}
				}
			]
		} );

	form.append( {
			type: 'div',
			name: 'work_area',
			label: 'দ্রুত অপসারণ মডিউলটি চালু করা যাচ্ছে না, অনুগ্রহ করে টুইংকল ডেভলপারকে জানান।'
		} );

	if( Twinkle.getPref( 'speedySelectionStyle' ) !== 'radioClick' ) {
		form.append( { type: 'submit' } );
	}

	var result = form.render();
	dialog.setContent( result );
	dialog.display();

	Twinkle.speedy.callback.dbMultipleChanged( result, false );
};

Twinkle.speedy.callback.dbMultipleChanged = function twinklespeedyCallbackDbMultipleChanged(form, checked) {
	var namespace = mw.config.get('wgNamespaceNumber');
	var value = checked;

	var work_area = new Morebits.quickForm.element( {
			type: 'div',
			name: 'work_area'
		} );

	if (checked && Twinkle.getPref('speedySelectionStyle') === 'radioClick') {
		work_area.append( {
				type: 'div',
				label: 'বিচার ধারা নির্ধারনের পর ক্লিক করুন:'
			} );
		work_area.append( {
				type: 'button',
				name: 'submit-multiple',
				label: 'কার্যকর করুন',
				event: function( event ) {
					Twinkle.speedy.callback.evaluateUser( event );
					event.stopPropagation();
				}
			} );
	}

	var radioOrCheckbox = (value ? 'checkbox' : 'radio');

	if (namespace % 2 === 1 && namespace !== 3) {  // talk pages, but not user talk pages
		work_area.append( { type: 'header', label: 'আলাপ পাতা' } );
		work_area.append( { type: radioOrCheckbox, name: 'csd', list: Twinkle.speedy.talkList } );
	}

	switch (namespace) {
		case 0:  // article
		case 1:  // talk
			work_area.append( { type: 'header', label: 'নিবন্ধ' } );
			work_area.append( { type: radioOrCheckbox, name: 'csd', list: Twinkle.speedy.getArticleList(value) } );
			break;

		case 2:  // user
		case 3:  // user talk
			work_area.append( { type: 'header', label: 'ব্যবহারকারি পাতা' } );
			work_area.append( { type: radioOrCheckbox, name: 'csd', list: Twinkle.speedy.userList } );
			break;

		case 6:  // file
		case 7:  // file talk
			work_area.append( { type: 'header', label: 'ফাইল' } );
			work_area.append( { type: radioOrCheckbox, name: 'csd', list: Twinkle.speedy.getFileList(value) } );
			work_area.append( { type: 'div', label: 'F4 (লাইসেন্স নেই), F5 (ত্রুটিপূর্ণ সৌজন্যমূলক ব্যবহার), F6 (সৌজন্যমূলক ব্যবহারের কারণ উল্লেখ না করা), এবং F11 (লাইসেন্স ছাড়া ছবি) বিচার ধারা অনুযায়ী ট্যাগ করার কাজটি টুইংকলের "DI" ট্যাব থেকেও করা যায়।' } );
			break;

		case 10:  // template
		case 11:  // template talk
			work_area.append( { type: 'header', label: 'টেমপ্লেট' } );
			work_area.append( { type: radioOrCheckbox, name: 'csd', list: Twinkle.speedy.getTemplateList(value) } );
			break;

		case 14:  // category
		case 15:  // category talk
			work_area.append( { type: 'header', label: 'বিষয়শ্রেণী' } );
			work_area.append( { type: radioOrCheckbox, name: 'csd', list: Twinkle.speedy.categoryList } );
			break;

		case 100:  // portal
		case 101:  // portal talk
			work_area.append( { type: 'header', label: 'প্রবেশদ্বার' } );
			work_area.append( { type: radioOrCheckbox, name: 'csd', list: Twinkle.speedy.getPortalList(value) } );
			break;

		default:
			break;
	}

	work_area.append( { type: 'header', label: 'সাধারণ বিচারধারা' } );
	work_area.append( { type: radioOrCheckbox, name: 'csd', list: Twinkle.speedy.getGeneralList(value) });

	work_area.append( { type: 'header', label: 'পুনর্নির্দেশনা' } );
	work_area.append( { type: radioOrCheckbox, name: 'csd', list: Twinkle.speedy.redirectList } );

	var old_area = Morebits.quickForm.getElements(form, "work_area")[0];
	form.replaceChild(work_area.render(), old_area);
};

Twinkle.speedy.talkList = [
	{
		label: 'স৮:ইতিমধ্যেই অপসারিত বা অস্তিত্বহীন পাতার ওপর নির্ভরশীল পাতা বা আলাপ পাতা',
		value: 'talk',
		tooltip: 'পরবর্তীতে প্রয়োজন হতে পারে এমন পাতাগুলো এটির আওতাভুক্ত নয়, যেমন ব্যবহারকারী আলাপ পাতা, আলাপ পাতার আর্কাইভ, কমন্সে রয়েছে এমন ফাইলের আলাপ পাতা ইত্যাদি।'
	}
];

// this is a function to allow for db-multiple filtering
Twinkle.speedy.getFileList = function twinklespeedyGetFileList(multiple) {
	var result = [];
	result.push({
		label: 'ফ১:অনাবশ্যক ফাইল',
		value: 'redundantimage',
		tooltip: 'এমন কোনো ফাইল যার একাধিক কপি রয়েছে, হয়তে এটি একই ফরম্যটের ফাইল, অথবা অন্য ফাইলের কম রেজ্যুলেশনের কপি, অথবা অন্যান্য। কিন্তু এটি যদি কমন্সে রয়েছে এমন কোনো ফাইলের প্রতিলিপি হয় তাহলে ট্যাগ সংযোজনের পূর্বে লাইসেন্সটি যাচাই করুন, প্রয়োজনে  {{subst:ncd|Image:newname.ext}} অথবা {{subst:ncd}} ট্যাগ সংযোজন করুন।'
	});
	result.push({
		label: 'ফ২:বিকৃত বা  চিত্রহীন ফাইল',
		value: 'noimage',
		tooltip: 'অপসারণের পূর্বে নিশ্চিত হয়ে নিন যে মিডিয়াউইকি ইঞ্জিন এই ফাইলটি ওপেন করতে পারছে না। কমন্সে রয়েছে এমন ফাইলের বর্ণনা পাতাও এখানে অন্তর্ভুক্ত করা যেতে পারে'
	});
	if (!multiple) {
		result.push({
			label: 'ফ২:কমন্সে থাকা ফাইলের অপ্রয়োজনিয় বর্ননামূলক ফাইল',
			value: 'fpcfail',
			tooltip: 'কমন্সে থাকা ফাইলের অপ্রয়োজনিয় বর্ননামূলক ফাইল।'
		});
	}
	result.push({
		label: 'ফ৩:লাইসেন্স তথ্য  সঠিক নয়',
		value: 'noncom',
		tooltip: '"for non-commercial use only", "non-derivative use" অথবা "used with permission" that were uploaded on or after 2005-05-19, except where they have been shown to comply with the limited standards for the use of non-free content. This includes files licensed under a "Non-commercial Creative Commons License". Such files uploaded before 2005-05-19 may also be speedily deleted if they are not used in any articles'
	});
	if (Morebits.userIsInGroup('sysop')) {
		result.push({
			label: 'ফ৪:লাইসেন্স তথ্য নেই',
			value: 'unksource',
			tooltip: 'Files in category "Files with unknown source", "Files with unknown copyright status", or "Files with no copyright tag" that have been tagged with a template that places them in the category for more than seven days, regardless of when uploaded. Note, users sometimes specify their source in the upload summary, so be sure to check the circumstances of the file.'
		});
		result.push({
			label: 'ফ৫:অব্যবহৃত মুক্তনয় কপিরাইটেড ফাইল',
			value: 'unfree',
			tooltip: 'Files that are not under a free license or in the public domain that are not used in any article and that have been tagged with a template that places them in a dated subcategory of Category:Orphaned fairuse files for more than seven days. Reasonable exceptions may be made for file uploaded for an upcoming article. Use the "Orphaned fair use" option in Twinkle\'s DI module to tag files for forthcoming deletion.'
		});
		result.push({
			label: 'ফ৬:সৌজন্যমূলক ব্যবহারের যৌক্তিকতা নেই',
			value: 'norat',
			tooltip: 'Any file without a fair use rationale may be deleted seven days after it is uploaded.  Boilerplate fair use templates do not constitute a fair use rationale.  Files uploaded before 2006-05-04 should not be deleted immediately; instead, the uploader should be notified that a fair-use rationale is needed.  Files uploaded after 2006-05-04 can be tagged using the "No fair use rationale" option in Twinkle\'s DI module. Such files can be found in the dated subcategories of Category:Files with no fair use rationale.'
		});
	}
	result.push({
		label: 'ফ৭:পরিষ্কার ভাবে অবৈধ  সৌজন্যমূলক ব্যবহার ( ফেয়ার উইজ) ট্যাগ',
		value: 'badfairuse',  // same as below
		tooltip: 'This is only for files with a clearly invalid fair-use tag, such as a {{Non-free logo}} tag on a photograph of a mascot. For cases that require a waiting period (replaceable images or otherwise disputed rationales), use the options on Twinkle\'s DI tab.'
	});
	if (!multiple) {
		result.push({
			label: 'ফ৭:সৌজন্যমূলক ব্যবহার যার বানিজ্যিক ব্যবহার নেই',
			value: 'badfairuse',  // same as above
			tooltip: 'Non-free images or media from a commercial source (e.g., Associated Press, Getty), where the file itself is not the subject of sourced commentary, are considered an invalid claim of fair use and fail the strict requirements of WP:NFCC.'
		});
	}
	if (!multiple) {
		result.push({
			label: 'ফ৮:এই ফাইলের একই ভালো অধিক স্পষ্ট  ছবি উইকিমিডিয়া কমন্সে আছে',
			value: 'nowcommons',
			tooltip: 'Provided the following conditions are met: 1: The file format of both images is the same. 2: The file\'s license and source status is beyond reasonable doubt, and the license is undoubtedly accepted at Commons. 3: All information on the file description page is present on the Commons file description page. That includes the complete upload history with links to the uploader\'s local user pages. 4: The file is not protected, and the file description page does not contain a request not to move it to Commons. 5: If the file is available on Commons under a different name than locally, all local references to the file must be updated to point to the title used at Commons. 6: For {{c-uploaded}} files: They may be speedily deleted as soon as they are off the Main Page'
		});
	}
	result.push({
		label: 'ফ৯:দ্ব্যর্থহীন [[উইকিপিডিয়া:কপিরাইট|কপিরাইট লঙ্ঘন]]',
		value: 'imgcopyvio',
		tooltip: 'The file was copied from a website or other source that does not have a license compatible with Wikipedia, and the uploader neither claims fair use nor makes a credible assertion of permission of free use. Sources that do not have a license compatible with Wikipedia include stock photo libraries such as Getty Images or Corbis. Non-blatant copyright infringements should be discussed at Wikipedia:Files for deletion'
	});
	result.push({
		label: 'ফ১০:অপ্রয়োজনিয় মিডিয়া ফাইল',
		value: 'badfiletype',
		tooltip: 'Files uploaded that are neither image, sound, nor video files (e.g. .doc, .pdf, or .xls files) which are not used in any article and have no foreseeable encyclopedic use'
	});
	if (Morebits.userIsInGroup('sysop')) {
		result.push({
			label: 'ফ১১: অনুমতির কোনো প্রমান নেই',
			value: 'nopermission',
			tooltip: 'If an uploader has specified a license and has named a third party as the source/copyright holder without providing evidence that this third party has in fact agreed, the item may be deleted seven days after notification of the uploader'
		});
	}
	result.push({
		label: 'স৮:ইতিমধ্যেই অপসারিত বা অস্তিত্বহীন পাতার ওপর নির্ভরশীল পাতা',
		value: 'imagepage',
		tooltip: 'This is only for use when the file doesn\'t exist at all. Corrupt files, and local description pages for files on Commons, should use F2; implausible redirects should use R3; and broken Commons redirects should use G6.'
	});
	return result;
};

Twinkle.speedy.getArticleList = function twinklespeedyGetArticleList(multiple) {
	var result = [];
	result.push({
		label: 'নি১:নিবন্ধের বিষয়বস্তু যাচাই করার মতো যথেষ্ট পরিমাণ লেখা নেই',
		value: 'nocontext',
		tooltip: 'Example: "He is a funny man with a red car. He makes people laugh." This applies only to very short articles. Context is different from content, treated in A3, below.'
	});
	result.push({
		label: 'A2: Foreign language articles that exist on another Wikimedia project',
		value: 'foreign',
		tooltip: 'If the article in question does not exist on another project, the template {{notenglish}} should be used instead. All articles in a non-English language that do not meet this criteria (and do not meet any other criteria for speedy deletion) should be listed at Pages Needing Translation (PNT) for review and possible translation'
	});
	result.push({
		label: 'নি৩:খালি নিবন্ধ বা কোনো তথ্য নেই',
		value: 'nocontent',
		tooltip: 'Any article consisting only of links elsewhere (including hyperlinks, category tags and "see also" sections), a rephrasing of the title, and/or attempts to correspond with the person or group named by its title. This does not include disambiguation pages'
	});
	result.push({
		label: 'নি৫: নিবন্ধ যা অন্য কোনো প্রকল্পের জন্য প্রযোজ্য বা স্থানান্তরিত',
		value: 'transwiki',
		tooltip: 'Any article that has been discussed at Articles for Deletion (et al), where the outcome was to transwiki, and where the transwikification has been properly performed and the author information recorded. Alternately, any article that consists of only a dictionary definition, where the transwikification has been properly performed and the author information recorded'
	});
	if (multiple) {
		result.push({
			label: 'নি৭: বিষয়বস্তুর গুরুত্ব বা উল্লেখযোগ্যতা সম্মন্ধে কোনো ব্যাখ্যা নেই (জীবিত ব্যক্তি,প্রতিষ্ঠান বা ওয়েব কন্টেন্টের ওপর নিবন্ধ)',
			value: 'a7',
			tooltip: 'An article about a real person, group of people, band, club, company, web content, or individual animal that does not assert the importance or significance of its subject. If controversial, or if there has been a previous AfD that resulted in the article being kept, the article should be nominated for AfD instead'
		});
	} else {
		result.push({
			label: 'নি৭: উল্লেখযোগ্য ব্যক্তি নন',
			value: 'person',
			tooltip: 'An article about a real person that does not assert the importance or significance of its subject. If controversial, or if there has been a previous AfD that resulted in the article being kept, the article should be nominated for AfD instead'
		});
		result.push({
			label: 'নি৭: উল্লেখযোগ্য সঙ্গিত নয় বা  সঙ্গিতজ্ঞ নন',
			value: 'band',
			tooltip: 'Article about a band, singer, musician, or musical ensemble that does not assert the importance or significance of the subject'
		});
		result.push({
			label: 'নি৭: উল্লেখযোগ্য ক্লাব নয়',
			value: 'club',
			tooltip: 'Article about a club that does not assert the importance or significance of the subject'
		});
		result.push({
			label: 'নি৭:উল্লেখযোগ্য কোম্পানি বা সংস্থা নয়',
			value: 'corp',
			tooltip: 'Article about a company or organization that does not assert the importance or significance of the subject'
		});
		result.push({
			label: 'নি৭: উল্লেখযোগ্য ওয়েব সাইট নয়',
			value: 'web',
			tooltip: 'Article about a web site, blog, online forum, webcomic, podcast, or similar web content that does not assert the importance or significance of its subject'
		});
		result.push({
			label: 'নি৭:উল্লেখযোগ্য প্রানী নয়',
			value: 'animal',
			tooltip: 'Article about an individual animal (e.g. pet) that does not assert the importance or significance of its subject'
		});
	}
	result.push({
		label: 'A9:উল্লেখযোগ্য  গান বা অ্যালবাম নয়',
		value: 'a9',
		tooltip: 'An article about a musical recording which does not indicate why its subject is important or significant, and where the artist\'s article has never existed or has been deleted'
	});
	result.push({
		label: 'A10:সাম্প্রতিকালে প্রণীত নিবন্ধ যা বর্তমানে রয়েছে এমন বিষয়বস্তুর প্রতিলিপি',
		value: 'a10',
		tooltip: 'A recently created article with no relevant page history that does not aim to expand upon, detail or improve information within any existing article(s) on the subject, and where the title is not a plausible redirect. This does not include content forks, split pages or any article that aims at expanding or detailing an existing one.'
	});
	return result;
};

Twinkle.speedy.categoryList = [
	{
		label: 'C1:খালি বিষয়শ্রেণী',
		value: 'catempty',
		tooltip: 'Categories that have been unpopulated for at least four days. This does not apply to categories being discussed at WP:CFD, disambiguation categories, and certain other exceptions. If the category isn\'t relatively new, it possibly contained articles earlier, and deeper investigation is needed'
	},
	{
		label: 'G8:নাম পরিবর্তন বা প্রতিলিপি',
		value: 'templatecat',
		tooltip: 'This is for situations where a category is effectively empty, because the template(s) that formerly placed pages in that category are now deleted. This excludes categories that are still in use.'
	}
];

Twinkle.speedy.userList = [
	{
		label: 'U1:লেখকের অনুরোধ বা লেখক কর্তৃক খালিকৃত পাতা',
		value: 'userreq',
		tooltip: 'Personal subpages, upon request by their user. In some rare cases there may be administrative need to retain the page. Also, sometimes, main user pages may be deleted as well. See Wikipedia:User page for full instructions and guidelines'
	},
	{
		label: 'U2:অস্তিত্বহীন ব্যবহারকারি',
		value: 'nouser',
		tooltip: 'অস্তিত্বহীন ব্যবহারকারী (পরীক্ষা করুন Special:Listusers)'
	},
	{
		label: 'U3:মুক্ত নয় এমন গ্যালারি',
		value: 'gallery',
		tooltip: 'Galleries in the userspace which consist mostly of "fair use" or non-free files. Wikipedia\'s non-free content policy forbids users from displaying non-free files, even ones they have uploaded themselves, in userspace. It is acceptable to have free files, GFDL-files, Creative Commons and similar licenses along with public domain material, but not "fair use" files'
	}
];

Twinkle.speedy.getTemplateList = function twinklespeedyGetTemplateList(multiple) {
	var result = [];
	result.push({
		label: 'T2:টেমপ্লেট টি প্রতিষ্ঠিত নীতির  বিরুদ্ধ ভাবে উপস্থাপনা করা হয়েছে',
		value: 'policy',
		tooltip: 'This includes "speedy deletion" templates for issues that are not speedy deletion criteria and disclaimer templates intended to be used in articles'
	});
	if (!multiple) {
		result.push({
			label: 'T3:অব্যবহৃত ও অপ্রয়োজনীয় টেমপ্লেট',
			value: 't3',
			tooltip: 'Templates that are either substantial duplications of another template or hardcoded instances of another template where the same functionality could be provided by that other template'
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
			tooltip: 'You must specify the article criterion that applies in this case (A1, A3, A7, or A10).'
		});
	}
	result.push({
		label: 'P2:পর্যাপ্ত নিবন্ধ বা বিষয়বস্তু নেই এমন বিষয়ের ওপর প্রণীত প্রবেশদ্বার পাতা',
		value: 'emptyportal',
		tooltip: 'Any Portal based on a topic for which there is not a non-stub header article, and at least three non-stub articles detailing subject matter that would be appropriate to discuss under the title of that Portal'
	});
	return result;
};

Twinkle.speedy.getGeneralList = function twinklespeedyGetGeneralList(multiple) {
	var result = [];
	if (!multiple) {
		result.push({
			label: 'Custom rationale' + (Morebits.userIsInGroup('sysop') ? ' (custom deletion reason)' : ' using {'+'{db}} template'),
			value: 'reason',
			tooltip: '{'+'{db}} is short for "delete because". At least one of the other deletion criteria must still apply to the page, and you must make mention of this in your rationale. This is not a "catch-all" for when you can\'t find any criteria that fit.'
		});
	}
	result.push({
		label: 'স১:অসংলগ্ন,অর্থহীন,অ-উল্লেখযোগ্য  বা অবোধগম্য পাতা',
		value: 'nonsense',
		tooltip: 'This does not include poor writing, partisan screeds, obscene remarks, vandalism, fictional material, material not in English, poorly translated material, implausible theories, or hoaxes. In short, if you can understand it, G1 does not apply.'
	});
	result.push({
		label: 'স২:পরীক্ষামূলক পাতা',
		value: 'test',
		tooltip: 'A page created to test editing or other Wikipedia functions. Pages in the User namespace are not included, nor are valid but unused or duplicate templates (although criterion T3 may apply).'
	});
	result.push({
		label: 'স৩:উইকিপিডিয়া:ধ্বংসপ্রবণতা',
		value: 'vandalism',
		tooltip: 'Plain pure vandalism (including redirects left behind from pagemove vandalism)'
	});
	if (!multiple) {
		result.push({
			label: 'স৩:চালাকি বা তামাসা',
			value: 'hoax',
			tooltip: 'Blatant and obvious hoax, to the point of vandalism'
		});
	}
	result.push({
		label: 'স৪:পূর্বে অপসারিত পাতা',
		value: 'repost',
		tooltip: 'A copy, by any title, of a page that was deleted via an XfD process or Deletion review, provided that the copy is substantially identical to the deleted version. This clause does not apply to content that has been "userfied", to content undeleted as a result of Deletion review, or if the prior deletions were proposed or speedy deletions, although in this last case, other speedy deletion criteria may still apply'
	});
	result.push({
		label: 'স৫:বাধাদানকৃত বা নিষিদ্ধ ব্যবহারকারী কর্তৃক সৃষ্ট পাতা',
		value: 'banned',
		tooltip: 'Pages created by banned users while they were banned'
	});
	if (!multiple) {
		result.push({
			label: 'স৬:ইতিহাস একীকরণ',
			value: 'histmerge',
			tooltip: 'Temporarily deleting a page in order to merge page histories'
		});
		result.push({
			label: 'স৬:স্থানান্তর',
			value: 'move',
			tooltip: 'Making way for a noncontroversial move like reversing a redirect'
		});
		result.push({
			label: 'স৬: অপসারণ প্রস্তাবনা (এক্সএফডি)',
			value: 'xfd',
			tooltip: 'An admin has closed a deletion discussion (at AfD, FfD, RfD, TfD, CfD, or MfD) as "delete", but they didn\'t actually delete the page.'
		});
		result.push({
			label: 'স৬: অপ্রয়োজনীয় দ্ব্যর্থতা নিরসন পাতা',
			value: 'disambig',
			tooltip: 'This only applies for orphaned disambiguation pages which either: (1) disambiguate two or fewer existing Wikipedia pages and whose title ends in "(disambiguation)" (i.e., there is a primary topic); or (2) disambiguates no (zero) existing Wikipedia pages, regardless of its title.'
		});
		result.push({
			label: 'স৬: একাধিক দ্ব্যর্থতা নিরসন পাতায় পুনঃনির্দেশ',
			value: 'movedab',
			tooltip: 'This only applies for redirects to disambiguation pages ending in (disambiguation) where a primary topic does not exist.'
		});
		result.push({
			label: 'স৬: কপি-পেস্ট পাতা স্থানান্তর',
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
		label: 'স৭: প্রনেতার অপসারণ অনুরোধ, অথবা প্রনেতা পাতাটি খালিল করেছেন',
		value: 'author',
		tooltip: 'Any page for which deletion is requested by the original author in good faith, provided the page\'s only substantial content was added by its author. If the author blanks the page, this can also be taken as a deletion request.'
	});
	result.push({
		label: 'স৮: অপসারিত পাতার উপর নির্ভরশীল পাতা',
		value: 'g8',
		tooltip: 'such as talk pages with no corresponding subject page; subpages with no parent page; file pages without a corresponding file; redirects to invalid targets, such as nonexistent targets, redirect loops, and bad titles; or categories populated by deleted or retargeted templates. This excludes any page that is useful to the project, and in particular: deletion discussions that are not logged elsewhere, user and user talk pages, talk page archives, plausible redirects that can be changed to valid targets, and file pages or talk pages for files that exist on Wikimedia Commons.'
	});
	if (!multiple) {
		result.push({
			label: 'স৮: অপসারিত পাতার উপপাতা',
			value: 'subpage',
			tooltip: 'This excludes any page that is useful to the project, and in particular: deletion discussions that are not logged elsewhere, user and user talk pages, talk page archives, plausible redirects that can be changed to valid targets, and file pages or talk pages for files that exist on Wikimedia Commons.'
		});
	}
	result.push({
		label: 'স১০: আক্রমনাত্বক পাতা',
		value: 'attack',
		tooltip: 'Pages that serve no purpose but to disparage their subject or some other entity (e.g., "John Q. Doe is an imbecile"). This includes a biography of a living person that is negative in tone and unsourced, where there is no NPOV version in the history to revert to. Administrators deleting such pages should not quote the content of the page in the deletion summary!'
	});
	if (!multiple) {
		result.push({
			label: 'G10: আক্রমনাত্বক, তথ্যসূত্র বিহীন জীবনী',
			value: 'negublp',
			tooltip: 'A biography of a living person that is entirely negative in tone and unsourced, where there is no neutral version in the history to revert to.'
		});
	}
	result.push({
		label: 'স১১: দ্ব্যর্থহীন বিজ্ঞাপন',
		value: 'spam',
		tooltip: 'Pages which exclusively promote a company, product, group, service, or person and which would need to be fundamentally rewritten in order to become encyclopedic. Note that an article about a company or a product which describes its subject from a neutral point of view does not qualify for this criterion; an article that is blatant advertising should have inappropriate content as well'
	});
	result.push({
		label: 'স১২: দ্ব্যর্থহীন কপিরাইট লঙ্ঘন',
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
		label: 'স৮: ভুল পুনঃনির্দেশ, যেমন অপসারিত পাতার পুনঃনির্দেশ, পুনঃনির্দেশ লুপ, ভুল শিরনাম ইত্যাদি',
		value: 'redirnone',
		tooltip: 'This excludes any page that is useful to the project, and in particular: deletion discussions that are not logged elsewhere, user and user talk pages, talk page archives, plausible redirects that can be changed to valid targets, and file pages or talk pages for files that exist on Wikimedia Commons.'
	}
];

Twinkle.speedy.normalizeHash = {
	'reason': 'db',
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
	'imagepage': 'g8',
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
	'nonsense': '[[WP:PN|Patent nonsense]], meaningless, or incomprehensible',
	'test': 'পরীক্ষামূলক পাতা,অনুগ্রহপূর্বক সকল পরীক্ষা [[উইকিপিডিয়া:খেলাঘর|খেলাঘরে]] করুন',
	'vandalism': 'নিশ্চিত [[উইকিপিডিয়া:ধ্বংসপ্রবণতা|ধ্বংসপ্রবণতা]]',
	'hoax': '[[WP:Do not create hoaxes|চালাকি বা তামাসা]]',
	'repost': '[[WP:DEL|পূর্বে অপসারিত পাতা]]',
	'banned': '[[WP:BLOCK|বাধাদানকৃত]] অথবা [[WP:BAN|নিষিদ্ধ]] ব্যবহারকারী কতৃক সৃষ্ট পাতা',
	'histmerge': 'ইতিহাস একীকরণের জন্য অস্থায়ীভাবে অপসারণ',
	'move': 'অপ্রচলিত স্থানান্তর',
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
	'imagepage': 'File description page for a file that does not exist',
	'attack': '[[WP:ATP|Attack page]] or negative unsourced [[WP:BLP|BLP]]',
	'negublp': 'Negative unsourced [[WP:BLP|BLP]]',
	'spam': 'Unambiguous [[WP:ADS|advertising]] or promotion',
	'copyvio': 'Unambiguous [[WP:C|copyright infringement]]',
// Articles
	'nocontext': 'নিবন্ধের বিষয়বস্তু যাচাই করার মতো যথেষ্ট পরিমাণ লেখা নেই',
	'foreign': 'Article in a foreign language that exists on another project',
	'nocontent': 'খালি নিবন্ধ বা কোনো তথ্য নেই',
	'transwiki': 'নিবন্ধ যা অন্য কোনো প্রকল্পের জন্য প্রযোজ্য বা স্থানান্তরিত',
	'a7': 'উল্লেখযোগ্যতা নেই (real person, animal, organization, or web content)',
	'person' : 'ব্যক্তির উল্লেখযোগ্যতা নেই',
	'web': 'ওয়েবসাইটের উল্লেখযোগ্যতা নেই',
	'corp': 'প্রতিষ্ঠানের উল্লেখযোগ্যতা নেই',
	'club': 'প্রতিষ্ঠানের উল্লেখযোগ্যতা নেই',
	'band': 'সঙ্গিত/সঙ্গিতজ্ঞের উল্লেখযোগ্যতা নেই',
	'animal': 'প্রাণীটির উল্লেখযোগ্যতা নেই',
	'a9': 'Music recording by redlinked artist and no indication of importance or significance',
	'a10': 'Recently created article that duplicates an existing topic',
// Images and media
	'redundantimage': 'File redundant to another on Wikipedia',
	'noimage': 'Corrupt or empty file',
	'fpcfail': 'Unneeded file description page for a file on Commons',
	'noncom': 'File with improper license',
	'unksource': 'Lack of licensing information',
	'unfree': 'Unused non-free media',
	'norat': 'Non-free file without [[WP:RAT|fair-use rationale]]',
	'badfairuse': 'Violates [[WP:F|non-free use policy]]',
	'nowcommons': 'Media file available on Commons',
	'imgcopyvio': 'Unambiguous [[WP:COPYVIO|copyright violation]]',
	'badfiletype': 'Useless media file (not an image, audio or video)',
	'nopermission': 'No evidence of permission',
// Categories
	'catempty': 'খালি বিষয়শ্রেণী',
// User pages
	'userreq': 'ব্যবহারকারী কতৃক তার নিজের নামস্থানের পাতা অপসারণ অনুরোধ',
	'nouser': 'নিবন্ধিত নয় এমন ব্যবহারকারী সংস্লিষ্ট উপপাতা অপসারণ',
	'gallery': '[[WP:NFC|মুক্ত নয়]] এমন ছবির [[Help:Gallery|গ্যালারী]]',
// Templates
	'policy': 'Template that unambiguously misrepresents established policy',
	't3': 'Unused, redundant template',
// Portals
	'p1': '[[WP:P|Portal]] page that would be subject to speedy deletion as an article',
	'emptyportal': '[[WP:P|Portal]] without a substantial topic base',
// Redirects
	'rediruser': 'মূল নামস্থান থেকে অন্য [[WP:NS|নামস্থানের]] প্রতি [[WP:R|পুনঃনির্দেশ]]',
	'redirtypo': 'সম্প্রতি তৈরীকৃত, ভুল [[WP:R|পুনঃনির্দেশ]]'
};

Twinkle.speedy.callbacks = {
	sysop: {
		main: function( params ) {
			var thispage = new Morebits.wiki.page( mw.config.get('wgPageName'), "পাতা অপসারণ করা হচ্ছে" );

			// delete page
			var reason;
			if (params.normalized === 'db') {
				reason = prompt("অপসারণ সারাংশ প্রদান করুন,যা অপসারণ লগে প্রদান করা হবে:", "");
			} else {
				var presetReason = "[[WP:CSD#" + params.normalized.toUpperCase() + "|" + params.normalized.toUpperCase() + "]]: " + params.reason;
				if (Twinkle.getPref("promptForSpeedyDeletionSummary").indexOf(params.normalized) !== -1) {
					reason = prompt("অপসারণ সারাংশ প্রদান করুন, অথবা  স্বয়ংক্রিয় ভাবে আগত সারাংশ গ্রহন করতে OK বোতাম চাপুন", presetReason);
				} else {
					reason = presetReason;
				}
			}
			if (!reason || !reason.replace(/^\s*/, "").replace(/\s*$/, "")) {
				Morebits.status.error("Asking for reason", "you didn't give one.  I don't know... what with admins and their apathetic antics... I give up...");
				return;
			}
			thispage.setEditSummary( reason + Twinkle.getPref('deletionSummaryAd') );
			thispage.deletePage();

			// delete talk page
			if (params.deleteTalkPage &&
			    params.normalized !== 'f8' &&
			    document.getElementById( 'ca-talk' ).className !== 'new') {
				var talkpage = new Morebits.wiki.page( Morebits.wikipedia.namespaces[ mw.config.get('wgNamespaceNumber') + 1 ] + ':' + mw.config.get('wgTitle'), "Deleting talk page" );
				talkpage.setEditSummary('[[WP:CSD#G8|G8]]: অপসারিত পাতার আলাপ পাতা "' + mw.config.get('wgPageName') + '"' + Twinkle.getPref('deletionSummaryAd'));
				talkpage.deletePage();
			}

			// promote Unlink tool
			var $link, $bigtext;
			if( mw.config.get('wgNamespaceNumber') === 6 && params.normalized !== 'f8' ) {
				$link = $('<a/>', {
					'href': '#',
					'text': 'Unlink টুল ব্যবহারের জন্য এখানে ক্লিক করুন',
					'css': { 'fontSize': '130%', 'fontWeight': 'bold' },
					'click': function(){
						Morebits.wiki.actionCompleted.redirect = null;
						Twinkle.speedy.dialog.close();
						Twinkle.unlink.callback("Removing usages of and/or links to deleted file " + mw.config.get('wgPageName'));
					}
				});
				$bigtext = $('<span/>', {
					'text': 'ব্যকলিংক অপসারণের জন্য',
					'css': { 'fontSize': '130%', 'fontWeight': 'bold' }
				});
				Morebits.status.info($bigtext[0], $link[0]);
			} else if (params.normalized !== 'f8') {
				$link = $('<a/>', {
					'href': '#',
					'text': 'Unlink টুল ব্যবহারের জন্য এখানে ক্লিক করুন',
					'css': { 'fontSize': '130%', 'fontWeight': 'bold' },
					'click': function(){
						Morebits.wiki.actionCompleted.redirect = null;
						Twinkle.speedy.dialog.close();
						Twinkle.unlink.callback("অপসারিত পাতা " + mw.config.get('wgPageName') + "-এর লিংক অপসারিত হচ্ছে");
					}
				});
				$bigtext = $('<span/>', {
					'text': 'To orphan backlinks',
					'css': { 'fontSize': '130%', 'fontWeight': 'bold' }
				});
				Morebits.status.info($bigtext[0], $link[0]);
			}

			// open talk page of first contributor
			if( params.openusertalk ) {
				thispage = new Morebits.wiki.page( mw.config.get('wgPageName') );  // a necessary evil, in order to clear incorrect status text
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
				var wikipedia_api = new Morebits.wiki.api( 'পুনঃনির্দেশগুলো তালিকা তৈরী করা হচ্ছে...', query, Twinkle.speedy.callbacks.sysop.deleteRedirectsMain,
					new Morebits.status( 'পুনঃনির্দেশগুলো অপসারণ করা হচ্ছে' ) );
				wikipedia_api.params = params;
				wikipedia_api.post();
			}
		},
		openUserTalkPage: function( pageobj ) {
			pageobj.getStatusElement().unlink();  // don't need it anymore
			var user = pageobj.getCreator();
			var statusIndicator = new Morebits.status('ব্যবহারকারী ' + user, 'এর আলাপ পাতা খোলা হচ্ছে...');

			var query = {
				'title': 'ব্যবহারকারী আলাপ:' + user,
				'action': 'edit',
				'preview': 'yes',
				'vanarticle': mw.config.get('wgPageName').replace(/_/g, ' ')
			};
			switch( Twinkle.getPref('userTalkPageMode') ) {
			case 'tab':
				window.open( mw.util.wikiScript('index') + '?' + Morebits.queryString.create( query ), '_tab' );
				break;
			case 'blank':
				window.open( mw.util.wikiScript('index') + '?' + Morebits.queryString.create( query ), '_blank', 'location=no,toolbar=no,status=no,directories=no,scrollbars=yes,width=1200,height=800' );
				break;
			case 'window':
				/* falls through */
				default :
				window.open( mw.util.wikiScript('index') + '?' + Morebits.queryString.create( query ), 'twinklewarnwindow', 'location=no,toolbar=no,status=no,directories=no,scrollbars=yes,width=1200,height=800' );
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
					Morebits.wiki.removeCheckpoint();
				}
			};

			Morebits.wiki.addCheckpoint();

			var params = $.extend( {}, apiobj.params );
			params.current = 0;
			params.total = total;
			params.obj = statusIndicator;

			$snapshot.each(function(key, value) {
				var title = $(value).attr('title');
				var page = new Morebits.wiki.page(title, 'পুনঃনির্দেশ "' + title + '" অপসারিত হচ্ছে');
				page.setEditSummary('[[WP:CSD#G8|G8]]: অপসারির পাতা "' + mw.config.get('wgPageName') + "-এর পুনঃনির্দেশ" + '"' + Twinkle.getPref('deletionSummaryAd'));
				page.deletePage(onsuccess);
			});
		}
	},





	user: {
		main: function(pageobj) {
			var statelem = pageobj.getStatusElement();

			if (!pageobj.exists()) {
				statelem.error( "এই নামে কোনো পাতা নেই; হয়তো এটি পূর্বে অপসারিত হয়েছে" );
				return;
			}

			var text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();

			statelem.status( 'এই পাতার অন্যান্য ট্যাগ খোঁজা হচ্ছে...' );

			// check for existing deletion tags
			var tag = /(?:\{\{\s*(db|delete|db-.*?|speedy deletion-.*?)(?:\s*\||\s*\}\}))/.exec( text );
			if( tag ) {
				statelem.error( [ Morebits.htmlNode( 'strong', tag[1] ) , " is already placed on the page." ] );
				return;
			}

			var xfd = /(?:\{\{([rsaiftcm]fd|md1|proposed deletion)[^{}]*?\}\})/i.exec( text );
			if( xfd && !confirm( "{{" + xfd[1] + "}} অপসারণ আলোচনা সংক্রান্ত টেমপ্লেট খুঁজে পাওয়া গিয়েছে। আপনি কি নিশ্চিত ভাবে দ্রুত অপসারণ টেমপ্লেট সংযোজন করতে চান?" ) ) {
				return;
			}

			var code, parameters, i;
			if (params.normalizeds.length > 1)
			{
				code = "{{db-multiple";
				var breakFlag = false;
				$.each(params.normalizeds, function(index, norm) {
					code += "|" + norm.toUpperCase();
					parameters = Twinkle.speedy.getParameters(params.values[index], norm, statelem);
					if (!parameters) {
						breakFlag = true;
						return false;  // the user aborted
					}
					for (i in parameters) {
						if (typeof parameters[i] === 'string' && !parseInt(i, 10)) {  // skip numeric parameters - {{db-multiple}} doesn't understand them
							code += "|" + i + "=" + parameters[i];
						}
					}
				});
				if (breakFlag) {
					return;
				}
				code += "}}";
				params.utparams = [];
			}
			else
			{
				parameters = Twinkle.speedy.getParameters(params.values[0], params.normalizeds[0], statelem);
				if (!parameters) {
					return;  // the user aborted
				}
				code = "{{db-" + params.values[0];
				for (i in parameters) {
					if (typeof parameters[i] === 'string') {
						code += "|" + i + "=" + parameters[i];
					}
				}
				code += "}}";
				params.utparams = Twinkle.speedy.getUserTalkParameters(params.normalizeds[0], parameters);
			}

			var thispage = new Morebits.wiki.page(mw.config.get('wgPageName'));
			// patrol the page, if reached from Special:NewPages
			if( Twinkle.getPref('markSpeedyPagesAsPatrolled') ) {
				thispage.patrol();
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
				text = text.replace(/\{\{(mtc|(copy |move )?to ?commons|move to wikimedia commons|copy to wikimedia commons)[^}]*\}\}/gi, "");
			}

			// Generate edit summary for edit
			var editsummary;
			if (params.normalizeds.length > 1) {
				editsummary = 'দ্রুত অপসারণ প্রস্তাবনা (';
				$.each(params.normalizeds, function(index, norm) {
					editsummary += '[[WP:CSD#' + norm.toUpperCase() + '|CSD ' + norm.toUpperCase() + ']], ';
				});
				editsummary = editsummary.substr(0, editsummary.length - 2); // remove trailing comma
				editsummary += ').';
			} else if (params.normalizeds[0] === "db") {
				editsummary = '[[WP:CSD|দ্রুত অপসারণ]] প্রস্তাব করা হচ্ছে কারণ \"' + parameters["1"] + '\".';
			} else if (params.values[0] === "histmerge") {
				editsummary = "[[" + parameters["1"] + "]] এর সাথে ইতিহাস একীকরনের অনুরোধ ([[WP:CSD#G6|CSD G6]]).";
			} else {
				editsummary = "দ্রুত অপসারণ প্রস্তাবনা ([[WP:CSD#" + params.normalizeds[0].toUpperCase() + "|CSD " + params.normalizeds[0].toUpperCase() + "]]).";
			}

			pageobj.setPageText(code + ((params.normalizeds.indexOf('g10') !== -1) ? '' : ("\n" + text) )); // cause attack pages to be blanked
			pageobj.setEditSummary(editsummary + Twinkle.getPref('summaryAd'));
			pageobj.setWatchlist(params.watch);
			pageobj.setCreateOption('nocreate');
			pageobj.save(Twinkle.speedy.callbacks.user.tagComplete);
		},

		tagComplete: function(pageobj) {
			var params = pageobj.getCallbackParameters();

			// Notification to first contributor
			if (params.usertalk) {
				var callback = function(pageobj) {
					var initialContrib = pageobj.getCreator();

					// don't notify users when their user talk page is nominated
					if (initialContrib === mw.config.get('wgTitle') && mw.config.get('wgNamespaceNumber') === 3) {
						Morebits.status.warn("প্রনেতাকে জানানো হচ্ছে: এই ব্যবহারকারী তার নিজের আলাপ পাতাটি তৈরী করেছিলেন; নোটিশ দেয়া হচ্ছে না");
						return;
					}

					// quick hack to prevent excessive unwanted notifications, per request. Should actually be configurable on recipient page ...
					if ((initialContrib === "Cyberbot I" || initialContrib === "SoxBot") && params.normalizeds[0]==="f2") {
						Morebits.status.warn("প্রনেতাকে জানানো হচ্ছে: বট ব্যবহার করে এটি পাতাটি তৈরী করা হয়েছিল; নোটিশ দেয়া হচ্ছে না");
						return;
					}

					var usertalkpage = new Morebits.wiki.page('ব্যবহারকারী আলাপ:' + initialContrib, "প্রনেতাকে (" + initialContrib + ") জানানো হচ্ছে"),
					    notifytext, i;

					// specialcase "db" and "db-multiple"
					if (params.normalizeds.length > 1) {
						notifytext = "\n{{subst:db-notice-multiple|1=" + mw.config.get('wgPageName');
						var count = 2;
						$.each(params.normalizeds, function(index, norm) {
							notifytext += "|" + (count++) + "=" + norm.toUpperCase();
						});
					} else if (params.normalizeds[0] === "db") {
						notifytext = "\n{{subst:db-reason-notice|1=" + mw.config.get('wgPageName');
					} else {
						notifytext = "\n{{subst:db-csd-notice-custom|1=" + mw.config.get('wgPageName') + "|2=" + params.values[0];
					}

					for (i in params.utparams) {
						if (typeof params.utparams[i] === 'string') {
							notifytext += "|" + i + "=" + params.utparams[i];
						}
					}
					notifytext += (params.welcomeuser ? "" : "|nowelcome=yes") + "}} ~~~~";

					var editsummary = "নোটিশ: দ্রুত অপসারণের তালিকাভুক্ত";
					if (params.normalizeds.indexOf("g10") === -1) {  // no article name in summary for G10 deletions
						editsummary += " [[" + mw.config.get('wgPageName') + "]].";
					} else {
						editsummary += " একটি আক্রমনাত্বক পাতা.";
					}

					usertalkpage.setAppendText(notifytext);
					usertalkpage.setEditSummary(editsummary + Twinkle.getPref('summaryAd'));
					usertalkpage.setCreateOption('recreate');
					usertalkpage.setFollowRedirect(true);
					usertalkpage.append();

					// add this nomination to the user's userspace log, if the user has enabled it
					if (params.lognomination) {
						Twinkle.speedy.callbacks.user.addToLog(params, initialContrib);
					}
				};
				var thispage = new Morebits.wiki.page(mw.config.get('wgPageName'));
				thispage.lookupCreator(callback);
			}
			// or, if not notifying, add this nomination to the user's userspace log without the initial contributor's name
			else if (params.lognomination) {
				Twinkle.speedy.callbacks.user.addToLog(params, null);
			}
		},

		// note: this code is also invoked from twinkleimage
		// the params used are:
		//   for CSD: params.values, params.normalizeds  (note: normalizeds is an array)
		//   for DI: params.fromDI = true, params.type, params.normalized  (note: normalized is a string)
		addToLog: function(params, initialContrib) {
			var wikipedia_page = new Morebits.wiki.page("ব্যবহারকারী:" + mw.config.get('wgUserName') + "/" + Twinkle.getPref('speedyLogPageName'), "Adding entry to userspace log");
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
				if (Morebits.userIsInGroup("sysop")) {
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
				if (params.normalizeds.length > 1) {
					text += "multiple criteria (";
					$.each(params.normalizeds, function(index, norm) {
						text += "[[WP:CSD#" + norm.toUpperCase() + "|" + norm.toUpperCase() + ']], ';
					});
					text = text.substr(0, text.length - 2);  // remove trailing comma
					text += ')';
				} else if (params.normalizeds[0] === "db") {
					text += "{{tl|db-reason}}";
				} else {
					text += "[[WP:CSD#" + params.normalizeds[0].toUpperCase() + "|CSD " + params.normalizeds[0].toUpperCase() + "]] ({{tl|db-" + params.values[0] + "}})";
				}
			}

			if (params.logInitialContrib) {
				text += "; {{user|" + params.logInitialContrib + "}}-কে জানান‌ হয়েছে";
			}
			text += " ~~~~~\n";

			pageobj.setPageText(text);
			pageobj.setEditSummary("দ্রুত অপসারণের মনোনয়ন তালিকাভুক্ত করা হচ্ছে [[" + mw.config.get('wgPageName') + "]]." + Twinkle.getPref('summaryAd'));
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
			var dbrationale = prompt('অনুগ্রহ করে যুক্তি উপস্থাপন করুন। \n\"এই পাতাটি দ্রুত অপসারণ যোগ্য কারণ:\"', "");
			if (!dbrationale || !dbrationale.replace(/^\s*/, "").replace(/\s*$/, ""))
			{
				statelem.error( 'আপনাকে অবশ্যই একটি বিচারধারা নির্বাচন করতে হবে। ব্যবহারকারি বাতিল করেছেন।' );
				return null;
			}
			parameters["1"] = dbrationale;
			break;
		case 'u1':
			if (mw.config.get('wgNamespaceNumber') === 3 && !((/\//).test(mw.config.get('wgTitle'))))
			{
				var u1rationale = prompt('[CSD U1] এই ব্যবহারকারী পাতাটি অপসারণের পক্ষে যুক্তি উল্লেখ করুন:', "");
				if (!u1rationale || !u1rationale.replace(/^\s*/, "").replace(/\s*$/, ""))
				{
					statelem.error( 'আপনাকে অবশ্যই একটি বিচারধারা নির্বাচন করতে হবে। ব্যবহারকারি বাতিল করেছেন।' );
					return null;
				}
				parameters.rationale = u1rationale;
			}
			break;
		case 'f8':
			var pagenamespaces = mw.config.get('wgPageName').replace( '_', ' ' );
			var filename = prompt( '[CSD F8] কমন্সে থাকা ফাইলটির নাম লিখুন:', pagenamespaces );
			if (filename === null)
			{
				statelem.error( 'ব্যবহারকারি বাতিল করেছেন।' );
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
			var deldisc = prompt( '[CSD G4] অপসারণের আলোচনা হয়েছিল সেই পাতার নাম লিখুন।  \nটীকা: নিয়মিত AfD এবং MfD আলোচনার ক্ষেত্রে শুধুমাত্র  OK ক্লিক করুন - লিংকটি সয়ংক্রিয়ভাবে যুক্ত হয়ে যাবে।', "" );
			if (deldisc === null)
			{
				statelem.error( 'ব্যবহারকারি বাতিল করেছেন।' );
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
			var banneduser = prompt( '[CSD G5] ব্যন করা হয়েছিলো সেই ব্যবহারকারীর নাম লিখুন:', "" );
			if (banneduser === null)
			{
				statelem.error( 'ব্যবহারকারি বাতিল করেছেন।' );
				return null;
			}
			parameters["1"] = banneduser;
			break;
		case 'g6':
			switch( value ) {
				case 'histmerge':
					var mergetitle = prompt( '[CSD G6: history merge] যে পাতাটি স্থানান্তর করা হবে সেই পাতার নাম লিখুন:', "" );
					if (mergetitle === null)
					{
						statelem.error( 'ব্যবহারকারি বাতিল করেছেন।' );
						return null;
					}
					parameters["1"] = mergetitle;
					break;
				case 'move':
					var title = prompt( '[CSD G6: move] যে পাতাটি এখানে স্থানান্তর করা হবে সেই পাতার নাম লিখুন:', "" );
					if (title === null)
					{
						statelem.error( 'ব্যবহারকারি বাতিল করেছেন।' );
						return null;
					}
					var reason = prompt( '[CSD G6: move] পাতা স্থানান্তরের কারণটি লিখুন:', "" );
					if (reason === null)
					{
						statelem.error( 'ব্যবহারকারি বাতিল করেছেন।' );
						return null;
					}
					parameters["1"] = title;
					parameters["2"] = reason;
					break;
				case 'xfd':
					var votepage = prompt( '[CSD G6: xfd] অপসারণ আলোচনার পূর্ণ লিংক উল্লেখ করুন, [[ ]] ব্যবহারের প্রয়োজন নেই:', "" );
					if (votepage === null)
					{
						statelem.error( 'ব্যবহারকারি বাতিল করেছেন।' );
						return null;
					}
					parameters.fullvotepage = votepage;
					break;
				case 'copypaste':
					var copytitle = prompt( '[CSD G6: copypaste] যে পাতা থেকে কপি পেস্ট করা হয়েছে সেই পাতার নাম লিখুন:', "" );
					if (copytitle === null)
					{
						statelem.error( 'ব্যবহারকারি বাতিল করেছেন।' );
						return null;
					}
					parameters["1"] = copytitle;
					break;
				case 'g6':
					var g6rationale = prompt( '[CSD G6] অতিরিক্ত কারণটি উল্লেখ করুন (এড়িয়ে যেতে খালি রাখুন):', "" );
					if (g6rationale === null)
					{
						statelem.error( 'ব্যবহারকারি বাতিল করেছেন।' );
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
				var g7rationale = prompt('[CSD G7] অতিরিক্ত কারণটি উল্লেখ করুন (এড়িয়ে যেতে খালি রাখুন):', "");
				if (g7rationale === null)
				{
					statelem.error( 'ব্যবহারকারি বাতিল করেছেন।' );
					return null;
				}
				if (g7rationale !== '')
				{
					parameters.rationale = g7rationale;
				}
			}
			break;
		case 'g12':
			var url = prompt( '[CSD G12]  কপিকৃত তথ্যের উৎস সংযোজন, লিংকের সাথে "http://" অংশটি সংযোজন করুন:', "" );
			if (url === null)
			{
				statelem.error( 'ব্যবহারকারি বাতিল করেছেন।' );
				return null;
			}
			parameters.url = url;
			break;
		case 'f9':
			var f9url = prompt( '[CSD F9] কপিকৃত তথ্যের উৎস সংযোজন, লিংকের সাথে "http://" অংশটি সংযোজন করুন।  \n লিংক জানা না থাকলে CSD F9 ব্যবহার করবেন না।  (বিশেষ: ইন্টারনেটে সহজলভ্য নয় এমন সূত্রের ক্ষেত্রে এটি খালি রাখুন।)', "" );
			if (f9url === null)
			{
				statelem.error( 'ব্যবহারকারি বাতিল করেছেন।' );
				return null;
			}
			parameters.url = f9url;
			break;
		case 'a2':
			var source = prompt('[CSD A2] অন্য ভাষার উইকিপিডিয়ায় নিবন্ধের নাম লিখুন (যেমন:"fr:Bonjour"):', "");
			if (source === null)
			{
				statelem.error('ব্যবহারকারি বাতিল করেছেন।');
				return null;
			}
			parameters.source = source;
			break;
		case 'a10':
			var duptitle = prompt( '[CSD A10] প্রতিলিপি নিবন্ধের নাম লিখুন:', "" );
			if (duptitle === null)
			{
				statelem.error( 'ব্যবহারকারি বাতিল করেছেন।' );
				return null;
			}
			parameters.article = duptitle;
			break;
		case 'f1':
			var img = prompt( '[CSD F1] প্রতিলিপি ফাইলের নাম লিখুন, "Image:" অথবা "File:" প্রিফিক্স সংযোজনের প্রয়োজন নেই:', "" );
			if (img === null)
			{
				statelem.error( 'ব্যবহারকারি বাতিল করেছেন।' );
				return null;
			}
			parameters.filename = img;
			break;
		case 't3':
			var template = prompt( '[CSD T3] প্রতিলিপি টেমপ্লেটের নাম লিখুন, "টেমপ্লেট:" প্রিফিক্স সংযোজনের প্রয়োজন নেই', "" );
			if (template === null)
			{
				statelem.error( 'ব্যবহারকারি বাতিল করেছেন।' );
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
			var criterion = prompt( '[CSD P1] এই প্রবেশদ্বারটি নিবন্ধ দ্রুত অপসারণের যে বিচার ধারার আওতভুক্ত সেঔ  কোডটি এখানে লিখুন:   \n\n(A1 = অসংলগ্ন,অর্থহীন, A3 = খালি, A7 = উল্লেখযোগ্য নয়, A10 = প্রতিলিপি)', "" );
			if (!criterion || !criterion.replace(/^\s*/, "").replace(/\s*$/, ""))
			{
				statelem.error( 'আপনাকে অবশ্যই বিচারধারা নির্বাচন করতে হবে। ব্যবহারকারি বাতিল করেছেন।' );
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


Twinkle.speedy.resolveCsdValues = function twinklespeedyResolveCsdValues(e) {
	var values = (e.target.form ? e.target.form : e.target).getChecked('csd');
	if (values.length === 0) {
		alert( "অনুগ্রহ করে একটি বিচারধারা নির্বচন করুন!" );
		return null;
	}
	return values;
};

Twinkle.speedy.callback.evaluateSysop = function twinklespeedyCallbackEvaluateSysop(e)
{
	mw.config.set('wgPageName', mw.config.get('wgPageName').replace(/_/g, ' ')); // for queen/king/whatever and country!
	var form = (e.target.form ? e.target.form : e.target);

	var tag_only = form.tag_only;
	if( tag_only && tag_only.checked ) {
		Twinkle.speedy.callback.evaluateUser(e);
		return;
	}

	var value = Twinkle.speedy.resolveCsdValues(e)[0];
	if (!value) {
		return;
	}
	var normalized = Twinkle.speedy.normalizeHash[ value ];

	var params = {
		value: value,
		normalized: normalized,
		watch: Twinkle.getPref('watchSpeedyPages').indexOf( normalized ) !== -1,
		reason: Twinkle.speedy.reasonHash[ value ],
		openusertalk: Twinkle.getPref('openUserTalkPageOnSpeedyDelete').indexOf( normalized ) !== -1,
		deleteTalkPage: form.talkpage && form.talkpage.checked,
		deleteRedirects: form.redirects.checked
	};

	Morebits.simpleWindow.setButtonsEnabled( false );
	Morebits.status.init( form );

	Twinkle.speedy.callbacks.sysop.main( params );
};

Twinkle.speedy.callback.evaluateUser = function twinklespeedyCallbackEvaluateUser(e) {
	mw.config.set('wgPageName', mw.config.get('wgPageName').replace(/_/g, ' '));  // for queen/king/whatever and country!
	var form = (e.target.form ? e.target.form : e.target);

	if (e.target.type === "checkbox") {
		return;
	}

	var values = Twinkle.speedy.resolveCsdValues(e);
	if (!values) {
		return;
	}
	//var multiple = form.multiple.checked;
	var normalizeds = [];
	$.each(values, function(index, value) {
		var norm = Twinkle.speedy.normalizeHash[ value ];

		// for sysops only
		if (['f4', 'f5', 'f6', 'f11'].indexOf(norm) !== -1) {
			alert("Tagging with F4, F5, F6, and F11 is not possible using the CSD module.  Try using DI instead, or unchecking \"Tag page only\" if you meant to delete the page.");
			return;
		}

		normalizeds.push(norm);
	});

	// analyse each criterion to determine whether to watch the page/notify the creator
	var watchPage = false;
	$.each(normalizeds, function(index, norm) {
		if (Twinkle.getPref('watchSpeedyPages').indexOf(norm) !== -1) {
			watchPage = true;
			return false;  // break
		}
	});

	var notifyuser = false;
	if (form.notify.checked) {
		$.each(normalizeds, function(index, norm) {
			if (Twinkle.getPref('notifyUserOnSpeedyDeletionNomination').indexOf(norm) !== -1) {
				if (norm === 'g6' && ['disambig', 'copypaste'].indexOf(values[index]) === -1) {
					return true;
				}
				notifyuser = true;
				return false;  // break
			}
		});
	}

	var welcomeuser = false;
	if (notifyuser) {
		$.each(normalizeds, function(index, norm) {
			if (Twinkle.getPref('welcomeUserOnSpeedyDeletionNotification').indexOf(norm) !== -1) {
				welcomeuser = true;
				return false;  // break
			}
		});
	}

	var csdlog = false;
	if (Twinkle.getPref('logSpeedyNominations')) {
		$.each(normalizeds, function(index, norm) {
			if (Twinkle.getPref('noLogOnSpeedyNomination').indexOf(norm) === -1) {
				csdlog = true;
				return false;  // break
			}
		});
	}

	var params = {
		values: values,
		normalizeds: normalizeds,
		watch: watchPage,
		usertalk: notifyuser,
		welcomeuser: welcomeuser,
		lognomination: csdlog
	};

	Morebits.simpleWindow.setButtonsEnabled( false );
	Morebits.status.init( form );

	Morebits.wiki.actionCompleted.redirect = mw.config.get('wgPageName');
	Morebits.wiki.actionCompleted.notice = "ট্যাগ সংযোজন সম্পন্ন";

	var wikipedia_page = new Morebits.wiki.page(mw.config.get('wgPageName'), "ট্যাগ সংযোজন করা হচ্ছে");
	wikipedia_page.setCallbackParameters(params);
	wikipedia_page.load(Twinkle.speedy.callbacks.user.main);
};
