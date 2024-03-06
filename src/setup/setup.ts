import { DietaryRestrictionType, DishType, CustomTag, MenuAttribute } from "@/types/menu"

export const defaults = {
  withInvitations: false,
  withMultipleProfiles: true,
  profileLimit: 3,
  withSubscription: false,
  trialPeriod: null,
  withTeams: true,
  withPrivacyKey: true,
  withImpact: true,
  withRewards: true,
  withDatabaseSetup: false,
}
export const main = {
  coverImageData: null,
  crmExports: [
    {
      header: [
        "Name",
        "Last Name",
        "Email",
        "Phone",
        "Notes"
      ],
      platform: "default",
      title: "default"
    },
    {
      header: [
        "Email Address",
        "First Name",
        "Last Name",
        "Tags",
        "Phone"
      ],
      title: "Mail Chimp",
      platform: "mailchimp"
    }
  ],
  connectionSettings: {
    connectFormCode: null,
    connectFormText: "Fill in the form to exchange youy contact information with me.",
    connectButtonText: "Connect",
    connectFormType: "default"
  },
  embedForms: [
    {
      platform: "google",
      title: "Google Form"
    }
  ],
  links: null,
  basicInfoData: {
    address: null,
    organization: null,
    location: null
  },
  version: 1,
  redirect: null,
  rewardsMilestones: [
    {
      code: "code",
      description: "Free Contact Dynamic Digital Card",
      condition: "Reach the goal of saving 50 cards to claim your reward",
      link: "https://yourlastcard.com/collections/frontpage/products/custom-metal-card?fbclid=IwAR19SYfOCIeehCC2Y7lqpncwsXpKip5DEOa9dU-jZFOAj22QJ5NSwnvVZms",
      goal: 50,
      title: "Free Contact Dynamic Digital Card"
    }
  ],
  aboutData: {
    about: null,
    videoUrl: null
  },
  themeSettings: null
}
export const appDomain = 'https://contact-dyn.firebaseapp.com'
export const appDomainView = 'contactdyn.app'
export const appDefaultTheme: 'light' | 'dark' = 'dark';
export const appDefaultColor = {
  code: '#888888',
  name: 'grey',
}
export const appDefaultLayout = 'default'
export const appDefaultSocialLinksToSelectedColor = false
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: "muchmum-00.firebaseapp.com",
  projectId: "muchmum-00",
  storageBucket: "muchmum-00.appspot.com",
  messagingSenderId: "188485061795",
  appId: "1:188485061795:web:be0851f2d26fba17024316",
  measurementId: "G-H482KNY6X3"
};
export const vapidKey = process.env.REACT_APP_VAPID_KEY
export const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS
export const socialPlatforms = [
  /* eslint-disable object-curly-newline */
  // { platform: 'website', color: '#23cac2', iconColor: '#23cac2', key: 1, active: false },
  // { platform: 'blog', color: '#fc4f08', iconColor: '#fc4f08', key: 2, active: false },
  { platform: 'facebook', color: '#3b5998', iconColor: '#3b5998', key: 3, active: false, domain: 'facebook.com' },
  { platform: 'twitter', color: '#00acee', iconColor: '#00acee', key: 4, active: false, domain: 'twitter.com' },
  { platform: 'linkedin', color: '#0e76a8', iconColor: '#0e76a8', key: 5, active: false, domain: 'linkedin.com/in' },
  { platform: 'instagram', color: '#bc2a8d', iconColor: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)', key: 6, active: false, domain: 'instagram.com' },
  { platform: 'youtube', color: '#d21111', iconColor: '#d21111', key: 7, active: false, domain: 'youtube.com/c' },
  { platform: 'tumblr', color: '#34526f', iconColor: '#34526f', key: 8, active: false, domain: 'tumblr.com/blog' },
  { platform: 'pinterest', color: '#E60023', iconColor: '#E60023', key: 9, active: false, domain: 'pinterest.com' },
  { platform: 'whatsapp', color: '#075e54', iconColor: '#075e54', key: 10, active: false, domain: 'wa.me' },
  { platform: 'snapchat', color: '#FFFC00', iconColor: '#FFFC00', dark: true, key: 11, active: false, domain: 'snapchat.com/add' },
  { platform: 'spotify', color: '#1DB954', iconColor: '#1DB954', key: 12, active: false, domain: 'open.spotify.com/user' },
  { platform: 'tiktok', color: '#ff0050', iconColor: '#000000', key: 13, active: false, domain: 'vm.tiktok.com' },
  { platform: 'vimeo', color: '#86c9ef', iconColor: '#86c9ef', key: 14, active: false, domain: 'vimeo.com' },
  { platform: 'discord', color: '#003087', iconColor: '#003087', key: 15, active: false, domain: 'discord.com' },
  { platform: 'dribbble', color: '#1ab7ea', iconColor: '#1ab7ea', key: 16, active: false, domain: 'dribbble.com' },
  { platform: 'reddit', color: '#ff4500', iconColor: '#ff4500', key: 17, active: false, domain: 'reddit.com' },
  { platform: 'x', color: '#FB233B', iconColor: '#FB233B', key: 18, active: false, domain: 'twitter.com' },
  { platform: 'behance', color: '#1769ff', iconColor: '#1769ff', key: 19, active: false, domain: 'behance.net' },
  { platform: 'itunes', color: '#5017B8', iconColor: '#5017B8', key: 20, active: false, domain: 'itunes.apple.com' },
  { platform: 'matrix', color: '#b150e2', iconColor: '#b150e2', key: 21, active: false, domain: 'matrix.org' },
  { platform: 'google', color: '#006BFF', iconColor: '#006BFF', key: 22, active: false, domain: 'google.com' },
  { platform: 'soundcloud', color: '#E74D89', iconColor: '#E74D89', key: 23, active: false, domain: 'soundcloud.com' },
  { platform: 'github', color: '#24292f', iconColor: '#24292f', key: 24, active: false, domain: 'github.com' },
  { platform: 'twitch', color: '#6441a4', iconColor: '#6441a4', key: 25, active: false, domain: 'twitch.tv' },
  /* eslint-enable object-curly-newline */
]
export const themeColors = [
  { name: 'black', code: '#000000' },
  { name: 'grey', code: '#888888' },
  { name: 'orange', code: '#FF7400' },
  { name: 'green', code: '#30c54a' },
  { name: 'blue', code: '#347bd2' },
  { name: 'red', code: '#da373a' },
  { name: 'yellow', code: '#ffbc00' },
  { name: 'pink', code: '#E1005B' },
  { name: 'purble', code: '#9e38de' },
]
export const coverImageDimensions = {
  width: 550,
  height: 265,
}
export const profileImageDimensions = {
  width: 550,
  height: 550,
}
export const placeHolderProfileImage = '/assets/images/avatar.svg'
export const defaultMenu = [
  {
    title: 'restaurant',
    links: [
      { linkfor: 'basic info', path: '/info' },
      { linkfor: 'about info', path: '/about' },
      { linkfor: 'images', path: '/images' },
      { linkfor: 'links', path: '/links' },
      { linkfor: 'theme', path: '/theme' },
    ],
  },
  {
    title: 'menu',
    links: [
      { linkfor: 'menus', path: '/menus' },
    ],
  },
  {
    title: 'contacts',
    links: [
      { linkfor: 'contacts', path: '/contacts' },
      { linkfor: 'contactForm', path: '/contactForm' },
    ],
  },
  {
    title: 'utilities',
    links: [
      { linkfor: 'qrcode', path: '/qrcode' },
      { linkfor: 'share', path: '/share' },
      { linkfor: 'redirect', path: '/redirect' },
    ],
  },
  {
    title: 'reports',
    links: [
      { linkfor: 'analytics', path: '/efficiency' },
      { linkfor: 'impact', path: '/impact' },
    ],
  },
  {
    title: null,
    links: [
      { linkfor: 'logout', path: '/logout' },
    ],
  },
]

