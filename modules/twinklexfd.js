/*
 ****************************************
 *** twinklexfd.js: XFD module
 ****************************************
 * Mode of invocation:     Tab ("XFD")
 * Active on:              Existing, non-special pages, except for file pages with no local (non-Commons) file which are not redirects
 * Config directives in:   TwinkleConfig
 */

Twinkle.xfd = function twinklexfd() {
	// Disable on:
	// * special pages
	// * non-existent pages
	// * files on Commons, whether there is a local page or not (unneeded local pages of files on Commons are eligible for CSD F2)
	// * file pages without actual files (these are eligible for CSD G8)
	if ( mw.config.get('wgNamespaceNumber') < 0 || !mw.config.get('wgArticleId') || (mw.config.get('wgNamespaceNumber') === 6 && (document.getElementById('mw-sharedupload') || (!document.getElementById('mw-imagepage-section-filehistory') && !Morebits.wiki.isPageRedirect()))) ) {
		return;
	}
	twAddPortletLink( Twinkle.xfd.callback, "অপসারণ প্রস্তাবনা", "tw-xfd", "(এক্সএফডি)অন্য সকল অপসারণ প্রস্তাবনার প্রস্তাবনা" );
};

Twinkle.xfd.num2order = function twinklexfdNum2order( num ) {
	switch( num ) {
	case 1: return '';
	case 2: return '2nd';
	case 3: return '3rd';
	default: return num + 'th';
	}
};

Twinkle.xfd.currentRationale = null;

// error callback on Morebits.status.object
Twinkle.xfd.printRationale = function twinklexfdPrintRationale() {
	if (Twinkle.xfd.currentRationale) {
		var p = document.createElement("p");
		p.textContent = "অপসারণের কারণটি নিচে উল্লেখ করা হয়েছে, আপনি পুনরায় চেষ্টা করতে চাইলে এখান থেকে কপি করে নতুন এক্সএফডি উইন্ডোতে লিখতে পারেন:";
		var pre = document.createElement("pre");
		pre.className = "toccolours";
		pre.style.marginTop = "0";
		pre.textContent = Twinkle.xfd.currentRationale;
		p.appendChild(pre);
		Morebits.status.root.appendChild(p);
		// only need to print the rationale once
		Twinkle.xfd.currentRationale = null;
	}
};

Twinkle.xfd.callback = function twinklexfdCallback() {
	if (!twinkleUserAuthorized) {
		alert("নবাগত,আপনার অ্যাকাঊন্টটি  টুইংকল ব্যবহার করার জন্য নয়।");
		return;
	}

	var Window = new Morebits.simpleWindow( 600, 350 );
	Window.setTitle( "অপসারণের প্রস্তাবনা (এক্সএফডি))" );
	Window.setScriptName( "টুইংকল" );
	Window.addFooterLink( "অপসারণ প্রস্তাবনা সম্পর্কে", "WP:XFD" );
	Window.addFooterLink( "টুইংকল সাহায্য", "WP:TW/DOC#xfd" );

	var form = new Morebits.quickForm( Twinkle.xfd.callback.evaluate );
	var categories = form.append( {
			type: 'select',
			name: 'category',
			label: 'Deletion discussion venue:',
			tooltip: 'When activated, a default choice is made, based on what namespace you are in. This default should be the most appropriate',
			event: Twinkle.xfd.callback.change_category
		} );
	categories.append( {
			type: 'option',
			label: 'AfD (উইকিপিডিয়া:নিবন্ধ অপসারণের প্রস্তাবনা)',
			selected: mw.config.get('wgNamespaceNumber') === 0,  // Main namespace
			value: 'afd'
		} );
	categories.append( {
			type: 'option',
			label: 'TfD (টেমপ্লেট অপসারণ প্রস্তাবনার আলোচনা)',
			selected: mw.config.get('wgNamespaceNumber') === 10,  // Template namespace
			value: 'tfd'
		} );
	categories.append( {
			type: 'option',
			label: 'FfD (ফাইল অপসারণ প্রস্তাবনার আলোচনা)/PUF (সম্ভাব্য মুক্ত নয় এমন ফাইল)',
			selected: mw.config.get('wgNamespaceNumber') === 6,  // File namespace
			value: 'ffd'
		} );
	categories.append( {
			type: 'option',
			label: 'CfD (বিষয়শ্রেণী অপসারণ প্রস্তাবনার আলোচনা)',
			selected: mw.config.get('wgNamespaceNumber') === 14,  // Category namespace
			value: 'cfd'
		} );
  categories.append( {
			type: 'option',
			label: 'CfD/S (বিষয়শ্রেণী নাম পরিবর্তনের প্রস্তাবনা)',
			value: 'cfds'
		} );
	categories.append( {
			type: 'option',
			label: 'MfD (Miscellany for deletion)',
			selected: [ 0, 6, 10, 14 ].indexOf( mw.config.get('wgNamespaceNumber') ) === -1,
			value: 'mfd'
		} );
	categories.append( {
			type: 'option',
			label: 'RfD (পুনঃর্নিদেশ অপসারণ প্রস্তাবনার প্রস্তাবনা)',
			selected: Morebits.wiki.isPageRedirect(),
			value: 'rfd'
		} );
	form.append( {
			type: 'checkbox',
			list: [
				{
					label: 'সম্ভব হলে প্রনেতাকে জানান',
					value: 'notify',
					name: 'notify',
					tooltip: "এই অপশনটি নির্বাচন করা থাকলে প্রনেতার আলাপ পাতায় একটি টেমপ্লেট যুক্ত করা হবে।",
					checked: true
				}
			]
		}
	);
	form.append( {
			type: 'field',
			label:'কাজের ক্ষেত্র',
			name: 'work_area'
		} );
	form.append( { type:'submit' } );

	var result = form.render();
	Window.setContent( result );
	Window.display();

	// We must init the controls
	var evt = document.createEvent( "Event" );
	evt.initEvent( 'change', true, true );
	result.category.dispatchEvent( evt );
};

Twinkle.xfd.previousNotify = true;

