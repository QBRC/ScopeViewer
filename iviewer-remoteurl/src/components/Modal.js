

const Modal = ({show, whichmodal, children}) => {
    const classShow= show? "modal fade show": "mode fade";

    return (
      
        <div className={classShow} id={whichmodal} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" style={{display: show ? 'block' : 'none' }}
                        aria-hidden={show}>
                {children}
          {/* <a href="javascript:;" className="modal-close" onClick={handleClose}>
            close
          </a> */}
        </div>
   
    );
};

export default Modal;