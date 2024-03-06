import { MenuType } from "./menu";

export type BasicInfoFormDataTypes = {
  title?: string | null; 
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone1?: string | null;
  phone2?: string | null;
  address?: string | null;
  location?: {
    lat: number, 
    lng: number
  } | null;
};

export type AboutFormDataTypes = {
  about?: string | null;
  videoUrl?: string | null;
};

export type ProfileTitleTypes = {
  title?: string | null;
}

export type FirstReadImageDimensionsType = {
  width: number;
  height: number;
} | null;

export type CroppedArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ImageType = {
  url?: string | null;
  blob?: Blob | null;
  base64?: string | null;
}

export type LinkType = {
  active?: boolean;
  position: number;
  isSocial: boolean;
  isCustom: boolean;
  platform: string;
  url: string;
  title?: string;
  clicked?: number;
  id?: string;
};

export type ContactFormType = { 
  formProvider?: string | null;
  embedCode?: string | null;
}

export type ThemeSettingsType = {
  selectedColor: { name: string; code: string };
  theme: 'light' | 'dark';
  layout: 'default' | 'business' | 'card' | 'social';
  socialLinksToSelectedColor: boolean;
};

export type ColorType = {
  name: string;
  code: string;
};

export type VisitType = {
  userId: string;
  restaurantId: string;
  visitedOn: Date | string;
}

export type RestaurantDataType = {
  basicInfoData?: BasicInfoFormDataTypes | null;
  aboutData?: AboutFormDataTypes | null;
  coverImageData?: ImageType | null;
  profileImageData?: ImageType | null;
  contactFormData?: ContactFormType | null;
  links?: {
      social: LinkType[];
      custom: LinkType[];
  };
  menus?: MenuType[];
  activeMenuId?: string;
  themeSettings?: ThemeSettingsType;
  favoriteColors?: ColorType[] | null;
  createdOn?: Date | string | null,
  title?: string | null;
  contacts?: number | null;
  addedToContacts?: number | null;
  visits?: number | null;
  id?: string | null;
  userId?: string | null;
}

export type restaurantExtractType = {
  profileTitle: string | null;
  profileId: string | null;
}

export type RestaurantListType = {
  restaurantsList: restaurantExtractType[];
}

export type CreateRestaurantResponseType = 
  // | { success: true; profile: { id: string; title: string } }
  | { success: true; restaurant: { id: string; title: string, data: RestaurantDataType } }
  | { success: false; error: string }
  | { success: boolean; url?: string | null };

