/*
 ****************************************
 *** twinklewarn.js: Warn module
 ****************************************
 * Mode of invocation:     Tab ("Warn")
 * Active on:              User talk pages
 * Config directives in:   TwinkleConfig
 */

Twinkle.warn = function twinklewarn() {
	if( mw.config.get('wgNamespaceNumber') === 3 ) {
			twAddPortletLink( Twinkle.warn.callback, "সতর্কীবার্তা", "tw-warn", "Warn/notify user" );
	}

	// modify URL of talk page on rollback success pages
	if( mw.config.get('wgAction') === 'rollback' ) {
		var $vandalTalkLink = $("#mw-rollback-success").find(".mw-usertoollinks a").first();
		$vandalTalkLink.css("font-weight", "bold");
		$vandalTalkLink.wrapInner($("<span/>").attr("title", "If appropriate, you can use Twinkle to warn the user about their edits to this page."));

		var extraParam = "vanarticle=" + mw.util.rawurlencode(mw.config.get("wgPageName").replace(/_/g, " "));
		var href = $vandalTalkLink.attr("href");
		if (href.indexOf("?") === -1) {
			$vandalTalkLink.attr("href", href + "?" + extraParam);
		} else {
			$vandalTalkLink.attr("href", href + "&" + extraParam);
		}
	}
};

Twinkle.warn.callback = function twinklewarnCallback() {
	if ( !twinkleUserAuthorized ) {
		alert("নবাগত, আপনার আপনার অ্যাকাউন্ট টুইংকল ব্যবহারের উপযোগী নয়।");
		return;
	}
	if( mw.config.get('wgTitle').split( '/' )[0] === mw.config.get('wgUserName') &&
			!confirm( 'নিজেকেই সতর্কবার্তা পাঠানো মানসিক অসুস্থ্যতার লক্ষন হিসাবে বিবেচনা করা হয়, আপনি কি সত্যই নিজেকে সর্তকীবার্তা পাঠাবেন?' ) ) {
		return;
	}
	
	var Window = new Morebits.simpleWindow( 600, 440 );
	Window.setTitle( "ব্যবহারকারিকে সতর্কীবার্তা/বিজ্ঞাপ্তি" );
	Window.setScriptName( "টুইংকল" );
	Window.addFooterLink( "সতর্কীকরণ স্তর পছন্দ করুন", "WP:UWUL#Levels" );
	Window.addFooterLink( "টুইংকল সাহায্য", "WP:TW/DOC#warn" );

	var form = new Morebits.quickForm( Twinkle.warn.callback.evaluate );
	var main_select = form.append( {
			type:'field',
			label:'দাখিল করার জন্য সতর্কীকরণ/বিজ্ঞাপ্তি প্রকার পছন্দ করুন',
			tooltip:'প্রথমে প্রধান সতর্কীকরণ বিভাগ পছন্দ করুন তারপর নির্দিষ্ট সতর্কবার্তা নির্ধারণ করুন।'
		} );

	var main_group = main_select.append( {
			type:'select',
			name:'main_group',
			event:Twinkle.warn.callback.change_category
		} );

	var defaultGroup = parseInt(Twinkle.getPref('defaultWarningGroup'), 10);
	main_group.append( { type:'option', label:'সাধারণ নোটিশ (1)', value:'level1', selected: ( defaultGroup === 1 || defaultGroup < 1 || ( Morebits.userIsInGroup( 'sysop' ) ? defaultGroup > 8 : defaultGroup > 7 ) ) } );
	main_group.append( { type:'option', label:'প্রাথমিক সতর্কীকরণ (2)', value:'level2', selected: ( defaultGroup === 2 ) } );
	main_group.append( { type:'option', label:'সতর্কীবার্তা (3)', value:'level3', selected: ( defaultGroup === 3 ) } );
	main_group.append( { type:'option', label:'সর্বশেষ সতর্কীবার্তা (4)', value:'level4', selected: ( defaultGroup === 4 ) } );
	main_group.append( { type:'option', label:'শুধুমাত্র সতর্কীবার্তা (4im)', value:'level4im', selected: ( defaultGroup === 5 ) } );
	main_group.append( { type:'option', label:'Single issue notices', value:'singlenotice', selected: ( defaultGroup === 6 ) } );
	main_group.append( { type:'option', label:'Single issue warnings', value:'singlewarn', selected: ( defaultGroup === 7 ) } );
	if( Morebits.userIsInGroup( 'sysop' ) ) {
		main_group.append( { type:'option', label:'বাধাদান', value:'block', selected: ( defaultGroup === 8 ) } );
	}

	main_select.append( { type:'select', name:'sub_group', event:Twinkle.warn.callback.change_subcategory } ); //Will be empty to begin with.

	form.append( {
			type:'input',
			name:'article',
			label:'Linked article',
			value:( Morebits.queryString.exists( 'vanarticle' ) ? Morebits.queryString.get( 'vanarticle' ) : '' ),
			tooltip:'An article can be linked within the notice, perhaps because it was a revert to said article that dispatched this notice. Leave empty for no article to be linked.'
		} );

	var more = form.append( { type: 'field', name: 'reasonGroup', label: 'সতর্কীকরণ তথ্য' } );
	more.append( { type:'textarea', label:'বার্তা:', name:'reason', tooltip:'Perhaps a reason, or that a more detailed notice must be appended' } );

	var previewlink = document.createElement( 'a' );
	$(previewlink).click(function(){
		Twinkle.warn.callbacks.preview(result);  // |result| is defined below
	});
	previewlink.style.cursor = "pointer";
	previewlink.textContent = 'প্রিভিউ';
	more.append( { type: 'div', id: 'warningpreview', label: [ previewlink ] } );
	more.append( { type: 'div', id: 'twinklewarn-previewbox', style: 'display: none' } );

	more.append( { type:'submit', label:'কার্যকর করুন' } );

	var result = form.render();
	Window.setContent( result );
	Window.display();
	result.main_group.root = result;
	result.previewer = new Morebits.wiki.preview($(result).find('div#twinklewarn-previewbox').last()[0]);

	// We must init the first choice (General Note);
	var evt = document.createEvent( "Event" );
	evt.initEvent( 'change', true, true );
	result.main_group.dispatchEvent( evt );
};

