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
      'num_establishments': 'Empresas',
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
    'project_description_name': 'TKTK',
    'glossary_name': 'TKTK',
    'project_description': '<section class="stream__section"><p class="section__p">En Colombia, las diferencias de ingresos entre regiones son enormes y han ido creciendo: las nuevas oportunidades de empleo se concentran cada vez más en las áreas metropolitanas de Bogotá, Medellín y Cali, aparte de los lugares donde se extraen petróleo y otros minerales. El ingreso promedio de los residentes de Bogotá es cuatro veces el de los colombianos que viven en los 12 departamentos más pobres.</p><p class="section__p">Prosperia es una herramienta de diagnóstico para que las empresas, los inversionistas y las autoridades de gobierno puedan tomar decisiones que ayuden a elevar la productividad. Contiene información por departamento, área metropolitana y municipio sobre actividad productiva, empleo, salarios y exportaciones. Ofrece criterios para identificar los sectores y las exportaciones con potencial de crecimiento con base en la complejidad productiva.</p></section><section class="stream__section"><h3 class="section__head">Acerca de CID, Crecimiento Lab, y el Atlas de la Complejidad Económica</h3><p class="section__p">Este proyecto es financiado por <a class="link--stream" href="http://www.bancoldex.com/">Bancóldex</a> y la <a class="link--stream" href="http://www.fmsd.org.co/">Fundación Julio Santo Domingo</a> y ha sido desarrollado por el <a class="link--stream" href="http://www.hks.harvard.edu/centers/cid">Centro para el Desarrollo Internacional</a> de la Universidad de Harvard, bajo la dirección del profesor <a class="link--stream" href="http://ricardohausmann.com/">Ricardo Hausmann</a>.</p><p class="section__p">El Centro para el Desarrollo Internacional (CID) de la Universidad de Harvard tiene por objetivos avanzar en la comprensión de los desafíos del desarrollo y ofrecer soluciones viables para reducir la pobreza mundial. El Laboratorio de Crecimiento es uno de los principales programas de investigación del CID.</p><p class="section__p">La Complejidad Económica es una medida de las capacidades y conocimientos de los sectores productivos de un país o una ciudad. Para hacer una camisa, hay que diseñarla, producir la tela, cortar, coser, empacar el producto, comercializarlo y distribuirlo. Para que un país pueda producir camisas, necesita personas que tengan experiencia en cada una de estas áreas. Cada una de estas tareas implica muchas más capacidades de las que cualquier persona sola puede dominar. Sólo mediante la combinación de know-how de diferentes personas puede hacerse el producto. El camino hacia el desarrollo económico consiste en aprender a hacer cosas más sofisticadas. Considere el juego de Scrabble como una analogía: el jugador que tiene un mayor número de letras variadas puede hacer más palabras y conseguir más puntos. Los países con una mayor diversidad de capacidades productivas pueden hacer una mayor diversidad de productos. El desarrollo económico ocurre en la medida en que los países amplían su gama de capacidades y conocimientos para producir productos cada vez más complejos.</p><p class="section__p">Este enfoque conceptual que ha sido aplicado a nivel internacional en el Atlas de la Complejidad Económica se utiliza ahora en esta herramienta en línea para identificar las posibilidades de exportación y de desarrollo sectorial de los departamentos, las áreas metropolitanas y las ciudades colombianas.</p></section><section class="stream__section"><h3 class="section__head">Founding Partners</h3><h4 class="section__subhead">Fundación Mario Santo Domingo</h4><p class="section__p">Creada en 1953, la Fundación Mario Santo Domingo (FMSD) es una organización sin fines de lucro dedicada a la implementación de programas de desarrollo comunitario en Colombia. FMSD concentra sus principales esfuerzos en la construcción de viviendas asequibles dentro de un modelo de desarrollo comunitario llamado Desarrollo Integral de Comunidades Sustentables, diseñado por el FMSD como respuesta al gran déficit de vivienda en Colombia. A través de este programa, el FMSD proporciona apoyo social a las familias, así como infraestructura social y urbana para los menos privilegiados. FMSD también contribuye al desarrollo empresarial de la región Norte de Colombia y de Bogotá a través de su Unidad de Microfinanzas, que ofrece capacitación y servicios financieros como el microcrédito. Más de 130.000 empresarios han recibido préstamos de la Fundación desde su lanzamiento en 1984. FMSD también trabaja en identificar alianzas y sinergias entre los sectores público y privado en las áreas de desarrollo social críticos, como la primera infancia, la sostenibilidad ambiental, la atención de desastres, la educación y la salud.</p><h4 class="section__subhead">Bancóldex</h4><p class="section__p">Bancóldex, el banco de desarrollo empresarial de Colombia, está comprometido con el desarrollo de instrumentos financieros y no financieros orientados a mejorar la competitividad, la productividad, el crecimiento y la internacionalización de las empresas colombianas. Aprovechando su posición de mercado y su capacidad para establecer relaciones empresariales, Bancóldex gestiona activos financieros, desarrolla soluciones de acceso a la financiación y ofrece soluciones de capital innovadoras que fomentan y aceleran el crecimiento empresarial. Además de ofrecer préstamos tradicionales, Bancóldex ha sido designado para ejecutar varios programas de desarrollo tales como el Programa de Transformación Productiva, iNNpulsa Colombia, iNNpulsa Mipyme y la Banca de las Oportunidades. Todos ellos conforman una oferta integrada de servicios para promover el entorno empresarial colombiano y la competitividad. Prosperia es parte del Programa de Transformación Productiva y la iniciativas <a class="link--stream" href="http://www.innpulsacolombia.com/">INNpulsa Colombia</a>.</p></section><section class="stream__section"><h3 class="section__head">Información de contacto</h3><a class="link--stream" href="mailto:">Eduardo_Lora@hks.harvard.edu</a></section><section class="stream__section"><h3 class="section__head">TKTKTK</h3><p class="section__p">Inscríbase al <a class="link--stream" href="http://www.hks.harvard.edu/centers/cid/news-events/subscribe">Boletín de Estudios del CID</a> para mantenerse al día con los avances de la investigación y las herramientas prácticas en temas relacionados con la complejidad.</p></section>',
    'glossary': '<h3 class="section__head" id="product-complexity-index">Áreas metropolitanas y ciudades</h3> <p class="section__p">Un área metropolitana es la combinación de dos o más municipios que están conectados a través de flujos relativamente grandes de trabajadores (con independencia de su tamaño o contigüidad). Un municipio debe enviar al menos un 10% de sus trabajadores como viajeros diarios al resto de los municipios del área metropolitana para considerarse como parte de dicha área.</p> <p class="section__p">Con base en esta definición hay 19 áreas metropolitanas en Colombia, que comprenden 115 municipios. Las áreas metropolitanas resultantes son distintas de las oficiales (excepto en el caso del Valle de Aburrá, el área metropolitana de Medellín). Se sigue la metodología de Duranton y Giles ( 2013): “Delineating metropolitan areas: Measuring spatial labour market networks through commuting patterns.” Wharton School, University of Pennsylvania.</p> <p class="section__p">Aparte de las áreas metropolitanas, hay otras 43 ciudades en Colombia, definidas como municipios con más de 50.000 habitantes, con al menos 75% de la población en la principal zona urbana (cabecera).</p> <h3 class="section__head" id="product-complexity-index">Complejidad </h3> <p class="section__p">El concepto de complejidad es central en Prospedia porque las rutas hacia la prosperidad de una sociedad dependen de que las empresas puedan producir y exportar con éxito bienes y servicios que requieren capacidades y conocimientos más complejos, es decir más diversos y exclusivos. La complejidad puede medirse para un lugar (véase <a class="link--stream" href="#economic-complexity-index">Índice de Complejidad Económica, ICE</a>), para un producto de exportación (véase <a class="link--stream" href="#economic-complexity-index">Índice de Complejidad del Producto, ICP</a>), o para un sector (véase <a class="link--stream" href="#economic-complexity-index">Índice de Complejidad Sectorial, ICS</a>).</p> <h3 class="section__head" id="product-complexity-index">Complejidad potencial de un lugar</h3> <p class="section__p">Mide el potencial de aumento de la complejidad de un lugar. Tiene en cuenta el nivel de complejidad de todos los sectores productivos (o productos de exportación),  junto con la “distancia”  a los demás sectores (o productos). Con esta información mide la probabilidad de que aparezcan nuevos sectores (o exportaciones) y qué tanto elevarían la complejidad del lugar. Valores más altos indican que es más probable desarrollar nuevos sectores (o productos) más complejos que los que ya se tienen.</p> <h3 class="section__head" id="product-complexity-index">Distancia a un sector o exportación en un lugar</h3> <p class="section__p">La “distancia” es una medida de la capacidad de un lugar para desarrollar un sector o una exportación específica, teniendo en cuenta las capacidades productivas existentes. La “distancia” es menor en la medida en que las capacidades requeridas por un sector o exportación son más similares a las ya existentes. En esa medida serán mayores las posibilidades de que desarrolle con éxito el sector o exportación. Visto de otra forma, la distancia refleja la proporción del conocimiento productivo que se necesita para que aparezca un sector o exportación que aún no existe en el lugar.</p> <h3 class="section__head" id="product-complexity-index">Empleo, salarios y tasa de empleo formal</h3> <p class="section__p">El empleo formal es aquel que está cubierto por el sistema de seguridad social en salud y/o por el sistema de pensiones. Los salarios formales son los salarios declarados por las empresas como base para ese propósito. La tasa de formalidad es la proporción de la población mayor de 15 años del lugar que tiene un empleo formal. Los datos de empleo y salarios provienen de la PILA del Ministerio de Salud. Los datos de población son del DANE.</p> <h3 class="section__head" id="product-complexity-index">Índice de Complejidad del Producto (ICP)</h3> <p class="section__p">Ordena los productos de exportación según qué tantas capacidades productivas se requieren para su fabricación. Un producto como pasta de dientes es mucho más que pasta en un tubo, ya que incorpora tácitamente el conocimiento que se necesita para producir los agentes químicos que matan los gérmenes que causan caries y enfermedad de las encías. Productos complejos de exportación, tales como químicos y maquinaria, requieren un nivel sofisticado y diverso de conocimientos que sólo se consigue con la interacción en empresas de muchos individuos con conocimientos especializados. Esto contrasta con las exportaciones de baja complejidad, como el café, que requieren apenas conocimientos productivos básicos que se pueden reunir en una empresa familiar. Para calcular la complejidad de los productos de exportación se utilizan datos de <a class="link--stream" href="http://comtrade.un.org/">Comtrade de las Naciones Unidas</a> para cerca de 200 países.</p> <h3 class="section__head" id="product-complexity-index">Índice de Complejidad Económica (ICE)</h3> <p class="section__p">Una medida de la sofisticación de las capacidades productivas de un lugar basada en la diversidad y la exclusividad de sus sectores productivos o sus exportaciones. Un lugar con alta complejidad produce o exporta bienes y servicios que pocos otros lugares producen. Lugares altamente complejos tienden a ser más productivos y a generar mayores salarios e ingresos. Los países con canastas de exportación más sofisticadas de lo que se espera para su nivel de ingresos (como China) tienden a crecer más rápido que aquellos en los que es todo lo contrario (como Grecia).</p> <h3 class="section__head" id="product-complexity-index">Índice de Complejidad Sectorial (ICS)</h3> <p class="section__p">Ordena los sectores productivos del país según qué tantas capacidades productivas requieren para operar. La complejidad de los sectores y de las exportaciones son medidas estrechamente relacionadas, pero se calculan en forma separada con datos y sistemas de clasificación independientes, ya que las exportaciones se limitan a mercancías comercializables internacionalmente, mientras que los sectores productivos comprenden todos los sectores que generan empleo, incluidos todos los servicios y el sector público. Un sector es complejo si requiere un nivel sofisticado de conocimientos productivos, como los servicios financieros y los sectores farmacéuticas, en donde trabajan en grandes empresas muchos individuos con conocimientos especializados distintos. La complejidad de un sector se mide calculando la diversidad promedio de los lugares donde existe el sector y la ubicuidad promedio de los sectores de esos lugares. Los datos de empleo formal necesarios para estos cálculos provienen de la PILA del Ministerio de Salud.</p> <h3 class="section__head" id="product-complexity-index">Mapa de similitud de productos de exportación</h3> <p class="section__p">Una visualización que muestra que tan similares son los conocimientos requeridos para la exportación de unos productos y otros. Cada punto representa un producto de exportación y cada enlace entre un par de productos indica que requieren capacidades productivas similares. Cuando se selecciona un lugar, el mapa destaca los productos que ya se exportan y aquéllos que, por requerir capacidades productivas semejantes, podrían exportarse exitosamente. El mapa presenta caminos potenciales para la diversificación de las exportaciones a partir de los conocimientos y capacidades existentes. Un producto con más enlaces con otros que no se exportan ofrece mayor potencial para la diversificación exportadora a través de las capacidades compartidas. Y si esas capacidades son complejas, el producto tiene un alto potencial para elevar la complejidad del lugar. <p class="section__p">El mapa de similitud de los productos se basa en los datos de comercio internacional de 192 países en más de 50 años. Ver <a class="link--stream" href="http://atlas.cid.harvard.edu/">http://atlas.cid.harvard.edu/.</a></p> <h3 class="section__head" id="product-complexity-index">Mapa de similitud de los sectores productivos de Colombia</h3> <p class="section__p">Una visualización que muestra que tan similares son los conocimientos requeridos por unos sectores u otros. Cada punto representa un sector y cada enlace entre un par de sectores indica que requieren capacidades productivas similares. Cuando se selecciona un lugar, el mapa destaca los sectores que ya existen en el lugar y aquéllos que, por requerir capacidades productivas semejantes, podrían surgir exitosamente. El mapa presenta rutas potenciales para la expansión sectorial a partir de los conocimientos y capacidades existentes. Un sector con más enlaces con sectores que no existen ofrece mayor potencial para la diversificación productiva a través de las capacidades compartidas. Y si esas capacidades son complejas, el sector tiene un alto potencial para elevar la complejidad del lugar. El mapa de los sectores productivos de Colombia fue construido a partir de la información de empleo formal por municipio de la PILA del Ministerio de Salud.</p> <h3 class="section__head" id="product-complexity-index">Valor estratégico de un sector o una exportación para un lugar</h3> <p class="section__p">Capta en qué medida un lugar podría beneficiarse mediante el desarrollo de un sector en particular (o un producto de exportación). También conocida como "ganancia de oportunidad", esta medida representa la distancia a todos los otros sectores (o exportaciones) que un lugar no produce actualmente y su respectiva complejidad. Refleja cómo un nuevo sector (o exportación) puede abrir paso a otros sectores o productos más complejos.</p> <h3 class="section__head" id="product-complexity-index">Ventaja Comparativa Revelada (VCR) de un sector o una exportación en un lugar</h3> <p class="section__p">Mide el tamaño relativo de un sector o un producto de exportación en un lugar. La VCR, que no debe interpretarse como un indicador de eficiencia productiva o de competitividad, se conoce también por el nombre de "cociente de localización”. Se calcula como el cociente entre la participación del empleo formal de un sector en el lugar y la participación del empleo formal total del mismo sector en todo el país. Para una exportación es la relación entre el peso que tiene el producto en la canasta de exportación del lugar y el peso que tiene en el comercio mundial. Si esta relación es mayor que 1, se dice que el lugar tiene ventaja comparativa revelada en el sector o en la exportación.</p>'
  }
};
