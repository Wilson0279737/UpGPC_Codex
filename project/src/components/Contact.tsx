import { Mail, MapPin, Phone } from 'lucide-react';

const googleMapsUrl =
  'https://www.google.com/maps/place/Upgrade+Gaming+PCs+%2B+Computer+Repair/@42.957475,-83.8324749,17z/data=!3m1!4b1!4m6!3m5!1s0x88246f304b3af7fb:0xae6166c538ca04ed!8m2!3d42.957475!4d-83.8324749!16s%2Fg%2F11lw8tygg_?entry=ttu';

type ContactProps = {
  showHeader?: boolean;
};

const Contact = ({ showHeader = true }: ContactProps) => {
  const ContactHeading = showHeader ? 'h3' : 'h2';
  const DetailHeading = showHeader ? 'h4' : 'h3';

  return (
    <section id="contact" className="relative py-14 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-purple-900/20"></div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {showHeader ? (
          <div className="reveal relative z-10 mb-10 text-center sm:mb-16">
            <h2 className="text-[1.9rem] font-bold text-white sm:text-3xl lg:text-4xl">Get In Touch</h2>
            <p className="mt-3 text-base text-purple-100 sm:mt-4 sm:text-xl">
              Ready to upgrade your gaming setup or need PC repair? Contact us today!
            </p>
          </div>
        ) : null}

        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="reveal reveal-delay-1 rounded-[1.75rem] border border-purple-200/20 bg-purple-950/25 p-6 shadow-[0_28px_80px_rgba(20,10,40,0.3)] backdrop-blur-sm sm:p-8">
            <ContactHeading className="text-xl font-bold text-white sm:text-2xl">Contact Information</ContactHeading>

            <div className="mb-6 mt-6 space-y-5 sm:mb-8 sm:mt-8 sm:space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="mt-1 h-6 w-6 shrink-0 text-purple-300" />
                <div className="min-w-0">
                  <DetailHeading className="font-semibold text-white">Phone</DetailHeading>
                  <a href="tel:+18104413020" className="inline-flex min-h-11 items-center text-purple-200 transition-colors hover:text-white hover:underline">
                    (810) 441-3020
                  </a>
                  <p className="text-sm text-purple-100">Free estimates over the phone</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="mt-1 h-6 w-6 shrink-0 text-purple-300" />
                <div className="min-w-0">
                  <DetailHeading className="font-semibold text-white">Email</DetailHeading>
                  <a
                    href="mailto:brandonwilson0279737@gmail.com"
                    className="inline-flex min-h-11 items-center break-all text-purple-200 transition-colors hover:text-white hover:underline"
                  >
                    brandonwilson0279737@gmail.com
                  </a>
                  <p className="text-sm text-purple-100">Tell us your PC model, symptoms, or what you want to upgrade.</p>
                </div>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-purple-800/30"
              >
                <MapPin className="mt-1 h-6 w-6 shrink-0 text-purple-300 group-hover:text-purple-200" />
                <div className="min-w-0">
                  <DetailHeading className="font-semibold text-white group-hover:text-purple-100">Location and directions</DetailHeading>
                  <p className="text-purple-200 group-hover:text-white group-hover:underline">
                    8048 Miller Rd Ste B
                    <br />
                    Swartz Creek, MI 48473
                  </p>
                  <p className="mt-1 text-sm text-purple-100">Visit our showroom to test gaming PCs. Call ahead to confirm current hours.</p>
                </div>
              </a>
            </div>

            <div className="rounded-[1.35rem] border border-purple-300/30 bg-purple-800/30 p-5 sm:p-6">
              <DetailHeading className="font-semibold text-purple-100">Try Before You Buy</DetailHeading>
              <p className="mt-2 text-sm text-purple-100">
                Visit our Swartz Creek showroom to test gaming PCs hands-on. Experience the performance difference before
                making your decision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
