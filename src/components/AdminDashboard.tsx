import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Download, 
  Search, 
  Filter,
  TrendingUp,
  Users,
  MessageSquare,
  Calendar,
  Link as LinkIcon,
  BarChart3,
  Settings
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import StarRating from './StarRating';
import LinkGenerator from './LinkGenerator';
import AdminSettings from './AdminSettings';
import { fetchFeedback } from '@/lib/api';

interface FeedbackItem {
  id: number;
  rating: number;
  comment: string;
  timestamp: string;
  customer: string;
}

const AdminDashboard = () => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchFeedback()
      .then(setFeedback)
      .catch(() => setFeedback([]));
  }, []);

  const filteredFeedback = useMemo(() => {
    return feedback.filter(item => {
      const matchesSearch = item.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.customer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRating = ratingFilter === 'all' || 
                           (ratingFilter === 'low' && item.rating <= 2) ||
                           (ratingFilter === 'medium' && item.rating === 3) ||
                           (ratingFilter === 'high' && item.rating >= 4) ||
                           item.rating.toString() === ratingFilter;

      const now = new Date();
      const itemDate = new Date(item.timestamp);
      const matchesDate = dateFilter === 'all' ||
                         (dateFilter === 'today' && itemDate.toDateString() === now.toDateString()) ||
                         (dateFilter === 'week' && now.getTime() - itemDate.getTime() <= 7 * 24 * 60 * 60 * 1000) ||
                         (dateFilter === 'month' && now.getTime() - itemDate.getTime() <= 30 * 24 * 60 * 60 * 1000);

      return matchesSearch && matchesRating && matchesDate;
    });
  }, [feedback, searchTerm, ratingFilter, dateFilter]);

  const stats = useMemo(() => {
    const total = feedback.length;
    const avgRating = total > 0 ? feedback.reduce((sum, item) => sum + item.rating, 0) / total : 0;
    
    const distribution = [1, 2, 3, 4, 5].map(rating => ({
      rating: `${rating} Stern${rating > 1 ? 'e' : ''}`,
      count: feedback.filter(item => item.rating === rating).length
    }));

    // Timeline data (last 7 days)
    const timeline = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayFeedback = feedback.filter(item => {
        const itemDate = new Date(item.timestamp);
        return itemDate.toDateString() === date.toDateString();
      });
      
      timeline.push({
        date: date.toLocaleDateString('de-DE', { weekday: 'short' }),
        count: dayFeedback.length,
        avgRating: dayFeedback.length > 0 ? 
          dayFeedback.reduce((sum, item) => sum + item.rating, 0) / dayFeedback.length : 0
      });
    }

    return { total, avgRating, distribution, timeline };
  }, [feedback]);

  const exportToCSV = () => {
    const headers = ['Datum', 'Kunde', 'Bewertung', 'Kommentar'];
    const csvData = filteredFeedback.map(item => [
      new Date(item.timestamp).toLocaleDateString('de-DE'),
      item.customer,
      item.rating.toString(),
      `"${item.comment.replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `feedback-export-${new Date().toLocaleDateString('de-DE')}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Feedback-Management & Link-Generator</p>
          </div>
          <Button onClick={exportToCSV} className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            CSV Export
          </Button>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Übersicht
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Link-Generator
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Bewertungen
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Einstellungen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Gesamt Bewertungen</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Durchschnitt</p>
                      <div className="flex items-center gap-2">
                        <p className="text-3xl font-bold text-gray-900">
                          {stats.avgRating.toFixed(1)}
                        </p>
                        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Mit Kommentar</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {feedback.filter(item => item.comment.trim()).length}
                      </p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Heute</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {feedback.filter(item => 
                          new Date(item.timestamp).toDateString() === new Date().toDateString()
                        ).length}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bewertungsverteilung</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.distribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rating" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Zeitverlauf (7 Tage)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.timeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        name="Anzahl Bewertungen"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="links">
            <LinkGenerator />
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter & Suche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Suche in Kommentaren..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Bewertung filtern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Bewertungen</SelectItem>
                      <SelectItem value="high">4-5 Sterne</SelectItem>
                      <SelectItem value="medium">3 Sterne</SelectItem>
                      <SelectItem value="low">1-2 Sterne</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Zeitraum filtern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Zeit</SelectItem>
                      <SelectItem value="today">Heute</SelectItem>
                      <SelectItem value="week">Letzte Woche</SelectItem>
                      <SelectItem value="month">Letzter Monat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Table */}
            <Card>
              <CardHeader>
                <CardTitle>Alle Bewertungen ({filteredFeedback.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFeedback.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Keine Bewertungen gefunden.
                    </p>
                  ) : (
                    filteredFeedback.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <StarRating rating={item.rating} onRatingChange={() => {}} readonly size={16} />
                              <Badge variant="outline" className="text-xs">
                                {item.customer}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(item.timestamp).toLocaleDateString('de-DE', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            {item.comment && (
                              <p className="text-gray-700 text-sm leading-relaxed">
                                "{item.comment}"
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
