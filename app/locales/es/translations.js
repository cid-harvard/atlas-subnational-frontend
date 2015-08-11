export default {
  'general': {
    'locations': 'lugares',
    'export_and_import': 'exportaciones y importaciones',
    'industries': 'sectores',
    'occupations': 'ocupaciónes',
    'treemap': 'Gráfico de composición',
    'multiples': 'Gráficos de áreas',
    'geo': 'Mapa geográfico',
    'scatter': 'Gráfico de dispersión',
    'similarity': 'Mapa similitud'
  },
  'side_nav': {
    'brand_slogan': 'Utilizando datos para mantener Colombia competitiva',
    'search_link': 'Buscar',
    'profile_link': 'Perfil',
    'graph_builder_link': 'Gráfico Constructor'
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
    'embed': 'Insertar gráfico',
    'twitter': 'Twitter',
    'facebook': 'Facebook',
    'csv': 'CSV',
    'excel': 'Excel'
  },
  'search': {
    'header': 'Buscar',
    'intro': 'Busque el lugar, producto, sector u ocupación que le interese',
    'placeholder': 'Escriba aquí para buscar lo que quiere',
    'results_products': 'Resultados: Productos',
    'results_locations': 'Resultados: Lugares',
    'results_industries': 'Resultados: Sectores',
    'didnt_find': '¿Encontró lo que buscaba? Nos interesa saber.'
  },
  'graph_builder': {
    'read_more': 'Lea el perfil de la actividad productiva y la complejidad de este lugar',
    'view_more': 'Muestre más',
    'table': {
      'name': 'Nombre',
      'export_value': 'Exportaciones',
      'export_rca': 'Ventaja comparativa revelada',
      'rca': 'Ventaja comparativa revelada',
      'wages': 'Salarios (COP)',
      'employment': 'Empleo',
      'avg_wage': 'Salario medio',
      'employment_growth': 'El crecimiento del empleo, (2008-2012)',
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
      'placeholder': 'Buscar {{entity}}',
    },
    'change_graph': {
      'label': 'Gráficos',
    },
    'multiples': {
      'show_all': 'Mostrar todo',
    },
    'page_title': {
      'industry': {
        'departments.employment': 'MISSING',
        'departments.wages': 'MISSING',
        'departments.wage_avg': 'MISSING',
      },
      'product': {
        'locations.export_value': 'MISSING',
        'locations.import_value': 'MISSING',
      },
      'location': {
        'products.export_value': 'MISSING',
        'products.scatter': 'MISSING',
        'products.export_value_to': 'MISSING',
        'products.import_value': 'MISSING',
        'products.import_value_from': 'MISSING',
        'products.similarity': 'MISSING',
        'industries.employment': 'MISSING',
        'industries.scatter': 'MISSING',
        'industries.wages': 'MISSING',
        'industries.wages_highest_per_worker': 'MISSING',
        'industries.similarity': 'MISSING',
        'locations.export': 'MISSING',
        'locations.export_to': 'MISSING',
        'locations.import_from': 'MISSING',
        'locations.import_product_from': 'MISSING',
        'locations.export_subregions': 'MISSING',
        'locations.export_subregions_products': 'MISSING',
        'locations.export_subregions_locations':'MISSING',
        'locations.export_subregions_products_locations':' MISSING',
        'locations.import_subregions': 'MISSING',
        'locations.import_subregions_products': 'MISSING',
        'locations.import_subregions_locations': 'MISSING',
        'locations.import_subregions_products_locations': 'MISSING',
      }
    },
    'builder_nav': {
      'header': 'Más gráficos para este {{entity_type}}',
      'intro': 'Seleccione una pregunta para ver el gráfico correspondiente. Utilice las opciones que aparecen en {{icon}}.',
    },
    'builder_mod_header': {
      'industry': {
        'departments.employment': 'Empleo total',
        'departments.wages': 'Salarios totales (COP)',
        'departments.wage_avg': 'Salarios promedio (COP)',
      },
      'product': {
        'locations.export_value': 'Departamentos de Colombia',
      },
      'location': {
        'products.export_value': 'Exportaciones totales',
        'products.scatter': 'Complejidad y valor estratégico',
        'products.similarity': 'Complejidad y valor estratégico',
        'products.import_value': 'Las importaciones totales',
        'industries.employment': 'Empleo total',
        'industries.scatter': 'Complejidad y valor estratégico',
        'industries.similarity': 'Complejidad y valor estratégico',
        'industries.wages': 'Salarios totales',
      }
    }
  },
  'location.show': {
    'overview': 'Visión de conjunto',
    'bullet.gdp_grow_rate': 'MISSING',
    'bullet.gdp_pc': 'MISSING',
    'bullet.last_pop': 'MISSING',
    'all_departments': 'MISSING',
    'value': 'Valor',
    'growth_annual': 'MISSING',
    'gdp_pc': 'MISSING',
    'gdp': 'MISSING',
    'population': 'MISSING',
    'employment_and_wages': 'MISSING',
    'total_wages': 'MISSING',
    'employment': 'MISSING',
    'exports_and_imports': 'MISSING',
    'exports': 'MISSING',
    'export_possiblities': 'MISSING',
    'export_possiblities.intro': 'MISSING',
    'export_possiblities.footer': 'MISSING',
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
    'employment_and_wages': 'Empleo y salarios',
    'industries': 'Sectores',
    'value': 'Valor',
    'employment_growth': 'Crecimiento del empleo (2008-2013)',
    'avg_wages': 'Promedio de salarios {{year}}',
    'employment': 'Empleo {{year}}',
    'industry_composition': 'MISSING',
  }
};
