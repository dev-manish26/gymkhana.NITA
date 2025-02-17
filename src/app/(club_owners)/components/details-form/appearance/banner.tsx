'use client';

import React from 'react';
import Image from 'next/image';

import { useController } from 'react-hook-form';
import type { ControllerRenderProps, Control } from 'react-hook-form';
import type { ClubAppearanceType } from '~/lib/zod';

import { AspectRatio } from '~/components/ui/aspect-ratio';

import { HiOutlineUpload, HiOutlineSwitchHorizontal } from 'react-icons/hi';

import { Button } from '~/components/ui/button';
import { getImageLink } from '~/lib/utils';

interface Props
  extends ControllerRenderProps<ClubAppearanceType, 'banner_image'> {
  loading?: boolean;
  control: Control<ClubAppearanceType, unknown, ClubAppearanceType>;
  currentBanner: string;
}

const BannerImageUpload = ({
  name,
  value,
  ref,
  control,
  currentBanner,
}: Props) => {
  const { field } = useController({ name, control });
  const [image, setImage] = React.useState<string | null>(null);

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  React.useEffect(() => {
    if (value) {
      getBase64(value)
        .then((base64) => setImage(base64))
        .catch((error) => console.log(error));
    }
  }, []);

  const onImageChange = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files?.[0]) {
        const file = event.target.files[0];
        if (!file) return;
        const base64 = await getBase64(file);
        setImage(base64);
        field.onChange(file);
      }
    },
    []
  );
  return (
    <div className='flex flex-col'>
      <div className='w-full'>
        <AspectRatio ratio={4} className=''>
          <Image
            src={
              image ??
              getImageLink(currentBanner) ??
              'https://placehold.co/1200x630@3x.png?text=Banner+Image+\n(1200x300)'
            }
            className='w-full rounded-md object-cover'
            alt='image'
            fill
          />
        </AspectRatio>
      </div>

      <div className='my-2 flex'>
        <input
          type='file'
          name={name}
          ref={ref}
          onChange={onImageChange}
          accept='image/*'
          className='w-fit'
          hidden
          id='banner-file'
        />
        <Button variant='outline' asChild>
          <label
            htmlFor='banner-file'
            className='flex flex-row items-center gap-2'
          >
            {image ? (
              <HiOutlineSwitchHorizontal className=' text-lg text-neutral-600' />
            ) : (
              <HiOutlineUpload className='text-lg text-neutral-600' />
            )}
            {image ? 'Change' : 'Upload'}
          </label>
        </Button>
      </div>
    </div>
  );
};

export default BannerImageUpload;
