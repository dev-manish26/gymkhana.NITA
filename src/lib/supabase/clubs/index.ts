'use server';

import type { ClubDetailsType, ClubSocialsType } from '~/lib/zod';
import createSupabaseServerClient from '../client/server';

export const getClubForOwner = async (owner_id: string) => {
  const supabase = await createSupabaseServerClient();
  const res = await supabase.from('clubs').select('*').eq('owner_id', owner_id);

  if (res.error) {
    return null;
  }

  const club = res.data.at(0);

  return club ?? null;
};
export const updateClubAppearanceDetails = async (
  club_id: string,
  data: {
    logo: string;
    cover_image: string;
    banner_image: string;
  }
) => {
  const supabase = await createSupabaseServerClient();

  const res = await supabase
    .from('clubs')
    .update({
      logo_url: data.logo,
      cover_photo_url: data.cover_image,
      banner_image_url: data.banner_image,
    })
    .eq('club_id', club_id);

  if (res.error) {
    throw new Error(res.error.message);
  }
};

export const updateClubBasicDetails = async (
  club_id: string,
  data: ClubDetailsType
) => {
  const supabase = await createSupabaseServerClient();

  const res = await supabase.from('clubs').update(data).eq('club_id', club_id);

  if (res.error) {
    throw new Error(res.error.message);
  }
};

export const updateClubSocials = async (
  club_id: string,
  data: ClubSocialsType
) => {
  const supabase = await createSupabaseServerClient();

  const res = await supabase.from('clubs').update(data).eq('club_id', club_id);

  if (res.error) {
    throw new Error(res.error.message);
  }
};

export const getActiveClubById = async (club_id: string) => {
  const supabase = await createSupabaseServerClient();
  const res = await supabase
    .from('clubs')
    .select('*')
    .eq('club_id', club_id)
    .eq('is_public', true);

  if (res.error) {
    return null;
  }

  const club = res.data.at(0);

  return club ?? null;
};

export const getActiveClubs = async () => {
  const supabase = await createSupabaseServerClient();
  const res = await supabase.from('clubs').select('*').eq('is_public', true);

  if (res.error) {
    return [];
  }
  return res.data;
};
