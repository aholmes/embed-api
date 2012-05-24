Ext.data.JsonP.MTVNPlayer_Events({"parentMixins":[],"alternateClassNames":[],"tagname":"class","singleton":false,"statics":{"cfg":[],"property":[],"method":[],"event":[],"css_var":[],"css_mixin":[]},"html_meta":{},"mixins":[],"code_type":"assignment","inheritable":false,"requires":[],"meta":{},"files":[{"href":"api.html#MTVNPlayer-Events","filename":"api.js"}],"members":{"cfg":[],"method":[],"property":[],"css_var":[],"event":[{"owner":"MTVNPlayer.Events","tagname":"event","meta":{},"name":"onAirplay","id":"event-onAirplay"},{"owner":"MTVNPlayer.Events","tagname":"event","meta":{},"name":"onMediaEnd","id":"event-onMediaEnd"},{"owner":"MTVNPlayer.Events","tagname":"event","meta":{},"name":"onMediaStart","id":"event-onMediaStart"},{"owner":"MTVNPlayer.Events","tagname":"event","meta":{},"name":"onMetadata","id":"event-onMetadata"},{"owner":"MTVNPlayer.Events","tagname":"event","meta":{"deprecated":{"text":"Use {@link MTVNPlayer.Events#onUIStateChange} instead","version":"1.5.0"}},"name":"onOverlayRectChange","id":"event-onOverlayRectChange"},{"owner":"MTVNPlayer.Events","tagname":"event","meta":{},"name":"onPlayheadUpdate","id":"event-onPlayheadUpdate"},{"owner":"MTVNPlayer.Events","tagname":"event","meta":{},"name":"onPlaylistComplete","id":"event-onPlaylistComplete"},{"owner":"MTVNPlayer.Events","tagname":"event","meta":{},"name":"onReady","id":"event-onReady"},{"owner":"MTVNPlayer.Events","tagname":"event","meta":{},"name":"onStateChange","id":"event-onStateChange"},{"owner":"MTVNPlayer.Events","tagname":"event","meta":{},"name":"onUIStateChange","id":"event-onUIStateChange"}],"css_mixin":[]},"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/api.html#MTVNPlayer-Events' target='_blank'>api.js</a></div></pre><div class='doc-contents'><p>Events dispatched by <a href=\"#!/api/MTVNPlayer.Player\" rel=\"MTVNPlayer.Player\" class=\"docClass\">MTVNPlayer.Player</a>.</p>\n\n<p>All events have a target property (event.target) which is the player that dispatched the event.\nSome events have a data property (event.data) which contains data specific to the event.</p>\n\n<h1>How to listen to events</h1>\n\n<p>Attached to player instance via <a href=\"#!/api/MTVNPlayer.Player-method-bind\" rel=\"MTVNPlayer.Player-method-bind\" class=\"docClass\">MTVNPlayer.Player.bind</a>:</p>\n\n<pre><code> player.bind(\"onMetadata\",function(event) {\n        var metadata = event.data;\n     }\n });\n</code></pre>\n\n<p>Passed in as an Object to the constructor <a href=\"#!/api/MTVNPlayer.Player\" rel=\"MTVNPlayer.Player\" class=\"docClass\">MTVNPlayer.Player</a>:</p>\n\n<pre><code> var player = new <a href=\"#!/api/MTVNPlayer.Player\" rel=\"MTVNPlayer.Player\" class=\"docClass\">MTVNPlayer.Player</a>(\"video-player\",config,{\n         onMetadata:function(event) {\n             var metadata = event.data;\n         }\n });\n</code></pre>\n\n<p>Passed as an Object into <a href=\"#!/api/MTVNPlayer-method-createPlayers\" rel=\"MTVNPlayer-method-createPlayers\" class=\"docClass\">MTVNPlayer.createPlayers</a></p>\n\n<pre><code> <a href=\"#!/api/MTVNPlayer-method-createPlayers\" rel=\"MTVNPlayer-method-createPlayers\" class=\"docClass\">MTVNPlayer.createPlayers</a>(\"div.MTVNPlayer\",config,{\n         onMetadata:function(event) {\n             var metadata = event.data;\n             // player that dispatched the event\n             var player = event.target;\n             var uri = event.target.config.uri;\n         }\n });\n</code></pre>\n\n<p>Attached to player from <a href=\"#!/api/MTVNPlayer-method-onPlayer\" rel=\"MTVNPlayer-method-onPlayer\" class=\"docClass\">MTVNPlayer.onPlayer</a></p>\n\n<pre><code> <a href=\"#!/api/MTVNPlayer-method-onPlayer\" rel=\"MTVNPlayer-method-onPlayer\" class=\"docClass\">MTVNPlayer.onPlayer</a>(function(player){\n         player.bind(\"onMetadata\",function(event) {\n             var metadata = event.data;\n         }\n });\n</code></pre>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-event'>Events</h3><div class='subsection'><div id='event-onAirplay' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MTVNPlayer.Events'>MTVNPlayer.Events</span><br/><a href='source/api.html#MTVNPlayer-Events-event-onAirplay' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MTVNPlayer.Events-event-onAirplay' class='name expandable'>onAirplay</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Fired when the airplay button is clicked ...</div><div class='long'><p>Fired when the airplay button is clicked</p>\n</div></div></div><div id='event-onMediaEnd' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MTVNPlayer.Events'>MTVNPlayer.Events</span><br/><a href='source/api.html#MTVNPlayer-Events-event-onMediaEnd' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MTVNPlayer.Events-event-onMediaEnd' class='name expandable'>onMediaEnd</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Fired when a playlist item ends, this includes its prerolls and postrolls ...</div><div class='long'><p>Fired when a playlist item ends, this includes its prerolls and postrolls</p>\n</div></div></div><div id='event-onMediaStart' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MTVNPlayer.Events'>MTVNPlayer.Events</span><br/><a href='source/api.html#MTVNPlayer-Events-event-onMediaStart' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MTVNPlayer.Events-event-onMediaStart' class='name expandable'>onMediaStart</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Fired once per playlist item (content + ads/bumpers). ...</div><div class='long'><p>Fired once per playlist item (content + ads/bumpers).</p>\n</div></div></div><div id='event-onMetadata' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MTVNPlayer.Events'>MTVNPlayer.Events</span><br/><a href='source/api.html#MTVNPlayer-Events-event-onMetadata' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MTVNPlayer.Events-event-onMetadata' class='name expandable'>onMetadata</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Fired when the metadata changes. ...</div><div class='long'><p>Fired when the metadata changes. event.data is the metadata. Also see <a href=\"#!/api/MTVNPlayer.Player-property-currentMetadata\" rel=\"MTVNPlayer.Player-property-currentMetadata\" class=\"docClass\">MTVNPlayer.Player.currentMetadata</a>.</p>\n\n<pre><code> player.bind(\"onMetadata\",function(event) {\n     // inspect the metadata object to learn more (documentation on metadata is in progress)\n     console.log(\"metadata\",event.data);\n\n     // at anytime after the MTVNPlayer.Events#READY,\n     // you can access the metadata on the player directly at <a href=\"#!/api/MTVNPlayer.Player-property-currentMetadata\" rel=\"MTVNPlayer.Player-property-currentMetadata\" class=\"docClass\">MTVNPlayer.Player.currentMetadata</a>\n     console.log(event.data === player.currentMetadata); // true\n });\n</code></pre>\n</div></div></div><div id='event-onOverlayRectChange' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MTVNPlayer.Events'>MTVNPlayer.Events</span><br/><a href='source/api.html#MTVNPlayer-Events-event-onOverlayRectChange' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MTVNPlayer.Events-event-onOverlayRectChange' class='name expandable'>onOverlayRectChange</a>( <span class='pre'></span> )<strong class='deprecated signature'>deprecated</strong></div><div class='description'><div class='short'>Fired when the GUI appears, event.data contains an {Object} {x:0,y:0,width:640,height:320} ...</div><div class='long'><p>Fired when the GUI appears, event.data contains an {Object} {x:0,y:0,width:640,height:320}</p>\n        <div class='signature-box deprecated'>\n        <p>This event has been <strong>deprecated</strong> since 1.5.0</p>\n        <p>Use <a href=\"#!/api/MTVNPlayer.Events-event-onUIStateChange\" rel=\"MTVNPlayer.Events-event-onUIStateChange\" class=\"docClass\">onUIStateChange</a> instead</p>\n\n        </div>\n</div></div></div><div id='event-onPlayheadUpdate' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MTVNPlayer.Events'>MTVNPlayer.Events</span><br/><a href='source/api.html#MTVNPlayer-Events-event-onPlayheadUpdate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MTVNPlayer.Events-event-onPlayheadUpdate' class='name expandable'>onPlayheadUpdate</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Fired as the playhead moves. ...</div><div class='long'><p>Fired as the playhead moves. event.data is the playhead time.</p>\n</div></div></div><div id='event-onPlaylistComplete' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MTVNPlayer.Events'>MTVNPlayer.Events</span><br/><a href='source/api.html#MTVNPlayer-Events-event-onPlaylistComplete' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MTVNPlayer.Events-event-onPlaylistComplete' class='name expandable'>onPlaylistComplete</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Fired once per playlist item (content + ads/bumpers) ...</div><div class='long'><p>Fired once per playlist item (content + ads/bumpers)</p>\n</div></div></div><div id='event-onReady' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MTVNPlayer.Events'>MTVNPlayer.Events</span><br/><a href='source/api.html#MTVNPlayer-Events-event-onReady' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MTVNPlayer.Events-event-onReady' class='name expandable'>onReady</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Fired once the API and metadata are available ...</div><div class='long'><p>Fired once the API and metadata are available</p>\n</div></div></div><div id='event-onStateChange' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MTVNPlayer.Events'>MTVNPlayer.Events</span><br/><a href='source/api.html#MTVNPlayer-Events-event-onStateChange' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MTVNPlayer.Events-event-onStateChange' class='name expandable'>onStateChange</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Fired when the play state changes. ...</div><div class='long'><p>Fired when the play state changes. event.data is the state.</p>\n</div></div></div><div id='event-onUIStateChange' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MTVNPlayer.Events'>MTVNPlayer.Events</span><br/><a href='source/api.html#MTVNPlayer-Events-event-onUIStateChange' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MTVNPlayer.Events-event-onUIStateChange' class='name expandable'>onUIStateChange</a>( <span class='pre'></span> )</div><div class='description'><div class='short'>Fired when the UI changes its state, ususally due to user interaction, or lack of. ...</div><div class='long'><p>Fired when the UI changes its state, ususally due to user interaction, or lack of.</p>\n\n<p>event.data will contain information about the state.\n- data.active <code>Boolean</code>: If true, user has activated the UI by clicking or touching.\nIf false, the user has remained idle with out interaction for a predetermined amount of time.\n- data.overlayRect <code>Object</code>: the area that is not obscured by the GUI, a rectangle such as <code>{x:0,y:0,width:640,height:320}</code></p>\n</div></div></div></div></div></div></div>","component":false,"aliases":{},"inheritdoc":null,"superclasses":[],"name":"MTVNPlayer.Events","uses":[],"mixedInto":[],"subclasses":[],"id":"class-MTVNPlayer.Events","extends":null});