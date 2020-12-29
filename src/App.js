import './App.css';
import ResourcesPage from './Resources/ResourcesPage';

function App() {
  // useEffect(getPublications);
  return (
    <div className="App">
      <div className="content">
        <h3>Resources</h3>
        <ResourcesPage />
      </div>
    </div>
  );
}

export default App;
