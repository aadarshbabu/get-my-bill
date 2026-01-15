import { useTranslations } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "@/features/landing/Section";

export const FAQ = () => {
  const t = useTranslations("FAQ");

  return (
    <Section>
      <Accordion type="multiple" className="w-full">
        {[1, 2, 3, 4, 5].map((value) => (
          <AccordionItem key={value} value={String(value)}>
            <AccordionTrigger>{t(`item-${value}-question`)}</AccordionTrigger>
            <AccordionContent>{t(`item-${value}-answer`)}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
};