export const adminMenu = [
  {
    title: null,
    links: [
      { linkfor: 'batches', path: '/batches' },
    ],
  },
  {
    title: null,
    links: [
      { linkfor: 'users', path: '/users' },
    ],
  },
  {
    title: null,
    links: [
      { linkfor: 'teams', path: '/teams' },
    ],
  },
  {
    title: null,
    links: [
      { linkfor: 'logout', path: '/logout' },
    ],
  },
]

export const CONNECTIONS_CSV_HEADER = [
  'Name',
  'Given Name',
  'First Name',
  'Family Name',
  'Last Name',
  'E-mail 1 - Value',
  'E-mail Address',
  'Phone 2 - Value',
  'Business Phone',
  'Notes',
]
export const CONNECTIONS_FACEBOOK_CSV_HEADER = [
  'email',
  'email',
  'email',
  'phone',
  'phone',
  'phone',
  'fn',
  'ln',
  'country',
]
export const CONNECTIONS_MAILCHIMP_CSV_HEADER = [
  'Email Address',
  'First Name',
  'Last Name',
  'Tags',
  'Phone',
]
export const CONNECTIONS_SALESFORCE_CSV_HEADER = [
  'Email',
  'First Name',
  'Last Name',
  'Phone',
  'Mobile',
]
export const CONNECTIONS_HUBSPOT_CSV_HEADER = [
  'First Name',
  'Last Name',
  'Email Address',
  'Phone Number',
]

