import React from "react";
import PropTypes from "prop-types"

const CorporateClientLocation = props => {

    let { location, changeLocation } = props

    const handleChangeLocation = () => changeLocation(true)

    return (
        <div>
            <div className="row d-inline">
                <span className="float-left">Your Location:</span>
                <button onClick={handleChangeLocation} className="badge badge-secondary float-right">Change Location</button>
            </div>
            <div className="pt-2">
                <span className="row">{`${location.lineOne} ${location.lineTwo}`}</span>
                <span className="row">{`${location.city}, ${location.state && (location.state.code || "")} ${location.zip}`} </span>
            </div>
        </div>
    )
}

CorporateClientLocation.propTypes = {
    location: PropTypes.shape({
        locationTypeId: PropTypes.number,
        lineOne: PropTypes.string,
        lineTwo: PropTypes.string,
        city: PropTypes.string,
        zip: PropTypes.string,
        state: PropTypes.shape({
            code: PropTypes.string
        })
    }),
    changeLocation: PropTypes.func
}

export default CorporateClientLocation;
