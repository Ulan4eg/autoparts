import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchBrands } from '../partsSlice';

export default function SearchForm() {
  const dispatch = useDispatch();
  const loading = useSelector((s) => s.parts.brands.status === 'loading');
  const [value, setValue] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const number = value.trim();
    if (number) dispatch(searchBrands(number));
  };

  return (
    <form onSubmit={submit} className="input-group input-group-lg mb-4">
      <input
        className="form-control"
        placeholder="Артикул детали, например 7160500039S"
        aria-label="Артикул детали"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />
      <button className="btn btn-primary" disabled={loading || !value.trim()}>
        Найти
      </button>
    </form>
  );
}
