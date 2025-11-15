"use client";
import React, { useState } from "react";
import { FormControl, FormCheck } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });

  const [moduleObj, setModuleObj] = useState({
    id: "M101",
    name: "Intro to REST APIs",
    description: "Learning how to create & fetch REST routes",
    course: "CS4550",
  });

  const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;
  const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`;

  return (
    <div>
      <h3 id="wd-working-with-objects">Working With Objects</h3>

      <h4>Modify Assignment Title</h4>
      <a
        id="wd-update-assignment-title"
        className="btn btn-primary float-end"
        href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}
      >
        Update Title
      </a>

      <FormControl
        className="w-75"
        id="wd-assignment-title"
        defaultValue={assignment.title}
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
      />

      <hr />

      <h4>Modify Assignment Score</h4>
      <a
        id="wd-update-assignment-score"
        className="btn btn-success float-end"
        href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}
      >
        Update Score
      </a>

      <FormControl
        className="w-25"
        type="number"
        id="wd-assignment-score"
        defaultValue={assignment.score}
        onChange={(e) =>
          setAssignment({ ...assignment, score: Number(e.target.value) })
        }
      />

      <hr />

      <h4>Modify Assignment Completed</h4>
      <a
        id="wd-update-assignment-completed"
        className="btn btn-warning float-end"
        href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}
      >
        Update Completed
      </a>

      <FormCheck
        id="wd-assignment-completed"
        type="checkbox"
        checked={assignment.completed}
        onChange={(e) =>
          setAssignment({ ...assignment, completed: e.target.checked })
        }
        label="Completed?"
      />

      <hr />

      <h4>Module Object</h4>

      <a
        className="btn btn-secondary me-2"
        id="wd-get-module"
        href={`${MODULE_API_URL}`}
      >
        Get Module
      </a>

      <a
        className="btn btn-outline-secondary"
        id="wd-get-module-name"
        href={`${MODULE_API_URL}/name`}
      >
        Get Module Name
      </a>

      <hr />

      <h4>Modify Module Name</h4>
      <a
        id="wd-update-module-name"
        className="btn btn-primary float-end"
        href={`${MODULE_API_URL}/name/${moduleObj.name}`}
      >
        Update Module Name
      </a>

      <FormControl
        className="w-75"
        id="wd-module-name"
        defaultValue={moduleObj.name}
        onChange={(e) => setModuleObj({ ...moduleObj, name: e.target.value })}
      />

      <hr />

      <h4>Modify Module Description</h4>
      <a
        id="wd-update-module-description"
        className="btn btn-info float-end"
        href={`${MODULE_API_URL}/description/${moduleObj.description}`}
      >
        Update Description
      </a>

      <FormControl
        className="w-75"
        id="wd-module-description"
        defaultValue={moduleObj.description}
        onChange={(e) =>
          setModuleObj({ ...moduleObj, description: e.target.value })
        }
      />

      <hr />
    </div>
  );
}
