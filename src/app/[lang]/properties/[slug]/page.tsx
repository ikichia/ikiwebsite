import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LanguageSwitch } from "@/components/site";
import { listPublicProperties } from "@/lib/properties";
import { copy, isLocale, whatsappUrl } from "@/lib/site";
import { marketingImageUrl } from "@/sanity/images";
import { studioDataset, studioProjectId } from "@/sanity/settings";

export default async function PropertyDetails({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) notFound();

  const property = (await listPublicProperties()).find(item => item.slug === slug);
  if (!property) notFound();

  const t = copy[lang];
  const zh = lang === "zh";
  const number = new Intl.NumberFormat(lang === "zh" ? "zh-MY" : "en-MY");
  const specifications = [
    [t.bedrooms, property.bedrooms],
    [t.bathrooms, property.bathrooms],
    [zh ? "建筑面积" : "Built-up", property.areaSqft && `${number.format(property.areaSqft)} sqft`],
    [zh ? "土地面积" : "Land area", property.landSize && `${number.format(property.landSize.value)} ${property.landSize.unit}`],
    [zh ? "地契" : "Tenure", property.tenure && ({ freehold: zh ? "永久地契" : "Freehold", leasehold: zh ? "租赁地契" : "Leasehold" })[property.tenure]],
    [zh ? "家具" : "Furnishing", property.furnishing && ({ fully: zh ? "全家具" : "Fully furnished", partially: zh ? "部分家具" : "Partially furnished", unfurnished: zh ? "无家具" : "Unfurnished" })[property.furnishing]],
  ];

  return (
    <main id="main">
      <section className="listing-hero">
        <div className="shell">
          <div className="utility">
            <p className="eyebrow"><span />{property.area[lang]}</p>
            <LanguageSwitch lang={lang} path={`/properties/${slug}`} />
          </div>
          <Link className="text-link" href={`/${lang}/properties`}>← {t.properties}</Link>
          <h1>{property.title[lang]}</h1>
          <p>{property.propertyType[lang]} · {property.deal === "rent" ? t.rent : t.sale}</p>
          <p className="price">RM {number.format(property.price)} {property.deal === "rent" && <small>{t.monthly}</small>}</p>
          <a className="button" href={whatsappUrl}>{t.enquire}</a>
        </div>
      </section>
      <section className="shell section" aria-label={zh ? "房源资料" : "Property details"}>
        <dl>
          {specifications.filter(([, value]) => value != null && value !== "").map(([label, value]) =>
            <div key={label}><dt>{label}</dt><dd>{value}</dd></div>,
          )}
        </dl>
        <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{property.description[lang]}</p>
      </section>
      <section className="shell section property-grid" aria-label={zh ? "房源照片" : "Property photos"}>
        {property.photos.map((photo, index) => {
          const [, width, height] = /-(\d+)x(\d+)-/.exec(photo.asset._ref) ?? [];
          return (
            <Image
              key={`${photo.asset._ref}-${index}`}
              src={marketingImageUrl({ asset: photo.asset }, studioProjectId, studioDataset, 1200)}
              alt={photo.alt || `${property.title[lang]} (${index + 1})`}
              width={Number(width)}
              height={Number(height)}
              sizes="(max-width: 640px) 95vw, (max-width: 960px) 48vw, 370px"
              style={{ width: "100%", height: "auto" }}
            />
          );
        })}
      </section>
    </main>
  );
}
