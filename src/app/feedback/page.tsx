'use client';
import { useState } from 'react';
import { format } from 'date-fns';

import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { toast } from 'react-hot-toast';

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    enrollment: '',
    branch: '',
    queryFeedback: '',
    imageUrl: '',
    issued_at: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', preset);

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: form,
        }
      );

      if (!res.ok) {
        throw new Error('Failed to upload image');
      }

      const data = (await res.json()) as { secure_url: string };
      setFormData({ ...formData, imageUrl: data.secure_url });
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const googleUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBAPP!;

    const payload = {
      ...formData,
      issued_at: format(new Date(), 'dd,MMM,yyyy'),
    };

    const params = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) =>
      params.append(key, value)
    );

    setLoading(true);
    try {
      const response = await fetch(googleUrl, {
        method: 'POST',
        body: params,
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      toast.success('Form submitted successfully!');
      setFormData({
        name: '',
        enrollment: '',
        branch: '',
        queryFeedback: '',
        imageUrl: '',
        issued_at: '',
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8'>
      {/* Header Section */}
      <div className='mb-6 text-center sm:mb-8'>
        <h1 className='mb-3 text-2xl font-bold text-gray-900 sm:mb-4 sm:text-3xl lg:text-4xl'>
          Feedback & Query Form
        </h1>
        <p className='text-sm text-gray-600 sm:text-base lg:text-lg'>
          We value your feedback and are here to help with any queries you may
          have. Please fill out the form below.
        </p>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className='space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-lg sm:space-y-6 sm:p-6 lg:p-8'
      >
        {/* Name Field */}
        <div className='space-y-2'>
          <Label htmlFor='name' className='text-sm font-medium text-gray-700'>
            Full Name <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='name'
            type='text'
            name='name'
            placeholder='Enter your full name'
            value={formData.name}
            onChange={handleChange}
            className='w-full focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50'
            required
          />
        </div>

        {/* Enrollment and Branch Fields */}
        <div className='grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2'>
          <div className='space-y-2'>
            <Label
              htmlFor='enrollment'
              className='text-sm font-medium text-gray-700'
            >
              Enrollment Number <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='enrollment'
              type='text'
              name='enrollment'
              placeholder='Enter enrollment number'
              value={formData.enrollment}
              onChange={handleChange}
              className='w-full focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50'
              required
            />
          </div>
          <div className='space-y-2'>
            <Label
              htmlFor='branch'
              className='text-sm font-medium text-gray-700'
            >
              Branch <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='branch'
              type='text'
              name='branch'
              placeholder='Enter your branch'
              value={formData.branch}
              onChange={handleChange}
              className='w-full focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50'
              required
            />
          </div>
        </div>

        {/* Query/Feedback Field */}
        <div className='space-y-2'>
          <Label
            htmlFor='queryFeedback'
            className='text-sm font-medium text-gray-700'
          >
            Query/Feedback <span className='text-red-500'>*</span>
          </Label>
          <Textarea
            id='queryFeedback'
            name='queryFeedback'
            placeholder='Please describe your query or provide your feedback in detail'
            value={formData.queryFeedback}
            onChange={handleChange}
            className='w-full focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50'
            rows={4}
            required
          />
        </div>

        {/* Image Upload Field */}
        <div className='space-y-2'>
          <Label htmlFor='image' className='text-sm font-medium text-gray-700'>
            Attach Image (Optional)
          </Label>
          <div className='space-y-2'>
            <Input
              id='image'
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              className='w-full cursor-pointer focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50'
            />
            <p className='text-xs text-gray-500 sm:text-sm'>
              Upload an image if it helps explain your query or feedback
            </p>
            {loading && (
              <p className='text-xs text-blue-600 sm:text-sm'>
                📤 Uploading image...
              </p>
            )}
            {formData.imageUrl && (
              <p className='text-xs text-green-600 sm:text-sm'>
                ✅ Image attached
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className='pt-2 sm:pt-4'>
          <Button
            type='submit'
            className='w-full bg-primary py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 focus:ring-offset-2 sm:py-3 sm:text-base'
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit Feedback'}
          </Button>
        </div>

        {/* Required Fields Note */}
        <p className='text-xs text-gray-500 sm:text-sm'>
          <span className='text-red-500'>*</span> indicates required fields
        </p>
      </form>
    </div>
  );
}