Twinkle.xfd.callback.change_category = function twinklexfdCallbackChangeCategory(e) {
	var value = e.target.value;
	var form = e.target.form;
	var old_area = Morebits.quickForm.getElements(e.target.form, "work_area")[0];
	var work_area = null;

	var oldreasontextbox = form.getElementsByTagName('textarea')[0];
	var oldreason = (oldreasontextbox ? oldreasontextbox.value : '');

	switch( value ) {
	case 'afd':
		work_area = new Morebits.quickForm.element( {
				type: 'field',
				label: 'নিবন্ধ অপসারণ প্রস্তাবনা',
				name: 'work_area'
			} );
		work_area.append( {
				type: 'checkbox',
				list: [
						{
							label: 'অপসারণ ট্যাগে <noinclude> কোড ব্যবহার করুন',
							value: 'noinclude',
							name: 'noinclude',
							tooltip: 'অপসারণ ট্যাগটি &lt;noinclude&gt; কোডের মাধ্যমে ব্যবহার করা হবে। সাধারণ কাজের জন্য এটি ব্যবহার করার প্রয়োজন নেই।'
						}
					]
		} );
		var afd_category = work_area.append( {
				type:'select',
				name:'xfdcat',
				label:'অপসারণ প্রস্তাবনার বিষয় নির্বাচন করুন:'
			} );

		afd_category.append( { type:'option', label:'অজানা', value:'?', selected:true } );
		afd_category.append( { type:'option', label:'সঙ্গিত এবং অন্যান্য মিডিয়া ফাইল', value:'M' } );
		afd_category.append( { type:'option', label:'প্রতিষ্ঠান অথবা পণ্য', value:'O' } );
		afd_category.append( { type:'option', label:'Biographical', value:'B' } );
		afd_category.append( { type:'option', label:'Society topics', value:'S' } );
		afd_category.append( { type:'option', label:'ওয়েব অথবা ইন্টারনেট', value:'W' } );
		afd_category.append( { type:'option', label:'খেলাধুলা', value:'G' } );
		afd_category.append( { type:'option', label:'বিজ্ঞান ও প্রযুক্তি', value:'T' } );
		afd_category.append( { type:'option', label:'Fiction and the arts', value:'F' } );
		afd_category.append( { type:'option', label:'Places and transportation', value:'P' } );
		afd_category.append( { type:'option', label:'Indiscernible or unclassifiable topic', value:'I' } );
		afd_category.append( { type:'option', label:'Debate not yet sorted', value:'U' } );

		work_area.append( {
				type: 'textarea',
				name: 'xfdreason',
				label: 'কারণ: ',
				value: oldreason
			} );
		work_area = work_area.render();
		old_area.parentNode.replaceChild( work_area, old_area );
		break;
	case 'tfd':
		work_area = new Morebits.quickForm.element( {
				type: 'field',
				label: 'প্রস্তাবনার টেমপ্লেটসমূহ',
				name: 'work_area'
			} );
		work_area.append( {
				type: 'div',
				label: 'Stub types and userboxes are not eligible for TfD. Stub types go to CfD, and userboxes go to MfD.'
			} );
		work_area.append( {
				type: 'checkbox',
				list: [
						{
							label: 'Inline deletion tag',
							value: 'tfdinline',
							name: 'tfdinline',
							tooltip: 'Use {{tfd|type=inline}} to tag the page instead of {{tfd}}. Good for inline templates (those that appear amongst the words of text).',
							checked: false
						},
						{
							label: 'Wrap deletion tag with <noinclude> (for substituted templates only)',
							value: 'noinclude',
							name: 'noinclude',
							tooltip: 'Will wrap the deletion tag in &lt;noinclude&gt; tags, so that it won\'t get substituted along with the template.'
						}
					]
		} );
		work_area.append( {
				type: 'textarea',
				name: 'xfdreason',
				label: 'কারণ: ',
				value: oldreason
			} );
		work_area = work_area.render();
		old_area.parentNode.replaceChild( work_area, old_area );
		break;
	case 'mfd':
		work_area = new Morebits.quickForm.element( {
				type: 'field',
				label: 'Miscellany for deletion',
				name: 'work_area'
			} );
		work_area.append( {
				type: 'checkbox',
				list: [
						{
							label: 'অপসারণ ট্যাগে <noinclude> কোড ব্যবহার করুন',
							value: 'noinclude',
							name: 'noinclude',
							tooltip: 'Will wrap the deletion tag in &lt;noinclude&gt; tags, so that it won\'t transclude. Select this option for userboxes.'
						}
					]
		} );
		if (mw.config.get('wgNamespaceNumber') === 2 /* User: */ || mw.config.get('wgNamespaceNumber') === 3 /* User talk: */) {
			work_area.append( {
				type: 'checkbox',
				list: [
						{
							label: 'Also notify owner of userspace if they are not the page creator',
							value: 'notifyuserspace',
							name: 'notifyuserspace',
							tooltip: 'If the user in whose userspace this page is located, is not the page creator (for example, the page is a rescued article stored as a userspace draft), notify the userspace owner as well.',
							checked: true
						}
					]
			} );
		}
		work_area.append( {
				type: 'textarea',
				name: 'xfdreason',
				label: 'কারণ: ',
				value: oldreason
			} );
		work_area = work_area.render();
		old_area.parentNode.replaceChild( work_area, old_area );
		break;
	case 'ffd':
		work_area = new Morebits.quickForm.element( {
				type: 'field',
				label: 'Files for deletion',
				name: 'work_area'
			} );
		work_area.append( {
				type: 'checkbox',
				name: 'puf',
				list: [
					{
						label: 'সম্ভাব্য মুক্তনয় এমন ফাইল',
						value: 'puf',
						tooltip: 'File has disputed source or licensing information'
					}
				]
			} );
		work_area.append( {
				type: 'textarea',
				name: 'xfdreason',
				label: 'কারণ: ',
				value: oldreason
			} );
		work_area = work_area.render();
		old_area.parentNode.replaceChild( work_area, old_area );
		break;
	case 'cfd':
		work_area = new Morebits.quickForm.element( {
				type: 'field',
				label: 'বিষয়শ্রেণী অপসারণের প্রস্তাবনা',
				name: 'work_area'
			} );
		var cfd_category = work_area.append( {
				type: 'select',
				label: 'যে কাজটি করা হবে নির্বাচন করুন: ',
				name: 'xfdcat',
				event: function(e) {
					var value = e.target.value;
					var target = e.target.form.xfdtarget;
					// update enabled status
					if( value === 'cfd' ) {
						target.disabled = true;
					} else {
						target.disabled = false;
					}
					// update label
					if( value === 'cfs' ) {
						target.previousSibling.textContent = "নির্দিষ্ট বিষয়শ্রেণী: ";
					} else if( value === 'cfc' ) {
						target.previousSibling.textContent = "নির্দিষ্ট নিবন্ধ: ";
					} else {
						target.previousSibling.textContent = "নির্দিষ্ট বিষয়শ্রেণী: ";
					}
					// add/remove extra input box
					if( value === 'cfs' && $(target.parentNode).find("input[name='xfdtarget2']").length === 0 ) {
						var xfdtarget2 = document.createElement("input");
						xfdtarget2.setAttribute("name", "xfdtarget2");
						xfdtarget2.setAttribute("type", "text");
						target.parentNode.appendChild(xfdtarget2);
					} else {
						$(target.parentNode).find("input[name='xfdtarget2']").remove();
					}
				}
			} );
		cfd_category.append( { type: 'option', label: 'অপসারণ', value: 'cfd', selected: true } );
		cfd_category.append( { type: 'option', label: 'একীকরণ', value: 'cfm' } );
		cfd_category.append( { type: 'option', label: 'নাম পরিবর্তন', value: 'cfr' } );
		cfd_category.append( { type: 'option', label: 'Split', value: 'cfs' } );
		cfd_category.append( { type: 'option', label: 'নিবন্ধে রূপান্তর', value: 'cfc' } );

		work_area.append( {
				type: 'input',
				name: 'xfdtarget',
				label: 'নির্দিষ্ট পাতা: ',
				disabled: true,
				value: ''
			} );
		work_area.append( {
				type: 'textarea',
				name: 'xfdreason',
				label: 'কারণ: ',
				value: oldreason
			} );
		work_area = work_area.render();
		old_area.parentNode.replaceChild( work_area, old_area );
		break;
	case 'cfds':
		work_area = new Morebits.quickForm.element( {
				type: 'field',
				label: 'দ্রুত নাম পরিবর্তনের বিষয়শ্রেণীসমূহ',
				name: 'work_area'
			} );
		var cfds_category = work_area.append( {
				type: 'select',
				label: 'C2 sub-criterion: ',
				name: 'xfdcat',
				tooltip: 'See WP:CFDS for full explanations.',
				event: function(e) {
					var value = e.target.value;
					var target = e.target.form.xfdtarget;
					if( value === 'cfd' ) {
						target.disabled = true;
					} else {
						target.disabled = false;
					}
				}
			} );
		cfds_category.append( { type: 'option', label: 'C2A: Typographic and spelling fixes', value: 'C2A', selected: true } );
		cfds_category.append( { type: 'option', label: 'C2B: Naming conventions and disambiguation', value: 'C2B' } );
		cfds_category.append( { type: 'option', label: 'C2C: Consistency with names of similar categories', value: 'C2C' } );
		cfds_category.append( { type: 'option', label: 'C2D: Rename to match article name', value: 'C2D' } );

		work_area.append( {
				type: 'input',
				name: 'xfdtarget',
				label: 'New name: ',
				value: ''
			} );
		work_area.append( {
				type: 'textarea',
				name: 'xfdreason',
				label: 'কারণ: ',
				value: oldreason
			} );
		work_area = work_area.render();
		old_area.parentNode.replaceChild( work_area, old_area );
		break;
	case 'rfd':
		work_area = new Morebits.quickForm.element( {
				type: 'field',
				label: 'পুনঃনির্দেশ অপসারণের প্রস্তাবনা',
				name: 'work_area'
			} );
		work_area.append( {
				type: 'textarea',
				name: 'xfdreason',
				label: 'কারণ: ',
				value: oldreason
			} );
		work_area = work_area.render();
		old_area.parentNode.replaceChild( work_area, old_area );
		break;
	default:
		work_area = new Morebits.quickForm.element( {
				type: 'field',
				label: 'Nothing for anything',
				name: 'work_area'
			} );
		work_area = work_area.render();
		old_area.parentNode.replaceChild( work_area, old_area );
		break;
	}

	// No creator notification for CFDS
	if (value === "cfds") {
		Twinkle.xfd.previousNotify = form.notify.checked;
		form.notify.checked = false;
		form.notify.disabled = true;
	} else {
		form.notify.checked = Twinkle.xfd.previousNotify;
		form.notify.disabled = false;
	}
};

