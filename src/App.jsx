import SearchForm from './components/SearchForm';
import BrandList from './components/BrandList';
import OffersTable from './components/OffersTable';

export default function App() {
  return (
    <main className="container py-4" style={{ maxWidth: 960 }}>
      <h1 className="h3 mb-4">Поиск автозапчастей</h1>
      <SearchForm />
      <BrandList />
      <OffersTable />
    </main>
  );
}
