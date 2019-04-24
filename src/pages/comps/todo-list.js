import React from 'react';
import TodoItem from './todo-item';

class TodoList extends React.Component {

   render() {
      const todoList = this.props.todoList;
      const todoItems = todoList.map((item,index) => {
         return (
             <TodoItem
                 key={index}
                 content={item.content}
                 date={item.date}
                 onDeleteItem={this.props.onDeleteItem}
             />
         )
      });

      return (
          <div>
             { todoItems }
          </div>
      )
   }
}

export default TodoList;