export interface Contribution {
  id: string;
  garhwaliWord: string;
  hindiMeaning: string;
  englishMeaning: string;
  usageExample?: string;
  contributorName?: string;
  contributorEmail?: string;
  submittedAt: string;
}

export interface ContributionFormData {
  garhwaliWord: string;
  hindiMeaning: string;
  englishMeaning: string;
  usageExample?: string;
  contributorName?: string;
  contributorEmail?: string;
}

export interface ContributionWithMetadata extends Contribution {
  status: 'pending' | 'approved' | 'rejected';
}
