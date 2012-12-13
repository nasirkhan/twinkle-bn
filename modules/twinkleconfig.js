/*
 ****************************************
 *** twinkleconfig.js: Preferences module
 ****************************************
 * Mode of invocation:     Adds configuration form to Wikipedia:Twinkle/Preferences and user 
                           subpages named "/Twinkle preferences", and adds ad box to the top of user 
                           subpages belonging to the currently logged-in user which end in '.js'
 * Active on:              What I just said.  Yeah.
 * Config directives in:   TwinkleConfig

 I, [[User:This, that and the other]], originally wrote this.  If the code is misbehaving, or you have any
 questions, don't hesitate to ask me.  (This doesn't at all imply [[WP:OWN]]ership - it's just meant to
 point you in the right direction.)  -- TTO
 */


Twinkle.config = {};

Twinkle.config.commonEnums = {
	watchlist: { yes: "নজরতালিকায় অন্তরভুক্ত করুন", no: "নজরতালিকায় তালিকাভুক্ত করবেন না", "default": "সাইটের পছন্দসমূহ অনুযায়ী" },
	talkPageMode: { window: "নতুন উইন্ডোতে, পূর্বের ব্যবহারকারী আলাপ পাতা প্রতিস্থাপন", tab: "নতুন ট্যাবে", blank: "নতুন উইন্ডোতে" }
};

Twinkle.config.commonSets = {
	csdCriteria: {
		db: "বিশেষ বিচারধারা ({{db}})",
		g1: "G1", g2: "G2", g3: "G3", g4: "G4", g5: "G5", g6: "G6", g7: "G7", g8: "G8", g10: "G10", g11: "G11", g12: "G12",
		a1: "A1", a2: "A2", a3: "A3", a5: "A5", a7: "A7", a9: "A9", a10: "A10",
		u1: "U1", u2: "U2", u3: "U3",
		f1: "F1", f2: "F2", f3: "F3", f7: "F7", f8: "F8", f9: "F9", f10: "F10",
		c1: "C1",
		t2: "T2", t3: "T3",
		r2: "R2", r3: "R3",
		p1: "P1", p2: "P2"
	},
	csdCriteriaDisplayOrder: [
		"db",
		"g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g10", "g11", "g12",
		"a1", "a2", "a3", "a5", "a7", "a9", "a10",
		"u1", "u2", "u3",
		"f1", "f2", "f3", "f7", "f8", "f9", "f10",
		"c1",
		"t2", "t3",
		"r2", "r3",
		"p1", "p2"
	],
	csdCriteriaNotification: {
		db: "সাধারন বিচারধারা ({{db}})",
		g1: "G1", g2: "G2", g3: "G3", g4: "G4", g6: 'G6 (কেবলমাত্র "অপ্রয়োজনীয় দ্ব্যার্থতা নিরসন" এবং "কপি-পেস্ট স্থানান্তর")',
		g10: "G10", g11: "G11", g12: "G12",
		a1: "A1", a2: "A2", a3: "A3", a5: "A5", a7: "A7", a9: "A9", a10: "A10",
		u3: "U3",
		f1: "F1", f2: "F2", f3: "F3", f7: "F7", f8: "F8", f9: "F9", f10: "F10",
		c1: "C1",
		t2: "T2", t3: "T3",
		r2: "R2", r3: "R3",
		p1: "P1", p2: "P2"
	},
	csdCriteriaNotificationDisplayOrder: [
		"db",
		"g1", "g2", "g3", "g4", "g6", "g10", "g11", "g12",
		"a1", "a2", "a3", "a5", "a7", "a9", "a10",
		"u3",
		"f1", "f2", "f3", "f7", "f9", "f10",
		"c1",
		"t2", "t3",
		"r2", "r3",
		"p1", "p2"
	],
	csdAndDICriteria: {
		db: "বিশেষ বিচারধারা ({{db}})",
		g1: "G1", g2: "G2", g3: "G3", g4: "G4", g5: "G5", g6: "G6", g7: "G7", g8: "G8", g10: "G10", g11: "G11", g12: "G12",
		a1: "A1", a2: "A2", a3: "A3", a5: "A5", a7: "A7", a9: "A9", a10: "A10",
		u1: "U1", u2: "U2", u3: "U3",
		f1: "F1", f2: "F2", f3: "F3", f4: "F4", f5: "F5", f6: "F6", f7: "F7", f8: "F8", f9: "F9", f10: "F10", f11: "F11",
		c1: "C1",
		t2: "T2", t3: "T3",
		r2: "R2", r3: "R3",
		p1: "P1", p2: "P2"
	},
	csdAndDICriteriaDisplayOrder: [
		"db",
		"g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g10", "g11", "g12",
		"a1", "a2", "a3", "a5", "a7", "a9", "a10",
		"u1", "u2", "u3",
		"f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11",
		"c1",
		"t2", "t3",
		"r2", "r3",
		"p1", "p2"
	],
	namespacesNoSpecial: {
		"0": "নিবন্ধ",
		"1": "আলাপ (নিবন্ধ)",
		"2": "ব্যবহারকারী",
		"3": "ব্যবহারকারী আলাপ",
		"4": "উইকিপিডিয়া",
		"5": "উইকিপিডিয়া আলাপ",
		"6": "ফাইল",
		"7": "ফাইল আলাপ",
		"8": "মিডিয়াউইকি",
		"9": "মিডিয়াউইকি আলাপ",
		"10": "টেমপ্লেট",
		"11": "টেমপ্লেট আলাপ",
		"12": "সাহায্য",
		"13": "সাহায্য আলাপ",
		"14": "বিষয়শ্রেণী",
		"15": "বিষয়শ্রেণী আলাপ",
		"100": "প্রবেশদ্বার",
		"101": "প্রবেশদ্বার আলাপ",
		"108": "বই",
		"109": "বই আলাপ"
	}
};

/**
 * Section entry format:
 *
 * {
 *   title: <human-readable section title>,
 *   adminOnly: <true for admin-only sections>,
 *   hidden: <true for advanced preferences that rarely need to be changed - they can still be modified by manually editing twinkleoptions.js>,
 *   inFriendlyConfig: <true for preferences located under FriendlyConfig rather than TwinkleConfig>,
 *   preferences: [
 *     {
 *       name: <TwinkleConfig property name>,
 *       label: <human-readable short description - used as a form label>,
 *       helptip: <(optional) human-readable text (using valid HTML) that complements the description, like limits, warnings, etc.>
 *       adminOnly: <true for admin-only preferences>,
 *       type: <string|boolean|integer|enum|set|customList> (customList stores an array of JSON objects { value, label }),
 *       enumValues: <for type = "enum": a JSON object where the keys are the internal names and the values are human-readable strings>,
 *       setValues: <for type = "set": a JSON object where the keys are the internal names and the values are human-readable strings>,
 *       setDisplayOrder: <(optional) for type = "set": an array containing the keys of setValues (as strings) in the order that they are displayed>,
 *       customListValueTitle: <for type = "customList": the heading for the left "value" column in the custom list editor>,
 *       customListLabelTitle: <for type = "customList": the heading for the right "label" column in the custom list editor>
 *     },
 *     . . .
 *   ]
 * },
 * . . .
 *
 */

