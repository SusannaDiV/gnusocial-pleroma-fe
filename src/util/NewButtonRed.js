import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

export default ({ children, onClick, tip, color, tipClassName }) => (
    <Tooltip title={tip} className={tipClassName} placement="top">
        <button onClick={onClick} className={color ? 'w3-button w3-theme' : 'w3-button w3-theme-d2'}>
            {children}
        </button>
    </Tooltip>
);