export const formOptions = [
  { value: 'default', display: 'Default', img: 'defaultForm.svg', description: '' },
  { value: 'google', display: 'Google Form', img: 'googleForms.svg', description: 'To get the embed code from Google Form, click "Send" then select the embed <> tab and copy code.' },
  { value: 'microsoft', display: 'Microsoft Form', img: 'microsoftForms.svg', description: 'To get the embed code from Microsoft Form, click "Send" then select the embed <> tab and copy code.' },
  { value: 'typeform', display: 'Type Form', img: 'typeForm.svg', description: 'To get the embed code from Typeform Form, copy the <b>(form-id)</b> from the public URL of your form (<i style="font-size: 12px">https://form.typeform.com/to/<b>(form-id)</b></i>)' },
  { value: 'jotform', display: 'Jot Form', img: 'jotForm.svg', description: 'To get the embed code from Jotform Form, select the Publish tab in the Form Builder then click Embed on the left "< / >", select "IFRAME" from the list then copy code.' },
];

export const dietaryRestrictions: DietaryRestrictionType[] = [
  { id: "gluten_free", name: "Gluten-Free" },
  { id: "nut_free", name: "Nut-Free" },
  { id: "dairy_free", name: "Dairy-Free" },
  { id: "vegan", name: "Vegan" },
  { id: "vegetarian", name: "Vegetarian" },
  { id: "halal", name: "Halal" },
  { id: "kosher", name: "Kosher" },
  { id: "pescatarian", name: "Pescatarian" },
  { id: "paleo", name: "Paleo" },
  { id: "keto", name: "Keto" },
  { id: "low_carb", name: "Low Carb" },
  { id: "low_fat", name: "Low Fat" },
  { id: "sugar_free", name: "Sugar-Free" },
  { id: "organic", name: "Organic" },
  { id: "no_artificial_flavors", name: "No Artificial Flavors" },
];

export const dishTypes: DishType[] = [
  { id: "appetizers", name: "Appetizers" },
  { id: "main_courses", name: "Main Courses" },
  { id: "desserts", name: "Desserts" },
  { id: "seafood", name: "Seafood" },
  { id: "meat", name: "Meat" },
  { id: "poultry", name: "Poultry" },
  { id: "pasta", name: "Pasta" },
  { id: "pizza", name: "Pizza" },
  { id: "salads", name: "Salads" },
  { id: "soups", name: "Soups" },
  { id: "sandwiches", name: "Sandwiches" },
  { id: "burgers", name: "Burgers" },
  { id: "grilled", name: "Grilled" },
  { id: "stir_fry", name: "Stir Fry" },
  { id: "sushi", name: "Sushi" },
  { id: "snacks", name: "Snacks" },
  { id: "breakfast", name: "Breakfast" },
  { id: "beverages", name: "Beverages" },
];

export const customTags: CustomTag[] = [
  { id: "chef_special", name: "Chef's Special" },
  { id: "signature_dish", name: "Signature Dish" },
  { id: "seasonal", name: "Seasonal" },
  { id: "local_favorite", name: "Local Favorite" },
  { id: "spicy", name: "Spicy" },
  { id: "sweet", name: "Sweet" },
  { id: "sour", name: "Sour" },
  { id: "savory", name: "Savory" },
  { id: "organic", name: "Organic" },
];

export const menuAttributes: MenuAttribute[] = [
  { id: "spiciness_level", name: "Spiciness Level" },
  { id: "serving_temperature", name: "Serving Temperature" },
  { id: "portion_size", name: "Portion Size" },
];

export const spicinessLevels: { id: string; name: string; }[] = [
  { id: "mild", name: "Mild" },
  { id: "medium", name: "Medium" },
  { id: "hot", name: "Hot" },
  { id: "extra_hot", name: "Extra Hot" },
];

export const servingTemperatures: { id: string; name: string; }[] = [
  { id: "cold", name: "Cold" },
  { id: "room_temperature", name: "Room Temperature" },
  { id: "hot", name: "Hot" },
];

export const portionSizes: { id: string; name: string; }[] = [
  { id: "small", name: "Small" },
  { id: "medium", name: "Medium" },
  { id: "large", name: "Large" },
  { id: "family_size", name: "Family Size" },
];