Twinkle.config.sections = [
{
	title: "সাধারণ",
	preferences: [
		// TwinkleConfig.summaryAd (string)
		// Text to be appended to the edit summary of edits made using Twinkle
		{
			name: "summaryAd",
			label: "সম্পাদনা সারাংশে টুইংকলের বিজ্ঞাপন থাকবে",
			helptip: "সম্পাদনা সারাংশের বিজ্ঞাপনের শুরুতে একটি স্পেস থাকবে এবং এটি অত্যান্ত সংক্ষিপ্ত আকারের হবে।",
			type: "string"
		},

		// TwinkleConfig.deletionSummaryAd (string)
		// Text to be appended to the edit summary of deletions made using Twinkle
		{
			name: "deletionSummaryAd",
			label: "অপসারণ সারাংশে টুইংকলের বিজ্ঞাপন থাকবে",
			helptip: "সম্পাদনা সারাংশের বিজ্ঞাপনটি এখানে ব্যবহার করা যেতে পারে।",
			adminOnly: true,
			type: "string"
		},

		// TwinkleConfig.protectionSummaryAd (string)
		// Text to be appended to the edit summary of page protections made using Twinkle
		{
			name: "protectionSummaryAd",
			label: "পাতা সুরক্ষা সারাংশে টুইংকলের বিজ্ঞাপন থাকবে",
			helptip: "সম্পাদনা সারাংশের বিজ্ঞাপনটি এখানে ব্যবহার করা যেতে পারে।",
			adminOnly: true,
			type: "string"
		},

		// TwinkleConfig.userTalkPageMode may take arguments:
		// 'window': open a new window, remember the opened window
		// 'tab': opens in a new tab, if possible.
		// 'blank': force open in a new window, even if such a window exists
		{
			name: "userTalkPageMode",
			label: "ব্যবহারকারী আলাপ পাতাগুলো সম্পাদনার জন্য খুলুন",
			type: "enum",
			enumValues: Twinkle.config.commonEnums.talkPageMode
		},

		// TwinkleConfig.dialogLargeFont (boolean)
		{
			name: "dialogLargeFont",
			label: "টুইংকল উইন্ডোতে বড় আকারের লেখা দেখুন",
			type: "boolean"
		}
	]
},

{
	title: "ছবি অপসারণ (DI)",
	preferences: [
		// TwinkleConfig.notifyUserOnDeli (boolean)
		// If the user should be notified after placing a file deletion tag
		{
			name: "notifyUserOnDeli",
			label: "ডিফল্টভাবে \"মূল আপলোডারকে জানান\" অপশনটি সক্রিয় থাকবে",
			type: "boolean"
		},

		// TwinkleConfig.deliWatchPage (string)
		// The watchlist setting of the page tagged for deletion. Either "yes", "no", or "default". Default is "default" (Duh).
		{
			name: "deliWatchPage",
			label: "ট্যাগ সংযোজনের পর ছবিটি নজরতালিকায় যোগ করা হবে",
			type: "enum",
			enumValues: Twinkle.config.commonEnums.watchlist
		},

		// TwinkleConfig.deliWatchUser (string)
		// The watchlist setting of the user talk page if a notification is placed. Either "yes", "no", or "default". Default is "default" (Duh).
		{
			name: "deliWatchUser",
			label: "ট্যাগ সংযোজনের সময় মূল আপলোডারের আলাপ পাতাটি নজরতালিকায় যোগ করা হবে",
			type: "enum",
			enumValues: Twinkle.config.commonEnums.watchlist
		}
	]
},
/* 
// disabling module as it is not being used in Bengali Wikipedia
{
	title: "Proposed deletion (PROD)",
	preferences: [
		// TwinkleConfig.watchProdPages (boolean)
		// If, when applying prod template to page, to watch the page
		{
			name: "watchProdPages",
			label: "Add article to watchlist when tagging",
			type: "boolean"
		},

		// TwinkleConfig.prodReasonDefault (string)
		// The prefilled PROD reason.
		{
			name: "prodReasonDefault",
			label: "Prefilled PROD reason",
			type: "string"
		},

		{
			name: "logProdPages",
			label: "Keep a log in userspace of all pages you tag for PROD",
			helptip: "Since non-admins do not have access to their deleted contributions, the userspace log offers a good way to keep track of all pages you tag for PROD using Twinkle.",
			type: "boolean"
		},
		{
			name: "prodLogPageName",
			label: "Keep the PROD userspace log at this user subpage",
			helptip: "Enter a subpage name in this box. You will find your PROD log at User:<i>username</i>/<i>subpage name</i>. Only works if you turn on the PROD userspace log.",
			type: "string"
		}
	]
},*/

{
	title: "রিভার্ট এবং রোলব্যাক",  // twinklefluff module
	preferences: [
		// TwinkleConfig.openTalkPage (array)
		// What types of actions that should result in opening of talk page
		{
			name: "openTalkPage",
			label: "এই ধরনের সম্পাদনার পর ব্যবহারকারী আলাপ পাতা খোলা হবে",
			type: "set",
			setValues: { agf: "AGF রোলব্যাক", norm: "সাধারণ রোলব্যাক", vand: "রোলব্যাক (ধ্বংসপ্রবণতা)", torev: "এই সংস্করণটি ফিরিয়ে আনুন" }
		},

		// TwinkleConfig.openTalkPageOnAutoRevert (bool)
		// Defines if talk page should be opened when calling revert from contrib page, because from there, actions may be multiple, and opening talk page not suitable. If set to true, openTalkPage defines then if talk page will be opened.
		{
			name: "openTalkPageOnAutoRevert",
			label: "কোন ব্যবহারকারীর অবদান রোলব্যাক করার পার তার আলাপ পাতা খুলুন",
			helptip: "প্রায় সময়ই আপনি একই সাথে একাধিক পাতার ধ্বংসপ্রবনতা দূর করার জন্য রোলব্যাক করে থাকেন, এক্ষেত্রে প্রতিবার ব্যবহারকারীর আলাপ পাতা ওপেন করা অসুবিধাজনক হতে পারে। ডিফল্টভাবে এই অপশনটি বন্ধ থাকে। এই অপশনটি চালু করা হলে কোন কোন ধরনের পাতার জন্য এটি কার্যকর হবে সেটি নির্ধারন করে দিতে হবে।",
			type: "boolean"
		},

		// TwinkleConfig.markRevertedPagesAsMinor (array)
		// What types of actions that should result in marking edit as minor
		{
			name: "markRevertedPagesAsMinor",
			label: "এই ধরনের সম্পাদনাগুলো অনুল্লেখিত হিসাবে চিহ্নিত করুন",
			type: "set",
			setValues: { agf: "AGF রোলব্যাক", norm: "সাধারণ রোলব্যাক", vand: "রোলব্যাক (ধ্বংসপ্রবণতা)", torev: "এই সংস্করণটি ফিরিয়ে আনুন" }
		},

		// TwinkleConfig.watchRevertedPages (array)
		// What types of actions that should result in forced addition to watchlist
		{
			name: "watchRevertedPages",
			label: "এই ধরনের সম্পাদনার সময় পাতাগুলো নজর তালিকায় রাখুন",
			type: "set",
			setValues: { agf: "AGF রোলব্যাক", norm: "সাধারণ রোলব্যাক", vand: "রোলব্যাক (ধ্বংসপ্রবণতা)", torev: "এই সংস্করণটি ফিরিয়ে আনুন" }
		},

		// TwinkleConfig.offerReasonOnNormalRevert (boolean)
		// If to offer a prompt for extra summary reason for normal reverts, default to true
		{
			name: "offerReasonOnNormalRevert",
			label: "সাধারণ রোলব্যাকের পর কারণ উল্লেখ করার উইন্ডো খুলুন",
			helptip: "সাধারণ রোলব্যাক বলতে মাঝের [রোলব্যাক] লিংকটি বুঝানো হচ্ছে।",
			type: "boolean"
		},

		{
			name: "confirmOnFluff",
			label: "রোলব্যাক করার পূর্বে নিশ্চিতকরণ বার্তা দেখাও",
			helptip: "যারা কোন টাচ ডিভাইস থেকে ব্যবাহর করছেন, এবং অনিচ্ছাকৃত ত্রুটি এড়ানোর জন্য।",
			type: "boolean"
		},

		// TwinkleConfig.showRollbackLinks (array)
		// Where Twinkle should show rollback links (diff, others, mine, contribs)
		// Note from TTO: |contribs| seems to be equal to |others| + |mine|, i.e. redundant, so I left it out heres
		{
			name: "showRollbackLinks",
			label: "এই পাতাগুলোতে রোলব্যাক লিংক দেখাও",
			type: "set",
			setValues: { diff: "পার্থক্য পাতা", others: "অন্য ব্যবহারকারীর সম্পাদিত", mine: "আমার সম্পাদিত পাতা" }
		}
	]
},

{
	title: "শেয়ার্ড আইপি ট্যাগ করা",
	inFriendlyConfig: true,
	preferences: [
		{
			name: "markSharedIPAsMinor",
			label: "শেয়ার্ড আইপিতে ট্যাগ সংযোজন অনুল্লেখিত সম্পাদনা হিসাবে বিবেচনা করুন",
			type: "boolean"
		}
	]
},

{
	title: "দ্রুত অপসারণ (CSD)",
	preferences: [
		{
			name: "speedySelectionStyle",
			label: "ট্যাগ সংযোজন অথবা অপসারণ সম্পন্ন করা হবে, যখন",
			type: "enum",
			enumValues: { "buttonClick": '"কার্যকর করুন" বাটনে ক্লিক করা হবে', "radioClick": "অপশনটি নির্বাচন করা হবে" }
		},
		{
			name: "speedyPromptOnG7",
			label: "G7 (প্রনেতার অনুরোধ) বিচার ধারায় প্রস্তাব করা হলে কারণ উল্লেখ করার উইন্ডো ওপেন হবে",
			type: "boolean"
		},

		// TwinkleConfig.watchSpeedyPages (array)
		// Whether to add speedy tagged pages to watchlist
		{
			name: "watchSpeedyPages",
			label: "নিচের বিষয়গুলোতে ট্যাগ সংযোজন করা হলে, পাতাটি নজর তালিকায় রাখা হবে",
			type: "set",
			setValues: Twinkle.config.commonSets.csdCriteria,
			setDisplayOrder: Twinkle.config.commonSets.csdCriteriaDisplayOrder
		},

		// TwinkleConfig.markSpeedyPagesAsPatrolled (boolean)
		// If, when applying speedy template to page, to mark the page as patrolled (if the page was reached from NewPages)
		{
			name: "markSpeedyPagesAsPatrolled",
			label: "ট্যাগ সংযোজনের পর পাতাটি পরিক্ষিত বলে চিহ্নিত করুন (যদি সম্ভব হয়)",
			helptip: "কারিগরি ত্রুটির কারণে যখন Special:NewPages পাতা থেকে চিহ্নিত করা হবে, কেবলমাত্র সেই সময় পাতাটি পরীক্ষিত হিসাবে চিহ্নিত হবে।",
			type: "boolean"
		},

		// TwinkleConfig.notifyUserOnSpeedyDeletionNomination (array)
		// What types of actions should result that the author of the page being notified of nomination
		{
			name: "notifyUserOnSpeedyDeletionNomination",
			label: "এই ট্যাগগুলো সংযোজনের পর প্রণেতাকে জানানো হবে",
			helptip: "যদি আপনি দ্রুত অপসারণ পাতা থেকে নির্বাচন করে থাকেন, তবুও কেবলমাত্র এই বিষয়গুলোর ক্ষেত্রে ট্যাগ সংযোজন করা হবে।",
			type: "set",
			setValues: Twinkle.config.commonSets.csdCriteriaNotification,
			setDisplayOrder: Twinkle.config.commonSets.csdCriteriaNotificationDisplayOrder
		},

		// TwinkleConfig.welcomeUserOnSpeedyDeletionNotification (array of strings)
		// On what types of speedy deletion notifications shall the user be welcomed
		// with a "firstarticle" notice if his talk page has not yet been created.
		{
			name: "welcomeUserOnSpeedyDeletionNotification",
			label: "এই ট্যাগগুলো সংযোজনের সময় প্রনেতাকে স্বাগতম বার্তা জানানো হবে",
			helptip: "ব্যবহারকারীকে অপসারণ নোটিশ পাঠানোর সময় এই স্বাগতম বার্তা জানানো হবে, এবং যদি আগে থেকেই কোনো স্বাগতম বার্তা না থাকে। এক্ষেত্রে {{<a href=\"" + mw.util.wikiGetlink("Template:Firstarticle") + "\">প্রথম নিবন্ধ</a>}} টেমপ্লেটটি ব্যবহৃত হবে।",
			type: "set",
			setValues: Twinkle.config.commonSets.csdCriteriaNotification,
			setDisplayOrder: Twinkle.config.commonSets.csdCriteriaNotificationDisplayOrder
		},

		// TwinkleConfig.promptForSpeedyDeletionSummary (array of strings)
		{
			name: "promptForSpeedyDeletionSummary",
			label: "এই বিচারধারায় অপসারণের সময় অপসারণ সারাংশ সম্পাদনা করা যাবে",
			adminOnly: true,
			type: "set",
			setValues: Twinkle.config.commonSets.csdAndDICriteria,
			setDisplayOrder: Twinkle.config.commonSets.csdAndDICriteriaDisplayOrder
		},

		// TwinkleConfig.openUserTalkPageOnSpeedyDelete (array of strings)
		// What types of actions that should result user talk page to be opened when speedily deleting (admin only)
		{
			name: "openUserTalkPageOnSpeedyDelete",
			label: "এই বিচারধারায় অপসারণের সময় ব্যবহারকারী আলাপ পাতা খুলুন",
			adminOnly: true,
			type: "set",
			setValues: Twinkle.config.commonSets.csdAndDICriteria,
			setDisplayOrder: Twinkle.config.commonSets.csdAndDICriteriaDisplayOrder
		},

		// TwinkleConfig.deleteTalkPageOnDelete (boolean)
		// If talk page if exists should also be deleted (CSD G8) when spedying a page (admin only)
		{
			name: "deleteTalkPageOnDelete",
			label: "\"আলাপ পাতা অপসারণ করুন\" চিহ্নিত রাখুন",
			adminOnly: true,
			type: "boolean"
		},

		{
			name: "deleteRedirectsOnDelete",
			label: "\"পুনঃনির্দেশ অপসারণ করুন\" চিহ্নিত রাখুন",
			adminOnly: true,
			type: "boolean"
		},

		// TwinkleConfig.deleteSysopDefaultToTag (boolean)
		// Make the CSD screen default to "tag" instead of "delete" (admin only)
		{
			name: "deleteSysopDefaultToTag",
			label: "অপসারণের পরিবর্তে ডিফল্টভাবে শুধুমাত্র ট্যাগ সংযোজন করা হবে",
			adminOnly: true,
			type: "boolean"
		},

		// TwinkleConfig.speedyWindowWidth (integer)
		// Defines the width of the Twinkle SD window in pixels
		{
			name: "speedyWindowWidth",
			label: "দ্রুত অপসারণ উইন্ডোর প্রস্থ্য (পিক্সেল)",
			type: "integer"
		},

		// TwinkleConfig.speedyWindowWidth (integer)
		// Defines the width of the Twinkle SD window in pixels
		{
			name: "speedyWindowHeight",
			label: "দ্রুত অপসারণ উইন্ডোর উচ্চতা (পিক্সেল)",
			helptip: "আপনি যদি সাধারণের থেকে বড় আকারের মনিটর ব্যবহার করে থাকেন, তবে আপনার উচিত এখানে মান বাড়িয়ে নেয়া।",
			type: "integer"
		},

		{
			name: "logSpeedyNominations",
			label: "দ্রুত অপসারণ প্রস্তাবনাগুলোর তালিকা ব্যবহারকারীর নাম সংরক্ষন করুন",
			helptip: "সাধারণ ব্যবহারকারীরা তাদের অপসারিত সম্পাদনাগুলো দেখতে পারেন না, ব্যবহারকারী নামস্থানে অপসারিত নিবন্ধের তালিকা সংরক্ষনের মাধ্যমে তারা এই নিবন্ধ/অবদান গুলো দেখতে পারবেন",
			type: "boolean"
		},
		{
			name: "speedyLogPageName",
			label: "ব্যবহারকারীর এই উপপাতায় দ্রুত অপসারণ লগ সংরক্ষন করন",
			helptip: "এই বক্সে ব্যবহারকারী উপপাতার নাম লিখুন। ব্যবহারকারী উপপাতায় লগ সংরক্ষণ অপশনটি চালু থাকলে এটি কার্যকর হবে।",
			type: "string"
		},
		{
			name: "noLogOnSpeedyNomination",
			label: "এই বিষয়ের ট্যাগ সংযোজনের ক্ষেত্রে উপপাতায় লগ সংরক্ষন করা হবে না",
			type: "set",
			setValues: Twinkle.config.commonSets.csdAndDICriteria,
			setDisplayOrder: Twinkle.config.commonSets.csdAndDICriteriaDisplayOrder
		}
	]
},

{
	title: "ট্যাগ",
	inFriendlyConfig: true,
	preferences: [
		{
			name: "watchTaggedPages",
			label: "ট্যাগ সংযোজনের পর পাতাটি নজর তালিকায় রাখুন",
			type: "boolean"
		},
		{
			name: "markTaggedPagesAsMinor",
			label: "ট্যাগ সংযোজন সম্পাদনাটি অনুল্লেখ্য হিসাবে চিহ্নিত করুন",
			type: "boolean"
		},
		{
			name: "markTaggedPagesAsPatrolled",
			label: "ট্যাগ সংযোজনের পর পাতাটি পরীক্ষিত হিসাবে চিহ্নিত করুন (যদি সম্ভব হয়)",
			helptip: "কারিগরী সীমাবদ্ধতার জন্য বর্তমানে কেবলমাত্র Special:NewPages পাতা থেকে সম্পাদনার ক্ষেত্রে এটি কার্যকর হবে।",
			type: "boolean"
		},
		{
			name: "groupByDefault",
			label: "ডিফল্টভাবে \"{{multiple issues}}\" বক্সে টিক চিহ্ন থাকবে",
			type: "boolean"
		},
		{
			name: "tagArticleSortOrder",
			label: "নিবন্ধ ট্যাগের ডিফল্ট ক্রম",
			type: "enum",
			enumValues: { "cat": "বিষয়শ্রেণী অনুযায়ী", "alpha": "বর্ণক্রম অনুযায়ী" }
		},
		{
			name: "customTagList",
			label: "নিবন্ধ রক্ষনাবেক্ষনের বিশেষ ট্যাগ",
			helptip: "ট্যাগের তালিকার নিচে এগুলো অতিরিক্ত অপশন হিসাবে দেখানো হবে। আপনি এমন যে কোন টেমপ্লেটই এখানে যোগ করতে পারবেন যেগুলো এখনো টুইংকলে যুক্ত করা হয়নি।",
			type: "customList",
			customListValueTitle: "টেমপ্লেটের নাম (বন্ধনী বাদে লিখুন)",
			customListLabelTitle: "ট্যাগ উইন্ডোতে যা দেখানো হবে"
		}
	]
},

{
	title: "ফিরতি বার্তা",
	inFriendlyConfig: true,
	preferences: [
		{
			name: "markTalkbackAsMinor",
			label: "ফরতি বার্তার সম্পাদনাটি অনুল্লেখ্য হিসাবে চিহ্নিত করুন‌",
			type: "boolean"
		},
		{
			name: "insertTalkbackSignature",
			label: "ফিরতি বার্তায় স্বাক্ষর  ব্যবহার করুন",
			type: "boolean"
		},
		{
			name: "talkbackHeading",
			label: "ফিরতি বার্তা অনুচ্ছেদে যে শিরনাম ব্যবহৃত হবে",
			type: "string"
		},
		{
			name: "adminNoticeHeading",
			label: "প্রশাসকদের আলোচনাসভার নোটিশের শিরনাম",
			helptip: "কেবলমাত্র প্রশাসকদের আলোচনাসভার নোটিশের ক্ষেত্রে উপযোগী।",
			type: "string"
		},
		{
			name: "mailHeading",
			label: "ইমেইল পাঠানোর ক্ষেত্রে অনুচ্ছেদে যে শিরনাম ব্যবহৃত হবে",
			type: "string"
		}
	]
},

{
	title: "লিংক অপসারণ",
	preferences: [
		// TwinkleConfig.unlinkNamespaces (array)
		// In what namespaces unlink should happen, default in 0 (article) and 100 (portal)
		{
			name: "unlinkNamespaces",
			label: "এই নামস্থানের পাতাগুলোর ক্ষেত্রে লিংক অপসারণ করা হবে",
			helptip: "সকল নামস্থানের ক্ষেত্রেই আলোচনা পাতাগুলো নির্বাচন করা থেকে বিরত থাকুন।",
			type: "set",
			setValues: Twinkle.config.commonSets.namespacesNoSpecial
		}
	]
},

{
	title: "Warn user",
	preferences: [
		// TwinkleConfig.defaultWarningGroup (int)
		// if true, watch the page which has been dispatched an warning or notice, if false, default applies
		{
			name: "defaultWarningGroup",
			label: "ডিফল্ট সতর্কীকরণ মাত্রা",
			type: "enum",
			enumValues: { "1": "লেভেল ১", "2": "লেভেল ২", "3": "লেভেল ৩", "4": "লেভেল ৪", "5": "Level 4im", "6": "Single-issue notices", "7": "Single-issue warnings", "8": "ব্লক (প্রশাসকদের জন্য)" }
		},

		// TwinkleConfig.showSharedIPNotice may take arguments:
		// true: to show shared ip notice if an IP address
		// false: to not print the notice
		{
			name: "showSharedIPNotice",
			label: "শেয়ার্ড আইপি আলাপ পাতায় অতিরিক্ত নোটিশ দেখানো হবে",
			helptip: "নোটিশ যেভাবে ব্যবহৃত হবে {{<a href='" + mw.util.wikiGetlink("Template:SharedIPAdvice") + "'>SharedIPAdvice</a>}}",
			type: "boolean"
		},

		// TwinkleConfig.watchWarnings (boolean)
		// if true, watch the page which has been dispatched an warning or notice, if false, default applies
		{
			name: "watchWarnings",
			label: "সতর্কীবার্তা পাঠানোর পর ব্যবহারকারী আলাপ পাতা নজরতালিকায় রাখুন",
			type: "boolean"
		},

		// TwinkleConfig.blankTalkpageOnIndefBlock (boolean)
		// if true, blank the talk page when issuing an indef block notice (per [[WP:UW#Indefinitely blocked users]])
		{
			name: "blankTalkpageOnIndefBlock",
			label: "অনির্দিষ্ট সময়ের জন্য ব্লক করা হলে আলাপ পাতা খালি করুন",
			helptip: "বিস্তারিত দেখুন এখানে <a href=\"" + mw.util.wikiGetlink("WP:UW#Indefinitely blocked users") + "\">WP:UW</a>",
			adminOnly: true,
			type: "boolean"
		}
	]
},

{
	title: "ব্যবহারকারী স্বাগতম",
	inFriendlyConfig: true,
	preferences: [
		{
			name: "topWelcomes",
			label: "ব্যবহারকারী আলাপ পাতার অন্যান্য তথ্যের উপরে স্বাগতম টেমপ্লেট যোগ করুন",
			type: "boolean"
		},
		{
			name: "watchWelcomes",
			label: "স্বাগতম জানানোর পর ব্যবহারকারী আলাপ পাতা নজরতালিকায় রাখুন",
			helptip: "নজরতালিকায় যুক্ত করার মধ্যমে আপনি নতুন এই ব্যবহারকারীর সাথে নিয়মিত যোগাযোগ করতে পারবেন এবং প্রয়োজনে থাকে বিভিন্ন বিষয়ে সহায়তা করতে পারবেন।",
			type: "boolean"
		},
		{
			name: "insertUsername",
			label: "টেমপ্লেটের সাথে আপনার ব্যবহারকারী নাম যুক্ত করা হবে (প্রযোজ্য স্থানে)",
			helptip: "বেশ কিছু স্বাগতম টেমপ্লেটের শুরুর অংশে লেখা থাকে, \"স্বাগতম, আমি &lt;ব্যবহারকারী নাম&gt;।\"। এই অপশনটি বন্ধ করা থাকলে ঐসকল টেমপ্লেট ব্যবহারের সময় আপনার ব্যবাহরকারীর নাম যুক্ত করা হবে না।",
			type: "boolean"
		},
		{
			name: "quickWelcomeMode",
			label: "পার্থক্য পাতার \"স্বাগতম\" লিংকে ক্লিক করা হলে",
			helptip: "সয়ংক্রিয়ভাবে নির্বাচন অপশনটি সক্রিয় থাকলে নিচের টেমপ্লেটটি ব্যবহৃত হবে।",
			type: "enum",
			enumValues: { auto: "সয়ংক্রিয় স্বাগতম", norm: "টেমপ্লেট নির্বাচনের সুযোগ থাকবে" }
		},
		{
			name: "quickWelcomeTemplate",
			label: "সয়ংক্রিয়ভাবে স্বাগত জানানোর সময় যে টেমপ্লেটটি ব্যবহৃত হবে",
			helptip: "স্বাগতম টেমপ্লেটের নাম লিখুন, বন্ধনী ব্যবহারের প্রয়োজন নেই। নির্ধারিত পাতার লিংকটিও যুক্ত হবে।",
			type: "string"
		},
		{
			name: "customWelcomeList",
			label: "বিশেষ স্বাগতম টেমপ্লেট",
			helptip: "আপনি অতিরিক্ত স্বাগতম টেমপ্লেট যুক্ত করতে পারেন, অথবা ব্যবহারকারী উপপাতা যেগুলো স্বাগতম টেমপ্লেট হিসাবে ব্যবহৃত হয়। এক্ষেত্রে \"ব্যবহারকারী:\") অংশটি উল্লেখ করতে হবে। মনে রাখবেন ব্যবহারকারী পাতায় এই টেমপ্লেটগুলো প্রতিস্থাপিত হবে।",
			type: "customList",
			customListValueTitle: "টেমপ্লেটের নাম (বন্ধনী বাদে লিখুন)",
			customListLabelTitle: "ট্যাগ উইন্ডোতে যা দেখানো হবে"
		}
	]
},

{
	title: "XFD (অপসারণ প্রস্তাবনা)",
	preferences: [
		// TwinkleConfig.xfdWatchPage (string)
		// The watchlist setting of the page being nominated for XfD. Either "yes" (add to watchlist), "no" (don't
		// add to watchlist), or "default" (use setting from preferences). Default is "default" (duh).
		{
			name: "xfdWatchPage",
			label: "মনোনয়নকৃত পাতা নজরতালিকায় রাখুন",
			type: "enum",
			enumValues: Twinkle.config.commonEnums.watchlist
		},

		// TwinkleConfig.xfdWatchDiscussion (string)
		// The watchlist setting of the newly created XfD page (for those processes that create discussion pages for each nomination),
		// or the list page for the other processes.
		// Either "yes" (add to watchlist), "no" (don't add to watchlist), or "default" (use setting from preferences). Default is "default" (duh).
		{
			name: "xfdWatchDiscussion",
			label: "অপসারণ আলোচনা পাতা নজরতালিকায় রাখুন",
			helptip: "এখানে অপসারণ আলোচনা বলতে AfD এবং MfD আলোচনা উপপাতা অথবা প্রতিদিনের TfD, CfD, RfD এবং FfD লগকে বুঝানো হচ্ছে",
			type: "enum",
			enumValues: Twinkle.config.commonEnums.watchlist
		},

		// TwinkleConfig.xfdWatchList (string)
		// The watchlist setting of the XfD list page, *if* the discussion is on a separate page. Either "yes" (add to watchlist), "no" (don't
		// add to watchlist), or "default" (use setting from preferences). Default is "no" (Hehe. Seriously though, who wants to watch it?
		// Sorry in advance for any false positives.).
		{
			name: "xfdWatchList",
			label: "প্রতিদিনের লগ পাতা নজরতালিকায় রাখুন",
			helptip: "এটি কেবলমাত্র AfD এবং MfD এর ক্ষেত্রে কার্যকর হবে, যেখানে লগ একটি আলাদা পাতায় সংরক্ষিত হয়।",
			type: "enum",
			enumValues: Twinkle.config.commonEnums.watchlist
		},

		// TwinkleConfig.xfdWatchUser (string)
		// The watchlist setting of the user if he receives a notification. Either "yes" (add to watchlist), "no" (don't
		// add to watchlist), or "default" (use setting from preferences). Default is "default" (duh).
		{
			name: "xfdWatchUser",
			label: "ব্যবহারকারী আলাপ পাতা নজরতালিকায় রাখুন",
			type: "enum",
			enumValues: Twinkle.config.commonEnums.watchlist
		}
	]
},

{
	title: "লুকানো",
	hidden: true,
	preferences: [
		// twinkle.header.js: portlet setup
		{
			name: "portletArea",
			type: "string"
		},
		{
			name: "portletId",
			type: "string"
		},
		{
			name: "portletName",
			type: "string"
		},
		{
			name: "portletType",
			type: "string"
		},
		{
			name: "portletNext",
			type: "string"
		},
		// twinklefluff.js: defines how many revision to query maximum, maximum possible is 50, default is 50
		{
			name: "revertMaxRevisions",
			type: "integer"
		},
		// twinklebatchdelete.js: How many pages should be processed at a time
		{
			name: "batchdeleteChunks",
			type: "integer"
		},
		// twinklebatchdelete.js: How many pages left in the process of being completed should allow a new batch to be initialized
		{
			name: "batchDeleteMinCutOff",
			type: "integer"
		},
		// twinklebatchdelete.js: How many pages should be processed maximum
		{
			name: "batchMax",
			type: "integer"
		},
		// twinklebatchprotect.js: How many pages should be processed at a time
		{
			name: "batchProtectChunks",
			type: "integer"
		},
		// twinklebatchprotect.js: How many pages left in the process of being completed should allow a new batch to be initialized
		{
			name: "batchProtectMinCutOff",
			type: "integer"
		},
		// twinklebatchundelete.js: How many pages should be processed at a time
		{
			name: "batchundeleteChunks",
			type: "integer"
		},
		// twinklebatchundelete.js: How many pages left in the process of being completed should allow a new batch to be initialized
		{
			name: "batchUndeleteMinCutOff",
			type: "integer"
		},
		// twinkledelimages.js: How many files should be processed at a time
		{
			name: "deliChunks",
			type: "integer"
		},
		// twinkledelimages.js: How many files should be processed maximum
		{
			name: "deliMax",
			type: "integer"
		},
		// twinkledeprod.js: How many pages should be processed at a time
		{
			name: "proddeleteChunks",
			type: "integer"
		}
	]
}

]; // end of Twinkle.config.sections

