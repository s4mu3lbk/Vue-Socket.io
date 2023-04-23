export default {
  /**
   *  Assign runtime callbacks
   */
  beforeCreate() {
    if (!this.sockets) this.sockets = {};

    this.sockets.subscribe = (event, callback) => {
      this.$vueSocketIo.emitter.addListener(event, callback, this);
    };

    this.sockets.unsubscribe = event => {
      this.$vueSocketIo.emitter.removeListener(event, this);
    };
  },

  /**
   * Register all socket events
   */
  mounted() {
    if (this.$options.sockets) {
      Object.keys(this.$options.sockets).forEach(eventOrNamespace => {
        const functionOrObject = this.$options.sockets[eventOrNamespace];
        if (
          typeof functionOrObject === 'function' &&
          eventOrNamespace !== 'subscribe' &&
          eventOrNamespace !== 'unsubscribe'
        ) {
          this.$vueSocketIo.emitter.addListener(eventOrNamespace, functionOrObject, this);
        } else {
          Object.keys(functionOrObject).forEach(event => {
            if (event !== 'subscribe' && event !== 'unsubscribe') {
             this.$vueSocketIo.emitter.addListener(`${eventOrNamespace}_${event}`, functionOrObject[event], this);
            }
          });
        }
      });
    }
  },

  /**
   * unsubscribe when component unmounting
   */
  beforeDestroy() {
    if (this.$options.sockets) {
      Object.keys(this.$options.sockets).forEach(eventOrNamespace => {
        const functionOrObject = this.$options.sockets[eventOrNamespace];
        if (typeof functionOrObject === 'function') {
          this.$vueSocketIo.emitter.removeListener(eventOrNamespace, functionOrObject, this);
        } else {
          Object.keys(functionOrObject).forEach(event => {
            this.$vueSocketIo.emitter.removeListener(event, functionOrObject[event], this);
          });
        }
      });
    }
  },
};
