import { useSelector } from 'react-redux';
import Loader from './Loader';

const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

// Цену берём со складов (верхнеуровневое поле price — устаревшее).
// Показываем минимальную цену среди складов, где есть остаток.
function getPrice(item) {
  const prices = (item.warehouses || []).filter((w) => w.stock > 0).map((w) => w.price);
  return prices.length ? Math.min(...prices) : null;
}

export default function OffersTable() {
  const { status, items, error, selected } = useSelector((s) => s.parts.offers);

  if (status === 'idle') return null;
  if (status === 'loading') return <Loader text="Загружаем аналоги и предложения…" />;
  if (status === 'failed') return <div className="alert alert-danger">{error}</div>;
  if (items.length === 0) {
    return <div className="alert alert-warning">Предложений для {selected} не найдено.</div>;
  }

  return (
    <section>
      <h2 className="h5">Предложения: {selected}</h2>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Название / Производитель</th>
              <th>Артикул</th>
              <th className="text-end">Цена</th>
              <th className="text-end">Остаток</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const price = getPrice(item);
              return (
                <tr key={item.goodsID} className={item.count > 0 ? '' : 'text-secondary'}>
                  <td>
                    <div>{item.name}</div>
                    <small className="text-secondary">{item.brand}</small>{' '}
                    {item.isOriginal && <span className="badge text-bg-primary">искомая</span>}{' '}
                    {item.notRefund && <span className="badge text-bg-warning">невозвратная</span>}
                  </td>
                  <td>{item.number}</td>
                  <td className="text-end">{price === null ? '—' : money.format(price)}</td>
                  <td className="text-end">{item.count > 0 ? `${item.count} шт.` : 'нет в наличии'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
