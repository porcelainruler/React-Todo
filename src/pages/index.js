import React from 'react'
import $ from 'jquery'
import TodoList from './comps/todo-list'
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron,
    Button, Modal, ModalHeader, ModalBody,
    Form, FormGroup, Input, Label } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';



class Todo extends React.Component {

   constructor(props) {
      super(props);
      this.state = {
         username: "",
         password: "",
         isLogged: false,
         todoList: [],
         showTooltip: false,
         isNavOpen: false,
         isModalLOpen: false,
         isModalROpen: false  
      }

    this.toggleNav = this.toggleNav.bind(this) /*binding toggleNav to this*/
    this.toggleLModal = this.toggleLModal.bind(this) /*binding toggle Login Modal to this*/
    this.handleLogin = this.handleLogin.bind(this) /*binding handleLogin to this*/
    this.toggleRModal = this.toggleRModal.bind(this) /*binding toggle Register Modal to this*/
    this.handleRegister = this.handleRegister.bind(this) /*binding handleRegister to this*/
    this.toggleLogin = this.toggleLogin.bind(this)
    this.toggleRegister = this.toggleRegister.bind(this)
   }

   toggleNav() {
    this.setState({
        isNavOpen: !this.state.isNavOpen
    });
}

    toggleLModal() {
        this.setState({
            isModalLOpen: !this.state.isModalLOpen
        });
    }

    toggleRModal() {
        this.setState({
            isModalROpen: !this.state.isModalROpen
        });
    }

    handleRegister(event) {
        if(!this.state.isLogged){
            this.toggleRModal();
            this.setState({
                username : this.username.value,
                password : this.password.value,
                isLogged : true
            })
            $.ajax({
                url: '/api/register',
                type: 'post',
                dataType: 'json',
                data: {username: this.username.value, password: this.password.value},
                success: data => {
                    console.log(data);
                },
                error: err => {
                    console.log(err);
                }
            })
            alert("Username: " + this.username.value + " Password: " + this.password.value + " Remember Me: " + this.remember.checked);
            event.preventDefault();
        }
    }

    handleLogin(event) {
        if(!this.state.isLogged){
            this.toggleLModal();
            this.setState({
                username : this.username.value,
                password : this.password.value,
                isLogged : true
            })
            $.ajax({
                url: '/api/authenticate',
                type: 'post',
                dataType: 'json',
                data: {username: this.username.value, password: this.password.value},
                success: data => {
                console.log(data);
                },
                error: err => {
                console.log(err);
                }
            })
            alert("Username: " + this.username.value + " Password: " + this.password.value + " Remember Me: " + this.remember.checked);
            event.preventDefault();
        }
    }

   componentDidMount () { 
      this._getTodoList();
   }

   _getTodoList () {
      const that = this;
      $.ajax({
         url: '/getAllItems',
         type: 'get',
         dataType: 'json',
         success: data => {
            console.log(data);
            // const todoList = that.todoSort(data)
            that.setState({
               todoList: data
            });
         },
         error: err => {
            console.log(err);
         }
      });
   }

   _onNewItem (newItem) {
      const that = this;
      $.ajax({
         url: '/addItem',
         type: 'post',
         dataType: 'json',
         data: newItem,
         success: data => {
            console.log(data);
            const todoList = that.todoSort(data);
            that.setState({
               todoList
            });
         },
         error: err => {
            console.log(err);
         }
      })
   }


   _onDeleteItem (date) {
      // const that = this;
      const postData = {
         date: date
      };
      $.ajax({
         url: '/deleteItem',
         type: 'post',
         dataType: 'json',
         data: postData,
         success: data => {
            console.log(data);
            this._getTodoList();
         },
         error: err => {
            console.log(err);
         }
      })
   }

   todoSort (todoList) {
      todoList.reverse();
      return todoList;
   }

   handleSubmit(event){

      event.preventDefault();
      if(this.refs.content.value === "") {
         this.refs.content.focus();
         this.setState({
            showTooltip: true
         });
         return ;
      }

      let month = new Date().getMonth() + 1;
      let date = new Date().getDate();
      let hours = new Date().getHours();
      let minutes = new Date().getMinutes();
      let seconds = new Date().getSeconds();

      if (hours < 10) { hours += '0'; }
      if (minutes < 10) { minutes += '0'; }
      if (seconds < 10) { seconds += '0'; }

      const newItem={
         content: this.refs.content.value,
         date: month + "/" + date + " " + hours + ":" + minutes + ":" + seconds
      };

      console.log(newItem);
      this._onNewItem(newItem)
      this.refs.todoForm.reset();
      this.setState({
         showTooltip: false,
      });
   }

   toggleLogin(event) {
       if(!this.state.isLogged){
        this.setState({
            isModalLOpen: !this.state.isModalLOpen
        });
       }
   }

   toggleRegister() {
        if(!this.state.isLogged){
            this.setState({
                isModalROpen: !this.state.isModalROpen
            });
        }
    }

   render() {
      return (
          <div className="container1">
             <div className="row">
                <div className="col-5">   
                    <h2 className="header">Todo List</h2>
                </div>

                <div className="col-7"> 
                <Nav className="ml-auto" navbar style={{display: 'inline'}}>  
                    <NavItem style={{display: 'inline'}}>
                        <Button className="inbut" outline onClick={this.toggleLogin}>
                            <span className="fa fa-sign-in fa-lg"></span> {this.state.isLogged? 'Logged In' : 'Login'}
                        </Button>
                    </NavItem>
                    <NavItem style={{display: 'inline'}} className="ml-4">
                        <Button className="inbut" outline onClick={this.toggleRegister}>
                            <span className="fa fa-sign-in fa-lg"></span> {this.state.isLogged? `${this.state.username}` : 'Register'}
                        </Button>
                    </NavItem>
                </Nav>

                <Modal isOpen={this.state.isModalLOpen} toggle={this.toggleLModal}>
                    <ModalHeader toggle={this.toggleLModal}>Login</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleLogin}>
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Input type="text" id="username" name="username" 
                                    innerRef={ (input) => this.username=input } />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" name="password"
                                    innerRef={ (input) => this.password=input } />
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input type="checkbox" name="remember"
                                        innerRef={ (input) => this.remember=input } />
                                    Remember me
                                </Label>
                            </FormGroup>
                            <Button type="submit" value="submit" color="primary">Login</Button>
                        </Form>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.isModalROpen} toggle={this.toggleRModal}>
                    <ModalHeader toggle={this.toggleRModal}>Register</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleRegister}>
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Input type="text" id="username" name="username" 
                                    innerRef={ (input) => this.username=input } />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" name="password"
                                    innerRef={ (input) => this.password=input } />
                            </FormGroup>
            
                            <Button type="submit" value="submit" color="primary">Register</Button>
                        </Form>
                    </ModalBody>
                </Modal>
                </div>
                                        
             </div>
             <form className="todoForm" ref="todoForm" onSubmit={ this.handleSubmit.bind(this) }>
                <input ref="content" type="text" placeholder="Type content here..." className="todoContent" />
                { this.state.showTooltip &&
                <span className="tooltip">Content is required !</span>
                }
             </form>
             <TodoList todoList={this.state.todoList} onDeleteItem={this._onDeleteItem.bind(this)} />
          </div>
      )
   }

}



export default Todo;
