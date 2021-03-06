import Ember from 'ember';
import numeral from 'numeral';

const {computed, observer, get:get} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  delay: 50,
  tagName: 'div',
  height: 500,
  attributeBindings: ['width','height'],
  classNames: ['buildermod__viz','tree-map'],
  varIndependent: ['code', 'group'],
  paddingWidth: 5,
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  varId: computed('varIndependent', function() {
    return _.first(this.get('varIndependent'));
  }),
  varGroup: computed('varIndependent', function() {
    return _.last(this.get('varIndependent'));
  }),
  selectedData: computed('data.[]', function() {
    return _.pluck(this.get('data'), 'code');
  }),
  noFiltered: computed('data.[]', 'immutableData.[]', function() {
    return this.get('data.length') === this.get('immutableData.length');
  }),
  varText: computed('data.[]', 'i18n.locale', function() {
    let datum = _.first(this.get('data'));
    let varText = `parent_name_${this.get('i18n').display}`;
    if(_.get(datum, varText)) {
      return varText;
    }
    return `name_short_${this.get('i18n').display}`;
  }),
  treemap: computed('data.[]', 'width', 'height', 'varDependent', 'dataType', 'i18n.display', 'varText', function() {
    let varDependent = this.get('varDependent');
    let varTextItem = `name_short_${this.get('i18n').display}`;
    let varText = this.get('varText');
    let vistkLanguage = this.get('i18n.display') === 'es' ? 'es_ES': 'en_EN';
    return vistk.viz()
      .params({
        type: 'treemap',
        lang: vistkLanguage,
        container: this.get('id'),
        height: this.get('height') + 1,
        width: this.get('width') + 1,
        data: this.get('immutableData'),
        var_id: this.get('varId'),
        var_size: this.get('varDependent'),
        var_group: this.get('varGroup'),
        padding: this.get('paddingWidth'),
        var_color: 'color',
        var_text: varText,
        var_text_item: varTextItem,
        var_sort: this.get('varDependent'),
        items: [{
          marks: [{
            type: 'div',
            filter: function(d) { return d.depth == 1 && d.dx > 30 && d.dy > 30; },
            class: function() { return 'tree-map--title'; },
            x: function(d, i, vars) {
              return  vars.x_scale[0]["func"](d[vars.var_x]);
            },
            y: function(d, i, vars) {
              return vars.y_scale[0]["func"](d[vars.var_y]);
            },
            width: function(d) { return d.dx - 8; },
            height: function(d) { return d.dy - 8; },
            translate: [5, 0]
          }, {
            type: 'rect',
            filter: function(d, i, vars) { return d.depth == 2 && d[vars.var_size] > 0; },
            x: 0,
            y: 0,
            width: function(d) { return d.dx; },
            height: function(d) { return d.dy; },
            fill: (d) => {
              if(this.get('noFiltered')) { return d.color || '#fff'; }
              if(_.contains(this.get('selectedData'), d.code)) {
                return d.color || '#fff';
              } else {
                return 'none';
              }
            },
            stroke: (d) => {
              if(this.get('noFiltered')) { return '#fff'; }
              if(!_.contains(this.get('selectedData'), d.code)) {
                return d.color || '#fff';
              } else {
                return 'none';
              }
            },
          }, {
            var_mark: '__highlighted',
            type: d3.scale.ordinal().domain([false, true]).range(['none', 'div']),
            class: function() {
              return 'tooltip';
            },
            x: function(d, i, vars) {
              return  vars.x_scale[0]["func"](d[vars.var_x]) + d.dx / 2;
            },
            y: function(d, i, vars) {
              return vars.y_scale[0]["func"](d[vars.var_y]);
            },
            text: (d, i, vars)  => {

              var data = [{
                'key': varDependent,
                'value': d[varDependent]
              }, {
                'key': 'share',
                'value': 100 * d[varDependent] / get(vars.new_data[0],`parent.${varDependent}`) || 0
              }];

              function format(key, value) {
                if('share' === key){
                  return numeral(value).divide(100).format('0.0%');
                } else if('employment' === key) {
                  return numeral(value).format('0.0a');
                } else if('num_vacancies' === key) {
                  return numeral(value).format('0,0');
                } else if('export_value' === key) {
                  return '$ ' + numeral(value).format('0.0a') + ' USD';
                } else if('import_value' === key) {
                  return '$ ' + numeral(value).format('0.0a') + ' USD';
                } else {
                  return numeral(value).format('0.0a');
                }
              }

              var tooltip_text;
              if (_.contains(['landUses', 'farmtypes', 'agproducts', 'nonags', 'livestock'], this.get('dataType'))){
                tooltip_text = `<span style="color:${get(d, 'color')}">${get(d, varTextItem)}</span>`;
              } else {
                tooltip_text = `<span style="color:${get(d, 'color')}">${get(d, varTextItem)} - ${get(d, 'code')}</span>`;
              }

              data.forEach((d) => {
                 if(d.key) {
                   tooltip_text += '<br>' + this.get('i18n').t(`graph_builder.table.${get(d,'key')}`) + ': ' + format(get(d,'key'), get(d,'value'));
                 }
               });

              return tooltip_text;
            },
            translate: [0, 0],
            width: 200,
            height: 'auto',
          }]
        }]
      });
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender',this , function() {
      if(this.get('isInTab')) {
        this.set('parent', this.get('parentView'));
      }

      let isProfilePanel = this.get('isInTab') && this.get('parent.isVisible');
      let graphBuilder = ! this.get('isInTab');

      if(isProfilePanel || graphBuilder) {
        this.set('height', 500);
        this.set('width', this.$().parent().width());
        d3.select(this.get('id')).call(this.get('treemap'));
      }
    });
  },
  profileTabUpdate: observer('parent.isVisible', function() {
    if(this.get('isInTab') && this.get('parent.isVisible')) {
      Ember.run.scheduleOnce('afterRender', this , function() {
        this.set('width', this.$().parent().width());
        if(this.get('treemap')) {
          d3.select(this.get('id')).select('svg').remove();
          d3.select(this.get('id')).call(this.get('treemap'));
        }
      });
    }
  }),
  willDestroyElement: function() {
    this.set('treemap',  null);
    this.removeObserver('i18n.locale', this, this.update);
    this.removeObserver('data.[]', this, this.update);
    this.removeObserver('parent.isVisible', this, this.profileTabUpdate);
  },
  update: observer('data.[]', 'varDependent', 'i18n.display', function() {
    if(!this.element){ return false; } //do not redraw if not there
    this.set('width', this.$().parent().width());

    if(this.get('treemap')) {
      d3.select(this.get('id')).select('svg').remove();
      this.$().empty();
      d3.select(this.get('id')).call(this.get('treemap'));
    }
  })
});