// This is all the messages that might be dispatched by the code
// Each of the individual templates require the following information:
//   label (required): A short description displayed in the dialog
//   summary (required): The edit summary used. If an article name is entered, the summary is postfixed with "on [[article]]", and it is always postfixed with ". $summaryAd"
//   suppressArticleInSummary (optional): Set to true to suppress showing the article name in the edit summary. Useful if the warning relates to attack pages, or some such.
Twinkle.warn.messages = {
	level1: {
		"uw-vandalism1": {
			label:"ধ্বংশপ্রবণতা",
			summary:"সাধারণ নোটিশ: অগঠনমূলক সম্পাদনা"
		},
		"uw-test1": {
			label:"পরীক্ষামূলক সম্পাদনা",
			summary:"সাধারণ নোটিশ: পরীক্ষামূলক সম্পাদনা"
		},
		"uw-delete1": {
			label:"তথ্য অপসারণ, পাতা খালি করা",
			summary:"সাধারণ নোটিশ: তথ্য অপসারণ, পাতা খালি করা"
		},
		"uw-redirect1": { 
			label:"ক্ষতিকর পুনঃনির্দেশ তৈরী", 
			summary:"সাধারণ নোটিশ: ক্ষতিকর পুনঃনির্দেশ তৈরী" 
		},
		"uw-tdel1": { 
			label:"রক্ষনাবেক্ষণ টেমপ্লেট অপসারণ", 
			summary:"সাধারণ নোটিশ: রক্ষনাবেক্ষণ টেমপ্লেট অপসারণ" 
		},
		"uw-joke1": { 
			label:"কৌতুকপূর্ণ অথবা ব্যাঙ্গাত্বক সম্পাদনা", 
			summary:"সাধারণ নোটিশ: কৌতুকপূর্ণ অথবা ব্যাঙ্গাত্বক সম্পাদনা" 
		},
		"uw-create1": { 
			label:"ভুল পাতা তৈরী", 
			summary:"সাধারণ নোটিশ: ভুল পাতা তৈরী" 
		},
		"uw-upload1": { 
			label:"অবিশ্বকোষীয় ছবি আপলোড", 
			summary:"সাধারণ নোটিশ: অবিশ্বকোষীয় ছবি আপলোড" 
		},
		"uw-image1": { 
			label:"ছবি সম্পর্কিত ধ্বংশপ্রবণতা", 
			summary:"সাধারণ নোটিশ: ছবি সম্পর্কিত ধ্বংশপ্রবণতা" 
		},
		"uw-ics1": { 
			label:"ত্রুটিপুর্ণ তথ্যসূত্রযুক্ত ফাইল আপলোড", 
			summary:"সাধারণ নোটিশ: ত্রুটিপুর্ণ তথ্যসূত্রযুক্ত ফাইল আপলোড" 
		},
		"uw-idt1": { 
			label:"ফাইল অপসারণ ট্যাগ মুছে ফেলা", 
			summary:"সাধারণ নোটিশ: ফাইল অপসারণ ট্যাগ মুছে ফেলা" 
		},
		"uw-spam1": { 
			label:"স্প্যাম লিংক সংযোজন", 
			summary:"সাধারণ নোটিশ: স্প্যাম লিংক সংযোজন" 
		},
		"uw-advert1": { 
			label:"বিজ্ঞাপনের কাজে উইকিপিডিয়া ব্যবহার", 
			summary:"সাধারণ নোটিশ: বিজ্ঞাপনের কাজে উইকিপিডিয়া ব্যবহার" 
		},
		"uw-npov1": { 
			label:"নিরপেক্ষ দৃষ্টিভঙ্গি অনুসরণ না করা", 
			summary:"সাধারণ নোটিশ: নিরপেক্ষ দৃষ্টিভঙ্গি অনুসরণ না করা" 
		},
		"uw-unsourced1": { 
			label:"ভুল অথবা তথ্যসূত্র ছাড়া বিষয়বস্তু সংযোজন", 
			summary:"সাধারণ নোটিশ: ভুল অথবা তথ্যসূত্র ছাড়া বিষয়বস্তু সংযোজন" 
		},
		"uw-error1": { 
			label:"Introducing deliberate factual errors", 
			summary:"সাধারণ নোটিশ: Introducing factual errors" 
		},
		"uw-nor1": { 
			label:"ব্যক্তিগত গবেষণা, কোথাও প্রকাশিত হয়নি এমন বিষয়বস্তু সূত্র হিসাবে সংযোজন করা", 
			summary:"সাধারণ নোটিশ: ব্যক্তিগত গবেষণা, কোথাও প্রকাশিত হয়নি এমন বিষয়বস্তু সূত্র হিসাবে সংযোজন করা" 
		},
		"uw-biog1": { 
			label:"তথ্যসূত্র ব্যতিত জীবিত ব্যক্তি সম্পর্কে বিতর্কিত তথ্য সংযোজন", 
			summary:"সাধারণ নোটিশ: তথ্যসূত্র ব্যতিত জীবিত ব্যক্তি সম্পর্কে বিতর্কিত তথ্য সংযোজন" 
		},
		"uw-defam1": { 
			label:"Addition of defamatory content", 
			summary:"সাধারণ নোটিশ: Addition of defamatory content" 
		},
		"uw-uncen1": { 
			label:"Censorship of material", 
			summary:"সাধারণ নোটিশ: Censorship of material" 
		},
		"uw-mos1": { 
			label:"Manual of style", 
			summary:"সাধারণ নোটিশ: Formatting, date, language, etc (Manual of style)" 
		},
		"uw-move1": { 
			label:"Page moves against naming conventions or consensus", 
			summary:"সাধারণ নোটিশ: Page moves against naming conventions or consensus" 
		},
		"uw-chat1": { 
			label:"আলাপ পাতা ফোরাম হিসাবে ব্যবহার", 
			summary:"সাধারণ নোটিশ: আলাপ পাতা ফোরাম হিসাবে ব্যবহার" 
		},
		"uw-tpv1": { 
			label:"অন্যের আলাপ পাতার তথ্য পরিবর্তন", 
			summary:"সাধারণ নোটিশ: অন্যের আলাপ পাতার তথ্য পরিবর্তন" 
		},
		"uw-afd1": { 
			label:"{{afd}} টেমপ্লেট অপসারণ",
			summary:"সাধারণ নোটিশ: {{afd}} টেমপ্লেট অপসারণ"
		},
		"uw-speedy1": { 
			label:"{{speedy deletion}} টেমপ্লেট অপসারণ",
			summary:"সাধারণ নোটিশ: {{speedy deletion}} টেমপ্লেট অপসারণ"
		},
		"uw-blpprod1": { 
			label:"{{blp prod}} টেমপ্লেট অপসারণ",
			summary:"সাধারণ নোটিশ: {{blp prod}} টেমপ্লেট অপসারণ"
		},
		"uw-npa1": { 
			label:"নির্দিষ্ট ব্যবহারকারীর প্রতি ব্যক্তিগত আক্রমন", 
			summary:"সাধারণ নোটিশ: নির্দিষ্ট ব্যবহারকারীর প্রতি ব্যক্তিগত আক্রমন" 
		},
		"uw-agf1": { 
			label:"Not assuming good faith", 
			summary:"সাধারণ নোটিশ: Not assuming good faith" 
		},
		"uw-own1": { 
			label:"নিবন্ধের মালিকানা", 
			summary:"সাধারণ নোটিশ: নিবন্ধের মালিকানা"
		},
		"uw-tempabuse1": { 
			label:"সতর্কীকরণ অথবা বাধা দেয়ার টেমপ্লেটের ভুল ব্যবহার", 
			summary:"সাধারণ নোটিশ: সতর্কীকরণ অথবা বাধা দেয়ার টেমপ্লেটের ভুল ব্যবহার"
		},
		"uw-genre1": { 
			label:"Frequent or mass changes to genres without consensus or references", 
			summary:"সাধারণ নোটিশ: Frequent or mass changes to genres without consensus or references"
		}
	},
	level2: {
		"uw-vandalism2": { 
			label:"ধ্বংশপ্রবণতা", 
			summary:"প্রাথমিক সতর্কীকরণ: ধ্বংশপ্রবণতা" 
		},
		"uw-test2": { 
			label:"পরীক্ষামূলক সম্পাদনা", 
			summary:"প্রাথমিক সতর্কীকরণ: পরীক্ষামূলক সম্পাদনা" 
		},
		"uw-delete2": { 
			label:"তথ্য অপসারণ, পাতা খালি করা",
			summary:"প্রাথমিক সতর্কীকরণ: তথ্য অপসারণ, পাতা খালি করা"
		},
		"uw-redirect2": { 
			label:"ক্ষতিকর পুনঃনির্দেশ তৈরী", 
			summary:"প্রাথমিক সতর্কীকরণ: ক্ষতিকর পুনঃনির্দেশ তৈরী" 
		},
		"uw-tdel2": { 
			label:"রক্ষনাবেক্ষণ টেমপ্লেট অপসারণ", 
			summary:"প্রাথমিক সতর্কীকরণ: রক্ষনাবেক্ষণ টেমপ্লেট অপসারণ" 
		},
		"uw-joke2": { 
			label:"কৌতুকপূর্ণ অথবা ব্যাঙ্গাত্বক সম্পাদনা", 
			summary:"প্রাথমিক সতর্কীকরণ: কৌতুকপূর্ণ অথবা ব্যাঙ্গাত্বক সম্পাদনা" 
		},
		"uw-create2": { 
			label:"ভুল পাতা তৈরী", 
			summary:"প্রাথমিক সতর্কীকরণ: ভুল পাতা তৈরী" 
		},
		"uw-upload2": { 
			label:"অবিশ্বকোষীয় ছবি আপলোড", 
			summary:"প্রাথমিক সতর্কীকরণ: অবিশ্বকোষীয় ছবি আপলোড" 
		},
		"uw-image2": { 
			label:"ছবি সম্পর্কিত ধ্বংশপ্রবণতা", 
			summary:"প্রাথমিক সতর্কীকরণ: ছবি সম্পর্কিত ধ্বংশপ্রবণতা" 
		},
		"uw-ics2": { 
			label:"ত্রুটিপুর্ণ তথ্যসূত্রযুক্ত ফাইল আপলোড", 
			summary:"প্রাথমিক সতর্কীকরণ: ত্রুটিপুর্ণ তথ্যসূত্রযুক্ত ফাইল আপলোড" 
		},
		"uw-idt2": { 
			label:"ফাইল অপসারণ ট্যাগ মুছে ফেলা", 
			summary:"প্রাথমিক সতর্কীকরণ: ফাইল অপসারণ ট্যাগ মুছে ফেলা" 
		},
		"uw-spam2": { 
			label:"স্প্যাম লিংক সংযোজন", 
			summary:"প্রাথমিক সতর্কীকরণ: স্প্যাম লিংক সংযোজন" 
		},
		"uw-advert2": { 
			label:"বিজ্ঞাপনের কাজে উইকিপিডিয়া ব্যবহার", 
			summary:"প্রাথমিক সতর্কীকরণ: বিজ্ঞাপনের কাজে উইকিপিডিয়া ব্যবহার" 
		},
		"uw-npov2": { 
			label:"নিরপেক্ষ দৃষ্টিভঙ্গি অনুসরণ না করা", 
			summary:"প্রাথমিক সতর্কীকরণ: নিরপেক্ষ দৃষ্টিভঙ্গি অনুসরণ না করা" 
		},
		"uw-unsourced2": { 
			label:"ভুল অথবা তথ্যসূত্র ছাড়া বিষয়বস্তু সংযোজন", 
			summary:"প্রাথমিক সতর্কীকরণ: ভুল অথবা তথ্যসূত্র ছাড়া বিষয়বস্তু সংযোজন" 
		},
		"uw-error2": { 
			label:"Introducing deliberate factual errors", 
			summary:"প্রাথমিক সতর্কীকরণ: Introducing factual errors" 
		},
		"uw-nor2": { 
			label:"Adding original research, including unpublished syntheses of sourced material", 
			summary:"প্রাথমিক সতর্কীকরণ: Adding original research, including unpublished syntheses of sourced material"
		},
		"uw-biog2": { 
			label:"তথ্যসূত্র ব্যতিত জীবিত ব্যক্তি সম্পর্কে বিতর্কিত তথ্য সংযোজন", 
			summary:"প্রাথমিক সতর্কীকরণ: তথ্যসূত্র ব্যতিত জীবিত ব্যক্তি সম্পর্কে বিতর্কিত তথ্য সংযোজন" 
		},
		"uw-defam2": { 
			label:"Addition of defamatory content", 
			summary:"প্রাথমিক সতর্কীকরণ: Addition of defamatory content" 
		},
		"uw-uncen2": { 
			label:"Censorship of material", 
			summary:"প্রাথমিক সতর্কীকরণ: Censorship of material" 
		},
		"uw-mos2": { 
			label:"Manual of style", 
			summary:"প্রাথমিক সতর্কীকরণ: Formatting, date, language, etc (Manual of style)" 
		},
		"uw-move2": { 
			label:"Page moves against naming conventions or consensus", 
			summary:"প্রাথমিক সতর্কীকরণ: Page moves against naming conventions or consensus" 
		},
		"uw-chat2": { 
			label:"আলাপ পাতা ফোরাম হিসাবে ব্যবহার", 
			summary:"প্রাথমিক সতর্কীকরণ: আলাপ পাতা ফোরাম হিসাবে ব্যবহার" 
		},
		"uw-tpv2": { 
			label:"অন্যের আলাপ পাতার তথ্য পরিবর্তন", 
			summary:"প্রাথমিক সতর্কীকরণ: অন্যের আলাপ পাতার তথ্য পরিবর্তন" 
		},
		"uw-afd2": { 
			label:"{{afd}} টেমপ্লেট অপসারণ",
			summary:"প্রাথমিক সতর্কীকরণ: {{afd}} টেমপ্লেট অপসারণ"
		},
		"uw-speedy2": { 
			label:"{{speedy deletion}} টেমপ্লেট অপসারণ",
			summary:"প্রাথমিক সতর্কীকরণ: {{speedy deletion}} টেমপ্লেট অপসারণ"
		},
		"uw-blpprod2": { 
			label:"{{blp prod}} টেমপ্লেট অপসারণ",
			summary:"প্রাথমিক সতর্কীকরণ: {{blp prod}} টেমপ্লেট অপসারণ"
		},
		"uw-npa2": { 
			label:"নির্দিষ্ট ব্যবহারকারীর প্রতি ব্যক্তিগত আক্রমন", 
			summary:"প্রাথমিক সতর্কীকরণ: নির্দিষ্ট ব্যবহারকারীর প্রতি ব্যক্তিগত আক্রমন" 
		},
		"uw-agf2": { 
			label:"Not assuming good faith", 
			summary:"প্রাথমিক সতর্কীকরণ: Not assuming good faith" 
		},
		"uw-own2": { 
			label:"নিবন্ধের মালিকানা", 
			summary:"প্রাথমিক সতর্কীকরণ: নিবন্ধের মালিকানা"
		},
		"uw-tempabuse2": { 
			label:"সতর্কীকরণ অথবা বাধা দেয়ার টেমপ্লেটের ভুল ব্যবহার", 
			summary:"প্রাথমিক সতর্কীকরণ: সতর্কীকরণ অথবা বাধা দেয়ার টেমপ্লেটের ভুল ব্যবহার"
		},
		"uw-genre2": { 
			label:"Frequent or mass changes to genres without consensus or references", 
			summary:"প্রাথমিক সতর্কীকরণ: Frequent or mass changes to genres without consensus or references"
		}
	},
	level3: {
		"uw-vandalism3": { 
			label:"ধ্বংশপ্রবণতা", 
			summary:"সতর্কীকরণ: ধ্বংশপ্রবণতা" 
		},
		"uw-test3": { 
			label:"পরীক্ষামূলক সম্পাদনা", 
			summary:"সতর্কীকরণ: পরীক্ষামূলক সম্পাদনা" 
		},
		"uw-delete3": { 
			label:"তথ্য অপসারণ, পাতা খালি করা", 
			summary:"সতর্কীকরণ: তথ্য অপসারণ, পাতা খালি করা"
		},
		"uw-redirect3": { 
			label:"ক্ষতিকর পুনঃনির্দেশ তৈরী", 
			summary:"সতর্কীকরণ: ক্ষতিকর পুনঃনির্দেশ তৈরী" 
		},
		"uw-tdel3": { 
			label:"রক্ষনাবেক্ষণ টেমপ্লেট অপসারণ", 
			summary:"সতর্কীকরণ: রক্ষনাবেক্ষণ টেমপ্লেট অপসারণ" 
		},
		"uw-joke3": { 
			label:"কৌতুকপূর্ণ অথবা ব্যাঙ্গাত্বক সম্পাদনা", 
			summary:"সতর্কীকরণ: কৌতুকপূর্ণ অথবা ব্যাঙ্গাত্বক সম্পাদনা" 
		},
		"uw-create3": { 
			label:"ভুল পাতা তৈরী", 
			summary:"সতর্কীকরণ: ভুল পাতা তৈরী" 
		},
		"uw-upload3": { 
			label:"অবিশ্বকোষীয় ছবি আপলোড", 
			summary:"সতর্কীকরণ: অবিশ্বকোষীয় ছবি আপলোড" 
		},
		"uw-image3": { 
			label:"ছবি সম্পর্কিত ধ্বংশপ্রবণতা", 
			summary:"সতর্কীকরণ: ছবি সম্পর্কিত ধ্বংশপ্রবণতা" 
		},
		"uw-ics3": { 
			label:"ত্রুটিপুর্ণ তথ্যসূত্রযুক্ত ফাইল আপলোড", 
			summary:"সতর্কীকরণ: ত্রুটিপুর্ণ তথ্যসূত্রযুক্ত ফাইল আপলোড" 
		},
		"uw-idt3": { 
			label:"ফাইল অপসারণ ট্যাগ মুছে ফেলা", 
			summary:"সতর্কীকরণ: ফাইল অপসারণ ট্যাগ মুছে ফেলা" 
		},
		"uw-spam3": { 
			label:"স্প্যাম লিংক সংযোজন", 
			summary:"সতর্কীকরণ: স্প্যাম লিংক সংযোজন" 
		},
		"uw-advert3": { 
			label:"বিজ্ঞাপনের কাজে উইকিপিডিয়া ব্যবহার", 
			summary:"সতর্কীকরণ: বিজ্ঞাপনের কাজে উইকিপিডিয়া ব্যবহার" 
		},
		"uw-npov3": { 
			label:"নিরপেক্ষ দৃষ্টিভঙ্গি অনুসরণ না করা", 
			summary:"সতর্কীকরণ: নিরপেক্ষ দৃষ্টিভঙ্গি অনুসরণ না করা" 
		},
		"uw-unsourced3": { 
			label:"ভুল অথবা তথ্যসূত্র ছাড়া বিষয়বস্তু সংযোজন", 
			summary:"সতর্কীকরণ: ভুল অথবা তথ্যসূত্র ছাড়া বিষয়বস্তু সংযোজন" 
		},
		"uw-error3": { 
			label:"Introducing deliberate factual errors", 
			summary:"সতর্কীকরণ: Introducing deliberate factual errors" 
		},
		"uw-nor3": { 
			label:"Adding original research, including unpublished syntheses of sourced material", 
			summary:"সতর্কীকরণ: Adding original research, including unpublished syntheses of sourced material"
		},
		"uw-biog3": { 
			label:"Adding unreferenced controversial or defamatory information about living persons", 
			summary:"সতর্কীকরণ: তথ্যসূত্র ব্যতিত জীবিত ব্যক্তি সম্পর্কে বিতর্কিত তথ্য সংযোজন" 
		},
		"uw-defam3": { 
			label:"Addition of defamatory content", 
			summary:"সতর্কীকরণ: Addition of defamatory content" 
		},
		"uw-uncen3": { 
			label:"Censorship of material", 
			summary:"সতর্কীকরণ: Censorship of material" 
		},
		"uw-mos3": { 
			label:"Manual of style", 
			summary:"সতর্কীকরণ: Formatting, date, language, etc (Manual of style)" 
		},
		"uw-move3": { 
			label:"Page moves against naming conventions or consensus", 
			summary:"সতর্কীকরণ: Page moves against naming conventions or consensus" 
		},
		"uw-chat3": { 
			label:"আলাপ পাতা ফোরাম হিসাবে ব্যবহার", 
			summary:"সতর্কীকরণ: আলাপ পাতা ফোরাম হিসাবে ব্যবহার" 
		},
		"uw-tpv3": { 
			label:"অন্যের আলাপ পাতার তথ্য পরিবর্তন", 
			summary:"সতর্কীকরণ: অন্যের আলাপ পাতার তথ্য পরিবর্তন" 
		},
		"uw-afd3": { 
			label:"{{afd}} টেমপ্লেট অপসারণ",
			summary:"সতর্কীকরণ: {{afd}} টেমপ্লেট অপসারণ"
		},
		"uw-speedy3": { 
			label:"{{speedy deletion}} টেমপ্লেট অপসারণ",
			summary:"সতর্কীকরণ: {{speedy deletion}} টেমপ্লেট অপসারণ"
		},
		"uw-blpprod3": { 
			label:"Removing {{blpprod}} templates",
			summary:"সতর্কীকরণ: Removing {{blpprod}} templates"
		},
		"uw-npa3": { 
			label:"নির্দিষ্ট ব্যবহারকারীর প্রতি ব্যক্তিগত আক্রমন", 
			summary:"সতর্কীকরণ: নির্দিষ্ট ব্যবহারকারীর প্রতি ব্যক্তিগত আক্রমন" 
		},
		"uw-agf3": { 
			label:"Not assuming good faith", 
			summary:"সতর্কীকরণ: Not assuming good faith" 
		},
		"uw-own3": { 
			label:"নিবন্ধের মালিকানা", 
			summary:"সতর্কীকরণ: নিবন্ধের মালিকানা"
		},
		"uw-genre3": { 
			label:"Frequent or mass changes to genres without consensus or reference", 
			summary:"সতর্কীকরণ: Frequent or mass changes to genres without consensus or reference"
		}

	},
	level4: {
		"uw-generic4": { 
			label:"Generic warning (for template series missing level 4)", 
			summary:"সর্বশেষ সতর্কীকরণ নোটিশ" 
		},
		"uw-vandalism4": { 
			label:"ধ্বংশপ্রবণতা", 
			summary:"সর্বশেষ সতর্কীকরণ: ধ্বংশপ্রবণতা" 
		},
		"uw-test4": { 
			label:"পরীক্ষামূলক সম্পাদনা", 
			summary:"সর্বশেষ সতর্কীকরণ: পরীক্ষামূলক সম্পাদনা" 
		},
		"uw-delete4": { 
			label:"তথ্য অপসারণ, পাতা খালি করা", 
			summary:"সর্বশেষ সতর্কীকরণ: তথ্য অপসারণ, পাতা খালি করা" 
		},
		"uw-redirect4": { 
			label:"ক্ষতিকর পুনঃনির্দেশ তৈরী", 
			summary:"সর্বশেষ সতর্কীকরণ: ক্ষতিকর পুনঃনির্দেশ তৈরী" 
		},
		"uw-tdel4": { 
			label:"রক্ষনাবেক্ষণ টেমপ্লেট অপসারণ", 
			summary:"সর্বশেষ সতর্কীকরণ: রক্ষনাবেক্ষণ টেমপ্লেট অপসারণ" 
		},
		"uw-joke4": { 
			label:"কৌতুকপূর্ণ অথবা ব্যাঙ্গাত্বক সম্পাদনা", 
			summary:"সর্বশেষ সতর্কীকরণ: কৌতুকপূর্ণ অথবা ব্যাঙ্গাত্বক সম্পাদনা" 
		},
		"uw-create4": { 
			label:"ভুল পাতা তৈরী", 
			summary:"সর্বশেষ সতর্কীকরণ: ভুল পাতা তৈরী" 
		},
		"uw-upload4": { 
			label:"অবিশ্বকোষীয় ছবি আপলোড", 
			summary:"সর্বশেষ সতর্কীকরণ: অবিশ্বকোষীয় ছবি আপলোড" 
		},
		"uw-image4": { 
			label:"ছবি সম্পর্কিত ধ্বংশপ্রবণতা", 
			summary:"সর্বশেষ সতর্কীকরণ: ছবি সম্পর্কিত ধ্বংশপ্রবণতা" 
		},
		"uw-ics4": { 
			label:"ত্রুটিপুর্ণ তথ্যসূত্রযুক্ত ফাইল আপলোড", 
			summary:"সর্বশেষ সতর্কীকরণ: ত্রুটিপুর্ণ তথ্যসূত্রযুক্ত ফাইল আপলোড" 
		},
		"uw-idt4": { 
			label:"ফাইল অপসারণ ট্যাগ মুছে ফেলা", 
			summary:"সর্বশেষ সতর্কীকরণ: ফাইল অপসারণ ট্যাগ মুছে ফেলা" 
		},
		"uw-spam4": { 
			label:"স্প্যাম লিংক সংযোজন", 
			summary:"সর্বশেষ সতর্কীকরণ: স্প্যাম লিংক সংযোজন" 
		},
		"uw-advert4": { 
			label:"বিজ্ঞাপনের কাজে উইকিপিডিয়া ব্যবহার", 
			summary:"সর্বশেষ সতর্কীকরণ: বিজ্ঞাপনের কাজে উইকিপিডিয়া ব্যবহার" 
		},
		"uw-npov4": { 
			label:"নিরপেক্ষ দৃষ্টিভঙ্গি অনুসরণ না করা", 
			summary:"সর্বশেষ সতর্কীকরণ: নিরপেক্ষ দৃষ্টিভঙ্গি অনুসরণ না করা" 
		},
		"uw-error4": { 
			label:"Introducing deliberate factual errors", 
			summary:"সর্বশেষ সতর্কীকরণ: Introducing deliberate factual errors"
		},
		"uw-nor4": { 
			label:"Adding original research, including unpublished syntheses of sourced material", 
			summary:"সর্বশেষ সতর্কীকরণ: Adding original research, including unpublished syntheses of sourced material"
		},
		"uw-biog4": { 
			label:"Adding unreferenced defamatory information about living persons", 
			summary:"সর্বশেষ সতর্কীকরণ: তথ্যসূত্র ব্যতিত জীবিত ব্যক্তি সম্পর্কে বিতর্কিত তথ্য সংযোজন" 
		},
		"uw-defam4": { 
			label:"Addition of defamatory content", 
			summary:"সর্বশেষ সতর্কীকরণ: Addition of defamatory content" 
		},
		"uw-uncen4": { 
			label:"Censorship of material", 
			summary:"সর্বশেষ সতর্কীকরণ: Censorship of material" 
		},
		"uw-mos4": { 
			label:"Manual of style", 
			summary:"সর্বশেষ সতর্কীকরণ: Formatting, date, language, etc (Manual of style)" 
		},
		"uw-move4": { 
			label:"Page moves against naming conventions or consensus", 
			summary:"সর্বশেষ সতর্কীকরণ: Page moves against naming conventions or consensus" 
		},
		"uw-chat4": { 
			label:"আলাপ পাতা ফোরাম হিসাবে ব্যবহার", 
			summary:"সর্বশেষ সতর্কীকরণ: আলাপ পাতা ফোরাম হিসাবে ব্যবহার" 
		},
		"uw-tpv4": { 
			label:"অন্যের আলাপ পাতার তথ্য পরিবর্তন", 
			summary:"সর্বশেষ সতর্কীকরণ: অন্যের আলাপ পাতার তথ্য পরিবর্তন" 
		},
		"uw-afd4": { 
			label:"{{afd}} টেমপ্লেট অপসারণ",
			summary:"সর্বশেষ সতর্কীকরণ: {{afd}} টেমপ্লেট অপসারণ"
		},
		"uw-speedy4": { 
			label:"{{speedy deletion}} টেমপ্লেট অপসারণ",
			summary:"সর্বশেষ সতর্কীকরণ: {{speedy deletion}} টেমপ্লেট অপসারণ"
		},
		"uw-blpprod4": { 
			label:"Removing {{blpprod}} templates",
			summary:"সর্বশেষ সতর্কীকরণ: Removing {{blpprod}} templates"
		},
		"uw-npa4": { 
			label:"নির্দিষ্ট ব্যবহারকারীর প্রতি ব্যক্তিগত আক্রমন", 
			summary:"সর্বশেষ সতর্কীকরণ: নির্দিষ্ট ব্যবহারকারীর প্রতি ব্যক্তিগত আক্রমন"
		}

	},
	level4im: {
		"uw-vandalism4im": { 
			label:"ধ্বংশপ্রবণতা", 
			summary:"Only warning: ধ্বংশপ্রবণতা" 
		},
		"uw-delete4im": { 
			label:"তথ্য অপসারণ, পাতা খালি করা", 
			summary:"Only warning: তথ্য অপসারণ, পাতা খালি করা" 
		},
		"uw-redirect4im": { 
			label:"ক্ষতিকর পুনঃনির্দেশ তৈরী", 
			summary:"Only warning: ক্ষতিকর পুনঃনির্দেশ তৈরী" 
		},
		"uw-joke4im": { 
			label:"কৌতুকপূর্ণ অথবা ব্যাঙ্গাত্বক সম্পাদনা", 
			summary:"Only warning: কৌতুকপূর্ণ অথবা ব্যাঙ্গাত্বক সম্পাদনা" 
		},
		"uw-create4im": { 
			label:"ভুল পাতা তৈরী", 
			summary:"Only warning: ভুল পাতা তৈরী" 
		},
		"uw-upload4im": { 
			label:"অবিশ্বকোষীয় ছবি আপলোড", 
			summary:"Only warning: অবিশ্বকোষীয় ছবি আপলোড" 
		},
		"uw-image4im": { 
			label:"ছবি সম্পর্কিত ধ্বংশপ্রবণতা", 
			summary:"Only warning: ছবি সম্পর্কিত ধ্বংশপ্রবণতা" 
		},
		"uw-spam4im": { 
			label:"স্প্যাম লিংক সংযোজন", 
			summary:"Only warning: স্প্যাম লিংক সংযোজন" 
		},
		"uw-advert4im": { 
			label:"বিজ্ঞাপনের কাজে উইকিপিডিয়া ব্যবহার", 
			summary:"Only warning: বিজ্ঞাপনের কাজে উইকিপিডিয়া ব্যবহার" 
		},
		"uw-biog4im": { 
			label:"Adding unreferenced defamatory information about living persons", 
			summary:"Only warning: তথ্যসূত্র ব্যতিত জীবিত ব্যক্তি সম্পর্কে বিতর্কিত তথ্য সংযোজন" 
		},
		"uw-defam4im": { 
			label:"Addition of defamatory content", 
			summary:"Only warning: Addition of defamatory content" 
		},
		"uw-move4im": { 
			label:"Page moves against naming conventions or consensus", 
			summary:"Only warning: Page moves against naming conventions or consensus" 
		},
		"uw-npa4im": { 
			label:"নির্দিষ্ট ব্যবহারকারীর প্রতি ব্যক্তিগত আক্রমন", 
			summary:"Only warning: নির্দিষ্ট ব্যবহারকারীর প্রতি ব্যক্তিগত আক্রমন"
		}
	},
	singlenotice: {
		"uw-2redirect": { 
			label:"Creating double redirects through bad page moves", 
			summary:"Notice: Creating double redirects through bad page moves" 
		},
		"uw-aiv": { 
			label:"Bad AIV report", 
			summary:"Notice: Bad AIV report" 
		},
		"uw-articlesig": { 
			label:"Adding signatures to article space", 
			summary:"Notice: Adding signatures to article space" 
		},
		"uw-autobiography": { 
			label:"Creating autobiographies", 
			summary:"Notice: Creating autobiographies" 
		},
		"uw-badcat": { 
			label:"Adding incorrect categories", 
			summary:"Notice: Adding incorrect categories" 
		},
		"uw-badlistentry": {
			label:"Adding inappropriate entries to lists",
			summary:"Notice: Adding inappropriate entries to lists"
		},
		"uw-bite": { 
			label:"\"Biting\" newcomers", 
			summary:"Notice: \"Biting\" newcomers" 
		},
		"uw-coi": { 
			label:"Conflict of Interest", 
			summary:"Notice: Conflict of Interest" 
		},
		"uw-controversial": { 
			label:"Introducing controversial material", 
			summary:"Notice: Introducing controversial material" 
		},
		"uw-copying": {
			label:"Copying text to another page",
			summary:"Notice: Copying text to another page"
		},
		"uw-crystal": {
			label:"Adding speculative or unconfirmed information",
			summary:"Notice: Adding speculative or unconfirmed information"
		},
		"uw-csd": {
			label:"Speedy deletion declined",
			summary:"Notice: Speedy deletion declined"
		},
		"uw-c&pmove": { 
			label:"Cut and paste moves", 
			summary:"Notice: Cut and paste moves" 
		},
		"uw-dab": {
			label:"Incorrect edit to a disambiguation page",
			summary:"Notice: Incorrect edit to a disambiguation page"
		},
		"uw-date": { 
			label:"Unnecessarily changing date formats", 
			summary:"Notice: Unnecessarily changing date formats" 
		},
		"uw-deadlink": { 
			label:"Removing proper sources containing dead links", 
			summary:"Notice: Removing proper sources containing dead links" 
		},
		"uw-directcat": { 
			label:"Applying stub categories manually", 
			summary:"Notice: Applying stub categories manually" 
		},
		"uw-draftfirst": { 
			label:"User should draft in userspace without the risk of speedy deletion", 
			summary:"Notice: Consider drafting your article in [[Help:Userspace draft|userspace]]"
		},
		"uw-editsummary": { 
			label:"Not using edit summary", 
			summary:"Notice: Not using edit summary" 
		},
		"uw-english": { 
			label:"Not communicating in English", 
			summary:"Notice: Not communicating in English" 
		},
		"uw-fuir": { 
			label:"Fair use image has been removed from your userpage", 
			summary:"Notice: A fair use image has been removed from your userpage" 
		},
		"uw-hasty": { 
			label:"Hasty addition of speedy deletion tags", 
			summary:"Notice: Allow creators time to improve their articles before tagging them for deletion"
		},
		"uw-imageuse": {
			label:"Incorrect image linking",
			summary:"Notice: Incorrect image linking"
		},
		"uw-incompleteAFD": {
			label:"Incomplete AFD",
			summary:"Notice: Incomplete AFD"
		},
		"uw-italicize": { 
			label:"Italicize books, films, albums, magazines, TV series, etc within articles", 
			summary:"Notice: Italicize books, films, albums, magazines, TV series, etc within articles" 
		},
		"uw-lang": { 
			label:"Unnecessarily changing between British and American English", 
			summary:"Notice: Unnecessarily changing between British and American English" 
		},
		"uw-linking": { 
			label:"Excessive addition of redlinks or repeated blue links", 
			summary:"Notice: Excessive addition of redlinks or repeated blue links" 
		},
		"uw-minor": { 
			label:"Incorrect use of minor edits check box", 
			summary:"Notice: Incorrect use of minor edits check box" 
		},
		"uw-nonfree": { 
			label:"Uploading replaceable non-free images", 
			summary:"Notice: Uploading replaceable non-free images" 
		},
		"uw-notaiv": { 
			label:"Do not report complex abuse to AIV", 
			summary:"Notice: Do not report complex abuse to AIV" 
		},
		"uw-notenglish": {
			label:"Creating non-English articles",
			summary:"Notice: Creating non-English articles"
		},
		"uw-notifysd": { 
			label:"Notify authors of speedy deletion tagged articles", 
			summary:"Notice: Please notify authors of articles tagged for speedy deletion"
		},
		"uw-notvand": {
			label:"Mislabelling edits as vandalism",
			summary:"Notice: Misidentifying edits as vandalism"
		},
		"uw-notvote": {
			label:"We use consensus, not voting", 
			summary:"Notice: We use consensus, not voting" 
		},
		"uw-patrolled": { 
			label:"Mark newpages as patrolled when patrolling", 
			summary:"Notice: Mark newpages as patrolled when patrolling" 
		},
		"uw-plagiarism": { 
			label:"Copying from public domain sources without attribution", 
			summary:"Notice: Copying from public domain sources without attribution" 
		},
		"uw-preview": { 
			label:"Use preview button to avoid mistakes", 
			summary:"Notice: Use preview button to avoid mistakes" 
		},
		"uw-probation": { 
			label:"Article is on probation", 
			summary:"Notice: Article is on probation" 
		},
		"uw-refimprove": {
			label:"Creating unverifiable articles",
			summary:"Notice: Creating unverifiable articles"
		},
		"uw-removevandalism": {
			label:"Incorrect vandalism removal",
			summary:"Notice: Incorrect vandalism removal"
		},
		"uw-repost": { 
			label:"Recreating material previously deleted via XfD process", 
			summary:"Notice: Recreating previously deleted material" 
		},
		"uw-salt": { 
			label:"Recreating salted articles under a different title", 
			summary:"Notice: Recreating salted articles under a different title" 
		},
		"uw-samename": { 
			label:"Rename request impossible", 
			summary:"Notice: Rename request impossible"
		},
		"uw-selfrevert": { 
			label:"Reverting self tests", 
			summary:"Notice: Reverting self tests" 
		},
		"uw-skype": {
			label:"Skype interfering with editing",
			summary:"Notice: Skype interfering with editing"
		},
		"uw-socialnetwork": { 
			label:"Wikipedia is not a social network", 
			summary:"Notice: Wikipedia is not a social network" 
		},
		"uw-sofixit": { 
			label:"Be bold and fix things yourself",
			summary:"Notice: You can be bold and fix things yourself" 
		},
		"uw-spoiler": {
			label:"Adding spoiler alerts or removing spoilers from appropriate sections",
			summary:"Notice: Don't delete or flag potential 'spoilers' in Wikipedia articles"
		},
		"uw-subst": { 
			label:"Remember to subst: templates", 
			summary:"Notice: Remember to subst: templates" 
		},
		"uw-talkinarticle": { 
			label:"Talk in article", 
			summary:"Notice: Talk in article" 
		},
		"uw-tilde": { 
			label:"Not signing posts", 
			summary:"Notice: Not signing posts" 
		},
		"uw-toppost": { 
			label:"Posting at the top of talk pages", 
			summary:"Notice: Posting at the top of talk pages" 
		},
		"uw-uaa": { 
			label:"Reporting of username to WP:UAA not accepted", 
			summary:"Notice: Reporting of username to WP:UAA not accepted" 
		},
		"uw-upincat": { 
			label:"Accidentally including user page/subpage in a content category",
			summary:"Notice: Informing user that one of his/her pages had accidentally been included in a content category" 
		},
		"uw-uploadfirst": { 
			label:"Attempting to display an external image on a page", 
			summary:"Notice: Attempting to display an external image on a page" 
		},
		"uw-userspace draft finish": { 
			label:"Stale userspace draft", 
			summary:"Notice: Stale userspace draft" 
		},
		"uw-userspacenoindex": { 
			label:"User page/subpage isn't appropriate for search engine indexing", 
			summary:"Notice: User (sub)page isn't appropriate for search engine indexing" 
		},
		"uw-vgscope": {
			label:"Adding video game walkthroughs, cheats or instructions",
			summary:"Notice: Adding video game walkthroughs, cheats or instructions"
		},
		"uw-warn": { 
			label:"Place user warning templates when reverting vandalism", 
			summary:"Notice: You can use user warning templates when reverting vandalism"
		}
	},
	singlewarn: {
		"uw-3rr": {
			label:"Violating the three-revert rule; see also uw-ew",
			summary:"Warning: Violating the three-revert rule"
		},
		"uw-affiliate": { 
			label:"Affiliate marketing", 
			summary:"Warning: Affiliate marketing"
		},
		"uw-agf-sock": { 
			label:"Use of multiple accounts (assuming good faith)", 
			summary:"Warning: Using multiple accounts"
		},
		"uw-attack": {
			label:"Creating attack pages",
			summary:"Warning: Creating attack pages",
			suppressArticleInSummary: true
		},
		"uw-attempt": {
			label:"Triggering the edit filter",
			summary:"Warning: Triggering the edit filter"
		},
		"uw-bizlist": {
			label:"Business promotion",
			summary:"Warning: Promoting a business"
		},
		"uw-botun": {
			label:"Bot username",
			summary:"Warning: Bot username"
		},
		"uw-canvass": {
			label:"Canvassing",
			summary:"Warning: Canvassing"
		},
		"uw-copyright": {
			label:"Copyright violation",
			summary:"Warning: Copyright violation"
		},
		"uw-copyright-link": { 
			label:"Linking to copyrighted works violation",
			summary:"Warning: Linking to copyrighted works violation" 
		},
		"uw-copyright-new": { 
			label:"Copyright violation (with explanation for new users)",
			summary:"Notice: Avoiding copyright problems"
		},
		"uw-copyright-remove": {
			label:"Removing {{copyvio}} template from articles",
			summary:"Warning: Removing {{copyvio}} templates"
		},
		"uw-efsummary": {
			label:"Edit summary triggering the edit filter",
			summary:"Warning: Edit summary triggering the edit filter"
		},
		"uw-ew": {
			label:"Edit warring (stronger wording)",
			summary:"Warning: Edit warring"
		},
		"uw-ewsoft": {
			label:"Edit warring (softer wording for newcomers)",
			summary:"Warning: Edit warring"
		},
		"uw-hoax": { 
			label:"Creating hoaxes", 
			summary:"Warning: Creating hoaxes" 
		},
		"uw-legal": { 
			label:"Making legal threats", 
			summary:"Warning: Making legal threats" 
		},
		"uw-longterm": { 
			label:"Long term pattern of vandalism", 
			summary:"Warning: Long term pattern of vandalism" 
		},
		"uw-multipleIPs": { 
			label:"Usage of multiple IPs", 
			summary:"Warning: Usage of multiple IPs" 
		},
		"uw-pinfo": { 
			label:"Personal info", 
			summary:"Warning: Personal info" 
		},
		"uw-socksuspect": {
			label:"Sockpuppetry",
			summary:"Warning: You are a suspected [[WP:SOCK|sockpuppet]]"  // of User:...
		},
		"uw-upv": { 
			label:"Userpage vandalism", 
			summary:"Warning: Userpage vandalism"
		},
		"uw-username": { 
			label:"Username is against policy", 
			summary:"Warning: Your username might be against policy",
			suppressArticleInSummary: true  // not relevant for this template
		},
		"uw-coi-username": { 
			label:"Username is against policy, and conflict of interest", 
			summary:"Warning: Username and conflict of interest policy"
		},
		"uw-userpage": { 
			label:"Userpage or subpage is against policy", 
			summary:"Warning: Userpage or subpage is against policy"
		},
		"uw-wrongsummary": { 
			label:"Using inaccurate or inappropriate edit summaries", 
			summary:"Warning: Using inaccurate or inappropriate edit summaries"
		}
	},
	block: {
		"uw-block": {
			label: "Block",
			summary: "You have been blocked from editing",
			pageParam: true,
			reasonParam: true  // allows editing of reason for generic templates
		},
		"uw-blocknotalk": {
			label: "Block - talk page disabled",
			summary: "You have been blocked from editing and your user talk page has been disabled",
			pageParam: true,
			reasonParam: true
		},
		"uw-blockindef": {
			label: "Block - indefinite",
			summary: "You have been indefinitely blocked from editing",
			indefinite: true,
			pageParam: true,
			reasonParam: true
		},
		"uw-ablock": {
			label: "Block - IP address",
			summary: "Your IP address has been blocked from editing",
			pageParam: true
		},
		"uw-vblock": {
			label: "Vandalism block",
			summary: "You have been blocked from editing for persistent [[WP:VAND|vandalism]]",
			pageParam: true
		},
		"uw-voablock": {
			label: "Vandalism-only account block (indefinite)",
			summary: "You have been indefinitely blocked from editing because your account is being [[WP:VOA|used only for vandalism]]",
			indefinite: true,
			pageParam: true
		},
		"uw-bioblock": {
			label: "BLP violations block",
			summary: "You have been blocked from editing for violations of Wikipedia's [[WP:BLP|biographies of living persons policy]]",
			pageParam: true
		},
		"uw-sblock": {
			label: "Spam block",
			summary: "You have been blocked from editing for using Wikipedia for [[WP:SPAM|spam]] purposes"
		},
		"uw-adblock": {
			label: "Advertising block",
			summary: "You have been blocked from editing for [[WP:SOAP|advertising or self-promotion]]",
			pageParam: true
		},
		"uw-soablock": {
			label: "Spam/advertising-only account block (indefinite)",
			summary: "You have been indefinitely blocked from editing because your account is being used only for [[WP:SPAM|spam, advertising, or promotion]]",
			indefinite: true,
			pageParam: true
		},
		"uw-npblock": {
			label: "Creating nonsense pages block",
			summary: "You have been blocked from editing for creating [[WP:PN|nonsense pages]]",
			pageParam: true
		},
		"uw-copyrightblock": {
			label: "Copyright violation block",
			summary: "You have been blocked from editing for continued [[WP:COPYVIO|copyright infringement]]",
			pageParam: true
		},
		"uw-spoablock": {
			label: "Sockpuppet account block (indefinite)",
			summary: "You have been indefinitely blocked from editing because your account is being used only for [[WP:SOCK|sock puppetry]]",
			indefinite: true
		},
		"uw-hblock": {
			label: "Harassment block",
			summary: "You have been blocked from editing for attempting to [[WP:HARASS|harass]] other users",
			pageParam: true
		},
		"uw-ewblock": {
			label: "Edit warring block",
			summary: "You have been blocked from editing to prevent further [[WP:DE|disruption]] caused by your engagement in an [[WP:EW|edit war]]",
			pageParam: true
		},
		"uw-3block": {
			label: "Three-revert rule violation block",
			summary: "You have been blocked from editing for violation of the [[WP:3RR|three-revert rule]]",
			pageParam: true
		},
		"uw-disruptblock": {
			label: "Disruptive editing block",
			summary: "You have been blocked from editing for [[WP:DE|disruptive editing]]",
			pageParam: true
		},
		"uw-deoablock": {
			label: "Disruption/trolling-only account block (indefinite)",
			summary: "You have been indefinitely blocked from editing because your account is being used only for [[WP:DE|trolling, disruption or harassment]]",
			indefinite: true,
			pageParam: true
		},
		"uw-lblock": {
			label: "Legal threat block (indefinite)",
			summary: "You have been indefinitely blocked from editing for making [[WP:NLT|legal threats or taking legal action]]",
			indefinite: true
		},
		"uw-aeblock": {
			label: "Arbitration enforcement block",
			summary: "You have been blocked from editing for violating an [[WP:Arbitration|arbitration decision]] with your edits",
			pageParam: true,
			reasonParam: true
		},
		"uw-efblock": {
			label: "Edit filter-related block",
			summary: "You have been blocked from editing for making disruptive edits that repeatedly triggered the [[WP:EF|edit filter]]"
		},
		"uw-myblock": {
			label: "Social networking block",
			summary: "You have been blocked from editing for using user and/or article pages as a [[WP:NOTMYSPACE|blog, web host, social networking site or forum]]",
			pageParam: true
		},
		"uw-dblock": {
			label: "Deletion/removal of content block",
			summary: "You have been blocked from editing for continued [[WP:VAND|removal of material]]",
			pageParam: true
		},
		"uw-compblock": {
			label: "Possible compromised account block (indefinite)",
			summary: "You have been indefinitely blocked from editing because it is believed that your [[WP:SECURE|account has been compromised]]",
			indefinite: true
		},
		"uw-botblock": {
			label: "Unapproved bot block",
			summary: "You have been blocked from editing because it appears you are running a [[WP:BOT|bot script]] without [[WP:BRFA|approval]]",
			pageParam: true
		},
		"uw-ublock": {
			label: "Username soft block (indefinite)",
			summary: "You have been indefinitely blocked from editing because your username is a violation of the [[WP:U|username policy]]",
			indefinite: true,
			reasonParam: true
		},
		"uw-uhblock": {
			label: "Username hard block (indefinite)",
			summary: "You have been indefinitely blocked from editing because your username is a blatant violation of the [[WP:U|username policy]]",
			indefinite: true,
			reasonParam: true
		},
		"uw-softerblock": {
			label: "Promotional username soft block (indefinite)",
			summary: "You have been indefinitely blocked from editing because your [[WP:U|username]] gives the impression that the account represents a group, organization or website",
			indefinite: true
		},
		"uw-causeblock": {
			label: "Promotional username soft block, for charitable causes (indefinite)",
			summary: "You have been indefinitely blocked from editing because your [[WP:U|username]] gives the impression that the account represents a group, organization or website",
			indefinite: true
		},
		"uw-botublock": {
			label: "Bot username soft block (indefinite)",
			summary: "You have been indefinitely blocked from editing because your [[WP:U|username]] indicates this is a [[WP:BOT|bot]] account, which is currently not approved",
			indefinite: true
		},
		"uw-memorialblock": {
			label: "Memorial username soft block (indefinite)",
			summary: "You have been indefinitely blocked from editing because your [[WP:U|username]] indicates this account may be used as a memorial or tribute to someone",
			indefinite: true
		},
		"uw-ublock-famous": {
			label: "Famous username soft block (indefinite)",
			summary: "You have been indefinitely blocked from editing because your [[WP:U|username]] matches the name of a well-known living individual",
			indefinite: true
		},
		"uw-ublock-double": {
			label: "Similar username soft block (indefinite)",
			summary: "You have been indefinitely blocked from editing because your [[WP:U|username]] is too similar to the username of another Wikipedia user",
			indefinite: true
		},
		"uw-uhblock-double": {
			label: "Username impersonation hard block (indefinite)",
			summary: "You have been indefinitely blocked from editing because your [[WP:U|username]] appears to impersonate another established Wikipedia user",
			indefinite: true
		},
		"uw-vaublock": {
			label: "Vandalism-only account and username hard block (indefinite)",
			summary: "You have been indefinitely blocked from editing because your account is being [[WP:VOA|used only for vandalism]] and your username is a blatant violation of the [[WP:U|username policy]]",
			indefinite: true,
			pageParam: true
		},
		"uw-spamublock": {
			label: "Spam-only account and promotional username hard block (indefinite)",
			summary: "You have been indefinitely blocked from editing because your account is being used only for [[WP:SPAM|spam or advertising]] and your username is a violation of the [[WP:U|username policy]]",
			indefinite: true
		}
	}
};

