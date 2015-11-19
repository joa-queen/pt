var superagent = require('superagent');
var gui = require('nw.gui');

var Movies = React.createClass({
  displayName: 'Movies',

  getInitialState: function () {
    return {
      selected: null,
      movies: null,
      magnet: null
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
            'div',
            { className: 'toolbar' },
            React.createElement(
              'ul',
              { className: 'buttons' },
              React.createElement('img', { src: 'img/tray.png' }),
              React.createElement('img', { src: 'img/tray.png' })
            )
          ),
          React.createElement(
            'ul',
            { id: 'moviesList' },
            this.state.movies.map(function (movie, i) {
              return React.createElement(
                'li',
                { key: i },
                React.createElement(
                  'a',
                  { href: '#', onClick: _self.selectMovie.bind(_self, i) },
                  React.createElement('img', { src: movie.medium_cover_image, alt: movie.title, title: movie.title, width: '75' })
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

var Movie = React.createClass({
  displayName: 'Movie',

  getInitialState: function () {
    return {
      subtitles: null,
      torrent: 0
    };
  },
  playMovie: function () {
    var movie = this.props.movie;

    var playerWindow = gui.Window.open('./player.html?hash=' + movie.torrents[this.state.torrent].hash, {
      "title": movie.title,
      "toolbar": false,
      "frame": true,
      "width": 800,
      "height": 500,
      "position": "center",
      "show": true,
      "show_in_taskbar": true
    });
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
      React.createElement(
        'button',
        { onClick: this.playMovie },
        'Reproducir'
      ),
      React.createElement('br', null),
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
      React.createElement('br', null),
      React.createElement(
        'ul',
        null,
        React.createElement(
          'li',
          null,
          movie.torrents[this.state.torrent].quality
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(Movies, null), document.getElementById('container'));