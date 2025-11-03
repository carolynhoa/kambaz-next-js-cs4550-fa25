"use client";
import ClickEvent from "./ClickEvent";
import PassingDataOnEvent from "./PassingDataOnEvent";
import PassingFunctions from "./PassingFunctions";
import EventObject from "./EventObject";
import Counter from "./Counter";
import BooleanStateVariables from "./BooleanStateVariables";
import StringStateVariables from "./StringStateVariables";
import DateStateVariable from "./DateStateVariable";
import ObjectStateVariable from "./ObjectStateVariable";
import ArrayStateVariable from "./ArrayStateVariable";
import ParentStateComponent from "./ParentStateComponent";
import ReduxExamples from "./ReduxExamples/page";
import store from "./store";
import { Provider } from "react-redux";
import HelloRedux from "./ReduxExamples/HelloRedux";
import CounterRedux from "./ReduxExamples/CounterRedux";
import AddRedux from "./ReduxExamples/AddRedux";
import TodoList from "./ReduxExamples/todos/TodoList";
import TodoForm from "./ReduxExamples/todos/TodoForm";
import TodoItem from "./ReduxExamples/todos/TodoItem";

export default function Lab4() {
    function sayHello() {
        alert("Hello");
      }
  return(
    <Provider store={store}>
    <div id="wd-lab3">
      <h3>Lab 4</h3>
    <ClickEvent/>
    <PassingDataOnEvent/>
    <PassingFunctions theFunction={sayHello} />
    <EventObject/>
    <Counter/>
    <BooleanStateVariables/>
    <StringStateVariables/>
    <DateStateVariable/>
    <ObjectStateVariable/>
    <ArrayStateVariable/>
    <ParentStateComponent/>
    <ReduxExamples/>
    <HelloRedux/>
    <CounterRedux/>
    <AddRedux/>
    <TodoList/>
    <TodoForm/>
    <TodoItem todo={{id:1, text:"Sample Todo"}}/>
    </div>
    </Provider>
  
  );

}
