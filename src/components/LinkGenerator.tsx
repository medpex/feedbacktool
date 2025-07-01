import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Download, Plus, Code, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { createLink, fetchLinks, deleteLink } from '@/lib/api';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLinks, setGeneratedLinks] = useState<FeedbackLink[]>([]);
  const [showApiDocs, setShowApiDocs] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load existing links from API
  React.useEffect(() => {
    fetchLinks()
      .then(links => {
        setGeneratedLinks(links);
      })
      .catch(error => {
        console.error('Error loading links:', error);
        setGeneratedLinks([]);
        toast({
          title: "Fehler beim Laden",
          description: `Konnte Links nicht laden: ${error.message}`,
          variant: "destructive",
        });
      });
  }, []);

  const getConcernText = (concern: string): string => {
    const concernTexts: Record<string, string> = {
      'Internet-Freischaltung': 'Kürzlich wurde Ihr Internet freigeschaltet. Wie war Ihre Erfahrung mit unserem Service?',
      'Störung': 'Wir haben Ihre gemeldete Störung bearbeitet. Wie zufrieden sind Sie mit der Lösung?',
      'Servicebesuch': 'Unser Techniker war bei Ihnen vor Ort. Wie bewerten Sie den Servicebesuch?',
      'Beratung': 'Sie haben eine Beratung bei uns erhalten. Wie hilfreich war unser Beratungsgespräch?',
      'Rechnung': 'Bezüglich Ihrer Rechnungsanfrage: Wie zufrieden sind Sie mit der Bearbeitung?',
      'Kündigung': 'Ihre Kündigung wurde bearbeitet. Wie bewerten Sie unseren Kündigungsprozess?',
      'Sonstiges': 'Wie war Ihre Erfahrung mit unserem Service?'
    };
    return concernTexts[concern] || 'Wie war Ihre Erfahrung mit unserem Service?';
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerNumber || !concern || !firstName || !lastName) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Felder aus.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      await createLink({
        customerNumber,
        concern,
        firstName,
        lastName
      });
      
      // Reload all links to get the updated list
      const links = await fetchLinks();
      setGeneratedLinks(links);
      
      // Clear form
      setCustomerNumber('');
      setConcern('');
      setFirstName('');
      setLastName('');
      
      toast({
        title: "Link generiert",
        description: "Feedback-Link und QR-Code wurden erfolgreich erstellt.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: `Beim Generieren des Links ist ein Fehler aufgetreten: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deletingId) return;
    
    if (!window.confirm('Diesen Link wirklich löschen?')) {
      return;
    }
    
    setDeletingId(id);
    
    try {
      await deleteLink(id);
      
      // Reload links after successful deletion
      const links = await fetchLinks();
      setGeneratedLinks(links);
      
      toast({
        title: "Link gelöscht",
        description: "Der Feedback-Link wurde erfolgreich gelöscht.",
      });
    } catch (error) {
      toast({
        title: "Fehler beim Löschen",
        description: error instanceof Error ? error.message : "Beim Löschen des Links ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        toast({
          title: "Kopiert",
          description: "Link wurde in die Zwischenablage kopiert.",
        });
      }).catch(() => {
        toast({
          title: "Fehler",
          description: "Kopieren in die Zwischenablage nicht möglich.",
          variant: "destructive",
        });
      });
    } else {
      // Fallback für unsichere Kontexte
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        toast({
          title: "Kopiert",
          description: "Link wurde in die Zwischenablage kopiert.",
        });
      } catch {
        toast({
          title: "Fehler",
          description: "Kopieren in die Zwischenablage nicht möglich.",
          variant: "destructive",
        });
      }
    }
  };

  const downloadQRCode = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr-code-${filename}.png`;
    link.click();
  };

  const concernOptions = [
    'Internet-Freischaltung',
    'Störung',
    'Servicebesuch',
    'Beratung',
    'Rechnung',
    'Kündigung',
    'Sonstiges'
  ];

  return (
    <div className="space-y-6">
      {/* API Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            API-Dokumentation für n8n Integration
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApiDocs(!showApiDocs)}
            >
              {showApiDocs ? 'Ausblenden' : 'Anzeigen'}
            </Button>
          </CardTitle>
        </CardHeader>
        {showApiDocs && (
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">POST /api/feedback-links</h4>
              <p className="text-sm text-gray-600 mb-2">Erstellt einen neuen Feedback-Link</p>
              <div className="bg-white p-3 rounded border">
                <pre className="text-xs overflow-x-auto">
{`{
  "customerNumber": "K-12345",
  "firstName": "Max",
  "lastName": "Mustermann",
  "concern": "Internet-Freischaltung"
}`}
                </pre>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">n8n Workflow Beispiel</h4>
              <p className="text-sm text-gray-600 mb-2">1. HTTP Request Node konfigurieren:</p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Method: POST</li>
                <li>URL: https://ihre-domain.com/api/feedback-links</li>
                <li>Headers: Content-Type: application/json</li>
                <li>Body: JSON mit customerNumber, firstName, lastName, concern</li>
              </ul>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Generator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Neuen Feedback-Link generieren
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerNumber">Kundennummer *</Label>
                <Input
                  id="customerNumber"
                  value={customerNumber}
                  onChange={(e) => setCustomerNumber(e.target.value)}
                  placeholder="z.B. K-12345"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="concern">Anliegen *</Label>
                <Select value={concern} onValueChange={setConcern} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Anliegen auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {concernOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="firstName">Vorname *</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Max"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname *</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Mustermann"
                  required
                />
              </div>
            </div>

            {/* Preview des Bewertungstexts */}
            {concern && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-blue-900">Vorschau Bewertungstext:</Label>
                <p className="text-sm text-blue-800 mt-1">{getConcernText(concern)}</p>
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={isGenerating}
              className="w-full md:w-auto"
            >
              {isGenerating ? 'Generiere...' : 'Link & QR-Code generieren'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Generated Links */}
      {generatedLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generierte Links ({generatedLinks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedLinks.map((link) => (
                <div key={link.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {link.first_name} {link.last_name} - {link.customer_number}
                      </h4>
                      <p className="text-sm text-gray-600">{link.concern}</p>
                      <p className="text-xs text-gray-500">
                        Erstellt: {new Date(link.created_at).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        link.used ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {link.used ? 'Verwendet' : 'Offen'}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(link.id)}
                        disabled={deletingId === link.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deletingId === link.id ? 'Lösche...' : 'Löschen'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Feedback-Link</Label>
                      <div className="flex gap-2">
                        <Input 
                          value={link.feedback_url} 
                          readOnly 
                          className="text-sm"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(link.feedback_url)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">QR-Code</Label>
                      <div className="flex items-center gap-2">
                        <img 
                          src={link.qr_code_url} 
                          alt="QR Code" 
                          className="w-12 h-12 border rounded"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadQRCode(link.qr_code_url, `${link.customer_number}-${link.id}`)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LinkGenerator;
