import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPrices } from './api';

// Этап 1: только номер -> список производителей
export const searchBrands = createAsyncThunk(
  'parts/searchBrands',
  async (number, { rejectWithValue }) => {
    try {
      const goods = await fetchPrices({ number });
      // «Не найдено» = элемент с пустым brand/number; убираем такие записи
      const found = goods.filter((g) => g.brand && g.number);
      // По одному элементу на бренд
      const byBrand = new Map();
      found.forEach((g) => {
        if (!byBrand.has(g.brand)) byBrand.set(g.brand, { brand: g.brand, number: g.number, name: g.name });
      });
      return [...byBrand.values()];
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

// Этап 2: номер + бренд + analogues=on -> искомая деталь и аналоги
export const fetchOffers = createAsyncThunk(
  'parts/fetchOffers',
  async ({ number, brand }, { rejectWithValue }) => {
    try {
      const goods = await fetchPrices({ number, brand, analogues: 'on' });
      const items = [];
      goods.forEach((g) => {
        if (!g.brand || !g.number) return;
        items.push({ ...g, isOriginal: true });
        (g.analogues || []).forEach((a) => items.push({ ...a, isOriginal: false }));
      });
      return items;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const initialState = {
  brands: { status: 'idle', items: [], error: null, searched: '' },
  offers: { status: 'idle', items: [], error: null, selected: null },
};

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(searchBrands.pending, (state, action) => {
        state.brands = { status: 'loading', items: [], error: null, searched: action.meta.arg };
        state.offers = initialState.offers; // новый поиск сбрасывает этап 2
      })
      .addCase(searchBrands.fulfilled, (state, action) => {
        state.brands.status = 'succeeded';
        state.brands.items = action.payload;
      })
      .addCase(searchBrands.rejected, (state, action) => {
        state.brands.status = 'failed';
        state.brands.error = action.payload || 'Неизвестная ошибка';
      })
      .addCase(fetchOffers.pending, (state, action) => {
        state.offers = { status: 'loading', items: [], error: null, selected: action.meta.arg.brand };
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.offers.status = 'succeeded';
        state.offers.items = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.offers.status = 'failed';
        state.offers.error = action.payload || 'Неизвестная ошибка';
      });
  },
});

export default partsSlice.reducer;
