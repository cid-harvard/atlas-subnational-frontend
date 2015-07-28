import Ember from 'ember';
import numeral from 'numeral';

const {computed, observer} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  tagName: 'div',
  attributeBindings: ['width','height'],
  classNames: ['d3plus_tree-map'],
  varIndependent: ['group', 'code'],
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  selectedData: computed('data.[]', function() {
    return _.pluck(this.get('data'), 'code');
  }),
  noFiltered: computed('data.[]', 'immutableData.[]', function() {
    return this.get('data').length === this.get('immutableData').length;
  }),
  treemap: computed('data.[]', 'width', 'height', 'varDependent', 'dataType', 'vis', function() {
    return d3plus.viz()
      .container(this.get('id'))
      .data({value: this.get('immutableData'), padding: 5})
      .type("tree_map")
      .id({value: this.get('varIndependent'), grouping: true })
      .depth(1)
      .tooltip({children: false})
      .color((d) => {
        if(this.get('noFiltered')) { return '#e0dad5'; }
        if(_.contains(this.get('selectedData'), d.code)) {
          return '#f5f3f1';
        } else {
          return '#e0dad5';
        }
      })
      .format({
        number: (d, data) => {
          if('share' === data.key){
            return numeral(d).divide(100).format('0.0%');
          } else if( 'employment' === data.key) {
            return numeral(d).format('0.0a');
          } else {
            return numeral(d).format('$ 0.0a');
          }
        }
      })
      .zoom(false)
      .text({ value: (d) => {
        return  Ember.get(d, `name_${this.get('i18n').locale}`) || d.code; }
      })
      .timeline(false)
      .height(this.get('height'))
      .width(this.get('width'))
      .timing({transitions: 300})
      .size(this.get('varDependent'))
      .labels({resize: false, align: 'left', valign: 'top'})
      .font({size: 20})
      .legend(false);
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.set('parent', this.get('parentView'));
      if(this.get('parent.isVisible')) {
        this.set('width', this.$().parent().width());
        this.set('height', this.$().parent().height() || 500 );
        this.get('treemap').draw();
      }
    });
  },
  profileTabUpdate: observer('parent.isVisible', function() {
    if(this.get('isInTab')) {
      Ember.run.scheduleOnce('afterRender', this , function() {
        if(!this.element){ return false; } //do not redraw if not there
        this.set('width', this.$().parent().width());
        this.set('height', this.$().parent().height() || 500 );
        if(this.get('treemap')) { this.get('treemap').draw(); }
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
      if(this.get('treemap')) { this.get('treemap').draw(); }
    });
  })
});

