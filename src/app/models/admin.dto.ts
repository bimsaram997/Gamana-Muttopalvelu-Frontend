export interface TranslationDto {
  languageCode: string;
  [key: string]: any;
}

export interface PackageTranslationDto {
  languageCode: string;
  title: string;
  priceDisplay: string;
  unit: string;
  description: string;
}

export interface PackageFeatureTranslationDto {
  languageCode: string;
  text: string;
}

export interface PackageFeatureDto {
  displayOrder: number;
  translations: PackageFeatureTranslationDto[];
}

export interface PackageUpsertDto {
  ratePerHour: number;
  isPopular: boolean;
  displayOrder: number;
  isActive: boolean;
  translations: PackageTranslationDto[];
  features: PackageFeatureDto[];
}

export interface PackageResponseDto extends PackageUpsertDto {
  id: number;
}

export interface SimpleServiceUpsertDto {
  displayOrder: number;
  isActive: boolean;
  translations: { languageCode: string; name: string }[];
}

export interface SimpleServiceResponseDto extends SimpleServiceUpsertDto {
  id: number;
}

export interface ProcessStepUpsertDto {
  stepNumber: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
  translations: { languageCode: string; title: string; description: string }[];
}

export interface ProcessStepResponseDto extends ProcessStepUpsertDto {
  id: number;
}

export interface DetailedServiceUpsertDto {
  icon: string;
  displayOrder: number;
  isActive: boolean;
  translations: { languageCode: string; title: string; subtitle: string; description: string }[];
  highlights: { displayOrder: number; translations: { languageCode: string; text: string }[] }[];
}

export interface DetailedServiceResponseDto extends DetailedServiceUpsertDto {
  id: number;
}

export interface FormOptionUpsertDto {
  displayOrder: number;
  isActive: boolean;
  translations: { languageCode: string; label: string }[];
}

export interface FormOptionResponseDto extends FormOptionUpsertDto {
  id: number;
}


export interface ReviewTranslationDto {
  languageCode: string;
 
  serviceUsed?: string;
  comment: string;
}

export interface ReviewUpsertDto {
   location?: string;
  author: string;
  rating: number; // 1 to 5
  displayOrder: number;
  isActive: boolean;
  translations: ReviewTranslationDto[];
}

export interface ReviewResponseDto extends ReviewUpsertDto {
  id: number;
  createdAt?: string;
}