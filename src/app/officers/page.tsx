import { OfficerCarousel, type Officer } from "@/components/officer-carousel";
import { PdfViewer } from "@/components/pdf-viewer";
import { SiteHeader } from "@/components/site-header";

const officers: Officer[] = [
  { name: "Academic Year 2026–2027", role: "GESS Officers", committee: "Official officer directory", image: "/assets/officers/pictures/1.jpg", alt: "GESS Officers Academic Year 2026 to 2027 cover" },
  { name: "GESS Officers", role: "Academic Year 2026–2027", committee: "Full officer corps", image: "/assets/officers/pictures/2.jpg", alt: "GESS officers group photo" },
  { name: "Year-Level Representatives", role: "Student representation", committee: "Academic Year 2026–2027", image: "/assets/officers/pictures/3.jpg", alt: "Year-Level Representatives section cover" },
  { name: "Year-Level Representatives", role: "First to sixth year", committee: "Student representation", image: "/assets/officers/pictures/4.jpg", alt: "Year-Level Representatives group photo" },
  { name: "Jerly Mepieza & Wincel Khate D. Lara", role: "First & Second Year Representatives", committee: "Year-Level Representatives", image: "/assets/officers/pictures/5.jpg", alt: "Jerly Mepieza and Wincel Khate D. Lara" },
  { name: "Shainne C. Mendoza & Kurt Jomari M. Calibara", role: "Third & Fourth Year Representatives", committee: "Year-Level Representatives", image: "/assets/officers/pictures/6.jpg", alt: "Shainne C. Mendoza and Kurt Jomari M. Calibara" },
  { name: "Michelle Dawn L. Ureta", role: "Fifth/Sixth Year Representative", committee: "Year-Level Representatives", image: "/assets/officers/pictures/7.jpg", alt: "Michelle Dawn L. Ureta" },
  { name: "Directorship", role: "Committee leadership", committee: "Academic Year 2026–2027", image: "/assets/officers/pictures/8.jpg", alt: "Directorship section cover" },
  { name: "Directorship", role: "Committee leadership", committee: "GESS Directors and Deputies", image: "/assets/officers/pictures/9.jpg", alt: "Directorship group photo" },
  { name: "Hannah Jayne B. Mozo & MC Ern Dave Betagan", role: "Event Production and Management", committee: "Director & Deputy", image: "/assets/officers/pictures/10.jpg", alt: "Hannah Jayne B. Mozo and MC Ern Dave Betagan" },
  { name: "Mark Joseph S. Albarando & Sophia S. Sombilon", role: "Arts, Creatives and Production", committee: "Director & Deputy", image: "/assets/officers/pictures/11.jpg", alt: "Mark Joseph S. Albarando and Sophia S. Sombilon" },
  { name: "Erica Xyla T. Bangkas & Emmanuel Centillas", role: "Publicity and Relations", committee: "Directorship", image: "/assets/officers/pictures/12.jpg", alt: "Erica Xyla T. Bangkas and Emmanuel Centillas" },
  { name: "Heaven Wyatt L. Santos & Bien Stephen Albite", role: "Partnership, Communication and Engagement", committee: "Director & Deputy", image: "/assets/officers/pictures/13.jpg", alt: "Heaven Wyatt L. Santos and Bien Stephen Albite" },
  { name: "Executives", role: "Executive leadership", committee: "Academic Year 2026–2027", image: "/assets/officers/pictures/14.jpg", alt: "Executives section cover" },
  { name: "GESS Executives", role: "Executive leadership", committee: "Academic Year 2026–2027", image: "/assets/officers/pictures/15.jpg", alt: "GESS executives group photo" },
  { name: "Samantha Sheen C. Nitcha", role: "Public Information Officer", committee: "Executives", image: "/assets/officers/pictures/16.jpg", alt: "Samantha Sheen C. Nitcha" },
  { name: "Vincent Gonzal & Rex Elijah C. Simbajon", role: "Business Managers", committee: "Executives", image: "/assets/officers/pictures/17.jpg", alt: "Vincent Gonzal and Rex Elijah C. Simbajon" },
  { name: "Mary Glenn M. Nor & Roselle C. Marzon", role: "Business Managers", committee: "Executives", image: "/assets/officers/pictures/18.jpg", alt: "Mary Glenn M. Nor and Roselle C. Marzon" },
  { name: "Jon Sebastian S. Sexcion", role: "Business Manager", committee: "Executives", image: "/assets/officers/pictures/19.jpg", alt: "Jon Sebastian S. Sexcion" },
  { name: "Xinia Joy A. Digal", role: "Auditor", committee: "Executives", image: "/assets/officers/pictures/20.jpg", alt: "Xinia Joy A. Digal" },
  { name: "Kim Jean L. Lawas & Marianne Panerio", role: "Treasurer & Associate Treasurer", committee: "Executives", image: "/assets/officers/pictures/21.jpg", alt: "Kim Jean L. Lawas and Marianne Panerio" },
  { name: "Anna Franchie A. Pesucan", role: "Secretary", committee: "Executives", image: "/assets/officers/pictures/22.jpg", alt: "Anna Franchie A. Pesucan" },
  { name: "Hazel Ann T. Jala", role: "Executive Secretary", committee: "Executives", image: "/assets/officers/pictures/23.jpg", alt: "Hazel Ann T. Jala" },
  { name: "Althea Megan M. Cascabel", role: "External Vice President", committee: "Executives", image: "/assets/officers/pictures/24.jpg", alt: "Althea Megan M. Cascabel" },
  { name: "Orlan Vergel E. Cabije", role: "Internal Vice President", committee: "Executives", image: "/assets/officers/pictures/25.jpg", alt: "Orlan Vergel E. Cabije" },
  { name: "Yvonne C. Amper", role: "President", committee: "Executives", image: "/assets/officers/pictures/26.jpg", alt: "Yvonne C. Amper" },
];

export default function OfficersPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="topo-surface relative overflow-hidden px-6 py-16 text-white sm:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="section-kicker">The people behind the map</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold sm:text-5xl">Meet the GESS officers.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-emerald-50/80">Explore the Academic Year 2026–2027 officer directory, committee teams, and year-level representatives.</p>
          </div>
        </section>

        <section className="bg-[#0D2E14] px-5 py-12 text-white sm:px-8 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
              <div>
                <p className="section-kicker">Officer carousel</p>
                <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">26 views of our leadership.</h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-emerald-50/65">Browse the original officer directory visual set without cropping or external image dependencies.</p>
            </div>
            <OfficerCarousel officers={officers} />
          </div>
        </section>

        <section className="content-band px-6 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <p className="eyebrow-rule">Reference document</p>
              <h2 className="mt-3 text-2xl font-bold text-forest sm:text-3xl">Officer directory PDF</h2>
            </div>
            <PdfViewer src="/assets/officers/officers.pdf" title="GESS Officers Academic Year 2026–2027" />
          </div>
        </section>
      </main>
    </>
  );
}
