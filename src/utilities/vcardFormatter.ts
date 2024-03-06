type VCard = {
  version: string,
  formattedName?: string,
  firstName?: string,
  middleName?: string,
  lastName?: string,
  namePrefix?: string,
  nameSuffix?: string,
  nickname?: string,
  gender?: string,
  uid?: string,
  organization?: string,
  birthday?: Date,
  anniversary?: Date,
  email?: string[] | string,
  workEmail?: string[] | string,
  otherEmail?: string[] | string,
  logo?: { url: string, mediaType: string, base64: boolean },
  photo?: { url: string, mediaType: string, base64: boolean },
  cellPhone?: string[] | string,
  pagerPhone?: string[] | string,
  homePhone?: string[] | string,
  workPhone?: string[] | string,
  homeFax?: string[] | string,
  workFax?: string[] | string,
  otherPhone?: string[] | string,
  url?: string,
  workUrl?: string,
  note?: string,
  socialUrls?: {
    [key: string]: string;
  },
  source?: string,
  homeAddress?: {
      label?: string,
      street?: string,
      city?: string,
      stateProvince?: string,
      postalCode?: string,
      countryRegion?: string,
  },
  workAddress?: {
      label?: string,
      street?: string,
      city?: string,
      stateProvince?: string,
      postalCode?: string,
      countryRegion?: string,
  },
  title?: string,
  role?: string,
  getMajorVersion?: () => number,
};

let majorVersion: string | number = '3';

function e(value: any): string {
  if (value) {
      if (typeof(value) !== 'string') {
          value = '' + value;
      }
      return value.replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  }
  return '';
}

function nl(): string {
  return '\r\n';
}

function getFormattedPhoto(photoType: string, url: string, mediaType: string, base64: boolean): string {
  let params: string;
  let versionNumber: number;

  if (typeof majorVersion === 'string') {
      versionNumber = parseInt(majorVersion);
  } else {
      versionNumber = majorVersion;
  }

  if (versionNumber >= 4) {
      params = base64 ? ';ENCODING=b;MEDIATYPE=image/' : ';MEDIATYPE=image/';
  } else if (versionNumber === 3) {
      params = base64 ? ';ENCODING=b;TYPE=' : ';TYPE=';
  } else {
      params = base64 ? ';ENCODING=BASE64;' : ';';
  }

  const formattedPhoto = photoType + params + mediaType + ':' + e(url) + nl();
  return formattedPhoto;
}

function getFormattedAddress(encodingPrefix: string, address: { details?: VCard['homeAddress'], type: string }): string {
  var formattedAddress = '';

  let versionNumber: number;

  if (typeof majorVersion === 'string') {
      versionNumber = parseInt(majorVersion);
  } else {
      versionNumber = majorVersion;
  }

  if (address.details?.label ||
      address.details?.street ||
      address.details?.city ||
      address.details?.stateProvince ||
      address.details?.postalCode ||
      address.details?.countryRegion) {

      if (versionNumber >= 4) {
          formattedAddress = 'ADR' + encodingPrefix + ';TYPE=' + address.type +
          (address.details?.label ? ';LABEL="' + e(address.details.label) + '"' : '') + ':;;' +
          e(address.details?.street) + ';' +
          e(address.details?.city) + ';' +
          e(address.details?.stateProvince) + ';' +
          e(address.details?.postalCode) + ';' +
          e(address.details?.countryRegion) + nl();
      } else {
          if (address.details?.label) {
              formattedAddress = 'LABEL' + encodingPrefix + ';TYPE=' + address.type + ':' + e(address.details.label) + nl();
          }
          formattedAddress += 'ADR' + encodingPrefix + ';TYPE=' + address.type + ':;;' +
          e(address.details?.street) + ';' +
          e(address.details?.city) + ';' +
          e(address.details?.stateProvince) + ';' +
          e(address.details?.postalCode) + ';' +
          e(address.details?.countryRegion) + nl();
      }
  }

  return formattedAddress;
}

function YYYYMMDD(date: Date): string {
  return date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2);
}

