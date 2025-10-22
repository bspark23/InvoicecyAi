
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, DollarSign, FileText, Calendar, Trash2 } from "lucide-react";
import { useAuthLocal } from "@/hooks/useAuthLocal";
import { formatCurrency } from "@/utils/invoiceUtils";

interface Goal {
  id: string;
  title: string;
  type: 'revenue' | 'invoices';
  target: number;
  current: number;
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  currency?: string;
  createdAt: string;
  deadline: string;
}

interface GoalsTrackerProps {
  savedInvoices: any[];
}

const GoalsTracker: React.FC<GoalsTrackerProps> = ({ savedInvoices }) => {
  const { user } = useAuthLocal();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    type: 'revenue' as 'revenue' | 'invoices',
    target: 0,
    timeframe: 'month' as 'week' | 'month' | 'quarter' | 'year',
    currency: 'USD'
  });

  const GOALS_KEY = `goals-${user?.email || 'default'}`;

  useEffect(() => {
    const savedGoals = localStorage.getItem(GOALS_KEY);
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (error) {
        console.error('Error parsing saved goals:', error);
        setGoals([]);
      }
    }
  }, [GOALS_KEY]);

  useEffect(() => {
    if (goals.length > 0) {
      const updatedGoals = goals.map(goal => ({
        ...goal,
        current: calculateCurrentProgress(goal)
      }));
      
      localStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoals));
    }
  }, [savedInvoices, GOALS_KEY]);

  const calculateCurrentProgress = (goal: Goal) => {
    const now = new Date();
    
    let startDate = new Date();
    switch (goal.timeframe) {
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const relevantInvoices = savedInvoices.filter(invoice => {
      const invoiceDate = new Date(invoice.invoiceDate || invoice.date);
      return invoiceDate >= startDate && invoiceDate <= now;
    });

    if (goal.type === 'revenue') {
      return relevantInvoices
        .filter(invoice => invoice.status === 'paid')
        .reduce((sum, invoice) => {
          const subtotal = invoice.lineItems?.reduce((itemSum: number, item: any) => 
            itemSum + (item.quantity * item.rate), 0) || 0;
          const tax = subtotal * ((invoice.taxRate || 0) / 100);
          return sum + subtotal + tax;
        }, 0);
    } else {
      return relevantInvoices.length;
    }
  };

  const addGoal = () => {
    if (!newGoal.title.trim() || !newGoal.target || newGoal.target <= 0) {
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title.trim(),
      type: newGoal.type,
      target: newGoal.target,
      current: 0,
      timeframe: newGoal.timeframe,
      currency: newGoal.currency,
      createdAt: new Date().toISOString(),
      deadline: calculateDeadline(newGoal.timeframe)
    };

    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    localStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoals));

    // Reset form
    setNewGoal({
      title: '',
      type: 'revenue',
      target: 0,
      timeframe: 'month',
      currency: 'USD'
    });
    setIsDialogOpen(false);
  };

  const calculateDeadline = (timeframe: string) => {
    const now = new Date();
    switch (timeframe) {
      case 'week':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - now.getDay())).toISOString();
      case 'month':
        return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        return new Date(now.getFullYear(), (quarter + 1) * 3, 0).toISOString();
      case 'year':
        return new Date(now.getFullYear(), 11, 31).toISOString();
      default:
        return now.toISOString();
    }
  };

  const deleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    localStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoals));
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getTimeframeName = (timeframe: string) => {
    switch (timeframe) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'quarter': return 'This Quarter';
      case 'year': return 'This Year';
      default: return timeframe;
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Invoice Goals
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Set New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  placeholder="e.g., Earn $5,000 this month"
                />
              </div>
              
              <div>
                <Label htmlFor="type">Goal Type</Label>
                <Select value={newGoal.type} onValueChange={(value: 'revenue' | 'invoices') => 
                  setNewGoal({...newGoal, type: value})
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue Goal</SelectItem>
                    <SelectItem value="invoices">Invoice Count Goal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="target">Target Amount/Count</Label>
                <Input
                  id="target"
                  type="number"
                  min="1"
                  value={newGoal.target || ''}
                  onChange={(e) => setNewGoal({...newGoal, target: Number(e.target.value)})}
                  placeholder={newGoal.type === 'revenue' ? '5000' : '10'}
                />
              </div>

              {newGoal.type === 'revenue' && (
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={newGoal.currency} onValueChange={(value) => 
                    setNewGoal({...newGoal, currency: value})
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="NGN">NGN (₦)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                      <SelectItem value="AUD">AUD (A$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select value={newGoal.timeframe} onValueChange={(value: 'week' | 'month' | 'quarter' | 'year') => 
                  setNewGoal({...newGoal, timeframe: value})
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addGoal} disabled={!newGoal.title.trim() || !newGoal.target || newGoal.target <= 0}>
                  Add Goal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No goals set yet. Create your first goal to track progress!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = getProgressPercentage(goal);
              const isCompleted = progress >= 100;
              
              return (
                <div key={goal.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {goal.title}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          {goal.type === 'revenue' ? <DollarSign className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                          {getTimeframeName(goal.timeframe)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due: {new Date(goal.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {goal.type === 'revenue' ? formatCurrency(goal.current, goal.currency) : `${goal.current} invoices`}
                      </span>
                      <span className="font-medium">
                        {goal.type === 'revenue' ? formatCurrency(goal.target, goal.currency) : `${goal.target} invoices`}
                      </span>
                    </div>
                    <Progress 
                      value={progress} 
                      className={`h-2 ${isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{progress.toFixed(1)}% completed</span>
                      {isCompleted && (
                        <span className="text-green-600 font-medium">🎉 Completed!</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsTracker;
