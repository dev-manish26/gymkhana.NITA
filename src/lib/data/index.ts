import {
  HiOutlineTicket,
  HiOutlineUserCircle,
  HiOutlineBell,
  HiOutlineChartSquareBar,
} from 'react-icons/hi';
import { RxDashboard } from 'react-icons/rx';

import type { SideNavItem } from '~/types';

export const collegeNames = [
  'National Institute of Technology, Agartala',
  'Indian Institute of Information Technology, Agartala',
  'Indian Institute of Technology, Guwahati',
  'Indian Institute of Information Technology, Guwahati',
  'National Institute of Technology, Silchar',
  'National Institute of Technology, Manipur',
  'National Institute of Technology, Meghalaya',
  'National Institute of Technology, Mizoram',
  'National Institute of Technology, Nagaland',
  'Other',
];

export const branches = [
  'Computer Science and Engineering',
  'Electronics and Communication Engineering',
  'Electronics and Instrumentation Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biotechnology',
  'Production Engineering',
  'Computational Mathematics',
  'B.S. + M.S. in Mathematics and Computing',
  'Other',
];

export const userSideNavItems: SideNavItem[] = [
  {
    name: 'Dashboard',
    Icon: RxDashboard,
    href: '/dashboard',
  },
  {
    name: 'Events',
    Icon: HiOutlineTicket,
    href: '/dashboard/events',
  },
  {
    name: 'Notifications',
    Icon: HiOutlineBell,
    href: '/dashboard/notifications',
  },
  {
    name: 'Analytics',
    Icon: HiOutlineChartSquareBar,
    href: '/dashboard/analytics',
  },
  {
    name: 'Account',
    Icon: HiOutlineUserCircle,
    href: '/dashboard/account',
  },
];

import {
  PiUsersThreeBold,
  PiScrollBold,
  PiCalendarBlankBold,
} from 'react-icons/pi';

export const clubDashboardSidebarNavItems: SideNavItem[] = [
  {
    name: 'Club Details',
    Icon: PiUsersThreeBold,
    href: '/club-dashboard',
  },
  {
    name: 'Events',
    Icon: PiCalendarBlankBold,
    href: '/club-dashboard/events',
    regexp: new RegExp(`^\/club-dashboard\/events(?:\/.*)?$`),
  },
  {
    name: 'Forms',
    Icon: PiScrollBold,
    href: '/club-dashboard/forms',
    regexp: new RegExp(`^\/club-dashboard\/forms(?:\/.*)?$`),
  },
];

export const commandItems = [
  {
    name: 'Upcoming Events',
    href: '/dashboard/events',
    Icon: PiCalendarBlankBold,
  },
  {
    name: 'Notifications',
    href: '/dashboard/notifications',
    Icon: HiOutlineBell,
  },
  {
    name: 'All Events',
    href: '/events',
    Icon: HiOutlineTicket,
  },
  {
    name: 'All Clubs',
    href: '/clubs',
    Icon: PiUsersThreeBold,
  },
];

export const homePageItems: SideNavItem[] = [
  {
    name: 'All Events',
    Icon: HiOutlineTicket,
    href: '/events',
  },
  {
    name: 'All Clubs',
    Icon: PiUsersThreeBold,
    href: '/clubs',
  },
  {
    name: 'All Forms',
    Icon: PiScrollBold,
    href: '/forms',
  },
  {
    name: 'Dashboard',
    Icon: RxDashboard,
    href: '/dashboard',
  },
];
