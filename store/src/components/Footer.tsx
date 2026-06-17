'use client';

import Link from 'next/link';
import { useConfig } from '@/lib/config-context';
import { SocialIcon } from './SocialIcons';
import Logo from './Logo';

interface FooterLink {
  label: string;
  url: string;
}

export default function Footer() {
  const config = useConfig();
  const footer = config.footer_config as {
    links?: FooterLink[];
    trustBadgeImage?: string;
    copyright?: string;
    showSocial?: boolean;
  } | undefined;
  const contact = config.contact_info as {
    address?: { fa: string };
    tagline?: { fa?: string; en?: string };
    brandSince?: string;
    instagramHandle?: string;
    telegramHandle?: string;
  } | undefined;
  const socialLinks = config.social_links || {};
  const socialEnabled = config.social_enabled || {};
  const brandEn = config.site_name?.en || 'Necoll';
  const footerLinks = footer?.links || [];
  const tagline = contact?.tagline?.en || contact?.tagline?.fa || 'Be Your Best';
  const sinceYear = contact?.brandSince || '2024';
  const trustBadge = footer?.trustBadgeImage || '/enamad-placeholder.svg';

  const instagramUrl = socialEnabled.instagram && socialLinks.instagram ? socialLinks.instagram : null;
  const telegramUrl = socialEnabled.telegram && socialLinks.telegram ? socialLinks.telegram : null;
  const instagramHandle = contact?.instagramHandle || 'necoll____';
  const telegramHandle = contact?.telegramHandle || 'necoll1234';

  return (
    <footer className="monaie-footer">
      {tagline && (
        <p className="monaie-footer__tagline" dir="ltr">
          {tagline}
        </p>
      )}

      {footerLinks.length > 0 && (
        <nav className="monaie-footer__links" aria-label="فهرست">
          {footerLinks.map((link, i) => (
            <Link key={i} href={link.url} className="monaie-footer__link">
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      {contact?.address?.fa && (
        <p className="monaie-footer__address font-nav">{contact.address.fa}</p>
      )}

      <div className="monaie-footer__social">
        {instagramUrl && (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="monaie-footer__social-item"
          >
            <SocialIcon platform="instagram" size={18} />
            <span className="monaie-footer__social-label" dir="ltr">
              {instagramHandle}
            </span>
          </a>
        )}
        {telegramUrl && (
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="monaie-footer__social-item"
          >
            <SocialIcon platform="telegram" size={18} />
            <span className="monaie-footer__social-label" dir="ltr">
              {telegramHandle}
            </span>
          </a>
        )}
      </div>

      <div className="monaie-footer__trust">
        <img
          src={trustBadge}
          alt=""
          className="monaie-footer__trust-badge"
          width={96}
          height={96}
        />
      </div>

      <div className="monaie-footer__brand">
        <Logo size="sm" showText className="justify-center" />
        <p className="monaie-footer__since" dir="ltr">
          {brandEn} Since {sinceYear}
        </p>
      </div>
    </footer>
  );
}
