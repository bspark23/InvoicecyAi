
import React, { useState, useEffect, useRef } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import NewDashboardSidebar from "@/components/NewDashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, Search, Edit, Trash2, Play, Pause, Square, 
  Clock, Calendar, DollarSign, FileText, RefreshCw
} from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useAuthLocal } from "@/hooks/useAuthLocal";
import { formatCurrency } from "@/utils/invoiceUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type TimeEntry = {
  id: string;
  taskName: string;
  clientName: string;
  projectName: string;
  description: string;
  startTime: string;
  endTime?: string;
  duration: number; // in seconds
  hourlyRate: number;
  isRunning: boolean;
  date: string;
  createdAt: string;
};

const LOCAL_STORAGE_KEY = "invoicecraft-time-entries-v1";

const TimeTracking: React.FC = () => {
  const { user } = useAuthLocal();
  const { toast } = useToast();
  const { clients } = useClients(null, user?.email || user?.profileName);
  
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isTimerDialogOpen, setIsTimerDialogOpen] = useState(false);
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [timerForm, setTimerForm] = useState({
    taskName: '',
    clientName: '',
    projectName: '',
    description: '',
    hourlyRate: 50
  });

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const entries = JSON.parse(saved);
        setTimeEntries(entries);
        
        // Check for any running timer
        const runningEntry = entries.find((entry: TimeEntry) => entry.isRunning);
        if (runningEntry) {
          setActiveTimer(runningEntry);
          const elapsed = Math.floor((Date.now() - new Date(runningEntry.startTime).getTime()) / 1000);
          setCurrentTime(elapsed);
        }
      } catch {
        setTimeEntries([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(timeEntries));
  }, [timeEntries]);

  useEffect(() => {
    if (activeTimer && activeTimer.isRunning) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeTimer]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredEntries = timeEntries.filter(entry =>
    entry.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedEntries = timeEntries.filter(entry => !entry.isRunning);
  const totalHours = completedEntries.reduce((sum, entry) => sum + entry.duration, 0) / 3600;
  const totalEarnings = completedEntries.reduce((sum, entry) => sum + (entry.duration / 3600) * entry.hourlyRate, 0);

  const handleStartTimer = () => {
    if (!timerForm.taskName || !timerForm.clientName) {
      toast({
        title: "Error",
        description: "Please fill in task name and client name.",
        variant: "destructive"
      });
      return;
    }

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      taskName: timerForm.taskName,
      clientName: timerForm.clientName,
      projectName: timerForm.projectName,
      description: timerForm.description,
      startTime: new Date().toISOString(),
      duration: 0,
      hourlyRate: timerForm.hourlyRate,
      isRunning: true,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    setTimeEntries(prev => [...prev, newEntry]);
    setActiveTimer(newEntry);
    setCurrentTime(0);
    setIsTimerDialogOpen(false);
    
    // Reset form
    setTimerForm({
      taskName: '',
      clientName: '',
      projectName: '',
      description: '',
      hourlyRate: 50
    });

    toast({
      title: "Timer Started",
      description: `Started tracking time for ${newEntry.taskName}`
    });
  };

  const handlePauseTimer = () => {
    if (!activeTimer) return;

    const updatedEntry = {
      ...activeTimer,
      duration: currentTime,
      isRunning: false,
      endTime: new Date().toISOString()
    };

    setTimeEntries(prev => prev.map(entry => 
      entry.id === activeTimer.id ? updatedEntry : entry
    ));
    setActiveTimer(null);
    setCurrentTime(0);

    toast({
      title: "Timer Paused",
      description: `Paused timer for ${updatedEntry.taskName}`
    });
  };

  const handleStopTimer = () => {
    if (!activeTimer) return;

    const updatedEntry = {
      ...activeTimer,
      duration: currentTime,
      isRunning: false,
      endTime: new Date().toISOString()
    };

    setTimeEntries(prev => prev.map(entry => 
      entry.id === activeTimer.id ? updatedEntry : entry
    ));
    setActiveTimer(null);
    setCurrentTime(0);

    toast({
      title: "Timer Stopped",
      description: `Stopped timer for ${updatedEntry.taskName}. Duration: ${formatTime(currentTime)}`
    });
  };

  const handleResumeTimer = (entry: TimeEntry) => {
    const resumedEntry = {
      ...entry,
      isRunning: true,
      startTime: new Date().toISOString()
    };

    setTimeEntries(prev => prev.map(e => e.id === entry.id ? resumedEntry : e));
    setActiveTimer(resumedEntry);
    setCurrentTime(entry.duration);

    toast({
      title: "Timer Resumed",
      description: `Resumed timer for ${entry.taskName}`
    });
  };

  const handleDeleteEntry = (entryId: string) => {
    setTimeEntries(prev => prev.filter(entry => entry.id !== entryId));
    if (activeTimer && activeTimer.id === entryId) {
      setActiveTimer(null);
      setCurrentTime(0);
    }
    toast({
      title: "Success",
      description: "Time entry deleted successfully"
    });
  };

  const convertToInvoiceItem = (entry: TimeEntry) => {
    const hours = entry.duration / 3600;
    const amount = hours * entry.hourlyRate;
    
    toast({
      title: "Convert to Invoice",
      description: `This would add "${entry.taskName}" (${hours.toFixed(2)} hours × ${formatCurrency(entry.hourlyRate)}) as an invoice line item.`
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <NewDashboardSidebar />
        <div className="flex-1">
          <div className="p-4 border-b bg-white">
            <SidebarTrigger />
          </div>
          
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Time Tracking</h1>
                <p className="text-gray-600">Track time spent on tasks and projects.</p>
              </div>
              <div className="flex gap-2">
                {activeTimer ? (
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg font-mono text-lg">
                      {formatTime(currentTime)}
                    </div>
                    <Button variant="outline" onClick={handlePauseTimer}>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                    <Button variant="outline" onClick={handleStopTimer}>
                      <Square className="w-4 h-4 mr-2" />
                      Stop
                    </Button>
                  </div>
                ) : (
                  <Dialog open={isTimerDialogOpen} onOpenChange={setIsTimerDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Play className="w-4 h-4 mr-2" />
                        Start Timer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Start New Timer</DialogTitle>
                        <DialogDescription>
                          Fill in the details to start tracking time
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div>
                          <Label htmlFor="taskName">Task Name *</Label>
                          <Input
                            id="taskName"
                            value={timerForm.taskName}
                            onChange={(e) => setTimerForm(prev => ({ ...prev, taskName: e.target.value }))}
                            placeholder="e.g., Website development"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="clientSelect">Client *</Label>
                          <Select onValueChange={(value) => setTimerForm(prev => ({ ...prev, clientName: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select client" />
                            </SelectTrigger>
                            <SelectContent>
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.name}>
                                  {client.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="projectName">Project Name</Label>
                          <Input
                            id="projectName"
                            value={timerForm.projectName}
                            onChange={(e) => setTimerForm(prev => ({ ...prev, projectName: e.target.value }))}
                            placeholder="e.g., E-commerce platform"
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={timerForm.description}
                            onChange={(e) => setTimerForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Optional task description"
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                          <Input
                            id="hourlyRate"
                            type="number"
                            value={timerForm.hourlyRate}
                            onChange={(e) => setTimerForm(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTimerDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleStartTimer} className="bg-green-600 hover:bg-green-700">
                          <Play className="w-4 h-4 mr-2" />
                          Start Timer
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            {/* Current Timer Display */}
            {activeTimer && (
              <Card className="mb-6 border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <h3 className="font-semibold text-green-800">{activeTimer.taskName}</h3>
                        <p className="text-green-600">{activeTimer.clientName} • {activeTimer.projectName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-mono font-bold text-green-800">
                        {formatTime(currentTime)}
                      </div>
                      <p className="text-sm text-green-600">
                        Earnings: {formatCurrency((currentTime / 3600) * activeTimer.hourlyRate)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Hours</p>
                      <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}</p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(totalEarnings)}</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Time Entries</p>
                      <p className="text-2xl font-bold text-gray-900">{completedEntries.length}</p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {completedEntries.length > 0 
                          ? formatCurrency(completedEntries.reduce((sum, entry) => sum + entry.hourlyRate, 0) / completedEntries.length)
                          : formatCurrency(0)
                        }
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-yellow-100">
                      <Calendar className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search time entries by task, client, or project..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Time Entries Table */}
            <Card>
              <CardHeader>
                <CardTitle>Time Entries ({filteredEntries.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredEntries.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm ? "No time entries found" : "No time entries yet"}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm 
                        ? "Try adjusting your search terms" 
                        : "Start your first timer to begin tracking time"
                      }
                    </p>
                    {!searchTerm && !activeTimer && (
                      <Button onClick={() => setIsTimerDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                        <Play className="w-4 h-4 mr-2" />
                        Start Your First Timer
                      </Button>
                    )}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Earnings</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">
                            <div>
                              <p>{entry.taskName}</p>
                              {entry.description && (
                                <p className="text-sm text-gray-500">{entry.description}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{entry.clientName}</TableCell>
                          <TableCell>{entry.projectName || '-'}</TableCell>
                          <TableCell>
                            {new Date(entry.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-mono">
                            {formatTime(entry.duration)}
                          </TableCell>
                          <TableCell>{formatCurrency(entry.hourlyRate)}/hr</TableCell>
                          <TableCell className="font-semibold text-green-600">
                            {formatCurrency((entry.duration / 3600) * entry.hourlyRate)}
                          </TableCell>
                          <TableCell>
                            {entry.isRunning ? (
                              <Badge className="bg-green-100 text-green-800">Running</Badge>
                            ) : (
                              <Badge variant="secondary">Completed</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              {!entry.isRunning && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleResumeTimer(entry)}
                                    title="Resume Timer"
                                    disabled={!!activeTimer}
                                  >
                                    <Play className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => convertToInvoiceItem(entry)}
                                    title="Convert to Invoice Item"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" title="Delete">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Time Entry</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this time entry? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteEntry(entry.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TimeTracking;
