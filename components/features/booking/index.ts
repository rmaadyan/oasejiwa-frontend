// Hero & Layout
export { default as BookingHero } from "./BookingHero";
export { default as BookingNavigation } from "./BookingNavigation";

// Service Selection
export { default as ServiceSelectionSection } from "./ServiceSelectionSection";
export type { Service } from "./ServiceSelectionSection";

// Psychologist Selection
export { default as PsychologistFilterBar } from "./PsychologistFilterBar";
export { default as PsychologistListSection } from "./PsychologistListSection";
export type { Psychologist } from "./PsychologistListSection";

// Schedule Selection
export { default as ScheduleSection } from "./ScheduleSection";
export { default as ScheduleSummary } from "./ScheduleSummary";
export type { PsychologistProfile } from "./ScheduleSection";
export type { DateOption, RawSchedule } from "@/lib/booking-data";
// Payment
export { default as PaymentMethodsSection } from "./PaymentMethodsSection";
export { default as BookingSummaryCard } from "./BookingSummaryCard";
export { default as PaymentDetailsCard } from "./PaymentDetailsCard";
export { default as PaymentInstructionsCard } from "./PaymentInstructionsCard";
export { default as PaymentUploadSection } from "./PaymentUploadSection";
export { default as PaymentTimer } from "./PaymentTimer";
export { default as PaymentSuccessCard } from "./PaymentSuccessCard";
export { default as PaymentHelpSection } from "./PaymentHelpSection";
export type { PaymentMethod } from "./PaymentMethodsSection";
export type { BookingSummary } from "./BookingSummaryCard";

// Page-level Components
export {
  ServiceSelectionContent,
  PsychologistSelectionContent,
  ScheduleSelectionContent,
  PaymentMethodContent,
  PaymentConfirmationContent,
} from "./pages";
export type { PaymentData } from "./pages";

