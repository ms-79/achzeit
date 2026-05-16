import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

/**
 * Renders the long-form listing description fetched from Hostaway
 * (via the `amenities` edge function, which also returns `description`).
 * The Hostaway text uses simple inline HTML (<b>) and \n line breaks.
 */
const DescriptionSection = () => {
  const [description, setDescription] = useState<string>('');
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.functions.invoke('amenities');
        setDescription(String(data?.description || ''));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !description) return null;

  // Split into paragraphs on blank lines; allow <b> bold inline.
  const paragraphs = description
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const previewCount = 3;
  const visible = expanded ? paragraphs : paragraphs.slice(0, previewCount);
  const hidden = Math.max(0, paragraphs.length - previewCount);

  const renderInline = (text: string) => {
    // Convert <b>..</b> to <strong>, preserve single line breaks.
    const html = text
      .replace(/<b>(.*?)<\/b>/gi, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <section id="description" className="section-padding bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <ScrollReveal className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            Über das Haus
          </h2>
          <p className="text-lg text-muted-foreground tracking-wide">
            Alles, was deinen Aufenthalt besonders macht
          </p>
          <div className="alpine-divider mt-6" />
        </ScrollReveal>

        <ScrollReveal>
          <motion.div
            layout
            className="space-y-5 text-foreground/90 text-base md:text-lg leading-relaxed font-light"
          >
            {visible.map((p, i) => (
              <p key={i}>{renderInline(p)}</p>
            ))}
          </motion.div>

          {hidden > 0 && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setExpanded((v) => !v)}
                className="gap-2"
              >
                {expanded ? (
                  <>
                    Weniger anzeigen
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Weiterlesen
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
};

export default DescriptionSection;