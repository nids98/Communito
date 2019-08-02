import React from 'react'
import Moment from 'react-moment'
import PropTypes from 'prop-types'

const ProfileEducation = ({
    education: { school, degree, fieldofstudy, current, from, to, description }
}) => {
    return (
        <div>
            <div>
                <h3 className="text-dark">{degree}</h3>
                <p>
                    <Moment format='YYYY/MM/DD'>{from}</Moment> -
                    {!to ? 'Present' : <Moment format='YYYY/MM/DD'>{to}</Moment>}
                </p>
                <p><strong>Degree: </strong>{degree}r</p>
                <p><strong>Field of Study: </strong>{fieldofstudy}r</p>
                <p><strong>Description: </strong>{description}</p>
            </div>
        </div>
    )
}

ProfileEducation.propTypes = {
    education: PropTypes.array.isRequired,
}

export default ProfileEducation
