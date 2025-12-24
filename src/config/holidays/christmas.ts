import { HolidayConfig } from '../holiday.types';

/**
 * Santa Tracker Configuration
 */
export const christmasConfig: HolidayConfig = {
  id: 'christmas',
  name: 'Christmas',

  date: {
    type: 'fixed',
    fixedMonth: 12,
    fixedDay: 25,
  },

  messages: {
    // Main title and subtitle
    title: 'Santa Tracker',
    subtitle: "Follow Santa's journey around the world!",

    // Loading states
    loadingMessage: 'Loading the Santa Tracker...',

    // Progress tracker
    progressTitle: 'Santa Progress',
    itemsDeliveredLabel: 'Presents Delivered',
    journeyCompleteLabel: 'Journey Complete',

    // Location info
    yourLocationTitle: 'Your Location',
    locationPermissionRequest:
      'Please enable location access in your browser settings to see when Santa will visit you!',
    locationPrompt: 'Share your location to see when Santa will visit you!',
    nearbyNotification: 'Santa is in your area right now!',
    nearbySubMessage: 'Keep an eye out for Christmas magic!',
    visitedLabel: 'Santa visited at approximately:',
    willVisitLabel: 'Santa will visit at approximately:',
    hasVisitedMessage: 'Santa has already visited near you!',
    calculatingVisit: 'Calculating when Santa will visit you...',

    // Sleeping/off-season
    sleepingTitle: 'Santa is at the North Pole',
    sleepingDescription: 'Santa and his elves are busy preparing for next Christmas!',
    comeBackMessage: 'Come back on {date} to track Santa\'s journey!',
    sleepingFunFact:
      'Santa Claus works all year round at the North Pole! The elves are busy making toys, checking the naughty and nice list, and feeding the reindeer. On Christmas Eve, Santa delivers presents to children all around the world!',

    // Active delivery
    deliveringMessage: (city: string, country: string) =>
      `Santa is delivering presents in ${city}, ${country}!`,
    deliveringSubMessage: 'Leaving gifts under the tree for good children!',
    travelingMessage: (fromCity: string, toCity: string) =>
      `Santa is flying from ${fromCity} to ${toCity}!`,
    nextDeliveryMessage: (city: string, country: string) => `Next stop: ${city}, ${country}`,

    // Popup
    characterName: 'Santa Claus',
    popupDeliveringMessage: (city: string) => `Delivering presents in ${city}!`,
    popupTravelingMessage: (fromCity: string, toCity: string) =>
      `Flying from ${fromCity} to ${toCity}`,

    // Footer
    footerGreeting: 'Merry Christmas! 🎅',
    footerDescription: "This is a fun educational project tracking Santa's journey.",

    // Fun fact section
    funFactTitle: 'Christmas Fun Fact',

    // Post-visit interactive question
    postVisitQuestion: {
      question: 'Did Santa eat the cookies?',
      yesButton: 'Yes!',
      noButton: 'No',
      yesResponse: 'Ho ho ho! Santa loved the cookies and milk! Thank you for being so thoughtful!',
      noResponse: 'Maybe next year! Santa would love some cookies and milk to fuel his journey!',
      responseEmoji: '🍪',
    },
  },

  colors: {
    primary: '#C41E3A', // Cardinal red - rich and elegant
    secondary: '#1B5E20', // Deep forest green - sophisticated
    accent: '#D4AF37', // Old gold - refined metallic
    light: '#FAFBFC', // Clean off-white
    dark: '#2D1810', // Deep espresso - excellent readability
    highlight: '#5C9EAD', // Winter teal - modern accent
    mapBorder: '#2E5744', // Dark sage green
    gradient: 'linear-gradient(135deg, #F5E6E8 0%, #E8F0E8 50%, #FDF8E8 100%)', // Warm holiday gradient
  },

  assets: {
    characterImage: '/assets/santa-sleigh-100.png',
    characterAlt: 'Santa Claus',
    themeColor: '#DC143C',
  },

  animations: {
    movementAnimation: 'fly',
    movementKeyframes: {
      name: 'fly',
      keyframes: `
        0%, 100% { transform: translateY(0) rotate(-2deg); }
        50% { transform: translateY(-8px) rotate(2deg); }
      `,
    },
  },

  deliveryItems: [
    {
      type: 'present',
      emoji: '🎁',
      fontSize: 18,
      borderRadius: '15%',
      colors: ['#DC143C', '#228B22', '#FFD700', '#4169E1', '#9932CC'],
      size: 32,
    },
    {
      type: 'stocking',
      emoji: '🧦',
      fontSize: 16,
      borderRadius: '40%',
      colors: ['#DC143C', '#FFFAFA', '#228B22', '#FFD700'],
      size: 28,
    },
    {
      type: 'candy-cane',
      emoji: '🍭',
      fontSize: 15,
      borderRadius: '45%',
      colors: ['#DC143C', '#FFFAFA', '#FF69B4', '#98FB98'],
      size: 26,
    },
  ],

  incomingItems: {
    enabled: true,
    emoji: '🥧',
    label: 'Mince Pies Eaten',
    size: 28,
    backgroundColor: '#DEB887',
    borderColor: '#8B4513',
    spawnIntervalCity: 6000,
    spawnIntervalLand: 6000,
    itemsPerDelivery: 10,
  },

  sleepingDecorations: {
    characterEmoji: '🎅',
    sleepEmoji: '❄️',
    decorationEmojis: ['🎄', '🎁'],
    accentEmoji: '⭐',
  },

  facts: [
    {
      id: 1,
      text: 'Children around the world leave treats for Santa - milk and cookies in the US, mince pies in the UK, and rice porridge in Scandinavia.',
    },
    {
      id: 2,
      text: 'In Sweden, families watch Donald Duck cartoons on Christmas Eve - a tradition since 1959.',
      country: 'Sweden',
    },
    {
      id: 3,
      text: 'NORAD has been tracking Santa since 1955 when a Sears ad accidentally printed NORAD\'s phone number!',
      country: 'United States',
    },
    {
      id: 4,
      text: 'In Norway, people hide their brooms on Christmas Eve to prevent witches from stealing them.',
      country: 'Norway',
    },
    {
      id: 5,
      text: 'In Finland, Santa Claus is called Joulupukki and is said to live in Korvatunturi, Lapland.',
      country: 'Finland',
    },
    {
      id: 6,
      text: 'In Australia, Santa often arrives by boat or surfboard due to the summer weather!',
      country: 'Australia',
    },
    {
      id: 7,
      text: 'The largest Christmas stocking measured 51.35 metres long and was made in Italy.',
    },
    {
      id: 8,
      text: 'In France, children leave their shoes by the fireplace for Père Noël to fill with gifts.',
      country: 'France',
    },
    {
      id: 9,
      text: 'In Brazil, Papai Noel is said to live in Greenland and arrives through the window.',
      country: 'Brazil',
    },
    {
      id: 10,
      text: 'The Royal Mail in the UK receives hundreds of thousands of letters to Santa every year.',
      country: 'United Kingdom',
    },
    {
      id: 11,
      text: 'Christmas crackers were invented in London by Tom Smith in 1847.',
      country: 'United Kingdom',
    },
    {
      id: 12,
      text: 'The tradition of the Christmas tree came to the UK from Germany via Prince Albert in 1841.',
      country: 'United Kingdom',
    },
    {
      id: 13,
      text: 'In Scotland, the first-footer tradition says the first person through the door after midnight brings luck.',
      country: 'United Kingdom',
    },
    {
      id: 14,
      text: 'The Queen\'s Christmas broadcast has been a tradition since 1932.',
      country: 'United Kingdom',
    },
    {
      id: 15,
      text: 'In Greece, gifts are exchanged on January 1st when St. Basil brings presents.',
      country: 'Greece',
    },
    {
      id: 16,
      text: 'Greeks traditionally bake Vasilopita, a New Year\'s cake with a hidden coin for good luck.',
      country: 'Greece',
    },
    {
      id: 17,
      text: 'In Japan, eating KFC on Christmas is a popular tradition that started in 1974!',
      country: 'Japan',
    },
    {
      id: 18,
      text: 'In Germany, children often receive their gifts on December 24th from the Christkind (Christ Child).',
      country: 'Germany',
    },
    {
      id: 19,
      text: 'The North Pole has a dedicated postal code in Canada: H0H 0H0!',
      country: 'Canada',
    },
  ],

  itemsDeliveredName: 'Presents',
  peoplePerItem: 3,
};