//{
//			name: "",
//			label: "",
//			type: ""
//		},


Twinkle.config.init = function twinkleconfigInit() {

	if ((mw.config.get("wgNamespaceNumber") === mw.config.get("wgNamespaceIds").project && mw.config.get("wgTitle") === "Twinkle/Preferences" ||
	    (mw.config.get("wgNamespaceNumber") === mw.config.get("wgNamespaceIds").user && mw.config.get("wgTitle").lastIndexOf("/Twinkle preferences") === (mw.config.get("wgTitle").length - 20))) &&
	    mw.config.get("wgAction") === "view") {
		// create the config page at Wikipedia:Twinkle/Preferences, and at user subpages (for testing purposes)

		if (!document.getElementById("twinkle-config")) {
			return;  // maybe the page is misconfigured, or something - but any attempt to modify it will be pointless
		}

		// set style (the url() CSS function doesn't seem to work from wikicode - ?!)
		document.getElementById("twinkle-config-titlebar").style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAkCAMAAAB%2FqqA%2BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEhQTFRFr73ZobTPusjdsMHZp7nVwtDhzNbnwM3fu8jdq7vUt8nbxtDkw9DhpbfSvMrfssPZqLvVztbno7bRrr7W1d%2Fs1N7qydXk0NjpkW7Q%2BgAAADVJREFUeNoMwgESQCAAAMGLkEIi%2FP%2BnbnbpdB59app5Vdg0sXAoMZCpGoFbK6ciuy6FX4ABAEyoAef0BXOXAAAAAElFTkSuQmCC)";

		var contentdiv = document.getElementById("twinkle-config-content");
		contentdiv.textContent = "";  // clear children

		// let user know about possible conflict with monobook.js/vector.js file
		// (settings in that file will still work, but they will be overwritten by twinkleoptions.js settings)
		var contentnotice = document.createElement("p");
		// I hate innerHTML, but this is one thing it *is* good for...
		contentnotice.innerHTML = "<b>Before modifying your preferences here,</b> make sure you have removed any old <code>TwinkleConfig</code> and <code>FriendlyConfig</code> settings from your <a href=\"" + mw.util.wikiGetlink("Special:MyPage/skin.js") + "\" title=\"Special:MyPage/skin.js\">user JavaScript file</a>.";
		contentdiv.appendChild(contentnotice);

		// look and see if the user does in fact have any old settings in their skin JS file
		var skinjs = new Morebits.wiki.page("User:" + mw.config.get("wgUserName") + "/" + mw.config.get("skin") + ".js");
		skinjs.setCallbackParameters(contentnotice);
		skinjs.load(Twinkle.config.legacyPrefsNotice);

		// start a table of contents
		var toctable = document.createElement("table");
		toctable.className = "toc";
		toctable.style.marginLeft = "0.4em";
		var toctr = document.createElement("tr");
		var toctd = document.createElement("td");
		// create TOC title
		var toctitle = document.createElement("div");
		toctitle.id = "toctitle";
		var toch2 = document.createElement("h2");
		toch2.textContent = "Contents ";
		toctitle.appendChild(toch2);
		// add TOC show/hide link
		var toctoggle = document.createElement("span");
		toctoggle.className = "toctoggle";
		toctoggle.appendChild(document.createTextNode("["));
		var toctogglelink = document.createElement("a");
		toctogglelink.className = "internal";
		toctogglelink.setAttribute("href", "#tw-tocshowhide");
		toctogglelink.textContent = "hide";
		toctoggle.appendChild(toctogglelink);
		toctoggle.appendChild(document.createTextNode("]"));
		toctitle.appendChild(toctoggle);
		toctd.appendChild(toctitle);
		// create item container: this is what we add stuff to
		var tocul = document.createElement("ul");
		toctogglelink.addEventListener("click", function twinkleconfigTocToggle() {
			var $tocul = $(tocul);
			$tocul.toggle();
			if ($tocul.find(":visible").length) {
				toctogglelink.textContent = "hide";
			} else {
				toctogglelink.textContent = "show";
			}
		}, false);
		toctd.appendChild(tocul);
		toctr.appendChild(toctd);
		toctable.appendChild(toctr);
		contentdiv.appendChild(toctable);

		var tocnumber = 1;

		var contentform = document.createElement("form");
		contentform.setAttribute("action", "javascript:void(0)");  // was #tw-save - changed to void(0) to work around Chrome issue
		contentform.addEventListener("submit", Twinkle.config.save, true);
		contentdiv.appendChild(contentform);

		var container = document.createElement("table");
		container.style.width = "100%";
		contentform.appendChild(container);

		$(Twinkle.config.sections).each(function(sectionkey, section) {
			if (section.hidden || (section.adminOnly && !Morebits.userIsInGroup("sysop"))) {
				return true;  // i.e. "continue" in this context
			}

			var configgetter;  // retrieve the live config values
			if (section.inFriendlyConfig) {
				configgetter = Twinkle.getFriendlyPref;
			} else {
				configgetter = Twinkle.getPref;
			}

			// add to TOC
			var tocli = document.createElement("li");
			tocli.className = "toclevel-1";
			var toca = document.createElement("a");
			toca.setAttribute("href", "#twinkle-config-section-" + tocnumber.toString());
			toca.appendChild(document.createTextNode(section.title));
			tocli.appendChild(toca);
			tocul.appendChild(tocli);

			var row = document.createElement("tr");
			var cell = document.createElement("td");
			cell.setAttribute("colspan", "3");
			var heading = document.createElement("h4");
			heading.style.borderBottom = "1px solid gray";
			heading.style.marginTop = "0.2em";
			heading.id = "twinkle-config-section-" + (tocnumber++).toString();
			heading.appendChild(document.createTextNode(section.title));
			cell.appendChild(heading);
			row.appendChild(cell);
			container.appendChild(row);

			var rowcount = 1;  // for row banding

			// add each of the preferences to the form
			$(section.preferences).each(function(prefkey, pref) {
				if (pref.adminOnly && !Morebits.userIsInGroup("sysop")) {
					return true;  // i.e. "continue" in this context
				}

				row = document.createElement("tr");
				row.style.marginBottom = "0.2em";
				// create odd row banding
				if (rowcount++ % 2 === 0) {
					row.style.backgroundColor = "rgba(128, 128, 128, 0.1)";
				}
				cell = document.createElement("td");

				var label, input;
				switch (pref.type) {

					case "boolean":  // create a checkbox
						cell.setAttribute("colspan", "2");

						label = document.createElement("label");
						input = document.createElement("input");
						input.setAttribute("type", "checkbox");
						input.setAttribute("id", pref.name);
						input.setAttribute("name", pref.name);
						if (configgetter(pref.name) === true) {
							input.setAttribute("checked", "checked");
						}
						label.appendChild(input);
						label.appendChild(document.createTextNode(" " + pref.label));
						cell.appendChild(label);
						break;

					case "string":  // create an input box
					case "integer":
						// add label to first column
						cell.style.textAlign = "right";
						cell.style.paddingRight = "0.5em";
						label = document.createElement("label");
						label.setAttribute("for", pref.name);
						label.appendChild(document.createTextNode(pref.label + ":"));
						cell.appendChild(label);
						row.appendChild(cell);

						// add input box to second column
						cell = document.createElement("td");
						cell.style.paddingRight = "1em";
						input = document.createElement("input");
						input.setAttribute("type", "text");
						input.setAttribute("id", pref.name);
						input.setAttribute("name", pref.name);
						if (pref.type === "integer") {
							input.setAttribute("size", 6);
							input.setAttribute("type", "number");
							input.setAttribute("step", "1");  // integers only
						}
						if (configgetter(pref.name)) {
							input.setAttribute("value", configgetter(pref.name));
						}
						cell.appendChild(input);
						break;

					case "enum":  // create a combo box
						// add label to first column
						// note: duplicates the code above, under string/integer
						cell.style.textAlign = "right";
						cell.style.paddingRight = "0.5em";
						label = document.createElement("label");
						label.setAttribute("for", pref.name);
						label.appendChild(document.createTextNode(pref.label + ":"));
						cell.appendChild(label);
						row.appendChild(cell);

						// add input box to second column
						cell = document.createElement("td");
						cell.style.paddingRight = "1em";
						input = document.createElement("select");
						input.setAttribute("id", pref.name);
						input.setAttribute("name", pref.name);
						$.each(pref.enumValues, function(enumvalue, enumdisplay) {
							var option = document.createElement("option");
							option.setAttribute("value", enumvalue);
							if (configgetter(pref.name) === enumvalue) {
								option.setAttribute("selected", "selected");
							}
							option.appendChild(document.createTextNode(enumdisplay));
							input.appendChild(option);
						});
						cell.appendChild(input);
						break;

					case "set":  // create a set of check boxes
						// add label first of all
						cell.setAttribute("colspan", "2");
						label = document.createElement("label");  // not really necessary to use a label element here, but we do it for consistency of styling
						label.appendChild(document.createTextNode(pref.label + ":"));
						cell.appendChild(label);

						var checkdiv = document.createElement("div");
						checkdiv.style.paddingLeft = "1em";
						var worker = function(itemkey, itemvalue) {
							var checklabel = document.createElement("label");
							checklabel.style.marginRight = "0.7em";
							checklabel.style.display = "inline-block";
							var check = document.createElement("input");
							check.setAttribute("type", "checkbox");
							check.setAttribute("id", pref.name + "_" + itemkey);
							check.setAttribute("name", pref.name + "_" + itemkey);
							if (configgetter(pref.name) && configgetter(pref.name).indexOf(itemkey) !== -1) {
								check.setAttribute("checked", "checked");
							}
							// cater for legacy integer array values for unlinkNamespaces (this can be removed a few years down the track...)
							if (pref.name === "unlinkNamespaces") {
								if (configgetter(pref.name) && configgetter(pref.name).indexOf(parseInt(itemkey, 10)) !== -1) {
									check.setAttribute("checked", "checked");
								}
							}
							checklabel.appendChild(check);
							checklabel.appendChild(document.createTextNode(itemvalue));
							checkdiv.appendChild(checklabel);
						};
						if (pref.setDisplayOrder) {
							// add check boxes according to the given display order
							$.each(pref.setDisplayOrder, function(itemkey, item) {
								worker(item, pref.setValues[item]);
							});
						} else {
							// add check boxes according to the order it gets fed to us (probably strict alphabetical)
							$.each(pref.setValues, worker);
						}
						cell.appendChild(checkdiv);
						break;

					case "customList":
						// add label to first column
						cell.style.textAlign = "right";
						cell.style.paddingRight = "0.5em";
						label = document.createElement("label");
						label.setAttribute("for", pref.name);
						label.appendChild(document.createTextNode(pref.label + ":"));
						cell.appendChild(label);
						row.appendChild(cell);

						// add button to second column
						cell = document.createElement("td");
						cell.style.paddingRight = "1em";
						var button = document.createElement("button");
						button.setAttribute("id", pref.name);
						button.setAttribute("name", pref.name);
						button.setAttribute("type", "button");
						button.addEventListener("click", Twinkle.config.listDialog.display, false);
						// use jQuery data on the button to store the current config value
						$(button).data({
							value: configgetter(pref.name),
							pref: pref,
							inFriendlyConfig: section.inFriendlyConfig
						});
						button.appendChild(document.createTextNode("সম্পাদনা করুন"));
						cell.appendChild(button);
						break;

					default:
						alert("twinkleconfig: unknown data type for preference " + pref.name);
						break;
				}
				row.appendChild(cell);

				// add help tip
				cell = document.createElement("td");
				cell.style.fontSize = "90%";

				cell.style.color = "gray";
				if (pref.helptip) {
					cell.innerHTML = pref.helptip;
				}
				// add reset link (custom lists don't need this, as their config value isn't displayed on the form)
				if (pref.type !== "customList") {
					var resetlink = document.createElement("a");
					resetlink.setAttribute("href", "#tw-reset");
					resetlink.setAttribute("id", "twinkle-config-reset-" + pref.name);
					resetlink.addEventListener("click", Twinkle.config.resetPrefLink, false);
					if (resetlink.style.styleFloat) {  // IE (inc. IE9)
						resetlink.style.styleFloat = "right";
					} else {  // standards
						resetlink.style.cssFloat = "right";
					}
					resetlink.style.margin = "0 0.6em";
					resetlink.appendChild(document.createTextNode("রিসেট"));
					cell.appendChild(resetlink);
				}
				row.appendChild(cell);

				container.appendChild(row);
				return true;
			});
			return true;
		});

		var footerbox = document.createElement("div");
		footerbox.setAttribute("id", "twinkle-config-buttonpane");
		footerbox.style.backgroundColor = "#BCCADF";
		footerbox.style.padding = "0.5em";
		var button = document.createElement("button");
		button.setAttribute("id", "twinkle-config-submit");
		button.setAttribute("type", "submit");
		button.appendChild(document.createTextNode("কার্যকর করুন"));
		footerbox.appendChild(button);
		var footerspan = document.createElement("span");
		footerspan.className = "plainlinks";
		footerspan.style.marginLeft = "2.4em";
		footerspan.style.fontSize = "90%";
		var footera = document.createElement("a");
		footera.setAttribute("href", "#tw-reset-all");
		footera.setAttribute("id", "twinkle-config-resetall");
		footera.addEventListener("click", Twinkle.config.resetAllPrefs, false);
		footera.appendChild(document.createTextNode("ডিফল্ট সেটিংস ব্যবহার"));
		footerspan.appendChild(footera);
		footerbox.appendChild(footerspan);
		contentform.appendChild(footerbox);

		// since all the section headers exist now, we can try going to the requested anchor
		if (location.hash) {
			location.hash = location.hash;
		}

	} else if (mw.config.get("wgNamespaceNumber") === mw.config.get("wgNamespaceIds").user) {

		var box = document.createElement("div");
		box.setAttribute("id", "twinkle-config-headerbox");
		box.style.border = "1px #f60 solid";
		box.style.background = "#fed";
		box.style.padding = "0.6em";
		box.style.margin = "0.5em auto";
		box.style.textAlign = "center";

		var link;
		if (mw.config.get("wgTitle") === mw.config.get("wgUserName") + "/twinkleoptions.js") {
			// place "why not try the preference panel" notice
			box.style.fontWeight = "bold";
			box.style.width = "80%";
			box.style.borderWidth = "2px";

			if (mw.config.get("wgArticleId") > 0) {  // page exists
				box.appendChild(document.createTextNode("এই পাতায় আপনার টুইংকলের পছন্দসমূহ দেখানো হচ্ছে। আপনি এটি পরিবর্তন করতে পারবেন "));
			} else {  // page does not exist
				box.appendChild(document.createTextNode("টুইংকলে আপনার পছন্দসমূহ নির্ধারণ করতে পারবেন "));
			}
			link = document.createElement("a");
			link.setAttribute("href", mw.util.wikiGetlink(mw.config.get("wgFormattedNamespaces")[mw.config.get("wgNamespaceIds").project] + ":Twinkle/Preferences") );
			link.appendChild(document.createTextNode("টুইংকল পছন্দসমূহ প্যানেল থেকে"));
			box.appendChild(link);
			box.appendChild(document.createTextNode(", অথবা এই পাতা সম্পাদনার মাধ্যমে।"));
			$(box).insertAfter($("#contentSub"));

		} else if (mw.config.get("wgTitle").indexOf(mw.config.get("wgUserName")) === 0 &&
				mw.config.get("wgPageName").lastIndexOf(".js") === mw.config.get("wgPageName").length - 3) {
			// place "Looking for Twinkle options?" notice
			box.style.width = "60%";

			box.appendChild(document.createTextNode("টুইংকলে আপনার পছন্দসমূহ পরিবর্তন করতে চান, তাহলে ব্যবহার করুন "));
			link = document.createElement("a");
			link.setAttribute("href", mw.util.wikiGetlink(mw.config.get("wgFormattedNamespaces")[mw.config.get("wgNamespaceIds").project] + ":Twinkle/Preferences") );
			link.appendChild(document.createTextNode("টুইংকল পছন্দসমূহ প্যানেল"));
			box.appendChild(link);
			box.appendChild(document.createTextNode("."));
			$(box).insertAfter($("#contentSub"));
		}
	}
};