Twinkle.xfd.callbacks = {
	afd: {
		main: function(apiobj) {
			var xmlDoc = apiobj.responseXML;
			var titles = $(xmlDoc).find('allpages p');

			// There has been no earlier entries with this prefix, just go on.
			if( titles.length <= 0 ) {
				apiobj.params.numbering = apiobj.params.number = '';
			} else {
				var number = 0;
				for( var i = 0; i < titles.length; ++i ) {
					var title = titles[i].getAttribute('title');

					// First, simple test, is there an instance with this exact name?
					if( title === 'উইকিপিডিয়া:নিবন্ধ অপসারণের প্রস্তাবনা/' + mw.config.get('wgPageName') ) {
						number = Math.max( number, 1 );
						continue;
					}

					var order_re = new RegExp( '^' +
						RegExp.escape( 'উইকিপিডিয়া:নিবন্ধ অপসারণের প্রস্তাবনা/' + mw.config.get('wgPageName'), true ) +
						'\\s*\\(\\s*(\\d+)(?:(?:th|nd|rd|st) nom(?:ination)?)?\\s*\\)\\s*$');
					var match = order_re.exec( title );

					// No match; A non-good value
					if( !match ) {
						continue;
					}

					// A match, set number to the max of current
					number = Math.max( number, Number(match[1]) );
				}
				apiobj.params.number = Twinkle.xfd.num2order( parseInt( number, 10 ) + 1);
				apiobj.params.numbering = number > 0 ? ' (' + apiobj.params.number + ' nomination)' : '';
			}
			apiobj.params.discussionpage = 'উইকিপিডিয়া:নিবন্ধ অপসারণের প্রস্তাবনা/' + mw.config.get('wgPageName') + apiobj.params.numbering;

			Morebits.status.info( "পরবর্তী প্রস্তাবনা পাতা", "[[" + apiobj.params.discussionpage + "]]" );

			// Updating data for the action completed event
			Morebits.wiki.actionCompleted.redirect = apiobj.params.discussionpage;
			Morebits.wiki.actionCompleted.notice = "মনোনয়ন সম্মন্ন, now redirecting to the discussion page";

			// Tagging article
			var wikipedia_page = new Morebits.wiki.page(mw.config.get('wgPageName'), "নিবন্ধে অপসারণ ট্যাগ যুক্ত করা হচ্ছে");
			wikipedia_page.setFollowRedirect(true);  // should never be needed, but if the article is moved, we would want to follow the redirect
			wikipedia_page.setCallbackParameters(apiobj.params);
			wikipedia_page.load(Twinkle.xfd.callbacks.afd.taggingArticle);
		},
		// Tagging needs to happen before everything else: this means we can check if there is an AfD tag already on the page
		taggingArticle: function(pageobj) {
			var text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();
			var statelem = pageobj.getStatusElement();

			// Check for existing AfD tag, for the benefit of new page patrollers
			var textNoAfd = text.replace(/\{\{\s*(Article for deletion\/dated|AfDM)\s*(\|(?:\{\{[^{}]*\}\}|[^{}])*)?\}\}\s*/g, "");
			if (text !== textNoAfd) {
				if (confirm("An AfD tag was found on this article. Maybe someone beat you to it.  \nClick OK to replace the current AfD tag (not recommended), or Cancel to abandon your nomination.")) {
					text = textNoAfd;
				} else {
					statelem.error("Article already tagged with AfD tag, and you chose to abort");
					window.location.reload();
					return;
				}
			}

			// Now we know we want to go ahead with it, trigger the other AJAX requests

			// Starting discussion page
			var wikipedia_page = new Morebits.wiki.page(params.discussionpage, "নিবন্ধ অপসারণের প্রস্তাবনা পাতা তৈরী করা হচ্ছে");
			wikipedia_page.setCallbackParameters(params);
			wikipedia_page.load(Twinkle.xfd.callbacks.afd.discussionPage);

			// Today's list
			var date = new Date();
			wikipedia_page = new Morebits.wiki.page('উইকিপিডিয়া:নিবন্ধ অপসারণের প্রস্তাবনা/Log/' + date.getUTCFullYear() + ' ' +
				date.getUTCMonthName() + ' ' + date.getUTCDate(), "Adding discussion to today's list");
			wikipedia_page.setFollowRedirect(true);
			wikipedia_page.setCallbackParameters(params);
			wikipedia_page.load(Twinkle.xfd.callbacks.afd.todaysList);

			// Notification to first contributor
			if (params.usertalk) {
				var thispage = new Morebits.wiki.page(mw.config.get('wgPageName'));
				thispage.setCallbackParameters(params);
				thispage.lookupCreator(Twinkle.xfd.callbacks.afd.userNotification);
			}

			// Remove some tags that should always be removed on AfD.
			text = text.replace(/\{\{\s*(dated prod|dated prod blp|Prod blp\/dated|Proposed deletion\/dated|prod2|Proposed deletion endorsed|New unreviewed article|Userspace draft)\s*(\|(?:\{\{[^{}]*\}\}|[^{}])*)?\}\}\s*/ig, "");
			// Then, test if there are speedy deletion-related templates on the article.
			var textNoSd = text.replace(/\{\{\s*(db(-\w*)?|delete|(?:hang|hold)[\- ]?on)\s*(\|(?:\{\{[^{}]*\}\}|[^{}])*)?\}\}\s*/ig, "");
			if (text !== textNoSd && confirm("এই পাতায় একটি দ্রুত অপসারণের টেমপ্লেট পাওয়া গিয়েছে, সরিয়ে ফেলা হবে?")) {
				text = textNoSd;
			}

			pageobj.setPageText((params.noinclude ? "<noinclude>{{" : "{{") + (params.number === '' ? "subst:afd|help=off" : ('subst:afdx|' +
				params.number + "|help=off")) + (params.noinclude ? "}}</noinclude>\n" : "}}\n") + text);
			pageobj.setEditSummary("Nominated for deletion; see [[" + params.discussionpage + "]]." + Twinkle.getPref('summaryAd'));
			switch (Twinkle.getPref('xfdWatchPage')) {
				case 'yes':
					pageobj.setWatchlist(true);
					break;
				case 'no':
					pageobj.setWatchlistFromPreferences(false);
					break;
				default:
					pageobj.setWatchlistFromPreferences(true);
					break;
			}
			pageobj.setCreateOption('nocreate');
			pageobj.save();
		},
		discussionPage: function(pageobj) {
			var text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();

			pageobj.setPageText("{{subst:afd2|text=" + params.reason + " ~~~~|pg=" + mw.config.get('wgPageName') + "|cat=" + params.xfdcat + "}}\n");
			pageobj.setEditSummary("Creating deletion discussion page for [[" + mw.config.get('wgPageName') + "]]." + Twinkle.getPref('summaryAd'));
			switch (Twinkle.getPref('xfdWatchDiscussion')) {
				case 'yes':
					pageobj.setWatchlist(true);
					break;
				case 'no':
					pageobj.setWatchlistFromPreferences(false);
					break;
				default:
					pageobj.setWatchlistFromPreferences(true);
					break;
			}
			pageobj.setCreateOption('createonly');
			pageobj.save(function() {
				Twinkle.xfd.currentRationale = null;  // any errors from now on do not need to print the rationale, as it is safely saved on-wiki
			});
		},
		todaysList: function(pageobj) {
			var old_text = pageobj.getPageText() + "\n";  // MW strips trailing blanks, but we like them, so we add a fake one
			var params = pageobj.getCallbackParameters();
			var statelem = pageobj.getStatusElement();

			var text = old_text.replace( /(<\!-- Add new entries to the TOP of the following list -->\n+)/, "$1{{subst:afd3|pg=" + mw.config.get('wgPageName') + params.numbering + "}}\n");
			if( text === old_text ) {
				statelem.error( 'failed to find target spot for the discussion' );
				return;
			}
			pageobj.setPageText(text);
			pageobj.setEditSummary("Adding [[" + params.discussionpage + "]]." + Twinkle.getPref('summaryAd'));
			switch (Twinkle.getPref('xfdWatchList')) {
				case 'yes':
					pageobj.setWatchlist(true);
					break;
				case 'no':
					pageobj.setWatchlistFromPreferences(false);
					break;
				default:
					pageobj.setWatchlistFromPreferences(true);
					break;
			}
			pageobj.setCreateOption('recreate');
			pageobj.save();
		},
		userNotification: function(pageobj) {
			var params = pageobj.getCallbackParameters();
			var initialContrib = pageobj.getCreator();
			var usertalkpage = new Morebits.wiki.page('User talk:' + initialContrib, "Notifying initial contributor (" + initialContrib + ")");
			var notifytext = "\n{{subst:AFDWarning|1=" + mw.config.get('wgPageName') + ( params.numbering !== '' ? '|order=&#32;' + params.numbering : '' ) + "}} ~~~~";
			usertalkpage.setAppendText(notifytext);
			usertalkpage.setEditSummary("Notification: listing at [[WP:AFD|articles for deletion]] of [[" + mw.config.get('wgPageName') + "]]." + Twinkle.getPref('summaryAd'));
			usertalkpage.setCreateOption('recreate');
			switch (Twinkle.getPref('xfdWatchUser')) {
				case 'yes':
					usertalkpage.setWatchlist(true);
					break;
				case 'no':
					usertalkpage.setWatchlistFromPreferences(false);
					break;
				default:
					usertalkpage.setWatchlistFromPreferences(true);
					break;
			}
			usertalkpage.setFollowRedirect(true);
			usertalkpage.append();
		}
	},


	tfd: {
		taggingTemplate: function(pageobj) {
			var text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();

			pageobj.setPageText((params.noinclude ? "<noinclude>" : "") + "{{subst:template for discussion|help=off|" +
				(params.tfdinline ? "type=inline|" : "") + mw.config.get('wgTitle') + (params.noinclude ? "}}</noinclude>" : "}}\n") + text);
			pageobj.setEditSummary("Nominated for deletion; see [[" + params.logpage + "#" + mw.config.get('wgPageName') + "]]." + Twinkle.getPref('summaryAd'));
			switch (Twinkle.getPref('xfdWatchPage')) {
				case 'yes':
					pageobj.setWatchlist(true);
					break;
				case 'no':
					pageobj.setWatchlistFromPreferences(false);
					break;
				default:
					pageobj.setWatchlistFromPreferences(true);
					break;
			}
			pageobj.setCreateOption('nocreate');
			pageobj.save();
		},
		todaysList: function(pageobj) {
			var old_text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();
			var statelem = pageobj.getStatusElement();

			var text = old_text.replace( '-->', "-->\n{{subst:tfd2|text=" + params.reason + " ~~~~|1=" + mw.config.get('wgTitle') + "}}");
			if( text === old_text ) {
				statelem.error( 'failed to find target spot for the discussion' );
				return;
			}
			pageobj.setPageText(text);
			pageobj.setEditSummary("Adding [[Template:" + mw.config.get('wgTitle') + "]]." + Twinkle.getPref('summaryAd'));
			switch (Twinkle.getPref('xfdWatchDiscussion')) {
				case 'yes':
					pageobj.setWatchlist(true);
					break;
				case 'no':
					pageobj.setWatchlistFromPreferences(false);
					break;
				default:
					pageobj.setWatchlistFromPreferences(true);
					break;
			}
			pageobj.setCreateOption('recreate');
			pageobj.save(function() {
				Twinkle.xfd.currentRationale = null;  // any errors from now on do not need to print the rationale, as it is safely saved on-wiki
			});
		},
		userNotification: function(pageobj) {
			var initialContrib = pageobj.getCreator();
			var usertalkpage = new Morebits.wiki.page('User talk:' + initialContrib, "Notifying initial contributor (" + initialContrib + ")");
			var notifytext = "\n{{subst:tfdnotice|1=" + mw.config.get('wgTitle') + "}} ~~~~";
			usertalkpage.setAppendText(notifytext);
			usertalkpage.setEditSummary("Notification: nomination at [[WP:TFD|templates for discussion]] of [[" + mw.config.get('wgPageName') + "]]." + Twinkle.getPref('summaryAd'));
			usertalkpage.setCreateOption('recreate');
			switch (Twinkle.getPref('xfdWatchUser')) {
				case 'yes':
					usertalkpage.setWatchlist(true);
					break;
				case 'no':
					usertalkpage.setWatchlistFromPreferences(false);
					break;
				default:
					usertalkpage.setWatchlistFromPreferences(true);
					break;
			}
			usertalkpage.setFollowRedirect(true);
			usertalkpage.append();
		}
	},


	mfd: {
		main: function(apiobj) {
			var xmlDoc = apiobj.responseXML;
			var titles = $(xmlDoc).find('allpages p');

			// There has been no earlier entries with this prefix, just go on.
			if( titles.length <= 0 ) {
				apiobj.params.numbering = apiobj.params.number = '';
				numbering = number = '';
			} else {
				var number = 0;
				for( var i = 0; i < titles.length; ++i ) {
					var title = titles[i].getAttribute('title');

					// First, simple test, is there an instance with this exact name?
					if( title === 'Wikipedia:Miscellany for deletion/' + mw.config.get('wgPageName') ) {
						number = Math.max( number, 1 );
						continue;
					}

					var order_re = new RegExp( '^' +
							RegExp.escape( 'Wikipedia:Miscellany for deletion/' + mw.config.get('wgPageName'), true ) +
							'\\s*\\(\\s*(\\d+)(?:(?:th|nd|rd|st) nom(?:ination)?)?\\s*\\)\\s*$' );
					var match = order_re.exec( title );

					// No match; A non-good value
					if( !match ) {
						continue;
					}

					// A match, set number to the max of current
					number = Math.max( number, Number(match[1]) );
				}
				apiobj.params.number = Twinkle.xfd.num2order( parseInt( number, 10 ) + 1);
				apiobj.params.numbering = number > 0 ? ' (' + apiobj.params.number + ' nomination)' : '';
			}
			apiobj.params.discussionpage = "Wikipedia:Miscellany for deletion/" + mw.config.get('wgPageName') + apiobj.params.numbering;

			apiobj.statelem.info( "next in order is [[" + apiobj.params.discussionpage + ']]');

			// Tagging page
			var wikipedia_page = new Morebits.wiki.page(mw.config.get('wgPageName'), "Tagging page with deletion tag");
			wikipedia_page.setFollowRedirect(true);  // should never be needed, but if the page is moved, we would want to follow the redirect
			wikipedia_page.setCallbackParameters(apiobj.params);
			wikipedia_page.load(Twinkle.xfd.callbacks.mfd.taggingPage);

			// Updating data for the action completed event
			Morebits.wiki.actionCompleted.redirect = apiobj.params.discussionpage;
			Morebits.wiki.actionCompleted.notice = "মনোনয়ন সম্মন্ন, now redirecting to the discussion page";

			// Discussion page
			wikipedia_page = new Morebits.wiki.page(apiobj.params.discussionpage, "Creating deletion discussion page");
			wikipedia_page.setCallbackParameters(apiobj.params);
			wikipedia_page.load(Twinkle.xfd.callbacks.mfd.discussionPage);

			// Today's list
			wikipedia_page = new Morebits.wiki.page("Wikipedia:Miscellany for deletion", "Adding discussion to today's list");
			//wikipedia_page.setPageSection(2);
				// pageSection has been disabled - the API seems to throw up with nonexistent edit conflicts
				// it can be turned on again once the problem is fixed, to save bandwidth
			//wikipedia_page.setFollowRedirect(true);
			wikipedia_page.setCallbackParameters(apiobj.params);
			wikipedia_page.load(Twinkle.xfd.callbacks.mfd.todaysList);

			// Notification to first contributor, and notification to owner of userspace (if applicable and required)
			if (apiobj.params.usertalk) {
				var thispage = new Morebits.wiki.page(mw.config.get('wgPageName'));
				thispage.setCallbackParameters(apiobj.params);
				thispage.lookupCreator(Twinkle.xfd.callbacks.mfd.userNotification);
			}
		},
		taggingPage: function(pageobj) {
			var text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();

			pageobj.setPageText((params.noinclude ? "<noinclude>" : "") + "{{" + ((params.number === '') ? "mfd}}\n" : ('mfdx|' + params.number + "}}\n")) +
				(params.noinclude ? "</noinclude>" : "") + text);
			pageobj.setEditSummary("Nominated for deletion; see [[" + params.discussionpage + "]]." + Twinkle.getPref('summaryAd'));
			switch (Twinkle.getPref('xfdWatchPage')) {
				case 'yes':
					pageobj.setWatchlist(true);
					break;
				case 'no':
					pageobj.setWatchlistFromPreferences(false);
					break;
				default:
					pageobj.setWatchlistFromPreferences(true);
					break;
			}
			pageobj.setCreateOption('nocreate');
			pageobj.save();
		},
		discussionPage: function(pageobj) {
			var text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();

			pageobj.setPageText("{{subst:mfd2|text=" + params.reason + " ~~~~|pg=" + mw.config.get('wgPageName') + "}}\n");
			pageobj.setEditSummary("[[" + mw.config.get('wgPageName') + "]] এর জন্য অপসারণ প্রস্তাবনা তৈরী করা হয়েছে। " + Twinkle.getPref('summaryAd'));
			switch (Twinkle.getPref('xfdWatchDiscussion')) {
				case 'yes':
					pageobj.setWatchlist(true);
					break;
				case 'no':
					pageobj.setWatchlistFromPreferences(false);
					break;
				default:
					pageobj.setWatchlistFromPreferences(true);
					break;
			}
			pageobj.setCreateOption('createonly');
			pageobj.save(function() {
				Twinkle.xfd.currentRationale = null;  // any errors from now on do not need to print the rationale, as it is safely saved on-wiki
			});
		},
		todaysList: function(pageobj) {
			var text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();
			var statelem = pageobj.getStatusElement();

			var date = new Date();
			var date_header = "===" + date.getUTCMonthName() + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear() + "===\n";
			var date_header_regex = new RegExp( "(===\\s*" + date.getUTCMonthName() + '\\s+' + date.getUTCDate() + ',\\s+' + date.getUTCFullYear() + "\\s*===)" );
			var new_data = "{{subst:mfd3|pg=" + mw.config.get('wgPageName') + params.numbering + "}}";

			if( date_header_regex.test( text ) ) { // we have a section already
				statelem.info( 'আজকের অনুচ্ছেদটি খুঁজে পাওয়া গিয়েছে, নতুন অনুচ্ছেদটি তৈরী করা হচ্ছে' );
				text = text.replace( date_header_regex, "$1\n" + new_data );
			} else { // we need to create a new section
				statelem.info( 'আজকের অনুচ্ছেদটি খুঁজে পাওয়া যাচ্ছে না, নতুন একটি অনুচ্ছেদ তৈরী করা হচ্ছে' );
				text = text.replace("===", date_header + new_data + "\n\n===");
			}

			pageobj.setPageText(text);
			pageobj.setEditSummary("[[" + params.discussionpage + "]] যুক্ত করা হচ্ছে।" + Twinkle.getPref('summaryAd'));
			switch (Twinkle.getPref('xfdWatchList')) {
				case 'yes':
					pageobj.setWatchlist(true);
					break;
				case 'no':
					pageobj.setWatchlistFromPreferences(false);
					break;
				default:
					pageobj.setWatchlistFromPreferences(true);
					break;
			}
			pageobj.setCreateOption('recreate');
			pageobj.save();
		},
		userNotification: function(pageobj) {
			var initialContrib = pageobj.getCreator();
			var params = pageobj.getCallbackParameters();

			// Really notify the creator
			Twinkle.xfd.callbacks.mfd.userNotificationMain(params, initialContrib, "প্রথম অবদানকারীকে জানানো হচ্ছে");

			// Also notify the user who owns the subpage if they are not the creator
			if (params.notifyuserspace) {
				var userspaceOwner = ((mw.config.get('wgTitle').indexOf('/') === -1) ? mw.config.get('wgTitle') : mw.config.get('wgTitle').substring(0, mw.config.get('wgTitle').indexOf('/')));
				if (userspaceOwner !== initialContrib) {
					Twinkle.xfd.callbacks.mfd.userNotificationMain(params, userspaceOwner, "Notifying owner of userspace");
				}
			}
		},
		userNotificationMain: function(params, initialContrib, actionName)
		{
			var usertalkpage = new Morebits.wiki.page('User talk:' + initialContrib, actionName + " (" + initialContrib + ")");
			var notifytext = "\n{{subst:MFDWarning|1=" + mw.config.get('wgPageName') + ( params.numbering !== '' ? '|order=&#32;' + params.numbering : '' ) + "}} ~~~~";
			usertalkpage.setAppendText(notifytext);
			usertalkpage.setEditSummary("Notification: listing at [[WP:MFD|miscellany for deletion]] of [[" + mw.config.get('wgPageName') + "]]." + Twinkle.getPref('summaryAd'));
			usertalkpage.setCreateOption('recreate');
			switch (Twinkle.getPref('xfdWatchUser')) {
				case 'yes':
					usertalkpage.setWatchlist(true);
					break;
				case 'no':
					usertalkpage.setWatchlistFromPreferences(false);
					break;
				default:
					usertalkpage.setWatchlistFromPreferences(true);
					break;
			}
			usertalkpage.setFollowRedirect(true);
			usertalkpage.append();
		}
	},


	ffd: {
		main: function(pageobj) {
			// this is coming in from lookupCreator...!
			var params = pageobj.getCallbackParameters();
			var initialContrib = pageobj.getCreator();
			params.uploader = initialContrib;

			// Adding discussion
			wikipedia_page = new Morebits.wiki.page(params.logpage, "আজকের তালিকায় প্রস্তাবনাটি যুক্ত করা হচ্ছে");
			wikipedia_page.setFollowRedirect(true);
			wikipedia_page.setCallbackParameters(params);
			wikipedia_page.load(Twinkle.xfd.callbacks.ffd.todaysList);

			// Notification to first contributor
			if(params.usertalk) {
				var usertalkpage = new Morebits.wiki.page('User talk:' + initialContrib, "প্রথম অবদানকারী (" + initialContrib + ") -কে জানানো হচ্ছে");
				var notifytext = "\n{{subst:idw|1=" + mw.config.get('wgTitle') + "}}";
				usertalkpage.setAppendText(notifytext);
				usertalkpage.setEditSummary("Notification: listing at [[WP:FFD|files for deletion]] of [[" + mw.config.get('wgPageName') + "]]." + Twinkle.getPref('summaryAd'));
				usertalkpage.setCreateOption('recreate');
				switch (Twinkle.getPref('xfdWatchUser')) {
					case 'yes':
						usertalkpage.setWatchlist(true);
						break;
					case 'no':
						usertalkpage.setWatchlistFromPreferences(false);
						break;
					default:
						usertalkpage.setWatchlistFromPreferences(true);
						break;
				}
				usertalkpage.setFollowRedirect(true);
				usertalkpage.append();
			}
		},
		taggingImage: function(pageobj) {
			var text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();

			text = text.replace(/\{\{(mtc|(copy |move )?to ?commons|move to wikimedia commons|copy to wikimedia commons)[^}]*\}\}/gi, "");

			pageobj.setPageText("{{ffd|log=" + params.date + "}}\n" + text);
			pageobj.setEditSummary("Nominated for deletion; see [[" + params.logpage + "#" + mw.config.get('wgPageName') + "]]." + Twinkle.getPref('summaryAd'));
			switch (Twinkle.getPref('xfdWatchPage')) {
				case 'yes':
					pageobj.setWatchlist(true);
					break;
				case 'no':
					pageobj.setWatchlistFromPreferences(false);
					break;
				default:
					pageobj.setWatchlistFromPreferences(true);
					break;
			}
			pageobj.setCreateOption('recreate');  // it might be possible for a file to exist without a description page
			pageobj.save();
		},
		todaysList: function(pageobj) {
			var text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();

			// add date header if the log is found to be empty (a bot should do this automatically, but it sometimes breaks down)
			if (!pageobj.exists()) {
				text = "{{subst:Ffd log}}";
			}

			pageobj.setPageText(text + "\n{{subst:ffd2|Reason=" + params.reason + "|Uploader=" + params.uploader + "|1=" + mw.config.get('wgTitle') + "}} ~~~~");
			pageobj.setEditSummary("Adding [[" + mw.config.get('wgPageName') + "]]." + Twinkle.getPref('summaryAd'));
			switch (Twinkle.getPref('xfdWatchDiscussion')) {
				case 'yes':
					pageobj.setWatchlist(true);
					break;
				case 'no':
					pageobj.setWatchlistFromPreferences(false);
					break;
				default:
					pageobj.setWatchlistFromPreferences(true);
					break;
			}
			pageobj.setCreateOption('recreate');
			pageobj.save(function() {
				Twinkle.xfd.currentRationale = null;  // any errors from now on do not need to print the rationale, as it is safely saved on-wiki
			});
		}
	},


	puf: {
		taggingImage: function(pageobj) {
			var text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();

			text = text.replace(/\{\{(mtc|(copy |move )?to ?commons|move to wikimedia commons|copy to wikimedia commons)[^}]*\}\}/gi, "");

			pageobj.setPageText("{{puf|help=off|log=" + params.date + "}}\n" + text);
			pageobj.setEditSummary("Listed at [[WP:PUF|possibly unfree files]]: [[" + params.logpage + "#" + mw.config.get('wgPageName') + "]]." + Twinkle.getPref('summaryAd'));
			switch (Twinkle.getPref('xfdWatchPage')) {
				case 'yes':
					pageobj.setWatchlist(true);
					break;
				case 'no':
					pageobj.setWatchlistFromPreferences(false);
					break;
				default:
					pageobj.setWatchlistFromPreferences(true);
					break;
			}
			pageobj.setCreateOption('recreate');  // it might be possible for a file to exist without a description page
			pageobj.save();
		},
		todaysList: function(pageobj) {
			var text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();

			pageobj.setPageText(text + "\n{{subst:puf2|reason=" + params.reason + "|image=" + mw.config.get('wgTitle') + "}} ~~~~");
			pageobj.setEditSummary("Adding [[" + mw.config.get('wgPageName') + "]]." + Twinkle.getPref('summaryAd'));
			switch (Twinkle.getPref('xfdWatchDiscussion')) {
				case 'yes':
					pageobj.setWatchlist(true);
					break;
				case 'no':
					pageobj.setWatchlistFromPreferences(false);
					break;
				default:
					pageobj.setWatchlistFromPreferences(true);
					break;
			}
			pageobj.setCreateOption('recreate');
			pageobj.save(function() {
				Twinkle.xfd.currentRationale = null;  // any errors from now on do not need to print the rationale, as it is safely saved on-wiki
			});
		},
		userNotification: function(pageobj) {
			var initialContrib = pageobj.getCreator();
			var usertalkpage = new Morebits.wiki.page('ব্যবহারকারী আলাপ:' + initialContrib, "প্রথম অবদানকারী (" + initialContrib + ")-কে জানানো হচ্ছে");
			var notifytext = "\n{{subst:idw-puf|1=" + mw.config.get('wgTitle') + "}} ~~~~";
			usertalkpage.setAppendText(notifytext);
			usertalkpage.setEditSummary("Notification: listing at [[WP:PUF|possibly unfree files]] of [[" + mw.config.get('wgPageName') + "]]." + Twinkle.getPref('summaryAd'));
			usertalkpage.setCreateOption('recreate');
			switch (Twinkle.getPref('xfdWatchUser')) {
				case 'yes':
					usertalkpage.setWatchlist(true);
					break;
				case 'no':
					usertalkpage.setWatchlistFromPreferences(false);
					break;
				default:
					usertalkpage.setWatchlistFromPreferences(true);
					break;
			}
			usertalkpage.setFollowRedirect(true);
			usertalkpage.append();
		}
	},


	cfd: {
		taggingCategory: function(pageobj) {
			var text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();

			var added_data = "";
			var editsummary = "";
			switch( params.xfdcat ) {
			case 'cfd':
				added_data = "{{subst:cfd}}";
				editsummary = "Category being considered for deletion; see [[" + params.logpage + "#" + mw.config.get('wgPageName') + "]].";
				break;
			case 'cfm':
				added_data = "{{subst:cfm|" + params.target + "}}";
				editsummary = "Category being considered for merging; see [[" + params.logpage + "#" + mw.config.get('wgPageName') + "]].";
				break;
			case 'cfr':
				added_data = "{{subst:cfr|" + params.target + "}}";
				editsummary = "Category being considered for renaming; see [[" + params.logpage + "#" + mw.config.get('wgPageName') + "]].";
				break;
			case 'cfs':
				added_data = "{{subst:cfs|" + params.target + "|" + params.target2 + "}}";
				editsummary = "Category being considered for splitting; see [[" + params.logpage + "#" + mw.config.get('wgPageName') + "]].";
				break;
			case 'cfc':
				added_data = "{{subst:cfc|" + params.target + "}}";
				editsummary = "Category being considered for conversion to an article; see [[" + params.logpage + "#" + mw.config.get('wgPageName') + "]].";
				break;
			default:
				alert("twinklexfd in taggingCategory(): unknown CFD action");
				break;
			}

			pageobj.setPageText(added_data + "\n" + text);
			pageobj.setEditSummary(editsummary + Twinkle.getPref('summaryAd'));
			switch (Twinkle.getPref('xfdWatchPage')) {
				case 'yes':
					pageobj.setWatchlist(true);
					break;
				case 'no':
					pageobj.setWatchlistFromPreferences(false);
					break;
				default:
					pageobj.setWatchlistFromPreferences(true);
					break;
			}
			pageobj.setCreateOption('recreate');  // since categories can be populated without an actual page at that title
			pageobj.save();
		},
		todaysList: function(pageobj) {
			var old_text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();
			var statelem = pageobj.getStatusElement();

			var added_data = "";
			var editsummary = "";
			switch( params.xfdcat ) {
			case 'cfd':
				added_data = "{{subst:cfd2|text=" + params.reason + " ~~~~|1=" + mw.config.get('wgTitle') + "}}";
				editsummary = "Added delete nomination of [[:" + mw.config.get('wgPageName') + "]].";
				break;
			case 'cfm':
				added_data = "{{subst:cfm2|text=" + params.reason + " ~~~~|1=" + mw.config.get('wgTitle') + "|2=" + params.target + "}}";
				editsummary = "Added merge nomination of [[:" + mw.config.get('wgPageName') + "]].";
				break;
			case 'cfr':
				added_data = "{{subst:cfr2|text=" + params.reason + " ~~~~|1=" + mw.config.get('wgTitle') + "|2=" + params.target + "}}";
				editsummary = "Added rename nomination of [[:" + mw.config.get('wgPageName') + "]].";
				break;
			case 'cfs':
				added_data = "{{subst:cfs2|text=" + params.reason + " ~~~~|1=" + mw.config.get('wgTitle') + "|2=" + params.target + "|3=" + params.target2 + "}}";
				editsummary = "Added split nomination of [[:" + mw.config.get('wgPageName') + "]].";
				break;
			case 'cfc':
				added_data = "{{subst:cfc2|text=" + params.reason + " ~~~~|1=" + mw.config.get('wgTitle') + "|2=" + params.target + "}}";
				editsummary = "Added convert nomination of [[:" + mw.config.get('wgPageName') + "]].";
				break;
			default:
				alert("twinklexfd in todaysList: unknown CFD action");
				break;
			}

			text = old_text.replace( 'below this line -->', "below this line -->\n" + added_data );
			if( text === old_text ) {
				statelem.error( 'failed to find target spot for the discussion' );
				return;
			}

			pageobj.setPageText(text);
			pageobj.setEditSummary(editsummary + Twinkle.getPref('summaryAd'));
			switch (Twinkle.getPref('xfdWatchDiscussion')) {
				case 'yes':
					pageobj.setWatchlist(true);
					break;
				case 'no':
					pageobj.setWatchlistFromPreferences(false);
					break;
				default:
					pageobj.setWatchlistFromPreferences(true);
					break;
			}
			pageobj.setCreateOption('recreate');
			pageobj.save(function() {
				Twinkle.xfd.currentRationale = null;  // any errors from now on do not need to print the rationale, as it is safely saved on-wiki
			});
		},
		userNotification: function(pageobj) {
			var initialContrib = pageobj.getCreator();
			var params = pageobj.getCallbackParameters();
			var usertalkpage = new Morebits.wiki.page('User talk:' + initialContrib, "Notifying initial contributor (" + initialContrib + ")");
			var notifytext = "\n{{subst:CFDNote|1=" + mw.config.get('wgPageName') + "}} ~~~~";
			usertalkpage.setAppendText(notifytext);
			usertalkpage.setEditSummary("Notification: listing at [[WP:CFD|categories for discussion]] of [[" + mw.config.get('wgPageName') + "]]." + Twinkle.getPref('summaryAd'));
			usertalkpage.setCreateOption('recreate');
			switch (Twinkle.getPref('xfdWatchUser')) {
				case 'yes':
					usertalkpage.setWatchlist(true);
					break;
				case 'no':
					usertalkpage.setWatchlistFromPreferences(false);
					break;
				default:
					usertalkpage.setWatchlistFromPreferences(true);
					break;
			}
			usertalkpage.setFollowRedirect(true);
			usertalkpage.append();
		}
	},


	cfds: {
		taggingCategory: function(pageobj) {
			var text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();

			pageobj.setPageText("{{subst:cfr-speedy|1=" + params.target + "}}\n" + text);
			pageobj.setEditSummary("Nominated for speedy renaming; see [[WP:CFDS|Categories for discussion/Speedy]]." + Twinkle.getPref('summaryAd'));
			switch (Twinkle.getPref('xfdWatchPage')) {
				case 'yes':
					pageobj.setWatchlist(true);
					break;
				case 'no':
					pageobj.setWatchlistFromPreferences(false);
					break;
				default:
					pageobj.setWatchlistFromPreferences(true);
					break;
			}
			pageobj.setCreateOption('recreate');  // since categories can be populated without an actual page at that title
			pageobj.save();
		},
		addToList: function(pageobj) {
			var old_text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();
			var statelem = pageobj.getStatusElement();

			var newcatname = (/^Category:/.test(params.target) ? params.target : ("Category:" + params.target));
			text = old_text.replace( 'BELOW THIS LINE -->', "BELOW THIS LINE -->\n* [[:" + mw.config.get('wgPageName') + "]] to [[:" +
				newcatname + "]]\u00A0\u2013 " + params.xfdcat + (params.reason ? (": " + params.reason) : ".") + " ~~~~" );
				// U+00A0 NO-BREAK SPACE; U+2013 EN RULE
			if( text === old_text ) {
				statelem.error( 'প্রস্তাবনাটি তালিকাভুক্ত করার জন্য নির্ধারিত পাতাটি খুঁজে পাওয়া যাচ্ছে না' );
				return;
			}

			pageobj.setPageText(text);
			pageobj.setEditSummary("[[" + mw.config.get('wgPageName') + "]] যুক্ত করা হচ্ছে।" + Twinkle.getPref('summaryAd'));
			switch (Twinkle.getPref('xfdWatchDiscussion')) {
				case 'yes':
					pageobj.setWatchlist(true);
					break;
				case 'no':
					pageobj.setWatchlistFromPreferences(false);
					break;
				default:
					pageobj.setWatchlistFromPreferences(true);
					break;
			}
			pageobj.setCreateOption('recreate');
			pageobj.save(function() {
				Twinkle.xfd.currentRationale = null;  // any errors from now on do not need to print the rationale, as it is safely saved on-wiki
			});
		}
	},


	rfd: {
		// This is a callback from an API request, which gets the target of the redirect
		findTargetCallback: function(apiobj) {
			var xmlDoc = apiobj.responseXML;
			var target = $(xmlDoc).find('redirects r').first().attr('to');
			if( !target ) {
				apiobj.statelem.error( "এটি পুনঃনির্দেশ পাতা নয়, বাতিল করা হচ্ছে" );
				return;
			}
			apiobj.params.target = target;
			Twinkle.xfd.callbacks.rfd.main(apiobj.params);
		},
		main: function(params) {
			var date = new Date();
			params.logpage = 'Wikipedia:Redirects for discussion/Log/' + date.getUTCFullYear() + ' ' + date.getUTCMonthName() + ' ' + date.getUTCDate();

			// Tagging redirect
			var wikipedia_page = new Morebits.wiki.page(mw.config.get('wgPageName'), "পুনঃনির্দেশ পাতায় অপসারণ ট্যাগ যুক্ত করা হচ্ছে");
			wikipedia_page.setFollowRedirect(false);
			wikipedia_page.setCallbackParameters(params);
			wikipedia_page.load(Twinkle.xfd.callbacks.rfd.taggingRedirect);

			// Updating data for the action completed event
			Morebits.wiki.actionCompleted.redirect = params.logpage;
			Morebits.wiki.actionCompleted.notice = "মনোনয়ন সম্মন্ন, now redirecting to today's log";

			// Adding discussion
			wikipedia_page = new Morebits.wiki.page(params.logpage, "আজকের তালিকায় প্রস্তাবনাটি যুক্ত করা হচ্ছে");
			wikipedia_page.setFollowRedirect(true);
			wikipedia_page.setCallbackParameters(params);
			wikipedia_page.load(Twinkle.xfd.callbacks.rfd.todaysList);

			// Notifying initial contributor
			if (params.usertalk) {
				var thispage = new Morebits.wiki.page(mw.config.get('wgPageName'));
				thispage.setCallbackParameters(params);
				thispage.lookupCreator(Twinkle.xfd.callbacks.rfd.userNotification);
			}
		},
		taggingRedirect: function(pageobj) {
			var text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();

			pageobj.setPageText("{{subst:rfd}}\n" + text);
			pageobj.setEditSummary("Listed for discussion at [[" + params.logpage + "#" + mw.config.get('wgPageName') + "]]." + Twinkle.getPref('summaryAd'));
			switch (Twinkle.getPref('xfdWatchPage')) {
				case 'yes':
					pageobj.setWatchlist(true);
					break;
				case 'no':
					pageobj.setWatchlistFromPreferences(false);
					break;
				default:
					pageobj.setWatchlistFromPreferences(true);
					break;
			}
			pageobj.setCreateOption('nocreate');
			pageobj.save();
		},
		todaysList: function(pageobj) {
			var old_text = pageobj.getPageText();
			var params = pageobj.getCallbackParameters();
			var statelem = pageobj.getStatusElement();

			var text = old_text.replace( /(<\!-- Add new entries directly below this line -->)/, "$1\n{{subst:rfd2|text=" + Morebits.string.toUpperCaseFirstChar(params.reason) + "|redirect="+ mw.config.get('wgPageName') + "|target=" +
				params.target + "}} ~~~~\n" );
			if( text === old_text ) {
				statelem.error( 'failed to find target spot for the discussion' );
				return;
			}

			pageobj.setPageText(text);
			pageobj.setEditSummary("Adding [[" + mw.config.get('wgPageName') + "]]." + Twinkle.getPref('summaryAd'));
			switch (Twinkle.getPref('xfdWatchDiscussion')) {
				case 'yes':
					pageobj.setWatchlist(true);
					break;
				case 'no':
					pageobj.setWatchlistFromPreferences(false);
					break;
				default:
					pageobj.setWatchlistFromPreferences(true);
					break;
			}
			pageobj.setCreateOption('recreate');
			pageobj.save(function() {
				Twinkle.xfd.currentRationale = null;  // any errors from now on do not need to print the rationale, as it is safely saved on-wiki
			});
		},
		userNotification: function(pageobj) {
			var initialContrib = pageobj.getCreator();
			var usertalkpage = new Morebits.wiki.page('ব্যবহারকারী আলাপ:' + initialContrib, "প্রনেতা (" + initialContrib + ")-কে জানানো হচ্ছে");
			var notifytext = "\n{{subst:RFDNote|1=" + mw.config.get('wgPageName') + "}} ~~~~";
			usertalkpage.setAppendText(notifytext);
			usertalkpage.setEditSummary("Notification: listing at [[WP:RFD|redirects for discussion]] of [[" + mw.config.get('wgPageName') + "]]." + Twinkle.getPref('summaryAd'));
			usertalkpage.setCreateOption('recreate');
			switch (Twinkle.getPref('xfdWatchUser')) {
				case 'yes':
					usertalkpage.setWatchlist(true);
					break;
				case 'no':
					usertalkpage.setWatchlistFromPreferences(false);
					break;
				default:
					usertalkpage.setWatchlistFromPreferences(true);
					break;
			}
			usertalkpage.setFollowRedirect(true);
			usertalkpage.append();
		}
	}
};



