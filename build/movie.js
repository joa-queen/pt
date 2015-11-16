var peerflix = require('peerflix');

var Movie = React.createClass({
  displayName: 'Movie',

  getInitialState: function () {
    return {
      downloaded: 0
    };
  },
  playMovie: function () {
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
  render: function () {
    var movie = this.props.movie;
    var Plot;
    if (!movie.plot) {
      Plot = React.createElement(
        'div',
        null,
        'Cargando plot...'
      );
    } else {
      Plot = React.createElement(
        'div',
        null,
        movie.plot
      );
    }

    var styles = {
      cover: {
        width: '100%'
      }
    };
    return React.createElement(
      'div',
      null,
      React.createElement(
        'a',
        { href: '#', onClick: this.props.unselectMovie },
        'Volver'
      ),
      React.createElement('img', { src: movie.background_image, style: styles.cover }),
      React.createElement(
        'h1',
        null,
        movie.title
      ),
      'Rating: ',
      movie.rating,
      React.createElement('br', null),
      movie.runtime,
      'm - ',
      movie.year,
      ' - ',
      movie.genres.join(', '),
      React.createElement('br', null),
      React.createElement('br', null),
      Plot,
      React.createElement('br', null),
      'Downloaded: ',
      this.state.downloaded,
      React.createElement('br', null),
      React.createElement('br', null),
      React.createElement(
        'button',
        { onClick: this.playMovie },
        'Reproducir'
      ),
      React.createElement('br', null),
      React.createElement('video', { ref: 'player', width: '100%', height: '100%', controls: true, preload: 'auto', autoplay: true })
    );
  }
});

module.exports = Movie;