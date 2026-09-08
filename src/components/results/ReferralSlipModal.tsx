import React from 'react';
import { ScreeningResponse, PatientInfo } from '../../types/screening';
import { ScreeningReportModal, ClinicianReviewData, ReportMode } from './ScreeningReportModal';

interface ReferralSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientInfo;
  screening: ScreeningResponse;
  mode?: 'referral' | 'human_review' | 'screening_report' | 'referral_summary';
  clinicianReview?: ClinicianReviewData;
  imageUrl?: string;
}

export const ReferralSlipModal: React.FC<ReferralSlipModalProps> = ({
  isOpen,
  onClose,
  patient,
  screening,
  mode = 'referral_summary',
  clinicianReview,
  imageUrl,
}) => {
  const reportMode: ReportMode =
    mode === 'screening_report'
      ? 'screening_report'
      : mode === 'referral' || mode === 'referral_summary'
      ? 'referral_summary'
      : 'referral_summary';

  return (
    <ScreeningReportModal
      isOpen={isOpen}
      onClose={onClose}
      mode={reportMode}
      patient={patient}
      screening={screening}
      imageUrl={imageUrl}
      clinicianReview={clinicianReview}
    />
  );
};

