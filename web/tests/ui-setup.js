import { vi } from 'vitest';

window.scrollTo = vi.fn();
HTMLElement.prototype.scrollIntoView = vi.fn();
HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
