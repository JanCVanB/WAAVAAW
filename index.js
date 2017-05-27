window.vm = new Vue({
  el: '#app',
  data: function () {
    return {
      audioContext: CONSTANTS.AUDIO_CONTEXT,
      connections: {},
      destinationType: CONSTANTS.NODE_TYPES.DESTINATION,
      drawOrder: ['destination'],
      gainType: CONSTANTS.NODE_TYPES.GAIN,
      nextConnectionSourceId: '',
      nextConnectionTargetId: '',
      nodes: {
        destination: {
          height: 10,
          id: 'destination',
          type: CONSTANTS.NODE_TYPES.DESTINATION,
          waaNode: CONSTANTS.AUDIO_CONTEXT.destination,
          width: 50,
          x: 0,
          y: 50
        }
      },
      oscillatorType: CONSTANTS.NODE_TYPES.OSCILLATOR,
      theme: 'light'
    }
  },
  computed: {
    classes: function () {
      return {
        'dark-theme': this.theme === 'dark',
        'light-theme': this.theme === 'light'
      }
    },
    colors: function () {
      switch (this.theme) {
        case 'dark':
          return {
            connectorSelectedFill: 'var(--solarized-base2)',
            destinationFill: 'var(--solarized-red)',
            gainFill: 'var(--solarized-blue)',
            stroke: 'var(--solarized-base1)',
            oscillatorFill: 'var(--solarized-green)'
          }
        case 'light':
          return {
            connectorSelectedFill: 'var(--solarized-base02)',
            destinationFill: 'var(--solarized-red-light)',
            gainFill: 'var(--solarized-blue-light)',
            stroke: 'var(--solarized-base01)',
            oscillatorFill: 'var(--solarized-green-light)'
          }
      }
    },
    sortedNodes: function () {
      var component = this
      var nodes = _.values(component.nodes)
      return _.sortBy(
        nodes,
        function (node) {
          return component.drawOrder.indexOf(node.id)
        }
      )
    }
  },
  methods: {
    connect: function (sourceId, targetId) {
      if (!this.nodes[sourceId] || !this.nodes[targetId]) return
      var oldConnectionId = this.findOldConnectionId(sourceId, targetId)
      if (!oldConnectionId) {
        var newConnectionId = sourceId + '_to_' + targetId
        Vue.set(this.connections, newConnectionId, {
          id: newConnectionId,
          sourceId: sourceId,
          targetId: targetId
        })
      }
    },
    createGain: function (gainInfo) {
      var oldNodeId = this.findOldNodeId(gainInfo.id)
      if (!oldNodeId) {
        Vue.set(this.nodes, gainInfo.id, Object.assign(gainInfo, {
          type: CONSTANTS.NODE_TYPES.GAIN,
          waaNode: this.audioContext.createGain()
        }))
        this.drawOrder.push(gainInfo.id)
      }
    },
    createOscillator: function (oscillatorInfo) {
      var oldNodeId = this.findOldNodeId(oscillatorInfo.id)
      if (!oldNodeId) {
        Vue.set(this.nodes, oscillatorInfo.id, Object.assign(oscillatorInfo, {
          type: CONSTANTS.NODE_TYPES.OSCILLATOR,
          waaNode: this.audioContext.createOscillator()
        }))
        this.drawOrder.push(oscillatorInfo.id)
      }
    },
    destroyNode: function (nodeId) {
      var component = this
      _.values(component.connections).forEach(function (connection) {
        if (connection.sourceId === nodeId || connection.targetId === nodeId) {
          component.disconnect(connection.sourceId, connection.targetId)
        }
      })
      if (this.nodes[nodeId]) {
        Vue.delete(this.nodes, nodeId)
      }
    },
    disconnect: function (sourceId, targetId) {
      var oldConnectionId = this.findOldConnectionId(sourceId, targetId)
      if (oldConnectionId) {
        Vue.delete(this.connections, oldConnectionId)
      }
    },
    findOldConnectionId: function (sourceId, targetId) {
      return _.findKey(
        this.connections,
        function (connection) {
          return connection.sourceId === sourceId && connection.targetId === targetId
        }
      )
    },
    findOldNodeId: function (nodeId) {
      return _.findKey(
        this.nodes,
        function (node) {
          return node.id === nodeId
        }
      )
    },
    handleClickCanvas: function () {
      this.resetNextConnection()
    },
    handleSelectBottomConnector: function (nodeId) {
      if (this.nextConnectionTargetId === nodeId) return
      if (this.nextConnectionTargetId) {
        this.connect(nodeId, this.nextConnectionTargetId)
        this.resetNextConnection()
      } else {
        this.nextConnectionSourceId = nodeId
      }
    },
    handleSelectTopConnector: function (nodeId) {
      if (this.nextConnectionSourceId === nodeId) return
      if (this.nextConnectionSourceId) {
        this.connect(this.nextConnectionSourceId, nodeId)
        this.resetNextConnection()
      } else {
        this.nextConnectionTargetId = nodeId
      }
    },
    resetNextConnection: function () {
      this.nextConnectionSourceId = ''
      this.nextConnectionTargetId = ''
    }
  },
  components: {
    'connection': Connection,
    'node': Node,
    'toolbar': Toolbar
  }
})
