
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Link, 
  QrCode, 
  Copy, 
  Trash2, 
  Download, 
  Search,
  Plus,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { createLink, fetchLinks, deleteLink, fetchSettings } from '@/lib/api';

interface FeedbackLink {
  id: string;
  customer_number: string;
  concern: string;
  first_name: string;
  last_name: string;
  feedback_url: string;
  qr_code_url: string;
  created_at: string;
  used: boolean;
}

const LinkGenerator = () => {
  const [customerNumber, setCustomerNumber] = useState('');
  const [concern, setConcern] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [links, setLinks] = useState<FeedbackLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [concernTypes, setConcernTypes] = useState<string[]>([
    'Internet-Freischaltung',
    'Störung',
    'Servicebesuch', 
    'Beratung',
    'Rechnung',
    'Kündigung',
    'Sonstiges'
  ]);

  useEffect(() => {
    loadLinks();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await fetchSettings();
      if (settings.concern_types) {
        setConcernTypes(settings.concern_types);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadLinks = async () => {
    try {
      const fetchedLinks = await fetchLinks();
      setLinks(fetchedLinks);
    } catch (error) {
      console.error('Error loading links:', error);
      toast.error('Fehler beim Laden der Links');
    }
  };

  const generateLink = async () => {
    if (!customerNumber.trim() || !concern || !firstName.trim() || !lastName.trim()) {
      toast.error('Bitte füllen Sie alle Felder aus');
      return;
    }

    setLoading(true);
    try {
      await createLink({
        customerNumber: customerNumber.trim(),
        concern,
        firstName: firstName.trim(),
        lastName: lastName.trim()
      });
      
      setCustomerNumber('');
      setConcern('');
      setFirstName('');
      setLastName('');
      
      await loadLinks();
      toast.success('Feedback-Link erfolgreich erstellt!');
    } catch (error: any) {
      console.error('Error creating link:', error);
      toast.error(error.message || 'Fehler beim Erstellen des Links');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Link in Zwischenablage kopiert!');
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Link löschen möchten?')) {
      return;
    }

    try {
      await deleteLink(id);
      await loadLinks();
      toast.success('Link erfolgreich gelöscht');
    } catch (error: any) {
      console.error('Error deleting link:', error);
      toast.error(error.message || 'Fehler beim Löschen des Links');
    }
  };

  const filteredLinks = links.filter(link => 
    link.customer_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.concern.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadQRCode = (qrCodeUrl: string, customerNumber: string) => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-code-${customerNumber}.png`;
    link.target = '_blank';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Link Generator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Neuen Feedback-Link erstellen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerNumber">Kundennummer</Label>
              <Input
                id="customerNumber"
                value={customerNumber}
                onChange={(e) => setCustomerNumber(e.target.value)}
                placeholder="z.B. 123456"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="concern">Anliegen</Label>
              <Select value={concern} onValueChange={setConcern}>
                <SelectTrigger>
                  <SelectValue placeholder="Anliegen auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {concernTypes.map((concernType) => (
                    <SelectItem key={concernType} value={concernType}>
                      {concernType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="firstName">Vorname</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Max"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Nachname</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Mustermann"
              />
            </div>
          </div>

          <Button 
            onClick={generateLink} 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Link wird erstellt...
              </div>
            ) : (
              <>
                <Link className="w-4 h-4 mr-2" />
                Feedback-Link erstellen
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Links List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Generierte Links ({links.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Links durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" onClick={loadLinks}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLinks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'Keine Links gefunden.' : 'Noch keine Links erstellt.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLinks.map((link) => (
                <div key={link.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {link.first_name} {link.last_name}
                        </h3>
                        <Badge variant="outline">
                          {link.customer_number}
                        </Badge>
                        <Badge variant={link.used ? "destructive" : "default"}>
                          {link.used ? 'Verwendet' : 'Aktiv'}
                        </Badge>
                        <Badge variant="secondary">
                          {link.concern}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                          {link.feedback_url}
                        </code>
                      </div>
                      
                      <p className="text-sm text-gray-500">
                        Erstellt: {new Date(link.created_at).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(link.feedback_url)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadQRCode(link.qr_code_url, link.customer_number)}
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(link.feedback_url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteLink(link.id)}
                        disabled={link.used}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            API-Dokumentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">POST /api/feedback-links</h4>
              <p className="text-sm text-gray-600 mb-2">Erstellt einen neuen Feedback-Link</p>
              <Textarea
                readOnly
                value={`{
  "customerNumber": "123456",
  "concern": "Internet-Freischaltung", 
  "firstName": "Max",
  "lastName": "Mustermann"
}`}
                className="font-mono text-sm"
                rows={7}
              />
            </div>
            
            <div>
              <h4 className="font-medium mb-2">GET /api/feedback-links</h4>
              <p className="text-sm text-gray-600">Ruft alle generierten Links ab</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkGenerator;
