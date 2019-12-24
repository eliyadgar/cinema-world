import React from 'react';
import Button from '@material-ui/core/Button';
import getHours from 'date-fns/getHours'
import addMinutes from 'date-fns/addMinutes'
import getMinutes from 'date-fns/getMinutes'
import utils from '../utils'
import './Showtimes.css';

const openingTime = new Date(1985, 1, 1, 9, 0, 0);
const closingTime = new Date(1985, 1, 1, 23, 0, 0);

class ShowTimes extends React.Component {
    render() {
        const {duration} = this.props
        const showTimes = calculateShowTimes(duration)

        return (
                <div className='hours-list'>
                    {showTimes.map(time => {
                        return (  
                            <div className="show-time" key={time.start}> 
                            <Button variant="contained" color="primary" disabled={isTimePassed(time.start)}>
                                {`${time.start}-${time.end}`}
                            </Button>
                            </div>        
                        )
                    })}
                </div>
            )
        }
}   

const isTimePassed = (startTime) => {
    const currentDate = new Date();
    const currentHour = getHours(currentDate)
    const currentMinutes = getMinutes(currentDate)
    const startTimeArr = startTime.split(':')
    const openingHour = getHours(openingTime)
    return currentHour > startTimeArr[0] || currentHour < openingHour || (currentHour === startTimeArr[0] && currentMinutes < startTimeArr[1])
}

const calculateNumberOfShows = (duration) => {
    const operationHours = (getHours(closingTime) - getHours(openingTime)) * 60
    const numOfShows = Math.floor(operationHours / (duration+10))
    return numOfShows
}

const calculateShowTimes = (duration) => {
    const numberOfShows = calculateNumberOfShows(duration)
    const showTimes = []
    for(let i = 0; i<numberOfShows; i++) {
        const startTime = addMinutes(openingTime, 10*i)
        const start = addMinutes(startTime, duration*i)
        const end = addMinutes(startTime, duration*(i+1))

        showTimes.push({start: `${getHours(start)}:${utils.oneDigitMinutesFormatter(getMinutes(start))}`, 
                        end:`${getHours(end)}:${utils.oneDigitMinutesFormatter(getMinutes(end))}`
                    })
    }
    return showTimes
}

export default ShowTimes;
