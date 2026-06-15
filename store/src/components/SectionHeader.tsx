import { LucideIcon } from 'lucide-react';

import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';



interface SectionHeaderProps {

  title: string;

  subtitle?: string;

  label?: string;

  icon?: LucideIcon;

  linkHref?: string;

  linkText?: string;

  centered?: boolean;

}



export default function SectionHeader({

  title,

  subtitle,

  label,

  icon: Icon,

  linkHref,

  linkText,

  centered = false,

}: SectionHeaderProps) {

  if (centered) {

    return (

      <div className="text-center mb-10 md:mb-14 section-header-ornament">

        {label && <p className="fashion-label mb-3">{label}</p>}

        <h2 className="section-title font-heading">{title}</h2>

        <div className="fashion-divider" />

        {subtitle && <p className="section-subtitle">{subtitle}</p>}

        {linkHref && linkText && (

          <Link href={linkHref} className="link-arrow group mt-6 inline-flex">

            <span>{linkText}</span>

            <ArrowLeft size={14} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />

          </Link>

        )}

      </div>

    );

  }



  return (

    <div className="flex items-end justify-between mb-8 md:mb-12">

      <div>

        {label && <p className="fashion-label mb-2">{label}</p>}

        <div className="flex items-center gap-4">

          {Icon && (

            <div className="icon-box hidden md:flex">

              <Icon size={18} strokeWidth={1.5} />

            </div>

          )}

          <div>

            <h2 className="section-title">{title}</h2>

            {subtitle && <p className="section-subtitle">{subtitle}</p>}

          </div>

        </div>

      </div>

      {linkHref && linkText && (

        <Link href={linkHref} className="link-arrow group shrink-0">

          <span>{linkText}</span>

          <ArrowLeft size={14} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />

        </Link>

      )}

    </div>

  );

}


