// eslint-disable-next-line no-unused-vars
var Destination = {
  props: {
    height: { type: Number, required: true },
    id: { type: String, required: true },
    isBottomConnectorSelected: { type: Boolean, default: false },
    isTopConnectorSelected: { type: Boolean, default: false },
    name: { type: String, required: true },
    node: { type: window.AudioDestinationNode, required: true },
    width: { type: Number, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  template: (
    '<node' +
    ' v-bind:canDestroy="false"' +
    ' fill="var(--solarized-red-light)"' +
    ' v-bind:height="height"' +
    ' v-bind:has-top-connector="true"' +
    ' v-bind:is-bottom-connector-selected="isBottomConnectorSelected"' +
    ' v-bind:is-top-connector-selected="isTopConnectorSelected"' +
    ' v-bind:label="label"' +
    ' v-bind:width="width"' +
    ' v-bind:x="x"' +
    ' v-bind:y="y"' +
    ' v-on:destroy="$emit(\'destroy\')"' +
    ' v-on:select-bottom-connector="$emit(\'select-bottom-connector\')"' +
    ' v-on:select-top-connector="$emit(\'select-top-connector\')"' +
    ' v-on:update:x="handleUpdateX"' +
    ' v-on:update:y="handleUpdateY"' +
    '/>'
  ),
  data: function () {
    return {
      style: {
        transform: 'translate(-50%, -50%)'
      }
    }
  },
  computed: {
    label: function () {
      return this.name
    }
  },
  methods: {
    handleUpdateX: function (newValue) {
      this.$emit('update:x', newValue)
    },
    handleUpdateY: function (newValue) {
      this.$emit('update:y', newValue)
    }
  },
  components: {
    'node': Node
  }
}