export const vCardFormatter = {
  getFormattedString(vCard: VCard): string {
    let versionNumber: number;

    if (typeof majorVersion === 'string') {
        versionNumber = parseInt(majorVersion);
    } else {
        versionNumber = majorVersion;
    }

    if (vCard && vCard.getMajorVersion) {
      majorVersion = vCard.getMajorVersion();
    }
    

    var formattedVCardString = '';
    formattedVCardString += 'BEGIN:VCARD' + nl();
    formattedVCardString += 'VERSION:' + vCard.version + nl();

    var encodingPrefix = versionNumber >= 4 ? '' : ';CHARSET=UTF-8';
    var formattedName = vCard.formattedName;

    if (!formattedName) {
      formattedName = [vCard.firstName, vCard.middleName, vCard.lastName].filter(Boolean).join(' ');
    }    

    formattedVCardString += 'FN' + encodingPrefix + ':' + e(formattedName) + nl();
    formattedVCardString += 'N' + encodingPrefix + ':' +
      e(vCard.lastName) + ';' +
      e(vCard.firstName) + ';' +
      e(vCard.middleName) + ';' +
      e(vCard.namePrefix) + ';' +
      e(vCard.nameSuffix) + nl();

    if (vCard.nickname && versionNumber >= 3) {
      formattedVCardString += 'NICKNAME' + encodingPrefix + ':' + e(vCard.nickname) + nl();
    }

    if (vCard.gender) {
      formattedVCardString += 'GENDER:' + e(vCard.gender) + nl();
    }

    if (vCard.uid) {
      formattedVCardString += 'UID' + encodingPrefix + ':' + e(vCard.uid) + nl();
    }

    if (vCard.birthday) {
      formattedVCardString += 'BDAY:' + YYYYMMDD(vCard.birthday) + nl();
    }

    if (vCard.anniversary) {
      formattedVCardString += 'ANNIVERSARY:' + YYYYMMDD(vCard.anniversary) + nl();
    }

    if (vCard.email) {
      if(!Array.isArray(vCard.email)){
        vCard.email = [vCard.email];
      }
      vCard.email.forEach(
        function(address) {
          if (versionNumber >= 4) {
            formattedVCardString += 'EMAIL' + encodingPrefix + ';type=HOME:' + e(address) + nl();
          } else if (versionNumber >= 3 && versionNumber < 4) {
            formattedVCardString += 'EMAIL' + encodingPrefix + ';type=HOME,INTERNET:' + e(address) + nl();
          } else {
            formattedVCardString += 'EMAIL' + encodingPrefix + ';HOME;INTERNET:' + e(address) + nl();
          }
        }
      );
    }

    if (vCard.workEmail) {
      if(!Array.isArray(vCard.workEmail)){
        vCard.workEmail = [vCard.workEmail];
      }
      vCard.workEmail.forEach(
        function(address) {
          if (versionNumber >= 4) {
            formattedVCardString += 'EMAIL' + encodingPrefix + ';type=WORK:' + e(address) + nl();
          } else if (versionNumber >= 3 && versionNumber < 4) {
            formattedVCardString += 'EMAIL' + encodingPrefix + ';type=WORK,INTERNET:' + e(address) + nl();
          } else {
            formattedVCardString += 'EMAIL' + encodingPrefix + ';WORK;INTERNET:' + e(address) + nl();
          }
        }
      );
    }

    if (vCard.otherEmail) {
      if(!Array.isArray(vCard.otherEmail)){
        vCard.otherEmail = [vCard.otherEmail];
      }
      vCard.otherEmail.forEach(
        function(address) {
          if (versionNumber >= 4) {
            formattedVCardString += 'EMAIL' + encodingPrefix + ';type=OTHER:' + e(address) + nl();
          } else if (versionNumber >= 3 && versionNumber < 4) {
            formattedVCardString += 'EMAIL' + encodingPrefix + ';type=OTHER,INTERNET:' + e(address) + nl();
          } else {
            formattedVCardString += 'EMAIL' + encodingPrefix + ';OTHER;INTERNET:' + e(address) + nl();
          }
        }
      );
    }

    if (vCard?.logo?.url) {
      formattedVCardString += getFormattedPhoto('LOGO', vCard.logo.url, vCard.logo.mediaType, vCard.logo.base64);
    }

    if (vCard?.photo?.url) {
      formattedVCardString += getFormattedPhoto('PHOTO', vCard.photo.url, vCard.photo.mediaType, vCard.photo.base64);
    }

    if (vCard.cellPhone) {
      if(!Array.isArray(vCard.cellPhone)){
        vCard.cellPhone = [vCard.cellPhone];
      }
      vCard.cellPhone.forEach(
        function(number){
          if (versionNumber >= 4) {
            formattedVCardString += 'TEL;VALUE=uri;TYPE="voice,cell":tel:' + e(number) + nl();
          } else {
            formattedVCardString += 'TEL;TYPE=CELL:' + e(number) + nl();
          }
        }
      );
    }

    if (vCard.pagerPhone) {
      if(!Array.isArray(vCard.pagerPhone)){
        vCard.pagerPhone = [vCard.pagerPhone];
      }
      vCard.pagerPhone.forEach(
        function(number) {
          if (versionNumber >= 4) {
            formattedVCardString += 'TEL;VALUE=uri;TYPE="pager,cell":tel:' + e(number) + nl();
          } else {
            formattedVCardString += 'TEL;TYPE=PAGER:' + e(number) + nl();
          }
        }
      );
    }

    if (vCard.homePhone) {
      if(!Array.isArray(vCard.homePhone)){
        vCard.homePhone = [vCard.homePhone];
      }
      vCard.homePhone.forEach(
        function(number) {
          if (versionNumber >= 4) {
            formattedVCardString += 'TEL;VALUE=uri;TYPE="voice,home":tel:' + e(number) + nl();
          } else {
            formattedVCardString += 'TEL;TYPE=HOME,VOICE:' + e(number) + nl();
          }
        }
      );
    }

    if (vCard.workPhone) {
      if(!Array.isArray(vCard.workPhone)){
        vCard.workPhone = [vCard.workPhone];
      }
      vCard.workPhone.forEach(
        function(number) {
          if (versionNumber >= 4) {
            formattedVCardString += 'TEL;VALUE=uri;TYPE="voice,work":tel:' + e(number) + nl();

          } else {
            formattedVCardString += 'TEL;TYPE=WORK,VOICE:' + e(number) + nl();
          }
        }
      );
    }

    if (vCard.homeFax) {
      if(!Array.isArray(vCard.homeFax)){
        vCard.homeFax = [vCard.homeFax];
      }
      vCard.homeFax.forEach(
        function(number) {
          if (versionNumber >= 4) {
            formattedVCardString += 'TEL;VALUE=uri;TYPE="fax,home":tel:' + e(number) + nl();

          } else {
            formattedVCardString += 'TEL;TYPE=HOME,FAX:' + e(number) + nl();
          }
        }
      );
    }

    if (vCard.workFax) {
      if(!Array.isArray(vCard.workFax)){
        vCard.workFax = [vCard.workFax];
      }
      vCard.workFax.forEach(
        function(number) {
          if (versionNumber >= 4) {
            formattedVCardString += 'TEL;VALUE=uri;TYPE="fax,work":tel:' + e(number) + nl();

          } else {
            formattedVCardString += 'TEL;TYPE=WORK,FAX:' + e(number) + nl();
          }
        }
      );
    }

    if (vCard.otherPhone) {
      if(!Array.isArray(vCard.otherPhone)){
        vCard.otherPhone = [vCard.otherPhone];
      }
      vCard.otherPhone.forEach(
        function(number) {
          if (versionNumber >= 4) {
            formattedVCardString += 'TEL;VALUE=uri;TYPE="voice,other":tel:' + e(number) + nl();

          } else {
            formattedVCardString += 'TEL;TYPE=OTHER:' + e(number) + nl();
          }
        }
      );
    }

    [{
      details: vCard.homeAddress,
      type: 'HOME'
    }, {
      details: vCard.workAddress,
      type: 'WORK'
    }].forEach(
      function(address) {
        formattedVCardString += getFormattedAddress(encodingPrefix, address);
      }
    );

    if (vCard.title) {
      formattedVCardString += 'TITLE' + encodingPrefix + ':' + e(vCard.title) + nl();
    }

    if (vCard.role) {
      formattedVCardString += 'ROLE' + encodingPrefix + ':' + e(vCard.role) + nl();
    }

    if (vCard.organization) {
      formattedVCardString += 'ORG' + encodingPrefix + ':' + e(vCard.organization) + nl();
    }

    if (vCard.url) {
      formattedVCardString += 'URL' + encodingPrefix + ':' + e(vCard.url) + nl();
    }

    if (vCard.workUrl) {
      formattedVCardString += 'URL;type=WORK' + encodingPrefix + ':' + e(vCard.workUrl) + nl();
    }

    if (vCard.note) {
      formattedVCardString += 'NOTE' + encodingPrefix + ':' + e(vCard.note) + nl();
    }

    let index = 0;
    if (vCard.socialUrls) {
      for (var key in vCard.socialUrls) {
        index++;
        if (vCard.socialUrls.hasOwnProperty(key) && vCard.socialUrls[key]) {
          formattedVCardString += 'item' + index + '.URL:' + vCard.socialUrls[key] + nl();
          formattedVCardString += 'item' + index + '.X-ABLabel:' + key + nl();
        }
      }
    }

    if (vCard.source) {
      formattedVCardString += 'SOURCE' + encodingPrefix + ':' + e(vCard.source) + nl();
    }

    formattedVCardString += 'REV:' + (new Date()).toISOString() + nl();
    
    if (vCard.organization) {
      formattedVCardString += 'X-ABShowAs:COMPANY' + nl();
    } 
    
    formattedVCardString += 'END:VCARD' + nl();
    return formattedVCardString;
  },
};

// ... The rest of your utility functions and export statement
