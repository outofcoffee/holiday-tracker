import { HolidayConfig } from '../holiday.types';

/**
 * Easter Bunny Tracker Configuration
 */
export const easterConfig: HolidayConfig = {
  id: 'easter',
  name: 'Easter',

  date: {
    type: 'calculated',
    calculationAlgorithm: 'easter',
  },

  messages: {
    // Main title and subtitle
    title: 'Easter Bunny Tracker',
    subtitle: "Follow the Easter Bunny's journey around the world!",

    // Loading states
    loadingMessage: 'Loading the Easter Bunny Tracker...',

    // Progress tracker
    progressTitle: 'Easter Bunny Progress',
    itemsDeliveredLabel: 'Baskets Delivered',
    journeyCompleteLabel: 'Journey Complete',

    // Location info
    yourLocationTitle: 'Your Location',
    locationPermissionRequest:
      'Please enable location access in your browser settings to see when the Easter Bunny will visit you!',
    locationPrompt: 'Share your location to see when the Easter Bunny will visit you!',
    nearbyNotification: 'The Easter Bunny is in your area right now!',
    nearbySubMessage: 'Keep an eye out for Easter surprises!',
    visitedLabel: 'The Easter Bunny visited at approximately:',
    willVisitLabel: 'The Easter Bunny will visit at approximately:',
    calculatingVisit: 'Calculating when the Easter Bunny will visit you...',

    // Sleeping/off-season
    sleepingTitle: 'The Easter Bunny is Sleeping',
    sleepingDescription: 'The Easter Bunny is resting until the next Easter Sunday!',
    comeBackMessage: "Come back on {date} to track the bunny's journey!",
    sleepingFunFact:
      'The Easter Bunny works very hard one day a year, delivering baskets to children around the world! For the rest of the year, the bunny rests, prepares Easter eggs, and practices hopping skills.',

    // Active delivery
    deliveringMessage: (city: string, country: string) =>
      `The Easter Bunny is delivering baskets in ${city}, ${country}!`,
    deliveringSubMessage: 'Dropping off eggs and chocolate for the children!',
    travelingMessage: (fromCity: string, toCity: string) =>
      `The Easter Bunny is flying from ${fromCity} to ${toCity}!`,
    nextDeliveryMessage: (city: string, country: string) => `Next delivery: ${city}, ${country}`,

    // Popup
    characterName: 'Easter Bunny',
    popupDeliveringMessage: (city: string) => `Delivering baskets in ${city}!`,
    popupTravelingMessage: (fromCity: string, toCity: string) =>
      `Traveling from ${fromCity} to ${toCity}`,

    // Footer
    footerGreeting: 'Happy Easter! 🐰',
    footerDescription: "This is a fun educational project tracking the Easter Bunny's journey.",

    // Fun fact section
    funFactTitle: 'Easter Fun Fact',
  },

  colors: {
    primary: '#FFB6C1', // easter-pink
    secondary: '#ADD8E6', // easter-blue
    accent: '#FFFACD', // easter-yellow
    light: '#E6E6FA', // easter-purple
    dark: '#6A0DAD', // easter-dark-purple
    highlight: '#98FB98', // easter-green
  },

  assets: {
    characterImage: '/assets/icons8-easter-bunny-100.png',
    characterAlt: 'Easter Bunny',
    themeColor: '#f3eac3',
  },

  animations: {
    movementAnimation: 'hop',
    movementKeyframes: {
      name: 'hop',
      keyframes: `
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      `,
    },
  },

  deliveryItems: [
    {
      type: 'egg',
      emoji: '🥚',
      fontSize: 16,
      borderRadius: '50%',
      colors: ['#FF9E80', '#FFCC80', '#FFE57F', '#CCFF90', '#80D8FF', '#CF93D9'],
      size: 28,
    },
    {
      type: 'basket',
      emoji: '🧺',
      fontSize: 20,
      borderRadius: '30%',
      colors: ['#FFCC80', '#FFFDE7', '#F8BBD0', '#C5CAE9', '#B2DFDB'],
      size: 36,
    },
    {
      type: 'candy',
      emoji: '🍬',
      fontSize: 15,
      borderRadius: '45%',
      colors: ['#F48FB1', '#EC407A', '#E91E63', '#D81B60', '#F06292'],
      size: 26,
    },
  ],

  sleepingDecorations: {
    characterEmoji: '🐰',
    sleepEmoji: '💤',
    decorationEmojis: ['🥚', '🥚'],
    accentEmoji: '🥕',
  },

  facts: [
    {
      id: 1,
      text: 'The Easter Bunny tradition began in Germany in the 1700s!',
    },
    {
      id: 2,
      text: 'The largest Easter egg ever made was over 7.5 metres tall and weighed over 3,600 kilogrammes!',
    },
    {
      id: 3,
      text: 'The UK consumes more than 80 million chocolate Easter eggs annually!',
    },
    {
      id: 4,
      text: 'In Sweden, children dress up as Easter witches and go door-to-door for treats!',
      country: 'Sweden',
    },
    {
      id: 5,
      text: 'The White House Easter Egg Roll has been a tradition since 1878!',
      country: 'United States',
    },
    {
      id: 6,
      text: 'In Norway, Easter is a popular time for reading crime novels! It\'s called "Påskekrim"!',
      country: 'Norway',
    },
    {
      id: 7,
      text: 'In Finland, children plant grass seeds in small pots to symbolise new life and the coming of spring!',
      country: 'Finland',
    },
    {
      id: 8,
      text: 'The Easter Bunny delivers decorated eggs and chocolate to children while they sleep the night before Easter!',
    },
    {
      id: 9,
      text: 'In Australia, they have the Easter Bilby instead of the Easter Bunny!',
      country: 'Australia',
    },
    {
      id: 10,
      text: "Easter Island isn't named for the holiday - it was discovered by a Dutch explorer on Easter Sunday 1722!",
    },
    {
      id: 11,
      text: 'In France, church bells are said to fly to Rome on Good Friday and return on Easter Sunday dropping chocolates for children!',
      country: 'France',
    },
    {
      id: 12,
      text: 'The tradition of Easter eggs comes from the ancient idea that eggs represent new life and rebirth!',
    },
    {
      id: 13,
      text: 'In Brazil, they make straw dolls to represent Judas and throw them in the street for children to beat up!',
      country: 'Brazil',
    },
    {
      id: 14,
      text: 'Easter is named after Eostre, the ancient Anglo-Saxon goddess of spring!',
    },
    {
      id: 15,
      text: 'In the UK, there is a custom of rolling decorated eggs down hills on Easter Monday!',
      country: 'United Kingdom',
    },
    {
      id: 16,
      text: 'Hot cross buns are traditionally eaten on Good Friday in the UK!',
      country: 'United Kingdom',
    },
    {
      id: 17,
      text: 'Simnel cake, a fruit cake with layers of marzipan, is a traditional Easter treat in the UK with 11 marzipan balls!',
      country: 'United Kingdom',
    },
    {
      id: 18,
      text: 'The world\'s largest Easter egg hunt took place in London in 2012, with over 12,000 participants searching for eggs!',
      country: 'United Kingdom',
    },
    {
      id: 19,
      text: 'In Scotland, Easter egg painting competitions and egg rolling events are popular community traditions!',
      country: 'United Kingdom',
    },
    {
      id: 20,
      text: "The British royal family traditionally attends Easter service at St George's Chapel in Windsor Castle!",
      country: 'United Kingdom',
    },
    {
      id: 21,
      text: "In Greece, eggs are dyed red and people play a game called tsougrisma, cracking their eggs against each other's!",
      country: 'Greece',
    },
    {
      id: 22,
      text: 'In Greece, traditional Easter bread called tsoureki is baked with red-dyed eggs nestled in the dough!',
      country: 'Greece',
    },
    {
      id: 23,
      text: 'On the Greek island of Corfu, people throw clay pots from their balconies on Easter Saturday!',
      country: 'Greece',
    },
  ],

  itemsDeliveredName: 'Baskets',
  peoplePerItem: 4,
};
