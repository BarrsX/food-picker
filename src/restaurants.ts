export interface Restaurant {
  name: string;
  type: string;
  lat?: number;
  lng?: number;
}

export const restaurants: Restaurant[] = [
  // American
  { name: "House of Mac", type: "American" },
  { name: "Proper Orlando", type: "American" },
  { name: "Rise Biscuits", type: "American" },
  { name: "Fresh Kitchen", type: "American" },
  { name: "Marketplace at Avalon Park", type: "American" },
  { name: "Plant Street Market", type: "American" },
  { name: "Cow and cheese", type: "American" },
  { name: "Chicken fire", type: "American" },
  { name: "Smoke and doughnuts", type: "American" },
  { name: "Jericho drive through", type: "American" },
  { name: "Bad ass burgers", type: "American" },
  { name: "Charlie's kitchen", type: "American" },
  { name: "Willie boys bbq", type: "American" },
  { name: "Alex's gyro and cheesesteaks", type: "American" },

  // Japanese
  { name: "Kura Sushi", type: "Japanese" },
  { name: "Token Ramen", type: "Japanese" },
  { name: "Kazu Sushi Burrito", type: "Japanese" },
  { name: "Kyu Ramen", type: "Japanese" },
  { name: "Wa Ramen", type: "Japanese" },
  { name: "Zaru", type: "Japanese" },
  { name: "The bao spot", type: "Japanese" },

  // Korean
  { name: "The Mongolorian BBQ", type: "Korean" },
  { name: "Izziban Sushi & BBQ", type: "Korean" },
  { name: "Star BBQ Korean", type: "Korean" },
  { name: "Kbob Korean Street Food", type: "Korean" },
  { name: "U TURN KOREAN BBQ", type: "Korean" },
  { name: "Gogi hotpot", type: "Korean" },
  { name: "92 chicken", type: "Korean" },

  // Italian
  { name: "Mia's Italian Kitchen", type: "Italian" },
  { name: "Butter Crust Pizza", type: "Italian" },
  { name: "Dough Boys Pizzeria", type: "Italian" },

  // Hispanic
  { name: "Francisco's taco madness", type: "Hispanic" },

  // Wings
  { name: "That Wing Spot", type: "Wings" },
  { name: "My Kitchen Wings & Fish", type: "Wings" },
  { name: "Buffalo Boss", type: "Wings" },
  { name: "Wing alley", type: "Wings" },

  // International and Fusion
  { name: "World Food Trucks", type: "International" },
  { name: "Sticky rice", type: "International" },
  { name: "EggDose", type: "International" },

  // Soul Food
  { name: "Ez Eats Afro Soul Food", type: "Soul Food" },
  { name: "Uncle Tony's Backyard bbq", type: "Soul Food" },
  { name: "Kook'n with Kim", type: "Soul Food" },
  { name: "Chicken fire", type: "Soul Food" },

  // Sweets and Desserts
  { name: "Joury Ice Cream & Cafe", type: "Desserts" },
  { name: "JoJos Shake Bar", type: "Desserts" },
  { name: "Swirls on the Water", type: "Desserts" },
  { name: "Naked Cupcake", type: "Desserts" },
  { name: "Lotte Market", type: "Desserts" },
  { name: "Fluffy Fluffy Dessert Cafe", type: "Desserts" },
  { name: "Chiffon Culture", type: "Desserts" },
  { name: "Donutste", type: "Desserts" },
  { name: "Parkesdale Farm Market", type: "Desserts" },
  { name: "Parlor Doughnuts", type: "Desserts" },
];

// Add this line at the end of the file if there are no other exports
export {};
