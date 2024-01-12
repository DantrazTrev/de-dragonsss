import React from 'react';
import ContainerTree from './components/ContainerTree';

const App = () => {
  // Example data for the container tree
  const treeData = {
    name: 'Google',
    elements:[
      {
        name:'Main Site',
        image:'https://steelbluemedia.com/wp-content/uploads/2019/06/new-google-favicon-512.png'
      },
    
    ],
    children: [
      {
        name: 'California',
       elements:[
          {
            name:'S2F39'
          },
          {
            name:'A8DFS'
          }
       ]
      },
      {
        name: 'New York',
        elements:[
          {
            name:'JFSD3'
          },
          {
            name:'FDSF3'
          }
       ]
      },
      {
        name: 'Virginia',
        elements:[
          {
            name:'JFSD3'
          },
          {
            name:'FDSF3'
          }
        ],
      },
     
      
    ],
  };

  return (
    <div className='tree'>
      <ContainerTree data={treeData} />
    </div>
  );
};

export default App;
