import Ember from 'ember';
const {computed} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  result: computed('data.[]', function(){
    return _.first(this.get('data'));
  }),
  breadcrumb: computed('result.level', 'i18n.locale', function() {
    if(this.get('result.level')) {
      let level = this.get('i18n').t(`search.level.${this.get('result.level')}`);
      return `${level}`;
    }
  }),
  dataSet: computed('parentSet.[]', 'data.[]', function() {
    let data = this.get('data');
    let parents = this.get('parentSet');
    return [parents, data];
  }),
  totalSet: computed('immutableData.[]', function() {
    let data = this.get('immutableData');
    return  _.chain(data)
      .groupBy(function(d) {return d.year;})
      .values()
      .reduce((memo, d) => {
        let firstDatum = _.first(d);

        let value = {
          name_short_es: 'Totales',
          name_short_en: 'Total',
          code: 'None',
          year: firstDatum.year
        };

        let sum = _.sum(d, this.get('varDependent'));
        value[this.get('varDependent')] = sum;
        memo.push(value);
        return memo;
       }, [] )
      .value();
  }),
  parentSet: computed('data.[]', function() {
    let data = this.get('data');

    return _.chain(data)
      .groupBy(function(d) {return d.group +'/'+ d.year;})
      .values()
      .reduce((memo, d) => {
        let firstDatum = _.first(d);

        let value = {
          name_short_es: firstDatum.parent_name_es,
          name_short_en: firstDatum.parent_name_en,
          code: firstDatum.group,
          year: firstDatum.year,
          color: firstDatum.color
        };

        let sum = _.sum(d, this.get('varDependent'));
        value[this.get('varDependent')] = sum;
        memo.push(value);
        return memo;
       }, [] )
      .value();
  })
});
