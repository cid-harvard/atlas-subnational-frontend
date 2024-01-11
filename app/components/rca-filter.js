import Ember from 'ember';

export default Ember.Component.extend({
  rcaFilterService: Ember.inject.service(),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
     var self = this;

      $(".js-range-slider").ionRangeSlider({
        skin: "sharp",
        min: 0,
        max: 10,
        grid: true,
        step: 0.5,
        from: 1,
        onFinish: function (data) {
          self.set("VCRValue", data.from);
          self.set('rcaFilterService.updated', new Date());
        },
      });
    });
  },
});
