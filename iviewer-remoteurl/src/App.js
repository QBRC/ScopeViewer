import ImageTable from './components/ImageTable';
import ImageViewer from './components/ImageViewer';
import NavigationBar from './views/NavigationBar';
import Footer  from './views/Footer';



import DataPre from './views/pages/DataPre';
import JsonPre from './views/pages/JsonPre';
import JsonValidate from './views/pages/JsonValidate';
import HomePage from './views/pages/HomePage';
import Contact from './views/pages/Contact';

import {Route, BrowserRouter } from 'react-router-dom';




function App() {


    return (

      
      <>
      <div>
        <BrowserRouter basename='/scopeviewer'>
     
          <NavigationBar />
         
          <Route path="/" exact component={HomePage}/>
          <Route path="/prepareData" exact component={DataPre}/>
          <Route path="/prepareJson"  exact component={JsonPre}/>
          <Route path="/validateJson" exact component={JsonValidate}/>
          <Route path="/imageviewer" component={ImageViewer}/>
          <Route path="/imagetable" component={ImageTable}/>
          <Route path="/contact" component={Contact}/>

          

        </BrowserRouter>
        </div> 
        <Footer/>
        
      </>
  ); 
 
}



export default App;
