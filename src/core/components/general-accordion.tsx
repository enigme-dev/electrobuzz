import { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface AccordionProps {
  accordionTrigger: string;
  children: ReactNode;
}

export function GeneralAccordion({
  accordionTrigger,
  children,
}: AccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="p-0 border-b-0">
        <AccordionTrigger>{accordionTrigger}</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