// Morebits.wiki.page callback from init code
Twinkle.config.legacyPrefsNotice = function twinkleconfigLegacyPrefsNotice(pageobj) {
	var text = pageobj.getPageText();
	var contentnotice = pageobj.getCallbackParameters();
	if (text.indexOf("TwinkleConfig") !== -1 || text.indexOf("FriendlyConfig") !== -1) {
		contentnotice.innerHTML = '<table class="plainlinks ombox ombox-content"><tr><td class="mbox-image">' +
			'<img alt="" src="http://upload.wikimedia.org/wikipedia/en/3/38/Imbox_content.png" /></td>' +
			'<td class="mbox-text"><p><big><b>Before modifying your settings here,</b> you must remove your old Twinkle and Friendly settings from your personal skin JavaScript.</big></p>' +
			'<p>To do this, you can <a href="' + mw.config.get("wgScript") + '?title=User:' + encodeURIComponent(mw.config.get("wgUserName")) + '/' + mw.config.get("skin") + '.js&action=edit" target="_tab"><b>edit your personal JavaScript</b></a>, removing all lines of code that refer to <code>TwinkleConfig</code> and <code>FriendlyConfig</code>.</p>' +
			'</td></tr></table>';
	} else {
		$(contentnotice).remove();
	}
};

// custom list-related stuff

