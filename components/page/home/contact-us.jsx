"use client";

import { IoCall } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import { FaRegClock } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiLoader, FiAlertCircle, FiCheckCircle, FiSend } from "react-icons/fi";
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

export default function ContactUs() {
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

  // Watch description for character count
  const watchedDescription = watch("description");
  const watchedSubject = watch("subject");

  const onSubmit = async (data) => {
    try {
      setFormError("");
      setFormSuccess(false);

      console.log("🔄 Form submit started with data:", data);

      // Prepare submission data
      const submissionData = {
        fullname: data.fullname.trim(),
        phonenumber: data.phonenumber.trim(),
        email: data.email.trim().toLowerCase(),
        subject: data.subject.trim(),
        description: data.description.trim(),
      };

      console.log("📤 Final submission data:", JSON.stringify(submissionData, null, 2));

      await createInquiryMutation.mutateAsync(submissionData);

      setFormSuccess(true);
      reset();

      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormSuccess(false);
      }, 5000);

      console.log("✅ Form submission completed successfully");
    } catch (error) {
      console.error("💥 Form submission error:", error);

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
    <div className="bg-primary w-full py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
        {/* Contact Information Section */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Get in touch</h2>
          <h3 className="text-white text-lg sm:text-xl mb-2">We're Here to Help</h3>
          <p className="text-white text-sm sm:text-base mt-2 mb-6 leading-relaxed">
            If you have any questions, concerns, or feedback, we're here to assist you. Our team is
            dedicated to providing support and ensuring your experience is smooth and hassle-free.
            Don't hesitate to reach out to us—we'd love to hear from you!
          </p>

          <div className="bg-gray-100 rounded-xl p-4 sm:p-6 grid grid-cols-1 gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full bg-white p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="bg-primary rounded-xl p-2 sm:p-3 flex-shrink-0">
                <IoCall className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-lg sm:text-xl font-bold">Call Us</div>
                <div className="text-sm sm:text-base">+91 9156261648</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full bg-white p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="bg-primary rounded-xl p-2 sm:p-3 flex-shrink-0">
                <FaRegClock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-lg sm:text-xl font-bold">Operational</div>
                <div className="text-sm sm:text-base">09:00 AM - 05:00 PM</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full bg-white p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="bg-primary rounded-xl p-2 sm:p-3 flex-shrink-0">
                <IoMdMail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-lg sm:text-xl font-bold">Email</div>
                <div className="text-sm sm:text-base">marketing@jeeko.com</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full bg-white p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="bg-primary rounded-xl p-2 sm:p-3 flex-shrink-0">
                <FaLocationDot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-lg sm:text-xl font-bold">Location</div>
                <div className="text-sm sm:text-base">
                  GAT No. 2022/5, Ambethan Bordara Road, Chakan Road, Chakan, Pune, Maharashtra,
                  410501
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="w-full lg:w-1/2">
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
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
    </div>
  );
}