Twinkle.warn.prev_block_timer = null;
Twinkle.warn.prev_block_reason = null;
Twinkle.warn.prev_article = null;
Twinkle.warn.prev_reason = null;

Twinkle.warn.callback.change_category = function twinklewarnCallbackChangeCategory(e) {
	var value = e.target.value;
	var sub_group = e.target.root.sub_group;
	var messages = Twinkle.warn.messages[ value ];
	sub_group.main_group = value;
	var old_subvalue = sub_group.value;
	var old_subvalue_re;
	if( old_subvalue ) {
		old_subvalue = old_subvalue.replace(/\d*(im)?$/, '' );
		old_subvalue_re = new RegExp( RegExp.escape( old_subvalue ) + "(\\d*(?:im)?)$" );
	}

	while( sub_group.hasChildNodes() ){
		sub_group.removeChild( sub_group.firstChild );
	}

	for( var i in messages ) {
		var selected = false;
		if( old_subvalue && old_subvalue_re.test( i ) ) {
			selected = true;
		}
		var elem = new Morebits.quickForm.element( { type:'option', label:"{{" + i + "}}: " + messages[i].label, value:i, selected: selected } );
		
		sub_group.appendChild( elem.render() );
	}

	if( value === 'block' ) {
		// create the block-related fields
		var more = new Morebits.quickForm.element( { type: 'div', id: 'block_fields' } );
		more.append( {
			type: 'input',
			name: 'block_timer',
			label: 'Period of blocking: ',
			tooltip: 'The period the blocking is due for, for example 24 hours, 2 weeks, indefinite etc...'
		} );
		more.append( {
			type: 'input',
			name: 'block_reason',
			label: '"আপনাকে বাধা দেয়া হয়েছে ..." ',
			tooltip: 'An optional reason, to replace the default generic reason. Only available for the generic block templates.'
		} );
		e.target.root.insertBefore( more.render(), e.target.root.lastChild );

		// restore saved values of fields
		if(Twinkle.warn.prev_block_timer !== null) {
			e.target.root.block_timer.value = Twinkle.warn.prev_block_timer;
			Twinkle.warn.prev_block_timer = null;
		}
		if(Twinkle.warn.prev_block_reason !== null) {
			e.target.root.block_reason.value = Twinkle.warn.prev_block_reason;
			Twinkle.warn.prev_block_reason = null;
		}
		if(Twinkle.warn.prev_article === null) {
			Twinkle.warn.prev_article = e.target.root.article.value;
		}
		e.target.root.article.disabled = false;

		$(e.target.root.reason).parent().hide();
		e.target.root.previewer.closePreview();
	} else if( e.target.root.block_timer ) {
		// hide the block-related fields
		if(!e.target.root.block_timer.disabled && Twinkle.warn.prev_block_timer === null) {
			Twinkle.warn.prev_block_timer = e.target.root.block_timer.value;
		}
		if(!e.target.root.block_reason.disabled && Twinkle.warn.prev_block_reason === null) {
			Twinkle.warn.prev_block_reason = e.target.root.block_reason.value;
		}

		// hack to fix something really weird - removed elements seem to somehow keep an association with the form
		e.target.root.block_reason = null;

		$(e.target.root).find("#block_fields").remove();

		if(e.target.root.article.disabled && Twinkle.warn.prev_article !== null) {
			e.target.root.article.value = Twinkle.warn.prev_article;
			Twinkle.warn.prev_article = null;
		}
		e.target.root.article.disabled = false;

		$(e.target.root.reason).parent().show();
		e.target.root.previewer.closePreview();
	}

	// clear overridden label on article textbox
	Morebits.quickForm.setElementTooltipVisibility(e.target.root.article, true);
	Morebits.quickForm.resetElementLabel(e.target.root.article);
};

