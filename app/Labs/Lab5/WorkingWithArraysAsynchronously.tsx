/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { ListGroup, ListGroupItem, FormControl } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import * as client from "./client";
import { FaTrash, FaPlusCircle } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { FaPencil } from "react-icons/fa6";

export default function WorkingWithArraysAsynchronously() {
  const [todos, setTodos] = useState<any[]>([]);

  const fetchTodos = async () => {
    const todos = await client.fetchTodos();
    setTodos(todos);
  };

  const createNewTodo = async () => {
    const todos = await client.createNewTodo();
    setTodos(todos);
  };

  const postNewTodo = async () => {
    const newTodo = await client.postNewTodo({ title: "New Posted Todo", completed: false });
    setTodos([...todos, newTodo]);
  };

  const removeTodo = async (todo: any) => {
    const updatedTodos = await client.removeTodo(todo);
    setTodos(updatedTodos);
  };

  const deleteTodo = async (todo: any) => {
    try {
      await client.deleteTodo(todo);
      const newTodos = todos.filter((t) => t.id !== todo.id);
      setTodos(newTodos);
    } catch (error: any) {
      console.log(error);
      setErrorMessage(error.response.data.message);
    }  };

  const editTodo = (todo: any) => {
    setTodos(todos.map((t) => t.id === todo.id ? { ...t, editing: true } : t));
  };


  const [errorMessage, setErrorMessage] = useState(null);
  const updateTodo = async (todo: any) => {
    try {
      await client.updateTodo(todo);
      setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
    }
  };


  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div id="wd-asynchronous-arrays">
      <h3>Working with Arrays Asynchronously</h3>
      {errorMessage && (<div id="wd-todo-error-message" className="alert alert-danger mb-2 mt-2">{errorMessage}</div>)}
      <h4>
        Todos
        <FaPlusCircle onClick={createNewTodo} className="text-success float-end fs-3" />
        <FaPlusCircle onClick={postNewTodo} className="text-primary float-end fs-3 me-3" />
      </h4>
      <ListGroup>
        {todos.map((todo) => (
          <ListGroupItem key={todo.id} className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={todo.completed}
                onChange={(e) => updateTodo({ ...todo, completed: e.target.checked })}
              />
              {!todo.editing ? (
                <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
                  {todo.title}
                </span>
              ) : (
                <FormControl
                  className="w-50"
                  value={todo.title}
                  onChange={(e) => setTodos(todos.map(t => t.id === todo.id ? { ...t, title: e.target.value } : t))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") updateTodo({ ...todo, editing: false });
                  }}
                  autoFocus
                />
              )}
            </div>
            <div>
              <FaPencil onClick={() => editTodo(todo)} className="text-primary me-2" />
              <TiDelete onClick={() => deleteTodo(todo)} className="text-danger fs-3" />
              <FaTrash onClick={() => removeTodo(todo)} className="text-danger me-2" />
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}
