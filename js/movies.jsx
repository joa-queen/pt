var superagent = require('superagent');
var Movie = require('./movie.jsx');

var Movies = React.createClass({
  getInitialState: function() {
    return {
      selected: null,
      movies: null,
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
