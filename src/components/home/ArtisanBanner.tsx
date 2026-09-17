import type { FC } from "react";
import { ArtisanDesktop } from "./desktop/ArtisanDesktop";
import { ArtisanMobile } from "./mobile/ArtisanMobile";


export const ArtisanBanner: FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12">
      <ArtisanMobile />
      <ArtisanDesktop />
    </section>
  );
};
