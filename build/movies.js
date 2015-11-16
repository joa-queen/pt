var superagent = require('superagent');

var Movies = React.createClass({
  displayName: 'Movies',

  getInitialState: function () {
    return {
      selected: null,
      movies: null
    };
  },
  componentDidMount: function () {
    superagent.get('https://yts.ag/api/v2/list_movies.json').set('Accept', 'application/json').end((function (err, res) {
      if (res.body.status == 'ok') {
        this.setState({ movies: res.body.data.movies });
      }
    }).bind(this));
  },
  selectMovie: function (index, event) {
    this.resizeWindow(300, 500);
    this.setState({ selected: index });

    var movie = this.state.movies[index];
    if (!movie.plot) {
      this.loadPlot(index);
    }
  },
  unselectMovie: function () {
    this.resizeWindow(300, 150);
    this.setState({ selected: null });
  },
  resizeWindow: function (w, h) {
    window.resizeTo(w, h);
  },
  loadPlot: function (index) {
    var movies = this.state.movies;
    var movie = movies[index];
    superagent.get('http://www.omdbapi.com/').query({ i: movie.imdb_code }).set('Accept', 'application/json').end((function (err, res) {
      movie.plot = res.body.Plot;
      movies[index] = movie;
      this.setState({ movies: movies });
    }).bind(this));
  },
  render: function () {
    var Content;
    if (!this.state.movies) {
      Content = React.createElement(
        'div',
        null,
        'Cargando...'
      );
    } else {
      if (this.state.selected) {
        var movie = this.state.movies[this.state.selected];
        Content = React.createElement(Movie, { movie: movie, unselectMovie: this.unselectMovie });
      } else {
        var _self = this;
        Content = React.createElement(
          'div',
          null,
          React.createElement(
            'h2',
            null,
            'Movies'
          ),
          React.createElement(
            'ul',
            null,
            this.state.movies.map(function (movie, i) {
              return React.createElement(
                'li',
                { key: i },
                React.createElement(
                  'a',
                  { href: '#', onClick: _self.selectMovie.bind(_self, i) },
                  movie.title
                )
              );
            })
          )
        );
      }
    }
    return React.createElement(
      'div',
      null,
      Content
    );
  }
});

/** movie.js **/
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

    var _self = this;

    var magnetLink = 'magnet:?xt=urn:btih:' + this.props.movie.torrents[0].hash;
    var engine = peerflix(magnetLink);

    engine.server.on('listening', function () {
      var myLink = 'http://localhost:' + engine.server.address().port + '/';
      console.log(myLink);
      _self.refs.player.src = myLink;
      _self.refs.player.type = 'video/mp4';
    });

    setInterval(function () {
      _self.setState({ downloaded: engine.swarm.downloaded });
    }, 3000);

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
      React.createElement('video', { ref: 'player', width: '100%', height: '100%', controls: true, preload: 'auto' })
    );
  }
});

ReactDOM.render(React.createElement(Movies, null), document.getElementById('container'));
