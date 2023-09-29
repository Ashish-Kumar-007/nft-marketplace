import Header from './Header';

function Layout({ children }) {
  return (
    <div>
      <Header />
      <main className="container mx-auto p-4 mb-5">{children}</main>
    </div>
  );
}

export default Layout;