Twinkle.warn.callback.change_subcategory = function twinklewarnCallbackChangeSubcategory(e) {
	var main_group = e.target.form.main_group.value;
	var value = e.target.form.sub_group.value;

	if( main_group === 'singlenotice' || main_group === 'singlewarn' ) {
		if( value === 'uw-bite' || value === 'uw-username' || value === 'uw-socksuspect' ) {
			if(Twinkle.warn.prev_article === null) {
				Twinkle.warn.prev_article = e.target.form.article.value;
			}
			e.target.form.article.notArticle = true;
			e.target.form.article.value = '';
		} else if( e.target.form.article.notArticle ) {
			if(Twinkle.warn.prev_article !== null) {
				e.target.form.article.value = Twinkle.warn.prev_article;
				Twinkle.warn.prev_article = null;
			}
			e.target.form.article.notArticle = false;
		}
	} else if( main_group === 'block' ) {
		if( Twinkle.warn.messages.block[value].indefinite ) {
			if(Twinkle.warn.prev_block_timer === null) {
				Twinkle.warn.prev_block_timer = e.target.form.block_timer.value;
			}
			e.target.form.block_timer.disabled = true;
			e.target.form.block_timer.value = 'indefinite';
		} else if( e.target.form.block_timer.disabled ) {
			if(Twinkle.warn.prev_block_timer !== null) {
				e.target.form.block_timer.value = Twinkle.warn.prev_block_timer;
				Twinkle.warn.prev_block_timer = null;
			}
			e.target.form.block_timer.disabled = false;
		}

		if( Twinkle.warn.messages.block[value].pageParam ) {
			if(Twinkle.warn.prev_article !== null) {
				e.target.form.article.value = Twinkle.warn.prev_article;
				Twinkle.warn.prev_article = null;
			}
			e.target.form.article.disabled = false;
		} else if( !e.target.form.article.disabled ) {
			if(Twinkle.warn.prev_article === null) {
				Twinkle.warn.prev_article = e.target.form.article.value;
			}
			e.target.form.article.disabled = true;
			e.target.form.article.value = '';
		}

		if( Twinkle.warn.messages.block[value].reasonParam ) {
			if(Twinkle.warn.prev_block_reason !== null) {
				e.target.form.block_reason.value = Twinkle.warn.prev_block_reason;
				Twinkle.warn.prev_block_reason = null;
			}
			e.target.form.block_reason.disabled = false;
		} else if( !e.target.form.block_reason.disabled ) {
			if(Twinkle.warn.prev_block_reason === null) {
				Twinkle.warn.prev_block_reason = e.target.form.block_reason.value;
			}
			e.target.form.block_reason.disabled = true;
			e.target.form.block_reason.value = '';
		}
	}

	// change form labels according to the warning selected
	if (value === "uw-socksuspect") {
		Morebits.quickForm.setElementTooltipVisibility(e.target.form.article, false);
		Morebits.quickForm.overrideElementLabel(e.target.form.article, "Username of sock master, if known (without User:) ");
	} else if (value === "uw-username") {
		Morebits.quickForm.setElementTooltipVisibility(e.target.form.article, false);
		Morebits.quickForm.overrideElementLabel(e.target.form.article, "Username violates policy because... ");
	} else if (value === "uw-bite") {
		Morebits.quickForm.setElementTooltipVisibility(e.target.form.article, false);
		Morebits.quickForm.overrideElementLabel(e.target.form.article, "Username of 'bitten' user (without User:) ");
	} else {
		Morebits.quickForm.setElementTooltipVisibility(e.target.form.article, true);
		Morebits.quickForm.resetElementLabel(e.target.form.article);
	}
};