Twinkle.xfd.callback.evaluate = function(e) {
	mw.config.set('wgPageName', mw.config.get('wgPageName').replace(/_/g, ' '));  // for queen/king/whatever and country!

	var type =  e.target.category.value;
	var usertalk = e.target.notify.checked;
	var reason = e.target.xfdreason.value;
	var xfdcat, xfdtarget, xfdtarget2, puf, noinclude, tfdinline, notifyuserspace;
	if( type === "afd" || type === "cfd" || type === "cfds" ) {
		xfdcat = e.target.xfdcat.value;
	}
	if( type === "cfd" || type === "cfds" ) {
		xfdtarget = e.target.xfdtarget.value;
		if (e.target.xfdtarget2) {
			xfdtarget2 = e.target.xfdtarget2.value;
		}
	}
	if( type === 'ffd' ) {
		puf = e.target.puf.checked;
	}
	if( type === "afd" || type === "mfd" || type === "tfd" ) {
		noinclude = e.target.noinclude.checked;
	}
	if( type === 'tfd' ) {
		tfdinline = e.target.tfdinline.checked;
	}
	if( type === 'mfd' ) {
		notifyuserspace = e.target.notifyuserspace && e.target.notifyuserspace.checked;
	}

	Morebits.simpleWindow.setButtonsEnabled( false );
	Morebits.status.init( e.target );

	Twinkle.xfd.currentRationale = reason;
	Morebits.status.onError(Twinkle.xfd.printRationale);

	if( !type ) {
		Morebits.status.error( 'Error', 'no action given' );
		return;
	}

	var query, wikipedia_page, wikipedia_api, logpage, params;
	var date = new Date();
	switch( type ) {

	case 'afd': // AFD
		query = {
			'action': 'query',
			'list': 'allpages',
			'apprefix': 'Articles for deletion/' + mw.config.get('wgPageName'),
			'apnamespace': 4,
			'apfilterredir': 'nonredirects',
			'aplimit': Morebits.userIsInGroup( 'sysop' ) ? 5000 : 500
		};
		wikipedia_api = new Morebits.wiki.api( 'নিবন্ধে অপসারণ ট্যাগ যুক্ত করা হচ্ছে', query, Twinkle.xfd.callbacks.afd.main );
		wikipedia_api.params = { usertalk:usertalk, reason:reason, noinclude:noinclude, xfdcat:xfdcat };
		wikipedia_api.post();
		break;

	case 'tfd': // TFD
		Morebits.wiki.addCheckpoint();

		logpage = 'Wikipedia:Templates for discussion/Log/' + date.getUTCFullYear() + ' ' + date.getUTCMonthName() + ' ' + date.getUTCDate();

		// Tagging template
		wikipedia_page = new Morebits.wiki.page(mw.config.get('wgPageName'), "টেমপ্লেটে অপসারণ ট্যাগ যুক্ত করা হচ্ছে");
		wikipedia_page.setFollowRedirect(true);  // should never be needed, but if the page is moved, we would want to follow the redirect
		wikipedia_page.setCallbackParameters({ tfdinline: tfdinline, logpage: logpage, noinclude: noinclude });
		wikipedia_page.load(Twinkle.xfd.callbacks.tfd.taggingTemplate);

		// Updating data for the action completed event
		Morebits.wiki.actionCompleted.redirect = logpage;
		Morebits.wiki.actionCompleted.notice = "মনোনয়ন সম্মন্ন, now redirecting to today's log";

		// Adding discussion
		wikipedia_page = new Morebits.wiki.page(logpage, "আজকের তালিকায় প্রস্তাবনাটি যুক্ত করা হচ্ছে");
		wikipedia_page.setFollowRedirect(true);
		wikipedia_page.setCallbackParameters({ reason: reason });
		wikipedia_page.load(Twinkle.xfd.callbacks.tfd.todaysList);

		// Notification to first contributor
		if (usertalk) {
			var thispage = new Morebits.wiki.page(mw.config.get('wgPageName'));
			thispage.lookupCreator(Twinkle.xfd.callbacks.tfd.userNotification);
		}

		Morebits.wiki.removeCheckpoint();
		break;

	case 'mfd': // MFD
		query = {
			'action': 'query',
			'list': 'allpages',
			'apprefix': 'Miscellany for deletion/' + mw.config.get('wgPageName'),
			'apnamespace': 4,
			'apfilterredir': 'nonredirects',
			'aplimit': Morebits.userIsInGroup( 'sysop' ) ? 5000 : 500
		};
		wikipedia_api = new Morebits.wiki.api( "এই পাতার পূর্বের মনোনয়নগুলো খোঁজা হচ্ছে", query, Twinkle.xfd.callbacks.mfd.main );
		wikipedia_api.params = { usertalk: usertalk, notifyuserspace: notifyuserspace, reason: reason, noinclude: noinclude, xfdcat: xfdcat };
		wikipedia_api.post();
		break;

	case 'ffd': // FFD
		var dateString = date.getUTCFullYear() + ' ' + date.getUTCMonthName() + ' ' + date.getUTCDate();
		logpage = 'Wikipedia:Files for deletion/' + dateString;
		params = { usertalk: usertalk, reason: reason, date: dateString, logpage: logpage };

		Morebits.wiki.addCheckpoint();
		if( puf ) {
			params.logpage = logpage = 'Wikipedia:Possibly unfree files/' + dateString;

			// Updating data for the action completed event
			Morebits.wiki.actionCompleted.redirect = logpage;
			Morebits.wiki.actionCompleted.notice = "মনোনয়ন সম্মন্ন, আজকের তালিকায় ফিরিয়ে আনা হচ্ছে";

			// Tagging file
			wikipedia_page = new Morebits.wiki.page(mw.config.get('wgPageName'), "ছবিতে PUF ট্যাগ যোগ করা হচ্ছে");
			wikipedia_page.setFollowRedirect(true);
			wikipedia_page.setCallbackParameters(params);
			wikipedia_page.load(Twinkle.xfd.callbacks.puf.taggingImage);

			// Adding discussion
			wikipedia_page = new Morebits.wiki.page(params.logpage, "আজকের তালিকায় প্রস্তাবনাটি যুক্ত করা হচ্ছে");
			wikipedia_page.setFollowRedirect(true);
			wikipedia_page.setCallbackParameters(params);
			wikipedia_page.load(Twinkle.xfd.callbacks.puf.todaysList);

			// Notification to first contributor
			if (usertalk) {
				wikipedia_page = new Morebits.wiki.page(mw.config.get('wgPageName'));
				wikipedia_page.setCallbackParameters(params);
				wikipedia_page.lookupCreator(Twinkle.xfd.callbacks.puf.userNotification);
			}

			Morebits.wiki.removeCheckpoint();

		} else {
			// Updating data for the action completed event
			Morebits.wiki.actionCompleted.redirect = logpage;
			Morebits.wiki.actionCompleted.notice = "মনোনয়ন সম্মন্ন, আলাপ পাতায় ফিরিয়ে আনা হচ্ছে";

			// Tagging file
			wikipedia_page = new Morebits.wiki.page(mw.config.get('wgPageName'), "ফাইলে অপসারণ ট্যাগ যোগ করা হচ্ছে");
			wikipedia_page.setFollowRedirect(true);
			wikipedia_page.setCallbackParameters(params);
			wikipedia_page.load(Twinkle.xfd.callbacks.ffd.taggingImage);

			// Contributor specific edits
			wikipedia_page = new Morebits.wiki.page(mw.config.get('wgPageName'));
			wikipedia_page.setCallbackParameters(params);
			wikipedia_page.lookupCreator(Twinkle.xfd.callbacks.ffd.main);
		}
		Morebits.wiki.removeCheckpoint();
		break;

	case 'cfd':
		Morebits.wiki.addCheckpoint();

		if( xfdtarget ) {
			xfdtarget = xfdtarget.replace( /^\:?Category\:/i, '' );
		} else {
			xfdtarget = '';
		}

		if( xfdtarget2 ) {
			xfdtarget2 = xfdtarget2.replace( /^\:?Category\:/i, '' );
		}

		logpage = 'Wikipedia:Categories for discussion/Log/' + date.getUTCFullYear() + ' ' + date.getUTCMonthName() + ' ' + date.getUTCDate();

		params = { reason: reason, xfdcat: xfdcat, target: xfdtarget, target2: xfdtarget2, logpage: logpage };

		// Updating data for the action completed event
		Morebits.wiki.actionCompleted.redirect = logpage;
		Morebits.wiki.actionCompleted.notice = "মনোনয়ন সম্মন্ন, আজকের তালিকায় ফিরিয়ে আনা হচ্ছে";

		// Tagging category
		wikipedia_page = new Morebits.wiki.page(mw.config.get('wgPageName'), "বিষয়শ্রেণীতে অপসারণের ট্যাগ যুক্ত করা হচ্ছে");
		wikipedia_page.setCallbackParameters(params);
		wikipedia_page.load(Twinkle.xfd.callbacks.cfd.taggingCategory);

		// Adding discussion to list
		wikipedia_page = new Morebits.wiki.page(logpage, "আজকের তালিকায় প্রস্তাবনাটি যুক্ত করা হচ্ছে");
		//wikipedia_page.setPageSection(2);
			// pageSection has been disabled - the API seems to throw up with nonexistent edit conflicts
			// it can be turned on again once the problem is fixed, to save bandwidth
		//wikipedia_page.setFollowRedirect(true);
		wikipedia_page.setCallbackParameters(params);
		wikipedia_page.load(Twinkle.xfd.callbacks.cfd.todaysList);

		// Notification to first contributor
		if (usertalk) {
			wikipedia_page = new Morebits.wiki.page(mw.config.get('wgPageName'));
			wikipedia_page.setCallbackParameters(params);
			wikipedia_page.lookupCreator(Twinkle.xfd.callbacks.cfd.userNotification);
		}

		Morebits.wiki.removeCheckpoint();
		break;

	case 'cfds':
		xfdtarget = xfdtarget.replace( /^\:?Category\:/, '' );

		logpage = "Wikipedia:Categories for discussion/Speedy";
		params = { reason: reason, xfdcat: xfdcat, target: xfdtarget };

		// Updating data for the action completed event
		Morebits.wiki.actionCompleted.redirect = logpage;
		Morebits.wiki.actionCompleted.notice = "মনোনয়ন সম্মন্ন, আলাপ পাতায় ফিরিয়ে আনা হচ্ছে";

		// Tagging category
		wikipedia_page = new Morebits.wiki.page(mw.config.get('wgPageName'), "বিষয়শ্রেণীতে নাম পরিবর্তের ট্যাগ লাগানো হচ্ছে");
		wikipedia_page.setCallbackParameters(params);
		wikipedia_page.load(Twinkle.xfd.callbacks.cfds.taggingCategory);

		// Adding discussion to list
		wikipedia_page = new Morebits.wiki.page(logpage, "তালিকায় প্রস্তাবনাটি যুক্ত করা হচ্ছে");
		wikipedia_page.setCallbackParameters(params);
		wikipedia_page.load(Twinkle.xfd.callbacks.cfds.addToList);

		break;

	case 'rfd':
		params = { usertalk: usertalk, reason: reason };
		if (document.getElementById("softredirect")) {
			// For soft redirects, skip straight to the callback
			params.target = document.getElementById("softredirect").textContent.replace(/^\:+/, "");
			Twinkle.xfd.callbacks.rfd.main(params);
		} else {
			// Find current target of redirect
			query = {
				'action': 'query',
				'titles': mw.config.get('wgPageName'),
				'redirects': true
			};
			wikipedia_api = new Morebits.wiki.api( "পুনঃনির্দেশের পাতাটি খোঁজা হচ্ছে", query, Twinkle.xfd.callbacks.rfd.findTargetCallback );
			wikipedia_api.params = params;
			wikipedia_api.post();
		}
		break;
	default:
		alert("twinklexfd: unknown XFD discussion venue");
		break;
	}
};
