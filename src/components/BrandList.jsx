import { useDispatch, useSelector } from 'react-redux';
import { fetchOffers } from '../partsSlice';
import Loader from './Loader';

export default function BrandList() {
  const dispatch = useDispatch();
  const { status, items, error, searched } = useSelector((s) => s.parts.brands);
  const selected = useSelector((s) => s.parts.offers.selected);

  if (status === 'idle') return null;
  if (status === 'loading') return <Loader text="Ищем производителей…" />;
  if (status === 'failed') return <div className="alert alert-danger">{error}</div>;
  if (items.length === 0) {
    return <div className="alert alert-warning">По артикулу «{searched}» ничего не найдено.</div>;
  }

  return (
    <section className="mb-4">
      <h2 className="h5">Выберите производителя</h2>
      <div className="d-flex flex-wrap gap-2">
        {items.map((b) => (
          <button
            key={b.brand}
            type="button"
            title={b.name}
            className={`btn ${selected === b.brand ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => dispatch(fetchOffers({ number: b.number, brand: b.brand }))}
          >
            {b.brand}
          </button>
        ))}
      </div>
    </section>
  );
}
