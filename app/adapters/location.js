import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  pathForType(type) {
   if (type === 'location') { return 'metadata/locations'; }
  }
});
