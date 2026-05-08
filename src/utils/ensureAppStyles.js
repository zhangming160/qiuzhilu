let injected = false;

export function ensureAppStyles() {
  if (injected || typeof document === 'undefined') {
    return;
  }

  if (document.getElementById('app-styles')) {
    injected = true;
    return;
  }

  const style = document.createElement('style');
  style.id = 'app-styles';
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `;

  document.head.appendChild(style);
  injected = true;
}
