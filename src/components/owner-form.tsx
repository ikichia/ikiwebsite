"use client";

import { useState, type FormEvent } from "react";
import { categories, copy, whatsappDraft, type Locale } from "@/lib/site";

export function OwnerForm({ lang }: { lang: Locale }) {
  const t = copy[lang];
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const read = (key: string) => String(form.get(key) ?? "").trim();
    const name = read("name");
    const contact = read("contact");
    const location = read("location");
    const category = categories.find((value) => value === read("category"));
    const transaction = read("transaction");
    const message = read("message");
    const digitCount = contact.replace(/\D/g, "").length;

    if (!name || !location || !category || !["sale", "rent"].includes(transaction) ||
        !/^[+\d\s()-]+$/.test(contact) || digitCount < 7 || digitCount > 15) {
      setError(lang === "zh" ? "请填写必填资料，并检查联络号码。" : "Complete the required fields and check your contact number.");
      return;
    }

    setError("");
    const draft = [
      lang === "zh" ? "你好 Iki，我想咨询物业委托。" : "Hi Iki, I’d like to discuss listing my property.",
      `${t.name}: ${name}`,
      `${t.phone}: ${contact}`,
      `${t.propertyLocation}: ${location}`,
      `${t.category}: ${t.categories[category]}`,
      `${t.transaction}: ${transaction === "sale" ? t.sale : t.rent}`,
      ...(message ? [`${t.message}: ${message}`] : []),
    ].join("\n");
    window.location.assign(whatsappDraft(draft));
  }

  return (
    <form className="owner-form" method="post" onSubmit={submit}>
      <label>{t.name}<input name="name" autoComplete="name" required maxLength={80} /></label>
      <label>{t.phone}<input name="contact" type="tel" autoComplete="tel" required maxLength={30} /></label>
      <label>{t.propertyLocation}<input name="location" required maxLength={100} /></label>
      <label>{t.category}<select name="category" required defaultValue="">
        <option value="" disabled>{t.choose}</option>
        {categories.map((item) => <option key={item} value={item}>{t.categories[item]}</option>)}
      </select></label>
      <label>{t.transaction}<select name="transaction" required defaultValue="">
        <option value="" disabled>{t.choose}</option><option value="sale">{t.sale}</option><option value="rent">{t.rent}</option>
      </select></label>
      <label className="owner-message">{t.message} <small>({t.optional})</small><textarea name="message" rows={3} maxLength={700} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button gold-button" type="submit">{t.send} ↗</button>
    </form>
  );
}
