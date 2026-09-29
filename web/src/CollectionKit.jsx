import { useEffect, useRef, useState } from "react";
import { Copy, Printer } from "lucide-react";

function testEntryUrl() {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${window.location.pathname}#/test`;
}

/** Simpel QR via ekstern generator (ingen ekstra npm-afhængighed). */
function qrImageUrl(data, size = 180) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
}

export default function CollectionKit({ compact = false }) {
  const url = testEntryUrl();
  const [copied, setCopied] = useState(false);
  const printRef = useRef(null);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const printCard = () => {
    const node = printRef.current;
    if (!node) return;
    const win = window.open("", "_blank", "noopener,noreferrer,width=480,height=640");
    if (!win) return;
    win.document.write(`<!doctype html><html lang="da"><head><meta charset="utf-8"/><title>Samspil elevkort</title>
<style>
  body{font-family:Georgia,serif;padding:2rem;color:#1a1a1a;text-align:center}
  h1{font-size:1.5rem;margin:0 0 .5rem}
  ol{text-align:left;max-width:22rem;margin:1.25rem auto;line-height:1.5}
  img{margin:1rem auto;display:block}
  .url{font-size:.85rem;word-break:break-all;color:#444}
</style></head><body>${node.innerHTML}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <section
      className={`collection-kit ${compact ? "collection-kit-compact" : ""}`}
      aria-labelledby="collection-kit-title"
    >
      <div className="collection-kit-copy">
        <span className="wave-kicker">INDSAMLINGSKIT</span>
        <h2 id="collection-kit-title">Sådan indsamler du</h2>
        <ol className="collection-kit-steps">
          <li>
            Eleven logger ind med Mercantec Auth.
          </li>
          <li>
            Eleven tager testen (mindst 30 udsagn) og gemmer profilen på kontoen.
          </li>
          <li>
            Underviseren ser resultatet i admin-overblikket — eller importerer
            JSON som backup.
          </li>
        </ol>
        <div className="collection-kit-actions">
          <button type="button" className="button secondary pill" onClick={copyLink}>
            <Copy size={16} /> {copied ? "Kopieret" : "Kopiér test-link"}
          </button>
          <button type="button" className="button secondary pill" onClick={printCard}>
            <Printer size={16} /> Print elevkort
          </button>
        </div>
        <p className="collection-kit-url">
          <a href={url}>{url}</a>
        </p>
      </div>
      <div className="collection-kit-qr" ref={printRef}>
        <h1>Samspil</h1>
        <p>Tag personlighedstesten</p>
        <ol>
          <li>Log ind</li>
          <li>Tag testen</li>
          <li>Din underviser ser resultatet</li>
        </ol>
        {url ? (
          <img src={qrImageUrl(url)} width={180} height={180} alt="QR-kode til testen" />
        ) : null}
        <p className="url">{url}</p>
      </div>
    </section>
  );
}
