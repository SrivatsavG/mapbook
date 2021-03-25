import React from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';

const GoogleMap = ({ children, ...props }) => (
    <div style={{ height: '100vh', width: '60%' }}>
        <GoogleMapReact
            bootstrapURLKeys={{
                key: 'AIzaSyAcrsGPVVpCPEYny1u1KezaO_d5ooYc3-w',
            }}
            {...props}
        >
            {children}
        </GoogleMapReact>
    </div>
);

GoogleMap.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node),
    ]),
};

GoogleMap.defaultProps = {
    children: null,
};

export default GoogleMap;