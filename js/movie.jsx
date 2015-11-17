var Movie = React.createClass({
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

        <br /><br /><br />
        <button onClick={this.props.playMovie}>Reproducir</button>
      </div>
    );
  }
});
