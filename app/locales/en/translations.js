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
    'municipality': 'municipality',
    'population_center': 'population center'
  },
  'ctas': {
    'export': 'Export',
    'share': 'Share',
    'download': 'Download this data'
  },
  'search': {
    'header': 'Search',
    'intro': "First, search for the location, product, industry or occupation that you're interested in.",
    'placeholder': "Type here to search",
    'results_products': 'Results: Products',
    'results_locations': 'Results: Locations',
    'results_industries': 'Results: Industries',
    'didnt_find': "Didn't find what you were looking for? Let us know: TKTK@prosperia.com"
  },
  'graph_builder': {
    'read_more': 'Read the profile and complexity analysis for this location',
    'view_more': 'View More',
    'table': {
      'name': 'Name',
      'export_value': 'Export',
      'export_rca': 'RCA',
      'rca': 'RCA',
      'wages': 'Wages',
      'employment': 'Employment',
      'avg_wage': 'Average Wage',
      'employment_growth': 'Employment Growth, `08-`12',
      'num_establishments': 'Number of Firms',
      'year': 'Year',
      'complexity': 'Complexity',
      'distance': 'Distance'
    },
    'settings' : {
      'label': 'Settings',
      'change_time' : 'Change time period:',
      'close_settings': 'Save and close',
      'to': 'to'
    },
    'search': {
      'placeholder': 'Highlight {{entity}} on the graph below',
      'submit': 'Highlight'
    },
    'change_graph': {
      'label': 'Graphs',
    },
    'multiples': {
      'show_all': 'Show All',
    },
    'page_title': {
      'industry': {
        'departments.employment': 'What departments does {{name}} employ the most people',
        'departments.wages': 'What departments does {{name}} pay the highest total wages',
        'departments.wage_avg': 'What departments does {{name}} pay the highest average wages',
      },
      'product': {
        'locations.export_value': 'What departments the export {{name}}?',
        'locations.import_value': 'What departments the export {{name}}?',
      },
      'location': {
        'products.export_value': 'What products does {{name}} export?',
        'products.scatter': 'What products have the best combination of complexity and opportunity for {{name}}?',
        'products.export_value_to': 'What products does {{name}} export to {{place}}?',
        'products.import_value': 'What products does {{name}} import?',
        'products.import_value_from': 'What products does {{name}} import from {{place}}?',
        'products.similarity': 'What does the product map look like for {{name}}?',
        'industries.employment': 'What industries in {{name}} employ the most people?',
        'industries.scatter': 'What industries have the best combination of complexity and opportunity for {{name}}?',
        'industries.wages': 'What industries in {{name}} are the largest by total wages?',
        'industries.wages_highest_per_worker': 'What industries in {{name}} have the highest wages per worker?',
        'industries.similarity': 'What does the industry map look like for {{name}}?',
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
    'builder_nav': {
      'header': 'More graphs for this {{entity_type}}',
      'intro': "Select a question to see the corresponding graph. If the question has missing parameters ({{icon}}) , you'll fill those in when you click.",
    },
    'builder_mod_header': {
      'industry': {
        'departments.employment': 'Total Employment',
        'departments.wages': 'Total Wages (COP)',
        'departments.wage_avg': 'Average Wages (COP)',
      },
      'product': {
        'locations.export_value': 'Departments of Colombia',
      },
      'location': {
        'products.export_value': 'Total Exports',
        'products.scatter': 'Complexity and Opportunity',
        'products.similarity': 'Complexity and Opportunity',
        'products.import_value': 'Total Imports',
        'industries.employment': 'Total Employment',
        'industries.scatter': 'Complexity and Opportunity',
        'industries.similarity': 'Complexity and Opportunity',
        'industries.wages': 'Total Wages'
      }
    }
  },
  'location.show': {
    'overview': 'Overview',
    'bullet.gdp_grow_rate': 'GDP grew {{gdpGrowth}} between {{yearRange}}',
    'bullet.gdp_pc': '{{name}} has a GDP per capita at {{lastGdpPerCapita}}',
    'bullet.last_pop': 'The population is {{lastPop}}',
    'all_departments': 'All 32 departments',
    'value': 'Value',
    'growth_annual': 'Growth, annual ({{yearRange}})',
    'gdp_pc': 'GDP per Capita',
    'gdp': 'GDP',
    'population': 'Population',
    'employment_and_wages': 'Employment and Wages',
    'total_wages': 'Total Wages {{lastYear}}',
    'employment': 'Employment {{lastYear}}',
    'exports_and_imports': 'Exports and imports',
    'exports': 'Exports, {{year}}',
    'export_possiblities': 'Export possiblities',
    'export_possiblities.intro': "We've found that countries which export complex products grow faster than those which export simple products. Using the similarity map we built in the section above, we've highlighted  high potential products for {{name}}, ranked by which have the highest combination of opportunity and complexity.",
    'export_possiblities.footer': 'Note that the list is dynamically generated.  Not all exports may make sense given local conditions not captured in our measure of product similarity.',
    'stepper': {
      1: `This circle represents bananas.
        Think of it as a container for all
        the capabilities needed to extract
        and transport bananas.`,
      2: `Bananas are lucrative, but the
        capabilities needed to extract it can't
        be used to make many other products. That's
        why bananas are a low opportunity product.`,
      3: `Here we arrange products by the similarity of the
        capabilities required in their production, given international
        patterns. {{name}}'s current exports are circled in
        blue. Follow the links from those exports to see more products
        that {{name}} could start exporting`,
      4: `But {{name}} doesn't just want more products,
        it wants complex products that require sophisticated capabilities
        that are not common to many countries. This is not the
        case of bananas, which is produced by almost every country
        that has banana trees. We shade products green by their
        complexity—that is, how many countries export them.`
     }
  },
  'industry.show': {
    'employment_and_wages': 'Employment and Wages',
    'industries': 'Industries',
    'value': 'Value',
    'employment_growth': 'Employment Growth (2008-2013)',
    'avg_wages': 'Average Wages {{year}}',
    'employment': 'Employment {{year}}',
    'industry_composition': 'Industry Composition, 2012'
  }
};
