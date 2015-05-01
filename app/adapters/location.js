import ApplicationAdapter from './application';
import fixture from '../fixtures/atlantico';


export default ApplicationAdapter.extend({
  pathForType(type) {
   if (type === 'location') { return 'departments'; }
  },
  find(store, type, id, snapshot) {
    let env = this.container.lookup('application:main').env;
    return fixture;

    //if(env === 'development'){
      //return fixture;
    //}else{
      //return super.find(store,type,id,snapshot);
    //}
  }
});
