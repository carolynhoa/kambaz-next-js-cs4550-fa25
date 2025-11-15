/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import * as client from "../../client";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ListGroup, ListGroupItem, FormControl } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import { 
  setModules,
  addModule, 
  deleteModule, 
  updateModule,
  editModule 
} from "./reducer"; 
import { useState, useEffect } from "react";

type Lesson = {
  _id: string;
  name: string;
};

type Module = {
  _id: string;
  name: string;
  course: string;
  editing?: boolean;
  lessons?: Lesson[];
};

export default function Modules() {
  const { cid } = useParams(); 
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: { modulesReducer: { modules: Module[] } }) => state.modulesReducer);
  const dispatch = useDispatch();

  const onUpdateModule = async (mod: Module) => {
    await client.updateModule(mod);
    const newModules = modules.map((m: Module) => m._id === mod._id ? mod : m );
    dispatch(setModules(newModules));
  };

  const fetchModules = async () => {
    const mods = await client.findModulesForCourse(cid as string);
    dispatch(setModules(mods));
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const onCreateModuleForCourse = async () => {
    if (!cid) return;
    const courseId = Array.isArray(cid) ? cid[0] : cid;
    const newMod = { name: moduleName, course: courseId };
    const createdModule = await client.createModuleForCourse(courseId, newMod);
    dispatch(setModules([...modules, createdModule]));
  };

  const onRemoveModule = async (moduleId: string) => {
    await client.deleteModule(moduleId);
    dispatch(setModules(modules.filter((m: Module) => m._id !== moduleId)));
  };

  return (
    <div className="wd-modules">
      <ModulesControls 
        moduleName={moduleName} 
        setModuleName={setModuleName}
        addModule={onCreateModuleForCourse}
      />
      <br /><br /><br /><br />
      <ListGroup className="rounded-0" id="wd-modules">
        {modules.map((mod: Module) => (
          <ListGroupItem
            key={mod._id}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" />
              {!mod.editing && mod.name}
              {mod.editing && (
                <FormControl 
                  className="w-50 d-inline-block"
                  onChange={(e) =>
                    dispatch(updateModule({ ...mod, name: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onUpdateModule({ ...mod, editing: false });
                    }
                  }}
                  defaultValue={mod.name}
                />
              )}
              <ModuleControlButtons 
                moduleId={mod._id}
                deleteModule={(moduleId) => onRemoveModule(moduleId)}
                editModule={(moduleId) => dispatch(editModule(moduleId))}
              />
            </div>
            {mod.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                {mod.lessons.map((lesson: Lesson) => (
                  <ListGroupItem
                    key={lesson._id}
                    className="wd-lesson p-3 ps-1"
                  >
                    <BsGripVertical className="me-2 fs-3" /> {lesson.name}{" "}
                    <LessonControlButtons />
                  </ListGroupItem>
                ))}
              </ListGroup>
            )}
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}