Twinkle.config.listDialog = {};

Twinkle.config.listDialog.addRow = function twinkleconfigListDialogAddRow(dlgtable, value, label) {
	var contenttr = document.createElement("tr");
	// "remove" button
	var contenttd = document.createElement("td");
	var removeButton = document.createElement("button");
	removeButton.setAttribute("type", "button");
	removeButton.addEventListener("click", function() { $(contenttr).remove(); }, false);
	removeButton.textContent = "অপসারণ";
	contenttd.appendChild(removeButton);
	contenttr.appendChild(contenttd);

	// value input box
	contenttd = document.createElement("td");
	var input = document.createElement("input");
	input.setAttribute("type", "text");
	input.className = "twinkle-config-customlist-value";
	input.style.width = "97%";
	if (value) {
		input.setAttribute("value", value);
	}
	contenttd.appendChild(input);
	contenttr.appendChild(contenttd);

	// label input box
	contenttd = document.createElement("td");
	input = document.createElement("input");
	input.setAttribute("type", "text");
	input.className = "twinkle-config-customlist-label";
	input.style.width = "98%";
	if (label) {
		input.setAttribute("value", label);
	}
	contenttd.appendChild(input);
	contenttr.appendChild(contenttd);

	dlgtable.appendChild(contenttr);
};

