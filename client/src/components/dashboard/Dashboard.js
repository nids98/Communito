import React, { useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCurrentProfile } from '../../actions/profile'
import Spinner from '../layout/Spinner'
import DashBoardAction from './DashboardActions'
import Experience from './Experience'
import Education from './Education'
import { deleteAccount } from '../../actions/profile'

const Dashboard = ({ getCurrentProfile, profile: { profile, loading }, auth: { user }, deleteAccount }) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile])
    return loading && profile === null ? <Spinner /> :
        <Fragment>
            <h1 className="large text-primary">Dashboard</h1>
            <p className="lead"><i className="fas fa-user"></i> Welcome, {user && user.name}</p>
            {profile !== null ?
                <Fragment>
                    <DashBoardAction />
                    <Experience experience={profile.experience} />
                    <Education education={profile.education} />
                    <div className="my-2">
                        <button onClick={() => deleteAccount()} className="btn btn-danger">
                            <i className="fas fa-user-minus"></i> Delete my account
                    </button>
                    </div>
                </Fragment> :
                (<Fragment>
                    <p>You have not yet created your profile, please create your profile</p>
                    <Link to='/create-profile' className='btn btn-primary my-1'>Create profile</Link>
                </Fragment>)
            }
        </Fragment>
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard)
