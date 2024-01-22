interface ModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName?: string | null;
}

export const Modal: React.FC<ModalProps> = ({
  show,
  onClose,
  onConfirm,
  fileName,
}) => {
  if (!show) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "500px",
        backgroundColor: "gray",
        padding: "20px",
        zIndex: 1000,
      }}
    >
      <p>Are you sure you want to delete this image?</p>
      {fileName ? <p>File name: {fileName}</p> : <></>}
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onClose}>No</button>
    </div>
  );
};