Twinkle.config.listDialog.display = function twinkleconfigListDialogDisplay(e) {
	var $prefbutton = $(e.target);
	var curvalue = $prefbutton.data("value");
	var curpref = $prefbutton.data("pref");

	var dialog = new Morebits.simpleWindow(720, 400);
	dialog.setTitle(curpref.label);
	dialog.setScriptName("টুইংকল পছন্দসমূহ");

	var dialogcontent = document.createElement("div");
	var dlgtable = document.createElement("table");
	dlgtable.className = "wikitable";
	dlgtable.style.margin = "1.4em 1em";
	dlgtable.style.width = "auto";

	var dlgtbody = document.createElement("tbody");

	// header row
	var dlgtr = document.createElement("tr");
	// top-left cell
	var dlgth = document.createElement("th");
	dlgth.style.width = "5%";
	dlgtr.appendChild(dlgth);
	// value column header
	dlgth = document.createElement("th");
	dlgth.style.width = "35%";
	dlgth.textContent = (curpref.customListValueTitle ? curpref.customListValueTitle : "মান");
	dlgtr.appendChild(dlgth);
	// label column header
	dlgth = document.createElement("th");
	dlgth.style.width = "60%";
	dlgth.textContent = (curpref.customListLabelTitle ? curpref.customListLabelTitle : "লেবেল");
	dlgtr.appendChild(dlgth);
	dlgtbody.appendChild(dlgtr);

	// content rows
	var gotRow = false;
	$.each(curvalue, function(k, v) {
		gotRow = true;
		Twinkle.config.listDialog.addRow(dlgtbody, v.value, v.label);
	});
	// if there are no values present, add a blank row to start the user off
	if (!gotRow) {
		Twinkle.config.listDialog.addRow(dlgtbody);
	}

	// final "add" button
	var dlgtfoot = document.createElement("tfoot");
	dlgtr = document.createElement("tr");
	var dlgtd = document.createElement("td");
	dlgtd.setAttribute("colspan", "3");
	var addButton = document.createElement("button");
	addButton.style.minWidth = "8em";
	addButton.setAttribute("type", "button");
	addButton.addEventListener("click", function(e) {
		Twinkle.config.listDialog.addRow(dlgtbody);
	}, false);
	addButton.textContent = "সংযোজন";
	dlgtd.appendChild(addButton);
	dlgtr.appendChild(dlgtd);
	dlgtfoot.appendChild(dlgtr);

	dlgtable.appendChild(dlgtbody);
	dlgtable.appendChild(dlgtfoot);
	dialogcontent.appendChild(dlgtable);

	// buttonpane buttons: [Save changes] [Reset] [Cancel]
	var button = document.createElement("button");
	button.setAttribute("type", "submit");  // so Morebits.simpleWindow puts the button in the button pane
	button.addEventListener("click", function(e) {
		Twinkle.config.listDialog.save($prefbutton, dlgtbody);
		dialog.close();
	}, false);
	button.textContent = "পরিবর্তন সংরক্ষন";
	dialogcontent.appendChild(button);
	button = document.createElement("button");
	button.setAttribute("type", "submit");  // so Morebits.simpleWindow puts the button in the button pane
	button.addEventListener("click", function(e) {
		Twinkle.config.listDialog.reset($prefbutton, dlgtbody);
	}, false);
	button.textContent = "রিসেট";
	dialogcontent.appendChild(button);
	button = document.createElement("button");
	button.setAttribute("type", "submit");  // so Morebits.simpleWindow puts the button in the button pane
	button.addEventListener("click", function(e) {
		dialog.close();  // the event parameter on this function seems to be broken
	}, false);
	button.textContent = "বাতিল";
	dialogcontent.appendChild(button);

	dialog.setContent(dialogcontent);
	dialog.display();
};

