export default {
  'general': {
    'locations': 'Locations',
    'export_and_import': 'Products',
    'industries': 'Industries',
    'occupations': 'Occupations',
    'location': 'location',
    'product': 'product',
    'industry': 'industry',
    'occupation': 'occupation',
    'treemap': 'Treemap',
    'multiples': 'Area charts',
    'geo': 'Geographic map',
    'scatter': 'Scatterplot',
    'similarity': 'Similarity space'
  },
  'pageheader': {
    'brand_slogan': 'Using data to keep Colombia competitive',
    'search_link': 'Search',
    'profile_link': 'Profile',
    'about': 'About',
    'download': 'Download the data',
    'search_placeholder': 'Search for a location, product or industry',
    'graph_builder_link': 'Graph Builder'
  },
  'index': {
    'header_head': 'You haven’t seen Colombia like this before',
    'header_subhead': 'Visualize the possibilities for industries, exports and locations across Colombia.',
    'profiles_head': 'Start with our profiles',
    'profiles_subhead': 'Just the essentials, presented as a one-page summary',
    'profiles_cta': 'Read the profile for Antioquia',
    'builder_head': 'Then dive into the graph builder',
    'builder_subhead': 'Create graphs and maps for your presentations',
    'builder_cta': 'Build graphs about coffee',
    'complexity_head': 'The complexity advantage',
    'complexity_subhead': 'Countries that export complex products, which require a lot of knowledge, grow faster than those that export raw materials. Researchers at Harvard University have pioneered a way to measure and visualize the complexity of every export and industry in Colombia.',
    'complexity_figure': {
      'head': 'Contribution to variance in economic growth, percentage (10-year)',
      'WEF_name': 'WEF competitiveness ranking',
      'complexity_name': 'Complexity ranking'
    },
    'complexity_caption': 'How good is it? Country growth predictions using economic complexity were <a href="http://atlas.cid.harvard.edu/media/atlas/pdf/HarvardMIT_AtlasOfEconomicComplexity.pdf" class="link--stream">more than six times as accurate</a> as conventional metrics, such as the World Governance Indicators.',
    'complexity_cta': 'Read more about complexity',
    'research_head': 'Research featured in',
    'present_head': 'Charting the present',
    'present_subhead': 'Use our treemaps to break down your department, city or municipality’s exports and employment',
    'future_head': 'To map the future',
    'future_subhead': 'Find the untapped markets best suited to your location',
    'questions_head': 'We’re not a crystal ball',
    'questions_subhead': 'But we can answer a lot of questions.',
    'location_head': 'Learn about a location',
    'location_q1': 'What industries in Bogotá employ the most people?',
    'location_q2': 'What products have the most potential in Antioquia?',
    'industry_head': 'Learn about an industry',
    'industry_q1': 'Where in Colombia does the insurance industry employ the most people?',
    'industry_q2': 'What are the skills needed by the chemical industry?',
    'product_head': 'Learn about an export',
    'product_q1': 'What places in Colombia export bananas?',
    'product_q2': 'What places in Colombia import computers?',
    'colombia_profile': 'Read the profile for Colombia'
  },
  'location.model':{
    'department': 'department',
    'municipality': 'municipality',
    'population_center': 'population center'
  },
  'ctas': {
    'export': 'Export',
    'share': 'Share',
    'download': 'Download this data',
    'pdf': 'PDF',
    'png': 'PNG',
    'embed': 'Embed',
    'twitter': 'Twitter',
    'facebook': 'Facebook',
    'csv': 'CSV',
    'excel': 'Excel'
  },
  'search': {
    'header': 'Results',
    'intro': 'Search for the location, product, industry or occupation that you’re interested in.',
    'placeholder': 'Type here to search',
    'results_products': 'Products',
    'results_locations': 'Locations',
    'results_industries': 'Industries',
    'didnt_find': 'Didn’t find what you were looking for? Let us know: TKTK@prosperia.com'
  },
  'graph_builder': {
    'view_more': 'View more',
    'table': {
      'name': 'Name',
      'parent': 'Parent',
      'export_value': 'Exports, USD',
      'code': 'Code',
      'import_value': 'Imports, USD',
      'export_rca': 'Revealed Comparative Advantage',
      'rca': 'Revealed Comparative Advantage',
      'wages': 'Total Wages, COP (in thousands)',
      'employment': 'Employment',
      'avg_wage': 'Average Wage',
      'employment_growth': 'Employment Growth (2008-2012)',
      'num_establishments': 'Firms',
      'year': 'Year',
      'complexity': 'Complexity',
      'distance': 'Distance',
      'read_more': 'Unfamiliar with any of the indicators above? Find definitions in our <a href="/about/glossary" class="link--stream link--stream--inline--tiny">glossary</a>.'
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
    'questions': {
      'label': 'Change question'
    },
    'multiples': {
      'show_all': 'Show All',
    },
    'page_title': {
      'industry': {
        'departments.employment': 'Where in Colombia does {{name}} employ the most people?',
        'departments.wages': 'Where in Colombia does {{name}} pay the highest total wages?',
        'departments.wage_avg': 'Where in Colombia does {{name}} pay the highest wages per worker?'
      },
      'product': {
        'locations.export_value': 'What places in Colombia export {{name}}?',
        'locations.import_value': 'What places in Colombia import {{name}}?',
      },
      'location': {
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
        'locations.import_subregions_products_locations': 'What subregions contribute to the imports of {{item}} for {{name}} from {{place}}?',
        'products.export_value': 'What products does {{name}} export?',
        'products.scatter': 'What products have the most potential for {{name}}?',
        'products.export_value_to': 'What products does {{name}} export to {{place}}?',
        'products.import_value': 'What products does {{name}} import?',
        'products.import_value_from': 'What products does {{name}} import from {{place}}?',
        'products.similarity': 'What does the product space look like for {{name}}?',
        'industries.employment': 'What industries in {{name}} employ the most people?',
        'industries.scatter': 'What industries have the most potential for {{name}}?',
        'industries.wages': 'What industries in {{name}} are the largest by total wages?',
        'industries.wages_avg': 'What industries in {{name}} have the highest wages per worker?',
        'industries.similarity': 'What does the industry space look like for {{name}}?'
      }
    },
    'builder_nav': {
      'header': 'More graphs for this {{entity}}',
      'intro': 'Select a question to see the corresponding graph. If the question has missing parameters ({{icon}}) , you’ll fill those in when you click.',
    },
    'recirc' : {
      'header': 'Read the profile for this {{entity}}'
    },
    'builder_mod_header': {
      'industry': {
        'departments.employment': 'Total employment',
        'departments.wages': 'Total wages, COP',
        'departments.wage_avg': 'Average wages, COP',
        'locations.employment': 'Total employment',
        'locations.wages': 'Total wages, COP',
        'locations.wage_avg': 'Average wages, COP',
      },
      'product': {
        'locations.export_value': 'Total',
        'locations.import_value': 'Total'
      },
      'location': {
        'products.export_value': 'Total exports',
        'products.scatter': 'Complexity and opportunity',
        'products.similarity': 'Complexity and opportunity',
        'products.import_value': 'Total imports',
        'industries.employment': 'Total employment',
        'industries.scatter': 'Complexity and opportunity',
        'industries.similarity': 'Complexity and opportunity',
        'industries.wages': 'Total wages'
      }
    }
  },
  'location.show': {
    'overview': 'Overview',
    'bullet.gdp_grow_rate': 'GDP grew {{gdpGrowth}} between {{yearRange}}',
    'bullet.gdp_pc': '{{name}} has a GDP per capita of {{lastGdpPerCapita}}',
    'bullet.last_pop': 'The population is {{lastPop}}',
    'all_departments': 'Compared to the other departments',
    'value': 'Value',
    'growth_annual': 'Growth, annual ({{yearRange}})',
    'gdp_pc': 'GDP per Capita',
    'gdp': 'GDP',
    'population': 'Population',
    'employment_and_wages': 'Employment and wages',
    'total_wages': 'Total wages ({{lastYear}})',
    'employment': 'Employment ({{lastYear}})',
    'exports_and_imports': 'Exports and imports',
    'imports': 'Imports ({{year}})',
    'exports': 'Exports ({{year}})',
    'export_possiblities': 'Export possiblities',
    'export_possiblities.intro': 'We’ve found that countries which export complex products grow faster than those which export simple products. Using the similarity space we built in the section above, we’ve highlighted  high potential products for {{name}}, ranked by which have the highest combination of opportunity and complexity.',
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
    'avg_wages': 'Average Wages ({{year}})',
    'employment': 'Employment ({{year}})',
    'industry_composition': 'Industry Composition, 2012'
  },
  'about': {
    'project_description_name': 'Project Description',
    'glossary_name': 'Glossary',
    'project_description': '<section class="stream__section"> <p class="section__p">In Colombia, income gaps between regions are huge and have been growing: new job opportunities are increasingly concentrated in the metropolitan areas of Bogotá, Medellín and Cali, as well as a few places where oil and other minerals are extracted. The average income of residents of Bogotá is four times that of Colombians living in the 12 poorest departments.</p> <p class="section__p">Prosperia is a diagnostic tool that firms, investors and policymakers can use to improve the productivity of departments, cities and municipalities. It maps the geographical distribution of Colombia’s productive activities and employment by department, metropolitan area and municipality, and identifies exports and industries of potential to increase  economic complexity and accelerate growth.</p> </section> <section class="stream__section"> <h3 class="section__head">About CID, Growth Lab and the Atlas of Economic Complexity</h3> <p class="section__p">This project is funded by <a class="link--stream" href="http://www.bancoldex.com/">Bancóldex</a> and <a class="link--stream" href="http://www.fmsd.org.co/">Fundación Mario Santo Domingo</a> and was developed by the <a class="link--stream" href="http://www.hks.harvard.edu/centers/cid">Center for International Development</a> at Harvard University, under the leadership of Professor <a class="link--stream" href="http://ricardohausmann.com/">Ricardo Hausmann</a>.</p> <p class="section__p">The Center for International Development (CID) at Harvard University works to advance the understanding of development challenges and offer viable, inclusive solutions to problems of global poverty. CID is Harvard’s leading research hub focusing on resolving the dilemmas of public policy associated with generating stable, shared, and sustainable prosperity in developing countries. The Growth Lab is one of CID’s core research programs. Faculty and fellows work to understand the dynamics of growth and to translate those insights into more effective policymaking in developing countries. The Lab places economic complexity and diversification at the center of the development story and uncovers how countries and cities can move into industries with potential to increase productivity.</p> <p class="section__p">Economic Complexity is a measure of the amount of productive capabilities, or knowhow, that a country or a city has. Products are vehicles for knowledge. To make a shirt, one must design it, produce the fabric, cut it, sew it, pack it, market it and distribute it. For a country to produce shirts, it needs people who have expertise in each of these areas. Each of these tasks involves many more capabilities than any one person can master. Only by combining know-how from different people can any one product be made. The road to economic development involves increasing what a society knows how to do. Countries with more productive capabilities can make a greater diversity of products. Economic growth occurs when countries develop the capabilities and productive knowledge to produce more, and more complex, products.</p> <p class="section__p">This research has been applied at the international level in an online tool, The Atlas of Economic Complexity. By partnering with Colombia, the lab has been able to investigate export and industry possibilities at the sub-national level.</p> </section> <section class="stream__section"> <h3 class="section__head">Founding Partners</h3> <h4 class="section__subhead">Mario Santo Domingo Foundation</h4> <p class="section__p">Created in 1953, the Mario Santo Domingo Foundation (FMSD) is a non-profit organization dedicated to implementing community development programs in Colombia. FMSD decided to concentrate its main efforts in the construction of affordable housing within a Community Development Model, named Integral Development of Sustainable Communities (DINCS in its Spanish initials) and designed by the FMSD as a response to the large housing deficit in Colombia. Through this program, the FMSD delivers social support for families, and social infrastructure and urban development for the less privileged. FMSD also supports entrepreneurs in the Northern region of Colombia and in Bogotá through its Microfinance Unit which provides training and financial services such as microcredit. More than 130,000 entrepreneurs have received loans from the Foundation since its launch in 1984. Finally, the FMSD works to identify alliances and synergies between the public and private sectors in critical social development areas such as early childhood, environmental sustainability, disaster attention, education and health.</p> <h4 class="section__subhead">Bancóldex</h4> <p class="section__p">Bancóldex is the entrepreneurial development bank of Colombia. It is committed to developing financial and non-financial instruments geared to enhance the competitiveness, productivity, growth and internationalization of Colombian enterprises. Leveraging on its unique relational equity and market position, Bancóldex manages financial assets, develops access solutions to financing and deploys innovative capital solutions, to foster and accelerate company growth. Besides offering traditional loans, Bancóldex has been appointed to implement several development program such as iNNpulsa Colombia, iNNpulsa Mipyme, Banca de las Oportunidades, and the Productive Transformation Program, all of them, in an effort to consolidate an integrated offer to promote Colombian business environment and overall competitiveness. The [insert name here] elaborates on the work that Bancóldex has been undertaking through its Productive Transformation Program and <a class="link--stream" href="http://www.innpulsacolombia.com/">INNpulsa Colombia</a> initiatives.</p> </section> <section class="stream__section"> <h3 class="section__head">Contact information</h3> <a class="link--stream" href="mailto:">Eduardo_Lora/hks.harvard.edu</a> </section> <section class="stream__section"> <h3 class="section__head">Newsletter sign-up CTA</h3> <p class="section__p">Sign up for CID’s Research Newsletter to keep up-to-date with related breakthrough research and practical tools, including updates to this site. </p> <a class="link--stream" href="http://www.hks.harvard.edu/centers/cid/news-events/subscribe">http://www.hks.harvard.edu/centers/cid/news-events/subscribe</a> </section>',
    'glossary': '<h3 class="section__head">Complexity</h3> <p class="section__p">The concept of complexity is central to Prospedia because the routes to the prosperity of a society depend on firms to successfully produce and export goods and services that require skills and knowledge that are diverse and unique. Complexity can be measured by location (see <a class="link--stream" href="#economic-complexity-index">Economic Complexity Index</a>), by industry (see <a class="link--stream" href="#industry-complexity-index">Industry Complexity Index</a>) or by export product (see <a class="link--stream" href="#product-complexity-index">Product Complexity Index</a>).</p> <h3 class="section__head">Complexity Outlook</h3> <p class="section__p">Ranks the potential for a location to increase its complexity. The ranking accounts for the level of complexity of the industries (or exports) along with the distance of how close the productive capabilities that these products require are to its current industries (or exports). In effect, it measures the likelihood of different industries (or exports) appearing and the value of their added complexity. Higher outlook values indicate “closer distance” to more, and more complex, industries (or exports).</p> <h3 class="section__head">Distance</h3> <p class="section__p">A measure of a location’s ability to enter a specific industry or export, as determined by its current productive capabilities. Also known as a capability distance, the measure accounts for the similarity between the capabilities required by an industry or export and the capabilities already present in a location’s industries or exports. Where a new industry or export requires many of the same capabilities already present in a location’s industries or exports, the product is considered “closer” or of a shorter “distance” to acquire the missing capabilities to produce it. New industries or exports of a further distance require larger sets of productive capabilities that do not exist in the location and are therefore riskier ventures or less likely to be sustained. Thus, distance reflects the proportion of the productive knowledge necessary for an industry or export that a location does not have. This is measured by the proximity between industries or exports, or the probability that two industries or exports will both be present in a location, as embodied by the industry space and product space, respectively.</p> <h3 class="section__head" id="economic-complexity-index">Economic Complexity Index (ECI)</h3> <p class="section__p">A measure of the sophistication of the productive capabilities of a location based on the diversity and exclusivity of its industries or exports. A location with high complexity produces or exports goods and services that few other locations produce. Highly complex locations tend to be more productive and generate higher wages and incomes. Countries with export baskets more sophisticated than what is expected for their income level (such as China) tend to grow faster than those where the opposite is true (such as Greece).</p> <h3 class="section__head" id="industry-complexity-index">Industry Complexity Index (ICI)</h3> <p class="section__p">Ranks industries by the amount of productive capabilities required to operate. The complexity of industries and exports are closely related, but are measured through independent datasets and classification systems as exports are limited to only tradable sectors, while industries comprise all sectors that generate employment, including the public sector. Industries are complex when they require a sophisticated level of productive knowledge, such as many financial services and pharmaceutical industries, with many individuals with distinct specialized knowledge interacting in a large organization. Complexity of the industry is measured by calculating the average diversity of locations that hold the industry and the average ubiquity of the industries that those locations hold. The formal employment data required for these calculations comes from the PILA dataset held by the Ministry of Health.</p> <h3 class="section__head">Formal employment and wages, and formal employment rate</h3> <p class="section__p">Formal employment is defined as employment covered by the health social security system and/or the pension system. Formal wages are those reported by firms to that aim. The formality rate is the share of population 15 or older that has formal employment. Employment and wage data are taken from PILA. Population data comes from DANE.</p> <h3 class="section__head">Industry similarity space</h3> <p class="section__p">A visualization that depicts how similar/dissimilar the productive knowledge requirements are between industries. Each dot represents an industry and each link between a pair of industries indicates that they require similar productive capabilities to operate. The space illustrates what industries a location currently has a presence in, and which industries are of a “closer distance” or require similar capabilities to those existing and are therefore more likely to be successful. The space presents potential paths for industrial expansion by understanding how capabilities are shared across industries. Thus, industries can be understood by the number of links they share with other products and the complexity of those products. A product with more links offers greater potential for diversification across shared capabilities. Thus the number of links that existing industries share to untapped, complex industries determines its complexity outlook. The Colombian industry similarity space is based on formal employment data by industry and municipality from the PILA dataset of the Ministry of Health.</p> <h3 class="section__head">Metropolitan areas and cities</h3> <p class="section__p">A metropolitan area is a combination of two or more municipalities that are connected through relatively large commuting flows (irrespective of their size or contiguity). A municipality must send at least 10% of its workers as daily commuters to the rest of the metropolitan area municipalities to be included. </p> <p class="section__p">Based on this definition there are 19 metropolitan areas in Colombia, which comprise 115 municipalities. The resulting metro areas, which are distinct from official measures except in Medellín’s Valle de Aburrá, are computed with the methodology of Duranton and Giles (2013): “Delineating metropolitan areas: Measuring spatial labour market networks through commuting patterns.” Wharton School, University of Pennsylvania.</p> <p class="section__p">In addition to the metropolitan areas there are other 43 cities in Colombia, defined as municipalities with population over 50,000, with at least 75% of the population in the main urban area.</p> <h3 class="section__head" id="product-complexity-index">Product Complexity Index (PCI)</h3> <p class="section__p">Ranks export products by the amount of productive capabilities required to manufacture them. A product such as toothpaste is much more than paste in a tube, as it embeds the tacit productive knowledge (or knowhow) of the chemicals that kill the germs that cause cavities and gum disease. Complex exports, which include many chemical and machinery products, require a sophisticated level, and diverse base, of productive knowledge, with many individuals with distinct specialized knowledge interacting in a large organization. This contrasts with low complexity exports, like coffee, which require much less basic productive knowledge that can be found in a family-run business. <a class="link--stream" href="http://comtrade.un.org/">UN Comtrade</a> data are used to compute the complexity of export products.</p> <h3 class="section__head">Product similarity space</h3> <p class="section__p">A visualization that depicts how similar/dissimilar the productive knowledge requirements are between export products. Each dot represents a product and each link between a pair of products indicates that the two products require similar capabilities in their production. By depicting the similarity in productive capabilities across products, the product similarity space illustrates for a location what it currently produces, which products are “closer” or of a shorter distance in sharing similar capabilities to those currently existing and are therefore more likely to be successful. The space presents potential paths for industrial expansion by understanding how capabilities are shared across products, where products differ in the number of links and their distance to more complex products. A product with more links offers greater potential for diversification across shared capabilities. Thus the number of links that existing products share to complex products that a location does not currently produce determines the complexity outlook of its exports.</p> <p class="section__p">The shape of the space is based on international trade data for 192 countries over 50 years. See <a class="link--stream" href="http://atlas.cid.harvard.edu/"> The International Atlas of Economic Complexity.</a></p> <h3 class="section__head">Strategic Value</h3> <p class="section__p">Measures how much a location could benefit by developing a particular industry (or export). Also known also as “opportunity gain,” the measure accounts for the distance to all other industries (or exports) that a location does not currently produce and their respective complexity. Strategic gain quantifies how a new industry (or export) can open up links to more, and more complex, products. Thus, the measure calculates the strategic value of an industry (or export) based on the paths it opens to industrial expansion into more complex sectors.</p> <h3 class="section__head">Revealed Comparative Advantage (RCA)</h3> <p class="section__p">Measures the relative size of an industry or an export product in a location. RCA is not a measure of productive efficiency or competitiveness, but just a “location quotient”, as is often referred to. RCA is computed as the ratio between an industry’s share of total formal employment in a location and the share of that industry’s total formal employment in the country. For exports, RCA is the ratio between the share of the export in the export basket of the location and its share in total world trade. If this ratio is larger than 1, the location is said to have revealed comparative advantage in the industry or export.</p>'
  }
};
