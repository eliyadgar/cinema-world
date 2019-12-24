import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Movie from './components/Movie'
import debounce from 'lodash/debounce'
import getTime from 'date-fns/getTime'

import consts from './consts.js'
import './App.css';

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchTerm: '', 
      movies: {},
    }
  }

  searchAMovie = (searchTerm) => {
    this.setState({searchTerm: searchTerm})
    if(searchTerm.length < 3) {
      this.setState({movies: {}})
    }
    if (searchTerm.length >= 3) {
      if (this.state.movies[searchTerm] 
        && this.compareTimes(this.state.movies[searchTerm].lastUpdatedDate) < (1000 * 60 * 60)  ) {
          return 
      } else {
        const urlForSearch = `${consts.IMDB_BASE_URL+consts.TOKEN}&s=${searchTerm}`
        this.fetchUrl(urlForSearch, searchTerm)
      }
    }
  }

  compareTimes = (lastUpdatedDate) => {
    const currentTime = new Date()
    return (getTime(currentTime) - lastUpdatedDate)
  }

  fetchUrl = debounce((urlForSerach, searchTerm) => {
    try {
      fetch(urlForSerach)
        .then((res) => {
          if (res.status !== 200) {
            alert('There was a connection error, please try again')
          }
          if (res.statusText === "OK") {
            return res.json()
            .then(data => {
              this.setState(
                {movies: 
                  {...this.state.movies, 
                    [searchTerm]: 
                    {lastUpdatedDate: getTime(new Date()), 
                      moviesList: data,
                    }
                  }
                })
            })}
          })
        
    } catch(e) {
      console.log(e)
    }

  }, 500)
  
  
  render() {
    const {movies, searchTerm} = this.state
    const moviesResponse = movies[searchTerm] && movies[searchTerm].moviesList.Response
    const moviesResults = movies[searchTerm] && movies[searchTerm].moviesList.Search
    
    return (
    <div className="App">
      <header className="App-header">

        <h1>CINEMA WORLD</h1>
        <h2>Opening Hours</h2>
        <div className="opening-hours">
          <div className="hour">9:00</div>
          <div>-</div>
          <div className="hour">23:00</div>
        </div>
        <form noValidate autoComplete="off">
          <FormControl className="root">
            <InputLabel color="primary" htmlFor="component-simple">Serach</InputLabel>
            <Input fullWidth={true} id="component-simple" value={this.state.searchTerm} onChange={(e) => this.searchAMovie(e.target.value)} />
            <IconButton className="iconButton" aria-label="search" onClick={()=> this.searchAMovie(this.state.searchTerm)}>
              <SearchIcon />
            </IconButton>
          </FormControl>
        </form>
        { moviesResponse === 'False' ?
          <div>No movies were found</div> :
          <div className="movies-list">
            { moviesResults && moviesResults.slice(0,5).map((movie, index) => { 
                return (
                  <Movie movie={movie} key={movie.imdbID}></Movie>
                  )
            })
            }
          </div>
        }
      </header>
    </div>
    )}
}


export default App;
