var superagent = require('superagent');
var gui = require('nw.gui');

var Movies = React.createClass({
  getInitialState: function() {
    return {
      selected: null,
      movies: null,
      magnet: null,
    };
  },
  componentDidMount: function() {
    superagent
      .get('https://yts.ag/api/v2/list_movies.json')
      .set('Accept', 'application/json')
      .end(function(err, res){
        if (res.body.status == 'ok') {
          this.setState({movies: res.body.data.movies});
        }
      }.bind(this));
  },
  selectMovie: function(index, event) {
    this.resizeWindow(300, 500);
    this.setState({selected: index});

    var movie = this.state.movies[index];
    if (!movie.plot) {
      this.loadPlot(index);
    }
  },
  unselectMovie: function() {
    this.resizeWindow(300, 150);
    this.setState({selected: null});
  },
  resizeWindow: function(w, h) {
    window.resizeTo(w, h);
  },
  loadPlot: function(index) {
    var movies = this.state.movies;
    var movie = movies[index];
    superagent
      .get('http://www.omdbapi.com/')
      .query({i: movie.imdb_code})
      .set('Accept', 'application/json')
      .end(function(err, res){
        movie.plot = res.body.Plot;
        movies[index] = movie;
        this.setState({movies: movies});
      }.bind(this));
  },
  render: function() {
    var Content;
    if (!this.state.movies) {
      Content = <div>Cargando...</div>;
    } else {
      if (this.state.selected) {
        var movie = this.state.movies[this.state.selected];
        Content = <Movie movie={movie} unselectMovie={this.unselectMovie} />;
      } else {
        var _self = this;
        Content = (
          <div>
            <div className="toolbar">
              <ul className="buttons">
                <img src="img/tray.png" />
                <img src="img/tray.png" />
              </ul>
            </div>
            <ul id="moviesList">
              {this.state.movies.map(function(movie, i) {
                return (
                  <li key={i}><a href="#" onClick={_self.selectMovie.bind(_self, i)}>
                    <img src={movie.medium_cover_image} alt={movie.title} title={movie.title} width="75" />
                  </a></li>
                );
              })}
            </ul>
          </div>
        );
      }
    }
    return (
      <div>{Content}</div>
    );
  }
});

var Movie = React.createClass({
  getInitialState: function() {
    return {
      subtitles: null,
      torrent: 0
    };
  },
  playMovie: function() {
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

        <button onClick={this.playMovie}>Reproducir</button>
        <br />

        Rating: {movie.rating}<br />
        {movie.runtime}m - {movie.year} - {movie.genres.join(', ')}<br /><br />
        {Plot}

        <br /><br />
        <ul>
          <li>{movie.torrents[this.state.torrent].quality}</li>
        </ul>
      </div>
    );
  }
});

ReactDOM.render(
  <Movies />,
  document.getElementById('container')
);
