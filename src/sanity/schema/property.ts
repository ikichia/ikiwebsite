import { defineArrayMember, defineField, defineType } from "sanity";

const categories = ["residential", "commercial", "industrial", "land"];
const subtypes = ["room", "house", "condominium", "apartment", "shoplot", "office", "factory", "warehouse", "land", "other"];
const options = (values: string[]) => values.map(value => ({ title: value.replaceAll("-", " "), value }));

export const property = defineType({
  name: "property", initialValue: () => ({ referenceId: `IKI-${crypto.randomUUID()}`, currency: "MYR", showOnWebsite: false, publicApproved: false }), title: "Properties / 房源", type: "document",
  groups: [
    { name: "basic", title: "Basic information / 基本资料", default: true },
    { name: "details", title: "Specifications / 规格" },
    { name: "photos", title: "Photos / 照片" },
    { name: "management", title: "Management / 管理" },
  ],
  fields: [
    defineField({ name: "currency", title: "Currency / 币种", type: "string", group: "basic", readOnly: true, initialValue: "MYR", validation: r => r.required().custom(value => value === "MYR" ? true : "Currency must be MYR") }),
    defineField({ name: "state", title: "State / 州属", type: "string", group: "basic", validation: r => r.required().max(80) }),
    defineField({ name: "newProject", title: "New Project / 新楼盘", type: "boolean", group: "basic", initialValue: false }),
    defineField({ name: "showOnWebsite", title: "Show on Website / 在网站展示", type: "boolean", group: "management", initialValue: false }),
    defineField({ name: "lastVerifiedDate", title: "Last Verified Date / 最后核实日期", type: "date", group: "management", validation: r => r.required().custom(value => !value || value <= new Date().toISOString().slice(0,10) ? true : "Cannot be a future date / 不能填写未来日期") }),

    defineField({ name: "title", title: "English title / 英文房源标题", type: "string", group: "basic", validation: r => r.required().max(160) }),
    defineField({ name: "titleZh", title: "Chinese title / 中文标题（选填）", type: "string", group: "basic", validation: r => r.max(160) }),
    defineField({ name: "referenceId", title: "Public Property ID / 公开房源编号", type: "string", group: "basic", readOnly: ({document}) => !!document?._createdAt && !!document?.referenceId, description: "Auto-generated opaque ID; never change or encode an address. Use a non-confidential reference suitable for customer enquiries. Do not encode owner or unit details. / 请勿包含业主或单位资料。", validation: r => r.required().max(60).regex(/^[A-Za-z0-9_-]+$/, { name: "letters, numbers, hyphens or underscores" }) }),
    defineField({ name: "slug", title: "Future page URL / 未来详情页网址", type: "slug", group: "basic", options: { source: "referenceId", maxLength: 96 }, validation: r => r.required(), description: "Generate once and keep stable. Phase 1 does not create a public page. Never encode unit numbers." }),
    defineField({ name: "transactionType", title: "Sale / Rent · 出售／出租", type: "string", group: "basic", options: { list: [{ title: "Sale / 出售", value: "sale" }, { title: "Rent / 出租", value: "rent" }], layout: "radio" }, validation: r => r.required() }),
    defineField({ name: "category", title: "Property category / 物业类别", type: "string", group: "basic", options: { list: options(categories) }, validation: r => r.required() }),
    defineField({ name: "subtype", title: "Property subtype / 物业细类", type: "string", group: "basic", options: { list: options(subtypes) }, validation: r => r.required(), description: "Rent works with every category and subtype. / 出租适用于所有类别。" }),
    defineField({ name: "project", title: "Project / Taman · 项目／花园", type: "string", group: "basic", validation: r => r.max(120) }),
    defineField({ name: "area", title: "General area / 大概地区", type: "string", group: "basic", description: "Marketing location only. No full address, lot or unit number. / 不填写完整地址、地段或单位号码。", validation: r => r.required().max(120) }),
    defineField({ name: "askingPrice", title: "Asking price (RM) / 售价或月租", type: "number", group: "basic", validation: r => r.required().positive().precision(2) }),
    defineField({ name: "description", title: "English public description / 英文公开介绍", type: "text", group: "basic", rows: 6, description: "Public marketing text only. Never enter private owner details or negotiation notes.", validation: r => r.required().max(10000) }),
    defineField({ name: "descriptionZh", title: "Chinese description / 中文介绍（选填）", type: "text", group: "basic", rows: 6, validation: r => r.max(10000) }),
    defineField({ name: "features", title: "Features / 特色", type: "array", group: "basic", of: [defineArrayMember({ type: "string", validation: r => r.max(200) })], validation: r => r.max(40) }),
    ...[ ["bedrooms", "Bedrooms / 房间"], ["bathrooms", "Bathrooms / 浴室"] ].map(([name, title]) => defineField({ name, title, type: "number", group: "details", validation: r => r.integer().min(0), description: "Optional; leave blank when not applicable. / 不适用时留空。" })),
    defineField({ name: "builtUpSqft", title: "Built-up (sqft) / 建筑面积", type: "number", group: "details", validation: r => r.positive() }),
    defineField({ name: "landSize", title: "Land size / 土地面积", type: "object", group: "details", fields: [
      defineField({ name: "value", title: "Size / 面积", type: "number", validation: r => r.positive() }),
      defineField({ name: "unit", title: "Unit / 单位", type: "string", options: { list: ["sqft", "sqm", "acre", "hectare"] } }),
    ], validation: r => r.custom(value => !value || (!!value.value && !!value.unit) ? true : "Enter both size and unit / 请填写面积和单位") }),
    defineField({ name: "tenure", title: "Land tenure / 地契", type: "string", group: "details", options: { list: [{ title: "Freehold / 永久地契", value: "freehold" }, { title: "Leasehold / 租赁地契", value: "leasehold" }] } }),
    defineField({ name: "furnishing", title: "Furnishing / 家具", type: "string", group: "details", options: { list: [{ title: "Fully furnished / 全家具", value: "fully" }, { title: "Partially furnished / 部分家具", value: "partially" }, { title: "Unfurnished / 无家具", value: "unfurnished" }] } }),
    defineField({ name: "condition", title: "Condition / 屋况", type: "string", group: "details", validation: r => r.max(200) }),
    defineField({ name: "photos", title: "Photos / 照片", type: "array", group: "photos", description: "The FIRST photo is the cover. Drag to reorder; use each photo menu to remove it. Upload marketing photos only; assets are not confidential. / 第一张为封面，拖动排序。", of: [defineArrayMember({ type: "image", options: { hotspot: true }, fields: [
      defineField({ name: "alt", title: "Image description / 图片描述", type: "string", validation: r => r.max(250) }),
    ], validation: r => r.required().assetRequired() })], validation: r => r.required().min(1).max(30) }),
    defineField({ name: "status", title: "Listing status / 房源状态", type: "string", group: "management", options: { list: [{ title: "Available / 可售可租", value: "available" }, { title: "Reserved / 已预订", value: "reserved" }, { title: "Sold / 已售", value: "sold" }, { title: "Rented / 已出租", value: "rented" }] }, validation: r => r.required() }),
    defineField({ name: "featured", title: "Featured property / 精选房源", type: "boolean", group: "management", initialValue: false }),
    defineField({ name: "publicApproved", title: "Approved marketing information / 已确认可公开", type: "boolean", group: "management", initialValue: false, description: "Check before Publish. Published testing documents can be queried directly regardless of website visibility. / 发布测试资料也属于公开资料。", validation: r => r.custom(value => value === true ? true : "Confirm all text and photos are safe to publish / 请先确认所有资料和照片可公开") }),
  ],
  // Sanity maintains _createdAt and _updatedAt; do not add editable duplicate timestamps.
  preview: { select: { title: "title", reference: "referenceId", status: "status", media: "photos.0" }, prepare: ({ title, reference, status, media }) => ({ title, subtitle: [reference, status].filter(Boolean).join(" · "), media }) },
  orderings: [{ title: "Recently updated / 最近更新", name: "updated", by: [{ field: "_updatedAt", direction: "desc" }] }],
});
