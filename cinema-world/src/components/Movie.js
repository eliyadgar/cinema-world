import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import consts from '../consts'
import './Movie.css';
import ShowTimes from './Showtimes';


class Movie extends React.Component {
    constructor (props) {

        super(props)
        this.state = {
            duration: '', 
            plot: '',
            liked: this.props.isFavorite,
        }
    }

    componentDidMount() {
        const {imdbID} = this.props.movie
        const urlForSearch = `${consts.IMDB_BASE_URL+consts.TOKEN}&i=${imdbID}`
        fetch(urlForSearch)
            .then((res) => res.json())
            .then(data => {
                const duration = parseDurationToMinutes(data.Runtime)
                this.setState({duration, plot: data.Plot})
        })
    }

    handleLikedClicked = (liked) => {
        const {handleFavorites, movie} = this.props
        handleFavorites(movie, liked)
        this.setState({liked})
    }


    render() {
        const {movie, isFavorite} = this.props
        const {duration, plot, liked} = this.state
        const hoursFormat = convertToHoursFormat(duration)
        const hoursFormatStr = hoursFormat === "N/A" ? 'Duration is not available' : `${hoursFormat} hours`
        return (
            <Card className="card">
                <IconButton className="iconButton2" aria-label="like" onClick={()=>this.handleLikedClicked(!isFavorite)}>
                {!!isFavorite ? 
                    <FavoriteIcon color="primary"/> :
                    <FavoriteBorderIcon color="primary"/> 

                }
            </IconButton>
                <CardHeader
                className="movie-header"
                title={movie.Title}
                subheader={hoursFormatStr}
                />
                <CardMedia
                className="media"
                image={movie.Poster !== "N/A" ? movie.Poster : "https://www.keh.com/media/wysiwyg/placeholder.png"}
                title="Paella dish"
                />
                <CardContent>
                <Typography className="movie-description" variant="body2" color="textSecondary" component="p">
                    {plot !== "N/A" ? plot : 'Description is not available'}
                </Typography>
                <ShowTimes duration={duration}/>
                </CardContent>
            </Card>
            )
        }
}   

const convertToHoursFormat = (totalMinutes) => {
    if (totalMinutes === 'N/A') {
        return "N/A"
    }
    const hours = Math.floor(totalMinutes / 60);          
    const minutes = totalMinutes % 60;
    const minutesStr = minutes < 10 ? '0'+minutes : minutes
    return `${hours}:${minutesStr}`
}

const parseDurationToMinutes = (duration) => {
    return duration === 'N/A' ? duration : parseInt(duration.split(' ')[0])

}
export default Movie;
