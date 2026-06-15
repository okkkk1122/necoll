'use client';



import Link from 'next/link';

import { useConfig } from '@/lib/config-context';

import { SocialIcon, getSocialMeta, type SocialKey } from './SocialIcons';

import Logo from './Logo';

import { Mail, Phone, MapPin, Truck, Shield, RotateCcw } from 'lucide-react';



const serviceIcons = [Truck, Shield, RotateCcw];



export default function Footer() {

  const config = useConfig();

  const footer = config.footer_config;

  const contact = config.contact_info;

  const services = config.footer_services || [];

  const socialLinks = config.social_links || {};

  const socialEnabled = config.social_enabled || {};

  const siteName = config.site_name?.fa || 'نکال';



  const activeSocials = Object.entries(socialLinks).filter(

    ([key, url]) => url && socialEnabled[key]

  ) as [SocialKey, string][];



  return (

    <footer className="mt-auto border-t border-[var(--color-border-light)]" style={{ background: 'var(--color-footer)' }}>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20 max-w-full">

        <div className="text-center mb-14">

          <Logo size="lg" variant="default" className="justify-center" />

          <p className="text-[var(--color-text-muted)] text-sm mt-5 max-w-md mx-auto font-light leading-relaxed tracking-wide">

            {config.site_description?.fa || 'بوتیک مد و پوشاک زنانه نکال'}

          </p>

        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">

          {services.length > 0 && (

            <div>

              <h4 className="fashion-label mb-5">خدمات</h4>

              <div className="space-y-3">

                {services.map((item, i) => {

                  const Icon = serviceIcons[i % serviceIcons.length];

                  return (

                    <div key={i} className="flex items-center gap-2.5 text-[var(--color-text-muted)] text-xs tracking-wide">

                      <Icon size={13} strokeWidth={1.5} className="text-[var(--color-blue-deep)]" />

                      {item.fa}

                    </div>

                  );

                })}

              </div>

            </div>

          )}



          {footer?.columns?.map((col, i) => (

            <div key={i}>

              <h4 className="fashion-label mb-5">{col.title}</h4>

              <ul className="space-y-2.5">

                {col.links.map((link, j) => (

                  <li key={j}>

                    <Link

                      href={link.url}

                      className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-blue-deep)] transition-colors font-light tracking-wide"

                    >

                      {link.label}

                    </Link>

                  </li>

                ))}

              </ul>

            </div>

          ))}



          <div>

            <h4 className="fashion-label mb-5">ارتباط با ما</h4>

            <div className="space-y-3 mb-6">

              {contact?.email && (

                <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-blue-deep)] transition-colors font-light">

                  <Mail size={14} strokeWidth={1.5} className="text-[var(--color-blue-deep)]" />

                  {contact.email}

                </a>

              )}

              {contact?.phoneDisplay && (

                <a href={`tel:${contact.phone}`} className="flex items-center gap-2.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-blue-deep)] transition-colors font-light">

                  <Phone size={14} strokeWidth={1.5} className="text-[var(--color-blue-deep)]" />

                  {contact.phoneDisplay}

                </a>

              )}

              {contact?.address?.fa && (

                <span className="flex items-center gap-2.5 text-sm text-[var(--color-text-muted)] font-light">

                  <MapPin size={14} strokeWidth={1.5} className="text-[var(--color-blue-deep)]" />

                  {contact.address.fa}

                </span>

              )}

            </div>



            {footer?.showSocial && activeSocials.length > 0 && (

              <div className="flex flex-wrap gap-2">

                {activeSocials.map(([key, url]) => {

                  const meta = getSocialMeta(key);

                  return (

                    <a

                      key={key}

                      href={url}

                      target="_blank"

                      rel="noopener noreferrer"

                      className="social-btn"

                      title={meta.label}

                      style={{ color: meta.color }}

                    >

                      <SocialIcon platform={key} size={15} />

                    </a>

                  );

                })}

              </div>

            )}

          </div>

        </div>



        <div className="border-t border-[var(--color-border)] mt-14 pt-8 text-center text-xs text-[var(--color-text-muted)] tracking-widest uppercase">

          {footer?.copyright || `© ${new Date().getFullYear()} ${siteName}`}

        </div>

      </div>

    </footer>

  );

}


