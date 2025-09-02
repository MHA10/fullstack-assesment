'use client';

import React, { useState, useEffect } from 'react';
import { Button, Alert, Card, Input, Textarea } from '@/components/ui';
import { ContactFormData } from '@/types';
import { isValidEmail } from '@/utils';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  // Auto-dismiss toast messages after 5 seconds
  useEffect(() => {
    if (submitStatus === 'success' || submitStatus === 'error') {
      const timer = setTimeout(() => {
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateFormData = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormData()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you! Your message has been sent successfully.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        const errorData = await response.json();
        setSubmitStatus('error');
        setSubmitMessage(errorData.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <Card.Header>
        <Card.Title className="text-center">User Registration</Card.Title>
        <Card.Description className="text-center text-gray-600 mt-2">
          Create your account and receive a welcome email notification
        </Card.Description>
      </Card.Header>
      
      <Card.Content>
        {submitStatus === 'success' && (
          <Alert type="success" message="Account created successfully! A welcome email has been sent to your inbox." className="mb-4" />
        )}
        
        {submitStatus === 'error' && (
          <Alert type="error" message={submitMessage} className="mb-4" />
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              required
            />
          </div>

          <div className="space-y-2 sm:space-y-3">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
            />
          </div>

          <div className="space-y-2 sm:space-y-3">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Welcome Message *
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about yourself or leave a welcome message"
              value={formData.message}
              onChange={handleTextareaChange}
              error={errors.message}
              required
              rows={4}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account & Send Welcome Email'}
          </Button>
        </form>
      </Card.Content>
    </Card>
  );
};

export default ContactForm;