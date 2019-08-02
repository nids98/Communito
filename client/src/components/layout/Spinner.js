import React, { Fragment } from 'react'
import Spinner from './spinner.gif'

export default () => (
    <Fragment>
        <img src={Spinner}
            alt='loading...'
            style={{ width: '200px', margin: 'auto', display: 'block' }}
        />
    </Fragment>
)