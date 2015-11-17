var peerflix = require('peerflix');
var url = require('url');
var BUFFERING_SIZE = 3 * 1024 * 1024;

var Player = React.createClass({
  displayName: 'Player',

  src: null,
  getInitialState: function () {
    return {
      downloaded: 0
    };
  },
  componentWillMount: function () {
    var _self = this;

    var url_parts = url.parse(window.location.href, true);
    var query = url_parts.query;
    var magnetLink = 'magnet:?xt=urn:btih:' + query.hash;
    var engine = peerflix(magnetLink);

    engine.server.on('listening', function () {
      _self.src = 'http://localhost:' + engine.server.address().port + '/';
    });

    setInterval(function () {
      _self.setState({ downloaded: engine.swarm.downloaded });
    }, 3000);
  },
  render: function () {
    var Content;
    if (this.state.downloaded > BUFFERING_SIZE) {
      Content = React.createElement(
        'video',
        { ref: 'player', width: '100%', height: '100%', controls: true, preload: 'auto', autoPlay: true, src: this.src }
      );
    } else {
      Content = React.createElement(
        'div',
        null,
        'Buffering: ',
        this.state.downloaded,
        ' / '
      );
    }
    return Content;
  }
});

ReactDOM.render(React.createElement(Player, null), document.getElementById('container'));