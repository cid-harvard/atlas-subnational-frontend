import Ember from 'ember';
import numeral from 'numeral';

const {computed, observer} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  tagName: 'div',
  attributeBindings: ['width','height'],
  classNames: ['tree-map'],
  varIndependent: 'code',
  paddingWidth: 5,
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  selectedData: computed('data.[]', function() {
    return _.pluck(this.get('data'), 'code');
  }),
  noFiltered: computed('data.[]', 'immutableData.[]', function() {
    return this.get('data.length') === this.get('immutableData.length');
  }),
  treemap: computed('data.[]', 'width', 'height', 'varDependent', 'dataType', 'vis', function() {
    let varDependent = this.get('varDependent');
    let varText = `name_short_${this.get('i18n').locale}` || 'code';
    return vistk.viz()
        .params({
          dev: false,
          type: 'treemap',
          container: this.get('id'),
          height: this.get('height') + (this.paddingWidth * 2),
          width: this.get('width') + (this.paddingWidth * 4),
          data: this.get('immutableData'),
          var_id: this.get('varIndependent'),
          var_size: this.get('varDependent'),
          var_group: 'group',
          padding: 4,
          var_color: 'color',
          var_text: varText,
          var_sort: this.get('varDependent'),
          items: [{
            marks: [{
              type: "divtext",
              filter: function(d, i) { return d.depth == 1 && d.dx > 30 && d.dy > 30; },
              translate: [5, 0]
            }, {
              type: "rect",
              filter: function(d, i) { return d.depth == 2; },
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
              text: function(d) {

/*                  {
                    number: (d, data) => {
                      if('share' === data.key){
                        return numeral(d).divide(100).format('0.0%');
                      } else if('employment' === data.key) {
                        return numeral(d).format('0.0a');
                      } else if('num_vacancies' === data.key) {
                        return numeral(d).format('0,0');
                      } else if('export_value' === data.key) {
                        return '$ ' + numeral(d).format('0.0a') + ' USD';
                      } else if('import_value' === data.key) {
                        return '$ ' + numeral(d).format('0.0a') + ' USD';
                      } else {
                        return numeral(d).format('$ 0.0a');
                      }
                    }
                  }
*/

                var tooltip_text = '<span style="color: ' +  d.color + '">' + d['parent_name_en'] + '</span>';
                   tooltip_text += '<br>' + varDependent + ': ' + d[varDependent];
                   tooltip_text += '<br>Share: ' + d[varDependent];
                return tooltip_text;
              },
              translate: [0, -10],
              width: 200,
              height: 100,
            }]
          }]
        });
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.set('parent', this.get('parentView'));
      if(this.get('parent.isVisible')) {
        this.set('width', this.$().parent().width());
        this.set('height', this.$().parent().height() || 500 );
        d3.select(this.get('id')).call(this.get('treemap'));
      }
    });
  },
  profileTabUpdate: observer('parent.isVisible', function() {
    if(this.get('isInTab')) {
      Ember.run.scheduleOnce('afterRender', this , function() {
        if(!this.element){ return false; } //do not redraw if not there
        this.set('width', this.$().parent().width());
        this.set('height', this.$().parent().height() || 500 );
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
  update: observer('data.[]', 'varDependent', 'i18n.locale', function() {
    if(!this.element){ return false; } //do not redraw if not there
    Ember.run.scheduleOnce('afterRender', this , function() {
      d3.select(this.get('id')).select('svg').remove();
      this.set('width', this.$().parent().width());
      this.set('height', this.$().parent().height() || 500 );
      if(this.get('treemap')) { d3.select(this.get('id')).call(this.get('treemap')); }
    });
  })
});
