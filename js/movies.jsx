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
  playMovie: function() {
    var movie = this.state.movies[this.state.selected];

    var playerWindow = gui.Window.open('../player.html?hash=' + movie.torrents[0].hash, {
      "title": movie.title,
      "toolbar": false,
      "frame": false,
      "width": 800,
      "height": 500,
      "position": "center",
      "show": true
    });
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
      if (!this.state.magnet) {
        if (this.state.selected) {
          var movie = this.state.movies[this.state.selected];
          Content = <Movie movie={movie} unselectMovie={this.unselectMovie} playMovie={this.playMovie} />;
        } else {
          var _self = this;
          Content = (
            <div>
              <h2>Movies</h2>
              <ul>
                {this.state.movies.map(function(movie, i) {
                  return (
                    <li key={i}><a href="#" onClick={_self.selectMovie.bind(_self, i)}>{movie.title}</a></li>
                  );
                })}
              </ul>
            </div>
          );
        }
      } else {
        Content = <Streaming magnet={this.state.magnet} />;
      }
    }
    return (
      <div>{Content}</div>
    );
  }
});

ReactDOM.render(
  <Movies />,
  document.getElementById('container')
);
