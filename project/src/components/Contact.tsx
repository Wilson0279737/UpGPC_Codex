import { siteConfig } from '../config/site';
import { Mail, MapPin, Phone } from 'lucide-react';

const googleMapsUrl = siteConfig.googleMapsUrl;

type ContactProps = {
  showHeader?: boolean;
};

const Contact = ({ showHeader = true }: ContactProps) => {
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
            <h3 className="text-xl font-bold text-white sm:text-2xl">Contact Information</h3>

            <div className="mb-6 mt-6 space-y-5 sm:mb-8 sm:mt-8 sm:space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="mt-1 h-6 w-6 text-purple-300" />
                <div>
                  <h4 className="font-semibold text-white">Phone</h4>
                  <a href={siteConfig.phoneHref} className="text-purple-200 transition-colors hover:text-white hover:underline">
                    {siteConfig.phone}
                  </a>
                  <p className="text-sm text-purple-100">Free estimates over the phone</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="mt-1 h-6 w-6 text-purple-300" />
                <div>
                  <h4 className="font-semibold text-white">Email</h4>
                  <a
                    href={siteConfig.emailHref}
                    className="break-all text-purple-200 transition-colors hover:text-white hover:underline"
                  >
                    {siteConfig.email}
                  </a>
                  <p className="text-sm text-purple-100">Fast response!</p>
                </div>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-purple-800/30"
              >
                <MapPin className="mt-1 h-6 w-6 text-purple-300 group-hover:text-purple-200" />
                <div>
                  <h4 className="font-semibold text-white group-hover:text-purple-100">Location and Hours</h4>
                  <p className="text-purple-200 group-hover:text-white group-hover:underline">
                    {siteConfig.streetAddress}
                    <br />
                    {siteConfig.city}, {siteConfig.state} {siteConfig.postalCode}
                  </p>
                  <p className="mt-1 text-sm text-purple-100">{siteConfig.hoursNote}</p>
                </div>
              </a>
            </div>

            <div className="rounded-[1.35rem] border border-purple-300/30 bg-purple-800/30 p-5 sm:p-6">
              <h4 className="font-semibold text-purple-100">Try Before You Buy</h4>
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
