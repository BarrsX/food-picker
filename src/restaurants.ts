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
  { name: "Charlie's Kitchen & Grill", type: "American" },
  { name: "Willie boys bbq", type: "American" },
  { name: "Alex's gyro and cheesesteaks", type: "American" },
  { name: "Beef N' Buns", type: "American" },
  { name: "Black Bear Kitchen", type: "American" },
  { name: "TooJay’s Deli • Bakery • Restaurant", type: "American" },
  { name: "Irregular Smash", type: "American" },
  { name: "LoveBird Almost Famous Chicken", type: "American" },

  // Japanese
  { name: "Kura Sushi", type: "Japanese" },
  { name: "Token Ramen", type: "Japanese" },
  { name: "Kazu Sushi Burrito", type: "Japanese" },
  { name: "Kyu Ramen", type: "Japanese" },
  { name: "Wa Ramen", type: "Japanese" },
  { name: "Zaru", type: "Japanese" },
  { name: "The bao spot", type: "Japanese" },
  {
    name: "mosonori | Japanese handroll sushi bar | Winter Park",
    type: "Japanese",
  },
  { name: "Palm Beach Meats Orlando", type: "Japanese" },

  // Korean
  { name: "The Mongolorian BBQ", type: "Korean" },
  { name: "Izziban Sushi & BBQ", type: "Korean" },
  { name: "Star BBQ Korean", type: "Korean" },
  { name: "Kbob Korean Street Food", type: "Korean" },
  { name: "U TURN KOREAN BBQ", type: "Korean" },
  { name: "Gogi hotpot", type: "Korean" },
  { name: "92 chicken", type: "Korean" },
  { name: "Snowbean", type: "Korean" },
  { name: "The Neighborhood Eatery", type: "Korean" },

  // Italian
  { name: "Mia's Italian Kitchen", type: "Italian" },

  // Pizza
  { name: "V Pizza", type: "Pizza" },
  { name: "Butter Crust Pizza", type: "Pizza" },
  { name: "Dough Boyz Pizzeria", type: "Pizza" },

  // Hispanic
  { name: "Francisco's taco madness", type: "Hispanic" },
  { name: "Fui Yo Mexicana", type: "Hispanic" },
  { name: "Superica Winter Park", type: "Hispanic" },

  // Wings
  { name: "That Wing Spot", type: "Wings" },
  { name: "My Kitchen Wings & Fish", type: "Wings" },
  { name: "Buffalo Boss", type: "Wings" },
  { name: "Wing alley", type: "Wings" },

  // International and Fusion
  { name: "World Food Trucks", type: "International" },
  { name: "Sticky rice", type: "International" },
  { name: "EggDose", type: "International" },
  { name: "Hawkers Asian Street Food", type: "International" },
  { name: "Alvin's Cuisine", type: "International" },
  { name: "Rion's Ocean Room", type: "International" },

  // Chinese
  { name: "East Garden Chinese Restaurant", type: "Chinese" },
  { name: "Kai Kai BBQ & Dumplings", type: "Chinese" },

  // Soul Food
  { name: "Ez Eats Afro Soul Food", type: "Soul Food" },
  { name: "Uncle Tony's Backyard bbq", type: "Soul Food" },
  { name: "Kook'n with Kim", type: "Soul Food" },
  { name: "Voodoo Bayou", type: "Soul Food" },

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
  { name: "Kori Bakery", type: "Desserts" },
  { name: "The Salty Donut", type: "Desserts" },
  { name: "Picasso Moments Bakery, Cafe, & Boba Tea", type: "Desserts" },
  { name: "Gideon's Bakehouse", type: "Desserts" },
  { name: "Mango Mango Dessert - Orlando", type: "Desserts" },
  { name: "Harmony Tea Shoppe", type: "Desserts" },
  { name: "Yeast Coast Bakehouse", type: "Desserts" },
  { name: "Peach Cobbler Factory", type: "Desserts" },
  { name: "Alien Treats FL", type: "Desserts" },
  { name: "Gelato Go Winter Garden", type: "Desserts" },
  { name: "Bacio Ice Cream Shop", type: "Desserts" },

  // Fast Food
  { name: "McDonald's", type: "Fast Food" },
  { name: "Burger King", type: "Fast Food" },
  { name: "Wendy's", type: "Fast Food" },
  { name: "Taco Bell", type: "Fast Food" },
  { name: "Chick-fil-A", type: "Fast Food" },
  { name: "Popeyes", type: "Fast Food" },
  { name: "Chipotle", type: "Fast Food" },
  { name: "Five Guys", type: "Fast Food" },
  { name: "Panera Bread", type: "Fast Food" },
  { name: "Subway", type: "Fast Food" },
  { name: "Domino's Pizza", type: "Fast Food" },
  { name: "Culver's", type: "Fast Food" },
  { name: "Arby's", type: "Fast Food" },
  { name: "Jimmy Johns", type: "Fast Food" },
  { name: "Jersey Mike's", type: "Fast Food" },
  { name: "Little Caesars", type: "Fast Food" },
  { name: "Panda Express", type: "Fast Food" },
  { name: "Sonic Drive-In", type: "Fast Food" },
  { name: "Dairy Queen", type: "Fast Food" },
  { name: "Wingstop", type: "Fast Food" },
  { name: "Cava", type: "Fast Food" },
  { name: "Raising Canes", type: "Fast Food" },
  { name: "PDQ", type: "Fast Food" },
  { name: "Steak n Shake", type: "Fast Food" },
  { name: "Shake Shack", type: "Fast Food" },
  { name: "Pizza Hut", type: "Fast Food" },
  { name: "Del Taco", type: "Fast Food" },
  { name: "Charley's Philly Steaks", type: "Fast Food" },

  // Chain Restaurants
  { name: "Olive Garden", type: "Chain Restaurant" },
  { name: "Red Lobster", type: "Chain Restaurant" },
  { name: "Millers Ale House", type: "Chain Restaurant" },
  { name: "Buffalo Wild Wings", type: "Chain Restaurant" },
  { name: "Chili's", type: "Chain Restaurant" },
  { name: "TGI Fridays", type: "Chain Restaurant" },
  { name: "Hooters", type: "Chain Restaurant" },
  { name: "Applebee's", type: "Chain Restaurant" },
  { name: "Bubba Gump Shrimp Co.", type: "Chain Restaurant" },
  { name: "Rainforest Cafe", type: "Chain Restaurant" },
];

export {};
