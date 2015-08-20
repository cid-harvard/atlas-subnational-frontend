export default {
  'general': {
    'locations': 'Lugares',
    'export_and_import': 'Productos',
    'industries': 'Sectores',
    'occupations': 'Ocupaciónes',
    'location': 'lugar',
    'product': 'producto',
    'industry': 'sector',
    'occupation': 'ocupación',
    'treemap': 'Gráfico de composición',
    'multiples': 'Gráficos de áreas',
    'geo': 'Mapa geográfico',
    'scatter': 'Gráfico de dispersión',
    'similarity': 'Espacio similitud'
  },
  'pageheader': {
    'brand_slogan': 'Utilizando datos para mantener Colombia competitiva',
    'search_link': 'Buscar',
    'profile_link': 'Perfil',
    'about': '¿Quiénes somos?',
    'download': 'Descargue los datos',
    'search_placeholder': 'Busque el lugar, producto o sector',
    'graph_builder_link': 'Graficador'
  },
  'index': {
    'colombia_profile': 'Read the profile for Colombia'
  },
  'location.model':{
    'department': 'departamento',
    'municipality': 'municipio',
    'population_center': 'centro poblacional'
  },
  'ctas': {
    'export': 'Exportar',
    'share': 'Compartir',
    'download': 'Descargue estos datos',
    'pdf': 'PDF',
    'png': 'PNG',
    'embed': 'Insertar',
    'twitter': 'Twitter',
    'facebook': 'Facebook',
    'csv': 'CSV',
    'excel': 'Excel'
  },
  'search': {
    'header': 'Resultados',
    'intro': 'Busque el lugar, producto, sector u ocupación que le interese',
    'placeholder': 'Escriba aquí para buscar lo que quiere',
    'results_products': 'Productos',
    'results_locations': 'Lugares',
    'results_industries': 'Sectores',
    'didnt_find': '¿Encontró lo que buscaba? Nos interesa saber: TKTK@prospedia.com.'
  },
  'graph_builder': {
    'view_more': 'Muestre más',
    'table': {
      'name': 'Nombre',
      'export_value': 'Exportaciones',
      'import_value': 'Importaciones',
      'export_rca': 'VCR',
      'rca': 'VCR',
      'wages': 'Salarios (COP)',
      'employment': 'Empleo',
      'avg_wage': 'Salario medio',
      'employment_growth': 'El crecimiento del empleo (2008–2012)',
      'num_establishments': 'Número de empresas',
      'year': 'Año',
      'complexity': 'Complejidad',
      'distance': 'Distancia'
    },
    'settings' : {
      'label': 'Configuración',
      'change_time' : 'Cambie el período:',
      'close_settings': 'Archive y cierre',
      'to': 'a',
    },
    'search': {
      'placeholder': 'Destaque {{entity}} en el gráfico siguiente',
      'submit': 'Destacar'
    },
    'change_graph': {
      'label': 'Gráficos',
    },
    'questions': {
      'label': 'Cambiar pregunta'
    },
    'multiples': {
      'show_all': 'Mostrar todo',
    },
    'page_title': {
      'industry': {
        'departments.employment': '¿Cuando en Colombia no {{name}} emplea a más gente?',
        'departments.wages': '¿Cuando en Colombia no {{name}} paga los salarios más altos del total?',
        'departments.wages_avg': '¿Cuando en Colombia no {{name}} paga los salarios más altos por trabajador?'
      },
      'product': {
        'locations.export_value': '¿Qué lugares en Colombia exportar {{name}}?',
        'locations.import_value': '¿Qué lugares en Colombia importar {{name}}?'
      },
      'location': {
        'locations.export': '¿A qué países exporta {{name}}?',
        'locations.export_to': '¿A qué países {{name}} exporta {{item}}?',
        'locations.import_from': '¿De qué países importa {{name}}?',
        'locations.import_product_from': '¿De qué países {{name}} importa {{item}}?',
        'locations.export_subregions': '¿Cómo se descomponen por lugar de origen las exportaciones de {{name}}?',
        'locations.export_subregions_products': '¿Cómo se descomponen por lugar de origen las exportaciones de {{item}} de {{name}}?',
        'locations.export_subregions_locations':'¿Cómo se descomponen por lugar de origen las exportaciones de {{name}} a {{place}}?',
        'locations.export_subregions_products_locations':' ¿Cómo se descomponen por lugar de origen las exportaciones de {{item}} de {{name}} a {{place}}?',
        'locations.import_subregions': '¿Cómo se descomponen por lugar de origen las importaciones de {{name}}?',
        'locations.import_subregions_products': '¿Cómo se descomponen por lugar de origen las importaciones de {{item}} de {{name}}?',
        'locations.import_subregions_locations': '¿Cómo se descomponen por lugar de origen las importaciones de {{name}} a {{place}}?',
        'locations.import_subregions_products_locations': '¿Cómo se descomponen por lugar de origen las importaciones de {{item}} de {{name}} a {{place}}?',
        'products.export_value': '¿Qué exporta {{name}}?',
        'products.scatter': '¿Qué productos tienen el mayor potencial para {{name}}?',
        'products.export_value_to': '¿Qué productos importa {{name}} de {{place}}?',
        'products.import_value': '¿Qué productos importa {{name}}?',
        'products.import_value_from': '¿Qué productos importa {{name}} de {{place}}?',
        'products.similarity': '¿Cómo es el espacio del producto de {{name}}?',
        'industries.employment': '¿Qué sectores generan más empleo en {{name}}?',
        'industries.scatter': '¿Qué sectores relativamente complejos y que ayuden a elevar la complejidad podrían desarrollarse más en {{name}}?',
        'industries.wages': '¿Qué sectores pagan los salarios más altos?',
        'industries.wages_avg': '¿Qué sectores en {{name}} pagan los salarios más altos por trabajador?',
        'industries.similarity': '¿Cómo es el espacio de los sectores de {{name}}?'
      }
    },
    'builder_nav': {
      'header': 'Más gráficos para este {{entity}}',
      'intro': 'Seleccione una pregunta para ver el gráfico correspondiente. Si en la pregunta faltan parámetros ({{icon}}), los podrá llenar cuando haga click.',
    },
    'recirc' : {
      'header': 'Lea el perfil de este  {{entity}}'
    },
    'builder_mod_header': {
      'industry': {
        'locations.employment': 'Empleo total',
        'locations.wages': 'Salarios totales (COP)',
        'locations.wage_avg': 'Salarios promedio (COP)',
        'departments.employment': 'Empleo total',
        'departments.wages': 'Salarios totales (COP)',
        'departments.wage_avg': 'Salarios promedio (COP)',
      },
      'product': {
        'locations.export_value': 'Total',
        'locations.import_value': 'Total'
      },
      'location': {
        'products.export_value': 'Exportaciones totales',
        'products.scatter': 'Complejidad y valor estratégico',
        'products.similarity': 'Complejidad y valor estratégico',
        'products.import_value': 'Importaciones totales',
        'industries.employment': 'Empleo total',
        'industries.scatter': 'Complejidad y valor estratégico',
        'industries.similarity': 'Complejidad y valor estratégico',
        'industries.wages': 'Salarios totales',
      }
    }
  },
  'location.show': {
    'overview': 'Visión de conjunto',
    'bullet.gdp_grow_rate': 'La tasa de crecimiento del PIB entre {{yearRange}} fue {{gdpGrowth}}',
    'bullet.gdp_pc': 'El PIB per capita de {{name}} es {{lastGdpPerCapita}}',
    'bullet.last_pop': 'La población es {{lastPop}}',
    'all_departments': 'Comparación con otros departamentos',
    'value': 'Valor',
    'growth_annual': 'Tendencia ({{yearRange}})',
    'gdp_pc': 'PIB per cápita',
    'gdp': 'PIB',
    'population': 'Población',
    'employment_and_wages': 'Actividad económica formal por sectores',
    'total_wages': 'Salarios totales pagados ({{lastYear}})',
    'employment': 'Empleo total ({{lastYear}})',
    'exports_and_imports': 'Exportaciones e importaciones',
    'imports': 'Importaciones ({{year}})',
    'exports': 'Exportaciones ({{year}})',
    'export_possiblities': 'Posibilidades de exportación',
    'export_possiblities.intro': 'Hemos encontrado que los países que exportan productos más complejos crecen más rápido. Usando el "espacio del producto" presentado arriba, estamos destacando productos de alto potencial para {{name}}, ordenados por las mejores combinaciones de complejidad actual y complejidad potencial.',
    'export_possiblities.footer': 'Los productos indicados pueden no ser viables debido a condiciones del lugar que no se consideran en el análisis de similitud tecnológica.',
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
    'employment_and_wages': 'Actividad económica formal por sectores',
    'industries': 'Sectores',
    'value': 'Valor',
    'employment_growth': 'Crecimiento del empleo (2008-2013)',
    'avg_wages': 'Promedio de salarios ({{year}})',
    'employment': 'Empleo ({{year}})',
    'industry_composition': 'Composición de la industria (2012)',
  },
  'about': {
    'project_description': '<section class="stream__section"> <p class="section__p">In Colombia, income gaps between regions are huge and have been growing: new job opportunities are increasingly concentrated in the metropolitan areas of Bogotá, Medellín and Cali, as well as a few places where oil and other minerals are extracted. The average income of residents of Bogotá is four times that of Colombians living in the 12 poorest departments.</p> <p class="section__p">Prosperia is a diagnostic tool that firms, investors and policymakers can use to improve the productivity of departments, cities and municipalities. It maps the geographical distribution of Colombia’s productive activities and employment by department, metropolitan area and municipality, and identifies exports and industries of potential to increase  economic complexity and accelerate growth.</p> </section> <section class="stream__section"> <h3 class="section__head">About CID, Growth Lab and the Atlas of Economic Complexity</h3> <p class="section__p">This project is funded by <a class="link--stream" href="http://www.bancoldex.com/">Bancóldex</a> and <a class="link--stream" href="http://www.fmsd.org.co/">Fundación Mario Santo Domingo</a> and was developed by the <a class="link--stream" href="http://www.hks.harvard.edu/centers/cid">Center for International Development</a> at Harvard University, under the leadership of Professor <a class="link--stream" href="http://ricardohausmann.com/">Ricardo Hausmann</a>.</p> <p class="section__p">The Center for International Development (CID) at Harvard University works to advance the understanding of development challenges and offer viable, inclusive solutions to problems of global poverty. CID is Harvard’s leading research hub focusing on resolving the dilemmas of public policy associated with generating stable, shared, and sustainable prosperity in developing countries. The Growth Lab is one of CID’s core research programs. Faculty and fellows work to understand the dynamics of growth and to translate those insights into more effective policymaking in developing countries. The Lab places economic complexity and diversification at the center of the development story and uncovers how countries and cities can move into industries with potential to increase productivity.</p> <p class="section__p">Economic Complexity is a measure of the amount of productive capabilities, or knowhow, that a country or a city has. Products are vehicles for knowledge. To make a shirt, one must design it, produce the fabric, cut it, sew it, pack it, market it and distribute it. For a country to produce shirts, it needs people who have expertise in each of these areas. Each of these tasks involves many more capabilities than any one person can master. Only by combining know-how from different people can any one product be made. The road to economic development involves increasing what a society knows how to do. Countries with more productive capabilities can make a greater diversity of products. Economic growth occurs when countries develop the capabilities and productive knowledge to produce more, and more complex, products.</p> <p class="section__p">This research has been applied at the international level in an online tool, The Atlas of Economic Complexity. By partnering with Colombia, the lab has been able to investigate export and industry possibilities at the sub-national level.</p> </section> <section class="stream__section"> <h3 class="section__head">Founding Partners</h3> <h4 class="section__subhead">Mario Santo Domingo Foundation</h4> <p class="section__p">Created in 1953, the Mario Santo Domingo Foundation (FMSD) is a non-profit organization dedicated to implementing community development programs in Colombia. FMSD decided to concentrate its main efforts in the construction of affordable housing within a Community Development Model, named Integral Development of Sustainable Communities (DINCS in its Spanish initials) and designed by the FMSD as a response to the large housing deficit in Colombia. Through this program, the FMSD delivers social support for families, and social infrastructure and urban development for the less privileged. FMSD also supports entrepreneurs in the Northern region of Colombia and in Bogotá through its Microfinance Unit which provides training and financial services such as microcredit. More than 130,000 entrepreneurs have received loans from the Foundation since its launch in 1984. Finally, the FMSD works to identify alliances and synergies between the public and private sectors in critical social development areas such as early childhood, environmental sustainability, disaster attention, education and health.</p> <h4 class="section__subhead">Bancóldex</h4> <p class="section__p">Bancóldex is the entrepreneurial development bank of Colombia. It is committed to developing financial and non-financial instruments geared to enhance the competitiveness, productivity, growth and internationalization of Colombian enterprises. Leveraging on its unique relational equity and market position, Bancóldex manages financial assets, develops access solutions to financing and deploys innovative capital solutions, to foster and accelerate company growth. Besides offering traditional loans, Bancóldex has been appointed to implement several development program such as iNNpulsa Colombia, iNNpulsa Mipyme, Banca de las Oportunidades, and the Productive Transformation Program, all of them, in an effort to consolidate an integrated offer to promote Colombian business environment and overall competitiveness. The [insert name here] elaborates on the work that Bancóldex has been undertaking through its Productive Transformation Program and <a class="link--stream" href="http://www.innpulsacolombia.com/">INNpulsa Colombia</a> initiatives.</p> </section> <section class="stream__section"> <h3 class="section__head">Contact information</h3> <a class="link--stream" href="mailto:">Eduardo_Lora/hks.harvard.edu</a> </section> <section class="stream__section"> <h3 class="section__head">Newsletter sign-up CTA</h3> <p class="section__p">Sign up for CID’s Research Newsletter to keep up-to-date with related breakthrough research and practical tools, including updates to this site. </p> <a class="link--stream" href="http://www.hks.harvard.edu/centers/cid/news-events/subscribe">http://www.hks.harvard.edu/centers/cid/news-events/subscribe</a> </section>',
    'glossary': '<h3 class="section__head" id="product-complexity-index">Áreas metropolitanas y ciudades</h3> <p class="section__p">Un área metropolitana es la combinación de dos o más municipios que están conectados a través de flujos relativamente grandes de trabajadores (con independencia de su tamaño o contigüidad). Un municipio debe enviar al menos un 10% de sus trabajadores como viajeros diarios al resto de los municipios del área metropolitana para considerarse como parte de dicha área.</p> <p class="section__p">Con base en esta definición hay 19 áreas metropolitanas en Colombia, que comprenden 115 municipios. Las áreas metropolitanas resultantes son distintas de las oficiales (excepto en el caso del Valle de Aburrá, el área metropolitana de Medellín). Se sigue la metodología de Duranton y Giles ( 2013): “Delineating metropolitan areas: Measuring spatial labour market networks through commuting patterns.” Wharton School, University of Pennsylvania.</p> <p class="section__p">Aparte de las áreas metropolitanas, hay otras 43 ciudades en Colombia, definidas como municipios con más de 50.000 habitantes, con al menos 75% de la población en la principal zona urbana (cabecera).</p> <h3 class="section__head" id="product-complexity-index">Complejidad </h3> <p class="section__p">El concepto de complejidad es central en Prospedia porque las rutas hacia la prosperidad de una sociedad dependen de que las empresas puedan producir y exportar con éxito bienes y servicios que requieren capacidades y conocimientos más complejos, es decir más diversos y exclusivos. La complejidad puede medirse para un lugar (véase <a class="link--stream" href="#economic-complexity-index">Índice de Complejidad Económica, ICE</a>), para un producto de exportación (véase <a class="link--stream" href="#economic-complexity-index">Índice de Complejidad del Producto, ICP</a>), o para un sector (véase <a class="link--stream" href="#economic-complexity-index">Índice de Complejidad Sectorial, ICS</a>).</p> <h3 class="section__head" id="product-complexity-index">Complejidad potencial de un lugar</h3> <p class="section__p">Mide el potencial de aumento de la complejidad de un lugar. Tiene en cuenta el nivel de complejidad de todos los sectores productivos (o productos de exportación),  junto con la “distancia”  a los demás sectores (o productos). Con esta información mide la probabilidad de que aparezcan nuevos sectores (o exportaciones) y qué tanto elevarían la complejidad del lugar. Valores más altos indican que es más probable desarrollar nuevos sectores (o productos) más complejos que los que ya se tienen.</p> <h3 class="section__head" id="product-complexity-index">Distancia a un sector o exportación en un lugar</h3> <p class="section__p">La “distancia” es una medida de la capacidad de un lugar para desarrollar un sector o una exportación específica, teniendo en cuenta las capacidades productivas existentes. La “distancia” es menor en la medida en que las capacidades requeridas por un sector o exportación son más similares a las ya existentes. En esa medida serán mayores las posibilidades de que desarrolle con éxito el sector o exportación. Visto de otra forma, la distancia refleja la proporción del conocimiento productivo que se necesita para que aparezca un sector o exportación que aún no existe en el lugar.</p> <h3 class="section__head" id="product-complexity-index">Empleo, salarios y tasa de empleo formal</h3> <p class="section__p">El empleo formal es aquel que está cubierto por el sistema de seguridad social en salud y/o por el sistema de pensiones. Los salarios formales son los salarios declarados por las empresas como base para ese propósito. La tasa de formalidad es la proporción de la población mayor de 15 años del lugar que tiene un empleo formal. Los datos de empleo y salarios provienen de la PILA del Ministerio de Salud. Los datos de población son del DANE.</p> <h3 class="section__head" id="product-complexity-index">Índice de Complejidad del Producto (ICP)</h3> <p class="section__p">Ordena los productos de exportación según qué tantas capacidades productivas se requieren para su fabricación. Un producto como pasta de dientes es mucho más que pasta en un tubo, ya que incorpora tácitamente el conocimiento que se necesita para producir los agentes químicos que matan los gérmenes que causan caries y enfermedad de las encías. Productos complejos de exportación, tales como químicos y maquinaria, requieren un nivel sofisticado y diverso de conocimientos que sólo se consigue con la interacción en empresas de muchos individuos con conocimientos especializados. Esto contrasta con las exportaciones de baja complejidad, como el café, que requieren apenas conocimientos productivos básicos que se pueden reunir en una empresa familiar. Para calcular la complejidad de los productos de exportación se utilizan datos de <a class="link--stream" href="http://comtrade.un.org/">Comtrade de las Naciones Unidas</a> para cerca de 200 países.</p> <h3 class="section__head" id="product-complexity-index">Índice de Complejidad Económica (ICE)</h3> <p class="section__p">Una medida de la sofisticación de las capacidades productivas de un lugar basada en la diversidad y la exclusividad de sus sectores productivos o sus exportaciones. Un lugar con alta complejidad produce o exporta bienes y servicios que pocos otros lugares producen. Lugares altamente complejos tienden a ser más productivos y a generar mayores salarios e ingresos. Los países con canastas de exportación más sofisticadas de lo que se espera para su nivel de ingresos (como China) tienden a crecer más rápido que aquellos en los que es todo lo contrario (como Grecia).</p> <h3 class="section__head" id="product-complexity-index">Índice de Complejidad Sectorial (ICS)</h3> <p class="section__p">Ordena los sectores productivos del país según qué tantas capacidades productivas requieren para operar. La complejidad de los sectores y de las exportaciones son medidas estrechamente relacionadas, pero se calculan en forma separada con datos y sistemas de clasificación independientes, ya que las exportaciones se limitan a mercancías comercializables internacionalmente, mientras que los sectores productivos comprenden todos los sectores que generan empleo, incluidos todos los servicios y el sector público. Un sector es complejo si requiere un nivel sofisticado de conocimientos productivos, como los servicios financieros y los sectores farmacéuticas, en donde trabajan en grandes empresas muchos individuos con conocimientos especializados distintos. La complejidad de un sector se mide calculando la diversidad promedio de los lugares donde existe el sector y la ubicuidad promedio de los sectores de esos lugares. Los datos de empleo formal necesarios para estos cálculos provienen de la PILA del Ministerio de Salud.</p> <h3 class="section__head" id="product-complexity-index">Mapa de similitud de productos de exportación</h3> <p class="section__p">Una visualización que muestra que tan similares son los conocimientos requeridos para la exportación de unos productos y otros. Cada punto representa un producto de exportación y cada enlace entre un par de productos indica que requieren capacidades productivas similares. Cuando se selecciona un lugar, el mapa destaca los productos que ya se exportan y aquéllos que, por requerir capacidades productivas semejantes, podrían exportarse exitosamente. El mapa presenta caminos potenciales para la diversificación de las exportaciones a partir de los conocimientos y capacidades existentes. Un producto con más enlaces con otros que no se exportan ofrece mayor potencial para la diversificación exportadora a través de las capacidades compartidas. Y si esas capacidades son complejas, el producto tiene un alto potencial para elevar la complejidad del lugar. <p class="section__p">El mapa de similitud de los productos se basa en los datos de comercio internacional de 192 países en más de 50 años. Ver <a class="link--stream" href="http://atlas.cid.harvard.edu/">http://atlas.cid.harvard.edu/.</a></p> <h3 class="section__head" id="product-complexity-index">Mapa de similitud de los sectores productivos de Colombia</h3> <p class="section__p">Una visualización que muestra que tan similares son los conocimientos requeridos por unos sectores u otros. Cada punto representa un sector y cada enlace entre un par de sectores indica que requieren capacidades productivas similares. Cuando se selecciona un lugar, el mapa destaca los sectores que ya existen en el lugar y aquéllos que, por requerir capacidades productivas semejantes, podrían surgir exitosamente. El mapa presenta rutas potenciales para la expansión sectorial a partir de los conocimientos y capacidades existentes. Un sector con más enlaces con sectores que no existen ofrece mayor potencial para la diversificación productiva a través de las capacidades compartidas. Y si esas capacidades son complejas, el sector tiene un alto potencial para elevar la complejidad del lugar. El mapa de los sectores productivos de Colombia fue construido a partir de la información de empleo formal por municipio de la PILA del Ministerio de Salud.</p> <h3 class="section__head" id="product-complexity-index">Valor estratégico de un sector o una exportación para un lugar</h3> <p class="section__p">Capta en qué medida un lugar podría beneficiarse mediante el desarrollo de un sector en particular (o un producto de exportación). También conocida como "ganancia de oportunidad", esta medida representa la distancia a todos los otros sectores (o exportaciones) que un lugar no produce actualmente y su respectiva complejidad. Refleja cómo un nuevo sector (o exportación) puede abrir paso a otros sectores o productos más complejos.</p> <h3 class="section__head" id="product-complexity-index">Ventaja Comparativa Revelada (VCR) de un sector o una exportación en un lugar</h3> <p class="section__p">Mide el tamaño relativo de un sector o un producto de exportación en un lugar. La VCR, que no debe interpretarse como un indicador de eficiencia productiva o de competitividad, se conoce también por el nombre de "cociente de localización”. Se calcula como el cociente entre la participación del empleo formal de un sector en el lugar y la participación del empleo formal total del mismo sector en todo el país. Para una exportación es la relación entre el peso que tiene el producto en la canasta de exportación del lugar y el peso que tiene en el comercio mundial. Si esta relación es mayor que 1, se dice que el lugar tiene ventaja comparativa revelada en el sector o en la exportación.</p>'
  }
};
