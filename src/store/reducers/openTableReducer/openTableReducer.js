import saveDataService from "../../../services/saveDataService/saveDataService";

let defaultState = {
  flag: false,
  hallName: "",
  tableName: "",
  inProcess: false,
  estimation: false,
  brands: [
    // { name: "Diner", available: true, types: [], items: [] },
    // { name: "Brand 2", available: true, types: [], items: [] },
    // { name: "Brand 3", available: true, types: [], items: [] },
    // { name: "Brand 4", available: true, types: [], items: [] }
    // { name: "Diner", available: true, items: [{ name: 'Type 1', size: 'XL', color: 'GREEN', qty: "5" }, { name: 'Type 2', size: 'L', color: 'BLUE', qty: "2" }] },
    // { name: "Brand 2", available: true, items: [{ name: 'Type 1', size: 'L', color: 'RED', qty: "5" }] },
    // { name: "Brand 3", available: true, items: [{ name: 'Type 1', size: 'XL', color: 'RED', qty: "5" }] },
    // { name: "Brand 4", available: true, items: [{ name: 'Type 1', size: 'XL', color: 'RED', qty: "5" }] }
  ],
  colors: [
    { name: "Alizarin", code: "#E32636" },
    { name: "Amaranth", code: "#E52B50" },
    { name: "Amber", code: "#FFBF00" },
    { name: "Amethyst", code: "#9966CC" },
    { name: "Apricot", code: "#FBCEB1" },
    { name: "Aqua", code: "#00FFFF" },
    { name: "Aquamarine", code: "#7FFFD4" },
    { name: "Asparagus", code: "#7BA05B" },
    { name: "Auburn", code: "#6D351A" },
    { name: "Azure", code: "#007FFF" },
    { name: "Beige", code: "#F5F5DC" },
    { name: "Bistre", code: "#3D2B1F" },
    { name: "Black", code: "#000000" },
    { name: "Blue", code: "#0000FF" },
    { name: "Blue Green", code: "#00DDDD" },
    { name: "Blue Violet", code: "#8A2BE2" },
    { name: "Bondi Blue", code: "#0095B6" },
    { name: "Brass", code: "#B5A642" },
    { name: "Bronze", code: "#CD7F32" },
    { name: "Brown", code: "#964B00" },
    { name: "Buff", code: "#F0DC82" },
    { name: "Burgundy", code: "#900020" },
    { name: "Burnt Orange", code: "#CC5500" },
    { name: "Burnt Sienna", code: "#E97451" },
    { name: "Burnt Umber", code: "#8A3324" },
    { name: "Camouflage Green", code: "#78866B" },
    { name: "Caput Mortuum", code: "#592720" },
    { name: "Cardinal", code: "#C41E3A" },
    { name: "Carmine", code: "#960018" },
    { name: "Carrot orange", code: "#ED9121" },
    { name: "Celadon", code: "#ACE1AF" },
    { name: "Cerise", code: "#DE3163" },
    { name: "Cerulean", code: "#007BA7" },
    { name: "Champagne", code: "#F7E7CE" },
    { name: "Charcoal", code: "#464646" },
    { name: "Chartreuse", code: "#7FFF00" },
    { name: "Cherry Blossom Pink", code: "#FFB7C5" },
    { name: "Chestnut", code: "#CD5C5C" },
    { name: "Chocolate", code: "#7B3F00" },
    { name: "Cinnabar", code: "#E34234" },
    { name: "Cinnamon", code: "#D2691E" },
    { name: "Cobalt", code: "#0047AB" },
    { name: "Copper", code: "#B87333" },
    { name: "Coral", code: "#FF7F50" },
    { name: "Corn", code: "#FBEC5D" },
    { name: "Cornflower", code: "#6495ED" },
    { name: "Cream", code: "#FFFDD0" },
    { name: "Crimson", code: "#DC143C" },
    { name: "Cyan", code: "#00FFFF" },
    { name: "Dandelion", code: "#FED85D" },
    { name: "Denim", code: "#1560BD" },
    { name: "Ecru", code: "#C2B280" },
    { name: "Emerald", code: "#50C878" },
    { name: "Eggplant", code: "#614051" },
    { name: "Falu red", code: "#801818" },
    { name: "Fern green", code: "#4F7942" },
    { name: "Firebrick", code: "#B22222" },
    { name: "Flax", code: "#EEDC82" },
    { name: "Forest green", code: "#228B22" },
    { name: "French Rose", code: "#F64A8A" },
    { name: "Fuchsia", code: "#FF00FF" },
    { name: "Gamboge", code: "#E49B0F" },
    { name: "Gold", code: "#D4AF37" },
    { name: "Goldenrod", code: "#DAA5203" },
    { name: "Green", code: "#00FF00" },
    { name: "Grey", code: "#808080" },
    { name: "Han Purple", code: "#5218FA" },
    { name: "Harlequin", code: "#3FFF00" },
    { name: "Heliotrope", code: "#DF73FF" },
    { name: "Hollywood Cerise", code: "#F400A1" },
    { name: "Indigo", code: "#00416A" },
    { name: "Ivory", code: "#FFFFF0" },
    { name: "Jade", code: "#00A86B" },
    { name: "Kelly green", code: "#4CBB17" },
    { name: "Khaki", code: "#C3B091" },
    { name: "Lavender", code: "#B57EDC" },
    { name: "Lawn green", code: "#7CFC00" },
    { name: "Lemon", code: "#FDE910" },
    { name: "Lemon chiffon", code: "#FFFACD" },
    { name: "Lilac", code: "#C8A2C8" },
    { name: "Lime", code: "#00FF00" },
    { name: "Lime green", code: "#32CD32" },
    { name: "Linen", code: "#FAF0E6" },
    { name: "Magenta", code: "#FF00FF" },
    { name: "Magnolia", code: "#F8F4FF" },
    { name: "Malachite", code: "#0BDA51" },
    { name: "Maroon", code: "#800000" },
    { name: "Mauve", code: "#E0B0FF" },
    { name: "Midnight Blue", code: "#191970" },
    { name: "Mint green", code: "#98FF98" },
    { name: "Misty rose", code: "#FFE4E1" },
    { name: "Moss green", code: "#ADDFAD" },
    { name: "Mustard", code: "#FFDB58" },
    { name: "Myrtle", code: "#21421E" },
    { name: "Navajo white", code: "#FFDEAD" },
    { name: "Navy Blue", code: "#000080" },
    { name: "Ochre", code: "#CC7722" },
    { name: "Office green", code: "#008000" },
    { name: "Olive", code: "#808000" },
    { name: "Olivine", code: "#9AB973" },
    { name: "Orange", code: "#FF7F00" },
    { name: "Orchid", code: "#DA70D6" },
    { name: "Papaya whip", code: "#FFEFD5" },
    { name: "Peach", code: "#FFE5B4" },
    { name: "Pear", code: "#D1E231" },
    { name: "Periwinkle", code: "#CCCCFF" },
    { name: "Persimmon", code: "#EC5800" },
    { name: "Pine Green", code: "#01796F" },
    { name: "Pink", code: "#FFC0CB" },
    { name: "Platinum", code: "#E5E4E2" },
    { name: "Plum", code: "#CC99CC" },
    { name: "Powder blue", code: "#B0E0E6" },
    { name: "Puce", code: "#CC8899" },
    { name: "Prussian blue", code: "#003153" },
    { name: "Psychedelic purple", code: "#DD00FF" },
    { name: "Pumpkin", code: "#FF7518" },
    { name: "Purple", code: "#800080" },
    { name: "Quartz Grey", code: "#6C6961" },
    { name: "Raw umber", code: "#734A12" },
    { name: "Razzmatazz", code: "#E30B5C" },
    { name: "Red", code: "#FF0000" },
    { name: "Robin egg blue", code: "#00CCCC" },
    { name: "Rose", code: "#FF007F" },
    { name: "Royal blue", code: "#4169E1" },
    { name: "Royal purple", code: "#6B3FA0" },
    { name: "Ruby", code: "#E0115F" },
    { name: "Russet", code: "#80461B" },
    { name: "Rust", code: "#B7410E" },
    { name: "Safety orange", code: "#FF6600" },
    { name: "Saffron", code: "#F4C430" },
    { name: "Salmon", code: "#FF8C69" },
    { name: "Sandy brown", code: "#F4A460" },
    { name: "Sangria", code: "#92000A" },
    { name: "Sapphire", code: "#082567" },
    { name: "Scarlet", code: "#FF2400" },
    { name: "School bus yellow", code: "#FFD800" },
    { name: "Sea Green", code: "#2E8B57" },
    { name: "Seashell", code: "#FFF5EE" },
    { name: "Sepia", code: "#704214" },
    { name: "Shamrock green", code: "#009E60" },
    { name: "Shocking Pink", code: "#FC0FC0" },
    { name: "Silver", code: "#C0C0C0" },
    { name: "Sky Blue", code: "#87CEEB" },
    { name: "Slate grey", code: "#708090" },
    { name: "Smalt", code: "#003399" },
    { name: "Spring bud", code: "#A7FC00" },
    { name: "Spring green", code: "#00FF7F" },
    { name: "Steel blue", code: "#4682B4" },
    { name: "Tan", code: "#D2B48C" },
    { name: "Tangerine", code: "#F28500" },
    { name: "Taupe", code: "#483C32" },
    { name: "Teal", code: "#008080" },
    { name: "Tenné (Tawny)", code: "#CD5700" },
    { name: "Terra cotta", code: "#E2725B" },
    { name: "Thistle", code: "#D8BFD8" },
    { name: "Titanium White", code: "#fff" },
    { name: "Tomato", code: "#FF6347" },
    { name: "Turquoise", code: "#30D5C8" },
    { name: "Tyrian purple", code: "#66023C" },
    { name: "Ultramarine", code: "#120A8F" },
    { name: "Van Dyke Brown", code: "#413000" },
    { name: "Vermilion", code: "#E34234" },
    { name: "Violet", code: "#8B00FF" },
    { name: "Viridian", code: "#40826D" },
    { name: "Wheat", code: "#F5DEB3" },
    { name: "White", code: "#fff" },
    { name: "Wisteria", code: "#C9A0DC" },
    { name: "Xanthic", code: "#eeed09" },
    { name: "Yellow", code: "#FFFF00" },
    { name: "Zucchini", code: "#506022" }
  ]
};

const openTableReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "DOWNLOAD_DATA":
      var newState = { ...state, ...action.payload };
      // newState.brands = action.payload;
      return newState;

    case "UPDATED_INVENTORY":
      var newState = { ...state };
      newState.inProcess = false;
      return newState;

    case "UPDATE_INVENTORY":
      debugger
      var newState = { ...state };
      newState.inProcess = true;

      function getBrand(name) {
        return newState.brands.find(brand => {
          return brand.name == name;
        });
      }

      action.data.order.forEach((item, index) => {
        let brand = getBrand(item.brand);

        if (brand) {
          !brand.items && (brand.items = []);
          brand.items.push(item);
        }
      });
      saveDataService.saveSettingsData({ brands: newState.brands });
      return newState;

    case "SAVE_DATA":
      var newState = { ...state };
      newState.inProcess = true;
      saveDataService.saveSettingsData(action.data);
      return newState;
    

    case "GET_SINGLE_ITEM":
      var newState = { ...state };
      newState.inProcess = false;
      saveDataService.getSigleItemSettingsData(action.data.productId);
      return newState;
    case "OPEN_SETTINGS":
      debugger;
      return {
        openBranding: true,
        brands: state.brands,
        color: state.colors
      };
    // case 'OPEN_ESTIMATOR':
    //     return {
    //         flag: true,
    //         hallName: action.hallName,
    //         tableName: action.tableName,
    //         hideReceipt: true,
    //         estimation: true
    //     }
    case "OPEN_TABLE":
      return {
        flag: true,
        hallName: action.hallName,
        tableName: action.tableName,
        hideReceipt: false,
        estimation: false,
        brands: state.brands,
        colors: state.colors
      };

    case "CLOSE_DIALOG":
      return {
        flag: false,
        hallName: state.hallName,
        tableName: state.tableName,
        estimation: false,
        brands: state.brands,
        colors: state.colors
      };
    case "PRINT_TABLE_DATA":
      debugger;
      var newState = { ...state };
      newState.inProcess = true;
      saveDataService.saveTableDataToBackEnd(action.data);
      return newState;

    case "PRINTED_TABLE_DATA":
      var newState = { ...state };
      newState.inProcess = false;
      return newState;

    case "PRINT_ESTIMATION_BILL":
      saveDataService.printEstimation(action.data);
      return state;
    default:
      return state;
  }
};

export default openTableReducer;
