
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LPOData, LPOLineItem, CreateLPOData } from '@/types/lpo';

export const useLPOData = (userId?: string) => {
  const [lpos, setLpos] = useState<LPOData[]>([]);
  const [currentLPO, setCurrentLPO] = useState<LPOData | null>(null);

  // Load LPOs from localStorage on mount
  useEffect(() => {
    const savedLPOs = localStorage.getItem(`lpos_${userId || 'default'}`);
    if (savedLPOs) {
      setLpos(JSON.parse(savedLPOs));
    }
  }, [userId]);

  // Save LPOs to localStorage whenever lpos change
  useEffect(() => {
    localStorage.setItem(`lpos_${userId || 'default'}`, JSON.stringify(lpos));
  }, [lpos, userId]);

  const generateLPONumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `LPO-${timestamp}`;
  };

  const calculateLineItemTotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const calculateSubtotal = (lineItems: LPOLineItem[]) => {
    return lineItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTaxAmount = (subtotal: number, taxRate: number) => {
    return subtotal * (taxRate / 100);
  };

  const calculateTotal = (subtotal: number, taxAmount: number) => {
    return subtotal + taxAmount;
  };

  const createLPO = (data: CreateLPOData): LPOData => {
    const subtotal = calculateSubtotal(data.lineItems);
    const taxAmount = calculateTaxAmount(subtotal, data.taxRate);
    const totalAmount = calculateTotal(subtotal, taxAmount);

    const newLPO: LPOData = {
      id: uuidv4(),
      lpoNumber: generateLPONumber(),
      ...data,
      subtotal,
      taxAmount,
      totalAmount,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId || 'default',
    };

    return newLPO;
  };

  const saveLPO = (lpoData: CreateLPOData) => {
    const newLPO = createLPO(lpoData);
    setLpos(prev => [newLPO, ...prev]);
    return newLPO;
  };

  const updateLPO = (id: string, updates: Partial<LPOData>) => {
    setLpos(prev => prev.map(lpo => 
      lpo.id === id 
        ? { ...lpo, ...updates, updatedAt: new Date().toISOString() }
        : lpo
    ));
  };

  const deleteLPO = (id: string) => {
    setLpos(prev => prev.filter(lpo => lpo.id !== id));
  };

  const getLPOById = (id: string) => {
    return lpos.find(lpo => lpo.id === id) || null;
  };

  const updateLPOStatus = (id: string, status: LPOData['status']) => {
    updateLPO(id, { status });
  };

  const addLineItem = (lpo: LPOData): LPOLineItem => {
    const newItem: LPOLineItem = {
      id: uuidv4(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    return newItem;
  };

  return {
    lpos,
    currentLPO,
    setCurrentLPO,
    saveLPO,
    updateLPO,
    deleteLPO,
    getLPOById,
    updateLPOStatus,
    generateLPONumber,
    addLineItem,
    calculateLineItemTotal,
    calculateSubtotal,
    calculateTaxAmount,
    calculateTotal,
  };
};
