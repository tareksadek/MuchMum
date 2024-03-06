
export type DietaryRestrictionType = {
  id: string;
  name: string;
};

export type DishType = {
  id: string;
  name: string;
};

export type CustomTag = {
  id: string;
  name: string;
};

export type MenuAttribute = {
  id: string;
  name: string;
};

export type MenuItemType = {
  id: string; 
  sortOrder: number;
  name: string;
  sectionId?: string;
  description?: string;
  originalPrice?: number;
  discount?: number;
  netPrice?: number;
  dietaryRestrictions?: DietaryRestrictionType[];
  type?: DishType[];
  tags?: CustomTag[];
  attributes?: {
    spiciness: MenuAttribute[];
    temperature: MenuAttribute[];
  };
  imageUrl?: string | null;
  visible?: boolean;
  image?: {
    blob?: Blob;
  };
};

export type MenuSectionType = {
  id: string; 
  sortOrder: number;
  name: string | null;
  description?: string | null;
  imageUrl?: string | null;
  items?: MenuItemType[];
  visible?: boolean;
  image?: {
    blob?: Blob;
  } | null;
};

export type MenuType = {
  id?: string; 
  name?: string;
  description?: string;
  sections?: MenuSectionType[];
  isActive?: boolean;
};