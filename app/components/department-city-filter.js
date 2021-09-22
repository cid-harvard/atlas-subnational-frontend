import Ember from 'ember';
const {computed, get, observer} = Ember;

export default Ember.Component.extend({

  i18n: Ember.inject.service(),
  departmentCityFilterService: Ember.inject.service(),

  chained_data: [],

  runSelect: computed('idSelect', 'data_search', 'placeHolder', 'search', 'i18n', function(){

    let id_select = this.get('idSelect');
    var $eventSelect = $(`#departmentSelect`);
    let self = this;
    var data = this.get("departmentsDataSelect")
    var placeholder = "Busque por departamento"

    if(data === undefined){
      data = []
    }

    data.unshift({ id: "", text: ""})

    $eventSelect.select2({
      placeholder: placeholder,
      allowClear: true,
      theme: 'bootstrap4',
      language: this.get('i18n').display,
      width: '100%',
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
      var parent = _.indexBy(self.get("departmentsDataSelect"), 'id')

      var $eventSelect2 = $(`#citySelect`);
      var data = parent[id].chained
      var placeholder = "Busque por ciudad"

      if(data === undefined){
        data = []
      }

      data.unshift({ id: "", text: ""})

      $(`#citySelect`).find('option').remove().end();

      $eventSelect2.select2({
        placeholder: placeholder,
        allowClear: true,
        theme: 'bootstrap4',
        language: self.get('i18n').display,
        width: '100%',
        dropdownAutoWidth : true,
        data: data,
        containerCssClass: "flex-fill",
        templateSelection: function (data, container) {
          $(data.element).attr('data-key', data.key);
          return data.text;
        }
      });

    });
  }),
  runSelect2: computed(function(){

    var $eventSelect = $(`#citySelect`);
    let self = this;
    var data = []
    var placeholder = "Busque por ciudad"

    data.unshift({ id: "", text: ""})

    $eventSelect.select2({
      placeholder: placeholder,
      allowClear: true,
      theme: 'bootstrap4',
      language: this.get('i18n').display,
      width: '100%',
      dropdownAutoWidth : true,
      data: data,
      containerCssClass: "flex-fill",
      templateSelection: function (data, container) {
        $(data.element).attr('data-key', data.key);
        return data.text;
      }
    });
  }),
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {

      this.get("chained_data");
      this.get("runSelect");
      this.get("runSelect2");

    });
  },
  actions:{
    filterDepartment(){

      let id = $(`#departmentSelect`).val();
      let text = $(`#departmentSelect option:selected`).text();

      if(id !== ""){
        this.set("departmentCityFilterService.name", text);
        this.set("departmentCityFilterService.id", id);
        $("#spinner_complexmap").removeClass("d-none")
        $("#complexmap").addClass("d-none")
        $("#complexmaptable").addClass("d-none")
      }

    },
     filterCity(){
      let id = $(`#citySelect`).val();
      let text = $(`#citySelect option:selected`).text();

      if(id !== ""){
        this.set("departmentCityFilterService.name", text);
        this.set("departmentCityFilterService.id", id);
        $("#spinner_complexmap").removeClass("d-none")
        $("#complexmap").addClass("d-none")
        $("#complexmaptable").addClass("d-none")
      }
    }
  }
});