Twinkle.warn.callbacks = {
	preview: function(form) {
		var templatename = form.sub_group.value;
		
		var templatetext = '{{subst:' + templatename;
		var linkedarticle = form.article.value;
		if (templatename in Twinkle.warn.messages.block) {
			if( linkedarticle && Twinkle.warn.messages.block[templatename].pageParam ) {
				templatetext += '|page=' + linkedarticle;
			}

			var blocktime = form.block_timer.value;
			if( /te?mp|^\s*$|min/.exec( blocktime ) || Twinkle.warn.messages.block[templatename].indefinite ) {
				; // nothing
			} else if( /indef|\*|max/.exec( blocktime ) ) {
				templatetext += '|indef=yes';
			} else {
				templatetext += '|time=' + blocktime;
			}

			var blockreason = form.block_reason.value;
			if( blockreason ) {
				templatetext += '|reason=' + blockreason;
			}

			templatetext += "|sig=true}}";
		} else {
			if (linkedarticle) {
				// add linked article for user warnings (non-block templates)
				templatetext += '|1=' + linkedarticle;
			}
			templatetext += '}}';

			// add extra message for non-block templates
			var reason = form.reason.value;
			if (reason) {
				templatetext += " ''" + reason + "''";
			}
		}

		form.previewer.beginRender(templatetext);
	},
	main: function( pageobj ) {
		var text = pageobj.getPageText();
		var params = pageobj.getCallbackParameters();
		var messageData = Twinkle.warn.messages[params.main_group][params.sub_group];

		var history_re = /<!-- Template:(uw-.*?) -->.*?(\d{1,2}:\d{1,2}, \d{1,2} \w+ \d{4}) \(UTC\)/g;
		var history = {};
		var latest = { date:new Date( 0 ), type:'' };
		var current;

		while( ( current = history_re.exec( text ) ) ) {
			var current_date = new Date( current[2] + ' UTC' );
			if( !( current[1] in history ) ||  history[ current[1] ] < current_date ) {
				history[ current[1] ] = current_date;
			}
			if( current_date > latest.date ) {
				latest.date = current_date;
				latest.type = current[1];
			}
		}

		var date = new Date();

		if( params.sub_group in history ) {
			var temp_time = new Date( history[ params.sub_group ] );
			temp_time.setUTCHours( temp_time.getUTCHours() + 24 );

			if( temp_time > date ) {
				if( !confirm( "An identical " + params.sub_group + " has been issued in the last 24 hours.  \nWould you still like to add this warning/notice?" ) ) {
					pageobj.statelem.info( 'aborted per user request' );
					return;
				}
			}
		}

		latest.date.setUTCMinutes( latest.date.getUTCMinutes() + 1 ); // after long debate, one minute is max

		if( latest.date > date ) {
			if( !confirm( "A " + latest.type + " has been issued in the last minute.  \nWould you still like to add this warning/notice?" ) ) {
				pageobj.statelem.info( 'aborted per user request' );
				return;
			}
		}
		
		var mainheaderRe = new RegExp("==+\\s*Warnings\\s*==+");
		var headerRe = new RegExp( "^==+\\s*(?:" + date.getUTCMonthName() + '|' + date.getUTCMonthNameAbbrev() +  ")\\s+" + date.getUTCFullYear() + "\\s*==+", 'm' );

		if( text.length > 0 ) {
			text += "\n\n";
		}

		if( params.main_group === 'block' ) {
			var article = '', reason = '', time = null;
			
			if( Twinkle.getPref('blankTalkpageOnIndefBlock') && params.sub_group !== 'uw-lblock' && ( Twinkle.warn.messages.block[params.sub_group].indefinite || (/indef|\*|max/).exec( params.block_timer ) ) ) {
				Morebits.status.info( 'Info', 'Blanking talk page per preferences and creating a new level 2 heading for the date' );
				text = "== " + date.getUTCMonthName() + " " + date.getUTCFullYear() + " ==\n";
			} else if( !headerRe.exec( text ) ) {
				Morebits.status.info( 'Info', 'Will create a new level 2 heading for the date, as none was found for this month' );
				text += "== " + date.getUTCMonthName() + " " + date.getUTCFullYear() + " ==\n";
			}
			
			if( params.article && Twinkle.warn.messages.block[params.sub_group].pageParam ) {
				article = '|page=' + params.article;
			}
			
			if( params.reason && Twinkle.warn.messages.block[params.sub_group].reasonParam ) {
				reason = '|reason=' + params.reason;
			}
			
			if( /te?mp|^\s*$|min/.exec( params.block_timer ) || Twinkle.warn.messages.block[params.sub_group].indefinite ) {
				time = '';
			} else if( /indef|\*|max/.exec( params.block_timer ) ) {
				time = '|indef=yes';
			} else {
				time = '|time=' + params.block_timer;
			}

			text += "{{subst:" + params.sub_group + article + time + reason + "|sig=true|subst=subst:}}";
		} else {
			if( !headerRe.exec( text ) ) {
				Morebits.status.info( 'Info', 'Will create a new level 2 heading for the date, as none was found for this month' );
				text += "== " + date.getUTCMonthName() + " " + date.getUTCFullYear() + " ==\n";
			}
			text += "{{subst:" + params.sub_group + ( params.article ? '|1=' + params.article : '' ) + "|subst=subst:}}" + (params.reason ? " ''" + params.reason + "'' ": ' ' ) + "~~~~";
		}
		
		if ( Twinkle.getPref('showSharedIPNotice') && Morebits.isIPAddress( mw.config.get('wgTitle') ) ) {
			Morebits.status.info( 'তথ্য', 'শেয়ার্ড আইপি নোটিশ সংযোজন' );
			text +=  "\n{{subst:SharedIPAdvice}}";
		}

		var summary = messageData.summary;
		if ( messageData.suppressArticleInSummary !== true && params.article ) {
			if ( params.sub_group === "uw-socksuspect" ) {  // this template requires a username
				summary += " [[ব্যবহারকারী:" + params.article + "]] এর";
			} else {
				summary += " [[" + params.article + "]] পাতায়";
			}
		}
		summary += "." + Twinkle.getPref("summaryAd");

		pageobj.setPageText( text );
		pageobj.setEditSummary( summary );
		pageobj.setWatchlist( Twinkle.getPref('watchWarnings') );
		pageobj.save();
	}
};

