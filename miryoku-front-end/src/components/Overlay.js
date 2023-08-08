import { Fragment, useState } from "react";

export function Overlay({ isOpen, onClose, children, customClass }) {

  return (
    <Fragment>
      {isOpen && (
        <div className={customClass ? ("overlay-" + customClass) : "overlay"}>
          <div className={customClass ? ("overlay-background-" + customClass) : "overlay-background"} onClick={onClose} />
          <div className={customClass ? ("overlay-container-" + customClass) : "overlay-container"}>
            <div className={customClass ? ("overlay-controls-" + customClass) : "overlay-controls"}>
              <button
                className={customClass ? ("overlay-close-" + customClass) : "overlay-close"}
                type="button"
                onClick={onClose}
              ><i className="fa fa-window-close" aria-hidden="true"></i>
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default Overlay;