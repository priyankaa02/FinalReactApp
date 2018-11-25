import React, { Component } from 'react';
import './App.css';
import { Jumbotron,Alert,Button,Card, CardImg, CardText, CardBody,
  CardTitle, Form,Col,Label,Row, FormGroup,Input,Modal, ModalHeader, ModalBody  } from 'reactstrap';
import MaterialIcon from 'material-icons-react';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username:'',
      userInfo:[],
      loading: false,
      isData: false,
      data: '',
      modal: false,
      modal2: false,
      email: '',
      password: '',
      buttonLabel: 'Login',
      isLoggedIn: false,
      keyword: '',
      alertItem: '',
      visible: false,
      search_keyword: ''
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.addKeyword = this.addKeyword.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggle2 = this.toggle2.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  toggle() {
    if(this.state.buttonLabel == "Login")
    {
   this.setState({
     modal: !this.state.modal
   });
  }
   else
   {
    let apiBaseUrl = `http://localhost:3000/admin/logout`;
    let that = this;
    axios.get(apiBaseUrl)
    .then(function (response) {
      if(response.status === 200){
        console.log(response);
        localStorage.clear();
        localStorage.setItem("token",null);
        that.setState({
          buttonLabel : 'Login',
          modal: that.state.modal,
          alertItem: 'Logout Successfully!!',
          visible: true,
          isLoggedIn: false
        })
      }
      else if(response.status === 404){
        console.log("user not found");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
   }
 }

 toggle2()
 {
  this.setState({
    modal2: !this.state.modal2
  });
 }

 onDismiss() {
  this.setState({ visible: false });
}

 addKeyword(event){
  let apiBaseUrl = `http://localhost:3000/keyword/add_keyword`;
  let payload = {
        token : localStorage.getItem("token"),
        keyword : this.state.keyword
  }
  let that = this;
  axios.post(apiBaseUrl,payload)
  .then(function (response) {
    if(response.status === 200){
      console.log(response);
      that.setState({
        modal2: !that.state.modal2,
        alertItem: 'Keyword Added',
        visible: true
      })
    }
    else if(response.status === 404){
      console.log("keyword not found");
    }
  })
  .catch(function (error) {
    console.log(error);
  });
 }

  handleLogin(event) {
    let apiBaseUrl = `http://localhost:3000/admin/login`;
    let payload = {
          email : this.state.email,
          password : this.state.password
    }
    let that = this;
    axios.post(apiBaseUrl,payload)
    .then(function (response) {
      if(response.status === 200){
        console.log(response);
        localStorage.clear();
        localStorage.setItem("token",response.data.token);
        that.setState({
          buttonLabel : 'Logout',
          modal: !that.state.modal,
          isLoggedIn: true,
          alertItem: 'Login Successfully!!',
          visible: true
        })
      }
      else if(response.status === 404){
        console.log("user not found");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleClick(event) {
    let apiBaseUrl = `http://localhost:3000/keyword/search`;
    let payload = {
         keyword : this.state.search_keyword
    }
    let that = this;
    axios.post(apiBaseUrl,payload)
    .then(function (response) {
      if(response.status === 200){
          console.log("data",response);
        that.setState({
          userInfo: response.data[0].data,
          loading: false,
          isData: true
        })

        console.log(that.state.userInfo);
      }
      else if(response.status === 404){
        console.log("data not found");
        that.setState({
          isData : false,
          loading: false,
          data: 'data not found'
        })
      }
    })
    .catch(function (error) {
      console.log(error);
      that.setState({
        isData : false,
        loading: false,
        data: 'data not found'
      })
    });
  }


  render() {
    let searchData = this.state.userInfo.map((info) =>
         <Card>
             <CardImg src={info.company_logo} />
            <CardBody >
                  <CardTitle>Company Name: <span>{info.company}</span></CardTitle>
                  <CardTitle>Url: <a href={info.company_url}>{info.company_url}</a></CardTitle>
                  <CardText>Location: <span>{info.location}</span></CardText>
                  <CardText>Type: <span>{info.type}</span></CardText>
                  <CardText>Title: <span>{info.title}</span></CardText>
            </CardBody>
        </Card>
            );
    return (
       <div>
          <div>
              <div className='col-4'>
              <Alert color="primary" isOpen={this.state.visible} toggle={this.onDismiss}>
                {this.state.alertItem}
                </Alert>
              </div>
          </div>
        
          <div class="jumbotron">
          <div className='keyword-button'>
                {this.state.isLoggedIn ? (
                <Button className="keyword-button" onClick={this.toggle2}>Add Keyword</Button>) : ( '' )}
               </div>
               <Button className="login-button" color="danger" onClick={this.toggle}>{this.state.buttonLabel}</Button>
                  <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                  <ModalHeader toggle={this.toggle}>Login For Admin</ModalHeader>
                  <ModalBody>
                    <Form >
                    <FormGroup>
                    <Label for="email" hidden>Email</Label>
                    <Input type="email" name="email" id="email" placeholder="Email" 
                    onChange = {(event) => this.setState({email: event.target.value})} />
                    </FormGroup>
                    {' '}
                    <FormGroup>
                    <Label for="password" hidden>Password</Label>
                    <Input type="password" name="password" id="password" placeholder="Password" 
                    onChange = {(event) => this.setState({password: event.target.value})} />
                    </FormGroup>
                    {' '}
                    <Button onClick={(event) => this.handleLogin(event)}>Submit</Button>
                    </Form>
                  </ModalBody>
              </Modal>
                  <Modal isOpen={this.state.modal2} toggle={this.toggle2} className={this.props.className}>
                <ModalHeader toggle={this.toggle2}>Add Keyword</ModalHeader>
              <ModalBody>
                {this.state.isKeywordAdded ?
                 <p>{this.state.keyword_response}</p> 
                 :
              <Form >
                <FormGroup>
                <Label for="keyword" hidden>Enter Keyword</Label>
                <Input type="text" name="keyword" id="keyword" placeholder="Keyword" 
                onChange = {(event) => this.setState({keyword: event.target.value})} />
                </FormGroup>
                {' '}
                <Button onClick={(event) => this.addKeyword(event)}>Submit</Button>
              </Form>
               }
           </ModalBody>
            </Modal>
           
            <div className='col-6'>
                    <Form >
                    <FormGroup>
                      <MaterialIcon icon="search" size="40%"/>
                          <Input type="text" className = "icon" name="search_keyword" id="search_keyword"
                          placeholder="Search for a job" bsSize="lg" onChange = {(event) =>
                            this.setState({search_keyword: event.target.value})}/>
                      </FormGroup>
                              <div className='sweet-loading'>
                                <ClipLoader
                                sizeUnit={"px"}
                                size={50}
                                color={'#123abc'}
                                loading={this.state.loading}
                                />
                            </div>
                            <Button outline className="search-button" color="primary" size="lg"  
                            onClick={(event) => this.handleClick(event)}>Search</Button>
                    </Form>
                        <br/><br/>
                  </div>
            <div className='col-2'></div>
            </div>
            <div className="container ">
                <div className="col-3"></div>  
                <div className="col-6">
                        {this.state.isData ?
                          <Col md={7}>
                          {searchData}
                          </Col>
                        : <h3>{this.state.data}</h3>
                      }
              </div>
              <div className="col-3"></div>  
    </div>
    </div>
    
    );
  }
}

export default App;
