import AppLayout from './common/layouts/AppLayout';
import Router from './router';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Router />
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;