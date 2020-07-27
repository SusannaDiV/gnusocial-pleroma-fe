import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

export default ({ children, onClick, tip, btnClassName, tipClassName }) => (
    <Tooltip title={tip} className={tipClassName} placement="top">
        <button onClick={onClick} className="w3-button w3-theme-d1 ml-8">
            {children}
        </button>
    </Tooltip>
);
