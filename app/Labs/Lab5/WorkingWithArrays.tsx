"use client";
import React, { useState } from "react";
import { FormControl } from "react-bootstrap";
import { FormCheck } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function WorkingWithArrays() {
  const API = `${HTTP_SERVER}/lab5/todos`;
  const [todo, setTodo] = useState({ 
    id: "1",
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-09-09",
    completed: false,
  });

  return (
    <div id="wd-working-with-arrays">
      <h3>Working with Arrays</h3>

      <h4>Retrieving Arrays</h4>
      <a id="wd-retrieve-todos" className="btn btn-primary" href={API}>
        Get Todos
      </a>
      <hr />

      <h4>Retrieving an Item from an Array by ID</h4>
      <div className="d-flex align-items-center gap-2 mb-2">
        <FormControl
          id="wd-todo-id"
          value={todo.id}
          className="w-25"
          onChange={(e) => setTodo({ ...todo, id: e.target.value })}
        />
        <a
          id="wd-retrieve-todo-by-id"
          className="btn btn-primary"
          href={`${API}/${todo.id}`}
        >
          Get Todo by ID
        </a>
      </div>
      <hr />

      <h4>Filtering Array Items</h4>
      <a
        id="wd-retrieve-completed-todos"
        className="btn btn-primary"
        href={`${API}?completed=true`}
      >
        Get Completed Todos
      </a>
      <hr />

      <h4>Creating new Items in an Array</h4>
      <a id="wd-create-todo" className="btn btn-primary" href={`${API}/create`}>
        Create Todo
      </a>
      <hr />

      <h3>Removing from an Array</h3>
<a id="wd-remove-todo" className="btn btn-primary float-end" href={`${API}/${todo.id}/delete`}>
   Remove Todo with ID = {todo.id} </a>
<FormControl defaultValue={todo.id} className="w-50" onChange={(e) => setTodo({ ...todo, id: e.target.value })}/><hr/>

<h3>Updating an Item in an Array</h3>
      <a href={`${API}/${todo.id}/title/${todo.title}`} className="btn btn-primary float-end">
        Update Todo</a>
      <FormControl defaultValue={todo.id} className="w-25 float-start me-2"
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}/>
      <FormControl defaultValue={todo.title} className="w-50 float-start"
             onChange={(e) => setTodo({ ...todo, title: e.target.value }) }/>
      <br /><br /><hr />
      <h4>Edit Todo Description</h4>
      <div className="d-flex gap-2 mb-2 align-items-center">
        <FormControl
          id="wd-todo-id-description"
          className="w-25"
          value={todo.id}
          onChange={(e) => setTodo({ ...todo, id: e.target.value })}
        />
        <FormControl
          id="wd-todo-description"
          className="w-50"
          value={todo.description}
          onChange={(e) => setTodo({ ...todo, description: e.target.value })}
        />
        <a
          id="wd-update-todo-description"
          className="btn btn-primary"
          href={`${API}/${todo.id}/description/${encodeURIComponent(todo.description)}`}
        >
          Update Description
        </a>
      </div>
      <hr />

      <h4>Edit Todo Completed</h4>
      <div className="d-flex gap-2 mb-2 align-items-center">
        <FormControl
          id="wd-todo-id-completed"
          className="w-25"
          value={todo.id}
          onChange={(e) => setTodo({ ...todo, id: e.target.value })}
        />
        <FormCheck
          id="wd-todo-completed"
          label="Completed?"
          checked={todo.completed}
          onChange={(e) => setTodo({ ...todo, completed: e.target.checked })}
        />
        <a
          id="wd-update-todo-completed"
          className="btn btn-success"
          href={`${API}/${todo.id}/completed/${todo.completed}`}
        >
          Update Completed
        </a>
      </div>
      <hr />

    </div>
  );
}
