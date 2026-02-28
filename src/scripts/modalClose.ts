export interface ModalCloseOptions {
  closeAttribute?: string;
}
export function setupModalCloseHandlers(
  modalId: string,
  onClose: () => void,
  options?: ModalCloseOptions,
): void {
  const modal = document.getElementById(modalId) as HTMLDivElement | null;
  if (!modal) return;

  const closeAttr = options?.closeAttribute ?? modalId;

  const closeButtons = document.querySelectorAll(
    `[data-close="${closeAttr}"]`,
  );

  const handleClose = () => {
    onClose();
  };

  // Botones con data-close
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      handleClose();
    });
  });

  // Click fuera del contenido (overlay)
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      handleClose();
    }
  });

  // Tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-active")) {
      handleClose();
    }
  });
}
