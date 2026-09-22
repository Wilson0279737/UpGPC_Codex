import ResponsiveImage from './ui/ResponsiveImage';
const collageImages = [
  {
    src: '/optimized/about-collage-01.jpg',
    alt: 'Group photo outdoors showing the people behind Upgrade Gaming PCs',
    className: 'md:col-span-2 md:row-span-2',
    imageClassName: 'h-56 sm:h-72 md:h-full md:object-center',
  },
  {
    src: '/optimized/about-collage-02.jpg',
    alt: 'Renovation work in progress while building the shop space',
    className: '',
    imageClassName: 'h-48 sm:h-56 md:h-full md:object-center',
  },
  {
    src: '/optimized/about-collage-03.jpg',
    alt: 'Casual behind-the-scenes photo showing personality outside the storefront',
    className: '',
    imageClassName: 'h-48 sm:h-56 md:h-full md:object-center',
  },
  {
    src: '/optimized/about-collage-04.jpg',
    alt: 'Portrait photo of the people behind the business in front of a waterfall',
    className: 'md:col-start-4 md:row-start-1 md:row-span-2',
    imageClassName: 'h-64 sm:h-80 md:h-full md:object-center',
  },
];

const AboutUsCollage = () => {
  return (
    <section className="relative py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal overflow-hidden rounded-[1.5rem] border border-purple-300/30 bg-white/10 p-4 shadow-xl sm:rounded-[1.75rem] sm:p-6 lg:p-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-purple-300/30 bg-purple-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-purple-100 sm:text-xs">
              Real People
            </div>
            <h2 className="mt-4 text-[1.9rem] font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
              More than inventory and repairs
            </h2>
            <p className="mt-3 text-base leading-relaxed text-purple-100 sm:text-lg">
              These photos help show that the shop is run by real people with real roots, not just a logo on a storefront.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4 md:auto-rows-[11.5rem] lg:auto-rows-[13rem]">
            {collageImages.map((image) => (
              <figure
                key={image.src}
                className={`overflow-hidden rounded-[1.2rem] border border-purple-300/25 bg-purple-950/25 shadow-[0_18px_34px_rgba(12,8,39,0.2)] ${image.className}`.trim()}
              >
                <ResponsiveImage
                  src={image.src}
                  sizes="(min-width: 1152px) 520px, (min-width: 768px) 50vw, 100vw"
                  alt={image.alt}
                  className={`${image.imageClassName} w-full object-cover object-center`}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsCollage;
