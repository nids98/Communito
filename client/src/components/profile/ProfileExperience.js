import React from 'react'
import Moment from 'react-moment'
import PropTypes from 'prop-types'

const ProfileExperience = ({
    experience: { company, title, location, current, from, to, description }
}) => {
    return (
        <div>
            <div>
                <h3 className="text-dark">{company}</h3>
                <p>
                    <Moment format='YYYY/MM/DD'>{from}</Moment> -
                    {!to ? 'Present' : <Moment format='YYYY/MM/DD'>{to}</Moment>}
                </p>
                <p><strong>Position: </strong>{title}r</p>
                <p><strong>Description: </strong>{description}</p>
            </div>
        </div>
    )
}

ProfileExperience.propTypes = {
    experience: PropTypes.array.isRequired,
}

export default ProfileExperience
