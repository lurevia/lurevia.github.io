import type { FC } from "react";
import { PartnerDesktop } from "./desktop/PartnerDesktop";
import { PartnerMobile } from "./mobile/PartnerMobile";

export const PartnerBanner: FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12">
      <PartnerMobile />

      <PartnerDesktop />
    </section>
  );
};
