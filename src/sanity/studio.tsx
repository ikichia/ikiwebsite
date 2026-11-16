"use client";
import Link from "next/link";
import { NextStudio } from "next-sanity/studio";
import config from "../../sanity.config";

export function Studio() {
  if (config) return <NextStudio config={config} />;
  return <main style={{ maxWidth: 760, margin: "48px auto", padding: 24, fontFamily: "system-ui", lineHeight: 1.7 }}>
    <h1>Property with Iki — Sanity Phase 1</h1>
    <p>Studio is not connected / 后台尚未连接。</p>
    <p>Use the EXISTING Sanity project and testing dataset. Do not create another project or dataset.</p>
    <p>请先确认已有项目 c3sa9z6o、testing 数据集及 Administrator 账号；参阅 docs/sanity-phase1.md 配置本地环境。</p>
    <p><strong>Public data only / 仅限公开资料。</strong> 不得填写业主联系方式、完整地址、单位号码、内部备注或上传私人文件。图片 CDN 也是公开的。</p>
    <p>No password or API token is required in chat. / 无需提供密码或 Token。</p>
    <Link href="/en">Back to website / 返回网站</Link>
  </main>;
}
