import dotPlot from "../fixtures/dot";
import sparkLine from "../fixtures/spark";
export default [
  {
    name: 'Atlántico',
    id: '1',
    code: '42',
    gdpGrowth: 'TK',
    timeSeries:[
      { "year": 2000, "pop": 2017388, "gdp": 11989000000000, "export_value": 0, "value_added": 0 },
      { "year": 2001, "pop": 2046777, "gdp": 11927000000000, "export_value": 0, "value_added": 0 },
      { "year": 2002, "pop": 2076366, "gdp": 12034000000000, "export_value": 0, "value_added": 0 },
      { "year": 2003, "pop": 2106173, "gdp": 12177000000000, "export_value": 0, "value_added": 0 },
      { "year": 2004, "pop": 2136070, "gdp": 12882000000000, "export_value": 0, "value_added": 0 },
      { "year": 2005, "pop": 2166020, "gdp": 13776000000000, "export_value": 0, "value_added": 0 },
      { "year": 2006, "pop": 2195776, "gdp": 14860000000000, "export_value": 0, "value_added": 0 },
      { "year": 2007, "pop": 2225481, "gdp": 16257000000000, "export_value": 0, "value_added": 0 },
      { "year": 2008, "pop": 2255143, "gdp": 16657000000000, "export_value": 0, "value_added": 0 },
      { "year": 2009, "pop": 2284841, "gdp": 16649000000000, "export_value": 0, "value_added": 0 },
      { "year": 2010, "pop": 2314460, "gdp": 16585000000000, "export_value": 0, "value_added": 0 },
      { "year": 2011, "pop": 2344077, "gdp": 17506000000000, "export_value": 0, "value_added": 0 },
      { "year": 2012, "pop": 2373550, "gdp": 18761000000000, "export_value": 0, "value_added": 0 },
      { "year": 2013, "pop": 2402910, "gdp": 19680000000000, "export_value": 1183541344, "value_added": 3529084685 }
    ],
    topExports: [
      { name: 'Aleaciones madre de cobre'},
      { name: 'Productos de acabado para el teñido'},
      { name: 'Guatas, gasas y vendas'},
      { name:'Extractos curtientes de origen vegetal'},
      { name: 'Cortinas persianas, cortinas cenefas, algodón, tejido de punto'},
      { name:'Depósitos, cubas, tanques, etc.'}
    ],
    currentExports: [
      { name: "Slag wool, rock wool, and similar mineral wools", value: "$2.4M", growth: "Up 4%" },
      { name: "Slag wool, rock wool, and similar mineral wools", value: "$2.4M", growth: "Up 4%" },
      { name: "Slag wool, rock wool, and similar mineral wools", value: "$2.4M", growth: "Up 4%" },
      { name: "Slag wool, rock wool, and similar mineral wools", value: "$2.4M", growth: "Up 4%" },
      { name: "Slag wool, rock wool, and similar mineral wools", value: "$2.4M", growth: "Up 4%" },
    ],
    totalExports: [],
    totalImports: [],
    profileDot: dotPlot.data,
    profileSpark: sparkLine.data,
    profileExport: []
  },
  {
    id: 2,
    name: 'Link'
  },
];
