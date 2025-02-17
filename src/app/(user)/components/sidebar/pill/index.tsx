'use client';

import React from 'react';
import Link from 'next/link';

import { usePathname } from 'next/navigation';

import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';

import {
  userSideNavItems,
  clubDashboardSidebarNavItems,
  homePageItems,
} from '~/lib/data';

interface Props {
  name: string;
  href: string;
}

const DashboardItem = ({ name, href }: Props) => {
  const path = usePathname();
  const item = [
    ...userSideNavItems,
    ...clubDashboardSidebarNavItems,
    ...homePageItems,
  ].find((item) => item.href.includes(href))!;

  const isActive = item?.regexp ? item.regexp.test(path) : path === href;

  return (
    <Button
      asChild
      variant='ghost'
      className={cn(
        'flex w-full flex-row items-start justify-start gap-2',
        isActive
          ? 'bg-primary text-gray-100 hover:bg-primary hover:text-gray-100 hover:opacity-95'
          : 'bg-white text-neutral-600'
      )}
    >
      <Link href={href} className='flex flex-row items-center gap-2'>
        <item.Icon size={20} />
        <span className=''>{name}</span>
      </Link>
    </Button>
  );
};

export default DashboardItem;
