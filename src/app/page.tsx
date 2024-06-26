"use client";
import { useEffect, useState } from "react";
import Container from "./components/atoms/Container";
import Input from "./components/atoms/Input";
import Wrapper from "./components/atoms/Wrapper";
import Button from "./components/atoms/Button";

export default function Home() {
  const [priorityMap, setPriorityMap] = useState<Record<number, TaskType[]>>(
    {}
  );
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const Priorities = [1, 2, 3, 4, 5, 6, 7];
  useEffect(() => {
    setPriorityMap(
      tasks.reduce((acc: typeof priorityMap, task: any) => {
        if (!acc?.[parseInt(task.priority)]) {
          acc[parseInt(task.priority)] = [];
        }
        acc[parseInt(task.priority)].push(task);
        return acc;
      }, {})
    );
  }, [tasks]);

  const UpdatePriority = (taskId: string, newPriorityId: number) => {
    setTasks((prev) => {
      const data = prev.map((task) => {
        if (task._id === taskId) {
          task.priority = newPriorityId;
        }
        return task;
      });
      return data;
    });

    fetch(`./api/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify({
        priority: newPriorityId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch("./api/tasks", {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((res) => {
            throw new Error(res.message);
          });
        }
        return res.json();
      })
      .then((res) => {
        setIsLoading(false);
        setTasks(res.data);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }, []);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [draggingTaskId, setDraggingTaskId] = useState<string>("");
  return (
    <>
      <Wrapper>
        <Container className="flex flex-col gap-10">
          {isLoading && <p>Loading....</p>}
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(7,1fr)`,
            }}
          >
            {Priorities.map((priorityValue: any) => (
              <PriorityCard
                key={priorityValue}
                priority={priorityValue}
                tasks={priorityMap?.[priorityValue] ?? []}
                UpdatePriority={UpdatePriority}
                draggingTaskId={draggingTaskId}
                setDraggingTaskId={setDraggingTaskId}
              />
            ))}
          </div>

          <Button
            onClick={() => {
              setIsAddTaskOpen(true);
            }}
            className="text-black"
          >
            Add New Task
          </Button>
        </Container>
      </Wrapper>
      {isAddTaskOpen && (
        <AddTask
          onClose={(data: TaskType | undefined) => {
            setIsAddTaskOpen(false);
            if (data) {
              setPriorityMap((prev) => {
                if (!prev?.[data.priority]) {
                  prev[data.priority] = [];
                }
                prev[data.priority].push(data);
                return prev;
              });
            }
          }}
        />
      )}
    </>
  );
}

const PriorityCard = ({
  tasks,
  priority,
  UpdatePriority,
  draggingTaskId,
  setDraggingTaskId,
}: {
  tasks: TaskType[];
  priority: number;
  UpdatePriority: (taskId: string, newPriorityId: number) => void;
  draggingTaskId: string;
  setDraggingTaskId: any;
}) => {
  return (
    <div
      id={`Priority-${priority}`}
      className="bg-gray-200 rounded-lg p-4 flex flex-col h-fit gap-3"
      onDrop={(e) => {
        e.preventDefault();
        UpdatePriority(draggingTaskId, priority);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
    >
      <p className="flex gap-2 items-end">
        Priority: <span className="text-2xl font-black">{priority}</span>
      </p>
      <div className="flex flex-col gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onDragStart={() => {
              setDraggingTaskId(task._id);
            }}
            onDragEnd={() => {
              setDraggingTaskId("");
            }}
            draggingTaskId={draggingTaskId}
          />
        ))}
      </div>
    </div>
  );
};

const TaskCard = ({
  task,
  onDragStart,
  onDragEnd,
  draggingTaskId,
}: {
  task: TaskType;
  onDragStart: any;
  onDragEnd: any;
  draggingTaskId: string;
}) => {
  return (
    <div
      id={task._id}
      className={`taskcard bg-white rounded-md p-3 ${
        draggingTaskId === task._id && "opacity-30"
      }`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <p>
        title: <span className="font-medium">{task.title}</span>
      </p>
      <p>
        description: <span className="font-medium">{task.description}</span>
      </p>
      <p>
        duration: <span className="font-medium">{task.duration} hrs</span>
      </p>
    </div>
  );
};

const AddTask = ({
  onClose,
}: {
  onClose: (data: TaskType | undefined) => void;
}) => {
  type InputType = {
    title: string;
    description: string;
    duration: number;
    priority: number;
  };
  const [data, setData] = useState<InputType>({
    description: "",
    duration: 0,
    priority: 1,
    title: "",
  });
  const [error, setError] = useState<Record<string, string>>({});

  const SetValue = (field: keyof InputType) => {
    return (value: any) => {
      setData((prev) => ({ ...prev, [field]: value } as any));
    };
  };

  const SetError = (field: keyof InputType) => {
    return (value: any) => {
      setError((prev) => ({ ...prev, [field]: value } as any));
    };
  };

  const HandlePost = async () => {
    let Correct = true;
    if (data.title.length < 3) {
      Correct = false;
      setError((prev) => ({ ...prev, title: "Atleast 3 characters" }));
    }

    if (data.description.length < 3) {
      Correct = false;
      setError((prev) => ({ ...prev, description: "Atleast 3 characters" }));
    }

    if (data.duration <= 0) {
      Correct = false;
      setError((prev) => ({ ...prev, duration: "Atleast 1 hr required" }));
    }

    if (data.priority <= 0 || data.priority > 7) {
      Correct = false;
      setError((prev) => ({
        ...prev,
        priority: "Priority Should be between 1 to 7",
      }));
    }
    if (!Correct) return;
    fetch("./api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((res) => {
            throw new Error(res.message);
          });
        }
        return res.json();
      })
      .then((res) => {
        onClose({
          ...data,
          created_at: new Date().getTime(),
          _id: res.data.insertedId,
        });
        setData({
          description: "",
          duration: 0,
          priority: 0,
          title: "",
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div
      className="fixed h-screen w-screen top-0 left-0 bg-gray-900/25 flex justify-center items-center"
      onClick={() => {
        onClose(undefined);
      }}
    >
      <Container
        onClick={(e: any) => {
          e.stopPropagation();
        }}
        className="bg-white rounded-lg p-4 !w-fit min-w-[500px]"
      >
        <div className="flex flex-col gap-4">
          <Input
            setValue={SetValue("title")}
            label="title"
            type="text"
            value={data["title"]}
            error={error?.["title"] ?? ""}
            setError={SetError("title")}
          />

          <Input
            setValue={SetValue("description")}
            label="description"
            type="text"
            value={data["description"]}
            error={error?.["description"] ?? ""}
            setError={SetError("description")}
          />

          <Input
            setValue={SetValue("duration")}
            label="duration"
            type="number"
            value={data["duration"]}
            error={error?.["duration"] ?? ""}
            setError={SetError("duration")}
          />

          <Input
            setValue={SetValue("priority")}
            label="priority"
            type="number"
            value={data["priority"]}
            error={error?.["priority"] ?? ""}
            setError={SetError("priority")}
          />
          <Button onClick={HandlePost} className="ml-auto">
            Add Task
          </Button>
        </div>
      </Container>
    </div>
  );
};
