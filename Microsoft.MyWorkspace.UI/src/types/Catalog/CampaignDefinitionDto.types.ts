export interface CampaignDefinitionDto {
  CampaignId: string;
  GovernedChannelType: number;
  StartTimeUtc?: string;
  EndTimeUtc?: string;
  NominationScheme: CampaignNominationScheme;
  SurveyTemplate: CampaignSurveyTemplate;
  AdditionalDataRequested?: string[];
}

interface CampaignDuration {
  Type: 0;
  IntervalSeconds: number;
}

interface CampaignNominationScheme {
  Type: number;
  PercentageNumerator: number;
  PercentageDenominator: number;
  NominationPeriod: CampaignDuration;
  CooldownPeriod?: CampaignDuration;
  FallbackSurveyDurationSeconds?: number;
}

interface CampaignSurveyEventCountedActivity {
  Type: number;
  Activity: string;
  IsAggregate: boolean;
  Count: number;
}

type CampaignSurveyEvent =
  | {
      Type: 0;
      Activity: string;
      Count: number;
      IsAggregate: boolean;
    }
  | {
      Type: 1;
      Sequence: CampaignSurveyEventCountedActivity[];
    };

interface CampaignSurveyContent {
  Prompt: {
    Title: string;
    Question: string;
    YesLabel: string;
    NoLabel: string;
  };
  Rating: {
    IsZeroBased: boolean;
    Question: string;
    RatingValuesAscending: string[];
  };
  Question: { Question: string };
}

interface CampaignSurveyTemplate {
  Type: number;
  ActivationEvent: CampaignSurveyEvent;
  Content?: CampaignSurveyContent;
}
