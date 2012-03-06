/*
 ****************************************
 *** friendlytalkback.js: Talkback module
 ****************************************
 * Mode of invocation:     Tab ("TB")
 * Active on:              Existing user talk pages
 * Config directives in:   FriendlyConfig
 */
 
Twinkle.talkback = function friendlytalkback() {
	if( mw.config.get('wgNamespaceNumber') === 3 ) {
		var username = mw.config.get('wgTitle').split( '/' )[0].replace( /\"/, "\\\""); // only first part before any slashes
		$(twAddPortletLink("#", "ফিরতি বার্তা", "friendly-talkback", "সহজ ফিরতি বার্তা", "")).click(function() { Twinkle.talkback.callback(username); });
	}
};
 
Twinkle.talkback.callback = function friendlytalkbackCallback( uid ) {
	if( uid === mw.config.get('wgUserName') ){
		alert( 'আপনি সত্যিই আপনাকে ফিরতি বার্তা প্রদান করতে চান?\এইটি খুবই আনন্দদায়ক!!' );
		return;
	}
 
	var Window = new SimpleWindow( 600, 350 );
	Window.setTitle( "ফিরতি বার্তা" );
	Window.setScriptName( "টুইংকল" );
	Window.addFooterLink( "{{ফিরতি বার্তা }} সম্পর্কে জানুন", "টেমপ্লেট:ফিরতি বার্তা" );
	Window.addFooterLink( "টুইংকল সাহায্য", "WP:TW/DOC#talkback" );
 
	var form = new QuickForm( Twinkle.talkback.callback.evaluate );
 
	form.append( { type: 'radio', name: 'tbtarget',
				list: [ {
						label: 'আমার আলাপ পাতা',
						value: 'mytalk',
						checked: 'true' },
					{
						label: 'অন্যের ব্যবহারকারি পাতা',
						value: 'usertalk' },
					{
						label: "প্রশাসকদের আলোচনা সভা",
						value: 'an' },
					{
						label: 'অন্য পাতা',
						value: 'other' } ],
				event: Twinkle.talkback.callback.change_target
			} );
 
	form.append( {
			type: 'field',
			label: 'Work area',
			name: 'work_area'
		} );
 
	form.append( { type:'submit' } );
 
	var result = form.render();
	Window.setContent( result );
	Window.display();
 
	// We must init the
	var evt = document.createEvent( "Event" );
	evt.initEvent( 'change', true, true );
	result.tbtarget[0].dispatchEvent( evt );
};
 
Twinkle.talkback.prev_page = '';
Twinkle.talkback.prev_section = '';
Twinkle.talkback.prev_message = '';
 
Twinkle.talkback.callback.change_target = function friendlytagCallbackChangeTarget(e) {
	var value = e.target.values;
	var root = e.target.form;
	var old_area;
 
	if(root.section) {
		Twinkle.talkback.prev_section = root.section.value;
	}
	if(root.message) {
		Twinkle.talkback.prev_message = root.message.value;
	}
	if(root.page) {
		Twinkle.talkback.prev_page = root.page.value;
	}
 
	for( var i = 0; i < root.childNodes.length; ++i ) {
		var node = root.childNodes[i];
		if (node instanceof Element && node.getAttribute( 'name' ) === 'work_area' ) {
			old_area = node;
			break;
		}
	}
	var work_area = new QuickForm.element( { 
			type: 'field',
			label: 'ফিরতি বার্তার তথ্য',
			name: 'work_area'
		} );
 
	switch( value ) {
		case 'mytalk':
			/* falls through */
		default:
			work_area.append( { 
					type:'input',
					name:'section',
					label:'অনুচ্ছেদের লিঙ্ক  (ঐচ্ছিক )',
					tooltip:'এখানে আপনি আপনার আলাপ পাতার  অনুচ্ছেদের লিঙ্ক  প্রদান করুন যেখানে বার্তা প্রদান করেছেন। আপনি এই ফিল্ড  এড়িয়ে যেতে পারেন',
					value: Twinkle.talkback.prev_section
				} );
			break;
		case 'usertalk':
			work_area.append( { 
					type:'input',
					name:'page',
					label:'ব্যবহারকারি',
					tooltip:'যে ব্যবহারকারির আলাপ পাতায়  বার্তা প্রদান করেছেন।',
					value: Twinkle.talkback.prev_page
				} );
 
			work_area.append( { 
					type:'input',
					name:'section',
					label:'অনুচ্ছেদের লিঙ্ক  (ঐচ্ছিক )',
					tooltip:'এখানে আপনি পাতার  অনুচ্ছেদের লিঙ্ক  প্রদান করুন যেখানে বার্তা প্রদান করেছেন। আপনি এই ফিল্ড  এড়িয়ে যেতে পারেন',
					value: Twinkle.talkback.prev_section
				} );
			break;
		case 'an':
			var noticeboard = work_area.append( {
					type: 'select',
					name: 'noticeboard',
					label: 'প্রশাসকদের আলোচনাসভা:'
				} );
			noticeboard.append( {
					type: 'option',
					label: "WP:AN (প্রশাসকদের আলোচনাসভা)",
					value: "উইকিপিডিয়া:প্রশাসকদের আলোচনাসভা"
				} );
			noticeboard.append( {
					type: 'option',
					label: 'উইকিপিডিয়া:প্রশাসকদের আলোচনাসভা',
					selected: true,
					value: "উইকিপিডিয়া:প্রশাসকদের আলোচনাসভা"
				} );
			work_area.append( {
					type:'input',
					name:'section',
					label:'আলোচনার লিঙ্ক',
					tooltip:'প্রশাসকদের আলোচনাসভার বিষয়/শিরোনাম',
					value: Twinkle.talkback.prev_section
				} );
			break;
		case 'other':
			work_area.append( { 
					type:'input',
					name:'page',
					label:'সম্পূর্ণ পাতার নাম',
					tooltip:'যে পাতায় আপনি বার্তা প্রদান করেছেন তার সম্পূর্ণ  নাম। উদাহরণ রুপে "উইকিপিডিয়া আলোচনা:টুইংকল  "',
					value: Twinkle.talkback.prev_page
				} );
 
			work_area.append( { 
					type:'input',
					name:'section',
					label:'অনুচ্ছেদের লিঙ্ক  (ঐচ্ছিক )',
					tooltip:'এখানে আপনি পাতার  অনুচ্ছেদের লিঙ্ক  প্রদান করুন যেখানে বার্তা প্রদান করেছেন। আপনি এই ফিল্ড  এড়িয়ে যেতে পারেন',
					value: Twinkle.talkback.prev_section
				} );
			break;
	}
 
	if (value !== "an") {
		work_area.append( { type:'textarea', label:'অতিরিক্ত বার্তা (ঐচ্ছিক ):', name:'message', tooltip:'ফিরতি বার্তা টেমপ্লেটের নিচে কোনো অতিরিক্ত বার্তা   প্রদান করতে চাইলে দয়া করে এখানে লিখুন। আপনার স্বাক্ষর ঐ বার্তার পর যোগ করা হবে।' } );
	}
 
	work_area = work_area.render();
	root.replaceChild( work_area, old_area );
	if (root.message) {
		root.message.value = Twinkle.talkback.prev_message;
	}
};
 
