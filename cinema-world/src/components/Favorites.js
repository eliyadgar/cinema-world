import React from 'react';
import Movie from './Movie'
import '../App.css';

class Favorites extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      favorites: {},
    }
  }
  
  render() {
    const {favorites, handleFavorites} = this.props
    const favoriteMoviesArr = Object.values(favorites)
    
    return (
        <div>
            { favoriteMoviesArr.length === 0 ?
              <div>No favorites were were added</div> :
              <div>
                <div>favorites: </div>    
                <div className="movies-list">
                    { Object.values(favorites).slice(0,5).map((movie) => { 
                        return (
                            <Movie 
                                isFavorite={favorites[movie.imdbID]}
                                movie={movie} 
                                key={movie.imdbID} 
                                handleFavorites={handleFavorites}>
                            </Movie>
                            )
                        })
                    }
                </div>     
              </div>
            }
        </div>
        )
    }   
}


export default Favorites;
