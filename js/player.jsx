var peerflix = require('peerflix');
var url = require('url');
var BUFFERING_SIZE = 3 * 1024 * 1024;

var Player = React.createClass({
  src: null,
  getInitialState: function() {
    return {
      downloaded: 0
    };
  },
  componentWillMount: function() {
    var _self = this;

    var url_parts = url.parse(request.url, true);
    var hash = url_parts.hash;
    var magnetLink = 'magnet:?xt=urn:btih:' + hash;
    var engine = peerflix(magnetLink);

    engine.server.on('listening', function() {
      this.src = 'http://localhost:' + engine.server.address().port + '/';
    });

    setInterval(function() {
      _self.setState({downloaded: engine.swarm.downloaded});
    }, 3000);
  },
  render: function() {
    var Content;
    if (this.state.downloaded > BUFFERING_SIZE) {
      Content = (
        <video ref="player" width="100%" height="100%" controls preload="auto" autoPlay >
          <source src={this.src} type="video/mp4" />
        </video>
      );
    } else {
      Content = <div>Buffering: {this.state.downloaded} / </div>;
    }
    return Content;
  }
});

ReactDOM.render(
  <Player />,
  document.getElementById('container')
);
