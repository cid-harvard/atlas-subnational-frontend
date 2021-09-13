import Ember from 'ember';
const {computed, get, observer} = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  buildermodSearchService: Ember.inject.service(),
  treemapService: Ember.inject.service(),
  search: null,
  searchSelect1: 1,
  searchSelect2: null,
  placeHolder: null,
  transitionProduct: 'transitionProduct',
  transitionLocation: 'transitionLocation',
  transitionLocationRoute: 'transitionLocationRoute',
  transitionIndustry: 'transitionIndustry',
  transitionLocationProducts: 'transitionLocationProducts',
  transitionAgproduct: 'transitionAgproduct',
  transitionLivestock: 'transitionLivestock',
  transitionNonag: 'transitionNonag',
  transitionLanduse: 'transitionLanduse',
  runSelectChained: computed('idSelect', 'data_search', 'placeHolder', 'search', 'i18n', function(){

    this.set('searchSelect1', null);

    let id_select = this.get('idSelect');

    var $eventSelect = $(`#${id_select}`);

    let type = this.get('type');
    let source = this.get('source');
    let self = this;
    var data = this.get('data_search')
    var placeholder = this.get("placeHolder")

    if(placeholder === null){
      placeholder = this.get('i18n').t(`pageheader.search_placeholder.first.${type}.${source}`).string
    }

    if(data === undefined){
      data = [];
    }

    data.unshift({ id: "", text: ""})

    $eventSelect.select2({
      placeholder: placeholder,
      allowClear: true,
      theme: 'bootstrap4',
      language: this.get('i18n').display,
      width: 'auto',
      dropdownAutoWidth : true,
      data: data,
      containerCssClass: "flex-fill",
      templateSelection: function (data, container) {
        $(data.element).attr('data-key', data.key);
        return data.text;
      }
    });

    $eventSelect.on("select2:select", function (e) {

      let id = $eventSelect.val();
      self.set('searchSelect1', id);

      let text= $(`#${id_select} option:selected`).text();
      self.set('search', text);
      self.set("buildermodSearchService.search", text);

    });
  }),
  runSelectChained2: observer('searchSelect1', function(){

    let id_select2 = this.get('idSelect2');
    let searchSelect1 = this.get('searchSelect1');

    var $eventSelect2 = $(`#${id_select2}`);

    $eventSelect2.empty();

    let type = this.get('type');
    let source = this.get('source');
    let self = this;
    var data = []
    var placeholder = this.get("placeHolder")

    var data_search = this.get('data_search');


    if(data_search === undefined){
      data_search = []
    }

    data_search.filter(item => {
      return item.id == searchSelect1
    }).map(item => {
      item.chained.map(item => data.push(item))
    });

    if(placeholder === null){
      placeholder = this.get('i18n').t(`pageheader.search_placeholder.second.${type}.${source}`).string
    }

    if(data === undefined){
      data = [];
    }

    data.unshift({ id: "", text: ""})

    $eventSelect2.select2({
      placeholder: placeholder,
      allowClear: true,
      theme: 'bootstrap4',
      language: this.get('i18n').display,
      width: 'auto',
      dropdownAutoWidth : true,
      data: data,
      containerCssClass: "flex-fill",
      templateSelection: function (data, container) {
        $(data.element).attr('data-key', data.key);
        return data.text;
      }
    });

    $eventSelect2.on("select2:select", function (e) {

    });
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {

      this.get("runSelectChained");
      this.get("buildermodSearchService.search");

    });
  },
  update: observer('i18n.display', 'data_search', 'buildermodSearchService.search', function() {

    let type = this.get('type');

    if(type === "chained"){
    }
    else{
      let id_select = this.get('idSelect');
      var buildermodSearchService = this.get("buildermodSearchService.search");
      var $eventSelect = $(`#${id_select}`);
      var placeholder = this.get("placeHolder");
      let type = this.get('type');
      var data = this.get('data_search');
      var self = this;

      if(placeholder === null){
        placeholder = this.get('i18n').t(`pageheader.search_placeholder.${type}`).string
      }

      $eventSelect.select2({
        placeholder: placeholder,
        allowClear: true,
        theme: 'bootstrap4',
        language: this.get('i18n').display,
        width: 'auto',
        dropdownAutoWidth : true,
        data: data,
        containerCssClass: "flex-fill",
        templateSelection: function (data, container) {
          $(data.element).attr('data-key', data.key);
          return data.text;
        }
      });

      let val = $eventSelect.find("option:contains('"+buildermodSearchService+"')").val();

      if(val !== undefined){
        $eventSelect.val(val).trigger('change.select2');
        let text= $(`#${id_select} option:selected`).text();
        if (type === 'search') {
          this.set('search', text);
        }
      }

      $eventSelect.on("select2:select", function (e) {

        let id = $eventSelect.val();
        let text= $(`#${id_select} option:selected`).text();

        if(id !== ""){
          if(type === 'location') {
            self.sendAction('transitionLocation', id);
          } else if (type === 'product') {
            self.sendAction('transitionProduct', id);
          } else if (type === 'locations_route') {
            self.sendAction('transitionLocationRoute', id);
          } else if (type === 'industry') {
            self.sendAction('transitionIndustry', id);
          } else if (type === 'location-product') {
            self.sendAction('transitionLocationProducts', id);
          } else if (type === 'rural') {

            var key = $(`#${id_select}`).find(':selected').data("key").replace('-', '')
            var action = `transition${key.charAt(0).toUpperCase() + key.slice(1)}`

            self.sendAction(action, id);

          } else if (type === 'search') {
            self.set('search', text);
            self.set("buildermodSearchService.search", text);
          }
        }

  });
    }

  }),
  actions: {
    reset: function() {
      this.set('search', null);
      this.set("buildermodSearchService.search", null);

      let id_select = this.get('idSelect');
      var $eventSelect = $(`#${id_select}`);
      let id_select2 = this.get('idSelect2');
      var $eventSelect2 = $(`#${id_select2}`);

      $eventSelect.val('');
      $eventSelect.trigger('change');
      this.set("searchSelect1", null);
      $eventSelect2.val('');
      $eventSelect2.trigger('change');
    }
  }
});
