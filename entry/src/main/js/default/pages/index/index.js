import Store from '../../stateT/store/store.js'

export default {
    data: {
        todolist: [],
        content: "",
        index: 1,
        count: 0
    },
    btnAddOnclick() {
        var store = new Store()

        function callback(data) {
            data.context.todolist = []
            for (var i = 0;i < data.items.length; i++) {
                data.context.todolist.push(data.items[i])
            }
        }

        store.events.subscribe('stateChange',callback)

        function callback2(data) {
            data.context.count = data.items.length
        }

        store.events.subscribe('stateChange',callback2)

        store.dispatch('addItem', this)
    },
    inputDataChange(e) {
        this.content = e.text
    }
}
