"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoCall } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import { FaRegClock } from "react-icons/fa6";
import { FaLocationDot, FaWhatsapp } from "react-icons/fa6";
import { FiLoader, FiAlertCircle, FiCheckCircle, FiSend } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateInquiry } from "@/hooks/useInquiry";
import { z } from "zod";

// Validation schema for the inquiry form
const inquiryFormSchema = z.object({
  fullname: z.string().min(1, "Full name is required").max(100, "Full name cannot exceed 100 characters"),
  phonenumber: z.string().min(1, "Phone number is required").max(20, "Phone number cannot exceed 20 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address").max(100, "Email cannot exceed 100 characters"),
  subject: z.string().min(1, "Subject is required").max(150, "Subject cannot exceed 150 characters"),
  description: z.string().min(1, "Message is required").max(1000, "Message cannot exceed 1000 characters"),
});

export default function ContactPage() {
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const createInquiryMutation = useCreateInquiry();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(inquiryFormSchema),
    mode: "onChange",
    defaultValues: {
      fullname: "",
      phonenumber: "",
      email: "",
      subject: "",
      description: "",
    },
  });

  // Watch for character counts
  const watchedDescription = watch("description");
  const watchedSubject = watch("subject");

  const handleInquirySubmit = async (data) => {
    try {
      setFormError("");
      setFormSuccess(false);

      console.log("Form submit started with data:", data);

      // Prepare submission data
      const submissionData = {
        fullname: data.fullname.trim(),
        phonenumber: data.phonenumber.trim(),
        email: data.email.trim().toLowerCase(),
        subject: data.subject.trim(),
        description: data.description.trim(),
      };

      await createInquiryMutation.mutateAsync(submissionData);

      setFormSuccess(true);
      reset();

      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormSuccess(false);
      }, 5000);

      console.log("Form submission completed successfully");
    } catch (error) {
      console.error("Form submission error:", error);

      // Enhanced error handling
      let errorMessage = "Unknown error occurred";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.details) {
        errorMessage = Array.isArray(error.response.data.details)
          ? error.response.data.details.join(", ")
          : error.response.data.details;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setFormError(errorMessage);
    }
  };

  const isSubmittingForm = isSubmitting || createInquiryMutation.isPending;

  return (
    <section className="w-full min-h-[80vh] bg-white px-2 pt-0">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12 pt-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Contact Us</h1>
        <div className="w-24 h-1 bg-primary mx-auto my-2"></div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          We're here to help! Reach out for product inquiries, support, or just to say hello. Our team will get back to you as soon as possible.
        </p>
      </div>

      <div className="max-w-6xl mx-auto mt-4 mb-15 rounded-xl overflow-hidden shadow-lg">
        <iframe
          title="Jeeko Agro Industries Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3904.0382621220806!2d70.63602267529136!3d22.259444179715963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959cd0078ebc8eb%3A0xc22087af2a2420dd!2sJEEKO%20AGRITECH%20LLP!5e1!3m2!1sen!2sin!4v1757067033891!5m2!1sen!2sin"
          width="100%"
          height="500"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Additional Contact Information */}
      <div className="max-w-6xl mx-auto mt-16 bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Other Ways to Reach Us</h3>
          <p className="text-gray-600">Choose the method that works best for you</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors duration-200">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <IoCall className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-semibold mb-2">Sales Inquiry</h4>
            <p className="text-sm text-gray-600">For product information and quotes</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors duration-200">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <IoMdMail className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-semibold mb-2">Technical Support</h4>
            <p className="text-sm text-gray-600">For product support and troubleshooting</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors duration-200">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaWhatsapp className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-semibold mb-2">Quick Chat</h4>
            <p className="text-sm text-gray-600">Instant messaging for quick questions</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mt-14 mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 pb-5 items-start">
        {/* Contact Info */}
        <div className="space-y-5">
          <div className="p-6 flex items-start gap-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="bg-primary rounded-xl p-3">
              <IoCall className="size-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold">Call Us</div>
              <div className="text-gray-600">+91 99252 32951</div>
              <div className="text-xs text-gray-500 mt-1">Available during business hours</div>
            </div>
          </div>

          <div className="p-6 flex items-start gap-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="bg-primary rounded-xl p-3">
              <IoMdMail className="size-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold">Email</div>
              <div className="text-gray-600">jeekoagritech@gmail.com</div>
              <div className="text-xs text-gray-500 mt-1">We'll respond within 24 hours</div>
            </div>
          </div>

          <div className="p-6 flex items-start gap-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="bg-primary rounded-xl p-3">
              <FaRegClock className="size-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold">Operational Hours</div>
              <div className="text-gray-600">09:00 AM - 05:00 PM</div>
              <div className="text-xs text-gray-500 mt-1">Monday to Saturday</div>
            </div>
          </div>

          <div className="p-6 flex items-start gap-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="bg-primary rounded-xl p-3">
              <FaLocationDot className="size-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold">Location</div>
              <div className="text-gray-600">
               Plot no:-332, Road-R, Gate NO. 2, Phase -1 khirasara GIDC,<br />
               Tal. Lodhika, Rajkot -360021, Gujarat, India.
              </div>
            </div>
          </div>

          {/* WhatsApp Contact Button */}
          <a
            href="https://wa.me/919925232951?text=Hello, I would like to inquire about your products."
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200" size="lg">
              <FaWhatsapp className="size-5" /> Enquire on WhatsApp
            </Button>
          </a>

          {/* Additional Contact Methods */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-800 font-medium mb-2">Need immediate assistance?</p>
            <p className="text-xs text-blue-600">
              For urgent inquiries, please call us directly or use WhatsApp for faster response.
            </p>
          </div>
        </div>
        
        {/* Contact Form - Inline Form Code */}
        <div className="w-full">
          <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">
              Send us a message
            </h2>

            {/* Success Message */}
            {formSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start">
                <FiCheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium">Message Sent Successfully!</p>
                  <p className="text-green-700 text-sm mt-1">
                    Thank you for contacting us. We'll get back to you soon!
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {formError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
                <FiAlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">Submission Failed</p>
                  <p className="text-red-700 text-sm mt-1">{formError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(handleInquirySubmit)} className="space-y-4 sm:space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullname" className="text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <Input
                  {...register("fullname")}
                  type="text"
                  id="fullname"
                  placeholder="Enter your full name"
                  className={`
                    w-full transition-all duration-200
                    ${
                      errors.fullname
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                        : "focus:border-primary focus:ring-primary"
                    }
                  `}
                  maxLength={100}
                  disabled={isSubmittingForm}
                />
                {errors.fullname && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <FiAlertCircle className="w-4 h-4 mr-1" />
                    {errors.fullname.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label htmlFor="phonenumber" className="text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <Input
                  {...register("phonenumber")}
                  type="tel"
                  id="phonenumber"
                  placeholder="Enter your phone number"
                  className={`
                    w-full transition-all duration-200
                    ${
                      errors.phonenumber
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                        : "focus:border-primary focus:ring-primary"
                    }
                  `}
                  maxLength={20}
                  disabled={isSubmittingForm}
                />
                {errors.phonenumber && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <FiAlertCircle className="w-4 h-4 mr-1" />
                    {errors.phonenumber.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <Input
                  {...register("email")}
                  type="email"
                  id="email"
                  placeholder="Enter your email address"
                  className={`
                    w-full transition-all duration-200
                    ${
                      errors.email
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                        : "focus:border-primary focus:ring-primary"
                    }
                  `}
                  maxLength={100}
                  disabled={isSubmittingForm}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <FiAlertCircle className="w-4 h-4 mr-1" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                  Subject *
                </label>
                <Input
                  {...register("subject")}
                  type="text"
                  id="subject"
                  placeholder="Enter the subject of your inquiry"
                  className={`
                    w-full transition-all duration-200
                    ${
                      errors.subject
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                        : "focus:border-primary focus:ring-primary"
                    }
                  `}
                  maxLength={150}
                  disabled={isSubmittingForm}
                />
                <div className="flex justify-between items-center">
                  {errors.subject ? (
                    <p className="text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.subject.message}
                    </p>
                  ) : (
                    <div></div>
                  )}
                  <p className="text-xs text-gray-500">{watchedSubject?.length || 0}/150</p>
                </div>
              </div>

              {/* Message/Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Message *
                </label>
                <Textarea
                  {...register("description")}
                  id="description"
                  placeholder="Tell us more about your inquiry. Please provide as much detail as possible so we can assist you better."
                  className={`
                    w-full min-h-[120px] transition-all duration-200 resize-none
                    ${
                      errors.description
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500"
                        : "focus:border-primary focus:ring-primary"
                    }
                  `}
                  rows={5}
                  maxLength={1000}
                  disabled={isSubmittingForm}
                />
                <div className="flex justify-between items-center">
                  {errors.description ? (
                    <p className="text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.description.message}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Please provide detailed information to help us assist you better
                    </p>
                  )}
                  <p className="text-xs text-gray-500">{watchedDescription?.length || 0}/1000</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmittingForm || !isValid || !isDirty}
                  className={`
                    w-full flex items-center justify-center py-3 px-6 text-base font-medium
                    bg-gradient-to-r from-primary to-primary/90
                    hover:from-primary/90 hover:to-primary
                    disabled:from-gray-400 disabled:to-gray-500
                    disabled:cursor-not-allowed disabled:opacity-75
                    text-white rounded-lg shadow-lg hover:shadow-xl
                    transform transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    ${!isSubmittingForm && isValid && isDirty ? "hover:scale-[1.02]" : ""}
                  `}
                >
                  {isSubmittingForm ? (
                    <>
                      <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-3 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>

              {/* Form Helper Text */}
              <div className="pt-2">
                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to our terms of service and privacy policy.
                  We'll only use your information to respond to your inquiry.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
