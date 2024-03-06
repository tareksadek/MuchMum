import { vCardFormatter } from "./vcardFormatter";

interface Photo {
  url: string;
  mediaType: string;
  base64: boolean;
  embedFromString(base64String: string, mediaType: string): void;
}

interface MailingAddress {
  label: string;
  street: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  countryRegion: string;
}

interface SocialUrls {
  [key: string]: string;
  facebook: string;
  linkedIn: string;
  twitter: string;
  flickr: string;
}

interface VCard {
  uid: string;
  cellPhone: string;
  email: string;
  workEmail: string;
  firstName: string;
  lastName: string;
  homeAddress: MailingAddress;
  homePhone: string;
  homeFax: string;
  logo: Photo;
  middleName: string;
  namePrefix: string;
  nameSuffix: string;
  note: string;
  organization: string;
  photo: Photo;
  role: string;
  socialUrls: SocialUrls;
  source: string;
  title: string;
  url: string;
  workUrl: string;
  workAddress: MailingAddress;
  workPhone: string;
  workFax: string;
  version: string;
  getMajorVersion(): number;
  getFormattedString(): string;
}

const vCard = (): VCard => {

  const getPhoto = (): Photo => {
      return {
          url: '',
          mediaType: '',
          base64: false,
          embedFromString: function(base64String: string, mediaType: string): void {
              this.mediaType = mediaType;
              this.url = base64String;
              this.base64 = true;
          }
      };
  }

  const getMailingAddress = (): MailingAddress => {
      return {
          label: '',
          street: '',
          city: '',
          stateProvince: '',
          postalCode: '',
          countryRegion: ''
      };
  }

  const getSocialUrls = (): SocialUrls => {
      return {
          facebook: '',
          linkedIn: '',
          twitter: '',
          flickr: ''
      };
  }

  return {
      uid: '',
      cellPhone: '',
      email: '',
      workEmail: '',
      firstName: '',
      lastName: '',
      homeAddress: getMailingAddress(),
      homePhone: '',
      homeFax: '',
      logo: getPhoto(),
      middleName: '',
      namePrefix: '',
      nameSuffix: '',
      note: '',
      organization: '',
      photo: getPhoto(),
      role: '',
      socialUrls: getSocialUrls(),
      source: '',
      title: '',
      url: '',
      workUrl: '',
      workAddress: getMailingAddress(),
      workPhone: '',
      workFax: '',
      version: '3.0',

      getMajorVersion: function(): number {
        const majorVersionNumber = Number(this.version ? this.version.split('.')[0] : '4');
        return !Number.isNaN(majorVersionNumber) ? majorVersionNumber : 4;
      },
    
      getFormattedString: function(): string {
        return vCardFormatter.getFormattedString(this);
      }
  };
};

export default vCard;
