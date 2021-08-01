import Ember from 'ember';
const {computed, observer, get:get, set} = Ember;


function getIcon(name){

    if(name == "Vegetables, foodstuffs and wood"){
        return {
            icon: "fas fa-carrot",
            color: "#880E4F"
        }
    }
    else if(name == "Minerals"){
        return {
            icon: "fas fa-carrot",
            color: "#311B92"
        }
    }
    else if(name == "Chemicals and plastics"){
        return {
            icon: "fas fa-atom",
            color: "#33691E"
        }
    }
    else if(name == "Textiles and furniture"){
        return {
            icon: "fas fa-tshirt",
            color: "#F57F17"
        }
    }
    else if(name == "Stone and glass"){
        return {
            icon: "fas fa-glass-whiskey",
            color: "#9C27B0"
        }
    }
    else if(name == "Metals"){
        return {
            icon: "fas fa-industry",
            color: "#29B6F6"
        }
    }
    else if(name == "Machinery"){
        return {
            icon: "fas fa-industry",
            color: "#FFEB3B"
        }
    }
    else if(name == "Electronics"){
        return {
            icon: "fas fa-industry",
            color: "#CE93D8"
        }
    }
    else if(name == "Transport vehicles"){
        return {
            icon: "fas fa-industry",
            color: "#1E88E5"
        }
    }
    else{
        return {
            icon: "fas fa-industry",
            color: "#1E88E5"
        }
    }
}

export default Ember.Component.extend({
    i18n: Ember.inject.service(),
    categoriesObject: computed('data', 'i18n.locale', function() {

        var categories = this.get('data').map(item => {
            return {
                name: _.get(item, `parent_name_${this.get('i18n').display}`),
                icon_color: getIcon(_.get(item, 'parent_name_en')),
                hide: false,
                isolate: false
            }
        }).filter((v,i,a)=>a.findIndex(t=>(t.name === v.name))===i)

        return categories

    }),
    didInsertElement: function() {
        Ember.run.scheduleOnce('afterRender', this, function() {

            $('.category-button').on("mouseover", function(e) {

                $(this).find("div.tooltip").removeClass("d-none")

            })

            $('.category-button').on("mouseleave", function(e) {
                $(this).find("div.tooltip").addClass("d-none");
            })

        });
    },
    update: observer('i18n.display', function() {

    }),
    actions: {
        check(index, attr) {

            this.toggleProperty("checked");
            var temp = this.get('categoriesObject').objectAt(index)
            Ember.set(temp, attr, !_.get(temp, attr));

        }
    }
});
