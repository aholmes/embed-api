(function(MTVNPlayer, $) {
    "use strict";
    if (!MTVNPlayer.Player) {
        /**
         * Events dispatched by {@link MTVNPlayer.Player}.
         *
         * All events have a target property (event.target) which is the player that dispatched the event.
         * Some events have a data property (event.data) which contains data specific to the event.
         *
         * # How to listen to events
         * Attached to player instance via {@link MTVNPlayer.Player#bind}:
         *      player.bind("onMetadata",function(event) {
         *             var metadata = event.data;
         *          }
         *      });
         * Passed in as an Object to the constructor {@link MTVNPlayer.Player}:
         *      var player = new MTVNPlayer.Player("video-player",config,{
         *              onMetadata:function(event) {
         *                  var metadata = event.data;
         *              }
         *      });
         * Passed as an Object into {@link MTVNPlayer#createPlayers}
         *      MTVNPlayer.createPlayers("div.MTVNPlayer",config,{
         *              onMetadata:function(event) {
         *                  var metadata = event.data;
         *                  // player that dispatched the event
         *                  var player = event.target;
         *                  var uri = event.target.config.uri;
         *              }
         *      });
         * Attached to player from {@link MTVNPlayer#onPlayer}
         *      MTVNPlayer.onPlayer(function(player){
         *              player.bind("onMetadata",function(event) {
         *                  var metadata = event.data;
         *              }
         *      });
         *
         */
        MTVNPlayer.Events = {
            /**
             * @event onMetadata
             * Fired when the metadata changes. event.data is the metadata. Also see {@link MTVNPlayer.Player#currentMetadata}.
             *      player.bind("onMetadata",function(event) {
             *          // inspect the metadata object to learn more (documentation on metadata is in progress)
             *          console.log("metadata",event.data);
             *
             *          // at anytime after the MTVNPlayer.Events#READY,
             *          // you can access the metadata on the player directly at MTVNPlayer.Player#currentMetadata
             *          console.log(event.data === player.currentMetadata); // true
             *      });
             */
            METADATA: "onMetadata",
            /**
             * @event onStateChange
             * Fired when the play state changes. event.data is the state.
             */
            STATE_CHANGE: "onStateChange",
            /**
             * @event onMediaStart
             * Fired once per playlist item (content + ads/bumpers).
             */
            MEDIA_START: "onMediaStart",
            /**
             * @event onMediaEnd
             * Fired when a playlist item ends, this includes its prerolls and postrolls
             */
            MEDIA_END: "onMediaEnd",
            /**
             * @event onPlayheadUpdate
             * Fired as the playhead moves. event.data is the playhead time.
             */
            PLAYHEAD_UPDATE: "onPlayheadUpdate",
            /**
             * @event onPlaylistComplete
             * Fired once per playlist item (content + ads/bumpers)
             */
            PLAYLIST_COMPLETE: "onPlaylistComplete",
            /**
             * @deprecated 1.5.0 Use {@link MTVNPlayer.Events#onUIStateChange} instead
             * @event onOverlayRectChange
             * Fired when the GUI appears, event.data contains an {Object} {x:0,y:0,width:640,height:320}
             */
            OVERLAY_RECT_CHANGE: "onOverlayRectChange",
            /**
             * @event onReady
             * Fired once the API and metadata are available
             */
            READY: "onReady",
            /**
             * @event onUIStateChange
             * Fired when the UI changes its state, ususally due to user interaction, or lack of.
             *
             * event.data will contain information about the state.
             * - data.active <code>Boolean</code>: If true, user has activated the UI by clicking or touching.
             * If false, the user has remained idle with out interaction for a predetermined amount of time.
             * - data.overlayRect <code>Object</code>: the area that is not obscured by the GUI, a rectangle such as <code>{x:0,y:0,width:640,height:320}</code>
             */
            UI_STATE_CHANGE: "onUIStateChange",
            /**
             * @event onAirplay
             * Fired when the airplay button is clicked
             */
            AIRPLAY: "onAirplay"
        };
        /**
         * When a {@link MTVNPlayer.Events#onStateChange} event is fired, the event's data property will be equal to one of these play states. 
         * At the moment, there may be incongruities between html5 and flash state sequences. 
         * Flash also has "initializing" and "connecting" states, which aren't available in the html5 player.
         */
        MTVNPlayer.PlayState = {
            /**
             * The video is playing.
             * @property
             */
            PLAYING: "playing",
            /**
             * The video is paused.
             * @property
             */
            PAUSED: "paused",
            /**
             * The video is seeking.
             * @property
             */
            SEEKING: "seeking",
            /**
             * The video is stopped.
             * @property
             */
            STOPPED: "stopped",
            /**
             * The video is buffering.
             * @property
             */
            BUFFERING: "buffering"
        };
        // swfobject callback
        MTVNPlayer.onSWFObjectLoaded = null;
        /**
         * @member MTVNPlayer 
         * When using MTVNPlayer.createPlayers this config (see MTVNPlayer.Player.config) object will be used for every player created.
         * If MTVNPlayer.createPlayers is passed a config object, it will override anything defined in MTVNPlayer.defaultConfig.
         */
        MTVNPlayer.defaultConfig = MTVNPlayer.defaultConfig;
        /**
         * @member MTVNPlayer
         * When using MTVNPlayer.createPlayers this events object will be used for every player created.
         * If MTVNPlayer.createPlayers is passed a events object, it will override anything defined in MTVNPlayer.defaultEvents.
         */
        MTVNPlayer.defaultEvents = MTVNPlayer.defaultEvents;
        /**
         * @class MTVNPlayer.Player
         * The player object: use it to hook into events ({@link MTVNPlayer.Events}), call methods, and read properties.
         *      var player = new MTVNPlayer.Player(element/id,config,events);
         *      player.bind("onReady",function(event){player.mute();});
         *      player.pause();
         * @constructor
         * Create a new MTVNPlayer.Player
         * @param {String/HTMLElement} id-or-element Pass in a string id, or an actual HTMLElement
         * @param {Object} config config object, see: {@link MTVNPlayer.Player#config}
         * @param {Object} events Event callbacks, see: {@link MTVNPlayer.Events}
         * @returns MTVNPlayer.Player
         */
        MTVNPlayer.Player = (function(window) {
            // static methods variables
            var core = MTVNPlayer.module("core"),
                throwError = function(message) {
                    throw new Error("Embed API:" + message);
                },
                document = window.document,
                isIDevice = (function() {
                    var n = window.navigator.userAgent.toLowerCase();
                    return n.indexOf("iphone") !== -1 || n.indexOf("ipad") !== -1;
                })(),
                Player,
                /**
                 * @method checkEventName
                 * @private
                 * @param {String} eventName
                 * Check if the event exists in our list of events.
                 */
                checkEventName = function(eventName) {
                    var events = MTVNPlayer.Events;
                    for (var event in events) {
                        if (events.hasOwnProperty(event) && events[event] === eventName) {
                            return;
                        }
                    }
                    throw new Error("MTVNPlayer.Player event:" + eventName + " doesn't exist.");
                },
                /**
                 * @method checkEvents
                 * @private
                 * @param {Object} events
                 * Loop through the events, and check the event names
                 */
                checkEvents = function(events) {
                    for (var event in events) {
                        if (events.hasOwnProperty(event)) {
                            checkEventName(event);
                        }
                    }
                },
                getEmbedCodeDimensions = function(config) {
                    var Dimensions16x9 = {
                        width: 512,
                        height: 288
                    },
                        Dimensions4x3 = {
                            width: 360,
                            height: 293
                        },
                        aspect = config.width / config.height,
                        Diff4x3 = Math.abs(aspect - 4 / 3),
                        Diff16x9 = Math.abs(aspect - 16 / 9);
                    return Diff16x9 < Diff4x3 ? Dimensions16x9 : Dimensions4x3;
                },
                getEmbedCode = function() {
                    var config = this.config,
                        metadata = this.currentMetadata,
                        displayDataPrefix = "<p style=\"text-align:left;background-color:#FFFFFF;padding:4px;margin-top:4px;margin-bottom:0px;font-family:Arial, Helvetica, sans-serif;font-size:12px;\">",
                        displayMetadata = (function() {
                            if (!metadata) {
                                return "";
                            }
                            var copy = "",
                                categories = metadata.rss.group.categories,
                                source = categories.source,
                                sourceLink = categories.sourceLink,
                                seoHTMLText = categories.seoHTMLText;
                            if (source) {
                                if (sourceLink) {
                                    copy += "<b><a href=\"" + sourceLink + "\">" + source + "</a></b>";
                                } else {
                                    copy += "<b>" + source + "</b> ";
                                }
                            }
                            if (seoHTMLText) {
                                if (copy) {
                                    copy += "<br/>";
                                }
                                copy += "Get More: " + seoHTMLText;
                            }
                            if (copy) {
                                copy = displayDataPrefix + copy + "</p>";
                            }
                            return copy;
                        })(),
                        embedDimensions = getEmbedCodeDimensions(config),
                        embedCode = "<div style=\"background-color:#000000;width:{divWidth}px;\"><div style=\"padding:4px;\">" + "<iframe src=\"http://media.mtvnservices.com/embed/{uri}\" width=\"{width}\" height=\"{height}\" frameborder=\"0\"></iframe>" + "{displayMetadata}</div></div>";
                    embedCode = embedCode.replace(/\{uri\}/, config.uri);
                    embedCode = embedCode.replace(/\{width\}/, embedDimensions.width);
                    embedCode = embedCode.replace(/\{divWidth\}/, embedDimensions.width + 8);
                    embedCode = embedCode.replace(/\{height\}/, embedDimensions.height);
                    embedCode = embedCode.replace(/\{displayMetadata\}/, displayMetadata);
                    return embedCode;
                },
                createId = function(target) {
                    var newID = "mtvnPlayer" + Math.round(Math.random() * 10000000);
                    target.setAttribute("id", newID);
                    return newID;
                };
            // end private vars
            /**
             * @member MTVNPlayer
             * Whenever a player is created, the callback passed will fire with the player as the first
             * argument, providing an easy way to hook into player events in a decoupled way.
             * @param {Function} callback A callback fired when every player is created.
             *
             *     MTVNPlayer.onPlayer(function(player){
             *          // player is the player that was just created.
             *          // we can now hook into events.
             *          player.bind("onReady",function(event) {
             *              // do something when "onReady" fires.
             *          }
             *
             *          // or look for information about the player.
             *          var uri = player.config.uri;
             *     });
             */
            MTVNPlayer.onPlayer = function(callback) {
                core.onPlayerCallbacks.push(callback);
            };
            /**
             * @member MTVNPlayer
             * (Available in 1.6.0) Remove a callback registered width {@link MTVNPlayer#onPlayer}
             * @param {Function} callback A callback fired when every player is created.
             */
            MTVNPlayer.removeOnPlayer = function(callback) {
                var index = core.onPlayerCallbacks.indexOf(callback);
                if (index !== -1) {
                    core.onPlayerCallbacks.splice(index, 1);
                }
            };
            /**
             * @member MTVNPlayer
             * Returns an array containing each {@link MTVNPlayer.Player} created.
             * @returns {Array} An array containing each {@link MTVNPlayer.Player} created.
             *      var players = MTVNPlayer.getPlayers();
             *      for(var i = 0, len = players.length; i < len; i++){
             *          var player = players[i];
             *          if(player.config.uri === "mgid:cms:video:thedailyshow.com:12345"){
             *              // do something
             *          }
             *      }
             */
            MTVNPlayer.getPlayers = function() {
                var result = [],
                    instances = core.instances,
                    i = instances.length;
                for (i; i--;) {
                    result.push(instances[i].player);
                }
                return result;
            };
            /**
             * @member MTVNPlayer
             * Create players from elements in the page.
             * @param {String} selector default is "div.MTVNPlayer"
             * @param {Object} config {@link MTVNPlayer.Player#config}
             * @param {Object} events {@link MTVNPlayer.Events}
             *
             * Example:
             *      <div class="MTVNPlayer" data-contenturi="mgid:cms:video:nick.com:920786"/>
             *      <script type="text/javascript">
             *              MTVNPlayer.createPlayers("div.MTVNPlayer",{width:640,height:320})
             *      </script>
             *  With events:
             *      <div class="MTVNPlayer" data-contenturi="mgid:cms:video:nick.com:920786"/>
             *      <script type="text/javascript">
             *              MTVNPlayer.createPlayers("div.MTVNPlayer",{width:640,height:320},{
             *                  onPlayheadUpdate:function(event) {
             *                      // do something custom
             *                      var player = event.target; // the player that dispatched the event
             *                      var playheadTime = event.data // some events have a data property with event-specific data
             *                      if(player.config.uri === "mgid:cms:video:thedailyshow.com:12345"){
             *                              // here we're checking if the player that dispatched the event has a specific URI.
             *                              // however, we also could have called MTVNPlayer#createPlayers with a different selector to distingush.
             *                      }
             *                  }
             *              });
             *      </script>
             */
            MTVNPlayer.createPlayers = function(selectorQuery, config, events) {
                if (!selectorQuery) {
                    selectorQuery = "div.MTVNPlayer";
                }
                var elements = MTVNPlayer.module("selector").find(selectorQuery),
                    configModule = MTVNPlayer.module("config");
                for (var i = 0, len = elements.length; i < len; i++) {
                    new MTVNPlayer.Player(elements[i], configModule.copyProperties(config || {}, MTVNPlayer.defaultConfig), configModule.copyEvents(events || {}, MTVNPlayer.defaultEvents));
                }
                return elements.length;
            };

            Player = function(elementOrId, config, events) {
                /** 
                 * @property {Boolean} ready
                 * The current ready state of the player
                 */
                this.ready = false;
                /**
                 * @property {Boolean} eventQueue
                 * A list of event messages called before the player was ready
                 */
                this.eventQueue = [];
                /**
                 * @property {String} state
                 * The current play state of the player.
                 */
                this.state = null;
                /**
                 * The current metadata is the metadata that is playing back at this moment.
                 * This could be ad metadata, or it could be content metadata.
                 * To access the metadata for the content items in the playlist see {@link MTVNPlayer.Player#playlistMetadata}
                 *
                 * *The best way to inspect the metadata is by using a modern browser and calling console.log("metadata",metadata);*
                 * @property {Object} currentMetadata
                 *
                 * @property {Number} currentMetadata.index
                 * The index of this metadata in relation to the playlist items. If isAd is true, the index will be -1.
                 *
                 * @property {Number} currentMetadata.duration
                 * The duration of the content. This will update as the duration becomes more accurate.
                 *
                 * @property {Boolean} currentMetadata.live
                 * Whether or not the video that's playing is a live stream.
                 *
                 * @property {Boolean} currentMetadata.isAd
                 * Whether or not the video that's playing is an advertisment.
                 *
                 * @property {Boolean} currentMetadata.isBumper
                 * Whether or not the video that's playing is a bumper.
                 *
                 * @property {Object} currentMetadata.rss
                 * The data in the rss feed maps to this object, mirroring the rss's hierarchy
                 * @property {String} currentMetadata.rss.title
                 * Corresponds to the rss title.
                 * @property {String} currentMetadata.rss.description
                 * Corresponds to the rss description.
                 * @property {String} currentMetadata.rss.link
                 * Corresponds to the rss link.
                 * @property {String} currentMetadata.rss.guid
                 * Corresponds to the rss guid.
                 * @property {Object} currentMetadata.rss.group
                 * Corresponds to the rss group.
                 * @property {Object} currentMetadata.rss.group.categories
                 * Corresponds to the rss group categories
                 *
                 */
                this.currentMetadata = null;
                /**
                 * @property {Object} playlistMetadata
                 * The playlistMetadata is the metadata about all the playlist items.
                 *
                 * @property {Array} playlistMetadata.items
                 * An array of metadata corresponding to each playlist item, see:{@link MTVNPlayer.Player#currentMetadata}
                 */
                this.playlistMetadata = null;
                /** @property {Number} playhead
                 * The current playhead time in seconds.
                 */
                this.playhead = 0;
                /**
                 * @property {HTMLElement} element
                 * The swf embed or the iframe element. This may be null after invoking new MTVNPlayer.Player
                 * if swfobject needs to be loaded asynchronously. Once swfobject is loaded, the swf embed will be created and this.element will be set.
                 * If this is a problem, load swfobject before creating players.
                 */
                this.element = null;
                /**
                 * @cfg {Object} config The main configuration object.
                 * @cfg {String} [config.uri] (required) The URI of the media.
                 * @cfg {Number} [config.width] (required) The width of the player
                 * @cfg {Number} [config.height] (required) The height of the player
                 * @cfg {Object} [config.flashVars] Flashvars are passed to the flash player
                 * @cfg {Object} [config.params] wmode, allowFullScreen, etc. (allowScriptAccess is always forced to true). See [Adobe Help][1]
                 * [1]: http://kb2.adobe.com/cps/127/tn_12701.html
                 * @cfg {Object} [config.attributes] see [Adobe Help][1]
                 * [1]: http://kb2.adobe.com/cps/127/tn_12701.html
                 * @cfg {String} [config.fullScreenCssText] When the HTML5 player goes full screen, this is the css that is set on the iframe.
                 * @cfg {String} [config.templateURL] (For TESTING) A URL to use for the embed of iframe src. The template var for uri is {uri}, such as http://site.com/uri={uri}.
                 *
                 */
                this.config = config || {};
                var create = null,
                    playerModule = null,
                    el = null,
                    isElement = (function(o) {
                        return typeof window.HTMLElement === "object" ? o instanceof window.HTMLElement : //DOM2
                        typeof o === "object" && o.nodeType === 1 && typeof o.nodeName === "string";
                    })(elementOrId);
                if (isElement) {
                    el = elementOrId;
                    this.id = createId(el);
                    this.config = MTVNPlayer.module("config").buildConfig(el, this.config);
                } else {
                    this.id = elementOrId;
                    el = document.getElementById(this.id);
                }
                this.events = events || {};
                this.isFlash = this.config.isFlash === undefined ? !isIDevice : this.config.isFlash;
                // make sure the events are valid
                checkEvents(events);

                if (this.isFlash) {
                    playerModule = MTVNPlayer.module("flash");
                } else {
                    playerModule = MTVNPlayer.module("html5");
                }
                playerModule.initialize();
                this.message = function() {
                    if (!this.ready) {
                        this.eventQueue.push(arguments);
                    } else {
                        playerModule.message.apply(this, arguments);
                    }
                };
                create = playerModule.create;
                this.once("onReady", function(event) {
                    var player = event.target,
                        eventQueue = player.eventQueue,
                        message = player.message;
                    for(var i = 0, len = eventQueue.length; i < len; i++) {
                        message.apply(player, eventQueue[i]);
                    }
                });

                // check for element before creating
                if (!el) {
                    if (document.readyState === "complete") {
                        throwError("target div " + this.id + " not found");
                    } else {
                        if ($) {
                            (function(ref) {
                                $(document).ready(function() {
                                    if (document.getElementById(ref.id)) {
                                        create(ref);
                                    } else {
                                        throwError("target div " + ref.id + " not found");
                                    }
                                });
                            })(this);
                        } else {
                            throwError("Only call new MTVNPlayer.Player(targetID,..) after the targetID element is in the DOM.");
                        }
                    }
                    return;
                } else {
                    create(this);
                }
            };
            // public api
            Player.prototype = {
                /**
                 * 2.1.0 Use {@link MTVNPlayer.Player#element}
                 * @deprecated 
                 * @returns HTMLElement the object/embed element for flash or the iframe element for the HTML5 Player.
                 */
                getPlayerElement: function() {
                    return this.element;
                },
                /**
                 * Begins playing or unpauses.
                 */
                play: function() {
                    this.message("play");
                },
                /**
                 * Pauses the media.
                 */
                pause: function() {
                    this.message("pause");
                },
                /**
                 * Mutes the volume
                 */
                mute: function() {
                    this.message("mute");
                },
                /**
                 * Returns the volume to the level before it was muted.
                 */
                unmute: function() {
                    this.message("unmute");
                },
                /**
                 * Play an item from the playlist specified by the index and optionally at a certain time in the clip.
                 * @param {Number} index
                 * @param {Number} startTime value between 0 and the duration of the current clip.
                 */
                playIndex: function(index, startTime) {
                    this.message("playIndex", index, startTime);
                },
                /**
                 * Play a new URI
                 * @param {String} uri
                 */
                playURI: function(uri) {
                    this.message("playUri", uri);
                },
                /**
                 * Change the volume
                 * @param {Number} value between 0 and 1.
                 */
                setVolume: function(volume) {
                    this.message("volume", volume);
                },
                /**
                 * Seeks to the time specified in seconds relative to the first clip.
                 * @param {Number} value between 0 and the duration of the playlist. 
                 * The value is relative to the first clip. It's recommended that when 
                 * seeking to another clip besides the first, use {@link MTVNPlayer.Player#playIndex}.
                 */
                seek: function(time) {
                    this.message("seek", time);
                },
                /**
                 * Returns the embed code used to share this instance of the player
                 * @return {String} the embed code as a string.
                 */
                getEmbedCode: function() {
                    return getEmbedCode.call(this);
                },
                /**
                 * Puts the player in full screen mode, does not work for the flash player do the flash restrictions.
                 */
                goFullScreen: function() {
                    this.message("goFullScreen");
                },
                /**
                 * Exits full screen and returns the player to its initial embed size.
                 * Does not work with Prime builds older than 1.12.
                 */
                exitFullScreen: function() {
                    this.message("exitFullScreen");
                },
                /**
                 * Adds an event listener for an event.
                 * @param {String} eventName an {@link MTVNPlayer.Events}.
                 * @param {Function} callback The function to invoke when the event is fired.
                 */
                bind: function(eventName, callback) {
                    checkEventName(eventName);
                    var currentEvent = this.events[eventName];
                    if (!currentEvent) {
                        currentEvent = callback;
                    } else if (currentEvent instanceof Array) {
                        currentEvent.push(callback);
                    } else {
                        currentEvent = [callback, currentEvent];
                    }
                    this.events[eventName] = currentEvent;
                },
                /**
                 * Removes an event listener
                 * @param {String} eventName an MTVNPlayer.Event.
                 * @param {Function} callback The function to that was bound to the event.
                 */
                unbind: function(eventName, callback) {
                    checkEventName(eventName);
                    var i, currentEvent = this.events[eventName];
                    if (!currentEvent) {
                        return;
                    } else if (currentEvent instanceof Array) {
                        for (i = currentEvent.length; i--;) {
                            if (currentEvent[i] === callback) {
                                currentEvent.splice(i, 1);
                                break;
                            }
                        }
                    } else {
                        this.events[eventName] = null;
                    }
                },
                /**
                 * Adds an event listener for an event that will only fire once and then be removed.
                 * @param {String} eventName an {@link MTVNPlayer.Events}.
                 * @param {Function} callback The function to invoke when the event is fired.
                 */
                once: function(eventName, callback) {
                    var ref = this,
                        newCB = function(event) {
                            callback(event);
                            ref.unbind(eventName, newCB);
                        };
                    this.bind(eventName, newCB);
                }
            };
            return Player;
        }(window));
        if (typeof MTVNPlayer.onAPIReady === "function") {
            MTVNPlayer.onAPIReady();
        }
        /**
         * @member MTVNPlayer
         * @property {Boolean}
         * Set to true after the API is loaded.
         */
        MTVNPlayer.isReady = true;
    }
})(window.MTVNPlayer, window.jQuery || window.Zepto);