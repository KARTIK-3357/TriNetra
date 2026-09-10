function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="gov-modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="gov-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gov-confirm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="gov-confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="gov-modal-actions">
          <button type="button" className="gov-btn ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className={`gov-btn ${tone === 'danger' ? 'danger' : 'primary'}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
