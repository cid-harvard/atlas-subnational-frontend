import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';
import ModelAttribute from '../mixins/model-attribute';
import numeral from 'numeral';
const {apiURL} = ENV;
const {attr} = DS;
const {computed, $, get:get } = Ember;

export default DS.Model.extend({
    
});
