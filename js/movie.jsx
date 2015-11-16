var peerflix = require('peerflix');


var Movie = React.createClass({
  getInitialState: function() {
    return {
      downloaded: 0
    };
  },
  playMovie: function() {
    // var engine = torrentStream(
    //   'magnet:?xt=urn:btih:' + this.props.movie.torrents[0].hash,
    //   {
    //     trackers: [
    //       'udp://tracker.openbittorrent.com:80',
    //       'udp://tracker.ccc.de:80'
    //     ]
    //   }
    // );

    

    // engine.on('ready', function() {
    //   engine.files.forEach(function(file) {
    //     var extension = file.name.split('.').pop();
    //     if (extension == 'mp4') {
    //       console.log('filename:', file.name);
    //       var stream = file.createReadStream();
    //       _self.refs.player.src = stream;
    //       // stream is readable stream to containing the file content
    //     }
    //   });
    // });
  },
  render: function() {
    var movie = this.props.movie;
    var Plot;
    if (!movie.plot) {
      Plot = <div>Cargando plot...</div>;
    } else {
      Plot = <div>{movie.plot}</div>
    }

    var styles = {
      cover: {
        width: '100%'
      }
    };
    return (
      <div>
        <a href="#" onClick={this.props.unselectMovie}>Volver</a>
        <img src={movie.background_image} style={styles.cover} />
        <h1>{movie.title}</h1>
        Rating: {movie.rating}<br />
        {movie.runtime}m - {movie.year} - {movie.genres.join(', ')}<br /><br />
        {Plot}

        <br />
        Downloaded: {this.state.downloaded}
        <br /><br />
        <button onClick={this.playMovie}>Reproducir</button>
        <br />
        <video ref="player" width="100%" height="100%" controls preload="auto" autoplay >
        </video>
      </div>
    );
  }
});

module.exports = Movie;