// Resets the data value, re-populates based on the new (default) value, then saves the
// old data value again (less surprising behaviour)
Twinkle.config.listDialog.reset = function twinkleconfigListDialogReset(button, tbody) {
	// reset value on button
	var $button = $(button);
	var curpref = $button.data("pref");
	var oldvalue = $button.data("value");
	Twinkle.config.resetPref(curpref, $button.data("inFriendlyConfig"));

	// reset form
	var $tbody = $(tbody);
	$tbody.find("tr").slice(1).remove();  // all rows except the first (header) row
	// add the new values
	var curvalue = $button.data("value");
	$.each(curvalue, function(k, v) {
		Twinkle.config.listDialog.addRow(tbody, v.value, v.label);
	});

	// save the old value
	$button.data("value", oldvalue);
};

Twinkle.config.listDialog.save = function twinkleconfigListDialogSave(button, tbody) {
	var result = [];
	var current = {};
	$(tbody).find('input[type="text"]').each(function(inputkey, input) {
		if ($(input).hasClass("twinkle-config-customlist-value")) {
			current = { value: input.value };
		} else {
			current.label = input.value;
			// exclude totally empty rows
			if (current.value || current.label) {
				result.push(current);
			}
		}
	});
	$(button).data("value", result);
};

// reset/restore defaults

Twinkle.config.resetPrefLink = function twinkleconfigResetPrefLink(e) {
	var wantedpref = e.target.id.substring(21); // "twinkle-config-reset-" prefix is stripped

	// search tactics
	$(Twinkle.config.sections).each(function(sectionkey, section) {
		if (section.hidden || (section.adminOnly && !Morebits.userIsInGroup("sysop"))) {
			return true;  // continue: skip impossibilities
		}

		var foundit = false;

		$(section.preferences).each(function(prefkey, pref) {
			if (pref.name !== wantedpref) {
				return true;  // continue
			}
			Twinkle.config.resetPref(pref, section.inFriendlyConfig);
			foundit = true;
			return false;  // break
		});

		if (foundit) {
			return false;  // break
		}
	});
	return false;  // stop link from scrolling page
};

Twinkle.config.resetPref = function twinkleconfigResetPref(pref, inFriendlyConfig) {
	switch (pref.type) {

		case "boolean":
			document.getElementById(pref.name).checked = (inFriendlyConfig ?
				Twinkle.defaultConfig.friendly[pref.name] : Twinkle.defaultConfig.twinkle[pref.name]);
			break;

		case "string":
		case "integer":
		case "enum":
			document.getElementById(pref.name).value = (inFriendlyConfig ?
				Twinkle.defaultConfig.friendly[pref.name] : Twinkle.defaultConfig.twinkle[pref.name]);
			break;

		case "set":
			$.each(pref.setValues, function(itemkey, itemvalue) {
				if (document.getElementById(pref.name + "_" + itemkey)) {
					document.getElementById(pref.name + "_" + itemkey).checked = ((inFriendlyConfig ?
						Twinkle.defaultConfig.friendly[pref.name] : Twinkle.defaultConfig.twinkle[pref.name]).indexOf(itemkey) !== -1);
				}
			});
			break;

		case "customList":
			$(document.getElementById(pref.name)).data("value", (inFriendlyConfig ?
				Twinkle.defaultConfig.friendly[pref.name] : Twinkle.defaultConfig.twinkle[pref.name]));
			break;

		default:
			alert("twinkleconfig: unknown data type for preference " + pref.name);
			break;
	}
};

Twinkle.config.resetAllPrefs = function twinkleconfigResetAllPrefs() {
	// no confirmation message - the user can just refresh/close the page to abort
	$(Twinkle.config.sections).each(function(sectionkey, section) {
		if (section.hidden || (section.adminOnly && !Morebits.userIsInGroup("sysop"))) {
			return true;  // continue: skip impossibilities
		}
		$(section.preferences).each(function(prefkey, pref) {
			if (!pref.adminOnly || Morebits.userIsInGroup("sysop")) {
				Twinkle.config.resetPref(pref, section.inFriendlyConfig);
			}
		});
		return true;
	});
	return false;  // stop link from scrolling page
};

