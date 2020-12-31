import PubSub from '../lib/pubsub.js';
import actions from '../../stateT/store/actions.js'
import mutations from '../../stateT/store/mutations.js'
import state from '../../stateT/store/state.js'

export default class Store {
    constructor(params) {
        var self=this;

        self.actions = {};
        self.mutations = {};
        self.state = state;

        this.status = 'resting';

        this.events = new PubSub();

        //if(params.hasOwnProperty('actions')) {
            this.actions = actions;
        //}
        
        //if(params.hasOwnProperty('mutations')) {
            this.mutations = mutations;
        //}
        this.state = new Proxy((state || {}), {
            set: function(state, key, value) {
                
                state[key] = value;
                
                console.log('stateChange: ${key}: ${value}');

                self.events.publish('stateChange', self.state);
                
                if(self.status !== 'mutation') {
                    console.warn('You should use a mutation to set ${key}');
                }

                self.status = 'resting';
                
                return true;
            }
        });
    }


    dispatch(actionKey, payload) {
        let self = this;
        
        if(typeof self.actions[actionKey] !== 'function') {
          console.error(`Action "${actionKey} doesn't exist.`);
          return false;
        }
        self.status = 'action';
        
        self.actions[actionKey](self, payload);

        return true;
    }


    commit(mutationKey, payload) {
        let self = this;
        if(typeof self.mutations[mutationKey] !== 'function') {
            console.log(`Mutation "${mutationKey}" doesn't exist`);
            return false;
        }

        self.status = 'mutation';
        
        let newState = self.mutations[mutationKey](self.state, payload);

        //self.events.publish('stateChange', self.state);
        //self.status = 'resting';

        self.state = Object.assign(self.state, newState);

        return true;
    }
}
