import "./ConfirmModal.css";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="confirm-overlay">
            <div className="confirm-modal">
                <p>{message}</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="confirm">Yes</button>
                    <button onClick={onCancel} className="cancel">No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;