Twinkle.config.save = function twinkleconfigSave(e) {
	Morebits.status.init( document.getElementById("twinkle-config-content") );

	Morebits.wiki.actionCompleted.notice = "সংরক্ষণ";

	var userjs = mw.config.get("wgFormattedNamespaces")[mw.config.get("wgNamespaceIds").user] + ":" + mw.config.get("wgUserName") + "/twinkleoptions.js";
	var wikipedia_page = new Morebits.wiki.page(userjs, userjs + " পাতায় পছন্দসমূহ সংরক্ষন করা হচ্ছে ");
	wikipedia_page.setCallbackParameters(e.target);
	wikipedia_page.load(Twinkle.config.writePrefs);

	return false;
};

// The JSON stringify method in the following code was excerpted from
// http://www.JSON.org/json2.js
// version of 2011-02-23

// Douglas Crockford, the code's author, has released it into the Public Domain.
// See http://www.JSON.org/js.html

var JSON;
if (!JSON) {
	JSON = {};
}

(function() {
	var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		gap,
		indent = '  ',  // hardcoded indent
		meta = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\' };

	function quote(string) {
		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
			var c = meta[a];
			return typeof c === 'string' ? c :	'\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		}) + '"' : '"' + string + '"';
	}

	function str(key, holder) {
		var i, k, v, length, mind = gap, partial, value = holder[key];

		if (value && typeof value === 'object' && $.isFunction(value.toJSON)) {
			value = value.toJSON(key);
		}

		switch (typeof value) {
		case 'string':
			return quote(value);
		case 'number':
			return isFinite(value) ? String(value) : 'null';
		case 'boolean':
		case 'null':
			return String(value);
		case 'object':
			if (!value) {
				return 'null';
			}
			gap += indent;
			partial = [];
			if ($.isArray(value)) {
				length = value.length;
				for (i = 0; i < length; ++i) {
					partial[i] = str(i, value) || 'null';
				}
				v = partial.length === 0 ? '[]' : gap ?
					'[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
					'[' + partial.join(',') + ']';
				gap = mind;
				return v;
			}
			for (k in value) {
				if (Object.prototype.hasOwnProperty.call(value, k)) {
					v = str(k, value);
					if (v) {
						partial.push(quote(k) + (gap ? ': ' : ':') + v);
					}
				}
			}
			v = partial.length === 0 ? '{}' : gap ?
				'{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
				'{' + partial.join(',') + '}';
			gap = mind;
			return v;
		default:
			throw new Error( "JSON.stringify: unknown data type" );
		}
	}

	if (!$.isFunction(JSON.stringify)) {
		JSON.stringify = function (value, ignoredParam1, ignoredParam2) {
			ignoredParam1 = ignoredParam2;  // boredom
			gap = '';
			return str('', {'': value});
		};
	}
}());

Twinkle.config.writePrefs = function twinkleconfigWritePrefs(pageobj) {
	var form = pageobj.getCallbackParameters();
	var statelem = pageobj.getStatusElement();

	// this is the object which gets serialized into JSON
	var newConfig = {
		twinkle: {},
		friendly: {}
	};

	// keeping track of all preferences that we encounter
	// any others that are set in the user's current config are kept
	// this way, preferences that this script doesn't know about are not lost
	// (it does mean obsolete prefs will never go away, but... ah well...)
	var foundTwinklePrefs = [], foundFriendlyPrefs = [];

	// a comparison function is needed later on
	// it is just enough for our purposes (i.e. comparing strings, numbers, booleans,
	// arrays of strings, and arrays of { value, label })
	// and it is not very robust: e.g. compare([2], ["2"]) === true, and
	// compare({}, {}) === false, but it's good enough for our purposes here
	var compare = function(a, b) {
		if ($.isArray(a)) {
			if (a.length !== b.length) {
				return false;
			}
			var asort = a.sort(), bsort = b.sort();
			for (var i = 0; asort[i]; ++i) {
				// comparison of the two properties of custom lists
				if ((typeof asort[i] === "object") && (asort[i].label !== bsort[i].label ||
					asort[i].value !== bsort[i].value)) {
					return false;
				} else if (asort[i].toString() !== bsort[i].toString()) { 
					return false;
				}
			}
			return true;
		} else {
			return a === b;
		}
	};

	$(Twinkle.config.sections).each(function(sectionkey, section) {
		if (section.adminOnly && !Morebits.userIsInGroup("sysop")) {
			return;  // i.e. "continue" in this context
		}

		// reach each of the preferences from the form
		$(section.preferences).each(function(prefkey, pref) {
			var userValue;  // = undefined

			// only read form values for those prefs that have them
			if (!section.hidden && (!pref.adminOnly || Morebits.userIsInGroup("sysop"))) {
				switch (pref.type) {

					case "boolean":  // read from the checkbox
						userValue = form[pref.name].checked;
						break;

					case "string":  // read from the input box or combo box
					case "enum":
						userValue = form[pref.name].value;
						break;

					case "integer":  // read from the input box
						userValue = parseInt(form[pref.name].value, 10);
						if (isNaN(userValue)) {
							Morebits.status.warn("সংরক্ষিত হচ্ছে", "আপনার নির্ধারিত মান " + pref.name + " (" + pref.value + ") সঠিক নয়। ভুল মানটি ছাড়া অন্যান্য অংশগুলো সংরক্ষিত হবে।");
							userValue = null;
						}
						break;

					case "set":  // read from the set of check boxes
						userValue = [];
						if (pref.setDisplayOrder) {
							// read only those keys specified in the display order
							$.each(pref.setDisplayOrder, function(itemkey, item) {
								if (form[pref.name + "_" + item].checked) {
									userValue.push(item);
								}
							});
						} else {
							// read all the keys in the list of values
							$.each(pref.setValues, function(itemkey, itemvalue) {
								if (form[pref.name + "_" + itemkey].checked) {
									userValue.push(itemkey);
								}
							});
						}
						break;

					case "customList":  // read from the jQuery data stored on the button object
						userValue = $(form[pref.name]).data("value");
						break;

					default:
						alert("twinkleconfig: unknown data type for preference " + pref.name);
						break;
				}
			}

			// only save those preferences that are *different* from the default
			if (section.inFriendlyConfig) {
				if (userValue !== undefined && !compare(userValue, Twinkle.defaultConfig.friendly[pref.name])) {
					newConfig.friendly[pref.name] = userValue;
				}
				foundFriendlyPrefs.push(pref.name);
			} else {
				if (userValue !== undefined && !compare(userValue, Twinkle.defaultConfig.twinkle[pref.name])) {
					newConfig.twinkle[pref.name] = userValue;
				}
				foundTwinklePrefs.push(pref.name);
			}
		});
	});

	if (Twinkle.prefs) {
		$.each(Twinkle.prefs.twinkle, function(tkey, tvalue) {
			if (foundTwinklePrefs.indexOf(tkey) === -1) {
				newConfig.twinkle[tkey] = tvalue;
			}
		});
		$.each(Twinkle.prefs.friendly, function(fkey, fvalue) {
			if (foundFriendlyPrefs.indexOf(fkey) === -1) {
				newConfig.friendly[fkey] = fvalue;
			}
		});
	}

	var text =
		"// twinkleoptions.js: personal Twinkle preferences file\n" +
		"//\n" +
		"// খেয়াল করুন: টুইংকলের পছন্দসমূহ পরিবর্তনের সব থেকে সহজ পদ্ধতি হল\n" +
		"// টুইংকল পছন্দসমূহ প্যানেল ব্যবহার করা:[[" + mw.config.get("wgPageName") + "]].\n" +
		"//\n" +
		"// এই ফাইলটি সয়ংক্রিয়ভাবে তৈরী করা হয়েছে। Any changes you make (aside from\n" +
		"// changing the configuration parameters in a valid-JavaScript way) will be\n" +
		"// overwritten the next time you click \"save\" in the Twinkle preferences\n" +
		"// panel.  If modifying this file, make sure to use correct JavaScript.\n" +
		"\n" +
		"window.Twinkle.prefs = ";
	text += JSON.stringify(newConfig, null, 2);
	text +=
		";\n" +
		"\n" +
		"// End of twinkleoptions.js\n";

	pageobj.setPageText(text);
	pageobj.setEditSummary("টুইংকল পছন্দসমূহ সংরক্ষিত হচ্ছে: [[" + mw.config.get("wgPageName") + "]] থেকে সংস্ক্রিয় সম্পাদনা ([[WP:TW|TW]])");
	pageobj.setCreateOption("recreate");
	pageobj.save(Twinkle.config.saveSuccess);
};

Twinkle.config.saveSuccess = function twinkleconfigSaveSuccess(pageobj) {
	pageobj.getStatusElement().info("সম্পন্ন");

	var noticebox = document.createElement("div");
	noticebox.className = "successbox";
	noticebox.style.fontSize = "100%";
	noticebox.style.marginTop = "2em";
	noticebox.innerHTML = "<p><b>আপনার টুইংকলের পছন্দসমূহ সংরক্ষন করা হয়েছে।</b></p><p>পরিবর্তনগুলো কার্যকর করার জন্য আপনার ব্রাউজারের ক্যাশ পরিষ্কার করাতে হবে</b> (বিস্তারিত দেখুন এখানে <a href=\"" + mw.util.wikiGetlink("WP:BYPASS") + "\" title=\"WP:BYPASS\">WP:BYPASS</a>)।</p>";
	Morebits.status.root.appendChild(noticebox);
	var noticeclear = document.createElement("br");
	noticeclear.style.clear = "both";
	Morebits.status.root.appendChild(noticeclear);
};
