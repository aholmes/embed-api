/*global $, _, Core, Modules, PerformanceManager, ConfigManager*/
/**
 * @ignore
 * This player overrides a few methods just like the legacy flash and html5 players.
 */
var PlayerOverrides = _.once(function() {
	return {
		/**
		 * @ignore
		 * load javascript and instantiate modules.
		 */
		create: function() {
			_.bindAll(this);
			Core.instances.push({
				source: this.id,
				player: this
			});
			$(this.containerElement).css({
				position: "relative" // TODO not here.
			});
			Core.executeCallbacks(this);
			// doesn't need to be referenced anywhere.
			this.module("performance", PerformanceManager);
			// start up
			// modules will now communicate through the module object. 
			// this keeps the embed api clean.
			// the controller is the player object itself, and events go off there.
			this.module(Modules.CONFIG, ConfigManager);
		},
		/**
		 * @ignore
		 * forward messages along to the correct module.
		 */
		message: function() {
			var m = this.module(Modules.PLAYBACK_MANAGER);
			m.message.apply(m, arguments);
		},
		destroy: function() {
			// TODO
		},
		isPaused: function() {
			return this.module(Modules.PLAYBACK_MANAGER).isPaused();
		}
	};
});