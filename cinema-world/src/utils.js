const utils = ({
    oneDigitMinutesFormatter : (minutes) => {
        return (minutes < 10 ? '0'+minutes : minutes)
    }
})

export default utils