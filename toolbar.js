// eslint-disable-next-line no-unused-vars
var Toolbar = {
  template: (
    '<g class="toolbar">' +
    '<rect v-bind:height="rectHeight" v-bind:width="rectWidth"' +
    ' v-bind:x="createOscillatorX" v-bind:y="createOscillatorY"' +
    ' v-bind:style="[rectStyle, createOscillatorRectStyle]"' +
    ' v-on:click="createOscillator"' +
    '/>' +
    '<text class="no-click no-select" alignment-baseline="middle"' +
    ' v-bind:font-size="rectHeight / 2" text-anchor="middle"' +
    ' v-bind:x="createOscillatorX" v-bind:y="createOscillatorY"' +
    '> New Oscillator </text>' +
    '<rect v-bind:height="rectHeight" v-bind:width="rectWidth"' +
    ' v-bind:x="gainX" v-bind:y="gainY"' +
    ' v-bind:style="[rectStyle, gainRectStyle]" v-on:click="createGain"' +
    '/>' +
    '<text class="no-click no-select" alignment-baseline="middle"' +
    ' v-bind:font-size="rectHeight / 2" text-anchor="middle"' +
    ' v-bind:x="gainX" v-bind:y="gainY"' +
    '> New Gain </text>' +
    '</g>'
  ),
  data: function () {
    return {
      rectHeight: 10,
      rectStyle: {
        fillOpacity: '1',
        stroke: 'var(--solarized-base02)',
        strokeWidth: 0.3,
        transform: 'translate(-50%, -50%)'
      },
      rectWidth: 50
    }
  },
  computed: {
    createOscillatorRectStyle: function () {
      return { fill: 'var(--solarized-green-light)' }
    },
    createOscillatorX: function () {
      return 0 - this.rectWidth / 2
    },
    createOscillatorY: function () {
      return 0 - 100 + this.rectHeight / 2 + this.rectStyle.strokeWidth
    },
    gainRectStyle: function () {
      return { fill: 'var(--solarized-blue-light)' }
    },
    gainX: function () {
      return this.rectWidth / 2
    },
    gainY: function () {
      return 0 - 100 + this.rectHeight / 2 + this.rectStyle.strokeWidth
    }
  },
  methods: {
    connect: function () {
      this.$emit('connect', 'oscillator1', 'gain1')
      this.$emit('connect', 'gain1', 'destination')
    },
    createGain: function () {
      this.$emit('create-gain', {
        height: 10,
        id: 'gain1',
        width: 50,
        x: 0,
        y: 0
      })
    },
    createOscillator: function () {
      this.$emit('create-oscillator', {
        frequency: 440,
        height: 10,
        id: 'oscillator1',
        width: 50,
        x: 0,
        y: -50
      })
    },
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
  }
}
