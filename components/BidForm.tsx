"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import { PLATFORMS } from "@/lib/platforms";
import { formatOre } from "@/lib/format";

type Prefill = {
  slug: string;
  name: string;
  platform: string;
  url: string;
  description: string;
  category: string;
  imageUrl: string;
  email: string;
  vatNumber: string;
};

export default function BidForm({
  locale,
  minBidOre,
  prefill,
}: {
  locale: string;
  minBidOre: number;
  prefill?: Prefill;
}) {
  const t = useTranslations("bidForm");

  const [name, setName] = useState(prefill?.name ?? "");
  const [platform, setPlatform] = useState(prefill?.platform ?? PLATFORMS[0].slug);
  const [url, setUrl] = useState(prefill?.url ?? "");
  const [description, setDescription] = useState(prefill?.description ?? "");
  const [category, setCategory] = useState(prefill?.category ?? CATEGORIES[0].slug);
  const [imageUrl, setImageUrl] = useState(prefill?.imageUrl ?? "");
  const [email, setEmail] = useState(prefill?.email ?? "");
  const [vatNumber, setVatNumber] = useState(prefill?.vatNumber ?? "");
  const [bidKr, setBidKr] = useState(Math.ceil(minBidOre / 100));
  const [withdrawalConsent, setWithdrawalConsent] = useState(false);
  const [termsConsent, setTermsConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onLogoSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(
          data.error === "too_large"
            ? t("errors.logoTooLarge")
            : data.error === "invalid_type"
              ? t("errors.logoInvalidType")
              : t("errors.generic")
        );
        return;
      }
      setImageUrl(data.url);
    } catch {
      setUploadError(t("errors.generic"));
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!withdrawalConsent) {
      setError(t("errors.withdrawal"));
      return;
    }
    if (!termsConsent) {
      setError(t("errors.terms"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          platform,
          url,
          description,
          category,
          imageUrl,
          email,
          vatNumber,
          bidKr,
          withdrawalConsent,
          termsConsent,
          slug: prefill?.slug,
          locale,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "bid_too_low") {
          setError(t("errors.bidTooLow", { amount: formatOre(data.minBidOre, locale) }));
        } else {
          setError(t("errors.generic"));
        }
        setSubmitting(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError(t("errors.generic"));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
      <Field label={t("name")}>
        <input
          required
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
      </Field>

      <Field label={t("platform")}>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="input"
        >
          {PLATFORMS.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t("url")}>
        <input
          required
          type="url"
          placeholder="https://"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input"
        />
      </Field>

      <Field label={t("description")} hint={t("descriptionHint")}>
        <textarea
          required
          maxLength={150}
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input resize-none"
        />
        <div className="mt-1 text-right text-xs text-muted">{description.length}/150</div>
      </Field>

      <Field label={t("category")}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input"
        >
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {categoryLabel(c.slug, locale)}
            </option>
          ))}
        </select>
      </Field>

      <Field label={`${t("imageUrl")} ${t("imageUrlOptional")}`}>
        <div className="flex items-center gap-3">
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              className="h-11 w-11 shrink-0 rounded-lg object-cover"
            />
          )}
          <label className="flex-1 cursor-pointer">
            <span className="input flex items-center justify-center text-center text-muted hover:text-foreground">
              {uploading ? t("logoUploading") : imageUrl ? t("logoReplace") : t("logoUpload")}
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={onLogoSelected}
              disabled={uploading}
              className="sr-only"
            />
          </label>
        </div>
        <p className="mt-1 text-xs text-muted">{t("logoHint")}</p>
        {uploadError && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{uploadError}</p>}
      </Field>

      <Field label={t("email")} hint={t("emailHint")}>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
      </Field>

      <Field label={`${t("vatNumber")} ${t("vatNumberOptional")}`}>
        <input
          value={vatNumber}
          onChange={(e) => setVatNumber(e.target.value)}
          className="input"
        />
      </Field>

      <Field label={t("bidAmount")} hint={t("minBidHint", { amount: formatOre(minBidOre, locale) })}>
        <input
          required
          type="number"
          min={Math.ceil(minBidOre / 100)}
          step={1}
          value={bidKr}
          onChange={(e) => setBidKr(Number(e.target.value))}
          className="input"
        />
        <p className="mt-1 text-xs text-muted">{t("vatNote")}</p>
      </Field>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={withdrawalConsent}
          onChange={(e) => setWithdrawalConsent(e.target.checked)}
          className="mt-0.5"
        />
        <span>{t("withdrawal")}</span>
      </label>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={termsConsent}
          onChange={(e) => setTermsConsent(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          {t("terms")}{" "}
          <Link href="/villkor" className="underline hover:text-accent" target="_blank">
            {t("termsLink")}
          </Link>{" "}
          {t("and")}{" "}
          <Link href="/integritetspolicy" className="underline hover:text-accent" target="_blank">
            {t("privacyLink")}
          </Link>
        </span>
      </label>

      {error && (
        <p className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:border-red-900 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded-md bg-accent px-5 py-3 font-semibold text-accent-foreground hover:brightness-110 transition disabled:opacity-60"
      >
        {submitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </label>
  );
}
