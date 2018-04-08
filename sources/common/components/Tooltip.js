import React from 'react';
import {Tooltip as Tippy} from 'react-tippy';

const Tooltip = ({children, tooltip}) => (
      <Tippy
          html={
              <div style={{fontSize: '12px', textAlign: 'left'}}>
                   {tooltip}
              </div>
          }
          position="bottom"
          trigger="mouseenter"
      >
          {children}
      </Tippy>
);

export default Tooltip;