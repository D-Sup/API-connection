import  { useState } from 'react';
import DisplayWeather from './Components/DisplayWeather/DisplayWeather.jsx';
import './index.css'

function App() {
  const [inptLocation, setInptLocation] = useState('');
  const [searchPage, setSearchPage] = useState(true);

  function turnBack() {
    setSearchPage(true);
  }

  function submitForm(event) {
    event.preventDefault();
    setSearchPage(false);
  }
  return (
    <div className="container">
      <div className="wrapper">
        {searchPage ? (
            <form onSubmit={submitForm}>
              <input type="text" placeholder="Seoul" value={inptLocation} onChange={event => setInptLocation(event.target.value)} />
              <button type="submit">🔍</button>
            </form>
        ) : (
          <DisplayWeather inptLocation={inptLocation} turnBack={turnBack}/>
        )}
      </div>
</div>
    
  );
}

export default App;
