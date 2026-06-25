import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/ScrollReveal';

/**
 * Slim "Das Haus" section: shows only the (Hostaway) house description text with
 * a "Weiterlesen" collapse. The big exterior photo + feature tiles were removed
 * to avoid repeating the hero / "Warum ACHZEIT" – the photo now lives in the
 * gallery. Collapse happens right before the 2nd heading (i.e. before
 * "Wohnbereich & Küche").
 */
const HouseSection = () => {
  const { t, language } = useLanguage();
  const [description, setDescription] = useState<string>('');
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/amenities?locale=${language}`);
        const data = await res.json();
        setDescription(String(data?.description || ''));
      } catch (e) {
        console.error(e);
      }
    })();
  }, [language]);

  // Normalize: convert <b> → <strong>; website wording tweaks (Kurtaxe → Kurbeitrag);
  // if HTML lacks block tags, wrap paragraphs.
  const normalized = (() => {
    let html = description
      .replace(/<b(\s[^>]*)?>/gi, '<strong>')
      .replace(/<\/b>/gi, '</strong>')
      .replace(/Kurtaxe/g, 'Kurbeitrag')
      .replace(/malerischen Dorf Fischen/g, 'malerischen Fischen');
    if (!/<(h3|p|ul|li)\b/i.test(html)) {
      html = html
        .split(/\n{2,}/)
        .map((p) => `<p>${p.trim().replace(/\n/g, '<br />')}</p>`)
        .filter(Boolean)
        .join('');
    }
    return html;
  })();
  const blocks = normalized.match(/<(h3|p|ul)[\s\S]*?<\/\1>/gi) || (normalized ? [normalized] : []);
  // Collapse right before the 2nd heading (show only the intro, then "Weiterlesen"
  // before "Wohnbereich & Küche"). Fallback: 3 blocks.
  const headingIdx = blocks.reduce<number[]>((acc, b, i) => (/^<h3/i.test(b) ? [...acc, i] : acc), []);
  const cut = headingIdx.length >= 2 ? headingIdx[1] : Math.min(3, blocks.length);
  const visibleBlocks = descExpanded ? blocks : blocks.slice(0, cut);
  const hiddenCount = Math.max(0, blocks.length - cut);

  if (blocks.length === 0) return null;

  return (
    <section id="house" className="section-padding bg-gradient-section">
      <div className="container mx-auto px-6">
        <ScrollReveal className="text-center mb-10 md:mb-12">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            {t('house.title')}
          </h2>
          <p className="text-lg text-muted-foreground tracking-wide">
            {t('house.subtitle')}
          </p>
          <div className="alpine-divider mt-6" />
        </ScrollReveal>

        <ScrollReveal>
          <div
            className="max-w-3xl mx-auto text-foreground/90 text-base md:text-lg leading-relaxed font-light
                       [&>p]:mb-4 [&>ul]:mb-4 [&>ul]:list-disc [&>ul]:pl-6
                       [&>h3]:font-display [&>h3]:text-2xl [&>h3]:md:text-3xl [&>h3]:text-foreground
                       [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:font-normal
                       [&>h3:first-child]:mt-0"
            dangerouslySetInnerHTML={{ __html: visibleBlocks.join('') }}
          />
          {hiddenCount > 0 && (
            <div className="max-w-3xl mx-auto pt-4">
              <button
                type="button"
                onClick={() => setDescExpanded((v) => !v)}
                className="text-sm font-medium text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                {descExpanded ? t('common.readLess') : t('common.readMore')}
              </button>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HouseSection;
