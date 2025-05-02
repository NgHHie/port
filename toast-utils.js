// Toast notification utility functions

// Create toast container if it doesn't exist
function ensureToastContainer() {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  return container;
}

// Create and show a toast notification
function showToast(message, type = "info", duration = 3000) {
  const container = ensureToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  toast.innerHTML = `
      <div class="toast-header">
        <strong>${
          type === "success"
            ? "Thành công"
            : type === "error"
            ? "Lỗi"
            : "Thông báo"
        }</strong>
        <button type="button" class="toast-close">&times;</button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    `;

  container.appendChild(toast);

  // Close button handler
  const closeBtn = toast.querySelector(".toast-close");
  closeBtn.addEventListener("click", () => {
    hideToast(toast);
  });

  // Auto-hide after duration
  setTimeout(() => {
    hideToast(toast);
  }, duration);

  return toast;
}

// Hide a toast notification with animation
function hideToast(toast) {
  if (toast.classList.contains("hiding")) return;

  toast.classList.add("hiding");

  toast.addEventListener("animationend", () => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  });
}

// Show success toast
function showSuccessToast(message, duration = 3000) {
  return showToast(message, "success", duration);
}

// Show error toast
function showErrorToast(message, duration = 4000) {
  return showToast(message, "error", duration);
}

// Show info toast
function showInfoToast(message, duration = 3000) {
  return showToast(message, "info", duration);
}
