import { BasicInfoFormDataTypes, AboutFormDataTypes, ImageType, ContactFormType, LinkType, ThemeSettingsType, ColorType } from "./restaurant";

export type TeamDataType = {
  basicInfoData?: BasicInfoFormDataTypes | null;
  aboutData?: AboutFormDataTypes | null;
  coverImageData?: ImageType;
  contactFormData?: ContactFormType | null;
  links?: {
      social: LinkType[];
      custom: LinkType[];
  };
  themeSettings?: ThemeSettingsType;
  favoriteColors?: ColorType[];
  createdOn: Date | string | null,
  title?: string | null;
  id?: string | null;
  teamId?: string | null;
  teamMasterId?: string | null;
}