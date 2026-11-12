import { nextsixProfileUrl, type Locale } from "@/lib/site";

export function NextSixListings({ lang, hasLocalListings = false }: { lang: Locale; hasLocalListings?: boolean }) {
  const zh = lang === "zh";
  return (
    <aside className="nextsix-listings" aria-label={zh ? "NextSix 房源" : "NextSix properties"}>
      <p>{hasLocalListings ? (zh
        ? "本站展示 Iki 的部分 NextSix 房源，资料核对日期：2026年11月11日。筛选仅适用于本站收录资料，并非实时同步；最新价格与供应情况请向 Iki 确认。"
        : "A selection of Iki’s NextSix listings, checked 11 Nov 2026. Filters search only the listings saved here, not live NextSix data. Confirm current price and availability with Iki.") : zh
        ? "站内暂无房源资料，请前往 NextSix 浏览我的房源。本站筛选仅适用于站内房源，不会搜索 NextSix。"
        : "Browse my properties on NextSix while local listings are unavailable. These filters only search this website, not NextSix."}</p>
      <a className="button gold-button" href={nextsixProfileUrl} target="_blank" rel="noopener noreferrer">
        {zh ? "查看我的房源" : "View My Properties"} <span aria-hidden="true">↗</span>
        <span className="sr-only">{zh ? "（NextSix，在新标签页打开）" : " (NextSix, opens in a new tab)"}</span>
      </a>
    </aside>
  );
}
