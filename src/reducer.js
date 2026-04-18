// ─── Thresholds ───────────────────────────────────────────
export const CRITICAL = 5;
export const WARNING  = 15;

export function getStockLevel(qty) {
  if (qty <= CRITICAL) return 'critical';
  if (qty <= WARNING)  return 'warning';
  return 'ok';
}

// ─── Initial State ────────────────────────────────────────
export const initialState = {
  all:        [],   // master list (never mutated after load)
  filtered:   [],   // current view after filters
  filters:    { name: '', category: '', level: 'all' },
  loading:    false,
  error:      null,
};

// ─── Reducer ──────────────────────────────────────────────
export function reducer(state, action) {
  switch (action.type) {

    case 'LOAD_START':
      return { ...state, loading: true, error: null };

    case 'LOAD_DATA': {
      const all = action.payload;
      return {
        ...state,
        all,
        filtered: applyFilters(all, state.filters),
        loading: false,
      };
    }

    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'FILTER': {
      const filters = { ...state.filters, ...action.payload };
      return {
        ...state,
        filters,
        filtered: applyFilters(state.all, filters),
      };
    }

    case 'SELL_ITEM': {
      const all = state.all.map((p) =>
        p.id === action.payload
          ? { ...p, stock: Math.max(0, p.stock - 1) }
          : p
      );
      return {
        ...state,
        all,
        filtered: applyFilters(all, state.filters),
      };
    }

    case 'RESTOCK': {
      const all = state.all.map((p) =>
        p.id === action.payload.id
          ? { ...p, stock: p.stock + action.payload.qty }
          : p
      );
      return {
        ...state,
        all,
        filtered: applyFilters(all, state.filters),
      };
    }

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

// ─── Helper: apply all filters ────────────────────────────
function applyFilters(list, { name, category, level }) {
  return list.filter((p) => {
    const matchName     = p.name.toLowerCase().includes(name.toLowerCase());
    const matchCategory = category ? p.category === category : true;
    const matchLevel    =
      level === 'all'      ? true :
      level === 'critical' ? p.stock <= CRITICAL :
      level === 'warning'  ? p.stock > CRITICAL && p.stock <= WARNING :
      p.stock > WARNING;
    return matchName && matchCategory && matchLevel;
  });
}
