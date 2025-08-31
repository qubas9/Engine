/**
 * Event management utility for registering, removing, and emitting events.
 * 
 * @property {Object.<string, Map<number, Function>>} listeners - Stores event listeners by event name.
 * @property {number} id - Unique identifier for each listener.
 * @property {Map<number, string>} index - Maps listener IDs to event names for quick removal.
 * 
 * @method
 * @name on
 * @description Registers a callback for a specific event.
 * @param {string} event - The name of the event to listen to.
 * @param {Function} callback - The callback function to execute when the event is emitted.
 * @returns {number} The unique ID of the registered listener.
 * 
 * @method
 * @name off
 * @description Removes a previously registered event listener by its ID.
 * @param {number} id - The unique ID of the listener to remove.
 * 
 * @method
 * @name emit
 * @description Emits an event, invoking all registered callbacks for that event.
 * @param {string} event - The name of the event to emit.
 * @param {...any} args - Arguments to pass to the event callbacks.
 */
const Event = {
  listeners: {},   // { eventName: Map<id, callback> }
  id: 0,
  index: new Map(), // id → eventName (pro rychlé remove)

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = new Map();
    }
    const id = this.id++;
    this.listeners[event].set(id, callback);
    this.index.set(id, event);
    return id;
  },

 off(id) {
    const event = this.index.get(id);
    if (!event) return;
    this.listeners[event]?.delete(id);
    this.index.delete(id);
  },

  emit(event, ...args) {
    if (!this.listeners[event]) return;
    for (const cb of this.listeners[event].values()) {
      cb(...args);
    }
  }
};
export default Event;