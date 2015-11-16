var React = require('react');

var Streaming = React.createClass({
  displayName: 'Streaming',

  componentWillMount: function () {
    var _self = this;

    var magnetLink = 'magnet:?xt=urn:btih:' + this.props.movie.torrents[0].hash;
    var engine = peerflix(magnetLink);

    engine.server.on('listening', function () {
      var myLink = 'http://localhost:' + engine.server.address().port + '/';
      _self.refs.player.src = myLink;
    });

    setInterval(function () {
      _self.setState({ downloaded: engine.swarm.downloaded });
    }, 3000);
  },
  render: function () {
    return React.createElement('div', null);
  }
});

module.exports = Streaming;