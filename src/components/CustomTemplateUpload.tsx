import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Save, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CustomTemplate } from "@/types/invoice";

interface CustomTemplateUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Omit<CustomTemplate, 'id' | 'createdAt' | 'userId'>) => void;
  customTemplates: CustomTemplate[];
  onDelete: (templateId: string) => void;
  onSelect: (templateId: string) => void;
}

const CustomTemplateUpload: React.FC<CustomTemplateUploadProps> = ({
  isOpen,
  onClose,
  onSave,
  customTemplates,
  onDelete,
  onSelect
}) => {
  const [templateName, setTemplateName] = useState("");
  const [templateType, setTemplateType] = useState<'html' | 'image'>('image');
  const [htmlContent, setHtmlContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (PNG, JPG, etc.)",
          variant: "destructive"
        });
      }
    }
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      toast({
        title: "Template name required",
        description: "Please enter a name for your template",
        variant: "destructive"
      });
      return;
    }

    let content = "";
    if (templateType === 'image' && imagePreview) {
      content = imagePreview;
    } else if (templateType === 'html' && htmlContent.trim()) {
      content = htmlContent;
    } else {
      toast({
        title: "Template content required",
        description: "Please provide template content",
        variant: "destructive"
      });
      return;
    }

    onSave({
      name: templateName,
      content,
      type: templateType
    });

    // Reset form
    setTemplateName("");
    setHtmlContent("");
    setImageFile(null);
    setImagePreview(null);
    
    toast({
      title: "Template saved",
      description: "Your custom template has been saved successfully"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Custom Templates</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Existing Custom Templates */}
          {customTemplates.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Your Custom Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{template.name}</h4>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSelect(template.id)}
                            title="Use this template"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(template.id)}
                            title="Delete template"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Type: {template.type === 'image' ? 'Image Template' : 'HTML Template'}
                      </p>
                      {template.type === 'image' && (
                        <div className="bg-gray-100 rounded p-2">
                          <img 
                            src={template.content} 
                            alt={template.name}
                            className="w-full h-24 object-cover rounded"
                          />
                        </div>
                      )}
                      {template.type === 'html' && (
                        <div className="bg-gray-100 rounded p-2 text-xs text-gray-700 max-h-20 overflow-hidden">
                          {template.content.substring(0, 100)}...
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Template */}
          <Card>
            <CardHeader>
              <CardTitle>Upload New Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter template name"
                />
              </div>

              <div>
                <Label>Template Type</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="image"
                      checked={templateType === 'image'}
                      onChange={(e) => setTemplateType(e.target.value as 'image')}
                    />
                    <span>Image Template</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="html"
                      checked={templateType === 'html'}
                      onChange={(e) => setTemplateType(e.target.value as 'html')}
                    />
                    <span>HTML Template</span>
                  </label>
                </div>
              </div>

              {templateType === 'image' && (
                <div>
                  <Label htmlFor="imageUpload">Upload Image Template</Label>
                  <div className="mt-2">
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('imageUpload')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                  </div>
                  {imagePreview && (
                    <div className="mt-4">
                      <img 
                        src={imagePreview} 
                        alt="Template preview" 
                        className="max-w-full h-48 object-contain border rounded"
                      />
                    </div>
                  )}
                </div>
              )}

              {templateType === 'html' && (
                <div>
                  <Label htmlFor="htmlContent">HTML Template Content</Label>
                  <Textarea
                    id="htmlContent"
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    placeholder="Enter your HTML template code here..."
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    You can use HTML and inline CSS. Use template variables like {"{"}{"{"} clientName {"}"}{"}"}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomTemplateUpload;
