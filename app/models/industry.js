import DS from 'ember-data';
import ModelAttribute from '../mixins/model-attribute';
const {attr} = DS;

export default DS.Model.extend(ModelAttribute, {
  classIndustries: attr()
});
