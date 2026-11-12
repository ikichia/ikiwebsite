export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export const categories = ["residential", "room-rental", "commercial", "industrial", "land", "new-projects"] as const;
export type Category = (typeof categories)[number];

export const whatsappUrl = "https://wa.me/message/PZMUBCIW7OBUM1";
export const facebookUrl = "https://www.facebook.com/JBPROPERTY.IKI";
export const nextsixProfileUrl = "https://nextsix.com/agent/iki-chia/6ab0fdc168250306f89e9862";

// WhatsApp click-to-chat needs a phone number to carry a custom message.
export function whatsappDraft(message: string) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "60166630217";
  return `https://wa.me/${/^\d{8,15}$/.test(phone) ? phone : "60166630217"}?text=${encodeURIComponent(message)}`;
}

export const copy = {
  en: {
    home: "Home", properties: "Properties", guides: "Area Guides", about: "About Iki", contactNav: "Contact",
    contact: "Chat on WhatsApp", facebook: "Facebook Page", location: "Johor · Malaysia", skip: "Skip to content",
    heroFirst: "Find Your Place", heroSecond: "in Johor.", intro: "Buy, Sell & Rent Properties with Iki Chia.",
    buyProperty: "Buy Property", rentProperty: "Rent Property", list: "List Your Property",
    buy: "Buy", rent: "Rent", sale: "Sale", deal: "Buy / Rent", either: "Any transaction",
    category: "Property Type", all: "All property types", area: "Location", areaHint: "e.g. Kulai",
    budget: "Maximum Budget (RM)", budgetHint: "Sale price or monthly rent", submit: "Search Properties", filter: "Apply Filters",
    categories: { residential: "Residential", "room-rental": "Room Rental", commercial: "Commercial", industrial: "Industrial", land: "Land", "new-projects": "New Projects" },
    categoryTitle: "Explore by Property Type", featured: "Featured Properties", viewAll: "View All Properties",
    emptyFeatured: "There are no featured properties published yet.", empty: "There are no published properties yet.",
    emptyFiltered: "No published properties match these filters.", results: "Matching properties", reset: "Clear Filters",
    listingIntro: "Browse published listings in Johor and narrow your search by location, property type and budget.",
    monthly: "/ month", bedrooms: "Bedrooms", bathrooms: "Bathrooms", enquire: "Enquire on WhatsApp",
    aboutTitle: "A local perspective. A personal approach.",
    aboutText: "I’m Iki Chia. I help you buy, sell or rent property in Johor. If you’re an owner, I can also help you prepare your property for listing.",
    aboutAreas: "I cover Johor Bahru, Kulai, Skudai, Sutera Utama, Iskandar Puteri and other parts of Johor.",
    guidesTitle: "Get to know Johor", guidesIntro: "Explore five areas and find out what to look for before you book a viewing.",
    guideListings: "Browse properties here", allGuides: "View Area Guides",
    ownerTitle: "Thinking of selling or renting out?", ownerText: "Tell me a little about your property. The form opens a WhatsApp draft for you to review and send.",
    name: "Name", phone: "Contact Number", propertyLocation: "Property Location", transaction: "Sale / Rent",
    message: "Message", optional: "Optional", choose: "Select an option", send: "Continue to WhatsApp",
    contactTitle: "Talk property with Iki", contactText: "Have a question about buying, selling or renting in Johor? Get in touch.",
    photoAlt: "Portrait of Iki Chia",
  },
  zh: {
    home: "首页", properties: "公开房源", guides: "地区指南", about: "关于 Iki", contactNav: "联系",
    contact: "WhatsApp 联系", facebook: "Facebook 专页", location: "柔佛 · 马来西亚", skip: "跳到主要内容",
    heroFirst: "在柔佛，", heroSecond: "找到理想房产。", intro: "和 Iki Chia 一起在柔佛买房、卖房和租房。",
    buyProperty: "买房", rentProperty: "租房", list: "业主委托",
    buy: "买房", rent: "租房", sale: "出售", deal: "交易类型", either: "所有交易类型",
    category: "物业类型", all: "所有物业类型", area: "地区", areaHint: "例如：古来",
    budget: "最高预算（RM）", budgetHint: "售价或月租", submit: "搜索房源", filter: "应用筛选",
    categories: { residential: "住宅", "room-rental": "房间出租", commercial: "店屋／商业产业", industrial: "工厂", land: "地皮", "new-projects": "新楼盘" },
    categoryTitle: "按物业类型浏览", featured: "精选房源", viewAll: "查看全部房源",
    emptyFeatured: "目前暂无已发布的精选房源。", empty: "目前暂无已发布的房源。",
    emptyFiltered: "没有符合筛选条件的已发布房源。", results: "符合条件的房源", reset: "清除筛选",
    listingIntro: "浏览已发布的柔佛房源，可按地区、物业类型和预算缩小范围。",
    monthly: "/ 月", bedrooms: "房间", bathrooms: "浴室", enquire: "WhatsApp 咨询",
    aboutTitle: "熟悉柔佛，也重视你的需求。",
    aboutText: "我是 Iki Chia，提供柔佛房地产买卖和出租服务，也协助业主准备房源资料。",
    aboutAreas: "服务范围包括新山、古来、士姑来、Sutera Utama、依斯干达公主城及柔佛其他地区。",
    guidesTitle: "了解柔佛各区", guidesIntro: "认识五个地区，看看预约看房前可以先了解哪些事项。",
    guideListings: "浏览此地区房源", allGuides: "查看地区指南",
    ownerTitle: "想出售或出租你的产业？", ownerText: "告诉我产业的基本情况。填写后会打开 WhatsApp 草稿，由你确认并发送。",
    name: "姓名", phone: "联络号码", propertyLocation: "物业所在地", transaction: "出售／出租",
    message: "留言", optional: "选填", choose: "请选择", send: "前往 WhatsApp",
    contactTitle: "和 Iki 聊聊房地产", contactText: "有关于柔佛买房、卖房或租房的问题？欢迎联系我。",
    photoAlt: "Iki Chia 的个人照片",
  },
} satisfies Record<Locale, object>;
