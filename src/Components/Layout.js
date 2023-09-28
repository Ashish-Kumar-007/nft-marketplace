import Header from './Header';

function Layout({ children }) {
  return (
    <div className="bg-gray-100">
      <Header />
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}

export default Layout;
