import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  pathForType: function(type) {
   if (type === 'location') { return 'departments'; }
  }
});