Twinkle.warn.callback.evaluate = function twinklewarnCallbackEvaluate(e) {

	// First, check to make sure a reason was filled in if uw-username was selected
	
	if(e.target.sub_group.value === 'uw-username' && e.target.article.value.trim() === '') {
		alert("আপনাকে অবশ্যই {{uw-username}} টেমপ্লেটটি ব্যবহারের কারণ উল্লেখ করতে হবে।");
		return;
	}

	// Then, grab all the values provided by the form
	
	var params = {
		reason: e.target.block_reason ? e.target.block_reason.value : e.target.reason.value,
		main_group: e.target.main_group.value,
		sub_group: e.target.sub_group.value,
		article: e.target.article.value,  // .replace( /^(Image|Category):/i, ':$1:' ),  -- apparently no longer needed...
		block_timer: e.target.block_timer ? e.target.block_timer.value : null
	};

	Morebits.simpleWindow.setButtonsEnabled( false );
	Morebits.status.init( e.target );

	Morebits.wiki.actionCompleted.redirect = mw.config.get('wgPageName');
	Morebits.wiki.actionCompleted.notice = "সতর্কীবার্তা পাঠানো হয়েছে, কয়েক সেকেন্ডের মধ্যে আলাপ পাতা ফিরিয়ে আনা হবে";

	var wikipedia_page = new Morebits.wiki.page( mw.config.get('wgPageName'), 'ব্যবহারকারী আলাপ পাতা পরিবর্তিত হয়েছে' );
	wikipedia_page.setCallbackParameters( params );
	wikipedia_page.setFollowRedirect( true );
	wikipedia_page.load( Twinkle.warn.callbacks.main );
};
