/* eslint-disable no-unused-expressions */

import React, {Component} from 'react';
import axios from 'axios'

class App extends Component {
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
  };

  componentDidMount(){
    this.getDataFromDb();
    if(!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({intervalIsSet: interval});
    }
  }
  componentWillUnmount() {
    if(this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({intervalIsSet: null});
    }
  }

  getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => this.setState({data: res.data}));
  }

  putDataToDB = (message) => {
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 1;
    while(currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }
    
    axios.post('http://localhost:3001/api/putData', {
      id: idToBeAdded,
      message: message,
    });
  };

  deleteFromDB = (idToDelete) => {
    parseInt(idToDelete);
    
    let objectToUpdate = null;
    this.state.data.forEach((dat) => {

      if(dat.id == idToDelete) {
        objectToUpdate = dat._id;
      }
    });
    console.log(objectToUpdate);
    axios.delete('http://localhost:3001/api/deleteData', {
      data: {
        id: objectToUpdate,
      }
    });
  };

  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    parseInt(idToUpdate);
    this.state.data.forEach((dat) => {
      if(dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });
    axios.post('http://localhost:3001/api/updateData', {
      id: objIdToUpdate,
      update: {message: updateToApply},
    });
  };
// eslint-disable-next-line
  render() {
    const {data} = this.state;
    console.log(data);
    return (
      <div>
        <ul>
          {
            data.map((dat) => {
             return  <li style={{padding: '10px'}} key={dat._id}>
                <span style={{color: 'gray'}}> id:</span> {dat.id} <br />
                <span style={{color: 'gray'}}> data:</span>{dat.message}
              </li>
            })
          }
        </ul>
        <div style={{ padding: '10px' }}>
          <input
            type="text"
            onChange={(e) => this.setState({ message: e.target.value })}
            placeholder="add something in the database"
            style={{ width: '200px' }}
          />
          <button onClick={() => this.putDataToDB(this.state.message)}>
            ADD
          </button>
        </div>
        <div style={{padding: '10px'}}>
          <input 
            type="text"
            style={{width: '200px'}}
            onChange={(e)=> this.setState({idToDelete: e.target.value})}
            placeholder="Put ID of item to delete here"/>
          <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
          </button>
        </div>
        <div style={{padding: '10px'}}>
          <input 
            type="text"
            style={{width: '200px'}}
            onChange={(e) => this.setState({idToUpdate: e.target.value})}
            placeholder="ID of item to update here" />
          <input 
            type='text'
            style={{width: '200px'}}
            onChange={(e) => this.setState({updateToApply: e.target.value})}
            placeholder="Put new value of the item here"
          />
          <button 
            onClick={(e) => this.updateDB(this.state.idToUpdate, this.state.updateToApply)}
          >
            UPDATE
          </button>
        </div>
      </div>
    );
  }
}

export default App;