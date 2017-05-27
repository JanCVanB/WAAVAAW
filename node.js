// eslint-disable-next-line no-unused-vars
var Node = {
  props: {
    height: { type: Number, required: true },
    id: { type: String, required: true },
    nextConnectionSourceId: { type: String, required: true },
    nextConnectionTargetId: { type: String, required: true },
    type: { type: String, required: true },
    waaNode: { type: window.AudioNode, required: true },
    width: { type: Number, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  template: (
    '<g class="node"' +
    '>' +
    '<rect' +
    ' v-bind:height="height" v-bind:width="width"' +
    ' v-bind:rx="height / 2" v-bind:ry="height / 2"' +
    ' v-bind:x="x" v-bind:y="y"' +
    ' v-bind:style="rectStyle"' +
    ' v-on:mousedown="handleMousedown"' +
    ' v-on:mouseleave="handleMouseleave"' +
    ' v-on:mousemove="handleMousemove"' +
    ' v-on:mouseup="handleMouseup"' +
    '/>' +
    '<text class="no-click no-select"' +
    ' v-bind:font-size="height / 2"' +
    ' alignment-baseline="middle" text-anchor="middle"' +
    ' v-bind:x="x" v-bind:y="y"' +
    '> {{ label }} </text>' +
    '<text v-if="canDestroy" class="destroy-button no-select"' +
    ' font-size="6px"' +
    ' alignment-baseline="middle" text-anchor="middle"' +
    ' v-bind:x="destroyButtonX" v-bind:y="destroyButtonY"' +
    ' v-on:click="$emit(\'destroy\')"' +
    '> &nbsp; x &nbsp; </text>' +
    '<polygon v-if="hasTopConnector" class="connector"' +
    ' v-bind:points="topConnectorPoints"' +
    ' v-bind:style="[connectorStyle, topConnectorStyle]"' +
    ' v-on:click="$emit(\'select-top-connector\')"' +
    '/>' +
    '<polygon v-if="hasBottomConnector" class="connector"' +
    ' v-bind:points="bottomConnectorPoints"' +
    ' v-bind:style="[connectorStyle, bottomConnectorStyle]"' +
    ' v-on:click="$emit(\'select-bottom-connector\')"' +
    '/>' +
    '</g>'
  ),
  data: function () {
    return {
      clientScaleFactor: 0,
      connectorStyle: {
        fillOpacity: '1',
        strokeWidth: 0
      },
      destroyButtonPadding: 3,
      isDragging: false,
      oldClientX: 0,
      oldClientY: 0
    }
  },
  computed: {
    bottomConnectorPoints: function () {
      return (
        this.x + ',' + (this.y + this.height) + ' ' +
        (this.x + this.height / 3) + ',' + (this.y + this.height / 2) + ' ' +
        (this.x - this.height / 3) + ',' + (this.y + this.height / 2) + ' '
      )
    },
    bottomConnectorStyle: function () {
      if (this.isBottomConnectorSelected) {
        return {
          fill: 'var(--solarized-base00)'
        }
      }
      return {}
    },
    canDestroy: function () {
      return this.type !== CONSTANTS.NODE_TYPES.DESTINATION
    },
    destroyButtonX: function () {
      return this.x + this.width / 2 + this.destroyButtonPadding
    },
    destroyButtonY: function () {
      return this.y - this.height / 2 - this.destroyButtonPadding
    },
    hasBottomConnector: function () {
      switch (this.type) {
        case CONSTANTS.NODE_TYPES.DESTINATION:
          return false
        case CONSTANTS.NODE_TYPES.GAIN:
          return true
        case CONSTANTS.NODE_TYPES.OSCILLATOR:
          return true
      }
    },
    isBottomConnectorSelected: function () {
      return this.nextConnectionSourceId === this.id
    },
    isTopConnectorSelected: function () {
      return this.nextConnectionTargetId === this.id
    },
    hasTopConnector: function () {
      switch (this.type) {
        case CONSTANTS.NODE_TYPES.DESTINATION:
          return true
        case CONSTANTS.NODE_TYPES.GAIN:
          return true
        case CONSTANTS.NODE_TYPES.OSCILLATOR:
          return false
      }
    },
    label: function () {
      switch (this.type) {
        case CONSTANTS.NODE_TYPES.DESTINATION:
          return 'Destination'
        case CONSTANTS.NODE_TYPES.GAIN:
          return this.waaNode.gain.value * 100 + '%'
        case CONSTANTS.NODE_TYPES.OSCILLATOR:
          return this.waaNode.frequency.value + ' Hz'
      }
    },
    rectFillColor: function () {
      switch (this.type) {
        case CONSTANTS.NODE_TYPES.DESTINATION:
          return 'var(--solarized-red-light)'
        case CONSTANTS.NODE_TYPES.GAIN:
          return 'var(--solarized-blue-light)'
        case CONSTANTS.NODE_TYPES.OSCILLATOR:
          return 'var(--solarized-green-light)'
      }
    },
    rectStyle: function () {
      return {
        fill: this.rectFillColor,
        fillOpacity: '1',
        stroke: 'var(--solarized-base02)',
        strokeWidth: 0.3,
        transform: 'translate(-50%, -50%)'
      }
    },
    topConnectorPoints: function () {
      return (
        (this.x - this.height / 4) + ',' + (this.y - this.height / 2) + ' ' +
        (this.x + this.height / 4) + ',' + (this.y - this.height / 2) + ' ' +
        (this.x + this.height / 2) + ',' + (this.y - this.height * 7 / 8) + ' ' +
        (this.x - this.height / 2) + ',' + (this.y - this.height * 7 / 8) + ' '
      )
    },
    topConnectorStyle: function () {
      if (this.isTopConnectorSelected) {
        return {
          fill: 'var(--solarized-base00)'
        }
      }
      return {}
    }
  },
  methods: {
    handleMousedown: function (event) {
      this.isDragging = true
      this.oldClientX = event.clientX
      this.oldClientY = event.clientY
      var boundingClientRect = this.$el.parentNode.getBoundingClientRect()
      var shorterSide = Math.min(boundingClientRect.height, boundingClientRect.width)
      this.clientScaleFactor = 200 / shorterSide
    },
    handleMouseleave: function (event) {
      this.isDragging = false
    },
    handleMousemove: function (event) {
      if (this.isDragging) {
        this.$emit('update:x', this.x + this.clientScaleFactor * (event.clientX - this.oldClientX))
        this.$emit('update:y', this.y + this.clientScaleFactor * (event.clientY - this.oldClientY))
        this.oldClientX = event.clientX
        this.oldClientY = event.clientY
      }
    },
    handleMouseup: function (event) {
      this.isDragging = false
    }
  },
  mounted: function () {
    switch (this.type) {
      case CONSTANTS.NODE_TYPES.DESTINATION:
        return
      case CONSTANTS.NODE_TYPES.GAIN:
        return
      case CONSTANTS.NODE_TYPES.OSCILLATOR:
        this.waaNode.start(0)
    }
  },
  beforeDestroy: function () {
    switch (this.type) {
      case CONSTANTS.NODE_TYPES.DESTINATION:
        return
      case CONSTANTS.NODE_TYPES.GAIN:
        return
      case CONSTANTS.NODE_TYPES.OSCILLATOR:
        this.waaNode.stop()
    }
  }
}
