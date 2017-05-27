// eslint-disable-next-line no-unused-vars
var Connection = {
  props: {
    id: { type: String, required: true },
    source: { type: Object, required: true },
    target: { type: Object, required: true }
  },
  template: (
    '<g>' +
    '<path v-bind:d="pathData" v-bind:style="style"/>' +
    '<text class="destroy-button no-select" alignment-baseline="middle" font-size="8px" text-anchor="middle" v-bind:x="destroyButtonX" v-bind:y="destroyButtonY" v-on:click="$emit(\'destroy\')"> &nbsp; x &nbsp; </text>' +
    '</g>'
  ),

  data: function () {
    return {
      destroyButtonPadding: 0,
      style: {
        fill: 'none',
        stroke: 'var(--solarized-base02)',
        strokeWidth: 0.5
      }
    }
  },
  computed: {
    destroyButtonX: function () {
      return (this.source.x + this.target.x) / 2 + this.destroyButtonPadding
    },
    destroyButtonY: function () {
      return (this.source.y + this.target.y) / 2 - this.destroyButtonPadding
    },
    pathData: function () {
      var x1 = this.source.x
      var x2 = this.target.x
      var y1 = this.source.y + this.source.height * 0.95
      var y2 = this.target.y - this.target.height * 7 / 8
      var cy = (y1 + y2) / 2
      return (
        'M' + x1 + ',' + y1 +
        ' C' + x1 + ',' + cy + ' ' + x2 + ',' + cy +
        ' ' + x2 + ',' + y2
      )
    }
  },
  mounted: function () {
    this.source.node.connect(this.target.node)
  },
  beforeDestroy: function () {
    this.source.node.disconnect(this.target.node)
  }
}
