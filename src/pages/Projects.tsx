
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { 
  Plus, 
  FolderOpen, 
  Calendar as CalendarIcon, 
  Users, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Pause, 
  X,
  FileText
} from "lucide-react";

interface Task {
  id: string;
  name: string;
  description: string;
  deadline: Date | null;
  status: "pending" | "in-progress" | "completed";
  estimatedHours: number;
  actualHours: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  status: "active" | "completed" | "on-hold" | "cancelled";
  startDate: Date;
  deadline: Date | null;
  totalBudget: number;
  totalSpent: number;
  tasks: Task[];
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Website Redesign",
      description: "Complete redesign of company website with modern UI/UX",
      client: "Acme Corp",
      status: "active",
      startDate: new Date("2024-01-15"),
      deadline: new Date("2024-03-15"),
      totalBudget: 15000,
      totalSpent: 8500,
      tasks: [
        {
          id: "t1",
          name: "Design Mockups",
          description: "Create wireframes and design mockups",
          deadline: new Date("2024-02-01"),
          status: "completed",
          estimatedHours: 40,
          actualHours: 38
        },
        {
          id: "t2",
          name: "Frontend Development",
          description: "Implement responsive frontend",
          deadline: new Date("2024-02-28"),
          status: "in-progress",
          estimatedHours: 80,
          actualHours: 45
        }
      ]
    }
  ]);

  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    client: "",
    deadline: null as Date | null,
    totalBudget: 0
  });
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    deadline: null as Date | null,
    estimatedHours: 0
  });

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.client) return;

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      client: newProject.client,
      status: "active",
      startDate: new Date(),
      deadline: newProject.deadline,
      totalBudget: newProject.totalBudget,
      totalSpent: 0,
      tasks: []
    };

    setProjects([...projects, project]);
    setNewProject({ name: "", description: "", client: "", deadline: null, totalBudget: 0 });
    setIsProjectDialogOpen(false);
  };

  const handleCreateTask = () => {
    if (!newTask.name || !selectedProject) return;

    const task: Task = {
      id: Date.now().toString(),
      name: newTask.name,
      description: newTask.description,
      deadline: newTask.deadline,
      status: "pending",
      estimatedHours: newTask.estimatedHours,
      actualHours: 0
    };

    setProjects(projects.map(project => 
      project.id === selectedProject 
        ? { ...project, tasks: [...project.tasks, task] }
        : project
    ));

    setNewTask({ name: "", description: "", deadline: null, estimatedHours: 0 });
    setIsTaskDialogOpen(false);
  };

  const updateTaskStatus = (projectId: string, taskId: string, status: Task["status"]) => {
    setProjects(projects.map(project => 
      project.id === projectId
        ? {
            ...project,
            tasks: project.tasks.map(task => 
              task.id === taskId ? { ...task, status } : task
            )
          }
        : project
    ));
  };

  const updateProjectStatus = (projectId: string, status: Project["status"]) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, status } : project
    ));
  };

  const convertToInvoice = (project: Project) => {
    console.log("Converting project to invoice:", project);
    // Here you would integrate with your invoice system
    alert(`Converting "${project.name}" to invoice with total cost: $${project.totalSpent}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "on-hold":
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">Manage your projects, tasks, and deadlines</p>
          </div>
          <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Project name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
                <Textarea
                  placeholder="Project description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
                <Input
                  placeholder="Client name"
                  value={newProject.client}
                  onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Total budget"
                  value={newProject.totalBudget || ""}
                  onChange={(e) => setNewProject({ ...newProject, totalBudget: Number(e.target.value) })}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newProject.deadline ? format(newProject.deadline, "PPP") : "Set deadline"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newProject.deadline || undefined}
                      onSelect={(date) => setNewProject({ ...newProject, deadline: date || null })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button onClick={handleCreateProject} className="w-full">
                  Create Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="bg-white border-b">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FolderOpen className="w-5 h-5 text-blue-600" />
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {project.client}
                      </div>
                      {project.deadline && (
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {format(project.deadline, "MMM dd, yyyy")}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${project.totalSpent} / ${project.totalBudget}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select onValueChange={(value: Project["status"]) => updateProjectStatus(project.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => convertToInvoice(project)}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      To Invoice
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Tasks</h3>
                  <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Task name"
                          value={newTask.name}
                          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                        />
                        <Textarea
                          placeholder="Task description"
                          value={newTask.description}
                          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        />
                        <Input
                          type="number"
                          placeholder="Estimated hours"
                          value={newTask.estimatedHours || ""}
                          onChange={(e) => setNewTask({ ...newTask, estimatedHours: Number(e.target.value) })}
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newTask.deadline ? format(newTask.deadline, "PPP") : "Set deadline"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={newTask.deadline || undefined}
                              onSelect={(date) => setNewTask({ ...newTask, deadline: date || null })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <Button onClick={handleCreateTask} className="w-full">
                          Add Task
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {project.tasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No tasks yet. Add your first task to get started.</p>
                ) : (
                  <div className="space-y-3">
                    {project.tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{task.name}</h4>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          <div className="flex gap-4 text-xs text-gray-500">
                            {task.deadline && (
                              <span>Due: {format(task.deadline, "MMM dd")}</span>
                            )}
                            <span>Est: {task.estimatedHours}h</span>
                            <span>Actual: {task.actualHours}h</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateTaskStatus(project.id, task.id, "pending")}
                            className="text-yellow-600 hover:text-yellow-700"
                          >
                            <Clock className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateTaskStatus(project.id, task.id, "in-progress")}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateTaskStatus(project.id, task.id, "completed")}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first project</p>
            <Button onClick={() => setIsProjectDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
