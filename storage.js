/**
 * Lightweight storage shim.
 *
 * The original prototype was built inside Claude.ai's artifact sandbox,
 * which exposes a `window.storage` API (get/set/delete/list) for
 * persisting data server-side per user. That API only exists inside
 * Claude.ai, so for a standalone project it's replaced here with an
 * equivalent wrapper around `localStorage`, keeping the same
 * async get/set(key, value) -> { key, value } shape used in App.jsx.
 *
 * Swap this file out for a real backend call (REST/GraphQL/Supabase/etc.)
 * when you're ready to persist progress server-side instead of per-browser.
 */

export const storage = {
  async get(key) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return null;
      return { key, value: raw };
    } catch (e) {
      return null;
    }
  },

  async set(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return { key, value };
    } catch (e) {
      return null;
    }
  },

  async delete(key) {
    try {
      window.localStorage.removeItem(key);
      return { key, deleted: true };
    } catch (e) {
      return null;
    }
  },
};
