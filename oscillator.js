// eslint-disable-next-line no-unused-vars
var Oscillator = {
  props: {
    frequency: { type: Number, required: true },
    height: { type: Number, required: true },
    id: { type: String, required: true },
    isBottomConnectorSelected: { type: Boolean, default: false },
    isTopConnectorSelected: { type: Boolean, default: false },
    node: { type: window.OscillatorNode, required: true },
    width: { type: Number, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  template: (
    '<node' +
    ' fill="var(--solarized-green-light)"' +
    ' v-bind:height="height"' +
    ' v-bind:has-bottom-connector="true"' +
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
      return this.node.frequency.value + ' Hz'
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
  mounted: function () {
    this.node.start(0)
  },
  beforeDestroy: function () {
    this.node.stop()
  },
  components: {
    'node': Node
  }
}
