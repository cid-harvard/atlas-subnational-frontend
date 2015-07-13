export default {
  'general': {
    'locations': 'Locations',
    'export_and_import': 'Exports and Imports',
    'industries': 'Industries',
    'occupations': 'Occupations',
    'treemap': 'Treemap',
    'multiples': 'Area multiples',
    'geo': 'Geographic map',
    'scatter': 'Scatterplot',
    'similarity': 'Similarity map'
  },
  'side_nav': {
    'brand_slogan': 'Using data to keep Colombia competitive',
    'search_link': 'Search',
    'profile_link': 'Profile',
    'graph_builder_link': 'Graph Builder'
  },
  'location.model':{
    'department': 'department',
    'municipality': 'municipality'
  },
  'location.show': { 'overview': 'Overview' },
  'ctas': {
    'export': 'Export',
    'share': 'Share',
    'download': 'Download this data'
  },
  'graph_builder': {
    'settings' : {
      'label': 'Settings',
      'change_time' : 'Change time period:'
    },
    'search': {
      'placeholder': 'Search for {{entity}}'
    },
    'change_graph': {
      'label': 'Change Graph',
    },
    'page_title': {
      'location': {
        'products.export_value': 'What products does the {{level}} of {{name}} export?',
        'products.export_value.scatter': 'What products have the best combination of complexity and opportunity for the {{level}} of {{name}}?',
        'products.export_value_to': 'What products does {{name}} export to {{place}}?',
        'products.import_value': 'What products does the {{level}} of {{name}} import?',
        'products.import_value_from': 'What products does the {{level}} of {{name}} import from {{place}}?',
        'products.map': 'What does the product map look like for the {{level}} of {{name}}?',
        'industries.employment': 'What industries in the {{level}} of {{name}} employ the most people?',
        'industries.wages.scatter': 'What industries have the best combination of complexity and opportunity for the {{level}} of {{name}}?',
        'industries.wages': 'What industries are in the {{level}} of {{name}}?',
        'industries.wages_highest': 'What industries offer the highest wages for {{place}}?',
        'industries.wages_highest_per_worker': 'What industries in the {{level}} of {{name}} have the highest wages per worker?',
        'industries.map': 'What does the industry map look like for the {{level}} of {{name}}?',
        'locations.export': 'What countries does the {{level}} of {{name}} export to?',
        'locations.export_to': 'What countries does the {{level}} of {{name}} export {{item}} to?',
        'locations.import_from': 'What countries does the {{level}} of {{name}} import from?',
        'locations.import_product_from': 'What countries does the {{level}} of {{name}} import {{item}} from?',
        'locations.export_subregions': 'What subregions contribute to the exports from the {{level}} of {{name}}?',
        'locations.export_subregions_products': 'What subregions contribute to the exports of {{item}} from the {{level}} of {{name}}?',
        'locations.export_subregions_locations':'What subregions contribute to the exports from the {{level}} of {{name}} to {{place}}?',
        'locations.export_subregions_products_locations':' What subregions contribute to the exports of {{item}} from the {{level}} of {{name}} to {{place}}?',
        'locations.import_subregions': 'What subregions contribute to the imports for the {{level}} of {{name}}?',
        'locations.import_subregions_products': 'What subregions contribute to the imports of {{item}} for the {{level}} of {{name}}?',
        'locations.import_subregions_locations': 'What subregions contribute to the imports for the {{level}} of {{name}} from {{place}}?',
        'locations.import_subregions_products_locations': 'What subregions contribute to the imports of {{item}} for the {{level}} of {{name}} from {{place}}?'
      }
    },
    'builder_nav': {
      'header': 'More graphs for this location',
      'intro': "Select a question to see the corresponding graph. If the question has missing parameters ({{icon}}) , you'll fill those in when you click.",
      'location': {
        'products.export_value': 'What products does {{name}} export?',
        'products.export_value.scatter': 'What products have the best combination of complexity and opportunity for {{name}}?',
        'products.export_value_to': 'What products does {{name}} export to {{place}}?',
        'products.import_value': 'What products does {{name}} import?',
        'products.import_value_from': 'What products does {{name}} import from {{place}}?',
        'products.map': 'What does the product map look like for {{name}}?',
        'industries.employment': 'What industries in {{name}} employ the most people?',
        'industries.wages.scatter': 'What industries have the best combination of complexity and opportunity for {{name}}?',
        'industries.wages': 'What industries are in {{name}}?',
        'industries.wages_highest': 'What industries offer the highest wages for {{place}}?',
        'industries.wages_highest_per_worker': 'What industries in {{name}} have the highest wages per worker?',
        'industries.map': 'What does the industry map look like for {{name}}?',
        'locations.export': 'What countries does {{name}} export to?',
        'locations.export_to': 'What countries does {{name}} export {{item}} to?',
        'locations.import_from': 'What countries does {{name}} import from?',
        'locations.import_product_from': 'What countries does {{name}} import {{item}} from?',
        'locations.export_subregions': 'What subregions contribute to the exports from {{name}}?',
        'locations.export_subregions_products': 'What subregions contribute to the exports of {{item}} from {{name}}?',
        'locations.export_subregions_locations':'What subregions contribute to the exports from {{name}} to {{place}}?',
        'locations.export_subregions_products_locations':' What subregions contribute to the exports of {{item}} from {{name}} to {{place}}?',
        'locations.import_subregions': 'What subregions contribute to the imports for {{name}}?',
        'locations.import_subregions_products': 'What subregions contribute to the imports of {{item}} for {{name}}?',
        'locations.import_subregions_locations': 'What subregions contribute to the imports for {{name}} from {{place}}?',
        'locations.import_subregions_products_locations': 'What subregions contribute to the imports of {{item}} for {{name}} from {{place}}?'
      }
    },
    'builder_mod_header': {
      'location': {
        'products.export_value': 'Total Exports',
        'products.export_value.scatter': 'Complexity and Opportunity',
        'products.import_value': 'Total Imports',
        'industries.employment': 'Total Employment',
        'industries.wages.scatter': 'Complexity and Opportunity',
        'industries.wages': 'Total Wages'
      }
    }
  },
  stepper: {
    0: `This circle represents bananas.
      Think of it as a container for all
      the capabilities needed to extract
      and transport bananas.`,
    1: `Bananas are lucrative, but the
      capabilities needed to extract it can't
      be used to make many other products. That's
      why bananas are a low opportunity product.`,
    2: `Here we arrange products by the similarity of the
      capabilities required in their production, given international
      patterns. %@'s current exports are circled in
      blue. Follow the links from those exports to see more products
      that %@ could start exporting`,
    3: `But %@ doesn't just want more products,
      it wants complex products that require sophisticated capabilities
      that are not common to many countries. This is not the
      case of bananas, which is produced by almost every country
      that has banana trees. We shade products green by their
      complexity—that is, how many countries export them.`
   }
};
