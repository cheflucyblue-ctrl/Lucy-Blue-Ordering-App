
import { MenuSection } from './types';

export const menuData: MenuSection[] = [
  {
    id: 'breakfast',
    title: 'Sunrise Soirée',
    subtitle: 'Served till 12h00',
    note: 'A 12.5% gratuity will be added to tables of eight or more. Please note, we cannot do split bills. All our food is made to order - please be patient with us.',
    content: [
      {
        items: [
          {
            name: "The Basic",
            description: "Two eggs, bacon, grilled tomato, toast.",
            price: "R95",
            extras: [{ label: "Replace bacon with vegan bacon", price: "R115" }],
            modifiers: ["Egg Style"]
          },
          {
            name: "French Toast",
            description: "Dipped and fried bread, bacon, syrup.",
            price: "R85"
          },
          {
            name: "Lucy",
            description: "Two eggs, bacon, banger, fried mushrooms, grilled tomato, toast.",
            price: "R135",
            extras: [{ label: "Replace meat with vegan bacon & sausage", price: "R155" }],
            modifiers: ["Egg Style"]
          },
          {
            name: "Three-Egg Omelette",
            description: "Free-range eggs with a choice of three fillings served with toast. Options: Bacon, Smoked trout, Pulled pork, Ham, Banger slices, Chorizo, Pepperoni, Cheddar, Mozzarella, Tomato, Mushrooms, Onions, Spicy chicken livers.",
            price: "R135"
          },
          {
            name: "Eggs Benedict",
            description: "Two poached eggs nestled on an English muffin with rocket, avo and bacon, finished with hollandaise sauce.",
            price: "R145",
            extras: [{ label: "Replace bacon with vegan bacon", price: "R155" }]
          },
          {
            name: "Breakfast Parfait",
            description: "Layers of Greek yoghurt, fresh fruit, homemade granola, topped with honey.",
            price: "R115"
          },
          {
            name: "Eggs Royale",
            description: "Two poached eggs nestled on an English muffin with rocket, avo and smoked trout, finished with hollandaise sauce.",
            price: "R155",
            extras: [{ label: "Replace salmon with vegan bacon", price: "R165" }]
          },
          {
            name: "Croissant",
            description: "Mixed berry compote, cream or cream cheese.",
            price: "R115"
          }
        ]
      }
    ]
  },
  {
    id: 'mains',
    title: 'Mains',
    content: [
      {
        items: [
          {
            name: "Szechuan Pork Belly",
            description: "Asian flavours, noodles and stir-fry vegetables.",
            price: "R235"
          },
          {
            name: "Nonna's Meatballs",
            description: "Saucy beef meatballs served on linguini, topped with mozzarella and parmesan.",
            price: "R165"
          },
          {
            name: "Spicy Chicken Livers",
            description: "Sautéed in brandy, served with toast.",
            price: "R165"
          },
          {
            name: "Chef's Salad",
            description: "Greek-style salad with a sprinkling of nuts and our homemade vinaigrette.",
            price: "R145",
            extras: [
              { label: "Add pulled chicken", price: "+R20" },
              { label: "Add smoked trout", price: "+R30" },
              { label: "Replace feta with vegan feta", price: "+R20" }
            ]
          },
          {
            name: "Steak",
            description: "250g steak served with a sauce of your choice, accompanied by chips or salad. Sauces: Pepper, mushroom, cheese, chimichurri, garlic butter, peri-peri, garlic sauce.",
            price: "R230",
            modifiers: ["Temperature", "Select Sauce"]
          }
        ]
      },
      {
        title: "Gourmet Burgers",
        description: "Served with Chips or Salad",
        items: [
          {
            name: "Beef or Chicken Burger",
            description: "Homemade beef patty (double) or a grilled chicken fillet served with chips.",
            price: "R135",
            extras: [{ label: "Vegan patty option", price: "R155" }],
            modifiers: ["Select Patty"]
          },
          {
            name: "The Drunken Mushroom",
            description: "Beef or Chicken topped with a mushroom brandy cream sauce.",
            price: "R160",
            modifiers: ["Select Patty"]
          },
          {
            name: "The Caprese",
            description: "Beef or Chicken, homemade mozzarella, heirloom tomato, basil pesto.",
            price: "R160",
            modifiers: ["Select Patty"]
          },
          {
            name: "Juicy Lucy",
            description: "Chicken topped with cheese and pineapple with our secret house sauce.",
            price: "R160"
          },
          {
            name: "The Jefa",
            description: "Beef or Chicken, peri-mayo, avo, bacon, cheese, and spicy salsa.",
            price: "R185",
            modifiers: ["Select Patty"]
          }
        ]
      },
      {
        title: "Burger Toppings",
        items: [
          {
             name: "Grilled mushroom",
             price: "R15"
          },
          {
            name: "Vegetables & Sauces",
            description: "Ham, Pineapple, Feta, Jalapeño, Peppadews, Olives, Mint sauce, Avo, Griddled pear, Peppers.",
            price: "R20"
          },
          {
            name: "Meats & Cheeses",
            description: "BBQ pulled pork, Pulled lamb, Pulled chicken, Bacon, Chorizo, Pepperoni, Brie, Blue cheese, Figs, Parma Ham.",
            price: "R25"
          },
          {
            name: "Vegan Options",
            description: "Vegan cheese, Vegan sausage, Vegan bacon.",
            price: "R40"
          }
        ]
      },
      {
        title: "For The Kids",
        items: [
          { name: "Loaded fries: ham and cheese sauce", price: "R65" },
          { name: "Chicken strips and chips", price: "R75" },
          { name: "Small margherita pizza", price: "R75" },
          { name: "Small ham and pineapple pizza", price: "R90" },
          { name: "Nonna's meatballs and spaghetti", price: "R90" },
          { name: "Beef, fish or chicken burger and chips", price: "R90" }
        ]
      }
    ]
  },
  {
    id: 'pizza',
    title: 'Pizza',
    content: [
      {
        items: [
          { name: "Pizza Bread", description: "Feta, garlic.", price: "R95", modifiers: ["Pizza Toppings"] },
          { name: "Margherita", description: "Fresh basil, oregano.", price: "R110", modifiers: ["Pizza Toppings"] },
          { name: "Vegan Margherita", description: "Vegan cheese, fresh basil, oregano.", price: "R130", modifiers: ["Pizza Toppings"] },
          { name: "Hawaiian", description: "Ham, pineapple.", price: "R145", modifiers: ["Pizza Toppings"] },
          { name: "Regina", description: "Ham, mushroom.", price: "R150", modifiers: ["Pizza Toppings"] },
          { name: "Glow", description: "Pulled chicken, peppadews, feta, chilli jam.", price: "R165", modifiers: ["Pizza Toppings"] },
          { name: "Icon", description: "Bacon, feta, avo.", price: "R160", modifiers: ["Pizza Toppings"] },
          { name: "The Jax", description: "Sliced tomato, mushrooms, artichokes, fresh basil, oregano.", price: "R170", modifiers: ["Pizza Toppings"] },
          { name: "BBQ Pork", description: "Pulled BBQ pork, brie, jalapeño, peppadews.", price: "R175", modifiers: ["Pizza Toppings"] },
          { name: "The Blu", description: "Blue cheese, figs, bacon, mushroom, rocket.", price: "R175", modifiers: ["Pizza Toppings"] },
          { name: "Lucy", description: "Bacon, chorizo, pepperoni, ham, rocket.", price: "R180", modifiers: ["Pizza Toppings"] },
          { name: "The Dare", description: "Parma ham, griddled pear, blue cheese, rocket.", price: "R180", modifiers: ["Pizza Toppings"] },
          { name: "Dolly", description: "Pulled lamb, brie, cherry tomato, olives, mint sauce.", price: "R185", modifiers: ["Pizza Toppings"] },
        ]
      },
      {
        title: "Build Your Own",
        description: "Build your own from our Margherita base or add on:",
        items: [
          { name: "Herbs", description: "Basil, Rocket, Parsley.", price: "R10" },
          { name: "Veg 1", description: "Mushroom, Sliced tomato, Cherry tomato.", price: "R15" },
          { name: "Veg 2 & Basic Meat", description: "Ham, Pineapple, Feta, Jalapeño, Peppadews, Olives, Mint sauce, Avo, Griddled pear, Peppers.", price: "R20" },
          { name: "Premium Meat & Cheese", description: "BBQ pulled pork, Pulled lamb, Spicy Chicken Livers, Pulled chicken, Bacon, Chorizo, Pepperoni, Brie, Artichoke, Blue cheese, Figs, Parma Ham.", price: "R25" },
          { name: "Vegan Meat", description: "Vegan Sausage, Vegan Bacon.", price: "R40" },
        ]
      }
    ]
  },
  {
    id: 'desserts',
    title: 'Desserts',
    content: [
      {
        items: [
          { name: "Crème Brûlée", description: "Traditional vanilla.", price: "R95" },
          { name: "Chocolate Volcano", description: "Saucey chocolate tart served with cream or ice cream.", price: "R115" },
          { name: "Gelato De Cuba", description: "Vanilla ice cream and homemade chocolate sauce.", price: "R85" },
          { name: "Kiddies Ice Cream", description: "Served with chocolate sauce.", price: "R60" },
        ]
      }
    ]
  },
  {
    id: 'drinks',
    title: 'Cocktails & Drinks',
    content: [
      {
        title: "Cocktails",
        items: [
          { name: "Margarita", description: "White Tequila, Triple Sec, Lime Juice.", price: "R80" },
          { name: "Martini", description: "Gin, Vermouth, Olives.", price: "R85" },
          { name: "Dirty Martini", description: "Gin, Vermouth, Olive Brine, Olives.", price: "R85" },
          { name: "Mojito", description: "Mint, Lime, Bacardi, Soda, Simple Syrup.", price: "R85" },
          { name: "Pina Colada", description: "Bacardi, Coconut Cream, Malibu, Pineapple.", price: "R90" },
          { name: "Sex On The Beach", description: "Vodka, Peach Schnapps, Orange Juice, Grenadine.", price: "R90" },
          { name: "Tequila Sunrise", description: "White Tequila, Peach Schnapps, Orange Juice, Grenadine.", price: "R90" },
          { name: "Long Island Iced Tea", description: "Vodka, Bacardi, Gin, Tequila, Triple Sec, Coke.", price: "R105" },
          { name: "Cosmopolitan", description: "Bacardi, Cranberry Juice, Triple Sec, Lime Juice.", price: "R80" },
          { name: "Whisky Sour", description: "Whisky, Lemon Juice, Simple Syrup.", price: "R80" },
          { name: "Aperol Spritzer", description: "Aperol, Bubbles, Soda.", price: "R120" },
        ]
      },
      {
        title: "Hot Drinks",
        items: [
          { name: "Americano", price: "R35" },
          { name: "Cappuccino", price: "R40" },
          { name: "Cortado", price: "R40" },
          { name: "Flat White", price: "R40" },
          { name: "Caffè Latte", price: "R45" },
          { name: "Caffè mocha", price: "R45" },
          { name: "Affogato", price: "R70" },
          { name: "Espresso", price: "R30" },
          { name: "Double Espresso", price: "R35" },
          { name: "Irish Coffee", description: "Kahlua, Whisky, Frangelico or Amarula", price: "R85" },
          { name: "Iced Coffee", price: "R45", extras: [{ label: "Decaf", price: "+R10" }, { label: "Almond Milk", price: "+R15" }] },
          { name: "Tea", description: "Ceylon, Rooibos", price: "R30" },
          { name: "Chai Latte", price: "R40" },
          { name: "Earl Grey", price: "R35" },
          { name: "Red Cappuccino", price: "R40" },
        ]
      },
      {
        title: "Cold Drinks",
        items: [
            { name: "Soft Drinks", description: "Coke, Coke Zero, Soda, Lemonade, Ginger Ale, Dry Lemon", price: "R30" },
            { name: "Tonic", description: "Tonic Water, Sugar-free Tonic", price: "R30" },
            { name: "Juices", description: "Orange, Pineapple, Cranberry", price: "R40" },
            { name: "Red Bull", price: "R40" },
            { name: "Rock Shandy", price: "R65" },
            { name: "Cordial", description: "Passion Fruit, Lime, Kola Tonic", price: "R15" },
            { name: "Water", description: "Still or Sparkling", price: "R28" },
            { name: "Milkshakes", description: "Strawberry, Chocolate, Vanilla, Lime, Bubblegum, Coffee", price: "R60" },
            { name: "Dom Pedro", description: "Kahlua, Whisky, Frangelico or Amarula", price: "R80" }
        ]
      }
    ]
  },
  {
    id: 'bar',
    title: 'Beer & Spirits',
    content: [
      {
        title: "On Tap",
        items: [
          { name: "Frosty Whale Lager", description: "330ml / 500ml", price: "R40 / R50" },
          { name: "Frosty Whale Blonde", description: "330ml / 500ml", price: "R40 / R50" },
          { name: "Windhoek Lager", description: "500ml", price: "R55" },
        ]
      },
      {
        title: "Beers & Ciders",
        items: [
          { name: "Black Label", price: "R35" },
          { name: "Castle / Castle Lite", price: "R35" },
          { name: "Hunter's Dry", price: "R40" },
          { name: "Flying Fish Lemon", price: "R40" },
          { name: "Heineken / Zero", price: "R40" },
          { name: "Stella Artois", price: "R45" },
          { name: "Savanna Dry / Lite / 0", price: "R45" },
          { name: "Windhoek / Draught", price: "R45" },
        ]
      },
      {
        title: "Spirits",
        items: [
          { name: "Amarula", price: "R25" },
          { name: "Bacardi", price: "R35" },
          { name: "Bain’s Whiskey", price: "R40" },
          { name: "Bells", price: "R40" },
          { name: "Frangelico", price: "R35" },
          { name: "Glenfiddich", price: "R85" },
          { name: "Gordon’s Gin", price: "R30" },
          { name: "Hennessy Cognac", price: "R95" },
          { name: "Jack Daniels / Honey", price: "R35" },
          { name: "Jägermeister", price: "R35" },
          { name: "Jameson", price: "R40" },
          { name: "Tanqueray Gin", price: "R50" },
          { name: "White / Gold Tequila", price: "R35" },
        ]
      }
    ]
  },
  {
    id: 'wine',
    title: 'Wine List',
    note: "Corkage: You are more than welcome to bring your own wine at an additional fee of R70 per 750ml bottle.",
    content: [
      {
        title: "Bubbles",
        items: [
          { name: "Villiera Tradition Brut", description: "A zesty Cap Classique displaying the full balanced yeasty complexity synonymous with a blend of white and red grapes.", price: "375ml: R220 | 750ml: R350" },
          { name: "Villiera Brut Rosé", description: "This Cap Classique has a uniquely rich, fruity character reminiscent of strawberries with a touch of brioche.", price: "R350" },
          { name: "Domaine Des Dieux The Rose Of Sharon", description: "Strawberry, black cherry, raspberry notes jump out of the glass with a hint of rose water in the background.", price: "R480" },
        ]
      },
      {
        title: "Sauvignon Blanc",
        items: [
          { name: "Raka", description: "Unique Sauvignon Blanc offers a pale straw yellow colour in the glass, with a fresh and lively bouquet of passion fruit, peach, gooseberries and guava.", price: "R195" },
          { name: "Nitida", description: "Unique Sauvignon Blanc offers a pale straw yellow colour in the glass, with a fresh and lively bouquet of passion fruit, peach, gooseberries and guava.", price: "R230" },
          { name: "Bouchard Finlayson", description: "Explosive nose combines fig and gooseberry aromas alongside a hint of thyme.", price: "R260" },
          { name: "Springfield Life From Stone", description: "Flinty with a mineral palate, an all-time favourite.", price: "R275" },
        ]
      },
      {
        title: "Chenin Blanc",
        items: [
          { name: "Leopard's Leap", description: "Zesty summer melon with hints of white peaches follow through on the palate.", price: "R180" },
          { name: "Protea", description: "A delicate nuance of chamomile adds depth and interest to the nose of typical stone fruit.", price: "R195" },
          { name: "Salt Rock", description: "This wine comes to life with vibrant stone fruit and great mid-palate tension.", price: "R195" },
        ]
      },
      {
        title: "Rosé",
        items: [
          { name: "Delphin Lollipots Shiraz Rosé", description: "A medley of fresh-cut flowers on the nose with lingering flavours strawberry and watermelon on the palate.", price: "R170" },
          { name: "Tranquille", description: "Blended to be fresh and vibrant, enjoy tropical fruit, red berries and lime on the nose.", price: "R180" },
          { name: "Spookfontein", description: "This crisp, dry Rosé invites delicate fragrances of violets, cherries and gooseberries on the nose.", price: "R195" },
          { name: "Gabrielskloof Rosebud", description: "Raspberry, watermelon and bright floral notes lift the nose with the palate similarly red-fruited.", price: "R210" },
        ]
      },
      {
        title: "Red Varietals & Blends",
        items: [
          { name: "Protea Merlot", description: "Ample appeal with tasty red and black fruit notes: plum, mulberry and soft Agen prune.", price: "R180" },
          { name: "Stanford Hills Jacksons Pinotage", description: "This wine is still showing lively fruit flavours of red cherries, tomato leaf and plum.", price: "R285" },
          { name: "Leopard's Leap Cabernet Sauvignon", description: "Mix berry aromas with distinct blueberry notes on the nose and palate.", price: "R180" },
          { name: "Guardian Peak Shiraz", description: "Approachable Shiraz with pronounced nose of ripe plum and juicy black currant.", price: "R235" },
          { name: "Spookfontein Little Ghost", description: "Approachable Bordeaux-style blend opens with inviting aromas of ripe red berries, plum, and a hint of blackcurrant.", price: "R195" },
          { name: "Gabrielskloof The Blend", description: "A generosity of fruit led by cherries, plums and blackcurrant alongside cloves, fennel and a hint of cocoa.", price: "R280" },
        ]
      }
    ]
  }
];
    