Twinkle.talkback.callback.evaluate = function friendlytalkbackCallbackEvaluate(e) {
	var tbtarget = e.target.getChecked( 'tbtarget' )[0];
	var page = null;
	var section = e.target.section.value;
	if( tbtarget === 'usertalk' || tbtarget === 'other' ) {
		page = e.target.page.value;
 
		if( tbtarget === 'usertalk' ) {
			if( !page ) {
				alert( 'আপনাকে অবশ্যই যে ব্যবহারকারির আলাপ পাতায় বার্তা দিচ্ছেন তার নাম প্রদান করতে হবে।' );
				return;
			}
		} else {
			if( !page ) {
				alert( 'আপনাকে অবশ্যই যে  পাতায় বার্তা দিচ্ছেন তার  সম্পূর্ণ নাম প্রদান করতে হবে।' );
				return;
			}
		}
	} else if (tbtarget === "an") {
		page = e.target.noticeboard.value;
	}
 
	var message;
	if (e.target.message) {
		message = e.target.message.value;
	}
 
	SimpleWindow.setButtonsEnabled( false );
	Status.init( e.target );
 
	Wikipedia.actionCompleted.redirect = mw.config.get('wgPageName');
	Wikipedia.actionCompleted.notice = "ফিরতি বার্তা প্রদান সম্পূর্ণ হয়েছে;কয়েক সেকেন্ডের মধ্যে আলাপ পাতা ফিরিয়ে আনা হচ্ছে।";
 
	var talkpage = new Wikipedia.page(mw.config.get('wgPageName'), "ফিরতি বার্তা যোগ");
	var tbPageName = (tbtarget === 'mytalk') ? mw.config.get('wgUserName') : page;
 
	var text;
	if ( tbtarget === "an" ) {
		text = "\n== " + Twinkle.getFriendlyPref('adminNoticeHeading') + " ==\n{{subst:ANI-notice|thread=";
		text += section + "|noticeboard=" + tbPageName + "}} ~~~~";
 
		talkpage.setEditSummary("প্রশাসকদের আলোচনাসভায় নোটিশ" + Twinkle.getPref('summaryAd'));
	} else {
		//clean talkback heading: strip section header markers, were erroneously suggested in the documentation
		text = '\n==' + Twinkle.getFriendlyPref('talkbackHeading').replace(/^\s*=+\s*(.*?)\s*=+$\s*/, "$1") + '==\n{{talkback|';
		text += tbPageName;
 
		if( section ) {
			text += '|' + section;
		}
 
		text += '|ts=~~~~~}}';
 
		if( message ) {
			text += '\n' + message + '  ~~~~';
		} else if( Twinkle.getFriendlyPref('insertTalkbackSignature') ) {
			text += '\n~~~~';
		}
 
		talkpage.setEditSummary("ফিরতি বার্তা ([[" + (tbtarget === 'other' ? '' : 'User talk:') + tbPageName +
			(section ? ('#' + section) : '') + "]])" + Twinkle.getPref('summaryAd'));
	}
 
	talkpage.setAppendText(text);
	talkpage.setCreateOption('recreate');
	talkpage.setMinorEdit(Twinkle.getFriendlyPref('markTalkbackAsMinor'));
	talkpage.setFollowRedirect(true);
	talkpage.append();
};