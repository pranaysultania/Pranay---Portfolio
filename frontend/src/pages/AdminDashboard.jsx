import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowLeft,
  BookOpen,
  User,
  Camera,
  Calendar,
  Tags
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockReflections } from "../mock";
import { useToast } from "../hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reflections, setReflections] = useState(mockReflections);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "blog",
    tags: ""
  });

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "blog",
      tags: ""
    });
  };

  const handleCreate = () => {
    const newReflection = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString().split('T')[0],
      readTime: `${Math.ceil(formData.content.split(' ').length / 200)} min read`,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    setReflections(prev => [newReflection, ...prev]);
    setShowCreateDialog(false);
    resetForm();
    toast({
      title: "Reflection created!",
      description: "Your new reflection has been published successfully.",
    });
  };

  const handleEdit = (reflection) => {
    setSelectedReflection(reflection);
    setFormData({
      title: reflection.title,
      excerpt: reflection.excerpt,
      content: reflection.content,
      category: reflection.category,
      tags: reflection.tags.join(', ')
    });
    setIsEditing(true);
  };

  const handleUpdate = () => {
    const updatedReflection = {
      ...selectedReflection,
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    setReflections(prev => 
      prev.map(r => r.id === selectedReflection.id ? updatedReflection : r)
    );
    setIsEditing(false);
    setSelectedReflection(null);
    resetForm();
    toast({
      title: "Reflection updated!",
      description: "Your reflection has been updated successfully.",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this reflection?")) {
      setReflections(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Reflection deleted!",
        description: "The reflection has been removed successfully.",
        variant: "destructive"
      });
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'journal': return <BookOpen className="h-4 w-4" />;
      case 'blog': return <User className="h-4 w-4" />;
      case 'artwork': return <Camera className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'journal': return 'bg-[#FFD447]/20 text-[#007C91]';
      case 'blog': return 'bg-[#8FCB9B]/20 text-[#007C91]';
      case 'artwork': return 'bg-[#007C91]/20 text-[#007C91]';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Site
              </Button>
              <div className="h-6 border-l border-gray-300" />
              <h1 className="font-serif text-xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#007C91] hover:bg-[#007C91]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  New Reflection
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Reflection</DialogTitle>
                  <DialogDescription>
                    Share your thoughts, insights, or creative work with your audience.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleFormChange("title", e.target.value)}
                      placeholder="Enter title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <Select value={formData.category} onValueChange={(value) => handleFormChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Blog</SelectItem>
                        <SelectItem value="journal">Journal</SelectItem>
                        <SelectItem value="artwork">Artwork</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) => handleFormChange("excerpt", e.target.value)}
                      placeholder="Brief description..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => handleFormChange("content", e.target.value)}
                      placeholder="Write your reflection..."
                      rows={8}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => handleFormChange("tags", e.target.value)}
                      placeholder="reflection, growth, mindfulness"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreate} className="bg-[#007C91] hover:bg-[#007C91]/90">
                      Publish Reflection
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reflections</p>
                  <p className="text-2xl font-bold text-gray-900">{reflections.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-[#007C91]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Blog Posts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reflections.filter(r => r.category === 'blog').length}
                  </p>
                </div>
                <User className="h-8 w-8 text-[#8FCB9B]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Journal Entries</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reflections.filter(r => r.category === 'journal').length}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-[#FFD447]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Artwork Pieces</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reflections.filter(r => r.category === 'artwork').length}
                  </p>
                </div>
                <Camera className="h-8 w-8 text-[#007C91]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reflections List */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Reflections</CardTitle>
            <CardDescription>
              View, edit, or delete your published reflections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reflections.map((reflection) => (
                <div key={reflection.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getCategoryColor(reflection.category)}>
                          {getCategoryIcon(reflection.category)}
                          <span className="ml-1 capitalize">{reflection.category}</span>
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {reflection.date}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reflection.readTime}
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {reflection.title}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {reflection.excerpt}
                      </p>
                      <div className="flex items-center gap-2">
                        <Tags className="h-4 w-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {reflection.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {/* Preview functionality */}}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(reflection)}
                        className="text-[#007C91] hover:bg-[#007C91]/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(reflection.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Reflection</DialogTitle>
            <DialogDescription>
              Make changes to your reflection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => handleFormChange("title", e.target.value)}
                placeholder="Enter title..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Select value={formData.category} onValueChange={(value) => handleFormChange("category", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="journal">Journal</SelectItem>
                  <SelectItem value="artwork">Artwork</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => handleFormChange("excerpt", e.target.value)}
                placeholder="Brief description..."
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => handleFormChange("content", e.target.value)}
                placeholder="Write your reflection..."
                rows={8}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <Input
                value={formData.tags}
                onChange={(e) => handleFormChange("tags", e.target.value)}
                placeholder="reflection, growth, mindfulness"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} className="bg-[#007C91] hover:bg-[#007C91]/90">
                Update Reflection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;